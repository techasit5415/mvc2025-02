import { redirect, fail } from '@sveltejs/kit';
import { query } from '$lib/server/database';

export const load = async ({ cookies }) => {
  const candidateSession = cookies.get('candidate_session');

  if (!candidateSession) {
    throw redirect(303, '/login');
  }

  try {
    // ดึงข้อมูลตำแหน่งงานที่เปิดรับสมัคร
    const jobs = await query(`
      SELECT 
        j.job_id,
        j.job_title,
        j.job_description,
        j.deadline,
        c.company_name,
        c.location,
        COUNT(a.application_id) as applicant_count
      FROM jobs j
      JOIN companies c ON j.company_id = c.company_id
      LEFT JOIN applications a ON j.job_id = a.job_id
      WHERE j.status = 'open' AND date(j.deadline) >= date('now')
      GROUP BY j.job_id
      ORDER BY j.deadline ASC, c.company_name ASC, j.job_title ASC
    `);

    // ดึงข้อมูลผู้สมัครปัจจุบัน
    const candidate = await query(
      'SELECT candidate_id, first_name, last_name, email FROM candidates WHERE candidate_id = ?',
      [candidateSession]
    );

    // ดึงงานที่สมัครแล้ว
    const appliedJobs = await query(
      'SELECT job_id FROM applications WHERE candidate_id = ?',
      [candidateSession]
    );

    const appliedJobIds = appliedJobs.map(app => app.job_id);

    return {
      jobs: jobs || [],
      candidate: candidate[0] || null,
      appliedJobIds
    };
  } catch (error) {
    console.error('Error loading candidate dashboard:', error);
    return {
      jobs: [],
      candidate: null,
      appliedJobIds: []
    };
  }
};
export const actions = {
  cancel: async ({ request, cookies }) => {
    const candidateSession = cookies.get('candidate_session');
    
    if (!candidateSession) {
      return fail(401, { message: 'กรุณาเข้าสู่ระบบ' });
    }

    const formData = await request.formData();
    const jobId = formData.get('job_id');

    try {
      // ลบการสมัครออกจากฐานข้อมูล
      await query(
        'DELETE FROM applications WHERE job_id = ? AND candidate_id = ?',
        [jobId, candidateSession]
      );

      return { success: true, message: 'ยกเลิกการสมัครสำเร็จ' };
    } catch (error) {
      return fail(500, { message: 'เกิดข้อผิดพลาด' });
    }
  }
};