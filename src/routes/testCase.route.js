const express = require('express');
const testCaseController = require('../controllers/testCase.controller');
const router = express.Router();

/**
 * @route   POST /api/test-cases
 * @desc    Create new test case
 * @access  Private (Admin only)
 */
router.post('/', testCaseController.createTestCase);

/**
 * @route   POST /api/test-cases/problem/:problemId/bulk
 * @desc    Bulk create test cases for a problem
 * @access  Private (Admin only)
 */
router.post('/problem/:problemId/bulk', testCaseController.bulkCreateTestCases);

/**
 * @route   POST /api/test-cases/problem/:problemId/import
 * @desc    Import test cases for a problem
 * @access  Private (Admin only)
 */
router.post('/problem/:problemId/import', testCaseController.importTestCases);

/**
 * @route   GET /api/test-cases/:id
 * @desc    Get test case by ID
 * @access  Private (Admin only)
 */
router.get('/:id', testCaseController.getTestCaseById);

/**
 * @route   GET /api/test-cases/problem/:problemId/public
 * @desc    Get public test cases for a problem
 * @access  Public
 */
router.get('/problem/:problemId/public', testCaseController.getPublicTestCases);

/**
 * @route   GET /api/test-cases/problem/:problemId/all
 * @desc    Get all test cases for a problem
 * @access  Private (Admin only)
 */
router.get('/problem/:problemId/all', testCaseController.getAllTestCases);

/**
 * @route   GET /api/test-cases/problem/:problemId/stats
 * @desc    Get test case statistics for a problem
 * @access  Private (Admin only)
 */
router.get('/problem/:problemId/stats', testCaseController.getTestCaseStats);

/**
 * @route   GET /api/test-cases/problem/:problemId/export
 * @desc    Export test cases for a problem
 * @access  Private (Admin only)
 */
router.get('/problem/:problemId/export', testCaseController.exportTestCases);

/**
 * @route   PUT /api/test-cases/:id
 * @desc    Update test case
 * @access  Private (Admin only)
 */
router.put('/:id', testCaseController.updateTestCase);

/**
 * @route   PATCH /api/test-cases/:id/toggle-visibility
 * @desc    Toggle test case visibility
 * @access  Private (Admin only)
 */
router.patch('/:id/toggle-visibility', testCaseController.toggleVisibility);

/**
 * @route   DELETE /api/test-cases/:id
 * @desc    Delete test case
 * @access  Private (Admin only)
 */
router.delete('/:id', testCaseController.deleteTestCase);

module.exports = router;
