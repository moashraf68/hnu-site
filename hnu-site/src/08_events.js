/**
 * 08_events.js - Delegated Event Listeners & Interactive UI Wiring
 * Part of HNU Students For Egypt Platform
 */

/* ---------- Portal & Admin event handlers ---------- */
app.addEventListener("click", async e => {
  if (e.target.closest("#btn-show-register") || e.target.closest("#btn-show-register-sub")) {
    curAuthMode = "register";
    history.replaceState(null, "", "/register");
    render("keep");
    return;
  }
  if (e.target.closest("#btn-show-login") || e.target.closest("#btn-show-login-sub")) {
    curAuthMode = "login";
    history.replaceState(null, "", "/login");
    render("keep");
    return;
  }

  // Profile Edit Toggles
  if (e.target.closest("#btn-toggle-edit-profile")) {
    isEditingProfile = !isEditingProfile;
    render("keep");
    return;
  }
  if (e.target.closest("#btn-close-edit-profile")) {
    isEditingProfile = false;
    render("keep");
    return;
  }

  // Admin Print & Export buttons
  // Directory view mode switcher
  const viewModeBtn = e.target.closest("[data-view-mode]");
  if (viewModeBtn) {
    memberViewMode = viewModeBtn.dataset.viewMode;
    render("keep");
    return;
  }

  if (e.target.closest("#btn-print-attendance")) {
    printAttendanceReport();
    return;
  }
  if (e.target.closest("#btn-export-attendance-csv")) {
    exportAttendanceCSV();
    return;
  }
  if (e.target.closest("#btn-print-students")) {
    printStudentsDirectory();
    return;
  }
  if (e.target.closest("#btn-export-students-csv")) {
    exportStudentsCSV();
    return;
  }

  // Photo zoom for admin & members — show member photo in lightbox
  const avZoom = e.target.closest(".av-zoom-btn");
  if (avZoom) {
    e.preventDefault();
    e.stopPropagation();
    const photo = avZoom.dataset.photo || avZoom.querySelector("img")?.src;
    const name = avZoom.dataset.name || avZoom.querySelector("img")?.alt || "";
    if (photo) {
      openMemberPhoto(photo, name);
    }
    return;
  }

  // QR Scanner buttons
  if (e.target.closest("#btn-open-qr-scanner")) {
    await startQrScanner();
    return;
  }
  if (e.target.closest("#btn-close-qr-scanner")) {
    stopQrScanner();
    return;
  }

  const atab = e.target.closest("[data-atab]");
  if (atab) { curAtab = atab.dataset.atab; render("keep"); return; }

  const pwBtn = e.target.closest(".pw-toggle-btn");
  if (pwBtn) {
    const inp = pwBtn.parentElement.querySelector("input");
    if (inp) {
      if (inp.type === "password") {
        inp.type = "text";
        pwBtn.textContent = "🙈";
      } else {
        inp.type = "password";
        pwBtn.textContent = "👁️";
      }
    }
    return;
  }

  if (e.target.closest("#logout-btn")) {
    const isAr = lang === "ar";
    if (confirm(isAr ? "هل أنت متأكد من رغبتك في تسجيل الخروج من الحساب؟" : "Are you sure you want to log out?")) {
      localStorage.removeItem("cf_role");
      localStorage.removeItem("cf_user_id");
      localStorage.removeItem("cf_user_name");
      isEditingProfile = false;
      curAuthMode = "login";
      go("/portal");
    }
    return;
  }

  // Admin stops QR → archive attendees then clear
  if (e.target.closest("#btn-stop-qr") || e.target.closest("#btn-stop-qr-2")) {
    const isAr = lang === "ar";
    if (!confirm(isAr ? "هل تريد إنهاء الفعالية الحالية وإيقاف الـ QR وأرشفة سجلات الحضور؟" : "End event, stop QR and archive attendance records?")) return;
    const stopBtn = e.target.closest("#btn-stop-qr") || e.target.closest("#btn-stop-qr-2");
    if (stopBtn) { stopBtn.disabled = true; stopBtn.textContent = isAr ? '⏳ جاري الإنهاء...' : 'Stopping...'; }

    const activeQr = getStore("cf_active_qr", {});
    const attendances = getStore("cf_attendance", []);
    const eventsArchive = getStore("cf_events_archive", INIT_EVENTS_ARCHIVE);
    const curUserId = localStorage.getItem("cf_user_id");
    const curUser = getStore("cf_cur_user", null) || getUsers().find(u => u.id === curUserId);

    let enrichedAttendees = [];
    if (activeQr.title) {
      const users = getUsers();
      enrichedAttendees = attendances
        .filter(a => a.event === activeQr.title)
        .map(a => {
          const u = users.find(x => x.id === a.studentId) || {};
          return {
            studentId: a.studentId,
            studentName: a.studentName || u.name || "—",
            college: a.college || u.college || "—",
            committee: a.committee || u.com || "—",
            year: a.year || u.year || "—",
            phone: a.phone || u.phone || "—",
            nid: a.nid || u.nid || "—",
            photo: a.photo || u.photo || "",
            time: a.time,
            date: a.date
          };
        });
    }

    const archivePayload = activeQr.title ? {
      title: activeQr.title,
      date: new Date().toLocaleDateString('ar-EG'),
      time: new Date().toLocaleTimeString('ar-EG'),
      attendees: enrichedAttendees
    } : null;

    try {
      await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'STOP_QR',
          requesterId: curUser?.id,
          requesterNid: curUser?.nid,
          archiveData: archivePayload
        })
      });
    } catch (err) {}

    if (archivePayload) {
      eventsArchive.unshift({
        id: "ev-" + Date.now(),
        title: archivePayload.title,
        date: archivePayload.date,
        time: archivePayload.time,
        totalAttendees: enrichedAttendees.length,
        attendees: enrichedAttendees
      });
      setStore("cf_events_archive", eventsArchive);
    }
    setStore("cf_attendance", []);
    setStore("cf_active_qr", { active: false, title: "", image: "" });
    render("keep");
    return;
  }

  // Student registers attendance for active QR
  if (e.target.closest("#btn-student-record-att")) {
    const btn = e.target.closest("#btn-student-record-att");
    const userId = localStorage.getItem("cf_user_id");
    const users = getUsers();
    const curUser = getStore("cf_cur_user", null) || users.find(u => u.id === userId);
    const activeQr = getStore("cf_active_qr", { active: false });
    const isAr = lang === "ar";
    if (!curUser || !activeQr.active) return;

    btn.disabled = true;
    btn.textContent = isAr ? '⏳ جاري توثيق الحضور في السيرفر...' : 'Recording attendance...';

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'RECORD',
          studentId: curUser.id,
          eventTitle: activeQr.title
        })
      });
      const data = await res.json();
      if (data.success) {
        let attendances = getStore("cf_attendance", []);
        attendances.unshift({
          id: "att-" + Date.now(),
          studentId: curUser.id,
          studentName: curUser.name,
          college: curUser.college,
          committee: curUser.com,
          year: curUser.year,
          phone: curUser.phone || "—",
          nid: curUser.nid || "—",
          photo: curUser.photo || "",
          event: activeQr.title,
          time: new Date().toLocaleTimeString('ar-EG'),
          date: new Date().toLocaleDateString('ar-EG')
        });
        setStore("cf_attendance", attendances);
        await syncAttendanceWithCloud();
        render("keep");
      } else {
        alert(data.error || (isAr ? 'فشل تسجيل الحضور.' : 'Failed to record attendance.'));
        btn.disabled = false;
        btn.textContent = isAr ? 'تسجيل حضوري الآن في الفعالية ✅' : 'Record My Attendance Now ✅';
      }
    } catch (err) {
      alert(isAr ? 'حدث خطأ أثناء الاتصال بالسيرفر.' : 'Connection error.');
      btn.disabled = false;
      btn.textContent = isAr ? 'تسجيل حضوري الآن في الفعالية ✅' : 'Record My Attendance Now ✅';
    }
    return;
  }

  const toggleSug = e.target.closest("[data-toggle-sug]");
  if (toggleSug) {
    const id = toggleSug.dataset.toggleSug;
    const sugs = getStore("cf_sugs", []);
    const item = sugs.find(x => x.id === id);
    if (item) {
      item.done = !item.done;
      setStore("cf_sugs", sugs);
      render("keep");
      try {
        await fetch('/api/suggestions', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
      } catch (err) {
        console.warn('Suggestion status update notice:', err);
      }
    }
    return;
  }

  const delSug = e.target.closest("[data-delete-sug]");
  if (delSug) {
    const id = delSug.dataset.deleteSug;
    const isAr = lang === "ar";
    if (!confirm(isAr ? "هل أنت متأكد من رغبتك في مسح هذا المقترح نهائياً من قاعدة البيانات؟" : "Are you sure you want to permanently delete this suggestion?")) {
      return;
    }
    delSug.disabled = true;
    delSug.textContent = isAr ? 'جاري المسح...' : 'Deleting...';
    try {
      const res = await fetch(`/api/suggestions?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        let sugs = getStore("cf_sugs", []).filter(x => x.id !== id);
        setStore("cf_sugs", sugs);
        render("keep");
      } else {
        alert(data.error || (isAr ? "فشل مسح المقترح." : "Failed to delete suggestion."));
        delSug.disabled = false;
        delSug.textContent = isAr ? 'مسح' : 'Delete';
      }
    } catch (e) {
      alert(isAr ? "حدث خطأ في الاتصال بالخادم." : "Connection failed.");
      delSug.disabled = false;
      delSug.textContent = isAr ? 'مسح' : 'Delete';
    }
    return;
  }

  if (e.target.closest("#btn-sync-sugs-now")) {
    const btn = e.target.closest("#btn-sync-sugs-now");
    const isAr = lang === "ar";
    btn.disabled = true;
    btn.textContent = isAr ? 'جاري التحديث...' : 'Syncing...';
    await syncSuggestionsWithCloud();
    btn.disabled = false;
    btn.textContent = isAr ? '✓ تم التحديث' : '✓ Synced';
    render("keep");
    setTimeout(() => {
      if (btn) btn.textContent = isAr ? '🔄 تحديث المقترحات' : 'Refresh Suggestions';
    }, 2000);
    return;
  }

  const delGalleryItem = e.target.closest("[data-delete-gallery-item]");
  if (delGalleryItem) {
    const id = delGalleryItem.dataset.deleteGalleryItem;
    const itemUrl = delGalleryItem.dataset.itemUrl;
    const isAr = lang === "ar";
    const curUserId = localStorage.getItem("cf_user_id");
    const curUser = getStore("cf_cur_user", null) || getUsers().find(u => u.id === curUserId);
    if (!curUser || (!curUser.isSuperAdmin && curUser.role !== 'SUPER_ADMIN')) {
      alert(isAr ? "عذراً، صلاحية حذف عناصر المعرض مقتصرة حصرياً على المشرف العام (محمد أشرف)." : "Unauthorized: Super Admin only.");
      return;
    }
    if (!confirm(isAr ? "هل أنت متأكد من رغبتك في حذف هذا العنصر نهائياً من المعرض وقاعدة البيانات؟" : "Are you sure you want to permanently delete this item from the gallery and database?")) {
      return;
    }
    delGalleryItem.disabled = true;
    delGalleryItem.textContent = isAr ? 'جاري الحذف...' : 'Deleting...';
    try {
      const res = await fetch('/api/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          url: itemUrl,
          requesterId: curUser.id,
          requesterNid: curUser.nid
        })
      });
      const data = await res.json();
      if (data.success) {
        let gal = getGalleryItems().filter(x => x.id !== id && x.url !== itemUrl && x.url !== id);
        saveGalleryItems(gal);
        render("keep");
      } else {
        alert(data.error || (isAr ? "فشل حذف العنصر." : "Failed to delete item."));
        delGalleryItem.disabled = false;
        delGalleryItem.textContent = isAr ? 'حذف من المعرض' : 'Delete';
      }
    } catch (e) {
      alert(isAr ? "حدث خطأ في الاتصال بالخادم." : "Connection failed.");
      delGalleryItem.disabled = false;
      delGalleryItem.textContent = isAr ? 'حذف من المعرض' : 'Delete';
    }
    return;
  }

  if (e.target.closest("#btn-sync-gallery-now")) {
    const btn = e.target.closest("#btn-sync-gallery-now");
    const isAr = lang === "ar";
    btn.disabled = true;
    btn.textContent = isAr ? 'جاري التحديث...' : 'Syncing...';
    await syncGalleryWithCloud();
    btn.disabled = false;
    btn.textContent = isAr ? '✓ تم التحديث' : '✓ Synced';
    render("keep");
    setTimeout(() => {
      if (btn) btn.textContent = isAr ? '🔄 تحديث المعرض' : 'Refresh Gallery';
    }, 2000);
    return;
  }

  const evalStd = e.target.closest("[data-eval-std]");
  if (evalStd) {
    selectedEvalStudentId = evalStd.dataset.evalStd;
    curAtab = "evals";
    render("keep");
    return;
  }

  const toggleAdmin = e.target.closest("[data-toggle-admin]");
  if (toggleAdmin) {
    const sid = toggleAdmin.dataset.toggleAdmin;
    const users = getUsers();
    const s = users.find(u => u.id === sid);
    const curUserId = localStorage.getItem("cf_user_id");
    const curUser = getStore("cf_cur_user", null) || users.find(u => u.id === curUserId);
    const isAr = lang === "ar";

    if (!curUser || (!curUser.isSuperAdmin && curUser.role !== 'SUPER_ADMIN')) {
      alert(isAr ? 'عذراً، صلاحية تعيين وسحب الأدمن مقتصرة حصرياً على المشرف العام (محمد أشرف).' : 'Only the Super Admin can promote or demote admins.');
      return;
    }

    if (s) {
      const newRole = s.role === 'ADMIN' ? 'STUDENT' : 'ADMIN';
      toggleAdmin.disabled = true;
      toggleAdmin.textContent = isAr ? 'جاري التحديث...' : 'Updating...';

      try {
        const res = await fetch('/api/students', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: s.id,
            role: newRole,
            requesterId: curUser.id,
            requesterNid: curUser.nid
          })
        });
        const data = await res.json();
        if (data.success) {
          s.role = newRole;
          saveUsers(users);
          render("keep");
        } else {
          alert(data.error || (isAr ? 'فشل تحديث الصلاحية في قاعدة البيانات.' : 'Failed to update role in cloud.'));
          toggleAdmin.disabled = false;
        }
      } catch (err) {
        alert(isAr ? 'تعذر الاتصال بالخادم.' : 'Connection failed.');
        toggleAdmin.disabled = false;
      }
    }
    return;
  }

  // Live cloud sync button
  if (e.target.closest("#btn-sync-cloud-now")) {
    const isAr = lang === "ar";
    const btn = e.target.closest("#btn-sync-cloud-now");
    btn.disabled = true;
    btn.textContent = isAr ? 'جاري المزامنة...' : 'Syncing...';
    await syncWithCloud(true);
    btn.disabled = false;
    btn.textContent = isAr ? '✓ تم التحديث بنجاح' : '✓ Synced';
    setTimeout(() => {
      if (btn) btn.textContent = isAr ? '🔄 تحديث فوري من قاعدة البيانات' : 'Sync Live';
    }, 2000);
    return;
  }

  // Delete Member Permanently
  const delStd = e.target.closest("[data-delete-student]");
  if (delStd) {
    const sid = delStd.dataset.deleteStudent;
    const sname = delStd.dataset.studentName || 'هذا العضو';
    const snid = delStd.dataset.studentNid || '';
    const isAr = lang === "ar";

    if (!confirm(isAr 
      ? `⚠️ تحذير نهائي:\nهل أنت متأكد من رغبتك في حذف العضو (${sname}) نهائياً؟\nسيتم مسح حسابه وسجلات حضوره وتقييماته من قاعدة البيانات بالكامل كأنه لم يدخل إطلاقاً.` 
      : `⚠️ Are you sure you want to permanently erase member (${sname})? All data will be deleted.`)) {
      return;
    }

    delStd.disabled = true;
    delStd.textContent = isAr ? 'جاري الحذف...' : 'Deleting...';

    // 1. Delete from PostgreSQL Cloud Database
    try {
      const curUserId = localStorage.getItem("cf_user_id");
      const curUser = getStore("cf_cur_user", null) || getUsers().find(u => u.id === curUserId);
      const res = await fetch(`/api/students?id=${encodeURIComponent(sid)}&nid=${encodeURIComponent(snid)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: sid,
          nid: snid,
          requesterId: curUser?.id,
          requesterNid: curUser?.nid
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || (isAr ? 'فشل حذف العضو من قاعدة البيانات.' : 'Failed to delete member from cloud.'));
        delStd.disabled = false;
        delStd.textContent = isAr ? 'حذف' : 'Delete';
        return;
      }
    } catch (err) {
      console.warn('Cloud delete notice:', err);
    }

    // 2. Erase from local storage
    let currentUsers = getUsers().filter(u => u.id !== sid && u.nid !== snid);
    saveUsers(currentUsers);

    // 3. Erase from attendance records
    let currentAtts = getStore("cf_attendance", []).filter(a => a.studentId !== sid && a.nid !== snid);
    setStore("cf_attendance", currentAtts);

    // 4. Erase from archived events attendees
    let currentArchive = getStore("cf_events_archive", []);
    currentArchive.forEach(ev => {
      if (ev.attendees) {
        ev.attendees = ev.attendees.filter(a => a.studentId !== sid && a.nid !== snid);
        ev.totalAttendees = ev.attendees.length;
      }
    });
    setStore("cf_events_archive", currentArchive);

    alert(isAr ? `✅ تم حذف العضو (${sname}) وكافة بياناته نهائياً من قاعدة البيانات.` : `✅ Member and all records deleted permanently.`);
    render("keep");
    return;
  }

  // Clear eval search
  if (e.target.closest("#btn-clear-eval-search")) {
    evalSearchQuery = "";
    selectedEvalStudentId = "";
    render("keep");
    return;
  }

  // Select eval member from grid
  const selectEvalStd = e.target.closest("[data-select-eval-std]");
  if (selectEvalStd) {
    selectedEvalStudentId = selectEvalStd.dataset.selectEvalStd;
    render("keep");
    return;
  }

  // Toggle event archive expand/collapse
  const toggleEventArchive = e.target.closest("[data-toggle-event-archive]");
  if (toggleEventArchive) {
    const eid = toggleEventArchive.dataset.toggleEventArchive;
    openedEventArchiveId = openedEventArchiveId === eid ? "" : eid;
    render("keep");
    return;
  }

  // Export archived event CSV
  const exportEventCsv = e.target.closest("[data-export-event-csv]");
  if (exportEventCsv) {
    exportArchivedEventCSV(exportEventCsv.dataset.exportEventCsv);
    return;
  }

  // Print archived event sheet
  const printEvent = e.target.closest("[data-print-event]");
  if (printEvent) {
    printArchivedEventSheet(printEvent.dataset.printEvent);
    return;
  }

  // Delete archived event
  const deleteEvent = e.target.closest("[data-delete-event]");
  if (deleteEvent) {
    const isAr = lang === "ar";
    if (!confirm(isAr ? "هل تريد حذف كشف هذه الفعالية نهائياً من الأرشيف السحابي؟" : "Permanently delete this event from archive?")) return;
    const eid = deleteEvent.dataset.deleteEvent;
    const curUserId = localStorage.getItem("cf_user_id");
    const curUser = getStore("cf_cur_user", null) || getUsers().find(u => u.id === curUserId);

    deleteEvent.disabled = true;
    deleteEvent.textContent = isAr ? 'جاري الحذف...' : 'Deleting...';

    // 1. Add to deleted IDs set in localStorage
    let deletedIds = getStore("cf_deleted_archive_ids", []);
    if (!deletedIds.includes(eid)) {
      deletedIds.push(eid);
      setStore("cf_deleted_archive_ids", deletedIds);
    }

    // 2. Call backend DELETE to erase permanently from PostgreSQL events_archive
    try {
      await fetch('/api/attendance', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          archiveId: eid,
          id: eid,
          requesterId: curUser?.id,
          requesterNid: curUser?.nid
        })
      });
    } catch (err) {
      console.warn('Archive delete error:', err);
    }

    // 3. Update local store
    const archive = getStore("cf_events_archive", []);
    const updated = archive.filter(ev => ev.id !== eid);
    setStore("cf_events_archive", updated);
    if (openedEventArchiveId === eid) openedEventArchiveId = "";
    render("keep");
    return;
  }
});

