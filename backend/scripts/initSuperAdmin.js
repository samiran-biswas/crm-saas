const mongoose = require('mongoose');
const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const initSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if superadmin role exists
    let superadminRole = await Role.findOne({ name: 'superadmin' });
    if (!superadminRole) {
      // Create superadmin role if it doesn't exist
      superadminRole = await Role.create({
        name: 'superadmin',
        description: 'Super Administrator with full system access',
        permissions: {
          dashboard: true,
          leads: { view: true, create: true, edit: true, delete: true },
          customers: { view: true, create: true, edit: true, delete: true },
          tickets: { view: true, create: true, edit: true, delete: true },
          tasks: { view: true, create: true, edit: true, delete: true },
          meetings: { view: true, create: true, edit: true, delete: true },
          analytics: { view: true, export: true },
          settings: { view: true, edit: true },
          users: { view: true, create: true, edit: true, delete: true }
        },
        subscriptionLevel: 'enterprise',
        isActive: true
      });
    }

    // Check if superadmin user exists
    const existingSuperAdmin = await User.findOne({ email: 'samiran@gmail.com' });
    if (!existingSuperAdmin) {
      // Create superadmin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        firstName: 'Samiran',
        lastName: 'Admin',
        email: 'samiran@gmail.com',
        password: hashedPassword,
        role: superadminRole._id,
        isEmailVerified: true,
        securitySettings: {
          sessionTimeout: 60,
          failedLoginAttempts: 0
        }
      });
      console.log('Superadmin user created successfully');
    } else {
      console.log('Superadmin user already exists');
    }

    console.log('Superadmin initialization completed');
  } catch (error) {
    console.error('Error initializing superadmin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

initSuperAdmin(); 