const { getDb } = require('./db')
const { setCommonHeaders, sendJson } = require('./helpers')

// In-memory cache for suggestions
let cachedSugs = null
let lastSugsCacheTime = 0
const SUGS_CACHE_TTL = 30000 // 30 seconds

module.exports = async function handler(req, res) {
  setCommonHeaders(res, 'GET,OPTIONS,POST,PATCH,DELETE')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const sql = getDb()

  try {
    // 1. GET: List all suggestions
    if (req.method === 'GET') {
      const now = Date.now()
      if (cachedSugs && (now - lastSugsCacheTime < SUGS_CACHE_TTL)) {
        res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60')
        return sendJson(res, 200, cachedSugs)
      }

      const result = await sql`
        SELECT id, name, email, activity_name, audience, description, is_reviewed, created_at
        FROM suggestions
        ORDER BY created_at DESC
      `

      const sugs = result.rows.map(r => ({
        id: r.id,
        name: r.name,
        email: r.email || '',
        act: r.activity_name,
        aud: r.audience || '',
        msg: r.description,
        done: r.is_reviewed,
        date: r.created_at ? new Date(r.created_at).toISOString().slice(0, 10) : '2026-10-19'
      }))

      cachedSugs = { success: true, suggestions: sugs }
      lastSugsCacheTime = Date.now()
      res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60')
      return sendJson(res, 200, cachedSugs)
    }

    // 2. POST: Submit a new suggestion
    if (req.method === 'POST') {
      cachedSugs = null
      lastSugsCacheTime = 0
      const { name, email, activity, audience, message } = req.body || {}

      if (!name || !activity || !message) {
        return sendJson(res, 400, { success: false, error: 'الاسم واسم الفعالية والرسالة مطلوبة.' })
      }

      await sql`
        INSERT INTO suggestions (id, name, email, activity_name, audience, description, is_reviewed, created_at)
        VALUES (gen_random_uuid(), ${name}, ${email || null}, ${activity}, ${audience || null}, ${message}, false, NOW())
      `

      return sendJson(res, 200, { success: true, message: 'تم إرسال فكرتك بنجاح شكراً لمشاركتك!' })
    }

    // 3. PATCH: Toggle review status
    if (req.method === 'PATCH') {
      cachedSugs = null
      lastSugsCacheTime = 0
      const { id } = req.body || {}
      if (!id) {
        return sendJson(res, 400, { success: false, error: 'معرف الاقتراح مطلوب.' })
      }

      await sql`
        UPDATE suggestions
        SET is_reviewed = NOT is_reviewed
        WHERE id = ${id}
      `

      return sendJson(res, 200, { success: true })
    }

    // 4. DELETE: Delete suggestion
    if (req.method === 'DELETE') {
      cachedSugs = null
      lastSugsCacheTime = 0
      const body = req.body || {}
      const targetId = body.id || req.query.id

      if (!targetId) {
        return sendJson(res, 400, { success: false, error: 'معرف الاقتراح مطلوب للحذف.' })
      }

      await sql`
        DELETE FROM suggestions
        WHERE id = ${targetId}
      `

      return sendJson(res, 200, { success: true, message: 'تم مسح المقترح بنجاح من قاعدة البيانات.' })
    }

    return sendJson(res, 405, { success: false, error: 'طريقة غير مدعومة.' })
  } catch (err) {
    console.error('Suggestions API error:', err)
    return sendJson(res, 500, { success: false, error: err.message || 'خطأ في الخادم.' })
  }
}
