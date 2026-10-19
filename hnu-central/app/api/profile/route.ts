import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, verifyPassword, hashPassword } from '@/lib/auth'
import { sql } from '@/lib/db'
import { uploadProfilePhoto } from '@/lib/cloudinary'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }

  return NextResponse.json({ user })
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const phone = formData.get('phone') as string
    const email = (formData.get('email') as string) || null
    const photoFile = formData.get('profilePhoto') as File | null

    let photoUrl = user.profilePhoto

    if (photoFile && photoFile.size > 0) {
      try {
        const buffer = Buffer.from(await photoFile.arrayBuffer())
        photoUrl = await uploadProfilePhoto(buffer)
      } catch (err) {
        console.warn('[CLOUDINARY_UPLOAD_ERR]', err)
      }
    }

    await sql`
      UPDATE users
      SET phone = ${phone},
          email = ${email},
          profile_photo = ${photoUrl},
          updated_at = NOW()
      WHERE id = ${user.id}
    `

    const updatedUser = {
      ...user,
      phone,
      email: email || undefined,
      profilePhoto: photoUrl,
    }

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (err) {
    console.error('[PROFILE_UPDATE_ERR]', err)
    return NextResponse.json({ error: 'فشل تحديث البيانات' }, { status: 500 })
  }
}
