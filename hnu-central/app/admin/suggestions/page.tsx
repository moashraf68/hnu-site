'use client'

import { useEffect, useState, useCallback } from 'react'
import { Check, Inbox, Eye } from 'lucide-react'

interface Suggestion {
  id: string
  name: string
  email: string
  activity_name: string
  audience: string
  description: string
  is_reviewed: boolean
  created_at: string
}

type Filter = 'all' | 'unreviewed' | 'reviewed'

export default function AdminSuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')
  const [unreviewedCount, setUnreviewedCount] = useState(0)
  const [expanded, setExpanded] = useState<string | null>(null)

  const fetchSuggestions = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/suggestions?filter=${filter}`)
      const data = await res.json()
      setSuggestions(data.suggestions ?? [])
      setUnreviewedCount(data.unreviewedCount ?? 0)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => { fetchSuggestions() }, [fetchSuggestions])

  async function markReviewed(id: string, isReviewed: boolean) {
    await fetch('/api/admin/suggestions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isReviewed }),
    })
    fetchSuggestions()
  }

  const tabs: { key: Filter; label: string }[] = [
    { key: 'all', label: 'الكل' },
    { key: 'unreviewed', label: `غير مراجعة (${unreviewedCount})` },
    { key: 'reviewed', label: 'تمت المراجعة' },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: 'var(--c1)', fontWeight: 800, fontSize: '1.5rem' }}>الاقتراحات</h1>
        <p style={{ color: 'var(--c2)', marginTop: 4 }}>اقتراحات الأعضاء والزوار للفعاليات والأنشطة</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              padding: '8px 18px',
              borderRadius: 999,
              border: '1.5px solid',
              borderColor: filter === tab.key ? 'var(--g)' : 'var(--bei)',
              background: filter === tab.key ? 'var(--g)' : 'transparent',
              color: filter === tab.key ? 'var(--c1)' : 'var(--c2)',
              fontWeight: 700,
              fontSize: '.88rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: '.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--c2)' }}>جاري التحميل...</div>
      ) : suggestions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 60, color: 'var(--c2)' }}>
          <Inbox size={48} style={{ margin: '0 auto 16px', opacity: .3 }} />
          <p>لا توجد اقتراحات في هذه الفئة</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 14 }}>
          {suggestions.map(sug => (
            <div
              key={sug.id}
              className="card"
              style={{
                padding: '20px 24px',
                borderRight: `4px solid ${sug.is_reviewed ? 'var(--bei)' : 'var(--g)'}`,
                opacity: sug.is_reviewed ? .75 : 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <h3 style={{ color: 'var(--c1)', fontWeight: 800, fontSize: '1.05rem' }}>
                      {sug.activity_name}
                    </h3>
                    {!sug.is_reviewed && (
                      <span style={{ background: 'var(--g)', color: 'var(--c1)', borderRadius: 999, padding: '2px 10px', fontSize: '.75rem', fontWeight: 800 }}>
                        جديد
                      </span>
                    )}
                  </div>
                  <p style={{ color: 'var(--c2)', fontSize: '.85rem', marginBottom: 4 }}>
                    من: <strong>{sug.name}</strong>
                    {sug.email && <> &nbsp;•&nbsp; {sug.email}</>}
                    {sug.audience && <> &nbsp;•&nbsp; الجمهور: {sug.audience}</>}
                  </p>
                  {expanded === sug.id ? (
                    <p style={{ color: 'var(--tx)', fontSize: '.9rem', marginTop: 8, lineHeight: 1.7 }}>
                      {sug.description}
                    </p>
                  ) : (
                    <p style={{ color: 'var(--tx)', fontSize: '.9rem', marginTop: 8 }}>
                      {sug.description.slice(0, 120)}{sug.description.length > 120 ? '...' : ''}
                    </p>
                  )}
                  {sug.description.length > 120 && (
                    <button
                      onClick={() => setExpanded(expanded === sug.id ? null : sug.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--g2)', fontWeight: 700, fontSize: '.83rem', cursor: 'pointer', fontFamily: 'inherit', marginTop: 6 }}
                    >
                      {expanded === sug.id ? 'عرض أقل' : 'عرض الكل'}
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                  <span style={{ color: 'var(--c2)', fontSize: '.8rem' }}>
                    {new Date(sug.created_at).toLocaleDateString('ar-EG')}
                  </span>
                  <button
                    onClick={() => markReviewed(sug.id, !sug.is_reviewed)}
                    className="btn sm"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      background: sug.is_reviewed ? 'var(--bei)' : '#166534',
                      color: sug.is_reviewed ? 'var(--c2)' : '#fff',
                    }}
                  >
                    <Check size={14} />
                    {sug.is_reviewed ? 'إلغاء المراجعة' : 'تم المراجعة'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
