const problemHintService = require('../services/problemHint.service');

class ProblemHintController {
    /**
     * Tạo hint mới
     */
    async createHint(req, res, next) {
        try {
            const hintData = {
                problem_id: req.body.problem_id,
                hint_order: req.body.hint_order,
                title: req.body.title,
                content: req.body.content,
                is_public: req.body.is_public !== undefined ? req.body.is_public : true
            };

            // Validate required fields
            const requiredFields = ['problem_id', 'content'];
            const missingFields = requiredFields.filter(field => !hintData[field]);

            if (missingFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Missing required fields: ${missingFields.join(', ')}`
                });
            }

            // Validate hint content
            const validation = problemHintService.validateHintContent(hintData.content, hintData.title);
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: validation.errors
                });
            }

            const hint = await problemHintService.createHint(hintData);

            res.status(201).json({
                success: true,
                message: 'Hint created successfully',
                data: { hint },
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
     * Lấy hint theo ID
     */
    async getHintById(req, res, next) {
        try {
            const { id } = req.params;
            const hint = await problemHintService.getHintById(id);

            res.json({
                success: true,
                data: { hint },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'Hint not found'
                });
            }
            next(error);
        }
    }

    /**
     * Lấy public hints của problem
     */
    async getPublicHints(req, res, next) {
        try {
            const { problemId } = req.params;
            const hints = await problemHintService.getPublicHints(problemId);

            res.json({
                success: true,
                data: {
                    hints,
                    total: hints.length
                },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy tất cả hints của problem (admin only)
     */
    async getAllHints(req, res, next) {
        try {
            const { problemId } = req.params;
            const hints = await problemHintService.getAllHints(problemId);

            res.json({
                success: true,
                data: {
                    hints,
                    total: hints.length
                },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy progressive hints (up to order)
     */
    async getProgressiveHints(req, res, next) {
        try {
            const { problemId } = req.params;
            const { max_order } = req.query;

            if (!max_order) {
                return res.status(400).json({
                    success: false,
                    message: 'max_order query parameter is required'
                });
            }

            const hints = await problemHintService.getProgressiveHints(
                problemId,
                parseInt(max_order)
            );

            res.json({
                success: true,
                data: {
                    hints,
                    max_order: parseInt(max_order),
                    total: hints.length
                },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy next hint
     */
    async getNextHint(req, res, next) {
        try {
            const { problemId } = req.params;
            const { current_order } = req.query;

            if (!current_order) {
                return res.status(400).json({
                    success: false,
                    message: 'current_order query parameter is required'
                });
            }

            const hint = await problemHintService.getNextHint(
                problemId,
                parseInt(current_order)
            );

            if (!hint) {
                return res.status(404).json({
                    success: false,
                    message: 'No more hints available'
                });
            }

            res.json({
                success: true,
                data: { hint },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update hint
     */
    async updateHint(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = {
                hint_order: req.body.hint_order,
                title: req.body.title,
                content: req.body.content,
                is_public: req.body.is_public
            };

            // Remove undefined fields
            Object.keys(updateData).forEach(key => {
                if (updateData[key] === undefined) {
                    delete updateData[key];
                }
            });

            // Validate content if being updated
            if (updateData.content || updateData.title !== undefined) {
                const currentHint = await problemHintService.getHintById(id);
                const content = updateData.content || currentHint.content;
                const title = updateData.title !== undefined ? updateData.title : currentHint.title;

                const validation = problemHintService.validateHintContent(content, title);
                if (!validation.isValid) {
                    return res.status(400).json({
                        success: false,
                        message: 'Validation failed',
                        errors: validation.errors
                    });
                }
            }

            const hint = await problemHintService.updateHint(id, updateData);

            res.json({
                success: true,
                message: 'Hint updated successfully',
                data: { hint },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'Hint not found'
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
     * Delete hint
     */
    async deleteHint(req, res, next) {
        try {
            const { id } = req.params;
            const result = await problemHintService.deleteHint(id);

            res.json({
                success: true,
                message: result.message,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'Hint not found'
                });
            }
            next(error);
        }
    }

    /**
     * Reorder all hints
     */
    async reorderHints(req, res, next) {
        try {
            const { problemId } = req.params;
            const { new_order } = req.body;

            if (!new_order || !Array.isArray(new_order)) {
                return res.status(400).json({
                    success: false,
                    message: 'new_order array is required'
                });
            }

            const hints = await problemHintService.reorderAllHints(problemId, new_order);

            res.json({
                success: true,
                message: 'Hints reordered successfully',
                data: { hints },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('Invalid hint IDs')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            if (error.message.includes('must contain all hint IDs')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            next(error);
        }
    }

    /**
     * Move hint up
     */
    async moveHintUp(req, res, next) {
        try {
            const { id } = req.params;
            const hint = await problemHintService.moveHintUp(id);

            res.json({
                success: true,
                message: 'Hint moved up successfully',
                data: { hint },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'Hint not found'
                });
            }
            if (error.message.includes('already at the top')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            next(error);
        }
    }

    /**
     * Move hint down
     */
    async moveHintDown(req, res, next) {
        try {
            const { id } = req.params;
            const hint = await problemHintService.moveHintDown(id);

            res.json({
                success: true,
                message: 'Hint moved down successfully',
                data: { hint },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'Hint not found'
                });
            }
            if (error.message.includes('already at the bottom')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            next(error);
        }
    }

    /**
     * Toggle hint visibility
     */
    async toggleVisibility(req, res, next) {
        try {
            const { id } = req.params;
            const hint = await problemHintService.toggleHintVisibility(id);

            res.json({
                success: true,
                message: `Hint visibility changed to ${hint.is_public ? 'public' : 'private'}`,
                data: { hint },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'Hint not found'
                });
            }
            next(error);
        }
    }

    /**
     * Bulk create hints
     */
    async bulkCreateHints(req, res, next) {
        try {
            const { problemId } = req.params;
            const { hints } = req.body;

            if (!hints || !Array.isArray(hints)) {
                return res.status(400).json({
                    success: false,
                    message: 'Hints array is required'
                });
            }

            const result = await problemHintService.bulkCreateHints(problemId, hints);

            res.status(201).json({
                success: true,
                message: 'Bulk create completed',
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
     * Lấy hint statistics
     */
    async getHintStats(req, res, next) {
        try {
            const { problemId } = req.params;
            const stats = await problemHintService.getHintStats(problemId);

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
     * Search hints
     */
    async searchHints(req, res, next) {
        try {
            const { query } = req.query;
            const problemId = req.query.problem_id ? parseInt(req.query.problem_id) : null;
            const limit = parseInt(req.query.limit) || 10;

            if (!query) {
                return res.status(400).json({
                    success: false,
                    message: 'Search query is required'
                });
            }

            const hints = await problemHintService.searchHints(query, problemId, limit);

            res.json({
                success: true,
                data: {
                    hints,
                    query,
                    problem_id: problemId,
                    total: hints.length
                },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ProblemHintController();
