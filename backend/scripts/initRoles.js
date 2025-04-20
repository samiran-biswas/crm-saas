const mongoose = require('mongoose');
const Role = require('../models/Role');
require('dotenv').config();

const defaultRoles = [
  {
    name: 'admin',
    description: 'Administrator with full access',
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
    isActive: true,
    isDefault: true
  },
  {
    name: 'manager',
    description: 'Manager with elevated access',
    permissions: {
      dashboard: true,
      leads: { view: true, create: true, edit: true, delete: false },
      customers: { view: true, create: true, edit: true, delete: false },
      tickets: { view: true, create: true, edit: true, delete: false },
      tasks: { view: true, create: true, edit: true, delete: false },
      meetings: { view: true, create: true, edit: true, delete: false },
      analytics: { view: true, export: true },
      settings: { view: true, edit: false },
      users: { view: true, create: false, edit: false, delete: false }
    },
    subscriptionLevel: 'pro',
    isActive: true
  },
  {
    name: 'employee',
    description: 'Standard employee access',
    permissions: {
      dashboard: true,
      leads: { view: true, create: true, edit: false, delete: false },
      customers: { view: true, create: true, edit: false, delete: false },
      tickets: { view: true, create: true, edit: false, delete: false },
      tasks: { view: true, create: true, edit: false, delete: false },
      meetings: { view: true, create: true, edit: false, delete: false },
      analytics: { view: true, export: false },
      settings: { view: false, edit: false },
      users: { view: false, create: false, edit: false, delete: false }
    },
    subscriptionLevel: 'basic',
    isActive: true
  }
];

const initRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing roles
    await Role.deleteMany({});
    console.log('Cleared existing roles');

    // Insert default roles
    await Role.insertMany(defaultRoles);
    console.log('Inserted default roles');

    console.log('Role initialization completed successfully');
  } catch (error) {
    console.error('Error initializing roles:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

initRoles(); 