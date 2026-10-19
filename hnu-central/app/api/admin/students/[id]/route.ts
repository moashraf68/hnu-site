import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/auth'

interface RouteContext {
  params: { id: string } | Promise<{ id: string }>
}

const updateStudentSchema = z.object({
  committeeId: z.string().trim().nullable().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
})

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const session = await getSession()
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'غير مصرح بالوصول' }, { status: 403 })
    }

    const { id } = await Promise.resolve(context.params)

    const userResult = await sql<{
      id: string
      nationalId: string
      fullName: string
      email: string | null
      phone: string | null
      college: string
      academicYear: string
      committeeId: string | null
      role: string
      status: string
      profilePhoto: string | null
      createdAt: string
      updatedAt: string
      committeeNameAr: string | null
      committeeNameEn: string | null
    }>`
      SELECT
        u.id,
        u.national_id AS "nationalId",
        u.full_name AS "fullName",
        u.email,
        u.phone,
        u.college,
        u.academic_year AS "academicYear",
        u.committee_id AS "committeeId",
        u.role,
        u.status,
        u.profile_photo AS "profilePhoto",
        u.created_at AS "createdAt",
        u.updated_at AS "updatedAt",
        c.name_ar AS "committeeNameAr",
        c.name_en AS "committeeNameEn"
      FROM users u
      LEFT JOIN committees c ON c.id = u.committee_id
      WHERE u.id = ${id}
      LIMIT 1
    `

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'الطالب غير موجود' }, { status: 404 })
    }

    const student = userResult.rows[0]

    // Fetch evaluations
    const evalResult = await sql<{
      id: string
      score: number
      notes: string | null
      createdAt: string
    }>`
      SELECT id, score, notes, created_at AS "createdAt"
      FROM evaluations
      WHERE student_id = ${id}
      ORDER BY created_at DESC
    `

    // Fetch attendance
    const attendanceResult = await sql<{
      id: string
      scannedAt: string
      eventTitleAr: string
      eventDate: string
    }>`
      SELECT
        a.id,
        a.scanned_at AS "scannedAt",
        e.title_ar AS "eventTitleAr",
        e.date AS "eventDate"
      FROM attendance a
      JOIN events e ON e.id = a.event_id
      WHERE a.user_id = ${id}
      ORDER BY a.scanned_at DESC
    `

    return NextResponse.json({
      student: {
        ...student,
        evaluations: evalResult.rows,
        attendance: attendanceResult.rows,
      },
    })
  } catch (error) {
    console.error('Error fetching student detail:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم أثناء جلب تفاصيل الطالب' },
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

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'بيانات الطلب غير صالحة' }, { status: 400 })
    }

    const validation = updateStudentSchema.safeParse(body)
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'بيانات التحديث غير صالحة'
      return NextResponse.json({ error: firstError }, { status: 400 })
    }

    const { committeeId, status } = validation.data

    if (committeeId === undefined && status === undefined) {
      return NextResponse.json(
        { error: 'يرجى تقديم بيانات للتحديث (committeeId أو status)' },
        { status: 400 }
      )
    }

    // Verify student exists
    const checkUser = await sql<{ id: string }>`
      SELECT id FROM users WHERE id = ${id} LIMIT 1
    `
    if (checkUser.rows.length === 0) {
      return NextResponse.json({ error: 'الطالب غير موجود' }, { status: 404 })
    }

    // Perform selective update
    let updatedStudent
    if (committeeId !== undefined && status !== undefined) {
      const cleanCommitteeId = committeeId && committeeId.trim().length > 0 ? committeeId.trim() : null
      const res = await sql`
        UPDATE users
        SET committee_id = ${cleanCommitteeId}, status = ${status}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING id, full_name AS "fullName", committee_id AS "committeeId", status, updated_at AS "updatedAt"
      `
      updatedStudent = res.rows[0]
    } else if (committeeId !== undefined) {
      const cleanCommitteeId = committeeId && committeeId.trim().length > 0 ? committeeId.trim() : null
      const res = await sql`
        UPDATE users
        SET committee_id = ${cleanCommitteeId}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING id, full_name AS "fullName", committee_id AS "committeeId", status, updated_at AS "updatedAt"
      `
      updatedStudent = res.rows[0]
    } else {
      const res = await sql`
        UPDATE users
        SET status = ${status!}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING id, full_name AS "fullName", committee_id AS "committeeId", status, updated_at AS "updatedAt"
      `
      updatedStudent = res.rows[0]
    }

    return NextResponse.json({
      success: true,
      message: 'تم تحديث بيانات الطالب بنجاح',
      student: updatedStudent,
    })
  } catch (error) {
    console.error('Error updating student:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم أثناء تحديث بيانات الطالب' },
      { status: 500 }
    )
  }
}
