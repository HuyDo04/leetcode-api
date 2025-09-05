const submissionService = require('../services/submission.service');

class SubmissionController {
    /**
     * Tạo và submit code
     */
    async createSubmission(req, res, next) {
        try {
            const submissionData = {
                user_id: req.body.user_id,
                problem_id: req.body.problem_id,
                language_id: req.body.language_id,
                source_code: req.body.source_code
            };

            // Validate required fields
            const requiredFields = ['user_id', 'problem_id', 'language_id', 'source_code'];
            const missingFields = requiredFields.filter(field => !submissionData[field]);

            if (missingFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Missing required fields: ${missingFields.join(', ')}`
                });
            }

            const submission = await submissionService.createSubmission(submissionData);

            res.status(201).json({
                success: true,
                message: 'Code submitted successfully',
                data: { submission },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            next(error);
        }
    }

    /**
     * Lấy submission theo ID
     */
    async getSubmissionById(req, res, next) {
        try {
            const { id } = req.params;
            const includeDetails = req.query.include_details !== 'false';

            const submission = await submissionService.getSubmissionById(id, includeDetails);

            res.json({
                success: true,
                data: { submission },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'Submission not found'
                });
            }
            next(error);
        }
    }

    /**
     * Lấy submissions của user
     */
    async getUserSubmissions(req, res, next) {
        try {
            const { userId } = req.params;
            const options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20,
                problemId: req.query.problem_id ? parseInt(req.query.problem_id) : null,
                languageId: req.query.language_id ? parseInt(req.query.language_id) : null,
                status: req.query.status,
                sortBy: req.query.sort_by || 'created_at',
                order: req.query.order || 'DESC'
            };

            const result = await submissionService.getUserSubmissions(userId, options);

            res.json({
                success: true,
                data: result,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy submissions của problem
     */
    async getProblemSubmissions(req, res, next) {
        try {
            const { problemId } = req.params;
            const options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20,
                status: req.query.status,
                userId: req.query.user_id ? parseInt(req.query.user_id) : null
            };

            const result = await submissionService.getProblemSubmissions(problemId, options);

            res.json({
                success: true,
                data: result,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Rerun submission
     */
    async rerunSubmission(req, res, next) {
        try {
            const { id } = req.params;
            const submission = await submissionService.rerunSubmission(id);

            res.json({
                success: true,
                message: 'Submission rerun successfully',
                data: { submission },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'Submission not found'
                });
            }
            next(error);
        }
    }

    /**
     * Delete submission
     */
    async deleteSubmission(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.query.user_id ? parseInt(req.query.user_id) : null;

            const result = await submissionService.deleteSubmission(id, userId);

            res.json({
                success: true,
                message: result.message,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found') || error.message.includes('access denied')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            next(error);
        }
    }

    /**
     * Lấy submission statistics
     */
    async getSubmissionStats(req, res, next) {
        try {
            const options = {
                userId: req.query.user_id ? parseInt(req.query.user_id) : null,
                problemId: req.query.problem_id ? parseInt(req.query.problem_id) : null,
                languageId: req.query.language_id ? parseInt(req.query.language_id) : null,
                dateRange: null
            };

            // Parse date range if provided
            if (req.query.start_date && req.query.end_date) {
                options.dateRange = {
                    start: new Date(req.query.start_date),
                    end: new Date(req.query.end_date)
                };
            }

            const stats = await submissionService.getSubmissionStats(options);

            res.json({
                success: true,
                data: stats,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy recent submissions
     */
    async getRecentSubmissions(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const includeDetails = req.query.include_details !== 'false';

            const submissions = await submissionService.getRecentSubmissions(limit, includeDetails);

            res.json({
                success: true,
                data: { submissions },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy user's best submission cho một problem
     */
    async getUserBestSubmission(req, res, next) {
        try {
            const { userId, problemId } = req.params;

            const submission = await submissionService.getUserBestSubmission(
                parseInt(userId),
                parseInt(problemId)
            );

            if (!submission) {
                return res.status(404).json({
                    success: false,
                    message: 'No submission found for this user and problem'
                });
            }

            res.json({
                success: true,
                data: { submission },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Check submission status (polling endpoint)
     */
    async checkSubmissionStatus(req, res, next) {
        try {
            const { id } = req.params;
            const submission = await submissionService.getSubmissionById(id, false);

            res.json({
                success: true,
                data: {
                    id: submission.id,
                    status: submission.status,
                    output: submission.output,
                    execution_time: submission.execution_time,
                    memory_used: submission.memory_used,
                    updated_at: submission.updated_at
                },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'Submission not found'
                });
            }
            next(error);
        }
    }
}

module.exports = new SubmissionController();
