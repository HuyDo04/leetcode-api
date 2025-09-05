const express = require('express');
const router = express.Router();

// Import all route modules
const userRoutes = require('./user.route');
const languageRoutes = require('./language.route');
const problemRoutes = require('./problem.route');
const submissionRoutes = require('./submission.route');
const testCaseRoutes = require('./testCase.route');
const problemSolutionRoutes = require('./problemSolution.route');
const problemStarterRoutes = require('./problemStarter.route');
const problemHintRoutes = require('./problemHint.route');
const tagRoutes = require('./tag.route');
const categoryRoutes = require('./category.route');

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Leetcode API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// API documentation endpoint
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Leetcode API',
        version: '1.0.0',
        endpoints: {
            users: '/api/users',
            languages: '/api/languages',
            problems: '/api/problems',
            submissions: '/api/submissions',
            testCases: '/api/test-cases',
            problemSolutions: '/api/problem-solutions',
            problemStarters: '/api/problem-starters',
            problemHints: '/api/problem-hints',
            tags: '/api/tags',
            categories: '/api/categories'
        },
        documentation: {
            health: 'GET /api/health - Health check',
            swagger: 'Coming soon...'
        },
        timestamp: new Date().toISOString()
    });
});

// Mount all routes with their respective prefixes
router.use('/users', userRoutes);
router.use('/languages', languageRoutes);
router.use('/problems', problemRoutes);
router.use('/submissions', submissionRoutes);
router.use('/test-cases', testCaseRoutes);
router.use('/problem-solutions', problemSolutionRoutes);
router.use('/problem-starters', problemStarterRoutes);
router.use('/problem-hints', problemHintRoutes);
router.use('/tags', tagRoutes);
router.use('/categories', categoryRoutes);

// 404 handler for undefined routes
router.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
