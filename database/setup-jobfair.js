import { query, initDatabase } from '../src/lib/server/database.js';
import bcrypt from 'bcrypt';

async function setupJobFairDatabase() {
  console.log('🚀 Setting up Job Fair database...');
  
  await initDatabase();

  try {
    // สร้างข้อมูลบริษัท
    const companies = [
      { id: '10001001', name: 'บริษัท เทคโนโลยี จำกัด', email: 'hr@technology.com', location: 'กรุงเทพมหานคร' },
      { id: '20002002', name: 'บริษัท ซอฟต์แวร์ จำกัด', email: 'contact@software.com', location: 'เชียงใหม่' },
      { id: '30003003', name: 'บริษัท ดิจิทัล จำกัด', email: 'info@digital.com', location: 'ชลบุรี' }
    ];

    for (const company of companies) {
      await query(
        'INSERT OR IGNORE INTO companies (company_id, company_name, email, location) VALUES (?, ?, ?, ?)',
        [company.id, company.name, company.email, company.location]
      );
    }

    // สร้างข้อมูลตำแหน่งงาน
    const jobs = [
      { id: '10101010', title: 'Web Developer', description: 'พัฒนาเว็บไซต์และระบบออนไลน์', company: '10001001', deadline: '2025-12-31' },
      { id: '10101011', title: 'Mobile App Developer', description: 'พัฒนาแอปพลิเคชันมือถือ iOS และ Android', company: '10001001', deadline: '2025-11-30' },
      { id: '10101012', title: 'Data Analyst', description: 'วิเคราะห์ข้อมูลและสร้างรายงาน', company: '10001001', deadline: '2025-10-31' },
      { id: '10101013', title: 'UX/UI Designer', description: 'ออกแบบประสบการณ์ผู้ใช้และหน้าตาระบบ', company: '10001001', deadline: '2025-12-15' },
      { id: '20202020', title: 'Frontend Developer', description: 'พัฒนาส่วนหน้าของเว็บไซต์', company: '20002002', deadline: '2025-11-15' },
      { id: '20202021', title: 'Backend Developer', description: 'พัฒนาระบบฐานข้อมูลและ API', company: '20002002', deadline: '2025-12-01' },
      { id: '20202022', title: 'DevOps Engineer', description: 'จัดการระบบและการ deploy', company: '20002002', deadline: '2025-10-15' },
      { id: '20202023', title: 'QA Tester', description: 'ทดสอบคุณภาพซอฟต์แวร์', company: '20002002', deadline: '2025-11-01' },
      { id: '30303030', title: 'Digital Marketing', description: 'วางแผนและจัดการการตลาดออนไลน์', company: '30003003', deadline: '2025-12-20' },
      { id: '30303031', title: 'Social Media Manager', description: 'จัดการสื่อสังคมออนไลน์', company: '30003003', deadline: '2025-11-10' },
      { id: '30303032', title: 'Content Creator', description: 'สร้างเนื้อหาสำหรับสื่อดิจิทัล', company: '30003003', deadline: '2025-10-25' },
      { id: '30303033', title: 'SEO Specialist', description: 'ปรับปรุงการค้นหาบนเว็บไซต์', company: '30003003', deadline: '2025-12-05' }
    ];

    for (const job of jobs) {
      await query(
        'INSERT OR IGNORE INTO jobs (job_id, job_title, job_description, company_id, deadline, status) VALUES (?, ?, ?, ?, ?, ?)',
        [job.id, job.title, job.description, job.company, job.deadline, 'open']
      );
    }

    // สร้างข้อมูลผู้สมัคร
    const hashedPassword = await bcrypt.hash('candidate123', 10);
    const candidates = [
      { id: '11111111', first: 'สมชาย', last: 'ใจดี', email: 'somchai@email.com' },
      { id: '11111112', first: 'สมหญิง', last: 'สุขใส', email: 'somying@email.com' },
      { id: '11111113', first: 'วิชัย', last: 'เก่งกล้า', email: 'wichai@email.com' },
      { id: '11111114', first: 'นิรันดร์', last: 'มั่นคง', email: 'niran@email.com' },
      { id: '11111115', first: 'ประกาย', last: 'สดใส', email: 'prakkai@email.com' },
      { id: '11111116', first: 'วันเพ็ญ', last: 'เต็มดวง', email: 'wanpen@email.com' },
      { id: '11111117', first: 'กฤษณะ', last: 'เฉียบแหลม', email: 'kritsana@email.com' },
      { id: '11111118', first: 'อนุชา', last: 'ร่วมมิตร', email: 'anucha@email.com' },
      { id: '11111119', first: 'สุวิดา', last: 'เจริญใจ', email: 'suwida@email.com' },
      { id: '11111120', first: 'ธนากร', last: 'พูลสวัสดิ์', email: 'thanakorn@email.com' },
      { id: '11111121', first: 'ปิยะนุช', last: 'ยิ้มแย้ม', email: 'piyanuch@email.com' },
      { id: '11111122', first: 'ชยพล', last: 'มุ่งมั่น', email: 'chaiyapon@email.com' }
    ];

    for (const candidate of candidates) {
      await query(
        'INSERT OR IGNORE INTO candidates (candidate_id, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)',
        [candidate.id, candidate.first, candidate.last, candidate.email, hashedPassword]
      );
    }

    // สร้างข้อมูลใบสมัครงาน
    const applications = [
      { job: '10101010', candidate: '11111111', date: '2025-09-15' },
      { job: '10101011', candidate: '11111111', date: '2025-09-16' },
      { job: '20202020', candidate: '11111112', date: '2025-09-17' },
      { job: '20202021', candidate: '11111113', date: '2025-09-18' },
      { job: '30303030', candidate: '11111114', date: '2025-09-19' },
      { job: '10101012', candidate: '11111115', date: '2025-09-20' },
      { job: '20202022', candidate: '11111116', date: '2025-09-21' },
      { job: '30303031', candidate: '11111117', date: '2025-09-21' },
      { job: '10101013', candidate: '11111118', date: '2025-09-21' },
      { job: '20202023', candidate: '11111119', date: '2025-09-21' }
    ];

    for (const app of applications) {
      await query(
        'INSERT OR IGNORE INTO applications (job_id, candidate_id, application_date) VALUES (?, ?, ?)',
        [app.job, app.candidate, app.date]
      );
    }

    console.log('✅ Job Fair data inserted successfully');
    console.log('\n📊 Database Summary:');
    console.log(`   Companies: ${companies.length}`);
    console.log(`   Jobs: ${jobs.length}`);
    console.log(`   Candidates: ${candidates.length}`);
    console.log(`   Applications: ${applications.length}`);
    
    console.log('\n👤 Login Credentials:');
    console.log('   Admin: admin / admin123');
    console.log('   Candidate: somchai@email.com / candidate123');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

setupJobFairDatabase();
