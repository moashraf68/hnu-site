const { getDb } = require('./db')
const { setCommonHeaders, verifyRequester, sendJson } = require('./helpers')

// In-memory cache for media gallery
let cachedGallery = null
let lastGalCacheTime = 0
const GAL_CACHE_TTL = 60000 // 60 seconds

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
  setCommonHeaders(res, 'GET,OPTIONS,POST,DELETE')

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

    // 1. GET: List all media items
    if (req.method === 'GET') {
      const now = Date.now()
      if (cachedGallery && (now - lastGalCacheTime < GAL_CACHE_TTL)) {
        res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')
        return sendJson(res, 200, cachedGallery)
      }

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

      cachedGallery = { success: true, items }
      lastGalCacheTime = Date.now()
      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120')
      return sendJson(res, 200, cachedGallery)
    }

    // 2. POST: Add item (Super Admin only)
    if (req.method === 'POST') {
      cachedGallery = null
      lastGalCacheTime = 0
      const { url, type, title, requesterId, requesterNid } = req.body || {}

      if (!url) {
        return sendJson(res, 400, { success: false, error: 'رابط الصورة أو الفيديو مطلوب.' })
      }

      const { isSuperAdmin } = await verifyRequester(sql, requesterId, requesterNid)
      if (!isSuperAdmin) {
        return sendJson(res, 403, {
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

      return sendJson(res, 200, {
        success: true,
        message: 'تمت إضافة العنصر إلى المعرض بنجاح!',
        item: insertRes.rows[0]
      })
    }

    // 3. DELETE: Remove item (Super Admin only)
    if (req.method === 'DELETE') {
      cachedGallery = null
      lastGalCacheTime = 0
      const body = req.body || {}
      const targetId = body.id || req.query.id
      const targetUrl = body.url || req.query.url
      const reqId = body.requesterId || req.query.requesterId
      const reqNid = body.requesterNid || req.query.requesterNid

      if (!targetId && !targetUrl) {
        return sendJson(res, 400, { success: false, error: 'معرف العنصر أو رابطه مطلوب للحذف.' })
      }

      const { isSuperAdmin } = await verifyRequester(sql, reqId, reqNid)
      if (!isSuperAdmin) {
        return sendJson(res, 403, {
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

      return sendJson(res, 200, {
        success: true,
        message: 'تم حذف العنصر بنجاح من المعرض وقاعدة البيانات.'
      })
    }

    return sendJson(res, 405, { success: false, error: 'طريقة غير مدعومة.' })
  } catch (err) {
    console.error('Gallery API error:', err)
    return sendJson(res, 500, { success: false, error: err.message || 'خطأ في الخادم.' })
  }
}
