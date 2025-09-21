// src/routes/admin/+page.server.js
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { query } from '$lib/server/database';
import { serialize } from 'cookie';

export const load = async ({ cookies }) => {
  const adminSession = cookies.get('session');
  const candidateSession = cookies.get('candidate_session');

  if (adminSession) {
    throw redirect(303, '/homeadmin');
  }
  if (candidateSession) {
    throw redirect(303, '/candidate');
  }

  return {};
};

export const actions = {
  default: async ({ request, cookies }) => {
    console.log('Login action called');
    const form = await request.formData();
    const username = String(form.get('username') ?? '').trim();
    const password = String(form.get('password') ?? '');

    if (!username || !password) {
      return fail(400, { error: 'กรุณากรอก username และ password' });
    }

    // ลองเช็ค admin ก่อน
    const adminRows = await query(
      'SELECT id, username, password FROM admin WHERE username = ?',
      [username]
    );

    console.log('Admin DB rows:', adminRows);

    if (Array.isArray(adminRows) && adminRows.length > 0) {
      const user = adminRows[0];
      console.log('Password check for admin:', user.username);
      const match = await bcrypt.compare(password, user.password);
      console.log('Admin password match result:', match);
      
      if (match) {
        cookies.set('session', String(user.id), {
          path: '/',
          httpOnly: false,
          sameSite: 'lax',
          secure: false,
          maxAge: 60 * 60 * 24
        });

        console.log('Admin login successful, redirecting to /homeadmin');
        throw redirect(303, '/homeadmin');
      }
    }

    // ถ้าไม่ใช่ admin ลองเช็ค candidate (ใช้ email)
    const candidateRows = await query(
      'SELECT candidate_id, email, password, first_name, last_name FROM candidates WHERE email = ?',
      [username]
    );

    console.log('Candidate DB rows:', candidateRows);

    if (Array.isArray(candidateRows) && candidateRows.length > 0) {
      const candidate = candidateRows[0];
      console.log('Password check for candidate:', candidate.email);
      const match = await bcrypt.compare(password, candidate.password);
      console.log('Candidate password match result:', match);
      
      if (match) {
        cookies.set('candidate_session', String(candidate.candidate_id), {
          path: '/',
          httpOnly: false,
          sameSite: 'lax',
          secure: false,
          maxAge: 60 * 60 * 24
        });

        console.log('Candidate login successful, redirecting to /candidate');
        throw redirect(303, '/candidate');
      }
    }

    return fail(401, { error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
  }
};
