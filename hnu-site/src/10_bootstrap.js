/**
 * 10_bootstrap.js - Application Bootstrap & Cloud Polling
 * Part of HNU Students For Egypt Platform
 */

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
