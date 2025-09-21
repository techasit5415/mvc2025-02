import { query, testConnection, initDatabase } from '../src/lib/server/database.js';

async function setupDatabase() {
  console.log('🚀 Setting up SQLite database...');

  // ทดสอบการเชื่อมต่อ
  console.log('\n🔌 Testing connection...');
  const connected = await testConnection();
  
  if (!connected) {
    console.log('❌ Cannot connect to database');
    return;
  }

  // เริ่มต้นฐานข้อมูล
  console.log('\n📋 Initializing database...');
  await initDatabase();

  try {
    // ทดสอบ query ข้อมูล admin
    console.log('\n👤 Checking admin data...');
    const admins = await query('SELECT id, username, email, role FROM admin');
    
    if (Array.isArray(admins) && admins.length > 0) {
      console.log('✅ Admin users found:', admins.length);
      console.log('📄 Admin data:', admins);
    } else {
      console.log('⚠️  No admin users found');
    }

    // ทดสอบการ login
    console.log('\n🔐 Testing login functionality...');
    const loginTest = await query(
      'SELECT id, username, password FROM admin WHERE username = ?',
      ['admin']
    );
    
    if (Array.isArray(loginTest) && loginTest.length > 0) {
      console.log('✅ Login query successful');
      console.log('Found admin user:', loginTest[0].username);
    } else {
      console.log('❌ Admin user not found');
    }

    console.log('\n🎉 Database setup completed!');
    console.log('\n📝 Default admin credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('\n🌐 You can now start the development server:');
    console.log('   npm run dev');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
  }
}

setupDatabase();
