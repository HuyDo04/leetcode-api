const express = require('express');
const problemController = require('../controllers/problem.controller');
const router = express.Router();

/**
 * @route   POST /api/problems
 * @desc    Create new problem
 * @access  Private (Admin only)
 */
router.post('/', problemController.createProblem);

/**
 * @route   GET /api/problems
 * @desc    Get all problems with filters and pagination
 * @access  Public
 */
router.get('/', problemController.getProblems);

/**
 * @route   GET /api/problems/search
 * @desc    Search problems
 * @access  Public
 */
router.get('/search', problemController.searchProblems);

/**
 * @route   GET /api/problems/trending
 * @desc    Get trending problems
 * @access  Public
 */
router.get('/trending', problemController.getTrendingProblems);

/**
 * @route   GET /api/problems/difficulty/:difficulty
 * @desc    Get problems by difficulty
 * @access  Public
 */
router.get('/difficulty/:difficulty', problemController.getProblemsByDifficulty);

/**
 * @route   GET /api/problems/:id
 * @desc    Get problem by ID
 * @access  Public
 */
router.get('/:id', problemController.getProblemById);

/**
 * @route   GET /api/problems/slug/:slug
 * @desc    Get problem by slug
 * @access  Public
 */
router.get('/slug/:slug', problemController.getProblemBySlug);

/**
 * @route   GET /api/problems/:id/stats
 * @desc    Get problem statistics
 * @access  Public
 */
router.get('/:id/stats', problemController.getProblemStats);

/**
 * @route   PUT /api/problems/:id
 * @desc    Update problem
 * @access  Private (Admin only)
 */
router.put('/:id', problemController.updateProblem);

/**
 * @route   DELETE /api/problems/:id
 * @desc    Delete problem
 * @access  Private (Admin only)
 */
router.delete('/:id', problemController.deleteProblem);

/**
 * @route   POST /api/problems/:id/run
 * @desc    Run code against test cases
 * @access  Public
 */
router.post('/:id/run', problemController.runCode);

/**
 * @route   POST /api/problems/slug/:slug/run
 * @desc    Run code against test cases by slug
 * @access  Public
 */
router.post('/slug/:slug/run', problemController.runCodeBySlug);

module.exports = router;
