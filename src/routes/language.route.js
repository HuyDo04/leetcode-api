const express = require('express');
const languageController = require('../controllers/language.controller');
const router = express.Router();

/**
 * @route   POST /api/languages
 * @desc    Create new language
 * @access  Private (Admin only)
 */
router.post('/', languageController.createLanguage);

/**
 * @route   POST /api/languages/bulk
 * @desc    Bulk create languages from Judge0
 * @access  Private (Admin only)
 */
router.post('/bulk', languageController.bulkCreateFromJudge0);

/**
 * @route   GET /api/languages
 * @desc    Get all languages
 * @access  Public
 */
router.get('/', languageController.getAllLanguages);

/**
 * @route   GET /api/languages/popular
 * @desc    Get popular languages
 * @access  Public
 */
router.get('/popular', languageController.getPopularLanguages);

/**
 * @route   GET /api/languages/:id
 * @desc    Get language by ID
 * @access  Public
 */
router.get('/:id', languageController.getLanguageById);

/**
 * @route   GET /api/languages/slug/:slug
 * @desc    Get language by slug
 * @access  Public
 */
router.get('/slug/:slug', languageController.getLanguageBySlug);

/**
 * @route   GET /api/languages/:id/stats
 * @desc    Get language statistics
 * @access  Public
 */
router.get('/:id/stats', languageController.getLanguageStats);

/**
 * @route   PUT /api/languages/:id
 * @desc    Update language
 * @access  Private (Admin only)
 */
router.put('/:id', languageController.updateLanguage);

/**
 * @route   DELETE /api/languages/:id
 * @desc    Delete language
 * @access  Private (Admin only)
 */
router.delete('/:id', languageController.deleteLanguage);

module.exports = router;
