const { getDb } = require('./db')
const { setCommonHeaders, verifyRequester, normalizeArabicDigits, sendJson } = require('./helpers')

// In-memory cache to save database transfer
let cachedAttData = null
let lastAttFetchTime = 0
const ATT_CACHE_TTL = 10000 // 10 seconds

module.exports = async function handler(req, res) {
  setCommonHeaders(res, 'GET,OPTIONS,POST,DELETE')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const sql = getDb()

  try {
    // -------------------------------------------------------------
    // 2. GET: Attendance State, Live Attendees, and Archives
    // -------------------------------------------------------------
    if (req.method === 'GET') {
      const now = Date.now()
      const isFreshReq = req.query.t || req.query.fresh || req.query.nocache
      if (!isFreshReq && cachedAttData && (now - lastAttFetchTime < ATT_CACHE_TTL)) {
        return sendJson(res, 200, cachedAttData)
      }

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
               u.full_name, u.national_id, u.college, u.academic_year, u.committee_id, u.profile_photo, u.phone,
               e.title_ar AS event_title
        FROM attendance a
        LEFT JOIN users u ON a.user_id = u.id
        LEFT JOIN events e ON a.event_id = e.id
        ORDER BY a.scanned_at DESC
      `

      const hiddenNids = new Set(['12121212121212'])
      const attendees = attRes.rows
        .filter(r => !hiddenNids.has(r.national_id))
        .map(r => {
          const scanDate = r.scanned_at ? new Date(r.scanned_at) : new Date()
          const timeStr = scanDate.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
          const dateStr = scanDate.toLocaleDateString('ar-EG')
          return {
            id: r.id,
            studentId: r.user_id,
            name: r.full_name || 'عضو غير مسجل',
            studentName: r.full_name || 'عضو غير مسجل',
            nid: r.national_id || '',
            college: r.college || '',
            year: r.academic_year || '',
            com: r.committee_id || '',
            committee: r.committee_id || '',
            phone: r.phone || '',
            photo: r.profile_photo || '/assets/images/logo.png',
            event: r.event_title || activeQr.title || 'فعالية عامة',
            eventTitle: r.event_title || activeQr.title || 'فعالية عامة',
            time: timeStr,
            date: dateStr,
            scannedAt: scanDate.toISOString()
          }
        })

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

      cachedAttData = {
        success: true,
        activeQr,
        attendees,
        archives,
        totalLiveAttendees: attendees.length
      }
      lastAttFetchTime = Date.now()
      return sendJson(res, 200, cachedAttData)
    }

    // -------------------------------------------------------------
    // 3. POST: Actions (SET_ACTIVE_QR, STOP_QR, or RECORD_ATTENDANCE)
    // -------------------------------------------------------------
    if (req.method === 'POST') {
      cachedAttData = null
      lastAttFetchTime = 0
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

      const rawStudentId = String(studentId || '').trim()
      const normNid = normalizeArabicDigits(rawStudentId)
      const uRes = await sql`
        SELECT id, full_name, national_id, college, academic_year, committee_id, profile_photo, phone
        FROM users
        WHERE id::text = ${rawStudentId} OR national_id = ${rawStudentId} OR national_id = ${normNid}
        LIMIT 1
      `
      if (uRes.rows.length === 0) {
        return sendJson(res, 404, {
          success: false,
          error: 'هذا الرمز غير مسجل لأي طالب في قاعدة بيانات الأسرة.'
        })
      }
      const uRow = uRes.rows[0]
      const actualUserId = uRow.id
      const actualUserName = uRow.full_name

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
      const newAttRes = await sql`
        INSERT INTO attendance (id, event_id, user_id, scanned_at)
        VALUES (gen_random_uuid(), ${eventId}, ${actualUserId}, NOW())
        RETURNING id, scanned_at
      `
      const newAttRow = newAttRes.rows[0] || {}
      const scanDate = newAttRow.scanned_at ? new Date(newAttRow.scanned_at) : new Date()
      const timeStr = scanDate.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      const dateStr = scanDate.toLocaleDateString('ar-EG')

      const attendeeRecord = {
        id: newAttRow.id || String(Date.now()),
        studentId: actualUserId,
        name: actualUserName,
        studentName: actualUserName,
        nid: uRow.national_id || '',
        college: uRow.college || '',
        year: uRow.academic_year || '',
        com: uRow.committee_id || '',
        committee: uRow.committee_id || '',
        phone: uRow.phone || '',
        photo: uRow.profile_photo || '/assets/images/logo.png',
        event: title,
        eventTitle: title,
        time: timeStr,
        date: dateStr,
        scannedAt: scanDate.toISOString()
      }

      return sendJson(res, 200, {
        success: true,
        alreadyRecorded: false,
        studentName: actualUserName,
        attendee: attendeeRecord,
        message: `تم تسجيل حضور الطالب (${actualUserName}) بنجاح وتوثيقه في السيرفر!`
      })
    }

    // -------------------------------------------------------------
    // 4. DELETE: Remove Archive or Clear Attendance
    // -------------------------------------------------------------
    if (req.method === 'DELETE') {
      cachedAttData = null
      lastAttFetchTime = 0
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

      if (clearAll === 'true' || clearAll === true || body.action === 'CLEAR_ALL' || req.query.action === 'CLEAR_ALL') {
        await sql`DELETE FROM attendance`
        await sql`DELETE FROM events_archive`
        try { await sql`DELETE FROM events` } catch (_) {}
        try { await sql`UPDATE active_qr SET is_active = false, title = '', image = '', updated_at = NOW()` } catch (_) {}
        return sendJson(res, 200, { success: true, message: 'تم تصفية كامل سجلات وأرشيف الحضور بنجاح.' })
      }

      return sendJson(res, 400, { success: false, error: 'معرف السجل أو كشف الفعالية مطلوب للحذف.' })
    }

    return sendJson(res, 405, { success: false, error: 'طريقة غير مدعومة.' })
  } catch (err) {
    console.error('Attendance API error:', err)
    return sendJson(res, 500, { success: false, error: err.message || 'خطأ في الخادم.' })
  }
}
