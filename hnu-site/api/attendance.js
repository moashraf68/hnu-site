const { getDb } = require('./db')
const { setCommonHeaders, verifyRequester, sendJson } = require('./helpers')

module.exports = async function handler(req, res) {
  setCommonHeaders(res, 'GET,OPTIONS,POST,DELETE')

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

    // -------------------------------------------------------------
    // 2. GET: Attendance State, Live Attendees, and Archives
    // -------------------------------------------------------------
    if (req.method === 'GET') {
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
          createdAt: qrRow.created_at ? new Date(qrRow.created_at).toLocaleString('ar-EG') : ''
        }
      }

      // Live attendance records
      const attRes = await sql`
        SELECT a.id, a.event_id, a.user_id, a.scanned_at,
               u.full_name, u.national_id, u.college, u.academic_year, u.committee_id, u.profile_photo,
               e.title_ar AS event_title
        FROM attendance a
        LEFT JOIN users u ON a.user_id = u.id
        LEFT JOIN events e ON a.event_id = e.id
        ORDER BY a.scanned_at DESC
      `

      const attendees = attRes.rows.map(r => ({
        id: r.id,
        studentId: r.user_id,
        name: r.full_name || 'عضو غير مسجل',
        nid: r.national_id || '',
        college: r.college || '',
        year: r.academic_year || '',
        com: r.committee_id || '',
        photo: r.profile_photo || '/assets/images/logo.png',
        eventTitle: r.event_title || activeQr.title || 'فعالية عامة',
        scannedAt: r.scanned_at ? new Date(r.scanned_at).toISOString() : new Date().toISOString()
      }))

      // Archives
      const archRes = await sql`
        SELECT id, title, event_date, event_time, total_attendees, attendees_json, created_at
        FROM events_archive
        ORDER BY created_at DESC
      `

      const archives = archRes.rows.map(r => {
        let attJson = []
        try {
          attJson = typeof r.attendees_json === 'string' ? JSON.parse(r.attendees_json) : (r.attendees_json || [])
        } catch (_) {}
        return {
          id: r.id,
          title: r.title,
          date: r.event_date || (r.created_at ? new Date(r.created_at).toLocaleDateString('ar-EG') : ''),
          time: r.event_time || '',
          total: r.total_attendees || attJson.length,
          attendees: attJson
        }
      })

      return sendJson(res, 200, {
        success: true,
        activeQr,
        attendees,
        archives,
        totalLiveAttendees: attendees.length
      })
    }

    // -------------------------------------------------------------
    // 3. POST: Actions (SET_ACTIVE_QR, STOP_QR, or RECORD_ATTENDANCE)
    // -------------------------------------------------------------
    if (req.method === 'POST') {
      const body = req.body || {}
      const action = body.action || 'RECORD_ATTENDANCE'

      // Action A: Start or Update QR Session
      if (action === 'SET_ACTIVE_QR') {
        const { title, image, requesterId, requesterNid } = body
        if (!title) {
          return sendJson(res, 400, { success: false, error: 'عنوان الفعالية مطلوب لتفعيل الـ QR.' })
        }

        const auth = await verifyRequester(sql, requesterId, requesterNid)
        if (!auth.isAdmin) {
          return sendJson(res, 403, { success: false, error: 'غير مصرح: تفعيل كود الـ QR مقتصر على مسؤولي الأسرة.' })
        }

        await sql`
          INSERT INTO active_qr (id, title, image, is_active, created_at, updated_at)
          VALUES ('current', ${title}, ${image || ''}, true, NOW(), NOW())
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            image = EXCLUDED.image,
            is_active = true,
            created_at = NOW(),
            updated_at = NOW()
        `

        await sql`
          INSERT INTO events (id, title_ar, title_en, date, qr_token, is_active, created_at)
          SELECT gen_random_uuid(), ${title}, ${title}, NOW(), gen_random_uuid(), true, NOW()
          WHERE NOT EXISTS (SELECT 1 FROM events WHERE title_ar = ${title})
        `

        return sendJson(res, 200, {
          success: true,
          message: 'تم تفعيل كود الـ QR ونشره لجميع الطلاب على السيرفر بنجاح!'
        })
      }

      // Action B: Stop Session & Archive
      if (action === 'STOP_QR') {
        const { requesterId, requesterNid, archiveData } = body
        const auth = await verifyRequester(sql, requesterId, requesterNid)
        if (!auth.isAdmin) {
          return sendJson(res, 403, { success: false, error: 'غير مصرح: إيقاف كود الـ QR مقتصر على مسؤولي الأسرة.' })
        }

        await sql`UPDATE active_qr SET is_active = false, updated_at = NOW() WHERE id = 'current'`
        await sql`UPDATE events SET is_active = false WHERE is_active = true`

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

        return sendJson(res, 200, {
          success: true,
          message: 'تم إنهاء الفعالية وإيقاف كود الـ QR وأرشفة السجلات بنجاح.'
        })
      }

      // Action C: Record Attendance (Camera QR Scan)
      const { studentId, eventTitle } = body
      if (!studentId) {
        return sendJson(res, 400, { success: false, error: 'معرف الطالب مطلوب.' })
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

      const uRes = await sql`
        SELECT id, full_name, national_id FROM users
        WHERE id::text = ${studentId} OR national_id = ${studentId}
        LIMIT 1
      `
      if (uRes.rows.length === 0) {
        return sendJson(res, 404, {
          success: false,
          error: 'هذا الرمز غير مسجل لأي طالب في قاعدة بيانات الأسرة.'
        })
      }
      const actualUserId = uRes.rows[0].id
      const actualUserName = uRes.rows[0].full_name

      // Check if student is already recorded in this event
      const checkAtt = await sql`
        SELECT id, scanned_at FROM attendance
        WHERE event_id = ${eventId} AND user_id = ${actualUserId}
        LIMIT 1
      `
      if (checkAtt.rows.length > 0) {
        return sendJson(res, 200, {
          success: true,
          alreadyRecorded: true,
          studentName: actualUserName,
          scannedAt: checkAtt.rows[0].scanned_at,
          message: `الطالب (${actualUserName}) مسجل حضوره بالفعل مسبقاً في هذه الفعالية!`
        })
      }

      // First time recording
      await sql`
        INSERT INTO attendance (id, event_id, user_id, scanned_at)
        VALUES (gen_random_uuid(), ${eventId}, ${actualUserId}, NOW())
      `

      return sendJson(res, 200, {
        success: true,
        alreadyRecorded: false,
        studentName: actualUserName,
        message: `تم تسجيل حضور الطالب (${actualUserName}) بنجاح وتوثيقه في السيرفر!`
      })
    }

    // -------------------------------------------------------------
    // 4. DELETE: Remove Archive or Clear Attendance
    // -------------------------------------------------------------
    if (req.method === 'DELETE') {
      const body = req.body || {}
      const targetId = body.id || req.query.id
      const archiveId = body.archiveId || req.query.archiveId
      const clearAll = body.clearAll || req.query.clearAll
      const reqId = body.requesterId || req.query.requesterId
      const reqNid = body.requesterNid || req.query.requesterNid

      const auth = await verifyRequester(sql, reqId, reqNid)
      if (!auth.isAdmin) {
        return sendJson(res, 403, { success: false, error: 'غير مصرح: هذا الإجراء للمسؤولين فقط.' })
      }

      if (archiveId) {
        await sql`
          DELETE FROM events_archive
          WHERE id::text = ${archiveId} OR id::text = ${archiveId.replace(/^ev-/, '')}
        `
        return sendJson(res, 200, { success: true, message: 'تم حذف كشف الفعالية نهائياً من الأرشيف السحابي.' })
      }

      if (targetId) {
        const delArch = await sql`
          DELETE FROM events_archive
          WHERE id::text = ${targetId} OR id::text = ${targetId.replace(/^ev-/, '')}
          RETURNING id
        `
        if (delArch.rows.length > 0) {
          return sendJson(res, 200, { success: true, message: 'تم حذف الفعالية نهائياً من الأرشيف.' })
        }

        await sql`DELETE FROM attendance WHERE id::text = ${targetId}`
        return sendJson(res, 200, { success: true, message: 'تم حذف سجل الحضور.' })
      }

      if (clearAll === 'true') {
        await sql`DELETE FROM attendance`
        return sendJson(res, 200, { success: true, message: 'تم مسح سجلات الحضور.' })
      }

      return sendJson(res, 400, { success: false, error: 'معرف السجل أو كشف الفعالية مطلوب للحذف.' })
    }

    return sendJson(res, 405, { success: false, error: 'طريقة غير مدعومة.' })
  } catch (err) {
    console.error('Attendance API error:', err)
    return sendJson(res, 500, { success: false, error: err.message || 'خطأ في الخادم.' })
  }
}
