/**
 * 10_bootstrap.js - Application Bootstrap & Cloud Polling
 * Part of HNU Students For Egypt Platform
 */

// One-time auto-wipe of legacy test attendance from client localStorage
if (localStorage.getItem('cf_att_reset_v3') !== 'done') {
  localStorage.removeItem('cf_attendance');
  localStorage.removeItem('cf_events_archive');
  localStorage.removeItem('cf_active_qr');
  localStorage.removeItem('cf_deleted_archive_ids');
  localStorage.setItem('cf_att_reset_v3', 'done');
}

statics(); render(); syncWithCloud();
// After first render, generate member QR if student is logged in
(function() {
  const role = localStorage.getItem('cf_role');
  if (role === 'STUDENT') {
    const userId = localStorage.getItem('cf_user_id');
    const user = getUsers().find(u => u.id === userId) || getStore('cf_cur_user', null);
    if (user) setTimeout(() => generateMemberQr(user), 150);
  }
})();
// --- Smart, Bandwidth-Protected Background Polling ---
let smartPollTimer = null;

function runSmartPolling() {
  if (smartPollTimer) clearInterval(smartPollTimer);

  smartPollTimer = setInterval(() => {
    // 1. DO NOT poll at all if browser tab is hidden / minimized / screen locked
    if (document.hidden) return;

    const path = location.pathname;
    const role = localStorage.getItem('cf_role');

    // 2. Landing page (/) without admin/portal: ZERO POLLING!
    if (path === '/' || path === '') return;

    // 3. Member Portal (/portal): Only sync attendance (to check for active QR session or attendance confirmation)
    if (path === '/portal') {
      const activeQr = getStore("cf_active_qr", { active: false });
      const now = Date.now();
      const lastPoll = window._lastPortalPoll || 0;
      // If QR session active, check every 15s; if inactive, check every 45s
      const minInterval = activeQr.active ? 15000 : 45000;
      if (now - lastPoll >= minInterval) {
        window._lastPortalPoll = now;
        syncAttendanceWithCloud();
      }
      return;
    }

    // 4. Admin Panel (/admin):
    if (path === '/admin' && (role === 'ADMIN' || role === 'SUPER_ADMIN')) {
      const now = Date.now();
      // QR tab: poll attendance every 15s
      if (typeof curAtab !== 'undefined' && curAtab === 'qr') {
        const lastAttPoll = window._lastAdminAttPoll || 0;
        if (now - lastAttPoll >= 15000) {
          window._lastAdminAttPoll = now;
          syncAttendanceWithCloud();
        }
      }
      // Suggestions tab: poll every 60s
      else if (typeof curAtab !== 'undefined' && curAtab === 'sugs') {
        const lastSugPoll = window._lastAdminSugPoll || 0;
        if (now - lastSugPoll >= 60000) {
          window._lastAdminSugPoll = now;
          syncSuggestionsWithCloud();
        }
      }
      // Gallery tab: poll every 60s
      else if (typeof curAtab !== 'undefined' && curAtab === 'gallery') {
        const lastGalPoll = window._lastAdminGalPoll || 0;
        if (now - lastGalPoll >= 60000) {
          window._lastAdminGalPoll = now;
          syncGalleryWithCloud();
        }
      }
      // Members directory / overview: poll students only every 2 minutes
      else {
        const lastStdPoll = window._lastAdminStdPoll || 0;
        if (now - lastStdPoll >= 120000) {
          window._lastAdminStdPoll = now;
          if (typeof syncStudentsOnly === 'function') syncStudentsOnly();
        }
      }
    }
  }, 5000);
}

// Pause all network timers when tab goes to background, resume when user returns
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (smartPollTimer) clearInterval(smartPollTimer);
    smartPollTimer = null;
  } else {
    runSmartPolling();
    const path = location.pathname;
    if (path === '/portal' || path === '/admin') {
      syncAttendanceWithCloud();
    }
  }
});

runSmartPolling();
