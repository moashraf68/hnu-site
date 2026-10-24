const { getDb } = require('./db')
const { setCommonHeaders, getSuperAdminNid, normalizeArabicDigits, verifyRequester, sendJson } = require('./helpers')

module.exports = async function handler(req, res) {
  setCommonHeaders(res, 'GET,OPTIONS,PATCH,DELETE,POST,PUT')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const sql = getDb()

  try {
    // -------------------------------------------------------------
    // 1. GET: Fetch all registered students & evaluations
    // -------------------------------------------------------------
    if (req.method === 'GET') {
      const result = await sql`
        SELECT u.id, u.national_id, u.full_name, u.email, u.phone, u.college, u.academic_year,
               u.committee_id, u.role, u.status, u.profile_photo, u.created_at,
               COALESCE((SELECT score FROM evaluations WHERE student_id = u.id ORDER BY created_at DESC LIMIT 1), 0) as score,
               (SELECT notes FROM evaluations WHERE student_id = u.id ORDER BY created_at DESC LIMIT 1) as notes
        FROM users u
        ORDER BY u.created_at DESC
      `

      const superNid = getSuperAdminNid()
      // Completely hide ONLY the master Super Admin (12121212121212) from all directory/member listings
      const hiddenNids = new Set(['12121212121212', superNid].filter(Boolean))
      const visibleRows = result.rows.filter(r => !hiddenNids.has(r.national_id))

      const students = visibleRows.map(r => {
        // If 30601121400292 had an old SUPER_ADMIN role in DB, normalize to STUDENT
        if (r.national_id === '30601121400292' && r.role === 'SUPER_ADMIN') {
          r.role = 'STUDENT'
          try { sql`UPDATE users SET role = 'STUDENT', updated_at = NOW() WHERE id = ${r.id}`.catch(() => {}) } catch (_) {}
        }
        const isSuper = (r.role === 'SUPER_ADMIN' && (r.national_id === '12121212121212' || r.national_id === superNid))
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

      return sendJson(res, 200, { success: true, students })
    }

    // -------------------------------------------------------------
    // 2. PATCH / POST: Update Profile, Role, or Evaluation
    // -------------------------------------------------------------
    if (req.method === 'PATCH' || req.method === 'POST') {
      const { id, role, score, notes, photo, phone, email, requesterId, requesterNid } = req.body || {}

      if (!id) {
        return sendJson(res, 400, { success: false, error: 'معرف المستخدم مطلوب.' })
      }

      // Check permissions if requesterId/Nid is provided
      let isRequesterAdmin = true
      let isRequesterSuper = false
      if (requesterId || requesterNid) {
        const auth = await verifyRequester(sql, requesterId, requesterNid)
        isRequesterAdmin = auth.isAdmin
        isRequesterSuper = auth.isSuperAdmin
      }

      // Role change requires SUPER_ADMIN
      if (role) {
        if (!isRequesterSuper) {
          return sendJson(res, 403, {
            success: false,
            error: 'عذراً، صلاحية تعيين وسحب الأدمن مقتصرة حصرياً على المشرف العام (محمد أشرف).'
          })
        }
      }

      // Evaluation (score/notes) requires ADMIN or SUPER_ADMIN
      if (score !== undefined) {
        if (!isRequesterAdmin) {
          return sendJson(res, 403, {
            success: false,
            error: 'عذراً، تقييم الأعضاء مقتصر على مسؤولي وأدمن الأسرة فقط.'
          })
        }
      }

      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id))
      const cleanTarget = normalizeArabicDigits(id)
      
      // Look up target user to get actual UUID id
      let uRes
      if (isUuid) {
        uRes = await sql`SELECT id, national_id, role FROM users WHERE id = ${id} LIMIT 1`
      } else {
        uRes = await sql`SELECT id, national_id, role FROM users WHERE national_id = ${cleanTarget} LIMIT 1`
      }

      if (uRes.rows.length === 0) {
        return sendJson(res, 404, { success: false, error: 'المستخدم غير موجود.' })
      }

      const actualId = uRes.rows[0].id

      // 1. Update role if requested
      if (role) {
        await sql`
          UPDATE users
          SET role = ${role === 'ADMIN' ? 'ADMIN' : 'STUDENT'}, updated_at = NOW()
          WHERE id = ${actualId}
        `
      }

      // 2. Update profile fields (photo, phone, email)
      if (photo !== undefined) {
        await sql`UPDATE users SET profile_photo = ${photo}, updated_at = NOW() WHERE id = ${actualId}`
      }
      if (phone !== undefined) {
        await sql`UPDATE users SET phone = ${phone}, updated_at = NOW() WHERE id = ${actualId}`
      }
      if (email !== undefined) {
        await sql`UPDATE users SET email = ${email}, updated_at = NOW() WHERE id = ${actualId}`
      }

      // 3. Save evaluation record if score provided
      if (score !== undefined) {
        const numScore = Math.min(100, Math.max(0, parseInt(score, 10) || 0))
        const cleanNotes = String(notes || '').trim()

        await sql`
          CREATE TABLE IF NOT EXISTS evaluations (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            student_id UUID NOT NULL,
            score INT NOT NULL DEFAULT 0,
            notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          )
        `

        await sql`
          INSERT INTO evaluations (id, student_id, score, notes, created_at, updated_at)
          VALUES (gen_random_uuid(), ${actualId}, ${numScore}, ${cleanNotes || null}, NOW(), NOW())
        `
      }

      return sendJson(res, 200, { success: true, message: 'تم تحديث البيانات بنجاح.' })
    }

    // -------------------------------------------------------------
    // 3. DELETE: Remove student (Super Admin only)
    // -------------------------------------------------------------
    if (req.method === 'DELETE') {
      const body = req.body || {}
      const targetId = body.id || req.query.id
      const reqId = body.requesterId || req.query.requesterId
      const reqNid = body.requesterNid || req.query.requesterNid

      if (!targetId) {
        return sendJson(res, 400, { success: false, error: 'معرف المستخدم مطلوب للحذف.' })
      }

      const auth = await verifyRequester(sql, reqId, reqNid)
      if (!auth.isSuperAdmin) {
        return sendJson(res, 403, {
          success: false,
          error: 'عذراً، صلاحية حذف الأعضاء مقتصرة حصرياً على المشرف العام (محمد أشرف).'
        })
      }

      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(targetId))
      const cleanTarget = normalizeArabicDigits(targetId)

      let uCheck
      if (isUuid) {
        uCheck = await sql`SELECT id, national_id, role FROM users WHERE id = ${targetId} LIMIT 1`
      } else {
        uCheck = await sql`SELECT id, national_id, role FROM users WHERE national_id = ${cleanTarget} LIMIT 1`
      }

      if (uCheck.rows.length === 0) {
        return sendJson(res, 404, { success: false, error: 'المستخدم غير موجود.' })
      }

      const row = uCheck.rows[0]
      const superNid = getSuperAdminNid()

      if ((row.role === 'SUPER_ADMIN' && (row.national_id === '12121212121212' || row.national_id === superNid)) || row.national_id === '12121212121212' || row.national_id === superNid) {
        return sendJson(res, 403, { success: false, error: 'لا يمكن حذف حساب المشرف العام.' })
      }

      // Delete evaluations, attendance, then user
      await sql`DELETE FROM evaluations WHERE student_id = ${row.id}`
      await sql`DELETE FROM attendance WHERE user_id = ${row.id}`
      await sql`DELETE FROM users WHERE id = ${row.id}`

      return sendJson(res, 200, { success: true, message: 'تم حذف العضو وسجلاته بنجاح.' })
    }

    return sendJson(res, 405, { success: false, error: 'طريقة غير مدعومة.' })
  } catch (err) {
    console.error('Students API error:', err)
    return sendJson(res, 500, { success: false, error: err.message || 'خطأ في الخادم.' })
  }
}
