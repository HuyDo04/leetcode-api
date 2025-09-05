const { body, param, validationResult } = require('express-validator');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        status: 400,
        details: errors.array()
      },
      timestamp: new Date().toISOString()
    });
  }
  next();
};

/**
 * Validation rules for code submission
 */
const validateSubmission = [
  body('source_code')
    .notEmpty()
    .withMessage('Source code is required')
    .isLength({ max: 65536 })
    .withMessage('Source code must not exceed 64KB'),
  
  body('language_id')
    .isInt({ min: 1 })
    .withMessage('Language ID must be a positive integer'),
  
  body('stdin')
    .optional()
    .isLength({ max: 1024 })
    .withMessage('Input must not exceed 1KB'),
  
  body('expected_output')
    .optional()
    .isLength({ max: 1024 })
    .withMessage('Expected output must not exceed 1KB'),
  
  body('cpu_time_limit')
    .optional()
    .isFloat({ min: 0.1, max: 15 })
    .withMessage('CPU time limit must be between 0.1 and 15 seconds'),
  
  body('memory_limit')
    .optional()
    .isInt({ min: 1000, max: 512000 })
    .withMessage('Memory limit must be between 1MB and 512MB'),
  
  body('wall_time_limit')
    .optional()
    .isFloat({ min: 1, max: 20 })
    .withMessage('Wall time limit must be between 1 and 20 seconds'),

  handleValidationErrors
];

/**
 * Validation rules for batch submission
 */
const validateBatchSubmission = [
  body('submissions')
    .isArray({ min: 1, max: 20 })
    .withMessage('Submissions must be an array with 1-20 items'),
  
  body('submissions.*.source_code')
    .notEmpty()
    .withMessage('Each submission must have source code')
    .isLength({ max: 65536 })
    .withMessage('Source code must not exceed 64KB'),
  
  body('submissions.*.language_id')
    .isInt({ min: 1 })
    .withMessage('Each submission must have a valid language ID'),

  handleValidationErrors
];

/**
 * Validation rules for problem creation/update
 */
const validateProblem = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 10000 })
    .withMessage('Description must be between 10 and 10000 characters'),
  
  body('difficulty')
    .isIn(['Easy', 'Medium', 'Hard'])
    .withMessage('Difficulty must be Easy, Medium, or Hard'),
  
  body('category')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('test_cases')
    .isArray({ min: 1 })
    .withMessage('At least one test case is required'),
  
  body('test_cases.*.input')
    .notEmpty()
    .withMessage('Each test case must have input'),
  
  body('test_cases.*.expected_output')
    .notEmpty()
    .withMessage('Each test case must have expected output'),

  handleValidationErrors
];

/**
 * Validation rules for problem ID parameter
 */
const validateProblemId = [
  param('id')
    .isUUID()
    .withMessage('Problem ID must be a valid UUID'),

  handleValidationErrors
];

/**
 * Validation rules for submission token parameter
 */
const validateSubmissionToken = [
  param('token')
    .notEmpty()
    .withMessage('Submission token is required')
    .isLength({ min: 36, max: 36 })
    .withMessage('Invalid submission token format'),

  handleValidationErrors
];

module.exports = {
  validateSubmission,
  validateBatchSubmission,
  validateProblem,
  validateProblemId,
  validateSubmissionToken,
  handleValidationErrors
};
