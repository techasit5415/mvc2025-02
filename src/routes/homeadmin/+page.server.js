import { redirect } from '@sveltejs/kit';
import { query } from '$lib/server/database';

export const load = async ({ cookies }) => {
  const session = cookies.get('session');

  if (!session) {
    throw redirect(303, '/login');
  }

  try {
    // ดึงรายชื่อผู้สมัครทั้งหมด เรียงตามชื่อ
    const candidates = await query(`
      SELECT 
        c.candidate_id,
        c.first_name,
        c.last_name,
        c.email,
        c.created_at,
        COUNT(a.application_id) as application_count
      FROM candidates c
      LEFT JOIN applications a ON c.candidate_id = a.candidate_id
      GROUP BY c.candidate_id
      ORDER BY c.first_name ASC, c.last_name ASC
    `);

    // ดึงสถิติทั่วไป
    const stats = await query(`
      SELECT 
        (SELECT COUNT(*) FROM candidates) as total_candidates,
        (SELECT COUNT(*) FROM jobs WHERE status = 'open') as open_jobs,
        (SELECT COUNT(*) FROM applications) as total_applications,
        (SELECT COUNT(*) FROM companies) as total_companies
    `);

    return {
      candidates: candidates || [],
      stats: stats[0] || { total_candidates: 0, open_jobs: 0, total_applications: 0, total_companies: 0 }
    };
  } catch (error) {
    console.error('Error loading admin dashboard:', error);
    return {
      candidates: [],
      stats: { total_candidates: 0, open_jobs: 0, total_applications: 0, total_companies: 0 }
    };
  }
};
