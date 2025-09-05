const express = require('express');
const submissionController = require('../controllers/submission.controller');
const router = express.Router();

/**
 * @route   POST /api/submissions
 * @desc    Create new submission (submit code)
 * @access  Private
 */
router.post('/', submissionController.createSubmission);

/**
 * @route   GET /api/submissions/recent
 * @desc    Get recent submissions
 * @access  Public
 */
router.get('/recent', submissionController.getRecentSubmissions);

/**
 * @route   GET /api/submissions/stats
 * @desc    Get submission statistics
 * @access  Public
 */
router.get('/stats', submissionController.getSubmissionStats);

/**
 * @route   GET /api/submissions/:id
 * @desc    Get submission by ID
 * @access  Public
 */
router.get('/:id', submissionController.getSubmissionById);

/**
 * @route   GET /api/submissions/:id/status
 * @desc    Check submission status (for polling)
 * @access  Public
 */
router.get('/:id/status', submissionController.checkSubmissionStatus);

/**
 * @route   POST /api/submissions/:id/rerun
 * @desc    Rerun submission
 * @access  Private
 */
router.post('/:id/rerun', submissionController.rerunSubmission);

/**
 * @route   DELETE /api/submissions/:id
 * @desc    Delete submission
 * @access  Private
 */
router.delete('/:id', submissionController.deleteSubmission);

/**
 * @route   GET /api/submissions/user/:userId
 * @desc    Get user's submissions
 * @access  Public
 */
router.get('/user/:userId', submissionController.getUserSubmissions);

/**
 * @route   GET /api/submissions/problem/:problemId
 * @desc    Get problem's submissions
 * @access  Public
 */
router.get('/problem/:problemId', submissionController.getProblemSubmissions);

/**
 * @route   GET /api/submissions/user/:userId/problem/:problemId/best
 * @desc    Get user's best submission for a problem
 * @access  Public
 */
router.get('/user/:userId/problem/:problemId/best', submissionController.getUserBestSubmission);

module.exports = router;
