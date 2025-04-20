import express from 'express';
import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  updatePermissions
} from '../controllers/employeeController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get all employees (admin only)
router.get('/', getEmployees);

// Get single employee
router.get('/:id', getEmployee);

// Create new employee (admin only)
router.post('/', createEmployee);

// Update employee
router.put('/:id', updateEmployee);

// Delete employee (admin only)
router.delete('/:id', deleteEmployee);

// Update employee permissions (admin only)
router.put('/:id/permissions', updatePermissions);

export default router; 