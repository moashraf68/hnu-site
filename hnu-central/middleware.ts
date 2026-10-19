import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/login', '/register'],
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('cf_session')?.value
  const { pathname } = req.nextUrl

  let user: { user_id: string; role: string } | null = null

  if (token) {
    try {
      const result = await sql<{ user_id: string; role: string }>`
        SELECT s.user_id, u.role
        FROM sessions s
        INNER JOIN users u ON u.id = s.user_id
        WHERE s.token = ${token}
          AND s.expires_at > NOW()
        LIMIT 1
      `
      if (result.rows.length > 0) {
        user = result.rows[0]
      }
    } catch (err) {
      console.error('Middleware session lookup error:', err)
      user = null
    }
  }

  const isAuthenticated = Boolean(user)
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'

  // /admin/:path* → ADMIN or SUPER_ADMIN only
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return NextResponse.next()
  }

  // /dashboard/:path* → any authenticated user
  if (pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // /login or /register → if already authenticated redirect to /admin or /dashboard
  if (pathname === '/login' || pathname === '/register') {
    if (isAuthenticated) {
      if (isAdmin) {
        return NextResponse.redirect(new URL('/admin', req.url))
      }
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}
