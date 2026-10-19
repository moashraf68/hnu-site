import 'server-only'
import { sql } from '@vercel/postgres'

// Re-export sql for server-side DB queries
export { sql }

// ─── TypeScript Interfaces ────────────────────────────────────────────────────────
export interface User {
  id: string
  nationalId: string
  passwordHash: string
  fullName: string
  email?: string
  phone?: string
  college: string
  academicYear: string
  committeeId?: string
  role: 'STUDENT' | 'ADMIN' | 'SUPER_ADMIN'
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  profilePhoto?: string
  createdAt: Date
  updatedAt: Date
}

export interface Committee {
  id: string
  nameAr: string
  nameEn: string
  descriptionAr?: string
  descriptionEn?: string
  icon?: string
}

export interface Event {
  id: string
  titleAr: string
  titleEn: string
  descriptionAr?: string
  descriptionEn?: string
  date: Date
  committeeId: string
  qrToken: string
  isActive: boolean
}

export interface Attendance {
  id: string
  eventId: string
  userId: string
  scannedAt: Date
}

export interface Evaluation {
  id: string
  studentId: string
  score: number // 0-10
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  token: string
  userId: string
  expiresAt: Date
}
