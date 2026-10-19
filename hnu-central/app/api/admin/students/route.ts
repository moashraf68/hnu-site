import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { sql } from '@/lib/db'

export async function GET() {
  const user = await getCurrentUser()
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }

  try {
    const res = await sql<{
      id: string
      full_name: string
      national_id: string
      college: string
      academic_year: string
      committee_id: string | null
      status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
      profile_photo: string | null
      eval_score: number | null
    }>`
      SELECT
        u.id,
        u.full_name,
        u.national_id,
        u.college,
        u.academic_year,
        u.committee_id,
        u.status,
        u.profile_photo,
        (
          SELECT score
          FROM evaluations
          WHERE student_id = u.id
          ORDER BY created_at DESC
          LIMIT 1
        ) as eval_score
      FROM users u
      WHERE u.role = 'STUDENT'
      ORDER BY u.created_at DESC
    `

    const students = res.rows.map((r) => ({
      id: r.id,
      fullName: r.full_name,
      nationalId: r.national_id,
      college: r.college,
      academicYear: r.academic_year,
      committeeId: r.committee_id ?? undefined,
      status: r.status,
      profilePhoto: r.profile_photo ?? undefined,
      evalScore: r.eval_score ? Number(r.eval_score) : null,
    }))

    return NextResponse.json({ students })
  } catch (err) {
    console.warn('[ADMIN_STUDENTS_GET_ERR]', err)
    return NextResponse.json({ students: [] })
  }
}