function compressAndResizeImage(file, maxDim, callback, quality = 0.90) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      let w = img.width, h = img.height;
      if (w > h) {
        if (w > maxDim) { h = Math.round((h * maxDim) / w); w = maxDim; }
      } else {
        if (h > maxDim) { w = Math.round((w * maxDim) / h); h = maxDim; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, w, h);
      callback(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = function() { callback("/assets/images/logo.png"); };
    img.src = e.target.result;
  };
  reader.onerror = function() { callback("/assets/images/logo.png"); };
  reader.readAsDataURL(file);
}

// Profile photo upload preview in register & edit form
app.addEventListener("change", e => {
  if (e.target.id === "photo-file-input") {
    const file = e.target.files && e.target.files[0];
    if (file) {
      compressAndResizeImage(file, 1080, base64 => {
        regPhotoBase64 = base64;
        const box = $("#photo-preview-box");
        if (box) box.innerHTML = `<img src="${regPhotoBase64}" alt="Preview" style="width:100%;height:100%;object-fit:cover">`;
      }, 0.90);
    }
  }

  if (e.target.id === "edit-photo-file-input") {
    const file = e.target.files && e.target.files[0];
    if (file) {
      compressAndResizeImage(file, 1080, base64 => {
        editPhotoBase64 = base64;
        const box = $("#edit-photo-preview-box");
        if (box) box.innerHTML = `<img src="${editPhotoBase64}" alt="Preview" style="width:100%;height:100%;object-fit:cover">`;
      }, 0.90);
    }
  }

  if (e.target.id === "gallery-media-type") {
    const val = e.target.value;
    const fileWrap = $("#gallery-file-wrap");
    const vidWrap = $("#gallery-video-wrap");
    if (fileWrap && vidWrap) {
      fileWrap.style.display = val === "IMAGE" ? "block" : "none";
      vidWrap.style.display = val === "VIDEO" ? "block" : "none";
    }
  }

  if (e.target.id === "gallery-file-input") {
    const file = e.target.files && e.target.files[0];
    const prevCont = $("#gallery-preview-container");
    const prevImg = $("#gallery-preview-img");
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        if (prevImg) prevImg.src = ev.target.result;
        if (prevCont) prevCont.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      if (prevCont) prevCont.style.display = "none";
    }
  }

  if (e.target.name === "video_source_mode") {
    const isFile = e.target.value === "file";
    const fileSub = $("#video-file-subwrap");
    const urlSub = $("#video-url-subwrap");
    if (fileSub && urlSub) {
      fileSub.style.display = isFile ? "block" : "none";
      urlSub.style.display = isFile ? "none" : "block";
    }
  }

  if (e.target.id === "gallery-video-file-input") {
    const file = e.target.files && e.target.files[0];
    const prevCont = $("#gallery-video-preview-container");
    const prevVid = $("#gallery-video-preview-el");
    const msgEl = $("#gallery-form-msg");
    if (file) {
      const maxBytes = 4.2 * 1024 * 1024;
      if (file.size > maxBytes) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        if (msgEl) {
          msgEl.innerHTML = lang === "ar"
            ? `⚠️ حجم ملف الفيديو (${sizeMB} ميجا) يتجاوز الحد المسموح للرفع المباشر (4.2 ميجا).<br>💡 يُرجى اختيار <b>(رابط من أي منصة)</b> ووضع رابط الفيديو من فيسبوك أو يوتيوب أو تيك توك وسيعمل بأعلى جودة وبدون أي حد للحجم!`
            : `⚠️ Video size (${sizeMB}MB) exceeds 4.2MB limit. Please use the video link option.`;
          msgEl.style.color = 'var(--red)';
        }
        e.target.value = '';
        if (prevCont) prevCont.style.display = "none";
        return;
      }
      if (msgEl) msgEl.textContent = '';
      const objUrl = URL.createObjectURL(file);
      if (prevVid) prevVid.src = objUrl;
      if (prevCont) prevCont.style.display = "block";
    } else {
      if (prevCont) prevCont.style.display = "none";
    }
  }
});

