#!/usr/bin/env node

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import readline from 'readline';
import dotenv from 'dotenv';
import User from '../src/models/User.js';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin() {
  try {
    console.log('\n🔧 Serendib Circle - Admin User Setup\n');

    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in .env');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const name = await question('Enter admin name: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password (min 6 characters): ');
    const role = await question('Enter User Role: ');

    if (!name || !email || !password || !role) {
      console.error('\n❌ All fields are required');
      process.exit(1);
    }

    if (password.length < 6) {
      console.error('\n❌ Password must be at least 6 characters');
      process.exit(1);
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.role = 'admin';
      await existingUser.save();
      console.log(`\n✅ Updated ${email} to admin role`);
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        tier: 'The Circle',
        points: 0,
      });
      console.log(`\n✅ Created admin user: ${email}`);
    }

    await mongoose.connection.close();
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
    process.exit(1);
  }
}

createAdmin();
