// ระบบฐานข้อมูล SQLite
import { query as sqliteQuery, testConnection as sqliteTest, initDatabase as sqliteInit } from './db-sqlite.js';

// Export ฟังก์ชันสำหรับใช้งาน
export const query = sqliteQuery;
export const testConnection = sqliteTest;
export const initDatabase = sqliteInit;