// Form Submissions
app.addEventListener("submit", async e => {
  // 1. Unified Login Form
  const loginForm = e.target.closest("#unified-login-form");
  if (loginForm) {
    e.preventDefault();
    const isAr = lang === "ar";
    const msg = $("#login-msg");
    const submitBtn = loginForm.querySelector("button[type=submit]");

    if (lockoutSecondsRemaining > 0) {
      msg.className = "msg bad";
      msg.textContent = isAr 
        ? `⚠️ تم قفل محاولات تسجيل الدخول مؤقتاً لحماية حسابك. يرجى الانتظار (${lockoutSecondsRemaining}) ثانية.`
        : `⚠️ Too many failed attempts. Please wait (${lockoutSecondsRemaining})s before retrying.`;
      return;
    }

    let nid = loginForm.nid.value.trim();
    const pw = loginForm.pw.value.trim();
    nid = nid.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add("loading");
      submitBtn.innerHTML = `<span class="spinner"></span> ${isAr ? 'جاري التحقق من الهوية والصلاحيات...' : 'Authenticating...'}`;
    }
    msg.className = "msg";
    msg.textContent = isAr ? "جاري تسجيل الدخول..." : "Signing in...";

    let authenticatedUser = null;
    let serverError = "";

    // 1. Try Remote Cloud Database API first
    try {
      const res = await fetch('/api/auth?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nid, pw })
      });
      const data = await res.json();
      if (data.success && data.user) {
        authenticatedUser = data.user;
      } else if (data.error) {
        serverError = data.error;
      }
    } catch (apiErr) {
      console.warn('Remote auth notice:', apiErr);
    }

    // 2. Fallback to local verified users if offline or network failure
    if (!authenticatedUser) {
      const users = getUsers();
      authenticatedUser = users.find(u => u.nid === nid && u.pw === pw);
    }

    if (authenticatedUser) {
      loginAttempts = 0;
      msg.className = "msg";
      msg.textContent = isAr ? "✅ تم التحقق بنجاح! جاري الدخول للوحة التحكم..." : "✅ Authenticated! Redirecting...";
      
      // Update local storage with current verified user
      const users = getUsers();
      const existingIdx = users.findIndex(u => u.nid === authenticatedUser.nid);
      if (existingIdx >= 0) users[existingIdx] = { ...users[existingIdx], ...authenticatedUser };
      else users.unshift(authenticatedUser);
      saveUsers(users);

      setStore("cf_cur_user", authenticatedUser);
      localStorage.setItem("cf_role", authenticatedUser.role);
      localStorage.setItem("cf_user_id", authenticatedUser.id);
      localStorage.setItem("cf_user_name", authenticatedUser.name);
      setTimeout(() => {
        const isAdmin = authenticatedUser.role === "ADMIN" || authenticatedUser.role === "SUPER_ADMIN" || authenticatedUser.isSuperAdmin;
        history.replaceState(null, "", isAdmin ? "/admin" : "/portal");
        render();
      }, 350);
    } else {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove("loading");
        submitBtn.textContent = isAr ? 'تسجيل الدخول' : 'Sign In';
      }
      loginAttempts++;
      if (loginAttempts >= 5) {
        lockoutSecondsRemaining = 60;
        if (submitBtn) submitBtn.disabled = true;
        msg.className = "msg bad";
        msg.textContent = isAr 
          ? `🔒 تم قفل محاولات الدخول مؤقتاً لمدة 60 ثانية لحماية الحساب من التخمين.`
          : `🔒 Temporarily locked for 60 seconds due to repeated failed attempts.`;

        clearInterval(lockoutTimer);
        lockoutTimer = setInterval(() => {
          lockoutSecondsRemaining--;
          if (lockoutSecondsRemaining <= 0) {
            clearInterval(lockoutTimer);
            loginAttempts = 0;
            if (submitBtn) submitBtn.disabled = false;
            msg.className = "msg";
            msg.textContent = isAr ? "يمكنك الآن المحاولة مجدداً." : "You can try logging in now.";
          } else {
            msg.textContent = isAr 
              ? `🔒 متبقي (${lockoutSecondsRemaining}) ثانية لفك القفل المؤقت...`
              : `🔒 Locked. (${lockoutSecondsRemaining})s remaining...`;
          }
        }, 1000);
      } else {
        const remaining = 5 - loginAttempts;
        msg.className = "msg bad";
        msg.textContent = (serverError ? serverError + " " : (isAr ? "الرقم القومي أو كلمة المرور غير صحيحة. " : "Invalid National ID or password. ")) + (isAr 
          ? `(محاولات متبقية قبل القفل: ${remaining})`
          : `(${remaining} attempts left)`);
      }
    }
    return;
  }

  // 2. Register Form
  const regForm = e.target.closest("#unified-register-form");
  if (regForm) {
    e.preventDefault();
    const isAr = lang === "ar";
    const fullName = regForm.fullName.value.trim();
    const nid = regForm.nid.value.trim();
    const pw = regForm.pw.value.trim();
    const pwConfirm = regForm.pwConfirm.value.trim();
    const phone = regForm.phone.value.trim();
    const email = (regForm.email && regForm.email.value.trim()) || "";
    const college = regForm.college.value;
    const year = regForm.year.value;
    const com = regForm.com.value;
    const msg = $("#reg-msg");
    const submitBtn = regForm.querySelector("button[type=submit]");

    if (pw !== pwConfirm) {
      msg.className = "msg bad";
      msg.textContent = isAr ? "كلمة المرور وتأكيدها غير متطابقين." : "Passwords do not match.";
      return;
    }
    if (!/^[0-9]{14}$/.test(nid)) {
      msg.className = "msg bad";
      msg.textContent = isAr ? "الرقم القومي يجب أن يتكون من 14 رقماً بالضبط." : "National ID must be exactly 14 digits.";
      return;
    }

    const users = getUsers();
    if (users.some(u => u.nid === nid)) {
      msg.className = "msg bad";
      msg.textContent = isAr ? "الرقم القومي هذا مسجل بالفعل. يرجى تسجيل الدخول مباشرة." : "This National ID is already registered. Please sign in.";
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add("loading");
      submitBtn.innerHTML = `<span class="spinner"></span> ${isAr ? 'جاري إنشاء الحساب وتفعيل العضوية...' : 'Creating account...'}`;
    }

    let newUser = {
      id: "std-" + Date.now(),
      name: sanitize(fullName),
      nid: sanitize(nid),
      pw: pw,
      phone: sanitize(phone),
      email: sanitize(email),
      college: sanitize(college),
      year: sanitize(year),
      com: sanitize(com),
      photo: regPhotoBase64 || "/assets/images/logo.png",
      role: "STUDENT",
      score: 9.0,
      status: "نشط",
      createdAt: new Date().toLocaleDateString('ar-EG')
    };

    // Save to PostgreSQL Cloud Database
    try {
      const res = await fetch('/api/auth?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: newUser.name,
          nid: newUser.nid,
          pw: newUser.pw,
          phone: newUser.phone,
          email: newUser.email,
          college: newUser.college,
          year: newUser.year,
          com: newUser.com,
          photo: newUser.photo
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        newUser = { ...newUser, ...data.user };
      }
    } catch (cloudErr) {
      console.warn('Cloud registration sync notice:', cloudErr);
    }

    users.push(newUser);
    saveUsers(users);

    msg.className = "msg";
    msg.textContent = isAr ? "✅ تم إنشاء الحساب بنجاح! جاري تحويلك لبوابتك..." : "✅ Account created successfully! Redirecting...";
    localStorage.setItem("cf_role", "STUDENT");
    localStorage.setItem("cf_user_id", newUser.id);
    localStorage.setItem("cf_user_name", newUser.name);
    setTimeout(() => {
      history.replaceState(null, "", "/portal");
      render();
    }, 400);
    return;
  }

  // 3. Admin Upload QR Form — starts attendance session (no image needed)
  const qrForm = e.target.closest("#admin-upload-qr-form");
  if (qrForm) {
    e.preventDefault();
    const title = (qrForm.eventTitle.value || "").trim();
    const msg = $("#admin-qr-msg");
    const submitBtn = qrForm.querySelector("button[type=submit]");
    const curUserId = localStorage.getItem("cf_user_id");
    const curUser = getStore("cf_cur_user", null) || getUsers().find(u => u.id === curUserId);
    const isAr = lang === "ar";

    if (!title) {
      if (msg) { msg.className = "msg bad"; msg.textContent = isAr ? "يرجى كتابة عنوان الاجتماع/الفعالية." : "Please enter a meeting/event title."; }
      return;
    }

    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = isAr ? "⏳ جاري البدء..." : "Starting..."; }
    if (msg) { msg.className = "msg"; msg.textContent = ""; }

    fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'SET_ACTIVE_QR',
        title: title,
        image: '',
        requesterId: curUser?.id,
        requesterNid: curUser?.nid
      })
    }).then(r => r.json()).then(data => {
      if (data.success) {
        setStore("cf_active_qr", {
          active: true,
          title: title,
          image: '',
          createdAt: new Date().toLocaleTimeString('ar-EG')
        });
        if (msg) { msg.className = "msg"; msg.textContent = isAr ? "✅ تم بدء جلسة الحضور! QR خاص يظهر الآن لكل عضو في بوابته 🚀" : "✅ Attendance session started! Each member now sees their personal QR."; }
        setTimeout(() => render("keep"), 400);
      } else {
        if (msg) { msg.className = "msg bad"; msg.textContent = data.error || (isAr ? "فشل بدء الجلسة." : "Failed to start session."); }
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = isAr ? "🚀 بدء جلسة الحضور" : "🚀 Start Session"; }
      }
    }).catch(() => {
      if (msg) { msg.className = "msg bad"; msg.textContent = isAr ? "حدث خطأ في الاتصال بالسيرفر." : "Connection error."; }
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = isAr ? "🚀 بدء جلسة الحضور" : "🚀 Start Session"; }
    });
    return;
  }

  // 4. Admin Evaluation Form
  const evalForm = e.target.closest("#new-eval-form");
  if (evalForm) {
    e.preventDefault();
    const sid = evalForm.studentId.value;
    const score = parseFloat(evalForm.score.value);
    const notes = evalForm.notes.value.trim();
    const users = getUsers();
    const s = users.find(u => u.id === sid);
    const isAr = lang === "ar";
    const m = $("#eval-msg");
    const submitBtn = evalForm.querySelector("button[type=submit]");
    const curUserId = localStorage.getItem("cf_user_id");
    const curUser = getStore("cf_cur_user", null) || users.find(u => u.id === curUserId);

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = isAr ? "جاري الحفظ في السيرفر..." : "Saving to database...";
    }

    try {
      const res = await fetch('/api/students', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: sid,
          score: score,
          notes: notes,
          requesterId: curUser?.id,
          requesterNid: curUser?.nid
        })
      });
      const data = await res.json();
      if (data.success) {
        if (s) {
          s.score = score;
          s.notes = notes;
          saveUsers(users);
        }
        if (m) {
          m.className = "msg";
          m.textContent = isAr ? `✅ تم حفظ وتحديث تقييم العضو (${s ? s.name : ''}) في قاعدة البيانات بنجاح (${score} / 10) 🌟` : `Evaluation updated in database (${score} / 10) 🌟`;
        }
        await syncWithCloud(true);
      } else {
        if (m) {
          m.className = "msg bad";
          m.textContent = data.error || (isAr ? "⚠️ فشل حفظ التقييم في قاعدة البيانات." : "Failed to save evaluation.");
        }
      }
    } catch (err) {
      if (m) {
        m.className = "msg bad";
        m.textContent = isAr ? "⚠️ حدث خطأ في الاتصال بالسيرفر." : "Connection failed.";
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = isAr ? "اعتماد وحفظ التقييم" : "Save Evaluation";
      }
    }
    return;
  }

  // 5. Edit Profile Form
  const editProfForm = e.target.closest("#edit-profile-form");
  if (editProfForm) {
    e.preventDefault();
    const userId = localStorage.getItem("cf_user_id");
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    const msg = $("#edit-prof-msg");
    if (!user) return;

    const phone = editProfForm.phone.value.trim();
    const email = editProfForm.email.value.trim();
    const newPw = editProfForm.newPw.value.trim();
    const newPwConfirm = editProfForm.newPwConfirm.value.trim();

    if (newPw) {
      if (newPw !== newPwConfirm) {
        msg.className = "msg bad";
        msg.textContent = lang === "ar" ? "كلمة المرور الجديدة وتأكيدها غير متطابقين." : "New passwords do not match.";
        return;
      }
      if (newPw.length < 6) {
        msg.className = "msg bad";
        msg.textContent = lang === "ar" ? "كلمة المرور يجب أن تتكون من 6 أحرف على الأقل." : "Password must be at least 6 characters.";
        return;
      }
      user.pw = newPw;
    }

    user.phone = sanitize(phone);
    user.email = sanitize(email);
    if (editPhotoBase64) {
      user.photo = editPhotoBase64;
    }

    saveUsers(users);
    setStore("cf_cur_user", user);
    msg.className = "msg";
    msg.textContent = lang === "ar" ? "⏳ جاري حفظ التعديلات على السيرفر..." : "⏳ Saving to server...";

    // Sync photo + profile to cloud DB
    try {
      const patchBody = { id: user.id, phone: user.phone, email: user.email, requesterId: user.id, requesterNid: user.nid };
      if (editPhotoBase64) patchBody.photo = editPhotoBase64;
      await fetch('/api/students', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patchBody) });
    } catch (_) {}

    msg.className = "msg";
    msg.textContent = lang === "ar" ? "✅ تم تحديث بياناتك بنجاح على السيرفر!" : "✅ Profile updated on server!";
    setTimeout(() => {
      isEditingProfile = false;
      editPhotoBase64 = "";
      render("keep");
    }, 600);
    return;
  }

  // 6. Admin Add Gallery Media Form
  const galForm = e.target.closest("#admin-add-gallery-form");
  if (galForm) {
    e.preventDefault();
    const isAr = lang === "ar";
    const msgEl = $("#gallery-form-msg");
    const submitBtn = $("#gallery-submit-btn");
    const mediaType = ($("#gallery-media-type") || {}).value || "IMAGE";
    const title = (($("#gallery-media-title") || {}).value || "").trim();

    const curUserId = localStorage.getItem("cf_user_id");
    const curUser = getStore("cf_cur_user", null) || getUsers().find(u => u.id === curUserId);
    if (!curUser || (!curUser.isSuperAdmin && curUser.role !== 'SUPER_ADMIN')) {
      if (msgEl) {
        msgEl.textContent = isAr ? '⚠️ غير مصرح: هذه الميزة للمشرف العام فقط.' : '⚠️ Unauthorized: Super Admin only.';
        msgEl.style.color = 'var(--red)';
      }
      return;
    }

    if (mediaType === "IMAGE") {
      const fileInput = $("#gallery-file-input");
      const file = fileInput && fileInput.files && fileInput.files[0];
      if (!file) {
        if (msgEl) {
          msgEl.textContent = isAr ? '⚠️ برجاء اختيار ملف صورة أولاً.' : '⚠️ Please select an image file first.';
          msgEl.style.color = 'var(--red)';
        }
        return;
      }

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = isAr ? '⏳ جاري الضغط والرفع للسحابة...' : '⏳ Uploading...'; }
      if (msgEl) msgEl.textContent = '';

      compressAndResizeImage(file, 1200, async (base64) => {
        try {
          const res = await fetch('/api/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url: base64,
              type: 'IMAGE',
              title: title,
              requesterId: curUser.id,
              requesterNid: curUser.nid
            })
          });
          const data = await res.json();
          if (data.success) {
            const currentGal = getGalleryItems();
            const newItem = data.item ? {
              id: data.item.id,
              url: data.item.url,
              type: data.item.type || 'IMAGE',
              title: data.item.title || title,
              createdAt: data.item.created_at ? new Date(data.item.created_at).toISOString().slice(0, 10) : ''
            } : {
              id: 'gal-' + Date.now(),
              url: base64,
              type: 'IMAGE',
              title: title,
              createdAt: new Date().toISOString().slice(0, 10)
            };
            saveGalleryItems([newItem, ...currentGal.filter(x => x.id !== newItem.id)]);
            render('keep');
          } else {
            if (msgEl) {
              msgEl.textContent = data.error || (isAr ? '❌ حدث خطأ أثناء الرفع.' : '❌ Upload failed.');
              msgEl.style.color = 'var(--red)';
            }
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = isAr ? '🚀 إضافة إلى المعرض السحابي' : 'Add to Cloud Gallery'; }
          }
        } catch (err) {
          if (msgEl) {
            msgEl.textContent = isAr ? '❌ تعذر الاتصال بالخادم.' : '❌ Server error.';
            msgEl.style.color = 'var(--red)';
          }
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = isAr ? '🚀 إضافة إلى المعرض السحابي' : 'Add to Cloud Gallery'; }
        }
      });
    } else {
      // VIDEO: either file upload or link from any platform
      const isFileMode = $("#vmode-file") ? $("#vmode-file").checked : true;

      const saveVideoToCloud = async (finalUrl) => {
        try {
          const res = await fetch('/api/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url: finalUrl,
              type: 'VIDEO',
              title: title,
              requesterId: curUser.id,
              requesterNid: curUser.nid
            })
          });
          const data = await res.json();
          if (data.success) {
            const currentGal = getGalleryItems();
            const newItem = data.item ? {
              id: data.item.id,
              url: data.item.url,
              type: data.item.type || 'VIDEO',
              title: data.item.title || title,
              createdAt: data.item.created_at ? new Date(data.item.created_at).toISOString().slice(0, 10) : ''
            } : {
              id: 'gal-' + Date.now(),
              url: finalUrl,
              type: 'VIDEO',
              title: title,
              createdAt: new Date().toISOString().slice(0, 10)
            };
            saveGalleryItems([newItem, ...currentGal.filter(x => x.id !== newItem.id)]);
            render('keep');
          } else {
            if (msgEl) {
              msgEl.textContent = data.error || (isAr ? '❌ حدث خطأ أثناء الحفظ.' : '❌ Save failed.');
              msgEl.style.color = 'var(--red)';
            }
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = isAr ? '🚀 إضافة إلى المعرض السحابي' : 'Add to Cloud Gallery'; }
          }
        } catch (err) {
          if (msgEl) {
            msgEl.textContent = isAr ? '❌ تعذر الاتصال بالخادم.' : '❌ Server error.';
            msgEl.style.color = 'var(--red)';
          }
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = isAr ? '🚀 إضافة إلى المعرض السحابي' : 'Add to Cloud Gallery'; }
        }
      };

      if (isFileMode) {
        const vidFileInput = $("#gallery-video-file-input");
        const file = vidFileInput && vidFileInput.files && vidFileInput.files[0];
        if (!file) {
          if (msgEl) {
            msgEl.textContent = isAr ? '⚠️ برجاء اختيار ملف فيديو من جهازك أولاً.' : '⚠️ Please select a video file first.';
            msgEl.style.color = 'var(--red)';
          }
          return;
        }

        if (file.size > 4.2 * 1024 * 1024) {
          const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
          if (msgEl) {
            msgEl.innerHTML = isAr 
              ? `⚠️ حجم ملف الفيديو (${sizeMB} ميجا) يتجاوز الحد المسموح للرفع المباشر (4.2 ميجا). يُرجى اختيار (رابط من أي منصة) لوضع رابطه من فيسبوك أو يوتيوب أو تيك توك بدون أي حد للحجم.`
              : `⚠️ Video size (${sizeMB}MB) exceeds 4.2MB limit.`;
            msgEl.style.color = 'var(--red)';
          }
          return;
        }

        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = isAr ? '⏳ جاري تحويل ورفع ملف الفيديو للسحابة...' : '⏳ Uploading video...'; }
        if (msgEl) msgEl.textContent = '';

        const reader = new FileReader();
        reader.onload = async rev => {
          await saveVideoToCloud(rev.target.result);
        };
        reader.onerror = () => {
          if (msgEl) {
            msgEl.textContent = isAr ? '❌ تعذر قراءة ملف الفيديو.' : '❌ Failed to read video file.';
            msgEl.style.color = 'var(--red)';
          }
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = isAr ? '🚀 إضافة إلى المعرض السحابي' : 'Add to Cloud Gallery'; }
        };
        reader.readAsDataURL(file);
      } else {
        // Video URL Mode (Facebook, TikTok, Instagram, YouTube, Vimeo, Drive, direct video)
        const vidInput = $("#gallery-video-url");
        const videoUrl = vidInput ? vidInput.value.trim() : '';
        if (!videoUrl) {
          if (msgEl) {
            msgEl.textContent = isAr ? '⚠️ برجاء كتابة رابط الفيديو من فيسبوك، تيك توك، يوتيوب، أو أي منصة.' : '⚠️ Please enter video URL.';
            msgEl.style.color = 'var(--red)';
          }
          return;
        }

        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = isAr ? '⏳ جاري الحفظ في السحابة...' : '⏳ Saving...'; }
        if (msgEl) msgEl.textContent = '';

        await saveVideoToCloud(videoUrl);
      }
    }
    return;
  }
});

