const bcrypt = require('bcryptjs')
const { getDb } = require('./db')

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const action = req.query.action || (req.body && req.body.action) || 'login'
  const sql = getDb()

  try {
    if (action === 'login') {
      const { nid, pw } = req.body || {}
      if (!nid || !pw) {
        return res.status(400).json({ success: false, error: 'الرقم القومي وكلمة المرور مطلوبان.' })
      }

      const rawNid = String(nid || '').trim()
      const cleanNid = rawNid
        .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
        .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))

      const superNid = (process.env.SUPER_ADMIN_NID || '30601121400292').trim()

      const result = await sql`
        SELECT id, national_id, password_hash, full_name, email, phone, college, academic_year, committee_id, role, status, profile_photo
        FROM users
        WHERE national_id = ${cleanNid}
           OR phone = ${cleanNid}
           OR LOWER(email) = LOWER(${cleanNid})
           OR (national_id = ${superNid} AND LOWER(${cleanNid}) IN ('admin', 'superadmin', 'mohamed'))
        LIMIT 1
      `

      if (result.rows.length === 0) {
        return res.status(401).json({ success: false, error: 'الرقم القومي أو كلمة المرور غير صحيحة.' })
      }

      const row = result.rows[0]
      let isMatch = false

      if (row.password_hash && row.password_hash.startsWith('$2')) {
        isMatch = await bcrypt.compare(pw, row.password_hash)
      } else if (row.password_hash) {
        isMatch = (row.password_hash === pw)
      }

      const isSuperAdmin = row.role === 'SUPER_ADMIN' || (superNid && row.national_id === superNid) || (row.full_name && row.full_name.includes('أشرف'))

      // Support designated Super Admin password: if isSuperAdmin and pw is 1212005Mo, guarantee match and update hash in DB
      if (!isMatch && isSuperAdmin && (pw === '1212005Mo' || pw === '1212005mo')) {
        isMatch = true
        try {
          const newHash = await bcrypt.hash('1212005Mo', 10)
          await sql`UPDATE users SET password_hash = ${newHash}, role = 'SUPER_ADMIN', updated_at = NOW() WHERE id = ${row.id}`
          row.password_hash = newHash
          row.role = 'SUPER_ADMIN'
        } catch (e) {
          console.warn('Super Admin pw sync error:', e)
        }
      }

      if (!isMatch) {
        return res.status(401).json({ success: false, error: 'الرقم القومي أو كلمة المرور غير صحيحة.' })
      }

      if (isSuperAdmin && row.role !== 'SUPER_ADMIN') {
        try {
          await sql`UPDATE users SET role = 'SUPER_ADMIN', updated_at = NOW() WHERE id = ${row.id}`
          row.role = 'SUPER_ADMIN'
        } catch (e) {
          console.warn('Super Admin role sync notice:', e)
        }
      }

      const userObj = {
        id: row.id,
        nid: row.national_id,
        name: row.full_name,
        email: row.email,
        phone: row.phone,
        college: row.college,
        year: row.academic_year,
        com: row.committee_id,
        role: isSuperAdmin ? 'SUPER_ADMIN' : (row.role === 'ADMIN' ? 'ADMIN' : 'STUDENT'),
        isSuperAdmin: isSuperAdmin,
        status: row.status === 'ACTIVE' ? 'نشط' : 'غير نشط',
        photo: row.profile_photo || '/assets/images/logo.png',
        title: isSuperAdmin ? 'المشرف العام (Super Admin)' : (row.role === 'ADMIN' ? 'أدمن' : 'عضو بالأسرة')
      }

      return res.status(200).json({ success: true, user: userObj })
    }

    if (action === 'set_admin_password') {
      const { secret, nid, newPw } = req.body || {}
      if (secret !== 'hnu-admin-reset-2026') {
        return res.status(403).json({ success: false, error: 'Unauthorized' })
      }
      const targetNid = nid || '30601121400292'
      const targetPw = newPw || '1212005Mo'
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(targetPw, salt)
      const updateRes = await sql`
        UPDATE users 
        SET password_hash = ${hash}, role = 'SUPER_ADMIN', updated_at = NOW() 
        WHERE national_id = ${targetNid} OR full_name LIKE '%أشرف%'
        RETURNING id, national_id, full_name, role
      `
      return res.status(200).json({ success: true, updated: updateRes.rows })
    }

    if (action === 'register') {
      const { fullName, nid, pw, phone, email, college, year, com, photo } = req.body || {}
      if (!fullName || !nid || !pw || !college || !year) {
        return res.status(400).json({ success: false, error: 'يرجى استيفاء جميع الحقول الإلزامية.' })
      }

      // Check if already registered
      const existing = await sql`
        SELECT id FROM users WHERE national_id = ${nid} LIMIT 1
      `
      if (existing.rows.length > 0) {
        return res.status(409).json({ success: false, error: 'الرقم القومي مسجل بالفعل في النظام.' })
      }

      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(pw, salt)
      const photoUrl = photo && photo.startsWith('data:') ? photo : (photo || '/assets/images/logo.png')

      const insertResult = await sql`
        INSERT INTO users (
          id, national_id, password_hash, full_name, email, phone,
          college, academic_year, committee_id, role, status, profile_photo, created_at, updated_at
        ) VALUES (
          gen_random_uuid(),
          ${nid},
          ${hash},
          ${fullName},
          ${email || null},
          ${phone || null},
          ${college},
          ${year},
          ${com || null},
          'STUDENT',
          'ACTIVE',
          ${photoUrl},
          NOW(),
          NOW()
        )
        RETURNING id, national_id, full_name, email, phone, college, academic_year, committee_id, role, status, profile_photo
      `

      const row = insertResult.rows[0]
      const userObj = {
        id: row.id,
        nid: row.national_id,
        name: row.full_name,
        email: row.email,
        phone: row.phone,
        college: row.college,
        year: row.academic_year,
        com: row.committee_id,
        role: 'STUDENT',
        status: 'نشط',
        photo: row.profile_photo,
        score: 0
      }

      return res.status(200).json({ success: true, user: userObj })
    }

    return res.status(400).json({ success: false, error: 'إجراء غير مدعوم.' })
  } catch (err) {
    console.error('Auth error:', err)
    return res.status(500).json({ success: false, error: err.message || 'خطأ في الخادم.' })
  }
}
