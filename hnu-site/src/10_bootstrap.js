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
// Auto poll every 3 seconds for real-time live updates from database!
setInterval(() => { syncWithCloud(); }, 3000);
