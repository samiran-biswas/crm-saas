const Role = require('../models/Role');
const User = require('../models/User');

// Create a new role
exports.createRole = async (req, res) => {
  try {
    const { name, description, permissions, subscriptionLevel } = req.body;

    // Check if role already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ message: 'Role already exists' });
    }

    const role = new Role({
      name,
      description,
      permissions,
      subscriptionLevel
    });

    await role.save();
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find({ isActive: true });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get role by ID
exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update role
exports.updateRole = async (req, res) => {
  try {
    const { name, description, permissions, subscriptionLevel, isActive } = req.body;
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // Update role fields
    role.name = name || role.name;
    role.description = description || role.description;
    role.permissions = permissions || role.permissions;
    role.subscriptionLevel = subscriptionLevel || role.subscriptionLevel;
    role.isActive = isActive !== undefined ? isActive : role.isActive;

    await role.save();
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete role
exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // Check if any users are assigned to this role
    const usersWithRole = await User.find({ role: role._id });
    if (usersWithRole.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete role. Users are assigned to this role.',
        users: usersWithRole.map(user => user.email)
      });
    }

    role.isActive = false;
    await role.save();
    res.json({ message: 'Role deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign role to user
exports.assignRoleToUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const role = await Role.findById(req.params.id);
    const user = await User.findById(userId);

    if (!role || !user) {
      return res.status(404).json({ message: 'Role or user not found' });
    }

    user.role = role._id;
    await user.save();

    res.json({ message: 'Role assigned successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get users by role
exports.getUsersByRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    const users = await User.find({ role: role._id });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update role permissions
exports.updateRolePermissions = async (req, res) => {
  try {
    const { permissions } = req.body;
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    role.permissions = permissions;
    await role.save();

    res.json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check user permissions
exports.checkUserPermissions = async (req, res) => {
  try {
    const { userId, requiredPermissions } = req.body;
    const user = await User.findById(userId).populate('role');

    if (!user || !user.role) {
      return res.status(404).json({ message: 'User or role not found' });
    }

    const hasPermissions = Object.entries(requiredPermissions).every(([feature, permission]) => {
      return user.role.permissions[feature]?.[permission] === true;
    });

    res.json({ hasPermissions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 