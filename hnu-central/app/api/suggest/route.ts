import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sql } from '@/lib/db'

const suggestionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'الاسم يجب ألا يقل عن حرفين'),
  email: z
    .string()
    .trim()
    .email('صيغة البريد الإلكتروني غير صالحة')
    .optional()
    .or(z.literal(''))
    .nullable(),
  activityName: z
    .string()
    .trim()
    .min(2, 'اسم الفعالية أو النشاط المقترح مطلوب'),
  audience: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .nullable(),
  description: z
    .string()
    .trim()
    .min(5, 'يرجى كتابة وصف أوضح للفكرة المقترحة (5 أحرف على الأقل)'),
})

export async function POST(req: NextRequest) {
  try {
    let rawData: Record<string, unknown> = {}
    const contentType = req.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      try {
        rawData = await req.json()
      } catch {
        return NextResponse.json(
          { error: 'بيانات الطلب غير صالحة (JSON غير صحيح)' },
          { status: 400 }
        )
      }
    } else {
      const formData = await req.formData()
      rawData = {
        name: formData.get('name'),
        email: formData.get('email'),
        activityName: formData.get('activityName'),
        audience: formData.get('audience'),
        description: formData.get('description'),
      }
    }

    const validation = suggestionSchema.safeParse(rawData)
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'بيانات الاقتراح غير صالحة'
      return NextResponse.json({ error: firstError }, { status: 400 })
    }

    const { name, email, activityName, audience, description } = validation.data
    const cleanEmail = email && email.trim().length > 0 ? email.trim() : null
    const cleanAudience = audience && audience.trim().length > 0 ? audience.trim() : null

    await sql`
      INSERT INTO suggestions (
        name,
        email,
        activity_name,
        audience,
        description,
        is_reviewed,
        created_at
      ) VALUES (
        ${name},
        ${cleanEmail},
        ${activityName},
        ${cleanAudience},
        ${description},
        false,
        NOW()
      )
    `

    return NextResponse.json(
      { success: true, message: 'شكراً! تم إرسال اقتراحك بنجاح' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error submitting suggestion:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم أثناء إرسال الاقتراح' },
      { status: 500 }
    )
  }
}
