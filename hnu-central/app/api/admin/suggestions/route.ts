import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/auth'

const patchSuggestionSchema = z.object({
  id: z.string().uuid('معرف الاقتراح غير صالح'),
  isReviewed: z.boolean().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'غير مصرح بالوصول' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10) || 20))
    const status = searchParams.get('status') // 'all' | 'reviewed' | 'unreviewed'

    const conditions: string[] = []
    const params: unknown[] = []

    if (status === 'reviewed') {
      conditions.push('is_reviewed = true')
    } else if (status === 'unreviewed') {
      conditions.push('is_reviewed = false')
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    const countSql = `SELECT COUNT(*)::int AS count FROM suggestions ${whereClause}`
    const countResult = await sql.query<{ count: number }>(countSql, params)
    const total = countResult.rows[0]?.count ?? 0
    const totalPages = Math.ceil(total / limit) || 1
    const offset = (page - 1) * limit

    const dataParams = [...params, limit, offset]
    const limitIdx = dataParams.length - 1
    const offsetIdx = dataParams.length

    const dataSql = `
      SELECT
        id,
        name,
        email,
        activity_name AS "activityName",
        audience,
        description,
        is_reviewed AS "isReviewed",
        created_at AS "createdAt"
      FROM suggestions
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${limitIdx} OFFSET $${offsetIdx}
    `

    const dataResult = await sql.query<{
      id: string
      name: string
      email: string | null
      activityName: string
      audience: string | null
      description: string
      isReviewed: boolean
      createdAt: string
    }>(dataSql, dataParams)

    return NextResponse.json({
      suggestions: dataResult.rows,
      total,
      page,
      totalPages,
    })
  } catch (error) {
    console.error('Error fetching admin suggestions:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم أثناء جلب الاقتراحات' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'غير مصرح بالوصول' }, { status: 403 })
    }

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'بيانات الطلب غير صالحة' }, { status: 400 })
    }

    const validation = patchSuggestionSchema.safeParse(body)
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'بيانات غير صالحة'
      return NextResponse.json({ error: firstError }, { status: 400 })
    }

    const { id, isReviewed } = validation.data
    const newIsReviewed = isReviewed !== undefined ? isReviewed : true

    const updateResult = await sql<{
      id: string
      name: string
      email: string | null
      activityName: string
      audience: string | null
      description: string
      isReviewed: boolean
      createdAt: string
    }>`
      UPDATE suggestions
      SET is_reviewed = ${newIsReviewed}
      WHERE id = ${id}
      RETURNING
        id,
        name,
        email,
        activity_name AS "activityName",
        audience,
        description,
        is_reviewed AS "isReviewed",
        created_at AS "createdAt"
    `

    if (updateResult.rows.length === 0) {
      return NextResponse.json({ error: 'الاقتراح غير موجود' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'تم تحديث حالة الاقتراح بنجاح',
      suggestion: updateResult.rows[0],
    })
  } catch (error) {
    console.error('Error updating suggestion:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم أثناء تحديث حالة الاقتراح' },
      { status: 500 }
    )
  }
}
