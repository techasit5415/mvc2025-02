import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// เส้นทางไฟล์ฐานข้อมูล SQLite
const dbDir = path.join(__dirname, '../../../database');
const dbPath = path.join(dbDir, 'mvc.db');

// สร้างโฟลเดอร์ database ถ้ายังไม่มี
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// ฟังก์ชันเปิดการเชื่อมต่อฐานข้อมูล
export async function openDb() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}

// ฟังก์ชัน query สำหรับ SQLite
export async function query(sql, params = []) {
  try {
    const db = await openDb();
    const result = await db.all(sql, params);
    await db.close();
    return result;
  } catch (error) {
    console.error('SQLite query error:', error);
    throw error;
  }
}

// ฟังก์ชันสำหรับสร้างตารางเริ่มต้น
export async function initDatabase() {
  try {
    const db = await openDb();
    
    // สร้างตาราง companies
    await db.exec(`
      CREATE TABLE IF NOT EXISTS companies (
        company_id TEXT PRIMARY KEY CHECK(company_id GLOB '[1-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
        company_name TEXT NOT NULL,
        email TEXT NOT NULL,
        location TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // สร้างตาราง jobs
    await db.exec(`
      CREATE TABLE IF NOT EXISTS jobs (
        job_id TEXT PRIMARY KEY CHECK(job_id GLOB '[1-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
        job_title TEXT NOT NULL,
        job_description TEXT NOT NULL,
        company_id TEXT NOT NULL,
        deadline DATE NOT NULL,
        status TEXT CHECK(status IN ('open', 'closed')) DEFAULT 'open',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(company_id)
      )
    `);

    // สร้างตาราง candidates
    await db.exec(`
      CREATE TABLE IF NOT EXISTS candidates (
        candidate_id TEXT PRIMARY KEY CHECK(candidate_id GLOB '[1-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]'),
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // สร้างตาราง applications
    await db.exec(`
      CREATE TABLE IF NOT EXISTS applications (
        application_id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_id TEXT NOT NULL,
        candidate_id TEXT NOT NULL,
        application_date DATE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs(job_id),
        FOREIGN KEY (candidate_id) REFERENCES candidates(candidate_id),
        UNIQUE(job_id, candidate_id)
      )
    `);

    // แทรกข้อมูล admin เริ่มต้น
    await db.run(`
      INSERT OR IGNORE INTO admin (username, password, email, first_name, last_name, role) 
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      'admin',
      '$2b$10$tbE7yJTaJ.qeSwTpaPv5P.fLFTc0S2C16rNzMPsmPi38aXu350wrC',
      'admin@example.com',
      'Admin',
      'User',
      'super_admin'
    ]);

    await db.close();
    console.log('✅ Job Fair database initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ SQLite initialization failed:', error);
    return false;
  }
}

// ฟังก์ชันทดสอบการเชื่อมต่อ
export async function testConnection() {
  try {
    const db = await openDb();
    await db.get('SELECT 1');
    await db.close();
    console.log('✅ SQLite connection successful');
    return true;
  } catch (error) {
    console.error('❌ SQLite connection failed:', error);
    return false;
  }
}
