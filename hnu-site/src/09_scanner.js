/**
 * 09_scanner.js - Member QR Generator & Camera Scanner Engine
 * Part of HNU Students For Egypt Platform
 */

/* ---------- QR Member Code Generator ---------- */
let qrScannerActive = false, qrScanStream = null, qrScanAnim = null;

function generateMemberQr(curUser) {
  const canvas = document.getElementById('member-qr-canvas');
  if (!canvas || !curUser) return;

  const activeQr = getStore('cf_active_qr', { active: false });
  if (!activeQr.active) return;

  const payload = JSON.stringify({
    sid: curUser.id,
    nid: curUser.nid,
    name: curUser.name
  });

  if (typeof QRCode !== 'undefined' && QRCode.toCanvas) {
    QRCode.toCanvas(canvas, payload, {
      width: 210,
      margin: 1,
      color: { dark: '#3B2616', light: '#FFFFFF' }
    }, (err) => {
      if (err) console.error('QR generate error:', err);
    });
  } else {
    setTimeout(() => generateMemberQr(curUser), 100);
  }
}

function stopQrScanner() {
  qrScannerActive = false;
  if (qrScanAnim) { cancelAnimationFrame(qrScanAnim); qrScanAnim = null; }
  if (qrScanStream) { qrScanStream.getTracks().forEach(t => t.stop()); qrScanStream = null; }
  const wrap = document.getElementById('qr-scanner-wrap');
  if (wrap) wrap.style.display = 'none';
}

async function startQrScanner() {
  const wrap = document.getElementById('qr-scanner-wrap');
  const video = document.getElementById('qr-video');
  const canvas = document.getElementById('qr-canvas');
  const statusEl = document.getElementById('qr-scan-status');
  const msgEl = document.getElementById('admin-scan-msg');
  if (!wrap || !video || !canvas) return;

  try {
    qrScanStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } } });
    video.srcObject = qrScanStream;
    await video.play();
    wrap.style.display = 'block';
    qrScannerActive = true;
    if (statusEl) statusEl.textContent = lang === 'ar' ? '🔍 وجّه الكاميرا نحو QR العضو...' : '🔍 Point camera at member QR...';

    const ctx = canvas.getContext('2d');
    let lastScanned = '', lastScannedTime = 0;

    function scanFrame() {
      if (!qrScannerActive) return;
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        if (typeof jsQR !== 'undefined') {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' });
          if (code && code.data) {
            const now = Date.now();
            if (code.data !== lastScanned || now - lastScannedTime > 4000) {
              lastScanned = code.data;
              lastScannedTime = now;
              handleScannedMemberQr(code.data, statusEl, msgEl);
            }
          }
        }
      }
      qrScanAnim = requestAnimationFrame(scanFrame);
    }
    qrScanAnim = requestAnimationFrame(scanFrame);
  } catch (err) {
    if (msgEl) { msgEl.className = 'msg bad'; msgEl.textContent = lang === 'ar' ? '❌ يرجى السماح بالوصول للكاميرا من إعدادات المتصفح.' : '❌ Please allow camera access in browser settings.'; }
  }
}

async function handleScannedMemberQr(data, statusEl, msgEl) {
  try {
    let studentIdentifier = '';
    let studentName = '';
    try {
      const payload = JSON.parse(data);
      studentIdentifier = payload.sid || payload.nid || '';
      studentName = payload.name || '';
    } catch (_) {
      studentIdentifier = String(data).trim();
    }

    if (!studentIdentifier) return;

    const activeQr = getStore('cf_active_qr', { active: false, title: '' });
    if (!activeQr.active) {
      if (statusEl) statusEl.textContent = lang === 'ar' ? '⚠️ لا توجد جلسة نشطة' : '⚠️ No active session';
      if (msgEl) {
        msgEl.className = 'msg bad';
        msgEl.textContent = lang === 'ar' ? '⚠️ يرجى بدء جلسة حضور أولاً من النموذج بالأعلى قبل مسح الأعضاء.' : '⚠️ Please start an attendance session first before scanning.';
      }
      return;
    }

    if (statusEl) statusEl.textContent = lang === 'ar' ? '⏳ جاري تسجيل الحضور...' : '⏳ Recording attendance...';

    const curUserId = localStorage.getItem('cf_user_id');
    const curUser = getStore('cf_cur_user', null) || getUsers().find(u => u.id === curUserId);
    const res = await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: studentIdentifier,
        eventTitle: activeQr.title,
        requesterId: curUser?.id,
        requesterNid: curUser?.nid
      })
    });
    const result = await res.json();
    if (result.success) {
      if (result.alreadyRecorded) {
        // Warning notification tone (440Hz alert)
        try {
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.frequency.setValueAtTime(440, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.16);
        } catch (_) {}

        const displayName = result.studentName || studentName || studentIdentifier;
        if (statusEl) statusEl.textContent = '⚠️ ' + (lang === 'ar' ? 'مسجل مسبقاً: ' + displayName : 'Already Recorded: ' + displayName);
        if (msgEl) {
          msgEl.className = 'msg';
          msgEl.style.color = '#b45309';
          msgEl.textContent = lang === 'ar'
            ? `⚠️ تنبيه: الطالب (${displayName}) مسجل حضوره بالفعل مسبقاً في هذه الفعالية!`
            : `⚠️ Notice: (${displayName}) was already recorded in this event!`;
        }
      } else {
        // Success audio notification chime (880Hz crystal bell)
        try {
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.frequency.setValueAtTime(880, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.14, audioCtx.currentTime);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.14);
        } catch (_) {}

        if (navigator.vibrate) navigator.vibrate(100);

        const displayName = result.studentName || studentName || studentIdentifier;
        if (statusEl) statusEl.textContent = '✅ ' + (lang === 'ar' ? 'تم تسجيل: ' + displayName : 'Recorded: ' + displayName);
        if (msgEl) {
          msgEl.className = 'msg';
          msgEl.style.color = 'var(--g2)';
          msgEl.textContent = lang === 'ar' 
            ? `✅ تم تسجيل حضور الطالب (${displayName}) بنجاح وإضافته لكشف الحضور!` 
            : `✅ Attendance recorded for (${displayName}) and added to sheet!`;
        }

        // Immediately sync with database and update live sheet
        await syncAttendanceWithCloud();
        render('keep');
      }

      setTimeout(() => {
        if (msgEl) msgEl.textContent = '';
      }, 5000);
    } else {
      if (statusEl) statusEl.textContent = '⚠️ ' + (result.error || 'Error');
      if (msgEl) {
        msgEl.className = 'msg bad';
        msgEl.textContent = result.error || (lang === 'ar' ? 'فشل التسجيل.' : 'Recording failed.');
      }
    }
  } catch (err) {
    if (statusEl) statusEl.textContent = '❌ ' + (lang === 'ar' ? 'خطأ في الاتصال' : 'Connection error');
  }
}