app.addEventListener("input", e => {
  const evalSearch = e.target.closest("#eval-search-inp");
  if (evalSearch) {
    evalSearchQuery = evalSearch.value;
    const curPos = evalSearch.selectionStart;
    render("keep");
    const newInp = document.getElementById("eval-search-inp");
    if (newInp) {
      newInp.focus();
      try { newInp.setSelectionRange(curPos, curPos); } catch {}
    }
    return;
  }

  const search = e.target.closest("#student-search");
  if (search) {
    studentSearchQuery = search.value.trim();
    render("keep");
    const newInp = document.getElementById("student-search");
    if (newInp) {
      newInp.focus();
      try { newInp.setSelectionRange(search.selectionStart, search.selectionStart); } catch {}
    }
    return;
  }
});

// Directory sort/filter/view controls
app.addEventListener("change", e => {
  if (e.target.id === "dir-sort-select") {
    memberSortBy = e.target.value;
    render("keep");
    return;
  }
  if (e.target.id === "dir-com-filter") {
    memberFilterCom = e.target.value;
    render("keep");
    return;
  }
  if (e.target.id === "dir-tier-filter") {
    memberFilterTier = e.target.value;
    render("keep");
    return;
  }
});

async function syncSuggestionsWithCloud() {
  try {
    const res = await fetch('/api/suggestions?t=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    if (data.success && Array.isArray(data.suggestions)) {
      const localSugs = getStore("cf_sugs", []);
      const changed = JSON.stringify(data.suggestions) !== JSON.stringify(localSugs);
      if (changed) {
        setStore("cf_sugs", data.suggestions);
        const curPath = location.pathname;
        if (curPath === '/admin' || curPath === '/portal') {
          render('keep');
        }
      }
    }
  } catch (err) {}
}

