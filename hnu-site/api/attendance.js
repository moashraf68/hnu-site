const { getDb } = require('./db')

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const sql = getDb()

  try {
    if (req.method === 'GET') {
      const result = await sql`
        SELECT a.id, a.event_id, a.user_id, a.scanned_at,
               u.full_name, u.national_id, u.college, u.academic_year, u.committee_id, u.phone, u.profile_photo,
               e.title_ar as event_title
        FROM attendance a
        JOIN users u ON a.user_id = u.id
        LEFT JOIN events e ON a.event_id = e.id
        ORDER BY a.scanned_at DESC
      `

      const list = result.rows.map(r => ({
        id: r.id,
        eventId: r.event_id,
        studentId: r.user_id,
        studentName: r.full_name,
        nid: r.national_id,
        college: r.college,
        year: r.academic_year,
        committee: r.committee_id,
        phone: r.phone,
        photo: r.profile_photo || '/assets/images/logo.png',
        event: r.event_title || 'فعالية عامة',
        scannedAt: r.scanned_at,
        time: r.scanned_at ? new Date(r.scanned_at).toLocaleTimeString('ar-EG') : '11:00 ص',
        date: r.scanned_at ? new Date(r.scanned_at).toLocaleDateString('ar-EG') : '2026-10-19'
      }))

      return res.status(200).json({ success: true, attendances: list })
    }

    if (req.method === 'POST') {
      const { studentId, eventTitle } = req.body || {}

      if (!studentId) {
        return res.status(400).json({ success: false, error: 'معرف الطالب مطلوب.' })
      }

      // Find or create event
      const title = eventTitle || 'فعالية عامة'
      let eventResult = await sql`
        SELECT id FROM events WHERE title_ar = ${title} LIMIT 1
      `

      let eventId
      if (eventResult.rows.length === 0) {
        const newEv = await sql`
          INSERT INTO events (id, title_ar, title_en, date, qr_token, is_active, created_at)
          VALUES (gen_random_uuid(), ${title}, ${title}, NOW(), gen_random_uuid(), true, NOW())
          RETURNING id
        `
        eventId = newEv.rows[0].id
      } else {
        eventId = eventResult.rows[0].id
      }

      // Find user id (could be id or nid)
      const uRes = await sql`
        SELECT id FROM users WHERE id = ${studentId} OR national_id = ${studentId} LIMIT 1
      `
      if (uRes.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'الطالب غير موجود.' })
      }
      const actualUserId = uRes.rows[0].id

      await sql`
        INSERT INTO attendance (id, event_id, user_id, scanned_at)
        VALUES (gen_random_uuid(), ${eventId}, ${actualUserId}, NOW())
        ON CONFLICT (event_id, user_id) DO NOTHING
      `

      return res.status(200).json({ success: true, message: 'تم تسجيل الحضور بنجاح.' })
    }

    return res.status(405).json({ success: false, error: 'طريقة غير مدعومة.' })
  } catch (err) {
    console.error('Attendance API error:', err)
    return res.status(500).json({ success: false, error: err.message || 'خطأ في الخادم.' })
  }
}
