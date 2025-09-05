const problemStarterService = require('../services/problemStarter.service');

class ProblemStarterController {
    /**
     * Tạo starter code mới
     */
    async createStarter(req, res, next) {
        try {
            const starterData = {
                problem_id: req.body.problem_id,
                language_id: req.body.language_id,
                starter_code: req.body.starter_code,
                version: req.body.version
            };

            // Validate required fields
            const requiredFields = ['problem_id', 'language_id', 'starter_code'];
            const missingFields = requiredFields.filter(field => !starterData[field]);

            if (missingFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Missing required fields: ${missingFields.join(', ')}`
                });
            }

            // Validate starter code
            const validation = problemStarterService.validateStarterCode(
                starterData.starter_code,
                starterData.language_id
            );
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: validation.errors
                });
            }

            const starter = await problemStarterService.createStarter(starterData);

            res.status(201).json({
                success: true,
                message: 'Starter code created successfully',
                data: { starter },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            if (error.message.includes('already exists')) {
                return res.status(409).json({
                    success: false,
                    message: error.message
                });
            }
            next(error);
        }
    }

    /**
     * Lấy starter theo ID
     */
    async getStarterById(req, res, next) {
        try {
            const { id } = req.params;
            const starter = await problemStarterService.getStarterById(id);

            res.json({
                success: true,
                data: { starter },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'Starter code not found'
                });
            }
            next(error);
        }
    }

    /**
     * Lấy starters của problem
     */
    async getStartersByProblem(req, res, next) {
        try {
            const { problemId } = req.params;
            const starters = await problemStarterService.getStartersByProblem(problemId);

            res.json({
                success: true,
                data: {
                    starters,
                    total: starters.length
                },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy starter theo problem và language
     */
    async getStarterByProblemAndLanguage(req, res, next) {
        try {
            const { problemId, languageId } = req.params;
            const starter = await problemStarterService.getStarterByProblemAndLanguage(
                problemId,
                languageId
            );

            res.json({
                success: true,
                data: { starter },
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
     * Lấy tất cả starters với pagination
     */
    async getAllStarters(req, res, next) {
        try {
            const options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20,
                problemId: req.query.problem_id ? parseInt(req.query.problem_id) : null,
                languageId: req.query.language_id ? parseInt(req.query.language_id) : null,
                sortBy: req.query.sort_by || 'created_at',
                order: req.query.order || 'DESC'
            };

            const result = await problemStarterService.getAllStarters(options);

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
     * Update starter
     */
    async updateStarter(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = {
                starter_code: req.body.starter_code,
                version: req.body.version
            };

            // Remove undefined fields
            Object.keys(updateData).forEach(key => {
                if (updateData[key] === undefined) {
                    delete updateData[key];
                }
            });

            // Validate starter code if being updated
            if (updateData.starter_code) {
                const currentStarter = await problemStarterService.getStarterById(id);
                const validation = problemStarterService.validateStarterCode(
                    updateData.starter_code,
                    currentStarter.language_id
                );
                if (!validation.isValid) {
                    return res.status(400).json({
                        success: false,
                        message: 'Validation failed',
                        errors: validation.errors
                    });
                }
            }

            const starter = await problemStarterService.updateStarter(id, updateData);

            res.json({
                success: true,
                message: 'Starter code updated successfully',
                data: { starter },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'Starter code not found'
                });
            }
            if (error.message.includes('already exists')) {
                return res.status(409).json({
                    success: false,
                    message: error.message
                });
            }
            next(error);
        }
    }

    /**
     * Delete starter
     */
    async deleteStarter(req, res, next) {
        try {
            const { id } = req.params;
            const result = await problemStarterService.deleteStarter(id);

            res.json({
                success: true,
                message: result.message,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'Starter code not found'
                });
            }
            next(error);
        }
    }

    /**
     * Bulk create starters
     */
    async bulkCreateStarters(req, res, next) {
        try {
            const { starters } = req.body;

            if (!starters || !Array.isArray(starters)) {
                return res.status(400).json({
                    success: false,
                    message: 'Starters array is required'
                });
            }

            const result = await problemStarterService.bulkCreateStarters(starters);

            res.status(201).json({
                success: true,
                message: 'Bulk create completed',
                data: result,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Generate starters cho tất cả languages của problem
     */
    async generateStartersForProblem(req, res, next) {
        try {
            const { problemId } = req.params;
            const { language_ids } = req.body;

            if (!language_ids || !Array.isArray(language_ids)) {
                return res.status(400).json({
                    success: false,
                    message: 'language_ids array is required'
                });
            }

            const result = await problemStarterService.generateStartersForProblem(
                problemId,
                language_ids
            );

            res.status(201).json({
                success: true,
                message: 'Starters generated successfully',
                data: result,
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
     * Lấy starter statistics
     */
    async getStarterStats(req, res, next) {
        try {
            const stats = await problemStarterService.getStarterStats();

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
     * Clone starter sang language khác
     */
    async cloneStarter(req, res, next) {
        try {
            const { id } = req.params;
            const { new_language_id, modifications } = req.body;

            if (!new_language_id) {
                return res.status(400).json({
                    success: false,
                    message: 'new_language_id is required'
                });
            }

            const newStarter = await problemStarterService.cloneStarter(
                id,
                new_language_id,
                modifications || {}
            );

            res.status(201).json({
                success: true,
                message: 'Starter code cloned successfully',
                data: { starter: newStarter },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            if (error.message.includes('already exists')) {
                return res.status(409).json({
                    success: false,
                    message: error.message
                });
            }
            next(error);
        }
    }

    /**
     * Lấy missing starters cho problem
     */
    async getMissingStarters(req, res, next) {
        try {
            const { problemId } = req.params;
            const result = await problemStarterService.getMissingStarters(problemId);

            res.json({
                success: true,
                data: result,
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
}

module.exports = new ProblemStarterController();
