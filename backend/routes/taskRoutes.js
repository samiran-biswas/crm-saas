const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  addComment,
  deleteComment
} = require('../controllers/taskController');

// Apply auth middleware to all routes
router.use(auth);

// Task routes
router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

// Comment routes
router.route('/:id/comments')
  .post(addComment);

router.route('/:id/comments/:commentId')
  .delete(deleteComment);

module.exports = router; 