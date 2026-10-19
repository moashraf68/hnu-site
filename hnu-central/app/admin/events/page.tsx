'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, QrCode, ToggleLeft, ToggleRight, X } from 'lucide-react'
import Image from 'next/image'

interface Event {
  id: string
  title_ar: string
  title_en: string
  description_ar: string
  date: string
  committee_name_ar: string
  qr_token: string
  is_active: boolean
  attendance_count: number
}

interface NewEventForm {
  titleAr: string
  titleEn: string
  date: string
  descriptionAr: string
  descriptionEn: string
  committeeId: string
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [qrModal, setQrModal] = useState<{ eventId: string; qrDataUrl: string; titleAr: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState('')

  const [form, setForm] = useState<NewEventForm>({
    titleAr: '', titleEn: '', date: '', descriptionAr: '', descriptionEn: '', committeeId: '',
  })

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/events')
      const data = await res.json()
      setEvents(data.events ?? [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setMsg('')
    const res = await fetch('/api/admin/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titleAr: form.titleAr,
        titleEn: form.titleEn,
        date: new Date(form.date).toISOString(),
        descriptionAr: form.descriptionAr || undefined,
        descriptionEn: form.descriptionEn || undefined,
        committeeId: form.committeeId || undefined,
      }),
    })
    const data = await res.json()
    if (data.success) {
      setMsg('✅ تم إنشاء الفعالية بنجاح')
      setShowModal(false)
      setForm({ titleAr: '', titleEn: '', date: '', descriptionAr: '', descriptionEn: '', committeeId: '' })
      fetchEvents()
    } else {
      setMsg(`❌ ${data.error}`)
    }
    setSubmitting(false)
  }

  async function handleToggle(id: string, current: boolean) {
    await fetch(`/api/admin/events/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !current }),
    })
    fetchEvents()
  }

  async function showQR(id: string) {
    const res = await fetch(`/api/admin/events/${id}`)
    const data = await res.json()
    if (data.event) {
      setQrModal({ eventId: id, qrDataUrl: data.event.qrDataUrl, titleAr: data.event.title_ar })
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ color: 'var(--c1)', fontWeight: 800, fontSize: '1.5rem' }}>الفعاليات</h1>
          <p style={{ color: 'var(--c2)', marginTop: 4 }}>إدارة فعاليات الأسرة وأكواد QR</p>
        </div>
        <button className="btn" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={18} />
          إنشاء فعالية
        </button>
      </div>

      {msg && (
        <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 20, background: msg.startsWith('✅') ? '#dcfce7' : '#fef2f2', color: msg.startsWith('✅') ? '#166534' : 'var(--red)', fontWeight: 600 }}>
          {msg}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--c2)' }}>جاري التحميل...</div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {events.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 60, color: 'var(--c2)' }}>
              لا توجد فعاليات بعد. أنشئ أول فعالية!
            </div>
          ) : events.map((ev) => (
            <div key={ev.id} className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <h3 style={{ color: 'var(--c1)', fontWeight: 800 }}>{ev.title_ar}</h3>
                  <span style={{
                    fontSize: '.75rem', fontWeight: 700, borderRadius: 999, padding: '2px 10px',
                    background: ev.is_active ? '#dcfce7' : '#fef2f2',
                    color: ev.is_active ? '#166534' : 'var(--red)',
                  }}>
                    {ev.is_active ? 'نشطة' : 'مغلقة'}
                  </span>
                </div>
                <p style={{ color: 'var(--c2)', fontSize: '.85rem' }}>
                  📅 {new Date(ev.date).toLocaleDateString('ar-EG')} &nbsp;•&nbsp;
                  👥 {ev.attendance_count} حاضر
                  {ev.committee_name_ar && <>&nbsp;•&nbsp; {ev.committee_name_ar}</>}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                <button
                  className="btn sm ghost"
                  onClick={() => showQR(ev.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <QrCode size={16} />
                  QR Code
                </button>
                <button
                  className="btn sm"
                  onClick={() => handleToggle(ev.id, ev.is_active)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: ev.is_active ? 'var(--red)' : '#166534' }}
                >
                  {ev.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  {ev.is_active ? 'أغلق' : 'فعّل'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Event Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card" style={{ width: '100%', maxWidth: 560, padding: 32, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: 'var(--c1)', fontWeight: 800, fontSize: '1.2rem' }}>إنشاء فعالية جديدة</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c2)' }}>
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleCreate} style={{ display: 'grid', gap: 16 }}>
              <div className="form-group">
                <label>عنوان الفعالية (عربي) *</label>
                <input required value={form.titleAr} onChange={e => setForm(f => ({ ...f, titleAr: e.target.value }))} placeholder="مثال: يوم الانضمام الأول" />
              </div>
              <div className="form-group">
                <label>Event Title (English) *</label>
                <input required value={form.titleEn} onChange={e => setForm(f => ({ ...f, titleEn: e.target.value }))} placeholder="e.g. First Joining Day" dir="ltr" />
              </div>
              <div className="form-group">
                <label>تاريخ الفعالية *</label>
                <input required type="datetime-local" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>وصف (عربي)</label>
                <textarea rows={3} value={form.descriptionAr} onChange={e => setForm(f => ({ ...f, descriptionAr: e.target.value }))} placeholder="وصف الفعالية..." style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group">
                <label>Description (English)</label>
                <textarea rows={2} value={form.descriptionEn} onChange={e => setForm(f => ({ ...f, descriptionEn: e.target.value }))} placeholder="Event description..." dir="ltr" style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="submit" className="btn" disabled={submitting} style={{ flex: 1 }}>
                  {submitting ? 'جاري الإنشاء...' : 'إنشاء الفعالية'}
                </button>
                <button type="button" className="btn ghost" onClick={() => setShowModal(false)}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {qrModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card" style={{ maxWidth: 380, width: '100%', padding: 32, textAlign: 'center' }}>
            <button onClick={() => setQrModal(null)} style={{ float: 'left', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c2)' }}>
              <X size={22} />
            </button>
            <h2 style={{ color: 'var(--c1)', fontWeight: 800, marginBottom: 8 }}>كود QR</h2>
            <p style={{ color: 'var(--c2)', fontSize: '.9rem', marginBottom: 20 }}>{qrModal.titleAr}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrModal.qrDataUrl} alt="QR Code" style={{ width: 260, height: 260, margin: '0 auto', display: 'block', borderRadius: 12 }} />
            <p style={{ marginTop: 16, fontSize: '.82rem', color: 'var(--c2)' }}>أعرض هذا الكود للأعضاء لتسجيل حضورهم</p>
            <a
              href={qrModal.qrDataUrl}
              download={`qr-${qrModal.titleAr}.png`}
              className="btn"
              style={{ marginTop: 16, display: 'inline-block' }}
            >
              تحميل الكود
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
