const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Meeting = require('../models/Meeting');
const { generateError } = require('../utils/errorHandler');

// @route   GET /api/meetings
// @desc    Get all meetings
// @access  Private
router.get('/', auth, async (req, res, next) => {
  try {
    const meetings = await Meeting.find()
      .populate('organizer', 'firstName lastName email')
      .populate('participants.user', 'firstName lastName email')
      .populate('customer', 'firstName lastName email')
      .populate('lead', 'name email')
      .sort({ startTime: 1 });
    res.json({
      success: true,
      data: meetings
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/meetings
// @desc    Create a meeting
// @access  Private
router.post('/', auth, async (req, res, next) => {
  try {
    const meeting = new Meeting({
      ...req.body,
      organizer: req.user.id
    });
    await meeting.save();
    res.status(201).json({
      success: true,
      data: meeting
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/meetings/:id
// @desc    Update a meeting
// @access  Private
router.put('/:id', auth, async (req, res, next) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return next(generateError('Meeting not found', 404));
    }

    Object.assign(meeting, req.body);
    await meeting.save();
    res.json({
      success: true,
      data: meeting
    });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/meetings/:id
// @desc    Delete a meeting
// @access  Private
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return next(generateError('Meeting not found', 404));
    }
    await meeting.deleteOne();
    res.json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/meetings/:id/notes
// @desc    Add a note to a meeting
// @access  Private
router.post('/:id/notes', auth, async (req, res, next) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return next(generateError('Meeting not found', 404));
    }

    meeting.notes.push({
      content: req.body.content,
      createdBy: req.user.id
    });
    await meeting.save();
    res.json({
      success: true,
      data: meeting
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/meetings/:id/participants/:userId
// @desc    Update participant status
// @access  Private
router.put('/:id/participants/:userId', auth, async (req, res, next) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return next(generateError('Meeting not found', 404));
    }

    const participant = meeting.participants.find(
      p => p.user.toString() === req.params.userId
    );
    if (!participant) {
      return next(generateError('Participant not found', 404));
    }

    participant.status = req.body.status;
    participant.responseTime = new Date();
    await meeting.save();
    res.json({
      success: true,
      data: meeting
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router; 