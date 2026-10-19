import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/auth'

interface RouteContext {
  params: { id: string } | Promise<{ id: string }>
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const session = await getSession()
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'غير مصرح بالوصول' }, { status: 403 })
    }

    const { id } = await Promise.resolve(context.params)

    let isReviewed = true
    try {
      const body = await req.json()
      if (typeof body?.isReviewed === 'boolean') {
        isReviewed = body.isReviewed
      }
    } catch {
      // Default to true if empty body
    }

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
      SET is_reviewed = ${isReviewed}
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
    console.error('Error updating suggestion by id:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم أثناء تحديث الاقتراح' },
      { status: 500 }
    )
  }
}
