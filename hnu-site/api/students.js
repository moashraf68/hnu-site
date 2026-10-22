const { getDb } = require('./db')

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const sql = getDb()

  try {
    if (req.method === 'GET') {
      const result = await sql`
        SELECT u.id, u.national_id, u.full_name, u.email, u.phone, u.college, u.academic_year,
               u.committee_id, u.role, u.status, u.profile_photo, u.created_at,
               COALESCE((SELECT score FROM evaluations WHERE student_id = u.id ORDER BY created_at DESC LIMIT 1), 0) as score,
               (SELECT notes FROM evaluations WHERE student_id = u.id ORDER BY created_at DESC LIMIT 1) as notes
        FROM users u
        ORDER BY u.created_at DESC
      `

      const superNid = (process.env.SUPER_ADMIN_NID || '').trim()
      const students = result.rows.map(r => {
        const isSuper = (r.role === 'SUPER_ADMIN' || (superNid && r.national_id === superNid))
        return {
          id: r.id,
          nid: r.national_id,
          name: r.full_name,
          email: r.email,
          phone: r.phone,
          college: r.college,
          year: r.academic_year,
          com: r.committee_id,
          role: isSuper ? 'SUPER_ADMIN' : (r.role === 'ADMIN' ? 'ADMIN' : 'STUDENT'),
          isSuperAdmin: isSuper,
          status: r.status === 'ACTIVE' ? 'نشط' : 'غير نشط',
          photo: r.profile_photo || '/assets/images/logo.png',
          title: isSuper ? 'المشرف العام (Super Admin)' : (r.role === 'ADMIN' ? 'أدمن' : 'عضو بالأسرة'),
          score: Number(r.score) || 0,
          notes: r.notes || '',
          createdAt: r.created_at ? new Date(r.created_at).toISOString().slice(0, 10) : '2026-01-01'
        }
      })

      return res.status(200).json({ success: true, students })
    }

    if (req.method === 'PATCH' || req.method === 'POST') {
      const { id, role, score, notes, photo, phone, email, requesterId, requesterNid } = req.body || {}

      if (!id) {
        return res.status(400).json({ success: false, error: 'معرف المستخدم مطلوب.' })
      }

      const superNid = (process.env.SUPER_ADMIN_NID || '').trim()

      // If updating role (promote to ADMIN / demote to STUDENT), strictly verify requester is Super Admin
      if (role) {
        let isRequesterSuper = false
        if (requesterId || requesterNid) {
          const reqCheck = await sql`
            SELECT id, role, national_id FROM users
            WHERE (id::text = ${requesterId || ''} OR national_id = ${requesterNid || ''})
            LIMIT 1
          `
          if (reqCheck.rows.length > 0) {
            const reqUser = reqCheck.rows[0]
            isRequesterSuper = (reqUser.role === 'SUPER_ADMIN' || (superNid && reqUser.national_id === superNid))
          }
        }

        if (!isRequesterSuper) {
          return res.status(403).json({
            success: false,
            error: 'عذراً، صلاحية تعيين وسحب الأدمن مقتصرة حصرياً على المشرف العام (محمد أشرف).'
          })
        }
      }

      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id))
      
      // Look up user to get actual UUID id
      let uRes
      if (isUuid) {
        uRes = await sql`SELECT id, national_id, role FROM users WHERE id = ${id} LIMIT 1`
      } else {
        uRes = await sql`SELECT id, national_id, role FROM users WHERE national_id = ${id} LIMIT 1`
      }

      if (uRes.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'المستخدم غير موجود.' })
      }

      const actualId = uRes.rows[0].id

      if (role) {
        await sql`
          UPDATE users
          SET role = ${role === 'ADMIN' ? 'ADMIN' : 'STUDENT'}, updated_at = NOW()
          WHERE id = ${actualId}
        `
      }

      // Update profile photo / phone / email — any user can update their own
      if (req.body.photo !== undefined) {
        await sql`UPDATE users SET profile_photo = ${photo}, updated_at = NOW() WHERE id = ${actualId}`
      }
      if (req.body.phone !== undefined) {
        await sql`UPDATE users SET phone = ${phone}, updated_at = NOW() WHERE id = ${actualId}`
      }
      if (req.body.email !== undefined) {
        await sql`UPDATE users SET email = ${email}, updated_at = NOW() WHERE id = ${actualId}`
      }

      if (score !== undefined) {
        // Any admin (SUPER_ADMIN or ADMIN) can evaluate members
        let isRequesterAdmin = false
        if (requesterId || requesterNid) {
          const reqCheck = await sql`
            SELECT id, role, national_id FROM users
            WHERE (id::text = ${requesterId || ''} OR national_id = ${requesterNid || ''})
            LIMIT 1
          `
          if (reqCheck.rows.length > 0) {
            const reqUser = reqCheck.rows[0]
            isRequesterAdmin = (reqUser.role === 'SUPER_ADMIN' || reqUser.role === 'ADMIN' || (superNid && reqUser.national_id === superNid))
          }
        } else {
          isRequesterAdmin = true
        }

        if (!isRequesterAdmin) {
          return res.status(403).json({
            success: false,
            error: 'عذراً، صلاحية تقييم الأعضاء مقتصرة على المشرفين والأدمن فقط.'
          })
        }

        await sql`
          INSERT INTO evaluations (id, student_id, score, notes, created_at, updated_at)
          VALUES (gen_random_uuid(), ${actualId}, ${score}, ${notes || null}, NOW(), NOW())
        `
      }

      return res.status(200).json({ success: true })
    }

    if (req.method === 'DELETE') {
      const body = req.body || {}
      const targetIdOrNid = body.id || body.nid || req.query.id || req.query.nid

      if (!targetIdOrNid) {
        return res.status(400).json({ success: false, error: 'معرف المستخدم أو الرقم القومي مطلوب للحذف.' })
      }

      const superNid = (process.env.SUPER_ADMIN_NID || '').trim()
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(targetIdOrNid))

      // Check if user exists safely without invalid uuid cast
      let uRes
      if (isUuid) {
        uRes = await sql`
          SELECT id, national_id, role, full_name FROM users
          WHERE id = ${targetIdOrNid}
          LIMIT 1
        `
      } else {
        uRes = await sql`
          SELECT id, national_id, role, full_name FROM users
          WHERE national_id = ${targetIdOrNid}
          LIMIT 1
        `
      }

      if (uRes.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'العضو غير موجود في قاعدة البيانات.' })
      }

      const target = uRes.rows[0]

      // Protect Super Admin from deletion
      if (target.role === 'SUPER_ADMIN' || (superNid && target.national_id === superNid)) {
        return res.status(403).json({ success: false, error: 'لا يمكن حذف حساب المشرف العام للنظام.' })
      }

      // Verify requester is Super Admin
      const reqId = body.requesterId || req.query.requesterId || ''
      const reqNid = body.requesterNid || req.query.requesterNid || ''
      let isRequesterSuper = false
      if (reqId || reqNid) {
        const reqCheck = await sql`
          SELECT id, role, national_id FROM users
          WHERE (id::text = ${reqId} OR national_id = ${reqNid})
          LIMIT 1
        `
        if (reqCheck.rows.length > 0) {
          const reqUser = reqCheck.rows[0]
          isRequesterSuper = (reqUser.role === 'SUPER_ADMIN' || (superNid && reqUser.national_id === superNid))
        }
      }

      if (!isRequesterSuper) {
        return res.status(403).json({
          success: false,
          error: 'عذراً، صلاحية حذف الأعضاء مقتصرة حصرياً على المشرف العام (محمد أشرف).'
        })
      }

      const actualId = target.id

      // Delete all related data completely (as if they never entered)
      await sql`DELETE FROM attendance WHERE user_id = ${actualId}`
      await sql`DELETE FROM evaluations WHERE student_id = ${actualId}`
      await sql`DELETE FROM sessions WHERE user_id = ${actualId}`
      await sql`DELETE FROM users WHERE id = ${actualId}`

      return res.status(200).json({
        success: true,
        message: `تم حذف العضو (${target.full_name}) وكافة بياناته وسجلاته نهائياً من قاعدة البيانات.`
      })
    }

    return res.status(405).json({ success: false, error: 'طريقة غير مدعومة.' })
  } catch (err) {
    console.error('Students API error:', err)
    return res.status(500).json({ success: false, error: err.message || 'خطأ في الخادم.' })
  }
}
