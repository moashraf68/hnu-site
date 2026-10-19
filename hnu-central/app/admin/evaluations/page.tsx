'use client'

import { useEffect, useState, useCallback } from 'react'
import { Star, Search } from 'lucide-react'
import Image from 'next/image'

interface Evaluation {
  id: string
  score: number
  notes: string
  created_at: string
  student_id: string
  full_name: string
  profile_photo: string
  college: string
  academic_year: string
}

function ScoreBadge({ score }: { score: number }) {
  const color = score < 4 ? '#C8102E' : score < 7 ? '#92400e' : '#166534'
  const bg = score < 4 ? '#fef2f2' : score < 7 ? '#fef3c7' : '#dcfce7'
  return (
    <span style={{ background: bg, color, borderRadius: 999, padding: '4px 14px', fontWeight: 800, fontSize: '1rem' }}>
      {score}/10
    </span>
  )
}

export default function AdminEvaluationsPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchEvals = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/evaluations')
      const data = await res.json()
      setEvaluations(data.evaluations ?? [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchEvals() }, [fetchEvals])

  const filtered = evaluations.filter(e =>
    !search || e.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  const avgScore = evaluations.length > 0
    ? (evaluations.reduce((s, e) => s + e.score, 0) / evaluations.length).toFixed(2)
    : '—'

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: 'var(--c1)', fontWeight: 800, fontSize: '1.5rem' }}>التقييمات</h1>
        <p style={{ color: 'var(--c2)', marginTop: 4 }}>
          إجمالي التقييمات: {evaluations.length} &nbsp;•&nbsp; متوسط الدرجات: {avgScore}
        </p>
      </div>

      {/* Search */}
      <div className="card" style={{ padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Search size={16} style={{ color: 'var(--c2)', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="بحث باسم الطالب..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, fontSize: '.95rem', color: 'var(--c1)', fontFamily: 'inherit' }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--c2)' }}>جاري التحميل...</div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 60, color: 'var(--c2)' }}>
          {search ? 'لا توجد نتائج للبحث' : 'لا توجد تقييمات بعد'}
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--bei)', borderBottom: '2px solid var(--g)' }}>
                  {['الطالب', 'الكلية', 'الفرقة', 'الدرجة', 'ملاحظات', 'التاريخ'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--c1)', fontWeight: 800, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((ev, idx) => (
                  <tr key={ev.id} style={{ borderBottom: '1px solid var(--bei)', background: idx % 2 === 0 ? '#fff' : 'var(--bg)' }}>
                    <td style={{ padding: '10px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {ev.profile_photo ? (
                          <Image src={ev.profile_photo} alt={ev.full_name} width={34} height={34} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--bei)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--c1)' }}>
                            {ev.full_name?.[0]}
                          </div>
                        )}
                        <span style={{ fontWeight: 600, color: 'var(--c1)' }}>{ev.full_name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 16px', color: 'var(--c2)', fontSize: '.85rem' }}>{ev.college}</td>
                    <td style={{ padding: '10px 16px', color: 'var(--c2)', fontSize: '.85rem' }}>{ev.academic_year}</td>
                    <td style={{ padding: '10px 16px' }}><ScoreBadge score={ev.score} /></td>
                    <td style={{ padding: '10px 16px', color: 'var(--c2)', fontSize: '.85rem', maxWidth: 200 }}>{ev.notes || '—'}</td>
                    <td style={{ padding: '10px 16px', color: 'var(--c2)', fontSize: '.82rem', whiteSpace: 'nowrap' }}>
                      {new Date(ev.created_at).toLocaleDateString('ar-EG')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
