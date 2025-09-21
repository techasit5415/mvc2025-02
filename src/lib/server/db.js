import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables ถ้าไม่ได้รันผ่าน SvelteKit
if (typeof process !== 'undefined' && process.env) {
  dotenv.config();
}

// ใช้ environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mvc_db',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  charset: 'utf8mb4'
};

// สร้าง connection pool
const pool = mysql.createPool(dbConfig);

// ฟังก์ชัน query สำหรับใช้ในการเรียกใช้ฐานข้อมูล
export async function query(sql, params = []) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// ฟังก์ชันสำหรับปิด connection pool (optional - ใช้เมื่อจบการทำงาน)
export async function closePool() {
  await pool.end();
}

// Test connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}
