import Employee from '../models/Employee.js';
import { generateError } from '../utils/errorHandler.js';

// Get all employees (admin only)
export const getEmployees = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const employees = await Employee.find().select('-password');
    res.json(employees);
  } catch (error) {
    generateError(res, 500, 'Error fetching employees');
  }
};

// Get single employee
export const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).select('-password');
    if (!employee) {
      return generateError(res, 404, 'Employee not found');
    }

    // Only admin or the employee themselves can view the details
    if (req.user.role !== 'admin' && req.user._id.toString() !== employee._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(employee);
  } catch (error) {
    generateError(res, 500, 'Error fetching employee');
  }
};

// Create new employee (admin only)
export const createEmployee = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { email } = req.body;
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return generateError(res, 400, 'Email already registered');
    }

    const employee = new Employee(req.body);
    await employee.save();
    
    // Don't send password in response
    const employeeResponse = employee.toObject();
    delete employeeResponse.password;
    
    res.status(201).json(employeeResponse);
  } catch (error) {
    generateError(res, 500, 'Error creating employee');
  }
};

// Update employee
export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return generateError(res, 404, 'Employee not found');
    }

    // Only admin or the employee themselves can update
    if (req.user.role !== 'admin' && req.user._id.toString() !== employee._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only admin can update role and permissions
    if (req.user.role !== 'admin' && (req.body.role || req.body.permissions)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    Object.assign(employee, req.body);
    await employee.save();
    
    // Don't send password in response
    const employeeResponse = employee.toObject();
    delete employeeResponse.password;
    
    res.json(employeeResponse);
  } catch (error) {
    generateError(res, 500, 'Error updating employee');
  }
};

// Delete employee (admin only)
export const deleteEmployee = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return generateError(res, 404, 'Employee not found');
    }

    await employee.remove();
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    generateError(res, 500, 'Error deleting employee');
  }
};

// Update employee permissions (admin only)
export const updatePermissions = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return generateError(res, 404, 'Employee not found');
    }

    employee.permissions = req.body.permissions;
    await employee.save();
    
    // Don't send password in response
    const employeeResponse = employee.toObject();
    delete employeeResponse.password;
    
    res.json(employeeResponse);
  } catch (error) {
    generateError(res, 500, 'Error updating permissions');
  }
}; 