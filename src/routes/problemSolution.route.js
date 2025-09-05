const express = require('express');
const problemSolutionController = require('../controllers/problemSolution.controller');
const router = express.Router();

/**
 * @route   POST /api/problem-solutions
 * @desc    Create new solution
 * @access  Private (Admin only)
 */
router.post('/', problemSolutionController.createSolution);

/**
 * @route   POST /api/problem-solutions/bulk
 * @desc    Bulk create solutions
 * @access  Private (Admin only)
 */
router.post('/bulk', problemSolutionController.bulkCreateSolutions);

/**
 * @route   GET /api/problem-solutions
 * @desc    Get all solutions with pagination
 * @access  Public
 */
router.get('/', problemSolutionController.getAllSolutions);

/**
 * @route   GET /api/problem-solutions/search
 * @desc    Search solutions
 * @access  Public
 */
router.get('/search', problemSolutionController.searchSolutions);

/**
 * @route   GET /api/problem-solutions/stats
 * @desc    Get solution statistics
 * @access  Public
 */
router.get('/stats', problemSolutionController.getSolutionStats);

/**
 * @route   GET /api/problem-solutions/difficulty/:difficulty
 * @desc    Get solutions by difficulty
 * @access  Public
 */
router.get('/difficulty/:difficulty', problemSolutionController.getSolutionsByDifficulty);

/**
 * @route   GET /api/problem-solutions/:id
 * @desc    Get solution by ID
 * @access  Public
 */
router.get('/:id', problemSolutionController.getSolutionById);

/**
 * @route   GET /api/problem-solutions/problem/:problemId
 * @desc    Get solutions for a problem
 * @access  Public
 */
router.get('/problem/:problemId', problemSolutionController.getSolutionsByProblem);

/**
 * @route   GET /api/problem-solutions/problem/:problemId/language/:languageId
 * @desc    Get solution by problem and language
 * @access  Public
 */
router.get('/problem/:problemId/language/:languageId', problemSolutionController.getSolutionByProblemAndLanguage);

/**
 * @route   POST /api/problem-solutions/:id/clone
 * @desc    Clone solution to another language
 * @access  Private (Admin only)
 */
router.post('/:id/clone', problemSolutionController.cloneSolution);

/**
 * @route   PUT /api/problem-solutions/:id
 * @desc    Update solution
 * @access  Private (Admin only)
 */
router.put('/:id', problemSolutionController.updateSolution);

/**
 * @route   DELETE /api/problem-solutions/:id
 * @desc    Delete solution
 * @access  Private (Admin only)
 */
router.delete('/:id', problemSolutionController.deleteSolution);

module.exports = router;
