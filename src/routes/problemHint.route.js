const express = require('express');
const problemHintController = require('../controllers/problemHint.controller');
const router = express.Router();

/**
 * @route   POST /api/problem-hints
 * @desc    Create new hint
 * @access  Private (Admin only)
 */
router.post('/', problemHintController.createHint);

/**
 * @route   POST /api/problem-hints/problem/:problemId/bulk
 * @desc    Bulk create hints for a problem
 * @access  Private (Admin only)
 */
router.post('/problem/:problemId/bulk', problemHintController.bulkCreateHints);

/**
 * @route   GET /api/problem-hints/search
 * @desc    Search hints
 * @access  Public
 */
router.get('/search', problemHintController.searchHints);

/**
 * @route   GET /api/problem-hints/:id
 * @desc    Get hint by ID
 * @access  Public
 */
router.get('/:id', problemHintController.getHintById);

/**
 * @route   GET /api/problem-hints/problem/:problemId/public
 * @desc    Get public hints for a problem
 * @access  Public
 */
router.get('/problem/:problemId/public', problemHintController.getPublicHints);

/**
 * @route   GET /api/problem-hints/problem/:problemId/all
 * @desc    Get all hints for a problem
 * @access  Private (Admin only)
 */
router.get('/problem/:problemId/all', problemHintController.getAllHints);

/**
 * @route   GET /api/problem-hints/problem/:problemId/progressive
 * @desc    Get progressive hints (up to max order)
 * @access  Public
 */
router.get('/problem/:problemId/progressive', problemHintController.getProgressiveHints);

/**
 * @route   GET /api/problem-hints/problem/:problemId/next
 * @desc    Get next hint in sequence
 * @access  Public
 */
router.get('/problem/:problemId/next', problemHintController.getNextHint);

/**
 * @route   GET /api/problem-hints/problem/:problemId/stats
 * @desc    Get hint statistics for a problem
 * @access  Private (Admin only)
 */
router.get('/problem/:problemId/stats', problemHintController.getHintStats);

/**
 * @route   PUT /api/problem-hints/:id
 * @desc    Update hint
 * @access  Private (Admin only)
 */
router.put('/:id', problemHintController.updateHint);

/**
 * @route   POST /api/problem-hints/problem/:problemId/reorder
 * @desc    Reorder all hints for a problem
 * @access  Private (Admin only)
 */
router.post('/problem/:problemId/reorder', problemHintController.reorderHints);

/**
 * @route   PATCH /api/problem-hints/:id/move-up
 * @desc    Move hint up in order
 * @access  Private (Admin only)
 */
router.patch('/:id/move-up', problemHintController.moveHintUp);

/**
 * @route   PATCH /api/problem-hints/:id/move-down
 * @desc    Move hint down in order
 * @access  Private (Admin only)
 */
router.patch('/:id/move-down', problemHintController.moveHintDown);

/**
 * @route   PATCH /api/problem-hints/:id/toggle-visibility
 * @desc    Toggle hint visibility
 * @access  Private (Admin only)
 */
router.patch('/:id/toggle-visibility', problemHintController.toggleVisibility);

/**
 * @route   DELETE /api/problem-hints/:id
 * @desc    Delete hint
 * @access  Private (Admin only)
 */
router.delete('/:id', problemHintController.deleteHint);

module.exports = router;
