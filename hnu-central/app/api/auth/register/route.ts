import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sql } from '@vercel/postgres'
import crypto from 'crypto'
import { hashPassword, createSession } from '@/lib/auth'
import { uploadProfilePhoto } from '@/lib/cloudinary'

const RegisterSchema = z.object({
  fullName: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  nationalId: z.string().length(14, 'رقم الهوية يجب أن يكون 14 رقماً'),
  password: z.string().min(8, 'كلمة المرور يجب ألا تقل عن 8 أحرف'),
  confirmPassword: z.string().min(8),
  phone: z.string().min(10, 'رقم التليفون غير صالح'),
  email: z.string().email('بريد إلكتروني غير صالح').optional().or(z.literal('')),
  college: z.string().min(2, 'الكلية مطلوبة'),
  academicYear: z.string().min(2, 'الفرقة الدراسية مطلوبة'),
  committeeId: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirmPassword'],
})

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const fullName = formData.get('fullName') as string
    const nationalId = formData.get('nationalId') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const phone = formData.get('phone') as string
    const email = (formData.get('email') as string) || undefined
    const college = formData.get('college') as string
    const academicYear = formData.get('academicYear') as string
    const committeeId = (formData.get('committeeId') as string) || null
    const profilePhotoFile = formData.get('profilePhoto') as File | null

    const parsed = RegisterSchema.safeParse({
      fullName,
      nationalId,
      password,
      confirmPassword,
      phone,
      email,
      college,
      academicYear,
      committeeId: committeeId || undefined,
    })

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'بيانات غير صحيحة', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existing = await sql<{ id: string }>`
      SELECT id FROM users WHERE national_id = ${nationalId} LIMIT 1
    `
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'رقم الهوية القومية مسجل بالفعل. يرجى تسجيل الدخول.' },
        { status: 409 }
      )
    }

    // Handle photo upload
    let photoUrl = '/assets/images/placeholder-avatar.png'
    if (profilePhotoFile && profilePhotoFile.size > 0) {
      try {
        const arrayBuffer = await profilePhotoFile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        photoUrl = await uploadProfilePhoto(buffer)
      } catch (uploadErr) {
        console.warn('[CLOUDINARY_UPLOAD_FALLBACK]', uploadErr)
        // Fallback default avatar if Cloudinary is unconfigured
      }
    }

    const passwordHash = await hashPassword(password)
    const newUserId = crypto.randomUUID()

    await sql`
      INSERT INTO users (
        id, national_id, password_hash, full_name, email, phone,
        college, academic_year, committee_id, role, status, profile_photo,
        created_at, updated_at
      )
      VALUES (
        ${newUserId}, ${nationalId}, ${passwordHash}, ${fullName}, ${email ?? null}, ${phone},
        ${college}, ${academicYear}, ${committeeId}, 'STUDENT', 'ACTIVE', ${photoUrl},
        NOW(), NOW()
      )
    `

    // Auto log in new user
    await createSession(newUserId)

    return NextResponse.json({
      success: true,
      userId: newUserId,
      name: fullName,
    })
  } catch (err) {
    console.error('[REGISTER ERROR]', err)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم أثناء إنشاء الحساب.' },
      { status: 500 }
    )
  }
}
