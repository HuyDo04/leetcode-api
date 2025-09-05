const express = require('express');
const problemStarterController = require('../controllers/problemStarter.controller');
const router = express.Router();

/**
 * @route   POST /api/problem-starters
 * @desc    Create new starter code
 * @access  Private (Admin only)
 */
router.post('/', problemStarterController.createStarter);

/**
 * @route   POST /api/problem-starters/bulk
 * @desc    Bulk create starter codes
 * @access  Private (Admin only)
 */
router.post('/bulk', problemStarterController.bulkCreateStarters);

/**
 * @route   POST /api/problem-starters/problem/:problemId/generate
 * @desc    Generate starter codes for all languages of a problem
 * @access  Private (Admin only)
 */
router.post('/problem/:problemId/generate', problemStarterController.generateStartersForProblem);

/**
 * @route   GET /api/problem-starters
 * @desc    Get all starter codes with pagination
 * @access  Public
 */
router.get('/', problemStarterController.getAllStarters);

/**
 * @route   GET /api/problem-starters/stats
 * @desc    Get starter code statistics
 * @access  Public
 */
router.get('/stats', problemStarterController.getStarterStats);

/**
 * @route   GET /api/problem-starters/:id
 * @desc    Get starter code by ID
 * @access  Public
 */
router.get('/:id', problemStarterController.getStarterById);

/**
 * @route   GET /api/problem-starters/problem/:problemId
 * @desc    Get starter codes for a problem
 * @access  Public
 */
router.get('/problem/:problemId', problemStarterController.getStartersByProblem);

/**
 * @route   GET /api/problem-starters/problem/:problemId/language/:languageId
 * @desc    Get starter code by problem and language
 * @access  Public
 */
router.get('/problem/:problemId/language/:languageId', problemStarterController.getStarterByProblemAndLanguage);

/**
 * @route   GET /api/problem-starters/problem/:problemId/missing
 * @desc    Get missing starter codes for a problem
 * @access  Private (Admin only)
 */
router.get('/problem/:problemId/missing', problemStarterController.getMissingStarters);

/**
 * @route   POST /api/problem-starters/:id/clone
 * @desc    Clone starter code to another language
 * @access  Private (Admin only)
 */
router.post('/:id/clone', problemStarterController.cloneStarter);

/**
 * @route   PUT /api/problem-starters/:id
 * @desc    Update starter code
 * @access  Private (Admin only)
 */
router.put('/:id', problemStarterController.updateStarter);

/**
 * @route   DELETE /api/problem-starters/:id
 * @desc    Delete starter code
 * @access  Private (Admin only)
 */
router.delete('/:id', problemStarterController.deleteStarter);

module.exports = router;