async function syncGalleryWithCloud() {
  try {
    const res = await fetch('/api/gallery?t=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    if (data.success && Array.isArray(data.items)) {
      const local = getStore("cf_gallery", []);
      const changed = JSON.stringify(data.items) !== JSON.stringify(local);
      if (changed) {
        setStore("cf_gallery", data.items);
        const curPath = location.pathname;
        if (curPath === '/' || curPath === '/admin' || curPath === '/portal') {
          render('keep');
        }
      }
    }
  } catch (err) {}
}

async function syncAttendanceWithCloud() {
  try {
    const res = await fetch('/api/attendance?t=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    if (data.success) {
      let changed = false;

      // 1. Sync Active QR Code
      if (data.activeQr) {
        const localQr = getStore("cf_active_qr", { active: false, title: "", image: "" });
        const qrChanged = localQr.active !== data.activeQr.active ||
                          localQr.title !== data.activeQr.title ||
                          localQr.image !== data.activeQr.image;
        if (qrChanged) {
          setStore("cf_active_qr", data.activeQr);
          changed = true;
        }
      }

      // 2. Sync Live Attendances
      if (Array.isArray(data.attendances)) {
        const localAtts = getStore("cf_attendance", []);
        if (JSON.stringify(data.attendances) !== JSON.stringify(localAtts)) {
          setStore("cf_attendance", data.attendances);
          changed = true;
        }
      }

      // 3. Sync Archived Events
      if (Array.isArray(data.archivedEvents)) {
        const deletedIds = getStore("cf_deleted_archive_ids", []);
        const filteredArch = data.archivedEvents.filter(e => !deletedIds.includes(e.id));
        const localArch = getStore("cf_events_archive", []);
        if (JSON.stringify(filteredArch) !== JSON.stringify(localArch)) {
          setStore("cf_events_archive", filteredArch);
          changed = true;
        }
      }

      if (changed) {
        const curPath = location.pathname;
        if (curPath === '/admin' || curPath === '/portal') {
          render('keep');
          // Re-generate member QR after re-render if student is viewing portal
          if (curPath === '/portal' && localStorage.getItem('cf_role') === 'STUDENT') {
            const userId = localStorage.getItem('cf_user_id');
            const user = getUsers().find(u => u.id === userId) || getStore('cf_cur_user', null);
            const aqr = getStore('cf_active_qr', { active: false, title: '' });
            if (user && aqr.active) setTimeout(() => generateMemberQr(user, aqr.title), 150);
          }
        }
      }
    }
  } catch (err) {}
}

async function syncWithCloud(forceRender) {
  try {
    const res = await fetch('/api/students?t=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    if (data.success && Array.isArray(data.students)) {
      const localUsers = getUsers();

      // 1. Build authoritative user list from cloud
      let updatedList = data.students;

      const changed = JSON.stringify(updatedList.map(u => ({ id: u.id, nid: u.nid, role: u.role, score: u.score, notes: u.notes }))) !==
                      JSON.stringify(localUsers.map(u => ({ id: u.id, nid: u.nid, role: u.role, score: u.score, notes: u.notes })));

      if (changed || forceRender) {
        saveUsers(updatedList);
        const curPath = location.pathname;
        if (curPath === '/admin' || curPath === '/portal') {
          render('keep');
        }
      }
    }
  } catch (err) {
    // Graceful offline fallback
  }

  syncSuggestionsWithCloud();
  syncGalleryWithCloud();
  syncAttendanceWithCloud();
}
