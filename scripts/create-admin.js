#!/usr/bin/env node

/**
 * Setup Script - Create First Admin User
 * Run this after setting up your .env file
 * 
 * Usage: node scripts/create-admin.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin() {
  try {
    console.log('\n🔧 Serendib Circle - Admin User Setup\n');
    console.log('This will create your first admin user.\n');

    // Get MongoDB URI from environment
    require('dotenv').config();
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      console.error('❌ Error: MONGODB_URI not found in .env file');
      process.exit(1);
    }

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get admin details
    const name = await question('Enter admin name: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password (min 6 characters): ');
    const role = await question('Enter User Role:');

    if (!name || !email || !password || !role) {
      console.error('\n❌ All fields are required');
      process.exit(1);
    }

    if (password.length < 6) {
      console.error('\n❌ Password must be at least 6 characters');
      process.exit(1);
    }

    // Check if user exists
    const User = require('../src/models/User');
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // Update existing user to admin
      existingUser.role = 'admin';
      await existingUser.save();
      console.log(`\n✅ Updated ${email} to admin role`);
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        tier: 'The Circle', // Give admin top tier
        points: 0
      });
      console.log(`\n✅ Created admin user: ${email}`);
    }

    console.log('\n🎉 Admin user setup complete!');
    console.log('\nYou can now:');
    console.log('1. Run: npm run dev');
    console.log('2. Sign in with your admin credentials');
    console.log('3. Access admin panel at: http://localhost:3000/admin');
    console.log('\n');

    await mongoose.connection.close();
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
    process.exit(1);
  }
}

createAdmin();
