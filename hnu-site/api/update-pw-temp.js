import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  // Security: only allow POST with secret token
  if (req.method !== 'POST') return res.status(405).end();
  const { secret, newPassword, targetRole } = req.body || {};
  
  if (secret !== 'hnu-temp-update-2026') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const hashed = await bcrypt.hash(newPassword, 10);
    const role = targetRole || 'SUPER_ADMIN';
    
    const result = await sql`
      UPDATE users SET password = ${hashed} 
      WHERE role = ${role}
      RETURNING id, name, role
    `;
    
    return res.status(200).json({ 
      success: true, 
      updated: result.rows.map(r => ({ name: r.name, role: r.role }))
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
