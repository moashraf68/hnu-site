import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { sql } from '@/lib/db'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }

  try {
    const { qrToken } = await req.json()
    if (!qrToken || typeof qrToken !== 'string') {
      return NextResponse.json({ error: 'رمز الفعالية غير صالح' }, { status: 400 })
    }

    const token = qrToken.trim()

    // Find event matching qrToken or id
    const eventRes = await sql<{ id: string; title_ar: string; is_active: boolean }>`
      SELECT id, title_ar, is_active
      FROM events
      WHERE qr_token = ${token} OR id = ${token}
      LIMIT 1
    `

    if (eventRes.rows.length === 0) {
      return NextResponse.json(
        { error: 'رمز الفعالية غير صحيح أو الفعالية غير موجودة' },
        { status: 404 }
      )
    }

    const event = eventRes.rows[0]

    if (!event.is_active) {
      return NextResponse.json(
        { error: 'التسجيل في هذه الفعالية مغلق حالياً' },
        { status: 400 }
      )
    }

    // Check if already attended
    const attCheck = await sql<{ id: string }>`
      SELECT id FROM attendance
      WHERE event_id = ${event.id} AND user_id = ${user.id}
      LIMIT 1
    `

    if (attCheck.rows.length > 0) {
      return NextResponse.json(
        { error: 'لقد قمت بتسجيل الحضور في هذه الفعالية مسبقاً' },
        { status: 409 }
      )
    }

    const attId = crypto.randomUUID()
    await sql`
      INSERT INTO attendance (id, event_id, user_id, scanned_at)
      VALUES (${attId}, ${event.id}, ${user.id}, NOW())
    `

    return NextResponse.json({
      success: true,
      message: `تم تسجيل حضورك بنجاح في فعالية "${event.title_ar}"!`,
      eventId: event.id,
    })
  } catch (err) {
    console.error('[ATTENDANCE_SCAN_ERR]', err)
    return NextResponse.json({ error: 'حدث خطأ أثناء تسجيل الحضور' }, { status: 500 })
  }
}
