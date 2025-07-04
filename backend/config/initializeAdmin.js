const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

const initializeAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    
    if (!existingAdmin) {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('123456', salt);
      
      // Create admin user
      const adminUser = new Admin({
        username: 'admin',
        mobile: '',
        password: hashedPassword,
      });

      await adminUser.save();
      console.log('✅ Default admin user created');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error initializing admin user:', error.message);
  }
};

module.exports = initializeAdmin;