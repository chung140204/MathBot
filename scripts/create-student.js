const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createStudent() {
  const sql = neon(process.env.DIRECT_URL || process.env.DATABASE_URL);

  const email = 'student@mathbot.vn';
  const name = 'Nguyễn Văn A';
  const role = 'STUDENT';
  const password = 'student123';
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    console.log(`Checking if user ${email} exists...`);
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    
    if (existing.length > 0) {
      console.log('Student user already exists.');
      return;
    }

    console.log('Creating student user...');
    await sql`
      INSERT INTO users (id, email, name, password, role, "createdAt", "updatedAt") 
      VALUES (${'student-id-1'}, ${email}, ${name}, ${hashedPassword}, ${role}, NOW(), NOW())
    `;
    console.log('✅ Student user created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  } catch (err) {
    console.error('Error creating student:', err.message);
  }
}

createStudent();
