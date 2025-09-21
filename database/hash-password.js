import bcrypt from 'bcrypt';

// ฟังก์ชันสำหรับสร้าง hash รหัสผ่าน
async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

// สร้าง hash สำหรับรหัสผ่าน admin123
async function createAdminPassword() {
  const password = 'admin123';
  const hashed = await hashPassword(password);
  console.log('Password:', password);
  console.log('Hashed:', hashed);
  console.log('\nSQL Command:');
  console.log(`INSERT INTO admin (username, password, email, first_name, last_name, role) VALUES 
('admin', '${hashed}', 'admin@example.com', 'Admin', 'User', 'super_admin')
ON DUPLICATE KEY UPDATE password = '${hashed}';`);
}

createAdminPassword();
