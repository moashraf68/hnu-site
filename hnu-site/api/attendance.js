const { getDb } = require('./db')

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const sql = getDb()

  try {
    // 1. Ensure required tables exist
    await sql`
      CREATE TABLE IF NOT EXISTS active_qr (
        id VARCHAR(50) PRIMARY KEY DEFAULT 'current',
        title TEXT NOT NULL,
        image TEXT NOT NULL,
        is_active BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS events_archive (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        event_date TEXT,
        event_time TEXT,
        total_attendees INT DEFAULT 0,
        attendees_json JSONB DEFAULT '[]',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Helper: verify admin requester
    const verifyAdmin = async (reqId, reqNid) => {
      const superNid = (process.env.SUPER_ADMIN_NID || '').trim()
      if (reqId || reqNid) {
        const u = await sql`
          SELECT role, national_id FROM users
          WHERE (id::text = ${reqId || ''} OR national_id = ${reqNid || ''})
          LIMIT 1
        `
        if (u.rows.length > 0) {
          const r = u.rows[0]
          return (r.role === 'ADMIN' || r.role === 'SUPER_ADMIN' || (superNid && r.national_id === superNid))
        }
      }
      return false
    }

    if (req.method === 'GET') {
      // 1. Get Active QR State
      const qrRes = await sql`
        SELECT title, image, is_active, created_at, updated_at
        FROM active_qr
        WHERE id = 'current'
        LIMIT 1
      `
      let activeQr = { active: false, title: '', image: '', createdAt: '' }
      if (qrRes.rows.length > 0) {
        const qrRow = qrRes.rows[0]
        activeQr = {
          active: !!qrRow.is_active,
          title: qrRow.title || '',
          image: qrRow.image || '',
          createdAt: qrRow.created_at ? new Date(qrRow.created_at).toLocaleTimeString('ar-EG') : ''
        }
      }

      // 2. Get Live Attendance Records
      const attRes = await sql`
        SELECT a.id, a.event_id, a.user_id, a.scanned_at,
               u.full_name, u.national_id, u.college, u.academic_year, u.committee_id, u.phone, u.profile_photo,
               e.title_ar as event_title
        FROM attendance a
        JOIN users u ON a.user_id = u.id
        LEFT JOIN events e ON a.event_id = e.id
        ORDER BY a.scanned_at DESC
      `

      const attendances = attRes.rows.map(r => ({
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

      // 3. Get Archived Events
      const archRes = await sql`
        SELECT id, title, event_date, event_time, total_attendees, attendees_json, created_at
        FROM events_archive
        ORDER BY created_at DESC
      `

      const archivedEvents = archRes.rows.map(r => ({
        id: r.id,
        title: r.title,
        date: r.event_date || (r.created_at ? new Date(r.created_at).toLocaleDateString('ar-EG') : ''),
        time: r.event_time || (r.created_at ? new Date(r.created_at).toLocaleTimeString('ar-EG') : ''),
        totalAttendees: r.total_attendees || (Array.isArray(r.attendees_json) ? r.attendees_json.length : 0),
        attendees: Array.isArray(r.attendees_json) ? r.attendees_json : []
      }))

      return res.status(200).json({
        success: true,
        activeQr,
        attendances,
        archivedEvents
      })
    }

    if (req.method === 'POST') {
      const body = req.body || {}
      const action = (body.action || req.query.action || '').toUpperCase()

      // Action A: Set / Activate QR Code
      if (action === 'SET_ACTIVE_QR') {
        const { title, image, requesterId, requesterNid } = body
        if (!title || !image) {
          return res.status(400).json({ success: false, error: 'عنوان الفعالية وصورة كود الـ QR مطلوبين.' })
        }

        const isAdmin = await verifyAdmin(requesterId, requesterNid)
        if (!isAdmin) {
          return res.status(403).json({ success: false, error: 'غير مصرح: تفعيل كود الـ QR مقتصر على مسؤولي الأسرة.' })
        }

        // Upsert into active_qr
        await sql`
          INSERT INTO active_qr (id, title, image, is_active, created_at, updated_at)
          VALUES ('current', ${title}, ${image}, true, NOW(), NOW())
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            image = EXCLUDED.image,
            is_active = true,
            created_at = NOW(),
            updated_at = NOW()
        `

        // Also ensure an active event row exists in events table
        await sql`
          INSERT INTO events (id, title_ar, title_en, date, qr_token, is_active, created_at)
          SELECT gen_random_uuid(), ${title}, ${title}, NOW(), gen_random_uuid(), true, NOW()
          WHERE NOT EXISTS (SELECT 1 FROM events WHERE title_ar = ${title})
        `

        return res.status(200).json({
          success: true,
          message: 'تم تفعيل كود الـ QR ونشره لجميع الطلاب على السيرفر بنجاح!'
        })
      }

      // Action B: Stop / Deactivate QR Code & Archive
      if (action === 'STOP_QR') {
        const { requesterId, requesterNid, archiveData } = body
        const isAdmin = await verifyAdmin(requesterId, requesterNid)
        if (!isAdmin) {
          return res.status(403).json({ success: false, error: 'غير مصرح: إيقاف كود الـ QR مقتصر على مسؤولي الأسرة.' })
        }

        // Deactivate active_qr
        await sql`
          UPDATE active_qr
          SET is_active = false, updated_at = NOW()
          WHERE id = 'current'
        `

        // Deactivate active events
        await sql`
          UPDATE events
          SET is_active = false
          WHERE is_active = true
        `

        // If archiveData provided, save into events_archive
        if (archiveData && archiveData.title) {
          const attendeesList = Array.isArray(archiveData.attendees) ? archiveData.attendees : []
          await sql`
            INSERT INTO events_archive (id, title, event_date, event_time, total_attendees, attendees_json, created_at)
            VALUES (
              gen_random_uuid(),
              ${archiveData.title},
              ${archiveData.date || new Date().toLocaleDateString('ar-EG')},
              ${archiveData.time || new Date().toLocaleTimeString('ar-EG')},
              ${attendeesList.length},
              ${JSON.stringify(attendeesList)},
              NOW()
            )
          `
        }

        return res.status(200).json({
          success: true,
          message: 'تم إنهاء الفعالية وإيقاف كود الـ QR وأرشفة السجلات بنجاح.'
        })
      }

      // Action C: Record Member Attendance (Default)
      const { studentId, eventTitle } = body
      if (!studentId) {
        return res.status(400).json({ success: false, error: 'معرف الطالب مطلوب.' })
      }

      const title = eventTitle || 'فعالية عامة'

      // Find or create event
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
        SELECT id FROM users WHERE id::text = ${studentId} OR national_id = ${studentId} LIMIT 1
      `
      if (uRes.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'الطالب غير موجود في قاعدة البيانات.' })
      }
      const actualUserId = uRes.rows[0].id

      // Safely insert attendance record if not already recorded for this event
      await sql`
        INSERT INTO attendance (id, event_id, user_id, scanned_at)
        SELECT gen_random_uuid(), ${eventId}, ${actualUserId}, NOW()
        WHERE NOT EXISTS (
          SELECT 1 FROM attendance WHERE event_id = ${eventId} AND user_id = ${actualUserId}
        )
      `

      return res.status(200).json({
        success: true,
        message: 'تم تسجيل حضورك في الفعالية بنجاح وتوثيقه في السيرفر!'
      })
    }

    if (req.method === 'DELETE') {
      const body = req.body || {}
      const targetId = body.id || req.query.id
      const clearAll = body.clearAll || req.query.clearAll
      const reqId = body.requesterId || req.query.requesterId
      const reqNid = body.requesterNid || req.query.requesterNid

      const isAdmin = await verifyAdmin(reqId, reqNid)
      if (!isAdmin) {
        return res.status(403).json({ success: false, error: 'غير مصرح.' })
      }

      if (targetId) {
        await sql`DELETE FROM attendance WHERE id::text = ${targetId}`
        return res.status(200).json({ success: true, message: 'تم حذف سجل الحضور.' })
      }

      if (clearAll === 'true') {
        await sql`DELETE FROM attendance`
        return res.status(200).json({ success: true, message: 'تم مسح سجلات الحضور.' })
      }

      return res.status(400).json({ success: false, error: 'معرف السجل مطلوب.' })
    }

    return res.status(405).json({ success: false, error: 'طريقة غير مدعومة.' })
  } catch (err) {
    console.error('Attendance API error:', err)
    return res.status(500).json({ success: false, error: err.message || 'خطأ في الخادم.' })
  }
}
