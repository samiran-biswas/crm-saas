const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { auth, authorizeRole, checkPermission } = require('../middleware/auth');

// Middleware to check if user has admin or superadmin role
const isAdmin = authorizeRole('admin', 'superadmin');

// Middleware to check if user has superadmin role
const isSuperAdmin = authorizeRole('superadmin');

// Create a new role (Superadmin only)
router.post('/', auth, isSuperAdmin, roleController.createRole);

// Get all roles (Admin and Superadmin)
router.get('/', auth, isAdmin, roleController.getAllRoles);

// Get role by ID (Admin and Superadmin)
router.get('/:id', auth, isAdmin, roleController.getRoleById);

// Update role (Superadmin only)
router.put('/:id', auth, isSuperAdmin, roleController.updateRole);

// Delete role (Superadmin only)
router.delete('/:id', auth, isSuperAdmin, roleController.deleteRole);

// Assign role to user (Admin and Superadmin)
router.post('/:id/assign', auth, isAdmin, roleController.assignRoleToUser);

// Get users by role (Admin and Superadmin)
router.get('/:id/users', auth, isAdmin, roleController.getUsersByRole);

// Update role permissions (Superadmin only)
router.put('/:id/permissions', auth, isSuperAdmin, roleController.updateRolePermissions);

// Check user permissions (All authenticated users)
router.post('/check-permissions', auth, roleController.checkUserPermissions);

module.exports = router; 