const Task = require('../models/Task');
const { generateError } = require('../utils/errorHandler');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (error) {
    generateError(res, 500, 'Server Error');
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('comments.user', 'name email')
      .populate('attachments.uploadedBy', 'name email');

    if (!task) {
      return generateError(res, 404, 'Task not found');
    }

    res.json(task);
  } catch (error) {
    generateError(res, 500, 'Server Error');
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      createdBy: req.user.id
    });

    await task.save();
    
    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json(populatedTask);
  } catch (error) {
    generateError(res, 500, 'Server Error');
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return generateError(res, 404, 'Task not found');
    }

    // Check if user is authorized to update the task
    if (task.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return generateError(res, 401, 'Not authorized');
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    )
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.json(task);
  } catch (error) {
    generateError(res, 500, 'Server Error');
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return generateError(res, 404, 'Task not found');
    }

    // Check if user is authorized to delete the task
    if (task.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return generateError(res, 401, 'Not authorized');
    }

    await task.remove();
    res.json({ msg: 'Task removed' });
  } catch (error) {
    generateError(res, 500, 'Server Error');
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return generateError(res, 404, 'Task not found');
    }

    const newComment = {
      user: req.user.id,
      text: req.body.text
    };

    task.comments.unshift(newComment);
    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('comments.user', 'name email');

    res.json(populatedTask.comments);
  } catch (error) {
    generateError(res, 500, 'Server Error');
  }
};

// @desc    Delete comment from task
// @route   DELETE /api/tasks/:id/comments/:commentId
// @access  Private
exports.deleteComment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return generateError(res, 404, 'Task not found');
    }

    const comment = task.comments.find(
      comment => comment._id.toString() === req.params.commentId
    );

    if (!comment) {
      return generateError(res, 404, 'Comment not found');
    }

    // Check if user is authorized to delete the comment
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return generateError(res, 401, 'Not authorized');
    }

    task.comments = task.comments.filter(
      comment => comment._id.toString() !== req.params.commentId
    );

    await task.save();
    res.json(task.comments);
  } catch (error) {
    generateError(res, 500, 'Server Error');
  }
}; 