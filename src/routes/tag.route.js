const express = require('express');
const tagController = require('../controllers/tag.controller');
const router = express.Router();

/**
 * @route   GET /api/tags
 * @desc    Get all tags with problem counts
 * @access  Public
 */
router.get('/', tagController.getTags);

/**
 * @route   GET /api/tags/:id/problems
 * @desc    Get problems by tag
 * @access  Public
 */
router.get('/:id/problems', tagController.getProblemsByTag);

module.exports = router;
