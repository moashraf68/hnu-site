import 'server-only'
import { cookies } from 'next/headers'
import { sql } from '@vercel/postgres'
import bcryptjs from 'bcryptjs'
import crypto from 'crypto'
import type { User } from './db'

export const SESSION_COOKIE_NAME = 'cf_session'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
}

// ─── Session Management ────────────────────────────────────────────────────────

export async function createSession(userId: string): Promise<void> {
  const token = crypto.randomBytes(64).toString('hex')
  const expiresAt = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000) // 7 days

  await sql`
    INSERT INTO sessions (token, user_id, expires_at)
    VALUES (${token}, ${userId}, ${expiresAt.toISOString()})
  `

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, COOKIE_OPTIONS)
}

export async function getSession(): Promise<{ userId: string; role: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) return null

  try {
    const result = await sql<{ user_id: string; role: string; expires_at: string }>`
      SELECT s.user_id, u.role, s.expires_at
      FROM sessions s
      INNER JOIN users u ON u.id = s.user_id
      WHERE s.token = ${token}
        AND s.expires_at > NOW()
      LIMIT 1
    `

    if (result.rows.length === 0) return null

    const session = result.rows[0]
    return { userId: session.user_id, role: session.role }
  } catch (err) {
    console.error('getSession error:', err)
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession()
  if (!session) return null

  try {
    const result = await sql<User>`
      SELECT
        id,
        national_id        AS "nationalId",
        password_hash      AS "passwordHash",
        full_name          AS "fullName",
        email,
        phone,
        college,
        academic_year      AS "academicYear",
        committee_id       AS "committeeId",
        role,
        status,
        profile_photo      AS "profilePhoto",
        created_at         AS "createdAt",
        updated_at         AS "updatedAt"
      FROM users
      WHERE id = ${session.userId}
      LIMIT 1
    `

    if (result.rows.length === 0) return null
    return result.rows[0]
  } catch (err) {
    console.error('getCurrentUser error:', err)
    return null
  }
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (token) {
    await sql`DELETE FROM sessions WHERE token = ${token}`
  }

  cookieStore.delete(SESSION_COOKIE_NAME)
}

// ─── Password Utilities ────────────────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash)
}
