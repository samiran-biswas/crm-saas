const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Project = require('../models/Project');
const { generateError } = require('../utils/errorHandler');

// @route   GET /api/projects
// @desc    Get all projects
// @access  Private
router.get('/', auth, async (req, res, next) => {
  try {
    const projects = await Project.find()
      .populate('manager', 'firstName lastName email')
      .populate('team.user', 'firstName lastName email')
      .populate('customer', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      data: projects
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/projects
// @desc    Create a project
// @access  Private
router.post('/', auth, async (req, res, next) => {
  try {
    const project = new Project({
      ...req.body,
      manager: req.user.id
    });
    await project.save();
    res.status(201).json({
      success: true,
      data: project
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/projects/:id
// @desc    Update a project
// @access  Private
router.put('/:id', auth, async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return next(generateError('Project not found', 404));
    }

    Object.assign(project, req.body);
    await project.save();
    res.json({
      success: true,
      data: project
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return next(generateError('Project not found', 404));
    }
    await project.deleteOne();
    res.json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/projects/:id/team
// @desc    Add a team member to a project
// @access  Private
router.post('/:id/team', auth, async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return next(generateError('Project not found', 404));
    }

    project.team.push({
      user: req.body.userId,
      role: req.body.role
    });
    await project.save();
    res.json({
      success: true,
      data: project
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/projects/:id/team/:userId
// @desc    Remove a team member from a project
// @access  Private
router.delete('/:id/team/:userId', auth, async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return next(generateError('Project not found', 404));
    }

    project.team = project.team.filter(
      member => member.user.toString() !== req.params.userId
    );
    await project.save();
    res.json({
      success: true,
      data: project
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/projects/:id/milestones
// @desc    Add a milestone to a project
// @access  Private
router.post('/:id/milestones', auth, async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return next(generateError('Project not found', 404));
    }

    project.milestones.push(req.body);
    await project.save();
    res.json({
      success: true,
      data: project
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/projects/:id/milestones/:milestoneId
// @desc    Update a milestone
// @access  Private
router.put('/:id/milestones/:milestoneId', auth, async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return next(generateError('Project not found', 404));
    }

    const milestone = project.milestones.id(req.params.milestoneId);
    if (!milestone) {
      return next(generateError('Milestone not found', 404));
    }

    Object.assign(milestone, req.body);
    await project.save();
    res.json({
      success: true,
      data: project
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router; 