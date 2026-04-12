const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdmin() {
  const sql = neon(process.env.DIRECT_URL || process.env.DATABASE_URL);

  const email = 'admin@mathbot.vn';
  const name = 'System Admin';
  const role = 'ADMIN';
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    console.log(`Checking if user ${email} exists...`);
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    
    if (existing.length > 0) {
      console.log('Admin user already exists.');
      return;
    }

    console.log('Creating admin user...');
    await sql`
      INSERT INTO users (id, email, name, password, role, "createdAt", "updatedAt") 
      VALUES (${'admin-id-1'}, ${email}, ${name}, ${hashedPassword}, ${role}, NOW(), NOW())
    `;
    console.log('✅ Admin user created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  } catch (err) {
    console.error('Error creating admin:', err.message);
  }
}

createAdmin();
