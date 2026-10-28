/**
 * 05_portal.js - Student Member Portal Views & Authentication Forms
 * Part of HNU Students For Egypt Platform
 */

function studentView(curUser) {
  const isAr = lang === "ar";
  const activeQr = getStore("cf_active_qr", { active: false, title: "", image: "" });
  const allAttendances = getStore("cf_attendance", []);
  const myAttendances = allAttendances.filter(a => a.studentId === curUser.id || a.nid === curUser.nid);
  const alreadyAttended = activeQr.active && myAttendances.some(a => (a.event || a.eventTitle) === activeQr.title);

  return `<section class="portal-sec"><div class="wrap">
    <!-- Top Member Header -->
    <div class="admin-bar">
      <div class="admin-bar-user">
        <button type="button" class="av-zoom-btn" data-photo="${curUser.photo || '/assets/images/logo.png'}" data-name="${curUser.name}" title="${isAr ? 'عرض صورتك الشخصية' : 'View profile photo'}">
          <div class="admin-av">
            <img src="${curUser.photo || '/assets/images/logo.png'}" alt="${curUser.name}" onerror="this.onerror=null;this.src='/assets/images/logo.png'">
          </div>
        </button>
        <div>
          <h2>${isAr ? 'أهلاً بك يا ' + curUser.name : 'Welcome, ' + curUser.name}</h2>
          <p>${getCollegeName(curUser.college)} — ${getYearName(curUser.year)} • ${getComName(curUser.com)}</p>
        </div>
      </div>
      <div class="admin-bar-actions">
        <button type="button" class="btn sm ghost" id="btn-toggle-edit-profile" style="height:38px;padding:0 16px;font-size:.85rem;font-weight:700">
          ${isAr ? 'تعديل الملف' : 'Edit Profile'}
        </button>
        <button type="button" class="btn sm" id="logout-btn" style="height:38px;padding:0 18px;font-size:.85rem;background:#C8102E;color:#fff;border-color:transparent;font-weight:700">
          ${isAr ? 'تسجيل الخروج' : 'Logout'}
        </button>
      </div>
    </div>

    <!-- Edit Profile Inline Card (if toggled) -->
    ${isEditingProfile ? `
      <div class="admin-card" id="edit-profile-card" style="border:2px solid var(--g);background:#fff;margin-bottom:24px">
        <div class="admin-card-head">
          <h3>${isAr ? 'تعديل بيانات الحساب الشخصي' : 'Edit Account Details'}</h3>
          <button type="button" class="btn sm ghost" id="btn-close-edit-profile">${isAr ? 'إلغاء' : 'Cancel'}</button>
        </div>
        <form class="form" id="edit-profile-form">
          <div class="form-row">
            <label>${isAr ? 'رقم الهاتف / الواتساب' : 'Phone / WhatsApp'}
              <input name="phone" type="tel" value="${curUser.phone || ''}" required>
            </label>
            <label>${isAr ? 'البريد الإلكتروني' : 'Email'}
              <input name="email" type="email" value="${curUser.email || ''}">
            </label>
          </div>

          <div class="form-row">
            <label>${isAr ? 'كلمة المرور الجديدة (اتركها فارغة إذا لم ترغب بتغييرها)' : 'New Password (Optional)'}
              <div class="pw-wrap">
                <input name="newPw" type="password" minlength="6" placeholder="******">
                <button type="button" class="pw-toggle-btn" tabindex="-1" aria-label="Toggle password visibility"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
              </div>
            </label>
            <label>${isAr ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
              <div class="pw-wrap">
                <input name="newPwConfirm" type="password" minlength="6" placeholder="******">
                <button type="button" class="pw-toggle-btn" tabindex="-1" aria-label="Toggle password visibility"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
              </div>
            </label>
          </div>

          <div class="photo-uploader">
            <div class="photo-preview" id="edit-photo-preview-box">
              <img src="${editPhotoBase64 || curUser.photo || '/assets/images/logo.png'}" style="width:100%;height:100%;object-fit:cover" alt="">
            </div>
            <div>
              <label style="cursor:pointer;font-weight:700;color:var(--c1);display:block;margin-bottom:4px">
                ${isAr ? 'تغيير الصورة الشخصية' : 'Change Profile Photo'}
              </label>
              <input type="file" id="edit-photo-file-input" accept="image/*" style="font-size:.85rem;border:none;padding:0;min-height:unset">
            </div>
          </div>

          <div style="display:flex;gap:10px;margin-top:14px">
            <button class="btn big" type="submit" style="flex:1">
              ${isAr ? 'حفظ التعديلات في الحساب' : 'Save Profile Changes'}
            </button>
          </div>
          <p class="msg" id="edit-prof-msg" role="status" aria-live="polite"></p>
        </form>
      </div>
    ` : ''}

    <!-- 1. Attendance QR Code Section (ONLY APPEARS WHEN ADMIN STARTS SESSION!) -->
    ${activeQr.active ? `
      <div class="admin-card" style="margin-bottom:24px;border:2.5px solid var(--g2);background:#fff;box-shadow:0 12px 36px rgba(59,38,22,.08)">
        <div class="admin-card-head" style="align-items:center">
          <div>
            <h3>${isAr ? 'كود تسجيل الحضور الرسمي' : 'Official Attendance QR Code'}</h3>
            <p style="color:var(--c2);font-size:.85rem;margin:3px 0 0">
              ${isAr ? `جلسة حضور نشطة الآن: <b>${activeQr.title}</b> — أرِ هذا الكود لكاميرا الأدمن لتسجيل حضورك.` : `Live session: <b>${activeQr.title}</b> — Show this QR to the admin to scan.`}
            </p>
          </div>
          <span class="sbadge act" style="font-size:.85rem;padding:4px 14px">
            ${isAr ? 'جلسة حضور نشطة الآن' : 'Live Session Active'}
          </span>
        </div>

        <div style="display:flex;flex-direction:column;align-items:center;text-align:center;padding:16px 10px">
          ${alreadyAttended ? `
            <div style="padding:24px 28px;background:#e6f4ea;color:#137333;font-weight:700;border-radius:18px;border:2px solid #a8dab5;margin:8px 0;max-width:440px;width:100%">
              <div style="display:flex;justify-content:center;margin-bottom:8px">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#137333" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <div style="font-size:1.15rem;margin-bottom:4px">${isAr ? `تم تسجيل حضورك في "${activeQr.title}" بنجاح!` : `Your attendance for "${activeQr.title}" has been recorded!`}</div>
              <p style="font-size:.85rem;color:#1e4620;margin:0;font-weight:500">${isAr ? 'تم توثيق حضورك رسمياً في كشف الفعالية وقاعدة البيانات.' : 'Your attendance is officially recorded in family database.'}</p>
            </div>
          ` : `
            <!-- Personal QR Canvas (generated client-side only during active session) -->
            <div style="background:#fff;padding:16px;border-radius:20px;border:3px solid var(--g2);box-shadow:0 10px 28px rgba(59,38,22,.12);display:inline-block">
              <canvas id="member-qr-canvas" style="display:block;margin:0 auto;width:210px;height:210px;border-radius:10px"></canvas>
            </div>

            <div style="margin-top:14px">
              <h4 style="color:var(--c1);font-size:1.15rem;margin:0 0 4px">${curUser.name}</h4>
              <p style="margin:0;font-size:.9rem;color:var(--c2)">
                <span class="sbadge act" style="font-size:.8rem;padding:2px 10px">${getComName(curUser.com)}</span>
                • <b>${getCollegeName(curUser.college)}</b> (${getYearName(curUser.year)})
              </p>
            </div>

            <div style="margin-top:14px;width:100%;max-width:440px">
              <div style="padding:12px 20px;background:#fff3cd;color:#856404;font-weight:700;border-radius:14px;border:1.5px solid #ffeeba;font-size:.9rem">
                ${isAr ? 'في انتظار مسح الأدمن للـ QR الخاص بك...' : 'Waiting for admin to scan your QR...'}
              </div>
            </div>
          `}
        </div>
      </div>
    ` : `
      <div class="admin-card" style="margin-bottom:24px;border:2px dashed var(--bei);background:var(--bg);text-align:center;padding:34px 20px;border-radius:20px">
        <h3 style="color:var(--c1);font-size:1.2rem;margin:0 0 6px">${isAr ? 'لا توجد جلسة حضور نشطة حالياً' : 'No Active Attendance Session'}</h3>
        <p style="color:var(--c2);font-size:.9rem;max-width:480px;margin:0 auto;line-height:1.7">
          ${isAr ? 'سيظهر كود الـ QR الخاص بك هنا تلقائياً فور بدء الأدمن لجلسة تسجيل الحضور في أي اجتماع أو فعالية.' : 'Your personal attendance QR code will appear here automatically when the admin starts an attendance session.'}
        </p>
        <span class="sbadge pen" style="margin-top:16px;display:inline-block;padding:5px 16px;font-size:.85rem">
          ${isAr ? 'في انتظار بدء جلسة الحضور' : 'Standby for Live Session'}
        </span>
      </div>
    `}

    <!-- 2. Two Main Cards: Membership Info & Events Attended (NO EVALUATION SHOWN!) -->
    <div class="two" style="margin-bottom:24px">
      <div class="card">
        <h3>${isAr ? 'بيانات العضوية الرسمية' : 'Official Membership Info'}</h3>
        <p><b>${isAr ? 'اللجنة:' : 'Committee:'}</b> ${getComName(curUser.com)}</p>
        <p><b>${isAr ? 'الكلية:' : 'Faculty:'}</b> ${getCollegeName(curUser.college)}</p>
        <p><b>${isAr ? 'الفرقة الدراسية:' : 'Year:'}</b> ${getYearName(curUser.year)}</p>
        <p><b>${isAr ? 'الحالة:' : 'Status:'}</b> <span class="sbadge act">${curUser.status || (isAr ? 'نشط' : 'Active')}</span></p>
        <p><b>${isAr ? 'الرقم القومي:' : 'National ID:'}</b> <code>${maskNid(curUser.nid)}</code></p>
        <p><b>${isAr ? 'رقم الهاتف:' : 'Phone:'}</b> ${curUser.phone || '—'}</p>
        ${(curUser.score !== undefined && curUser.score !== null && curUser.score > 0) || curUser.notes ? `
          <div style="margin-top:12px;padding-top:12px;border-top:1.5px solid var(--bei)">
            ${curUser.score !== undefined && curUser.score !== null ? `<p><b>${isAr ? 'تقييم أدائك:' : 'Your Score:'}</b> ${getScoreBadge(curUser.score || 0)}</p>` : ''}
            ${curUser.notes ? `<p style="margin-top:8px"><b>${isAr ? 'ملاحظات الإدارة:' : 'Admin Notes:'}</b><br><span style="color:var(--c2);font-size:.9rem;line-height:1.6;display:block;margin-top:4px;padding:10px 14px;background:var(--bei);border-radius:10px;white-space:pre-wrap">${curUser.notes}</span></p>` : ''}
          </div>
        ` : ''}
      </div>

      <div class="card">
        <h3>${isAr ? 'الفعاليات التي شاركت فيها' : 'Events Participated In'}</h3>
        <p style="margin-bottom:12px">
          <b>${isAr ? 'إجمالي الفعاليات المسجلة:' : 'Total Events Attended:'}</b> 
          <span style="color:var(--g2);font-weight:800;font-size:1.1rem">${myAttendances.length} ${isAr ? 'فعاليات' : 'events'}</span>
        </p>
        ${myAttendances.length === 0 ? `
          <div style="padding:16px;background:rgba(242,168,29,.08);border-radius:12px;font-size:.88rem;color:var(--c2)">
            ${isAr ? 'لم تسجل حضوراً في أي فعالية بعد. فور بدء أي فعالية سيظهر كود الـ QR أعلاه لتسجيل حضورك مباشرة.' : 'You have not attended any events yet. When an event begins, the QR will appear above.'}
          </div>
        ` : `
          <div style="display:flex;flex-direction:column;gap:8px">
            ${myAttendances.map(a => `
              <div style="padding:10px 14px;background:#fff;border:1.5px solid var(--bei);border-radius:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px">
                <div>
                  <b style="color:var(--c1)">${a.event || a.eventTitle}</b>
                  <div style="font-size:.8rem;color:var(--c2)">${a.date || ''} • ${a.time || ''}</div>
                </div>
                <span class="sbadge act">${isAr ? 'تم الحضور' : 'Attended'}</span>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    </div>

    <!-- 3. Family Events Showcase -->
    <div class="admin-card" style="margin-bottom:24px">
      <div class="admin-card-head">
        <h3>${isAr ? 'أحدث فعاليات وأنشطة الأسرة' : 'Family Events & Activities'}</h3>
        <a href="/#events" data-link class="btn ghost sm">${isAr ? 'عرض الكل' : 'View All'}</a>
      </div>
      <div class="dash-events-grid">
        ${C.events.map(ev => `
          <div class="dash-ev-card">
            <img src="${ev.img}" alt="${t(ev.title)}" class="dash-ev-img" loading="lazy">
            <div class="dash-ev-body">
              <small>${t(ev.date)}</small>
              <h4>${t(ev.title)}</h4>
              <p>${t(ev.desc).slice(0, 110)}...</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- 4. Family Gallery Showcase -->
    <div class="admin-card" style="margin-bottom:24px">
      <div class="admin-card-head">
        <h3>${isAr ? 'لحظات من أنشطة وميديا الأسرة' : 'Gallery & Moments'}</h3>
        <a href="/#gallery" data-link class="btn ghost sm">${isAr ? 'المعرض الكامل' : 'Full Gallery'}</a>
      </div>
      <div class="dash-gal-grid">
        ${getGalleryItems().filter(x => x.type !== 'VIDEO').slice(0, 8).map((g, i) => `
          <img src="${g.url || g}" alt="${g.title || 'Gallery ' + (i + 1)}" class="dash-gal-thumb" data-g="${i}" loading="lazy" onerror="this.onerror=null;this.src='/assets/images/logo.png'">
        `).join('')}
      </div>
    </div>
  </div></section>`;
}
