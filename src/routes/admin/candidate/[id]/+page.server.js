import { redirect, error } from '@sveltejs/kit';
import { query } from '$lib/server/database';

export const load = async ({ cookies, params }) => {
  const session = cookies.get('session');

  if (!session) {
    throw redirect(303, '/login');
  }

  const candidateId = params.id;

  try {
    // ดึงข้อมูลผู้สมัคร
    const candidate = await query(
      'SELECT candidate_id, first_name, last_name, email, created_at FROM candidates WHERE candidate_id = ?',
      [candidateId]
    );

    if (!candidate || candidate.length === 0) {
      throw error(404, 'ไม่พบข้อมูลผู้สมัคร');
    }

    // ดึงรายการงานที่สมัคร
    const applications = await query(`
      SELECT 
        a.application_id,
        a.application_date,
        j.job_id,
        j.job_title,
        j.job_description,
        j.deadline,
        j.status as job_status,
        c.company_name,
        c.location
      FROM applications a
      JOIN jobs j ON a.job_id = j.job_id
      JOIN companies c ON j.company_id = c.company_id
      WHERE a.candidate_id = ?
      ORDER BY j.job_title ASC, c.company_name ASC, a.application_date DESC
    `, [candidateId]);

    return {
      candidate: candidate[0],
      applications: applications || []
    };
  } catch (err) {
    console.error('Error loading candidate details:', err);
    throw error(500, 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
  }
};
