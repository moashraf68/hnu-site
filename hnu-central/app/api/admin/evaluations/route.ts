import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/auth'

const evaluationSchema = z.object({
  studentId: z.string().uuid('معرف الطالب غير صالح'),
  score: z
    .number()
    .min(0, 'الدرجة يجب ألا تقل عن 0')
    .max(10, 'الدرجة يجب ألا تزيد عن 10'),
  notes: z.string().trim().optional().nullable(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'غير مصرح بالوصول' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const studentId = searchParams.get('studentId')?.trim()

    let result
    if (studentId) {
      result = await sql<{
        id: string
        studentId: string
        score: number
        notes: string | null
        createdAt: string
        updatedAt: string
        studentName: string
        college: string
        academicYear: string
        committeeNameAr: string | null
      }>`
        SELECT
          e.id,
          e.student_id AS "studentId",
          e.score,
          e.notes,
          e.created_at AS "createdAt",
          e.updated_at AS "updatedAt",
          u.full_name AS "studentName",
          u.college,
          u.academic_year AS "academicYear",
          c.name_ar AS "committeeNameAr"
        FROM evaluations e
        INNER JOIN users u ON u.id = e.student_id
        LEFT JOIN committees c ON c.id = u.committee_id
        WHERE e.student_id = ${studentId}
        ORDER BY e.created_at DESC
      `
    } else {
      result = await sql<{
        id: string
        studentId: string
        score: number
        notes: string | null
        createdAt: string
        updatedAt: string
        studentName: string
        college: string
        academicYear: string
        committeeNameAr: string | null
      }>`
        SELECT
          e.id,
          e.student_id AS "studentId",
          e.score,
          e.notes,
          e.created_at AS "createdAt",
          e.updated_at AS "updatedAt",
          u.full_name AS "studentName",
          u.college,
          u.academic_year AS "academicYear",
          c.name_ar AS "committeeNameAr"
        FROM evaluations e
        INNER JOIN users u ON u.id = e.student_id
        LEFT JOIN committees c ON c.id = u.committee_id
        ORDER BY e.created_at DESC
        LIMIT 100
      `
    }

    return NextResponse.json({ evaluations: result.rows })
  } catch (error) {
    console.error('Error fetching evaluations:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم أثناء جلب التقييمات' },
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

    const validation = evaluationSchema.safeParse(body)
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'بيانات التقييم غير صالحة'
      return NextResponse.json({ error: firstError }, { status: 400 })
    }

    const { studentId, score, notes } = validation.data

    // Check student existence
    const studentCheck = await sql<{ id: string }>`
      SELECT id FROM users WHERE id = ${studentId} LIMIT 1
    `
    if (studentCheck.rows.length === 0) {
      return NextResponse.json({ error: 'الطالب غير موجود' }, { status: 404 })
    }

    const cleanNotes = notes && notes.trim().length > 0 ? notes.trim() : null

    const insertResult = await sql<{
      id: string
      studentId: string
      score: number
      notes: string | null
      createdAt: string
    }>`
      INSERT INTO evaluations (
        student_id,
        score,
        notes,
        created_at,
        updated_at
      ) VALUES (
        ${studentId},
        ${score},
        ${cleanNotes},
        NOW(),
        NOW()
      )
      RETURNING
        id,
        student_id AS "studentId",
        score,
        notes,
        created_at AS "createdAt"
    `

    return NextResponse.json(
      {
        success: true,
        message: 'تم تسجيل التقييم بنجاح',
        evaluation: insertResult.rows[0],
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error saving evaluation:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم أثناء تسجيل التقييم' },
      { status: 500 }
    )
  }
}
