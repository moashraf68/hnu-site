/**
 * Shared API Helpers for HNU Family Platform
 */

const DEFAULT_SUPER_NID = '30601121400292';

function getSuperAdminNid() {
  return (process.env.SUPER_ADMIN_NID || DEFAULT_SUPER_NID).trim();
}

function setCommonHeaders(res, methods = 'GET,OPTIONS,POST,PATCH,DELETE') {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
}

function normalizeArabicDigits(str) {
  if (!str) return '';
  return String(str)
    .trim()
    .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
    .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
}

async function verifyRequester(sql, requesterId, requesterNid) {
  const superNid = getSuperAdminNid();
  const rawId = String(requesterId || '').trim();
  const rawNid = normalizeArabicDigits(requesterNid);

  if (rawNid === superNid || rawId === superNid) {
    return { isSuperAdmin: true, isAdmin: true, user: null };
  }

  if (!rawId && !rawNid) {
    return { isSuperAdmin: false, isAdmin: false, user: null };
  }

  try {
    const res = await sql`
      SELECT id, role, national_id, full_name
      FROM users
      WHERE (id::text = ${rawId} OR national_id = ${rawNid})
      LIMIT 1
    `;
    if (res.rows.length > 0) {
      const u = res.rows[0];
      const isSuper = (u.role === 'SUPER_ADMIN' || u.national_id === superNid);
      const isAdmin = (isSuper || u.role === 'ADMIN');
      return { isSuperAdmin: isSuper, isAdmin, user: u };
    }
  } catch (err) {
    console.error('Error verifying requester:', err);
  }

  return { isSuperAdmin: false, isAdmin: false, user: null };
}

function sendJson(res, statusCode, data) {
  return res.status(statusCode).json(data);
}

module.exports = {
  getSuperAdminNid,
  setCommonHeaders,
  normalizeArabicDigits,
  verifyRequester,
  sendJson
};
