/**
 * 07_reports.js - Export to CSV, Print Reports, Photo Lightbox
 * Part of HNU Students For Egypt Platform
 */

/* ---------- Print & Export Helpers ---------- */
function printAttendanceReport() {
  const isAr = lang === "ar";
  const activeQr = getStore("cf_active_qr", { active: false, title: "الفعالية" });
  const attendances = getStore("cf_attendance", []);
  const eventTitle = activeQr.title || (attendances[0] ? (attendances[0].event || attendances[0].eventTitle) : (isAr ? "فعالية الأسرة" : "Family Event"));
  const filtered = attendances.filter(a => (a.event || a.eventTitle) === eventTitle);

  const printWin = window.open('', '_blank');
  if (!printWin) { alert(isAr ? 'يرجى السماح بالنوافذ المنبثقة للطباعة' : 'Please allow popups to print'); return; }
  printWin.document.write(`
    <!DOCTYPE html>
    <html dir="${isAr ? 'rtl' : 'ltr'}" lang="${lang}">
    <head>
      <meta charset="utf-8">
      <title>${isAr ? 'تقرير حضور فعالية — ' + eventTitle : 'Attendance Report — ' + eventTitle}</title>
      <style>
        body { font-family: 'Cairo', Arial, sans-serif; padding: 28px; color: #333; direction: ${isAr ? 'rtl' : 'ltr'}; }
        .header { text-align: center; border-bottom: 2.5px solid #3B2616; padding-bottom: 14px; margin-bottom: 20px; }
        .header h1 { margin: 0; color: #3B2616; font-size: 22px; }
        .header h2 { margin: 6px 0 0; color: #C98A0B; font-size: 16px; }
        .meta { display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 13px; font-weight: bold; background: #F3E3BF; padding: 10px 16px; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
        th, td { border: 1px solid #ddd; padding: 8px 10px; text-align: ${isAr ? 'right' : 'left'}; }
        th { background: #3B2616; color: #FFD97A; font-weight: bold; }
        tr:nth-child(even) { background: #fafafa; }
        .footer { margin-top: 36px; display: flex; justify-content: space-between; font-size: 13px; padding-top: 14px; border-top: 1px dashed #ccc; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${isAr ? 'أسرة طلاب من أجل مصر — جامعة حلوان الأهلية' : 'Students For Egypt — Helwan National University'}</h1>
        <h2>${isAr ? 'تقرير الحضور الرسمي المعتمد للفعالية: ' + eventTitle : 'Official Event Attendance Report: ' + eventTitle}</h2>
      </div>
      <div class="meta">
        <div>${isAr ? 'اسم الفعالية: ' : 'Event: '}<b>${eventTitle}</b></div>
        <div>${isAr ? 'إجمالي الحضور: ' : 'Total Attendees: '}<b>${filtered.length} ${isAr ? 'طالب' : 'students'}</b></div>
        <div>${isAr ? 'تاريخ التقرير: ' : 'Report Date: '}<b>${new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}</b></div>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>${isAr ? 'اسم الطالب' : 'Student Name'}</th>
            <th>${isAr ? 'الكلية' : 'Faculty'}</th>
            <th>${isAr ? 'وقت الحضور' : 'Time'}</th>
            <th>${isAr ? 'تاريخ الحضور' : 'Date'}</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.length === 0 ? `<tr><td colspan="5" style="text-align:center">${isAr ? 'لا يوجد حضور مسجل لهذه الفعالية بعد.' : 'No attendance recorded yet.'}</td></tr>` : filtered.map((a, i) => `
            <tr>
              <td>${i + 1}</td>
              <td><b>${a.studentName || a.name || '—'}</b></td>
              <td>${getCollegeName(a.college || '—')}</td>
              <td>${a.time || '—'}</td>
              <td>${a.date || '—'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="footer">
        <div>${isAr ? 'مسؤول التنظيم: ' : 'OC Head: '}<b>محمد أشرف (Vice Head of OC)</b></div>
        <div>${isAr ? 'اعتماد رائد الأسرة: ' : 'Supervisor Approval: '}<b>د. محمد حلمي</b></div>
      </div>
      <script>window.onload = function() { window.print(); }<\/script>
    </body>
    </html>
  `);
  printWin.document.close();
}

function exportAttendanceCSV() {
  const isAr = lang === "ar";
  const activeQr = getStore("cf_active_qr", { active: false, title: "الفعالية" });
  const attendances = getStore("cf_attendance", []);
  let csv = "\uFEFFم,اسم الطالب,الكلية,الفعالية,وقت الحضور,تاريخ الحضور\n";
  attendances.forEach((a, i) => {
    csv += `"${i + 1}","${a.studentName || a.name || ''}","${getCollegeName(a.college || '')}","${a.event || a.eventTitle || ''}","${a.time || ''}","${a.date || ''}"\n`;
  });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `تقرير_حضور_${(activeQr.title || 'فعالية').replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function printStudentsDirectory() {
  const isAr = lang === "ar";
  const users = getUsers();
  const printWin = window.open('', '_blank');
  if (!printWin) { alert(isAr ? 'يرجى السماح بالنوافذ المنبثقة للطباعة' : 'Please allow popups to print'); return; }
  printWin.document.write(`
    <!DOCTYPE html>
    <html dir="${isAr ? 'rtl' : 'ltr'}" lang="${lang}">
    <head>
      <meta charset="utf-8">
      <title>${isAr ? 'كشف أعضاء أسرة طلاب من أجل مصر' : 'Students For Egypt — Members Directory'}</title>
      <style>
        body { font-family: 'Cairo', Arial, sans-serif; padding: 24px; color: #333; direction: ${isAr ? 'rtl' : 'ltr'}; }
        .header { text-align: center; border-bottom: 2.5px solid #3B2616; padding-bottom: 12px; margin-bottom: 18px; }
        .header h1 { margin: 0; color: #3B2616; font-size: 22px; }
        .header h2 { margin: 6px 0 0; color: #C98A0B; font-size: 16px; }
        .meta { display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 13px; font-weight: bold; background: #F3E3BF; padding: 10px 16px; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: ${isAr ? 'right' : 'left'}; }
        th { background: #3B2616; color: #FFD97A; }
        tr:nth-child(even) { background: #fafafa; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${isAr ? 'أسرة طلاب من أجل مصر — جامعة حلوان الأهلية' : 'Students For Egypt — Helwan National University'}</h1>
        <h2>${isAr ? 'الكشف الرسمي المعتمد لبيانات الأعضاء المسجلين' : 'Official Registered Members Directory'}</h2>
      </div>
      <div class="meta">
        <div>${isAr ? 'إجمالي الأعضاء: ' : 'Total Members: '}<b>${users.length}</b></div>
        <div>${isAr ? 'تاريخ الاستخراج: ' : 'Date: '}<b>${new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}</b></div>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>${isAr ? 'الاسم' : 'Name'}</th>
            <th>${isAr ? 'الرقم القومي' : 'National ID'}</th>
            <th>${isAr ? 'الكلية' : 'Faculty'}</th>
            <th>${isAr ? 'الفرقة' : 'Year'}</th>
            <th>${isAr ? 'اللجنة' : 'Committee'}</th>
            <th>${isAr ? 'الهاتف' : 'Phone'}</th>
            <th>${isAr ? 'الصلاحية' : 'Role'}</th>
            <th>${isAr ? 'تاريخ الانضمام' : 'Join Date'}</th>
          </tr>
        </thead>
        <tbody>
          ${users.map((u, i) => `
            <tr>
              <td>${i + 1}</td>
              <td><b>${u.name}</b></td>
              <td><code>${u.nid}</code></td>
              <td>${getCollegeName(u.college)}</td>
              <td>${getYearName(u.year)}</td>
              <td>${getComName(u.com)}</td>
              <td>${u.phone || '—'}</td>
              <td>${u.role === 'ADMIN' ? (isAr ? 'أدمن' : 'Admin') : (isAr ? 'عضو' : 'Member')}</td>
              <td>${u.createdAt}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <script>window.onload = function() { window.print(); }<\/script>
    </body>
    </html>
  `);
  printWin.document.close();
}

function exportStudentsCSV() {
  const users = getUsers();
  let csv = "\uFEFFالاسم,الرقم القومي,الكلية,الفرقة الدراسية,اللجنة,رقم الهاتف,البريد الإلكتروني,الرتبة,الحالة,تقييم الأداء,تاريخ التسجيل\n";
  users.forEach(u => {
    csv += `"${u.name}","'${u.nid}","${getCollegeName(u.college)}","${getYearName(u.year)}","${getComName(u.com)}","'${u.phone || ''}","${u.email || ''}","${u.role === 'ADMIN' ? 'أدمن / مشرف' : 'عضو'}","${u.status}","${u.score || 0}","${u.createdAt}"\n`;
  });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `اعضاء_اسرة_طلاب_من_اجل_مصر_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportArchivedEventCSV(eventId) {
  const isAr = lang === "ar";
  const archive = getStore("cf_events_archive", INIT_EVENTS_ARCHIVE);
  const ev = archive.find(x => x.id === eventId);
  if (!ev) return;
  let csv = "\uFEFFم,اسم الطالب,الرقم القومي,الكلية,الفرقة,اللجنة,رقم الهاتف,وقت الحضور,الفعالية,التاريخ\n";
  (ev.attendees || []).forEach((a, i) => {
    csv += `"${i + 1}","${a.studentName}","'${a.nid || ''}","${getCollegeName(a.college || '')}","${getYearName(a.year || '')}","${getComName(a.committee || '')}","'${a.phone || ''}","${a.time || ''}","${ev.title}","${ev.date}"\n`;
  });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `كشف_حضور_${ev.title.replace(/\s+/g, '_')}_${ev.date.replace(/[\/\\]/g, '-')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function printArchivedEventSheet(eventId) {
  const isAr = lang === "ar";
  const archive = getStore("cf_events_archive", INIT_EVENTS_ARCHIVE);
  const ev = archive.find(x => x.id === eventId);
  if (!ev) return;
  const printWin = window.open('', '_blank');
  if (!printWin) { alert(isAr ? 'يرجى السماح بالنوافذ المنبثقة للطباعة' : 'Please allow popups to print'); return; }
  printWin.document.write(`
    <!DOCTYPE html>
    <html dir="${isAr ? 'rtl' : 'ltr'}" lang="${lang}">
    <head>
      <meta charset="utf-8">
      <title>${isAr ? 'كشف حضور فعالية معتمدة' : 'Archived Event Attendance Sheet'} — ${ev.title}</title>
      <style>
        body { font-family: 'Cairo', Arial, sans-serif; padding: 24px; color: #333; direction: ${isAr ? 'rtl' : 'ltr'}; }
        .header { text-align: center; border-bottom: 2.5px solid #3B2616; padding-bottom: 12px; margin-bottom: 18px; }
        .header h1 { margin: 0; color: #3B2616; font-size: 22px; }
        .header h2 { margin: 6px 0 0; color: #C98A0B; font-size: 16px; }
        .meta { display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 13px; font-weight: bold; background: #F3E3BF; padding: 10px 16px; border-radius: 8px; flex-wrap: wrap; gap: 8px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: ${isAr ? 'right' : 'left'}; }
        th { background: #3B2616; color: #FFD97A; }
        tr:nth-child(even) { background: #fafafa; }
        .footer { margin-top: 36px; display: flex; justify-content: space-between; font-size: 13px; padding-top: 14px; border-top: 1px dashed #ccc; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${isAr ? 'أسرة طلاب من أجل مصر — جامعة حلوان الأهلية' : 'Students For Egypt — Helwan National University'}</h1>
        <h2>${isAr ? 'سجل حضور رسمي معتمد — حافظة الفعاليات' : 'Official Archived Event Attendance Record'}</h2>
      </div>
      <div class="meta">
        <div>${isAr ? 'اسم الفعالية: ' : 'Event: '}<b>${ev.title}</b></div>
        <div>${isAr ? 'تاريخ الانعقاد: ' : 'Date: '}<b>${ev.date} ${ev.time ? `(${ev.time})` : ''}</b></div>
        <div>${isAr ? 'عدد الحضور المسجل: ' : 'Total Attendees: '}<b>${(ev.attendees || []).length} ${isAr ? 'طالب' : 'students'}</b></div>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>${isAr ? 'اسم الطالب' : 'Student Name'}</th>
            <th>${isAr ? 'الرقم القومي' : 'National ID'}</th>
            <th>${isAr ? 'الكلية' : 'Faculty'}</th>
            <th>${isAr ? 'الفرقة' : 'Year'}</th>
            <th>${isAr ? 'اللجنة' : 'Committee'}</th>
            <th>${isAr ? 'رقم الهاتف' : 'Phone'}</th>
            <th>${isAr ? 'وقت التسجيل' : 'Time'}</th>
          </tr>
        </thead>
        <tbody>
          ${(ev.attendees || []).length === 0 ? `<tr><td colspan="8" style="text-align:center">${isAr ? 'لا يوجد حضور مسجل في هذه الفعالية.' : 'No attendees recorded.'}</td></tr>` : ev.attendees.map((a, i) => `
            <tr>
              <td>${i + 1}</td>
              <td><b>${a.studentName}</b></td>
              <td><code>${a.nid || '—'}</code></td>
              <td>${getCollegeName(a.college || '—')}</td>
              <td>${getYearName(a.year || '—')}</td>
              <td>${getComName(a.committee || '—')}</td>
              <td dir="ltr" style="text-align:right">${a.phone || '—'}</td>
              <td>${a.time || '—'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="footer">
        <div>${isAr ? 'مسؤول التنظيم: ' : 'OC Head: '}<b>محمد أشرف (Vice Head of OC)</b></div>
        <div>${isAr ? 'اعتماد رائد الأسرة: ' : 'Supervisor Approval: '}<b>د. محمد حلمي</b></div>
      </div>
      <script>window.onload = function() { window.print(); }<\/script>
    </body>
    </html>
  `);
  printWin.document.close();
}
