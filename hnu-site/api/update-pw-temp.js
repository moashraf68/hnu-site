import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { secret, hashedPassword, targetRole } = req.body || {};
  
  if (secret !== 'hnu-temp-update-2026') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const sql = neon(process.env.POSTGRES_URL);
    const role = targetRole || 'SUPER_ADMIN';
    
    const result = await sql`
      UPDATE users SET password = ${hashedPassword} 
      WHERE role = ${role}
      RETURNING name, role
    `;
    
    return res.status(200).json({ 
      success: true, 
      updated: result.map(r => ({ name: r.name, role: r.role }))
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
