import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import crypto from 'crypto'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/auth'

const createEventSchema = z.object({
  titleAr: z
    .string()
    .trim()
    .min(2, 'عنوان الفعالية بالعربية يجب ألا يقل عن حرفين'),
  titleEn: z
    .string()
    .trim()
    .min(2, 'عنوان الفعالية بالإنجليزية يجب ألا يقل عن حرفين'),
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'تاريخ الفعالية غير صالح',
    }),
  descriptionAr: z.string().trim().optional().nullable(),
  descriptionEn: z.string().trim().optional().nullable(),
  committeeId: z.string().trim().optional().nullable(),
})

export async function GET() {
  try {
    const session = await getSession()
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'غير مصرح بالوصول' }, { status: 403 })
    }

    const result = await sql<{
      id: string
      titleAr: string
      titleEn: string
      descriptionAr: string | null
      descriptionEn: string | null
      date: string
      committeeId: string | null
      qrToken: string
      isActive: boolean
      createdAt: string
      committeeNameAr: string | null
      attendanceCount: number
    }>`
      SELECT
        e.id,
        e.title_ar AS "titleAr",
        e.title_en AS "titleEn",
        e.description_ar AS "descriptionAr",
        e.description_en AS "descriptionEn",
        e.date,
        e.committee_id AS "committeeId",
        e.qr_token AS "qrToken",
        e.is_active AS "isActive",
        e.created_at AS "createdAt",
        c.name_ar AS "committeeNameAr",
        COUNT(a.id)::int AS "attendanceCount"
      FROM events e
      LEFT JOIN committees c ON c.id = e.committee_id
      LEFT JOIN attendance a ON a.event_id = e.id
      GROUP BY e.id, c.name_ar
      ORDER BY e.date DESC
    `

    return NextResponse.json({ events: result.rows })
  } catch (error) {
    console.error('Error fetching admin events:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم أثناء جلب الفعاليات' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
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

    const validation = createEventSchema.safeParse(body)
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'بيانات الفعالية غير صالحة'
      return NextResponse.json({ error: firstError }, { status: 400 })
    }

    const {
      titleAr,
      titleEn,
      date,
      descriptionAr,
      descriptionEn,
      committeeId,
    } = validation.data

    const cleanCommitteeId =
      committeeId && committeeId.trim().length > 0 ? committeeId.trim() : null
    const cleanDescAr =
      descriptionAr && descriptionAr.trim().length > 0 ? descriptionAr.trim() : null
    const cleanDescEn =
      descriptionEn && descriptionEn.trim().length > 0 ? descriptionEn.trim() : null

    const eventDate = new Date(date)
    const qrToken = crypto.randomUUID()

    const insertResult = await sql<{
      id: string
      titleAr: string
      titleEn: string
      descriptionAr: string | null
      descriptionEn: string | null
      date: string
      committeeId: string | null
      qrToken: string
      isActive: boolean
      createdAt: string
    }>`
      INSERT INTO events (
        title_ar,
        title_en,
        description_ar,
        description_en,
        date,
        committee_id,
        qr_token,
        is_active,
        created_at
      ) VALUES (
        ${titleAr},
        ${titleEn},
        ${cleanDescAr},
        ${cleanDescEn},
        ${eventDate.toISOString()},
        ${cleanCommitteeId},
        ${qrToken},
        true,
        NOW()
      )
      RETURNING
        id,
        title_ar AS "titleAr",
        title_en AS "titleEn",
        description_ar AS "descriptionAr",
        description_en AS "descriptionEn",
        date,
        committee_id AS "committeeId",
        qr_token AS "qrToken",
        is_active AS "isActive",
        created_at AS "createdAt"
    `

    return NextResponse.json(
      {
        success: true,
        message: 'تم إنشاء الفعالية بنجاح',
        event: insertResult.rows[0],
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم أثناء إنشاء الفعالية' },
      { status: 500 }
    )
  }
}
