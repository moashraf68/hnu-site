/**
 * 03_state.js - Global State, Store accessors, Metric calculations
 * Part of HNU Students For Egypt Platform
 */

/* ---------- Central Family Portal & Admin ---------- */
let curAuthMode = "login", curAtab = "overview", studentSearchQuery = "", evalSearchQuery = "", selectedEvalStudentId = "", openedEventArchiveId = "", regPhotoBase64 = "", isEditingProfile = false, editPhotoBase64 = "";
let memberSortBy = "score_desc", memberFilterCom = "all", memberFilterCollege = "all", memberFilterTier = "all", memberViewMode = "table", biFilterCom = "all", studentSearchTimer = null;
const getStore = (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } };
const setStore = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

const INIT_EVENTS_ARCHIVE = [];

const DEFAULT_USERS = [];

function getUsers() {
  const users = getStore("cf_users_v4", null);
  if (!users || !Array.isArray(users)) {
    return [];
  }
  return users.filter(u => u.nid !== '12121212121212');
}
function saveUsers(u) {
  const cleanList = Array.isArray(u) ? u.filter(x => x && x.nid !== '12121212121212') : [];
  setStore("cf_users_v4", cleanList);
}

const COLLEGES = [
  "هندسة",
  "حاسبات",
  "فنون",
  "بيزنس",
  "علوم",
  "علوم صحية",
  "طب أسنان",
  "طب بشري",
  "علاج طبيعي",
  "لغات وترجمة",
  "حقوق"
];

const COMMITTEES_MAP = {
  oc: "التنظيم (OC)",
  hr: "الموارد البشرية (HR)",
  media: "الميديا (Media)",
  pr: "العلاقات العامة (PR)"
};

const YEARS = ["الفرقة الأولى", "الفرقة الثانية", "الفرقة الثالثة", "الفرقة الرابعة", "خريج"];

function getComName(code) {
  if (lang === "en") {
    const enMap = {
      oc: "Operations Committee (OC)",
      hr: "Human Resources (HR)",
      media: "Media Committee",
      pr: "Public Relations (PR)"
    };
    return enMap[code] || code;
  }
  return COMMITTEES_MAP[code] || code;
}

function getCollegeName(c) {
  if (lang === "en") {
    const enColleges = {
      "هندسة": "Faculty of Engineering",
      "حاسبات": "Faculty of Computers & AI",
      "فنون": "Faculty of Applied Arts",
      "بيزنس": "Faculty of Business",
      "علوم": "Faculty of Science",
      "علوم صحية": "Applied Health Sciences",
      "طب أسنان": "Faculty of Dentistry",
      "طب بشري": "Faculty of Medicine",
      "علاج طبيعي": "Faculty of Physical Therapy",
      "لغات وترجمة": "Languages & Translation",
      "حقوق": "Faculty of Law"
    };
    return enColleges[c] || c;
  }
  return c;
}

function getYearName(y) {
  if (lang === "en") {
    const enYears = {
      "الفرقة الأولى": "First Year",
      "الفرقة الثانية": "Second Year",
      "الفرقة الثالثة": "Third Year",
      "الفرقة الرابعة": "Fourth Year",
      "خريج": "Graduate"
    };
    return enYears[y] || y;
  }
  return y;
}

const INIT_SUGS = [];

