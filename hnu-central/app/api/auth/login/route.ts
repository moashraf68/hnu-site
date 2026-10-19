import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcryptjs from 'bcryptjs'
import { sql } from '@vercel/postgres'
import { createSession } from '@/lib/auth'

const LoginSchema = z.object({
  nationalId: z.string().length(14, 'رقم الهوية يجب أن يكون 14 رقماً'),
  password: z.string().min(6, 'كلمة المرور قصيرة جداً'),
})

export async function POST(req: NextRequest) {
  try {
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'بيانات الطلب غير صالحة' }, { status: 400 })
    }

    const parsed = LoginSchema.safeParse(body)
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? 'بيانات تسجيل الدخول غير صالحة'
      return NextResponse.json({ error: firstError }, { status: 400 })
    }

    const { nationalId, password } = parsed.data

    // NEVER log nationalId
    const result = await sql<{
      id: string
      password_hash: string
      role: string
      status: string
      full_name: string
    }>`
      SELECT id, password_hash, role, status, full_name
      FROM users
      WHERE national_id = ${nationalId}
      LIMIT 1
    `

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'بيانات تسجيل الدخول غير صحيحة' }, { status: 401 })
    }

    const user = result.rows[0]

    if (user.status === 'SUSPENDED') {
      return NextResponse.json({ error: 'تم إيقاف حسابك. تواصل مع الإدارة.' }, { status: 403 })
    }

    const passwordValid = await bcryptjs.compare(password, user.password_hash)
    if (!passwordValid) {
      return NextResponse.json({ error: 'بيانات تسجيل الدخول غير صحيحة' }, { status: 401 })
    }

    await createSession(user.id)

    return NextResponse.json({ success: true, role: user.role, name: user.full_name })
  } catch (err) {
    console.error('[LOGIN ERROR]', (err as Error)?.message)
    return NextResponse.json({ error: 'حدث خطأ في الخادم. حاول مرة أخرى.' }, { status: 500 })
  }
}
