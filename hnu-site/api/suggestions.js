const { getDb } = require('./db')

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PATCH,DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const sql = getDb()

  try {
    if (req.method === 'GET') {
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

      return res.status(200).json({ success: true, suggestions: sugs })
    }

    if (req.method === 'POST') {
      const { name, email, activity, audience, message } = req.body || {}

      if (!name || !activity || !message) {
        return res.status(400).json({ success: false, error: 'الاسم واسم الفعالية والرسالة مطلوبة.' })
      }

      await sql`
        INSERT INTO suggestions (id, name, email, activity_name, audience, description, is_reviewed, created_at)
        VALUES (gen_random_uuid(), ${name}, ${email || null}, ${activity}, ${audience || null}, ${message}, false, NOW())
      `

      return res.status(200).json({ success: true, message: 'تم إرسال فكرتك بنجاح شكراً لمشاركتك!' })
    }

    if (req.method === 'PATCH') {
      const { id } = req.body || {}
      if (!id) {
        return res.status(400).json({ success: false, error: 'معرف الاقتراح مطلوب.' })
      }

      await sql`
        UPDATE suggestions
        SET is_reviewed = NOT is_reviewed
        WHERE id = ${id}
      `

      return res.status(200).json({ success: true })
    }

    if (req.method === 'DELETE') {
      const body = req.body || {}
      const targetId = body.id || req.query.id

      if (!targetId) {
        return res.status(400).json({ success: false, error: 'معرف الاقتراح مطلوب للحذف.' })
      }

      await sql`
        DELETE FROM suggestions
        WHERE id = ${targetId}
      `

      return res.status(200).json({ success: true, message: 'تم مسح المقترح بنجاح من قاعدة البيانات.' })
    }

    return res.status(405).json({ success: false, error: 'طريقة غير مدعومة.' })
  } catch (err) {
    console.error('Suggestions API error:', err)
    return res.status(500).json({ success: false, error: err.message || 'خطأ في الخادم.' })
  }
}