function sanitize(str) {
  if (typeof str !== "string") return str;
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

let loginAttempts = 0;
let lockoutTimer = null;
let lockoutSecondsRemaining = 0;

function maskNid(id) { return id && id.length >= 10 ? id.slice(0, 4) + "******" + id.slice(-4) : id; }
function getScoreBadge(s) {
  const num = Number(s) || 0;
  const displayScore = Number.isInteger(num) ? num : parseFloat(num.toFixed(2));
  if (num >= 8) return `<span class="ebadge high">${displayScore} / 10 (ممتاز)</span>`;
  if (num >= 5) return `<span class="ebadge med">${displayScore} / 10 (جيد)</span>`;
  return `<span class="ebadge low">${displayScore} / 10 (بحاجة لتطوير)</span>`;
}

function portalView() {
  const isAr = lang === "ar";
  const role = localStorage.getItem("cf_role");
  const userId = localStorage.getItem("cf_user_id");
  const users = getUsers();
  const curUser = users.find(u => u.id === userId) || getStore("cf_cur_user", null);

  if ((role === "ADMIN" || role === "SUPER_ADMIN") && curUser) return adminView(curUser, users);
  if (role === "STUDENT" && curUser) return studentView(curUser);

  const isReg = curAuthMode === "register";

  return `<section class="portal-sec"><div class="wrap">
    <div class="portal-card" style="${isReg ? 'max-width:640px' : 'max-width:520px'}">
      <div class="portal-head">
        <div class="pico">${isReg ? '📝' : '🔐'}</div>
        <h1>${isReg ? (isAr ? 'إنشاء حساب جديد بالأسرة' : 'Create Family Account') : S("portal_t")}</h1>
        <p>${isAr ? 'أسرة طلاب من أجل مصر — جامعة حلوان الأهلية' : 'Students For Egypt — Helwan National University'}</p>
      </div>

      <div class="portal-tabs">
        <button type="button" class="ptab-btn ${!isReg ? 'active' : ''}" id="btn-show-login">🔐 ${isAr ? 'تسجيل الدخول' : 'Sign In'}</button>
        <button type="button" class="ptab-btn ${isReg ? 'active' : ''}" id="btn-show-register">📝 ${isAr ? 'إنشاء حساب جديد' : 'Register Account'}</button>
      </div>

      ${isReg ? registerFormHtml() : loginFormHtml()}
    </div>
  </div></section>`;
}

function loginFormHtml() {
  const isAr = lang === "ar";
  return `
    <div class="portal-note">
      <b>${isAr ? 'تسجيل الدخول الموحد للطلاب والإدارة:' : 'Unified Login for Students & Admins:'}</b><br>
      ${isAr ? 'أدخل رقمك القومي (14 رقماً) وكلمة المرور للدخول لحسابك مباشرة؛ النظام يتعرف على رتبتك وصلاحياتك تلقائياً دون الحاجة لتحديدها.' : 'Enter your 14-digit National ID and password to access your account. The system automatically detects your role.'}
    </div>

    <form class="form" id="unified-login-form">
      <label>${isAr ? 'الرقم القومي (14 رقماً)' : 'National ID (14 digits)'}
        <input name="nid" placeholder="${isAr ? 'أدخل الرقم القومي (14 رقماً)...' : 'Enter your 14-digit National ID...'}" required autocomplete="username">
      </label>
      <label>${isAr ? 'كلمة المرور' : 'Password'}
        <div class="pw-wrap">
          <input name="pw" type="password" placeholder="${isAr ? 'أدخل كلمة المرور الخاصة بك...' : 'Enter your password...'}" required autocomplete="current-password">
          <button type="button" class="pw-toggle-btn" tabindex="-1" aria-label="Toggle password visibility">👁️</button>
        </div>
      </label>
      <button class="btn big" type="submit" style="width:100%;margin-top:10px">${isAr ? 'تسجيل الدخول' : 'Sign In'}</button>
      <p class="msg" id="login-msg" role="status" aria-live="polite"></p>
    </form>

    <div style="text-align:center;margin-top:20px;padding-top:16px;border-top:1px solid var(--bei);font-size:.95rem">
      ${isAr ? 'ليس لديك حساب بعد؟' : "Don't have an account yet?"} 
      <button type="button" class="btn ghost sm" id="btn-show-register-sub" style="margin-inline-start:8px;font-size:.85rem;padding:6px 14px">
        ${isAr ? 'إنشاء حساب جديد والانضمام' : 'Register New Account'}
      </button>
    </div>
  `;
}

function registerFormHtml() {
  const isAr = lang === "ar";
  return `
    <div class="portal-note" style="border-color:var(--g)">
      <b>${isAr ? 'انضم للأسرة وأنشئ حسابك الرسمي:' : 'Join the Family & Create Your Official Account:'}</b><br>
      ${isAr ? 'يرجى استيفاء بياناتك بدقة. التسجيل متاح لطلاب الكليات المعتمدة، وسيتم فتح بوابة عضويتك وتفعيل ملفك فوراً.' : 'Please enter your details accurately. Available for approved faculties. Your membership portal will be activated immediately.'}
    </div>

    <form class="form" id="unified-register-form">
      <label>${isAr ? 'الاسم بالكامل (ثلاثي أو رباعي)' : 'Full Name (3 or 4 names)'}
        <input name="fullName" placeholder="${isAr ? 'مثال: أحمد محمد علي' : 'e.g. Ahmed Mohamed Ali'}" required>
      </label>
      <label>${isAr ? 'الرقم القومي (14 رقماً بالضبط)' : 'National ID (Exactly 14 digits)'}
        <input name="nid" pattern="[0-9]{14}" placeholder="${isAr ? 'أدخل 14 رقماً باللغة الإنجليزية...' : 'Enter 14 digits...'}" required>
      </label>

      <div class="form-row">
        <label>${isAr ? 'كلمة المرور (6 أحرف أو أكثر)' : 'Password (6+ characters)'}
          <div class="pw-wrap">
            <input name="pw" type="password" minlength="6" placeholder="${isAr ? 'اختر كلمة مرور قوية...' : 'Choose a strong password...'}" required>
            <button type="button" class="pw-toggle-btn" tabindex="-1" aria-label="Toggle password visibility">👁️</button>
          </div>
        </label>
        <label>${isAr ? 'تأكيد كلمة المرور' : 'Confirm Password'}
          <div class="pw-wrap">
            <input name="pwConfirm" type="password" minlength="6" placeholder="${isAr ? 'أعد كتابة كلمة المرور...' : 'Re-enter your password...'}" required>
            <button type="button" class="pw-toggle-btn" tabindex="-1" aria-label="Toggle password visibility">👁️</button>
          </div>
        </label>
      </div>

      <div class="form-row">
        <label>${isAr ? 'رقم الهاتف / الواتساب' : 'Phone / WhatsApp'}
          <input name="phone" type="tel" placeholder="01XXXXXXXXX" required>
        </label>
        <label>${isAr ? 'البريد الإلكتروني (اختياري)' : 'Email (Optional)'}
          <input name="email" type="email" placeholder="student@example.com">
        </label>
      </div>

      <div class="form-row">
        <label>${isAr ? 'الكلية' : 'Faculty'}
          <select name="college" required>
            <option value="">${isAr ? 'اختر كليتك...' : 'Select your faculty...'}</option>
            ${COLLEGES.map(c => `<option value="${c}">${getCollegeName(c)}</option>`).join('')}
          </select>
        </label>
        <label>${isAr ? 'الفرقة الدراسية' : 'Academic Year'}
          <select name="year" required>
            <option value="">${isAr ? 'اختر الفرقة...' : 'Select your year...'}</option>
            ${YEARS.map(y => `<option value="${y}">${getYearName(y)}</option>`).join('')}
          </select>
        </label>
      </div>

      <label>${isAr ? 'اللجنة التي ترغب بالانضمام إليها' : 'Committee You Wish to Join'}
        <select name="com" required>
          <option value="">${isAr ? 'اختر لجنتك (إحدى اللجان الأربع)...' : 'Choose your committee (one of four)...'}</option>
          ${Object.entries(COMMITTEES_MAP).map(([k, v]) => `<option value="${k}">${getComName(k)}</option>`).join('')}
        </select>
      </label>

      <div class="photo-uploader">
        <div class="photo-preview" id="photo-preview-box">👤</div>
        <div>
          <label style="cursor:pointer;font-weight:700;color:var(--c1);display:block;margin-bottom:4px">
            ${isAr ? 'الصورة الشخصية (مطلوبة لملف العضوية)' : 'Profile Photo (Required)'}
          </label>
          <input type="file" id="photo-file-input" accept="image/*" style="font-size:.85rem;border:none;padding:0;min-height:unset">
          <small style="color:var(--c2);display:block;margin-top:4px">
            ${isAr ? 'ستظهر صورتك في بطاقة عضويتك وسجل الحضور.' : 'Your photo will be displayed on your membership card.'}
          </small>
        </div>
      </div>

      <button class="btn big" type="submit" style="width:100%;margin-top:14px">
        ${isAr ? 'إنشاء الحساب والانضمام للأسرة' : 'Register & Join Family'}
      </button>
      <p class="msg" id="reg-msg" role="status" aria-live="polite"></p>
    </form>

    <div style="text-align:center;margin-top:20px;padding-top:16px;border-top:1px solid var(--bei);font-size:.95rem">
      ${isAr ? 'لديك حساب بالفعل؟' : 'Already have an account?'} 
      <button type="button" class="btn ghost sm" id="btn-show-login-sub" style="margin-inline-start:8px;font-size:.85rem;padding:6px 14px">
        ${isAr ? 'تسجيل الدخول' : 'Sign In'}
      </button>
    </div>
  `;
}
