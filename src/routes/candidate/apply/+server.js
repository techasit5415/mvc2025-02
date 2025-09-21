import { json, fail } from '@sveltejs/kit';
import { query } from '$lib/server/database';

export const POST = async ({ request, cookies }) => {
  const candidateSession = cookies.get('candidate_session');
  
  if (!candidateSession) {
    return json({ message: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const jobId = formData.get('job_id');

    if (!jobId) {
      return json({ message: 'ไม่พบรหัสตำแหน่งงาน' }, { status: 400 });
    }

    // ตรวจสอบว่าตำแหน่งงานยังเปิดรับสมัครอยู่หรือไม่
    const job = await query(
      'SELECT job_id, deadline, status FROM jobs WHERE job_id = ?',
      [jobId]
    );

    if (!job || job.length === 0) {
      return json({ message: 'ไม่พบตำแหน่งงานนี้' }, { status: 404 });
    }

    const jobData = job[0];
    
    if (jobData.status !== 'open') {
      return json({ message: 'ตำแหน่งงานนี้ปิดรับสมัครแล้ว' }, { status: 400 });
    }

    // ตรวจสอบวันที่ปิดรับสมัคร
    const today = new Date().toISOString().split('T')[0];
    if (jobData.deadline < today) {
      return json({ message: 'ตำแหน่งงานนี้หมดเขตรับสมัครแล้ว' }, { status: 400 });
    }

    // ตรวจสอบว่าสมัครแล้วหรือยัง
    const existingApplication = await query(
      'SELECT application_id FROM applications WHERE job_id = ? AND candidate_id = ?',
      [jobId, candidateSession]
    );

    if (existingApplication && existingApplication.length > 0) {
      return json({ message: 'คุณได้สมัครตำแหน่งงานนี้แล้ว' }, { status: 400 });
    }

    // บันทึกใบสมัครงาน - ใช้เวลาปัจจุบันจากเครื่อง
    const currentDate = new Date().toISOString();
    
    await query(
      'INSERT INTO applications (job_id, candidate_id, application_date) VALUES (?, ?, ?)',
      [jobId, candidateSession, currentDate]
    );

    return json({ message: 'สมัครงานสำเร็จ' });

  } catch (error) {
    console.error('Error applying for job:', error);
    return json({ message: 'เกิดข้อผิดพลาดในระบบ' }, { status: 500 });
  }
};
