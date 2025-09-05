const express = require('express');
const categoryController = require('../controllers/category.controller');
const router = express.Router();

/**
 * @route   GET /api/categories
 * @desc    Get all categories with problem counts
 * @access  Public
 */
router.get('/', categoryController.getCategories);

/**
 * @route   GET /api/categories/:id/problems
 * @desc    Get problems by category
 * @access  Public
 */
router.get('/:id/problems', categoryController.getProblemsByCategory);

module.exports = router;
