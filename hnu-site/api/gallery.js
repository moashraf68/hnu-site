const { getDb } = require('./db')

const DEFAULT_GALLERY_FILES = [
  "/assets/images/gallery-1.jpg",
  "/assets/images/gallery-2.jpg",
  "/assets/images/gallery-3.jpg",
  "/assets/images/gallery-4.jpg",
  "/assets/images/gallery-5.jpg",
  "/assets/images/gallery-6.jpg",
  "/assets/images/gallery-7.jpg",
  "/assets/images/gallery-8.jpg",
  "/assets/images/gallery-9.jpg",
  "/assets/images/gallery-10.jpg"
]

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
    // Ensure gallery table exists
    await sql`
      CREATE TABLE IF NOT EXISTS gallery (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        url TEXT NOT NULL,
        type VARCHAR(20) DEFAULT 'IMAGE',
        title TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    if (req.method === 'GET') {
      let result = await sql`
        SELECT id, url, type, title, created_at
        FROM gallery
        ORDER BY created_at DESC
      `

      // If empty table on first run, seed default gallery items
      if (result.rows.length === 0) {
        for (let i = DEFAULT_GALLERY_FILES.length - 1; i >= 0; i--) {
          await sql`
            INSERT INTO gallery (id, url, type, title, created_at)
            VALUES (gen_random_uuid(), ${DEFAULT_GALLERY_FILES[i]}, 'IMAGE', ${'لحظات من أنشطة الأسرة ' + (i + 1)}, NOW() - (${i} || ' minutes')::interval)
          `
        }
        result = await sql`
          SELECT id, url, type, title, created_at
          FROM gallery
          ORDER BY created_at DESC
        `
      }

      const items = result.rows.map(r => ({
        id: r.id,
        url: r.url,
        type: r.type || 'IMAGE',
        title: r.title || '',
        createdAt: r.created_at ? new Date(r.created_at).toISOString().slice(0, 10) : ''
      }))

      return res.status(200).json({ success: true, items })
    }

    if (req.method === 'POST') {
      const { url, type, title, requesterId, requesterNid } = req.body || {}

      if (!url) {
        return res.status(400).json({ success: false, error: 'رابط الصورة أو الفيديو مطلوب.' })
      }

      // Verify requester is Super Admin
      const superNid = (process.env.SUPER_ADMIN_NID || '').trim()
      let isSuper = false

      if (requesterId || requesterNid) {
        const reqCheck = await sql`
          SELECT id, role, national_id FROM users
          WHERE (id::text = ${requesterId || ''} OR national_id = ${requesterNid || ''})
          LIMIT 1
        `
        if (reqCheck.rows.length > 0) {
          const reqUser = reqCheck.rows[0]
          isSuper = (reqUser.role === 'SUPER_ADMIN' || (superNid && reqUser.national_id === superNid))
        }
      }

      if (!isSuper) {
        return res.status(403).json({
          success: false,
          error: 'عذراً، صلاحية إضافة وسائط للمعرض مقتصرة حصرياً على المشرف العام (محمد أشرف).'
        })
      }

      const mediaType = (type || 'IMAGE').toUpperCase()

      const insertRes = await sql`
        INSERT INTO gallery (id, url, type, title, created_at)
        VALUES (gen_random_uuid(), ${url}, ${mediaType}, ${title || null}, NOW())
        RETURNING id, url, type, title, created_at
      `

      return res.status(200).json({
        success: true,
        message: 'تمت إضافة العنصر إلى المعرض بنجاح!',
        item: insertRes.rows[0]
      })
    }

    if (req.method === 'DELETE') {
      const body = req.body || {}
      const targetId = body.id || req.query.id
      const targetUrl = body.url || req.query.url
      const reqId = body.requesterId || req.query.requesterId || ''
      const reqNid = body.requesterNid || req.query.requesterNid || ''

      if (!targetId && !targetUrl) {
        return res.status(400).json({ success: false, error: 'معرف العنصر أو رابطه مطلوب للحذف.' })
      }

      // Verify requester is Super Admin
      const superNid = (process.env.SUPER_ADMIN_NID || '').trim()
      let isSuper = false

      if (reqId || reqNid) {
        const reqCheck = await sql`
          SELECT id, role, national_id FROM users
          WHERE (id::text = ${reqId} OR national_id = ${reqNid})
          LIMIT 1
        `
        if (reqCheck.rows.length > 0) {
          const reqUser = reqCheck.rows[0]
          isSuper = (reqUser.role === 'SUPER_ADMIN' || (superNid && reqUser.national_id === superNid))
        }
      }

      if (!isSuper) {
        return res.status(403).json({
          success: false,
          error: 'عذراً، صلاحية حذف عناصر المعرض مقتصرة حصرياً على المشرف العام (محمد أشرف).'
        })
      }

      if (targetId) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(targetId))
        if (isUuid) {
          await sql`DELETE FROM gallery WHERE id = ${targetId} OR url = ${targetUrl || ''}`
        } else {
          await sql`DELETE FROM gallery WHERE url = ${targetId} OR url = ${targetUrl || ''}`
        }
      } else {
        await sql`DELETE FROM gallery WHERE url = ${targetUrl}`
      }

      return res.status(200).json({
        success: true,
        message: 'تم حذف العنصر بنجاح من المعرض وقاعدة البيانات.'
      })
    }

    return res.status(405).json({ success: false, error: 'طريقة غير مدعومة.' })
  } catch (err) {
    console.error('Gallery API error:', err)
    return res.status(500).json({ success: false, error: err.message || 'خطأ في الخادم.' })
  }
}
