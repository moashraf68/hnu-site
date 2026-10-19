import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/auth'

interface RouteContext {
  params: { id: string } | Promise<{ id: string }>
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const session = await getSession()
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'غير مصرح بالوصول' }, { status: 403 })
    }

    const { id } = await Promise.resolve(context.params)

    const eventResult = await sql<{
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
      WHERE e.id = ${id}
      GROUP BY e.id, c.name_ar
      LIMIT 1
    `

    if (eventResult.rows.length === 0) {
      return NextResponse.json({ error: 'الفعالية غير موجودة' }, { status: 404 })
    }

    const event = eventResult.rows[0]

    // Generate QR code data URL
    const qrCodeDataUrl = await QRCode.toDataURL(event.qrToken, {
      width: 400,
      margin: 2,
      color: {
        dark: '#3B2616',
        light: '#FBF6EA',
      },
    })

    // Fetch attendees list
    const attendeesResult = await sql<{
      id: string
      scannedAt: string
      studentName: string
      college: string
      academicYear: string
    }>`
      SELECT
        a.id,
        a.scanned_at AS "scannedAt",
        u.full_name AS "studentName",
        u.college,
        u.academic_year AS "academicYear"
      FROM attendance a
      INNER JOIN users u ON u.id = a.user_id
      WHERE a.event_id = ${id}
      ORDER BY a.scanned_at DESC
    `

    return NextResponse.json({
      event: {
        ...event,
        qrCodeDataUrl,
        attendees: attendeesResult.rows,
      },
    })
  } catch (error) {
    console.error('Error fetching event detail with QR code:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم أثناء جلب تفاصيل الفعالية' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const session = await getSession()
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'غير مصرح بالوصول' }, { status: 403 })
    }

    const { id } = await Promise.resolve(context.params)

    // Check if event exists
    const checkEvent = await sql<{ id: string; is_active: boolean }>`
      SELECT id, is_active FROM events WHERE id = ${id} LIMIT 1
    `

    if (checkEvent.rows.length === 0) {
      return NextResponse.json({ error: 'الفعالية غير موجودة' }, { status: 404 })
    }

    let explicitIsActive: boolean | undefined
    try {
      const body = await req.json()
      if (typeof body?.isActive === 'boolean') {
        explicitIsActive = body.isActive
      }
    } catch {
      // Body not provided or not JSON — toggle existing status
    }

    let updatedResult
    if (explicitIsActive !== undefined) {
      updatedResult = await sql<{ id: string; isActive: boolean }>`
        UPDATE events
        SET is_active = ${explicitIsActive}
        WHERE id = ${id}
        RETURNING id, is_active AS "isActive"
      `
    } else {
      updatedResult = await sql<{ id: string; isActive: boolean }>`
        UPDATE events
        SET is_active = NOT is_active
        WHERE id = ${id}
        RETURNING id, is_active AS "isActive"
      `
    }

    const updated = updatedResult.rows[0]

    return NextResponse.json({
      success: true,
      message: `تم ${updated.isActive ? 'تفعيل' : 'إلغاء تفعيل'} تسجيل الحضور للفعالية بنجاح`,
      isActive: updated.isActive,
    })
  } catch (error) {
    console.error('Error toggling event status:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم أثناء تحديث حالة الفعالية' },
      { status: 500 }
    )
  }
}
