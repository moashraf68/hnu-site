/**
 * 04_admin.js - Admin Dashboard Views (Power BI, Members Directory, QR Session)
 * Part of HNU Students For Egypt Platform
 */

function renderMobileAttendeeCards(attendees, isAr) {
  if (!attendees || attendees.length === 0) {
    return `<div class="att-mobile-cards" style="padding:18px;text-align:center;color:var(--c2);background:var(--bei);border-radius:14px;font-size:.88rem">${isAr ? 'لم يقم أي طالب بتسجيل الحضور في هذه الفعالية بعد.' : 'No attendees recorded yet.'}</div>`;
  }
  return `
    <div class="att-mobile-cards" style="margin-top:10px">
      ${attendees.map((att, i) => `
        <div style="background:#fff;border:1.5px solid var(--bei);border-radius:14px;padding:12px 14px;box-shadow:0 2px 10px rgba(59,38,22,.04);display:flex;flex-direction:column;gap:8px">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
            <div style="display:flex;align-items:center;gap:10px;min-width:0">
              <button type="button" class="av-zoom-btn" data-photo="${att.photo || '/assets/images/logo.png'}" data-name="${att.studentName}" title="${isAr ? 'اضغط لتكبير الصورة' : 'Click to zoom'}">
                <div style="width:40px;height:40px;border-radius:50%;overflow:hidden;border:2px solid var(--g);background:#fff;flex-shrink:0">
                  <img src="${att.photo || '/assets/images/logo.png'}" style="width:100%;height:100%;object-fit:cover" alt="${att.studentName}" onerror="this.onerror=null;this.src='/assets/images/logo.png'">
                </div>
              </button>
              <div style="min-width:0">
                <div style="display:flex;align-items:center;gap:6px">
                  <span style="font-size:.76rem;font-weight:800;color:var(--c1);background:var(--bei);border-radius:999px;padding:1px 7px;flex-shrink:0">${i + 1}</span>
                  <b style="font-size:.92rem;color:var(--c1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${att.studentName}</b>
                </div>
                <div style="font-size:.78rem;color:var(--c2);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                  ${getCollegeName(att.college || '—')}${att.year ? ' • ' + getYearName(att.year) : ''}
                </div>
              </div>
            </div>
            ${att.phone ? `
              <a href="tel:${att.phone}" class="btn sm" style="padding:6px 12px;min-height:32px;height:32px;border-radius:999px;font-size:.78rem;flex-shrink:0;text-decoration:none" title="اتصال">
                📞 <span style="font-size:.74rem">${isAr ? 'اتصال' : 'Call'}</span>
              </a>
            ` : ''}
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding-top:6px;border-top:1px dashed var(--bei);font-size:.76rem;color:var(--c2)">
            <span class="sbadge" style="background:var(--bei);color:var(--c1);font-size:.74rem;padding:2px 8px">${getComName(att.committee)}</span>
            <span>⏰ <code>${att.time || att.scannedAt || '—'}</code></span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function adminView(curUser, rawUsers) {
  const users = (rawUsers || []).filter(u => u && u.nid !== '12121212121212');
  const isAr = lang === "ar";
  const isSuperAdmin = curUser && (curUser.role === 'SUPER_ADMIN' || curUser.isSuperAdmin === true);
  const sugs = getStore("cf_sugs", INIT_SUGS);
  const galleryItems = getGalleryItems();
  const activeQr = getStore("cf_active_qr", { active: false, title: "", image: "" });
  const deletedArchiveIds = getStore("cf_deleted_archive_ids", []);
  const rawArchive = getStore("cf_events_archive", null);
  const eventsArchive = (Array.isArray(rawArchive) ? rawArchive : INIT_EVENTS_ARCHIVE).filter(e => !deletedArchiveIds.includes(e.id));
  const evaluableMembers = users.filter(u => u.role !== "ADMIN" && u.role !== "SUPER_ADMIN");
  const filteredStudents = users.filter(s => !studentSearchQuery || s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) || s.college.includes(studentSearchQuery) || (s.com && s.com.includes(studentSearchQuery)));
  const filteredEvalMembers = evaluableMembers.filter(s => !evalSearchQuery || s.name.toLowerCase().includes(evalSearchQuery.toLowerCase()) || (s.nid && s.nid.includes(evalSearchQuery)) || (s.college && s.college.includes(evalSearchQuery)));
  const selectedMember = evaluableMembers.find(s => s.id === selectedEvalStudentId) || filteredEvalMembers[0] || evaluableMembers[0];
  const attendances = getStore("cf_attendance", []);
  const activeEventAttendees = attendances.filter(a => a.event === activeQr.title);

  return `<div class="admin-wrap">
    <div class="admin-bar">
      <div class="admin-bar-user">
        <button type="button" class="av-zoom-btn" data-photo="${curUser.photo || '/assets/images/logo.png'}" data-name="${curUser.name}" title="${isAr ? 'عرض صورتك الشخصية' : 'View profile photo'}">
          <div class="admin-av">
            <img src="${curUser.photo || '/assets/images/logo.png'}" alt="${curUser.name}" onerror="this.onerror=null;this.parentElement.textContent='👑'">
          </div>
        </button>
        <div>
          <h2>${curUser.name}</h2>
          <p>${curUser.title} — ${getCollegeName(curUser.college)}</p>
        </div>
      </div>
      <div class="admin-bar-actions">
        <button type="button" class="btn sm" id="logout-btn" style="height:38px;padding:0 18px;font-size:.85rem;background:#C8102E;color:#fff;border-color:transparent;font-weight:700">🚪 ${isAr ? 'تسجيل الخروج' : 'Logout'}</button>
      </div>
    </div>

    <div class="admin-subnav">
      <button type="button" class="asub-btn ${curAtab === 'overview' ? 'active' : ''}" data-atab="overview">📊 ${isAr ? 'الإحصائيات العامة' : 'General Stats'}</button>
      <button type="button" class="asub-btn ${curAtab === 'students' ? 'active' : ''}" data-atab="students">👥 ${isAr ? 'إدارة الأعضاء والطلاب' : 'Members Directory'} (${users.length})</button>
      <button type="button" class="asub-btn ${curAtab === 'evals' ? 'active' : ''}" data-atab="evals">⭐ ${isAr ? 'نظام تقييم الأداء' : 'Evaluations'} (${evaluableMembers.length})</button>
      <button type="button" class="asub-btn ${curAtab === 'qr' ? 'active' : ''}" data-atab="qr">📱 ${isAr ? 'نظام الـ QR والحضور' : 'QR Attendance'} ${activeQr.active ? '🟢' : ''}</button>
      <button type="button" class="asub-btn ${curAtab === 'sugs' ? 'active' : ''}" data-atab="sugs">💡 ${isAr ? 'صندوق الاقتراحات' : 'Suggestions'} (${sugs.filter(x => !x.done).length})</button>
      ${isSuperAdmin ? `
        <button type="button" class="asub-btn ${curAtab === 'gallery' ? 'active' : ''}" data-atab="gallery">🖼️ ${isAr ? 'إدارة الميديا والمعرض' : 'Media Gallery'} (${galleryItems.length})</button>
      ` : ''}
    </div>

    ${curAtab === 'overview' ? (() => {
      // --- Computed analytics data ---
      const totalMembers = users.length;
      const memberOnly = users.filter(u => u.role === 'STUDENT');
      const highPerf = memberOnly.filter(u => (u.score||0) >= 8).length;
      const medPerf  = memberOnly.filter(u => (u.score||0) >= 5 && (u.score||0) < 8).length;
      const lowPerf  = memberOnly.filter(u => (u.score||0) < 5).length;
      const avgScore = memberOnly.length ? (memberOnly.reduce((a,u)=>a+(u.score||0),0)/memberOnly.length).toFixed(1) : '—';
      const totalEvents = eventsArchive.length + (activeQr.active ? 1 : 0);

      // Committee breakdown
      const comBreakdown = Object.entries(COMMITTEES_MAP).map(([k,v]) => ({
        key: k, label: v.split(' ')[0],
        count: users.filter(u=>u.com===k).length,
        score: users.filter(u=>u.com===k&&u.role==='STUDENT').length ?
          (users.filter(u=>u.com===k&&u.role==='STUDENT').reduce((a,u)=>a+(u.score||0),0)/users.filter(u=>u.com===k&&u.role==='STUDENT').length).toFixed(1) : '0'
      }));
      const maxComCount = Math.max(...comBreakdown.map(c=>c.count), 1);

      // College breakdown
      const colBreakdown = COLLEGES.map(c => ({
        name: c, count: users.filter(u=>u.college===c).length
      })).filter(c=>c.count>0).sort((a,b)=>b.count-a.count).slice(0,6);
      const maxColCount = Math.max(...colBreakdown.map(c=>c.count), 1);

      // Year breakdown
      const yearBreakdown = YEARS.map(y => ({
        name: y.replace('الفرقة ',''), count: users.filter(u=>u.year===y).length
      })).filter(y=>y.count>0);

      // Top performers
      const topMembers = [...memberOnly].sort((a,b)=>(b.score||0)-(a.score||0)).slice(0,3);
      const attendedIds = new Set(attendances.map(a=>a.studentId||a.user_id));
      const topAttendees = memberOnly.filter(u=>attendedIds.has(u.id)).length;

      return `
      <div class="dash-stats">
        <div class="dstat"><div class="dstat-val">${totalMembers}</div><div class="dstat-lbl">${isAr?'إجمالي الأعضاء المسجلين':'Total Registered Members'}</div></div>
        <div class="dstat"><div class="dstat-val" style="color:#137333">${highPerf}</div><div class="dstat-lbl">${isAr?'أعضاء ممتازون (8+/10)':'High Performers (8+/10)'}</div></div>
        <div class="dstat"><div class="dstat-val" style="color:var(--g2)">${avgScore}</div><div class="dstat-lbl">${isAr?'متوسط تقييم الأداء العام':'Average Performance Score'}</div></div>
        <div class="dstat"><div class="dstat-val">${attendances.length}</div><div class="dstat-lbl">${isAr?'تسجيلات حضور بالـ QR':'QR Attendance Records'}</div></div>
        <div class="dstat"><div class="dstat-val">${totalEvents}</div><div class="dstat-lbl">${isAr?'إجمالي الفعاليات المسجلة':'Total Events Recorded'}</div></div>
        <div class="dstat"><div class="dstat-val" style="color:${activeQr.active?'#137333':'var(--c2)'}">${activeQr.active?(isAr?'نشطة':'Active'):(isAr?'متوقفة':'Inactive')}</div><div class="dstat-lbl">${isAr?'حالة جلسة الحضور الحالية':'Current QR Session Status'}</div></div>
      </div>

      <!-- BI Grid Row 1: Committee Distribution + Score Distribution -->
      <div class="bi-grid">
        <div class="bi-card">
          <div class="bi-card-head">
            <h4>📊 ${isAr?'توزيع الأعضاء على اللجان':'Members per Committee'}</h4>
            <span class="sbadge act">${users.length} ${isAr?'عضو':'Members'}</span>
          </div>
          <div class="bi-bars-list">
            ${comBreakdown.map(c=>`
              <div class="bi-bar-item">
                <div class="bi-bar-meta">
                  <span>${c.label}</span>
                  <span style="color:var(--g2)">${c.count} ${isAr?'عضو':'members'} • متوسط ${c.score}/10</span>
                </div>
                <div class="bi-bar-track">
                  <div class="bi-bar-fill" style="width:${c.count?Math.round(c.count/maxComCount*100):0}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="bi-card">
          <div class="bi-card-head">
            <h4>🎯 ${isAr?'توزيع مستويات الأداء':'Performance Tier Distribution'}</h4>
            <span class="sbadge pen">${memberOnly.length} ${isAr?'عضو قابل للتقييم':'Evaluable'}</span>
          </div>
          <div class="bi-bars-list" style="margin-bottom:18px">
            ${[
              {label: isAr?'ممتاز (8-10)':'Excellent (8-10)', count: highPerf, color:'#137333', bg:'#e6f4ea'},
              {label: isAr?'جيد (5-7.9)':'Good (5-7.9)', count: medPerf, color:'#b45309', bg:'#fef7e0'},
              {label: isAr?'يحتاج دعم (0-4.9)':'Needs Support (0-4.9)', count: lowPerf, color:'#c5221f', bg:'#fce8e6'}
            ].map(t=>`
              <div class="bi-bar-item">
                <div class="bi-bar-meta">
                  <span style="color:${t.color};font-weight:800">${t.label}</span>
                  <span>${t.count} ${isAr?'عضو':'members'} (${memberOnly.length?Math.round(t.count/memberOnly.length*100):0}%)</span>
                </div>
                <div class="bi-bar-track" style="height:14px">
                  <div class="bi-bar-fill" style="width:${memberOnly.length?Math.round(t.count/memberOnly.length*100):0}%;background:${t.color}"></div>
                </div>
              </div>
            `).join('')}
          </div>
          <!-- Mini donut-style visual -->
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:4px">
            ${[
              {label:isAr?'ممتاز':'Excellent', pct: memberOnly.length?Math.round(highPerf/memberOnly.length*100):0, color:'#137333'},
              {label:isAr?'جيد':'Good', pct: memberOnly.length?Math.round(medPerf/memberOnly.length*100):0, color:'#F59E0B'},
              {label:isAr?'يحتاج دعم':'Needs Support', pct: memberOnly.length?Math.round(lowPerf/memberOnly.length*100):0, color:'#c5221f'}
            ].map(t=>`
              <div style="flex:1;min-width:80px;background:#F9F7F4;border-radius:12px;padding:10px;text-align:center;border:2px solid ${t.color}20">
                <div style="font-size:1.5rem;font-weight:900;color:${t.color}">${t.pct}%</div>
                <div style="font-size:.72rem;color:var(--c2);font-weight:700;margin-top:2px">${t.label}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- BI Grid Row 2: College + Year breakdown -->
      <div class="bi-grid">
        <div class="bi-card">
          <div class="bi-card-head">
            <h4>🏛️ ${isAr?'توزيع الأعضاء على الكليات (Top 6)':'Members by Faculty (Top 6)'}</h4>
          </div>
          <div class="bi-bars-list">
            ${colBreakdown.map((c,i)=>`
              <div class="bi-bar-item">
                <div class="bi-bar-meta">
                  <span style="font-size:.82rem">${c.name}</span>
                  <span style="color:var(--g2)">${c.count}</span>
                </div>
                <div class="bi-bar-track">
                  <div class="bi-bar-fill" style="width:${Math.round(c.count/maxColCount*100)}%;background:hsl(${30+i*25},70%,${40+i*5}%)"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="bi-card">
          <div class="bi-card-head">
            <h4>🎓 ${isAr?'توزيع الأعضاء على الفرق الدراسية':'Members by Academic Year'}</h4>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:10px">
            ${yearBreakdown.map((y,i)=>`
              <div style="background:#F9F7F4;border-radius:14px;padding:12px;text-align:center;border:2px solid var(--bei)">
                <div style="font-size:1.6rem;font-weight:900;color:var(--c1)">${y.count}</div>
                <div style="font-size:.72rem;color:var(--c2);font-weight:700;margin-top:2px">${y.name}</div>
              </div>
            `).join('')}
          </div>

          <div style="margin-top:20px;border-top:1px solid var(--bei);padding-top:14px">
            <h4 style="color:var(--c1);font-size:.95rem;margin-bottom:10px">📅 ${isAr?'الحضور في الفعاليات':'Events Attendance'}</h4>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
              <div style="background:var(--bei);border-radius:12px;padding:12px;text-align:center">
                <div style="font-size:1.5rem;font-weight:900;color:var(--c1)">${eventsArchive.length}</div>
                <div style="font-size:.75rem;color:var(--c2);font-weight:700">${isAr?'فعاليات مؤرشفة':'Archived Events'}</div>
              </div>
              <div style="background:var(--bei);border-radius:12px;padding:12px;text-align:center">
                <div style="font-size:1.5rem;font-weight:900;color:${activeQr.active?'#137333':'var(--c2)'}">${activeQr.active?'1':'0'}</div>
                <div style="font-size:.75rem;color:var(--c2);font-weight:700">${isAr?'جلسة نشطة الآن':'Active Session'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Podium: Top 3 Performers -->
      ${topMembers.length >= 1 ? `
      <div class="admin-card">
        <div class="admin-card-head">
          <h3>🏆 ${isAr?'لوحة شرف أفضل المتميزين':'Honor Board — Top Performers'}</h3>
          <span class="sbadge act">${isAr?'مرتب تنازلياً بالتقييم':'Sorted by Score'}</span>
        </div>
        <div class="bi-podium">
          ${topMembers[1] ? `
          <div class="bi-podium-step second">
            <div style="font-size:.75rem;color:#64748B;font-weight:700;margin-bottom:6px">2nd</div>
            <button type="button" class="av-zoom-btn" data-photo="${topMembers[1].photo||'/assets/images/logo.png'}" data-name="${topMembers[1].name}">
              <div style="width:56px;height:56px;border-radius:50%;overflow:hidden;border:3px solid #94A3B8;background:#fff;margin-bottom:8px">
                <img src="${topMembers[1].photo||'/assets/images/logo.png'}" style="width:100%;height:100%;object-fit:cover" onerror="this.onerror=null;this.src='/assets/images/logo.png'">
              </div>
            </button>
            <div class="bi-medal">🥈</div>
            <div style="font-weight:800;color:var(--c1);font-size:.88rem;text-align:center;max-width:120px;word-break:break-word">${topMembers[1].name}</div>
            <div style="font-size:.8rem;color:var(--c2)">${getComName(topMembers[1].com)}</div>
            <div style="font-size:1.3rem;font-weight:900;color:#64748B;margin-top:6px">${topMembers[1].score||0}/10</div>
          </div>` : '<div></div>'}

          ${topMembers[0] ? `
          <div class="bi-podium-step first">
            <div style="font-size:.75rem;color:#F59E0B;font-weight:800;margin-bottom:6px">1st ⭐</div>
            <button type="button" class="av-zoom-btn" data-photo="${topMembers[0].photo||'/assets/images/logo.png'}" data-name="${topMembers[0].name}">
              <div style="width:70px;height:70px;border-radius:50%;overflow:hidden;border:3.5px solid #F59E0B;background:#fff;margin-bottom:8px;box-shadow:0 0 0 4px rgba(245,158,11,.2)">
                <img src="${topMembers[0].photo||'/assets/images/logo.png'}" style="width:100%;height:100%;object-fit:cover" onerror="this.onerror=null;this.src='/assets/images/logo.png'">
              </div>
            </button>
            <div class="bi-medal">🥇</div>
            <div style="font-weight:900;color:var(--c1);font-size:.95rem;text-align:center;max-width:130px;word-break:break-word">${topMembers[0].name}</div>
            <div style="font-size:.8rem;color:var(--c2)">${getComName(topMembers[0].com)}</div>
            <div style="font-size:1.6rem;font-weight:900;color:#F59E0B;margin-top:6px">${topMembers[0].score||0}/10</div>
          </div>` : '<div></div>'}

          ${topMembers[2] ? `
          <div class="bi-podium-step third">
            <div style="font-size:.75rem;color:#B45309;font-weight:700;margin-bottom:6px">3rd</div>
            <button type="button" class="av-zoom-btn" data-photo="${topMembers[2].photo||'/assets/images/logo.png'}" data-name="${topMembers[2].name}">
              <div style="width:52px;height:52px;border-radius:50%;overflow:hidden;border:3px solid #B45309;background:#fff;margin-bottom:8px">
                <img src="${topMembers[2].photo||'/assets/images/logo.png'}" style="width:100%;height:100%;object-fit:cover" onerror="this.onerror=null;this.src='/assets/images/logo.png'">
              </div>
            </button>
            <div class="bi-medal">🥉</div>
            <div style="font-weight:800;color:var(--c1);font-size:.88rem;text-align:center;max-width:120px;word-break:break-word">${topMembers[2].name}</div>
            <div style="font-size:.8rem;color:var(--c2)">${getComName(topMembers[2].com)}</div>
            <div style="font-size:1.3rem;font-weight:900;color:#B45309;margin-top:6px">${topMembers[2].score||0}/10</div>
          </div>` : '<div></div>'}
        </div>
      </div>
      ` : ''}
    `})() : ''}

    ${curAtab === 'students' ? (() => {
      // -- Sort & filter logic --
      let displayList = [...users];

      // Filter by committee
      if (memberFilterCom !== 'all') displayList = displayList.filter(s => s.com === memberFilterCom);
      // Filter by college
      if (memberFilterCollege !== 'all') displayList = displayList.filter(s => s.college === memberFilterCollege);
      // Filter by tier
      if (memberFilterTier === 'high') displayList = displayList.filter(s => (s.score||0) >= 8);
      else if (memberFilterTier === 'med') displayList = displayList.filter(s => (s.score||0) >= 5 && (s.score||0) < 8);
      else if (memberFilterTier === 'low') displayList = displayList.filter(s => s.role === 'STUDENT' && (s.score||0) < 5);
      else if (memberFilterTier === 'admins') displayList = displayList.filter(s => s.role === 'ADMIN' || s.role === 'SUPER_ADMIN');

      // Search
      if (studentSearchQuery) displayList = displayList.filter(s =>
        s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
        (s.college && s.college.includes(studentSearchQuery)) ||
        (s.com && s.com.includes(studentSearchQuery)) ||
        (s.nid && s.nid.includes(studentSearchQuery))
      );

      // Sort
      if (memberSortBy === 'score_desc') displayList.sort((a,b)=>(b.score||0)-(a.score||0));
      else if (memberSortBy === 'score_asc') displayList.sort((a,b)=>(a.score||0)-(b.score||0));
      else if (memberSortBy === 'name_asc') displayList.sort((a,b)=>a.name.localeCompare(b.name,'ar'));
      else if (memberSortBy === 'name_desc') displayList.sort((a,b)=>b.name.localeCompare(a.name,'ar'));
      else if (memberSortBy === 'newest') displayList.sort((a,b)=>new Date(b.createdAt||0)-new Date(a.createdAt||0));
      else if (memberSortBy === 'oldest') displayList.sort((a,b)=>new Date(a.createdAt||0)-new Date(b.createdAt||0));

      const renderMemberRow = (s, idx) => `
        <tr>
          <td>${idx+1}</td>
          <td>
            <button type="button" class="av-zoom-btn" data-photo="${s.photo||'/assets/images/logo.png'}" data-name="${s.name}" style="background:none;border:none;cursor:pointer;padding:0">
              <div style="width:36px;height:36px;border-radius:50%;overflow:hidden;border:2px solid var(--g);background:#fff;transition:transform .15s" title="${isAr?'اضغط لعرض الصورة':'Click to view photo'}">
                <img src="${s.photo||'/assets/images/logo.png'}" style="width:100%;height:100%;object-fit:cover" alt="${s.name}" onerror="this.onerror=null;this.src='/assets/images/logo.png'">
              </div>
            </button>
          </td>
          <td><b>${s.name}</b></td>
          <td><code>${maskNid(s.nid)}</code></td>
          <td>${getCollegeName(s.college)}</td>
          <td>${getYearName(s.year)}</td>
          <td><span class="sbadge" style="background:var(--bei);color:var(--c1)">${getComName(s.com)}</span></td>
          <td><span class="sbadge ${s.role==='ADMIN'||s.role==='SUPER_ADMIN'?'act':'pen'}">${s.role==='SUPER_ADMIN'?(isAr?'المشرف العام 👑':'Super Admin'):(s.role==='ADMIN'?(isAr?'أدمن':'Admin'):(isAr?'عضو':'Member'))}</span></td>
          <td>${s.role==='ADMIN'||s.role==='SUPER_ADMIN'?'—':getScoreBadge(s.score||0)}</td>
          <td style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
            ${s.role!=='ADMIN'&&s.role!=='SUPER_ADMIN'?`<button type="button" class="btn sm" data-eval-std="${s.id}" style="padding:4px 8px;font-size:.78rem">${isAr?'تقييم':'Evaluate'}</button>`:''}
            ${isSuperAdmin&&s.id!==curUser.id&&s.role!=='SUPER_ADMIN'?`<button type="button" class="btn sm ghost" data-toggle-admin="${s.id}" style="padding:4px 8px;font-size:.78rem;border-color:var(--g)">${s.role==='ADMIN'?(isAr?'سحب الأدمن':'Demote'):(isAr?'تعيين أدمن 👑':'Make Admin')}</button>`:(s.id===curUser.id?`<span style="font-size:.78rem;color:var(--g2);font-weight:700">${isAr?'حسابك':'You'}</span>`:'')}
            ${isSuperAdmin&&s.role!=='SUPER_ADMIN'&&s.id!==curUser.id?`<button type="button" class="btn sm ghost" data-delete-student="${s.id}" data-student-name="${s.name}" data-student-nid="${s.nid}" style="padding:4px 8px;font-size:.78rem;color:var(--red);border-color:var(--red)">🗑️</button>`:''}
          </td>
        </tr>`;

      const renderMemberCard = (s, idx) => `
        <div class="member-card">
          <div class="member-card-header">
            <button type="button" class="av-zoom-btn" data-photo="${s.photo||'/assets/images/logo.png'}" data-name="${s.name}">
              <div style="width:56px;height:56px;border-radius:50%;overflow:hidden;border:2.5px solid var(--g);background:#fff;flex-shrink:0">
                <img src="${s.photo||'/assets/images/logo.png'}" style="width:100%;height:100%;object-fit:cover" alt="${s.name}" onerror="this.onerror=null;this.src='/assets/images/logo.png'">
              </div>
            </button>
            <div style="flex:1;min-width:0">
              <div style="font-weight:800;color:var(--c1);font-size:.95rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s.name}</div>
              <div style="font-size:.78rem;color:var(--c2);margin-top:2px">${getCollegeName(s.college)} — ${getYearName(s.year)}</div>
              <div style="margin-top:4px;display:flex;gap:6px;flex-wrap:wrap;align-items:center">
                <span class="sbadge" style="background:var(--bei);color:var(--c1);font-size:.72rem">${getComName(s.com)}</span>
                <span class="sbadge ${s.role==='ADMIN'||s.role==='SUPER_ADMIN'?'act':'pen'}" style="font-size:.72rem">${s.role==='SUPER_ADMIN'?'Super Admin 👑':(s.role==='ADMIN'?'Admin':'Member')}</span>
              </div>
            </div>
          </div>
          <div class="member-card-body">
            <div style="display:flex;justify-content:space-between;font-size:.78rem">
              <span><b>${isAr?'الرقم القومي:':'NID:'}</b> <code>${maskNid(s.nid)}</code></span>
              ${s.phone?`<span><b>${isAr?'الهاتف:':'Phone:'}</b> ${s.phone}</span>`:''}
            </div>
            ${s.role!=='ADMIN'&&s.role!=='SUPER_ADMIN'?`<div style="margin-top:8px">${getScoreBadge(s.score||0)}</div>`:''}
            ${s.notes?`<div style="font-size:.78rem;color:var(--c2);background:var(--bei);border-radius:8px;padding:6px 10px;margin-top:6px;line-height:1.5;white-space:normal"><b>💬 ${isAr?'ملاحظات:':'Notes:'}</b> ${s.notes.slice(0,80)}${s.notes.length>80?'...':''}</div>`:''}
          </div>
          <div class="member-card-actions">
            ${s.role!=='ADMIN'&&s.role!=='SUPER_ADMIN'?`<button type="button" class="btn sm" data-eval-std="${s.id}" style="padding:4px 12px;font-size:.78rem">${isAr?'تقييم':'Evaluate'}</button>`:''}
            ${isSuperAdmin&&s.id!==curUser.id&&s.role!=='SUPER_ADMIN'?`<button type="button" class="btn sm ghost" data-toggle-admin="${s.id}" style="padding:4px 10px;font-size:.78rem;border-color:var(--g)">${s.role==='ADMIN'?(isAr?'سحب الأدمن':'Demote'):(isAr?'تعيين أدمن 👑':'Make Admin')}</button>`:''}
            ${isSuperAdmin&&s.role!=='SUPER_ADMIN'&&s.id!==curUser.id?`<button type="button" class="btn sm ghost" data-delete-student="${s.id}" data-student-name="${s.name}" data-student-nid="${s.nid}" style="padding:4px 8px;font-size:.78rem;color:var(--red);border-color:var(--red)">🗑️</button>`:''}
          </div>
        </div>`;

      return `
      <div class="admin-card">
        <!-- Toolbar -->
        <div class="dir-toolbar">
          <div class="dir-filters">
            <input type="search" class="search-inp" id="student-search" placeholder="${isAr?'بحث بالاسم أو الكلية أو اللجنة...':'Search...'}" value="${studentSearchQuery}" style="min-width:200px">
            <select class="dir-select" id="dir-sort-select">
              <option value="score_desc" ${memberSortBy==='score_desc'?'selected':''}>⬇ ${isAr?'التقييم الأعلى':'Highest Score'}</option>
              <option value="score_asc" ${memberSortBy==='score_asc'?'selected':''}>⬆ ${isAr?'التقييم الأدنى':'Lowest Score'}</option>
              <option value="name_asc" ${memberSortBy==='name_asc'?'selected':''}>أ—ي ${isAr?'الاسم (أبجدي)':'Name A-Z'}</option>
              <option value="name_desc" ${memberSortBy==='name_desc'?'selected':''}>ي—أ ${isAr?'الاسم (عكسي)':'Name Z-A'}</option>
              <option value="newest" ${memberSortBy==='newest'?'selected':''}>🆕 ${isAr?'الأحدث تسجيلاً':'Newest First'}</option>
              <option value="oldest" ${memberSortBy==='oldest'?'selected':''}>📅 ${isAr?'الأقدم تسجيلاً':'Oldest First'}</option>
            </select>
            <select class="dir-select" id="dir-com-filter">
              <option value="all" ${memberFilterCom==='all'?'selected':''}>🏢 ${isAr?'كل اللجان':'All Committees'}</option>
              ${Object.entries(COMMITTEES_MAP).map(([k,v])=>`<option value="${k}" ${memberFilterCom===k?'selected':''}>${v.split(' ')[0]}</option>`).join('')}
            </select>
            <select class="dir-select" id="dir-tier-filter">
              <option value="all" ${memberFilterTier==='all'?'selected':''}>🎯 ${isAr?'كل المستويات':'All Tiers'}</option>
              <option value="high" ${memberFilterTier==='high'?'selected':''}>🟢 ${isAr?'ممتاز (8+)':'Excellent (8+)'}</option>
              <option value="med" ${memberFilterTier==='med'?'selected':''}>🟡 ${isAr?'جيد (5-7.9)':'Good (5-7.9)'}</option>
              <option value="low" ${memberFilterTier==='low'?'selected':''}>🔴 ${isAr?'يحتاج دعم (<5)':'Needs Support (<5)'}</option>
              <option value="admins" ${memberFilterTier==='admins'?'selected':''}>👑 ${isAr?'الأدمن فقط':'Admins Only'}</option>
            </select>
          </div>
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
            <span style="font-size:.82rem;color:var(--c2);font-weight:700">${displayList.length} / ${users.length}</span>
            <div class="view-switcher">
              <button type="button" class="view-btn ${memberViewMode==='table'?'active':''}" data-view-mode="table">☰ ${isAr?'جدول':'Table'}</button>
              <button type="button" class="view-btn ${memberViewMode==='cards'?'active':''}" data-view-mode="cards">⊞ ${isAr?'بطاقات':'Cards'}</button>
            </div>
            <button type="button" class="btn sm" id="btn-sync-cloud-now" style="padding:6px 14px;font-size:.82rem;background:#22c55e;border-color:#22c55e;color:#fff">🔄</button>
            <button type="button" class="btn sm" id="btn-export-students-csv" style="padding:6px 14px;font-size:.82rem">📥 CSV</button>
            <button type="button" class="btn sm ghost" id="btn-print-students" style="padding:6px 14px;font-size:.82rem">🖨️</button>
          </div>
        </div>

        ${memberViewMode === 'table' ? `
        <div class="tbl-wrap">
          <table class="atbl">
            <thead>
              <tr>
                <th>#</th>
                <th>${isAr?'الصورة':'Photo'}</th>
                <th>${isAr?'الاسم':'Name'}</th>
                <th>${isAr?'الرقم القومي':'NID'}</th>
                <th>${isAr?'الكلية':'Faculty'}</th>
                <th>${isAr?'الفرقة':'Year'}</th>
                <th>${isAr?'اللجنة':'Committee'}</th>
                <th>${isAr?'الصلاحية':'Role'}</th>
                <th>${isAr?'التقييم':'Score'}</th>
                <th>${isAr?'إجراءات':'Actions'}</th>
              </tr>
            </thead>
            <tbody>${displayList.map((s,i)=>renderMemberRow(s,i)).join('')}</tbody>
          </table>
        </div>
        ` : `
        <div class="members-cards-grid">
          ${displayList.map((s,i)=>renderMemberCard(s,i)).join('')}
        </div>
        `}
      </div>`;
    })() : ''}

    ${curAtab === 'evals' ? `
      <div class="admin-card">
        <div class="admin-card-head">
          <div>
            <h3>⭐ ${isAr ? 'نظام تقييم أداء الأعضاء والطلاب' : 'Member Performance Evaluation System'}</h3>
            <p style="color:var(--c2);font-size:.85rem;margin:2px 0 0">
              ${isAr ? 'التقييم متاح للأعضاء فقط (المشرفون والإدارة غير متاح تقييمهم حفاظاً على الصلاحيات).' : 'Evaluations are strictly for members. Admins are excluded.'}
            </p>
          </div>
          <span class="sbadge act">${evaluableMembers.length} ${isAr ? 'عضو مؤهل للتقييم' : 'Evaluable Members'}</span>
        </div>

        <!-- Search Bar by Name or National ID -->
        <div style="background:var(--bei);padding:14px 18px;border-radius:16px;margin-bottom:20px;display:flex;align-items:center;gap:12px;flex-wrap:wrap">
          <div style="flex:1;min-width:260px">
            <label style="display:block;font-size:.85rem;font-weight:700;color:var(--c1);margin-bottom:4px">
              🔍 ${isAr ? 'ابحث عن العضو بالاسم أو الرقم القومي (14 رقماً):' : 'Search Member by Name or National ID:'}
            </label>
            <input type="search" class="search-inp" id="eval-search-inp" placeholder="${isAr ? 'اكتب اسم العضو أو الرقم القومي...' : 'Type member name or National ID...'}" value="${evalSearchQuery}" style="width:100%;background:#fff;border-color:var(--g)">
          </div>
          ${evalSearchQuery ? `
            <button type="button" class="btn sm ghost" id="btn-clear-eval-search" style="margin-top:18px;font-size:.8rem;padding:6px 14px">
              ✕ ${isAr ? 'مسح البحث' : 'Clear'}
            </button>
          ` : ''}
        </div>

        ${selectedMember ? `
          <!-- Active Evaluation Card -->
          <div style="background:#fff;border:2px solid var(--g);border-radius:20px;padding:22px;box-shadow:var(--sh);margin-bottom:24px">
            <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;border-bottom:1.5px solid var(--bei);padding-bottom:16px;margin-bottom:18px">
              <button type="button" class="av-zoom-btn" data-photo="${selectedMember.photo || '/assets/images/logo.png'}" data-name="${selectedMember.name}" title="${isAr ? 'اضغط لتكبير صورة العضو' : 'Click to view photo'}" style="flex-shrink:0">
                <div class="admin-av" style="width:64px;height:64px">
                  <img src="${selectedMember.photo || '/assets/images/logo.png'}" alt="${selectedMember.name}" onerror="this.onerror=null;this.src='/assets/images/logo.png'">
                </div>
              </button>
              <div style="flex:1;min-width:200px">
                <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
                  <h3 style="color:var(--c1);margin:0;font-size:1.25rem">${selectedMember.name}</h3>
                  ${getScoreBadge(selectedMember.score !== undefined ? selectedMember.score : 0)}
                </div>
                <p style="color:var(--c2);font-size:.88rem;margin:4px 0 0">
                  🆔 <code>${selectedMember.nid}</code> • 🏛️ ${getCollegeName(selectedMember.college)} — ${getYearName(selectedMember.year)} • 📌 ${getComName(selectedMember.com)}
                </p>
                ${selectedMember.phone ? `<p style="font-size:.82rem;color:var(--g2);font-weight:700;margin:2px 0 0" dir="ltr">📞 ${selectedMember.phone}</p>` : ''}
              </div>
            </div>

            <form class="form" id="new-eval-form" style="max-width:680px">
              <input type="hidden" name="studentId" value="${selectedMember.id}">
              <div class="form-row">
                <label>${isAr ? 'درجة التقييم الحالية (من 0 إلى 10)' : 'Evaluation Score (0 to 10)'}
                  <input name="score" type="number" min="0" max="10" step="0.1" value="${selectedMember.score !== undefined ? selectedMember.score : 9.0}" required style="font-weight:800;font-size:1.15rem;color:var(--c1)">
                </label>
                <div style="display:flex;flex-direction:column;justify-content:center;font-size:.82rem;color:var(--c2);line-height:1.5;background:var(--bei);padding:10px 14px;border-radius:12px">
                  <span>🟢 8.0 - 10: ممتاز (High Performer)</span>
                  <span>🟡 5.0 - 7.9: جيد ومقبول (Good)</span>
                  <span>🔴 0 - 4.9: بحاجة لتطوير ومتابعة (Needs Support)</span>
                </div>
              </div>

              <label>${isAr ? 'ملاحظات الأداء وتوجيهات التطوير' : 'Performance Notes & Feedback'}
                <textarea name="notes" rows="3" placeholder="${isAr ? 'مستوى الالتزام، التفاعل في المهام، وروح الفريق...' : 'Commitment level, task execution, team spirit...'}">${selectedMember.notes || ''}</textarea>
              </label>

              <button class="btn btn-success" type="submit" style="min-height:44px;padding:10px 28px;font-size:.92rem;justify-self:start">
                💾 ${isAr ? `حفظ وتحديث تقييم (${selectedMember.name})` : 'Save Evaluation'}
              </button>
              <p class="msg" id="eval-msg" role="status" aria-live="polite"></p>
            </form>
          </div>
        ` : `
          <div style="padding:28px;text-align:center;color:var(--c2);background:var(--bei);border-radius:16px;margin-bottom:20px">
            ${isAr ? 'لا يوجد أعضاء مطابقين للبحث الحالي.' : 'No members found matching your search.'}
          </div>
        `}

        <!-- Members Grid with Photo Avatars -->
        <div>
          <h4 style="color:var(--c1);margin-bottom:12px;font-size:1.05rem">
            👥 ${isAr ? 'اختر عضواً من القائمة للتقييم:' : 'Select Member from Directory:'} (${filteredEvalMembers.length})
          </h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px">
            ${filteredEvalMembers.map(s => `
              <div class="eval-member-card" data-select-eval-std="${s.id}" style="display:flex;align-items:center;gap:12px;background:#fff;border:1.5px solid ${s.id === (selectedMember && selectedMember.id) ? 'var(--g)' : 'var(--bei)'};border-radius:14px;padding:12px;cursor:pointer;transition:.2s;box-shadow:${s.id === (selectedMember && selectedMember.id) ? '0 0 12px rgba(242,168,29,.35)' : 'none'}">
                <button type="button" class="av-zoom-btn" data-photo="${s.photo || '/assets/images/logo.png'}" data-name="${s.name}" title="${isAr ? 'اضغط لتكبير صورة العضو' : 'Click to view photo'}" style="flex-shrink:0">
                  <div style="width:46px;height:46px;border-radius:50%;overflow:hidden;border:2px solid var(--g);background:#fff">
                    <img src="${s.photo || '/assets/images/logo.png'}" style="width:100%;height:100%;object-fit:cover" alt="${s.name}" onerror="this.onerror=null;this.src='/assets/images/logo.png'">
                  </div>
                </button>
                <div style="flex:1;min-width:0">
                  <div style="font-weight:700;color:var(--c1);font-size:.92rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s.name}</div>
                  <div style="font-size:.78rem;color:var(--c2)"><code>${s.nid}</code></div>
                  <div style="font-size:.78rem;color:var(--g2);font-weight:600">${getCollegeName(s.college)} • ${getComName(s.com)}</div>
                </div>
                <div>
                  ${getScoreBadge(s.score !== undefined ? s.score : 0)}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    ` : ''}

    ${curAtab === 'qr' ? `
      <div class="admin-card">
        <div class="admin-card-head">
          <div>
            <h3>📱 ${isAr ? 'نظام الحضور ورفع كود الـ QR' : 'QR Attendance System'}</h3>
            <p style="color:var(--c2);font-size:.85rem;margin:2px 0 0">
              ${isAr ? 'رفع وتفعيل كود الـ QR للفعاليات، وحفظ أرشيف الحضور فور إنهاء الفعالية.' : 'Publish event QR codes and manage attendance archives.'}
            </p>
          </div>
          <span class="sbadge ${activeQr.active ? 'act' : 'pen'}">
            ${activeQr.active ? (isAr ? '● الفعالية والـ QR نشط حالياً للطلاب' : '● Live Event QR Active') : (isAr ? '○ لا توجد فعالية نشطة حالياً' : '○ No Active Event')}
          </span>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;align-items:start">
          <div style="background:var(--bei);padding:22px;border-radius:18px;border:2px dashed var(--g2)">
            <h4 style="color:var(--c1);margin-bottom:12px">${isAr ? 'بدء جلسة حضور جديدة' : 'Start New Attendance Session'}</h4>
            <form class="form" id="admin-upload-qr-form">
              <label>${isAr ? 'عنوان الاجتماع / الفعالية' : 'Meeting / Event Title'}
                <input name="eventTitle" placeholder="${isAr ? 'مثال: اجتماع أكتوبر 2026' : 'e.g. October Meeting 2026'}" required value="${activeQr.title || ''}">
              </label>
              <div style="display:flex;gap:10px;margin-top:10px;flex-wrap:wrap">
                <button class="btn btn-success" type="submit" style="flex:1">${activeQr.active ? (isAr ? '🔄 تحديث عنوان الجلسة' : '🔄 Update Session') : (isAr ? '🚀 بدء جلسة الحضور' : '🚀 Start Attendance Session')}</button>
                ${activeQr.active ? `
                  <button type="button" class="btn btn-danger" id="btn-stop-qr" style="flex:1">${isAr ? 'إنهاء الجلسة 🛑' : 'End Session 🛑'}</button>
                ` : ''}
              </div>
              <p class="msg" id="admin-qr-msg" role="status" aria-live="polite"></p>
            </form>
            ${activeQr.active ? `
              <div style="margin-top:18px;border-top:1.5px solid var(--g);padding-top:16px">
                <h4 style="color:var(--c1);margin-bottom:8px">📷 ${isAr ? 'مسح QR الأعضاء بالكاميرا' : 'Scan Member QR Codes'}</h4>
                <p style="font-size:.83rem;color:var(--c2);margin-bottom:10px">${isAr ? 'اضغط لفتح الكاميرا ووجّهها نحو QR العضو لتسجيل حضوره فوراً.' : 'Open camera and point at each member\'s personal QR to record attendance.'}</p>
                <button type="button" class="btn btn-success" id="btn-open-qr-scanner" style="width:100%;margin-bottom:8px">📷 ${isAr ? 'فتح الكاميرا للمسح' : 'Open Camera to Scan'}</button>
                <div id="qr-scanner-wrap" style="display:none;border-radius:14px;overflow:hidden;position:relative;background:#000;aspect-ratio:4/3;margin-top:10px">
                  <video id="qr-video" style="width:100%;height:100%;object-fit:cover" playsinline muted autoplay></video>
                  <canvas id="qr-canvas" style="display:none"></canvas>
                  <div style="position:absolute;inset:0;pointer-events:none">
                    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:170px;height:170px;border:3px solid #22c55e;border-radius:12px;box-shadow:0 0 0 9999px rgba(0,0,0,.45)"></div>
                  </div>
                  <button type="button" id="btn-close-qr-scanner" style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,.7);color:#fff;border:none;border-radius:8px;padding:4px 12px;font-size:.82rem;cursor:pointer">✕ ${isAr ? 'إغلاق' : 'Close'}</button>
                  <div id="qr-scan-status" style="position:absolute;bottom:10px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.8);color:#fff;padding:5px 14px;border-radius:999px;font-size:.82rem;font-weight:700;white-space:nowrap;max-width:90%"></div>
                </div>
                <p class="msg" id="admin-scan-msg" role="status" aria-live="polite" style="margin-top:8px"></p>
              </div>
            ` : ''}
          </div>

          <div>
            ${activeQr.active ? `
              <div class="qr-active-banner">
                <h4 style="color:var(--c1);margin-bottom:6px">🟢 ${isAr ? 'جلسة الحضور النشطة الآن:' : 'Currently Active Session:'}</h4>
                <p style="font-weight:700;color:var(--g2);font-size:1.05rem">${activeQr.title}</p>
                <p style="font-size:.83rem;color:var(--c2);margin-top:6px;line-height:1.5">📌 ${isAr ? 'كل عضو يرى QR خاص بيانات في بوابته. وجّه الكاميرا أعلاه نحو QR العضو لتسجيل حضوره.' : 'Each member sees their own personal QR in their portal. Scan it with the camera above to record attendance.'}</p>
                <p style="font-size:.8rem;color:var(--c2);margin-top:4px">${isAr ? 'بدأت: ' + (activeQr.createdAt || 'الآن') : 'Started: ' + (activeQr.createdAt || 'Now')}</p>
                <button type="button" class="btn btn-danger sm" id="btn-stop-qr-2" style="margin-top:12px">${isAr ? 'إنهاء الجلسة وأرشفة الحضور' : 'End Session & Archive'}</button>
              </div>
            ` : `
              <div style="padding:28px 20px;text-align:center;background:#fff;border:2px dashed var(--bei);border-radius:18px;color:var(--c2)">
                <div style="font-size:2.4rem;margin-bottom:8px">📴</div>
                <h4>${isAr ? 'لا توجد جلسة حضور نشطة' : 'No Active Attendance Session'}</h4>
                <p style="font-size:.88rem;margin-top:6px">${isAr ? 'اكتب اسم الاجتماع وابدأ الجلسة — كل عضو سيجد QR خاص به في بوابته تلقائياً.' : 'Type the meeting name and start the session — each member will find their own personal QR in their portal.'}</p>
              </div>
            `}
          </div>
        </div>

        <!-- 1. Live Active Attendance (ONLY shown when QR is active) -->
        ${activeQr.active ? `
          <div style="margin-top:28px;border-top:1.5px solid var(--bei);padding-top:20px;animation:up .3s ease">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:12px">
              <h4>🔴 ${isAr ? `الحضور اللحظي في الفعالية النشطة حالياً (${activeEventAttendees.length} طالب)` : `Live Attendance for Active Event (${activeEventAttendees.length})`}</h4>
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                <button type="button" class="btn sm" id="btn-print-attendance" style="padding:6px 14px;font-size:.82rem">
                  🖨️ ${isAr ? 'طباعة تقرير الحضور اللحظي' : 'Print Live Report'}
                </button>
                <button type="button" class="btn sm ghost" id="btn-export-attendance-csv" style="padding:6px 14px;font-size:.82rem">
                  📥 ${isAr ? 'تصدير (CSV)' : 'Export CSV'}
                </button>
              </div>
            </div>
            <div class="tbl-wrap att-desktop-table" style="margin-top:12px">
              <table class="atbl">
                <thead><tr><th>#</th><th>${isAr ? 'الطالب' : 'Student'}</th><th>${isAr ? 'الكلية' : 'Faculty'}</th><th>${isAr ? 'اللجنة' : 'Committee'}</th><th>${isAr ? 'رقم الهاتف' : 'Phone'}</th><th>${isAr ? 'وقت التسجيل' : 'Scan Time'}</th></tr></thead>
                <tbody>
                  ${activeEventAttendees.length === 0 ? `<tr><td colspan="6" style="text-align:center;color:var(--c2)">${isAr ? 'لم يقم أي طالب بتسجيل الحضور في هذه الفعالية بعد.' : 'No attendees recorded yet.'}</td></tr>` : activeEventAttendees.map((a, i) => `
                    <tr>
                      <td>${i + 1}</td>
                      <td>
                        <div style="display:flex;align-items:center;gap:8px">
                          <button type="button" class="av-zoom-btn" data-photo="${a.photo || '/assets/images/logo.png'}" data-name="${a.studentName}" title="${isAr ? 'اضغط لتكبير الصورة' : 'Click to zoom'}">
                            <div style="width:30px;height:30px;border-radius:50%;overflow:hidden;border:1.5px solid var(--g);background:#fff">
                              <img src="${a.photo || '/assets/images/logo.png'}" style="width:100%;height:100%;object-fit:cover" alt="${a.studentName}" onerror="this.onerror=null;this.src='/assets/images/logo.png'">
                            </div>
                          </button>
                          <b>${a.studentName}</b>
                        </div>
                      </td>
                      <td>${getCollegeName(a.college || '—')}</td>
                      <td><span class="sbadge" style="background:var(--bei);color:var(--c1)">${getComName(a.committee)}</span></td>
                      <td><a href="tel:${a.phone}" style="color:var(--c1);font-weight:700" dir="ltr">📞 ${a.phone || '—'}</a></td>
                      <td><code>${a.time} - ${a.date}</code></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            ${renderMobileAttendeeCards(activeEventAttendees, isAr)}
          </div>
        ` : ''}

        <!-- 2. Permanent Memory / Archive of All Events & Attendance Lists -->
        <div style="margin-top:28px;border-top:1.5px solid var(--bei);padding-top:20px">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px">
            <div>
              <h4 style="color:var(--c1);margin:0;font-size:1.15rem">📂 ${isAr ? 'حافظة وأرشيف الفعاليات وسجلات الحضور السابقة' : 'Past Events Attendance Archive'}</h4>
              <p style="color:var(--c2);font-size:.85rem;margin:3px 0 0">
                ${isAr ? 'تضم جميع الفعاليات التي تم إدارتها بالـ QR مع أسماء وكليات وأرقام هواتف الطلاب المشاركين، وإمكانية تصديرها وطباعتها.' : 'Complete archive of all QR events with student names, faculties, phone numbers, CSV export, and print.'}
              </p>
            </div>
            <span class="sbadge act">${eventsArchive.length} ${isAr ? 'فعالية مؤرشفة' : 'Archived Events'}</span>
          </div>

          <div style="display:grid;gap:14px;margin-top:14px">
            ${eventsArchive.length === 0 ? `
              <div style="padding:24px;text-align:center;color:var(--c2);background:var(--bei);border-radius:14px">
                ${isAr ? 'لا توجد فعاليات مؤرشفة حتى الآن.' : 'No archived events yet.'}
              </div>
            ` : eventsArchive.map(ev => `
              <div class="archived-ev-card" style="background:#fff;border:1.5px solid var(--bei);border-radius:16px;padding:16px 20px;box-shadow:var(--sh);transition:.2s">
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
                  <div>
                    <h4 style="color:var(--c1);font-size:1.08rem;margin:0 0 4px">🗓️ ${ev.title}</h4>
                    <p style="color:var(--c2);font-size:.85rem;margin:0">
                      📅 ${ev.date} • ⏰ ${ev.time} • <span class="sbadge act" style="margin-inline-start:6px">👥 ${ev.totalAttendees || (ev.attendees ? ev.attendees.length : 0)} ${isAr ? 'طالب مسجل' : 'Attendees'}</span>
                    </p>
                  </div>
                  <div class="archived-ev-actions" style="display:flex;gap:8px;flex-wrap:wrap">
                    <button type="button" class="btn sm" data-toggle-event-archive="${ev.id}" style="padding:6px 14px;font-size:.82rem">
                      📋 ${openedEventArchiveId === ev.id ? (isAr ? 'إخفاء الكشف ✕' : 'Hide') : (isAr ? 'عرض كشف الحضور 👁️' : 'View Attendees')}
                    </button>
                    <button type="button" class="btn sm ghost" data-export-event-csv="${ev.id}" style="padding:6px 14px;font-size:.82rem">
                      📥 ${isAr ? 'تصدير ملف (CSV)' : 'Export CSV'}
                    </button>
                    <button type="button" class="btn sm ghost" data-print-event="${ev.id}" style="padding:6px 14px;font-size:.82rem">
                      🖨️ ${isAr ? 'طباعة كشف' : 'Print Sheet'}
                    </button>
                    <button type="button" class="btn sm ghost" data-delete-event="${ev.id}" style="padding:6px 10px;font-size:.82rem;color:var(--red);border-color:var(--red)" title="${isAr ? 'حذف من الأرشيف' : 'Delete'}">
                      🗑️
                    </button>
                  </div>
                </div>

                ${openedEventArchiveId === ev.id ? `
                  <div style="margin-top:16px;border-top:1.5px dashed var(--g);padding-top:14px;animation:up .3s ease">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
                      <h5 style="color:var(--c1);margin:0">👥 ${isAr ? 'كشف تفصيلي بأسماء وكليات وأرقام هواتف الطلاب المسجلين:' : 'Attendees Details & Phone Numbers:'}</h5>
                    </div>
                    <div class="tbl-wrap att-desktop-table">
                      <table class="atbl">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>${isAr ? 'اسم الطالب' : 'Student Name'}</th>
                            <th>${isAr ? 'الرقم القومي' : 'National ID'}</th>
                            <th>${isAr ? 'الكلية' : 'Faculty'}</th>
                            <th>${isAr ? 'الفرقة' : 'Year'}</th>
                            <th>${isAr ? 'اللجنة' : 'Committee'}</th>
                            <th>${isAr ? 'رقم الهاتف' : 'Phone'}</th>
                            <th>${isAr ? 'وقت التسجيل' : 'Scan Time'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${ev.attendees && ev.attendees.length > 0 ? ev.attendees.map((att, i) => `
                            <tr>
                              <td>${i + 1}</td>
                              <td>
                                <div style="display:flex;align-items:center;gap:8px">
                                  <button type="button" class="av-zoom-btn" data-photo="${att.photo || '/assets/images/logo.png'}" data-name="${att.studentName}" title="${isAr ? 'اضغط لتكبير الصورة' : 'Click to zoom'}">
                                    <div style="width:30px;height:30px;border-radius:50%;overflow:hidden;border:1.5px solid var(--g);background:#fff">
                                      <img src="${att.photo || '/assets/images/logo.png'}" style="width:100%;height:100%;object-fit:cover" alt="${att.studentName}" onerror="this.onerror=null;this.src='/assets/images/logo.png'">
                                    </div>
                                  </button>
                                  <b>${att.studentName}</b>
                                </div>
                              </td>
                              <td><code>${att.nid || '—'}</code></td>
                              <td>${getCollegeName(att.college || '—')}</td>
                              <td>${getYearName(att.year || '—')}</td>
                              <td><span class="sbadge" style="background:var(--bei);color:var(--c1)">${getComName(att.committee)}</span></td>
                              <td><a href="tel:${att.phone}" style="color:var(--c1);font-weight:700" dir="ltr">📞 ${att.phone || '—'}</a></td>
                              <td><code>${att.time || att.scannedAt || '—'}</code></td>
                            </tr>
                          `).join('') : `<tr><td colspan="8" style="text-align:center;color:var(--c2)">${isAr ? 'لا يوجد حضور مسجل في هذه الفعالية.' : 'No attendees recorded.'}</td></tr>`}
                        </tbody>
                      </table>
                    </div>
                    ${renderMobileAttendeeCards(ev.attendees, isAr)}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    ` : ''}

    ${curAtab === 'sugs' ? `
      <div class="admin-card">
        <div class="admin-card-head" style="gap:12px;flex-wrap:wrap">
          <div>
            <h3>💡 ${isAr ? 'الاقتراحات والأفكار الواردة من الموقع' : 'Submitted Ideas & Suggestions'}</h3>
            <p style="color:var(--c2);font-size:.85rem;margin:2px 0 0">
              ${isAr ? 'كافة المقترحات والأفكار محفوظة سحابياً في قاعدة البيانات ويمكنك إدارتها ومسح القديم منها.' : 'All submitted suggestions are saved in the cloud database.'}
            </p>
          </div>
          <button type="button" class="btn sm ghost" id="btn-sync-sugs-now" style="font-size:.82rem;padding:6px 14px;border-color:var(--g);color:var(--g)">
            🔄 ${isAr ? 'تحديث المقترحات' : 'Refresh Suggestions'}
          </button>
        </div>
        <div style="margin-top:14px">
          ${sugs.length === 0 ? `
            <div style="text-align:center;padding:36px 20px;color:var(--c2);background:var(--bei);border-radius:14px">
              <div style="font-size:2rem;margin-bottom:8px">📭</div>
              <b>${isAr ? 'صندوق الاقتراحات فارغ حالياً' : 'Suggestion box is currently empty'}</b>
              <p style="font-size:.85rem;margin:4px 0 0">${isAr ? 'أي مقترح يرسله زوار الموقع سيظهر هنا فورياً.' : 'New ideas submitted from the website will appear here in real-time.'}</p>
            </div>
          ` : sugs.map(sg => `
            <div class="sug-item ${sg.done ? 'done' : ''}">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
                <h4>${sg.act}</h4>
                <button type="button" class="btn sm ghost" data-delete-sug="${sg.id}" style="padding:4px 10px;font-size:.78rem;color:var(--red);border-color:var(--red)" title="${isAr ? 'مسح المقترح نهائياً من قاعدة البيانات' : 'Delete Suggestion Permanently'}">
                  🗑️ ${isAr ? 'مسح' : 'Delete'}
                </button>
              </div>
              <div class="sug-meta">${isAr ? 'المرسل: ' + sg.name + (sg.email ? ' (' + sg.email + ')' : '') + (sg.aud ? ' • الفئة المستهدفة: ' + sg.aud : '') + ' • التاريخ: ' + sg.date : 'From: ' + sg.name + (sg.email ? ' (' + sg.email + ')' : '') + ' • Date: ' + sg.date}</div>
              <div class="sug-txt">${sg.msg}</div>
              <div style="margin-top:10px">
                <button type="button" class="btn sm ghost" data-toggle-sug="${sg.id}" style="font-size:.8rem;padding:4px 14px">
                  ${sg.done ? (isAr ? '✓ تمت مراجعتها' : '✓ Reviewed') : (isAr ? 'تمييز كمقروءة ومكتملة' : 'Mark as Reviewed')}
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    ${curAtab === 'gallery' && isSuperAdmin ? `
      <div class="admin-card">
        <div class="admin-card-head" style="gap:12px;flex-wrap:wrap">
          <div>
            <h3>🖼️ ${isAr ? 'إدارة ميديا ومعرض الأسرة (خاص بالمشرف العام)' : 'Media & Gallery Management (Super Admin)'}</h3>
            <p style="color:var(--c2);font-size:.85rem;margin:2px 0 0">
              ${isAr ? 'أضف صور وفيديوهات جديدة لتظهر في معرض الموقع وبوابة الأعضاء، أو احذف ما تريده من المعرض.' : 'Add new photos and videos to the live gallery or delete existing ones.'}
            </p>
          </div>
          <button type="button" class="btn sm ghost" id="btn-sync-gallery-now" style="font-size:.82rem;padding:6px 14px;border-color:var(--g);color:var(--g)">
            🔄 ${isAr ? 'تحديث المعرض' : 'Refresh Gallery'}
          </button>
        </div>

        <!-- Add Media Form -->
        <form id="admin-add-gallery-form" class="form" style="margin-top:20px;background:var(--bei);padding:18px;border-radius:14px;border:1px solid rgba(242,168,29,.2)">
          <h4 style="margin:0 0 12px;color:var(--c1)">➕ ${isAr ? 'إضافة وسائط جديدة للمعرض' : 'Add New Media to Gallery'}</h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:14px">
            <div>
              <label style="display:block;font-size:.85rem;font-weight:700;margin-bottom:6px">${isAr ? 'نوع الوسائط' : 'Media Type'}</label>
              <select id="gallery-media-type" class="form-input" style="width:100%;padding:10px;border-radius:8px;border:1px solid var(--bdr)">
                <option value="IMAGE">📷 ${isAr ? 'صورة (رفع من الجهاز)' : 'Image (Upload from Device)'}</option>
                <option value="VIDEO">🎥 ${isAr ? 'فيديو (رابط يوتيوب أو مباشر)' : 'Video (YouTube or Direct Link)'}</option>
              </select>
            </div>
            <div>
              <label style="display:block;font-size:.85rem;font-weight:700;margin-bottom:6px">${isAr ? 'عنوان أو وصف مختصر (اختياري)' : 'Title / Caption (Optional)'}</label>
              <input type="text" id="gallery-media-title" class="form-input" placeholder="${isAr ? 'مثال: افتتاح ملتقى الأسرة 2026' : 'e.g. Annual Family Conference 2026'}" style="width:100%;padding:10px;border-radius:8px;border:1px solid var(--bdr)">
            </div>
          </div>

          <!-- Photo Upload Section -->
          <div id="gallery-file-wrap" style="margin-top:14px">
            <label style="display:block;font-size:.85rem;font-weight:700;margin-bottom:6px">${isAr ? 'اختر صورة من جهازك' : 'Choose Image File'}</label>
            <input type="file" id="gallery-file-input" accept="image/*" class="form-input" style="width:100%;padding:8px;border-radius:8px;border:1px dashed var(--g)">
            <p style="font-size:.78rem;color:var(--c2);margin:4px 0 0">${isAr ? 'يتم ضغط وتصغير الصورة تلقائياً لسرعة التحميل وحفظها سحابياً.' : 'Images are automatically optimized and stored in the cloud.'}</p>
            <div id="gallery-preview-container" style="display:none;margin-top:10px;text-align:center">
              <img id="gallery-preview-img" src="" alt="Preview" style="max-height:180px;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,.15);border:2px solid var(--g)">
            </div>
          </div>

          <!-- Video Section -->
          <div id="gallery-video-wrap" style="display:none;margin-top:14px">
            <div style="display:flex;gap:12px;margin-bottom:12px;flex-wrap:wrap">
              <label style="display:inline-flex;align-items:center;gap:6px;cursor:pointer;font-size:.86rem;font-weight:700;background:#fff;padding:8px 14px;border-radius:8px;border:1.5px solid var(--bdr)">
                <input type="radio" name="video_source_mode" value="file" checked id="vmode-file">
                📁 ${isAr ? 'رفع ملف فيديو من الجهاز' : 'Upload Video File'}
              </label>
              <label style="display:inline-flex;align-items:center;gap:6px;cursor:pointer;font-size:.86rem;font-weight:700;background:#fff;padding:8px 14px;border-radius:8px;border:1.5px solid var(--bdr)">
                <input type="radio" name="video_source_mode" value="url" id="vmode-url">
                🔗 ${isAr ? 'رابط من أي منصة (فيس، تيك توك، يوتيوب، إلخ)' : 'Video Link (FB, TikTok, YT, etc.)'}
              </label>
            </div>

            <!-- 1. Video File Input -->
            <div id="video-file-subwrap">
              <label style="display:block;font-size:.85rem;font-weight:700;margin-bottom:6px">${isAr ? 'اختر ملف فيديو من جهازك (MP4 / WebM / إلخ)' : 'Choose Video File'}</label>
              <input type="file" id="gallery-video-file-input" accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*" class="form-input" style="width:100%;padding:8px;border-radius:8px;border:1px dashed var(--g)">
              <p style="font-size:.78rem;color:var(--c2);margin:4px 0 0">${isAr ? 'الحد الأقصى للرفع المباشر للكليبات هو 4.2 ميجابايت. للفيديوهات الأكبر حجماً، يُفضّل وضع رابط الفيديو وسيعمل فوراً بدون حد للحجم.' : 'Direct upload limit is 4.2MB. For larger videos, use the video link option.'}</p>
              <div id="gallery-video-preview-container" style="display:none;margin-top:10px;text-align:center">
                <video id="gallery-video-preview-el" controls style="max-height:180px;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,.15);border:2px solid var(--g)"></video>
              </div>
            </div>

            <!-- 2. Video URL Input -->
            <div id="video-url-subwrap" style="display:none">
              <label style="display:block;font-size:.85rem;font-weight:700;margin-bottom:6px">${isAr ? 'رابط الفيديو من فيسبوك، تيك توك، إنستغرام، يوتيوب، درايف، أو رابط مباشر' : 'Video URL (Facebook, TikTok, Instagram, YouTube, etc.)'}</label>
              <input type="url" id="gallery-video-url" class="form-input" placeholder="${isAr ? 'مثال: https://www.facebook.com/... أو https://www.tiktok.com/... أو https://youtu.be/...' : 'e.g. Facebook, TikTok, Instagram, or YouTube URL'}" style="width:100%;padding:10px;border-radius:8px;border:1px solid var(--bdr)">
              <p style="font-size:.78rem;color:var(--c2);margin:4px 0 0">${isAr ? 'يدعم تلقائياً فيديوهات وريلز فيسبوك، تيك توك، إنستغرام، يوتيوب، وروابط الـ MP4 المباشرة بدون أي حد للحجم.' : 'Supports Facebook Reels/Videos, TikTok, Instagram, YouTube, and direct video links.'}</p>
            </div>
          </div>

          <div style="margin-top:16px;display:flex;align-items:center;gap:12px;flex-wrap:wrap">
            <button type="submit" id="gallery-submit-btn" class="btn" style="padding:10px 24px">
              🚀 ${isAr ? 'إضافة إلى المعرض السحابي' : 'Add to Cloud Gallery'}
            </button>
            <span id="gallery-form-msg" style="font-size:.88rem;font-weight:700"></span>
          </div>
        </form>

        <!-- Current Gallery Items -->
        <h4 style="margin:28px 0 14px;color:var(--c1)">📂 ${isAr ? 'العناصر الحالية في المعرض' : 'Current Gallery Items'} (${galleryItems.length})</h4>
        ${galleryItems.length === 0 ? `
          <div style="text-align:center;padding:36px 20px;color:var(--c2);background:var(--bei);border-radius:14px">
            <div style="font-size:2rem;margin-bottom:8px">🖼️</div>
            <b>${isAr ? 'المعرض فارغ حالياً' : 'The gallery is currently empty'}</b>
          </div>
        ` : `
          <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(260px, 1fr));gap:16px">
            ${galleryItems.map(item => `
              <div style="background:var(--card);border:1px solid var(--bdr);border-radius:14px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.06);display:flex;flex-direction:column">
                <div style="position:relative;aspect-ratio:16/10;background:#000;overflow:hidden">
                  ${item.type === 'VIDEO' ? `
                    ${renderVideoPlayer(item.url, item.title)}
                    <span style="position:absolute;top:8px;left:8px;background:rgba(200,16,46,.9);color:#fff;padding:2px 8px;border-radius:6px;font-size:.72rem;font-weight:700;z-index:2">${getVideoBadge(item.url)}</span>
                  ` : `
                    <img src="${item.url}" alt="${item.title || 'Gallery Image'}" style="width:100%;height:100%;object-fit:cover" loading="lazy" onerror="this.onerror=null;this.src='/assets/images/logo.png'">
                    <span style="position:absolute;top:8px;left:8px;background:rgba(0,0,0,.65);color:#fff;padding:2px 8px;border-radius:6px;font-size:.72rem;font-weight:700">📷 صورة</span>
                  `}
                </div>
                <div style="padding:12px;flex:1;display:flex;flex-direction:column;justify-content:space-between">
                  <div>
                    <h5 style="margin:0 0 6px;font-size:.9rem;line-height:1.4">${item.title || (isAr ? 'بدون عنوان' : 'Untitled')}</h5>
                    <div style="font-size:.75rem;color:var(--c2)">${item.createdAt || ''}</div>
                  </div>
                  <div style="margin-top:12px;display:flex;justify-content:flex-end">
                    <button type="button" class="btn sm ghost" data-delete-gallery-item="${item.id || item.url}" data-item-url="${item.url}" style="padding:4px 10px;font-size:.78rem;color:var(--red);border-color:var(--red)" title="${isAr ? 'حذف هذا العنصر من المعرض وقاعدة البيانات' : 'Delete item permanently'}">
                      🗑️ ${isAr ? 'حذف من المعرض' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    ` : ''}
  </div>`;
}
