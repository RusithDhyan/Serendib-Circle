const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

async function testPassword() {
  try {
    require('dotenv').config();
    await mongoose.connect(process.env.MONGODB_URI);
    
    const User = require('./src/models/User');
    const admin = await User.findOne({ email: 'admin@serendib.com' });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }
    
    console.log('\n🔍 Testing Admin Login...\n');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Hash:', admin.password.substring(0, 30) + '...');
    console.log('Hash type:', admin.password.substring(0, 4));
    
    const directTest = await bcrypt.compare('lahiru@1234', admin.password);
    console.log('\nDirect bcrypt.compare():', directTest ? '✅ WORKS' : '❌ FAILED');
    
    const methodTest = await admin.comparePassword('lahiru@1234');
    console.log('Model comparePassword():', methodTest ? '✅ WORKS' : '❌ FAILED');
    
    if (directTest && methodTest) {
      console.log('\n🎉 Password is correctly configured! You can login now.\n');
    } else {
      console.log('\n❌ Password test failed. Need to recreate admin user.\n');
    }
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testPassword();
