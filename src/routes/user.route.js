const express = require('express');
const userController = require('../controllers/user.controller');
const router = express.Router();

/**
 * @route   POST /api/users
 * @desc    Create new user
 * @access  Public
 */
router.post('/', userController.createUser);

/**
 * @route   POST /api/users/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', userController.loginUser);

/**
 * @route   GET /api/users
 * @desc    Get all users with pagination
 * @access  Public (should be protected in production)
 */
router.get('/', userController.getUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Public
 */
router.get('/:id', userController.getUserById);

/**
 * @route   GET /api/users/username/:username
 * @desc    Get user by username
 * @access  Public
 */
router.get('/username/:username', userController.getUserByUsername);

/**
 * @route   GET /api/users/:id/stats
 * @desc    Get user statistics
 * @access  Public
 */
router.get('/:id/stats', userController.getUserStats);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private (should be protected)
 */
router.put('/:id', userController.updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private (should be protected)
 */
router.delete('/:id', userController.deleteUser);

module.exports = router;
