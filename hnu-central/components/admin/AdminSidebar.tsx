'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Star,
  Lightbulb,
  LogOut,
  ChevronRight,
} from 'lucide-react'

interface AdminSidebarProps {
  user: { name: string; role: string; photo?: string | null }
}

const navItems = [
  { href: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/admin/students', label: 'الطلاب', icon: Users },
  { href: '/admin/events', label: 'الفعاليات', icon: CalendarDays },
  { href: '/admin/evaluations', label: 'التقييمات', icon: Star },
  { href: '/admin/suggestions', label: 'الاقتراحات', icon: Lightbulb },
]

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <aside
      style={{
        width: 260,
        minHeight: '100vh',
        background: 'var(--c1)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }}
    >
      {/* Brand */}
      <div
        style={{
          padding: '28px 24px 20px',
          borderBottom: '1px solid rgba(255,255,255,.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: 'var(--g)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              color: 'var(--c1)',
              fontSize: '1.1rem',
            }}
          >
            CF
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '.95rem', color: 'var(--g3)' }}>
              Central Family
            </div>
            <div style={{ fontSize: '.72rem', opacity: 0.6 }}>Admin Portal</div>
          </div>
        </div>
      </div>

      {/* User info */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user.photo ? (
            <Image
              src={user.photo}
              alt={user.name}
              width={40}
              height={40}
              style={{ borderRadius: '50%', border: '2px solid var(--g)', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'var(--g)',
                color: 'var(--c1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1rem',
              }}
            >
              {user.name?.[0] ?? 'A'}
            </div>
          )}
          <div>
            <div style={{ fontWeight: 700, fontSize: '.9rem', color: '#fff' }}>{user.name}</div>
            <div
              style={{
                fontSize: '.72rem',
                background: 'rgba(242,168,29,.2)',
                color: 'var(--g)',
                borderRadius: 999,
                padding: '1px 8px',
                display: 'inline-block',
                marginTop: 2,
              }}
            >
              {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '11px 14px',
              borderRadius: 12,
              marginBottom: 4,
              fontWeight: 600,
              fontSize: '.9rem',
              transition: '.2s',
              background: isActive(href) ? 'rgba(242,168,29,.18)' : 'transparent',
              color: isActive(href) ? 'var(--g3)' : 'rgba(255,255,255,.7)',
              textDecoration: 'none',
            }}
          >
            <Icon size={18} />
            <span style={{ flex: 1 }}>{label}</span>
            {isActive(href) && <ChevronRight size={14} />}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,.08)' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '11px 14px',
            borderRadius: 12,
            fontWeight: 600,
            fontSize: '.9rem',
            color: 'rgba(255,255,255,.6)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'inherit',
            fontFamily: 'inherit',
            transition: '.2s',
          }}
          onMouseEnter={(e) => {
            const t = e.currentTarget
            t.style.background = 'rgba(200,16,46,.2)'
            t.style.color = '#ff6b6b'
          }}
          onMouseLeave={(e) => {
            const t = e.currentTarget
            t.style.background = 'none'
            t.style.color = 'rgba(255,255,255,.6)'
          }}
        >
          <LogOut size={18} />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  )
}
