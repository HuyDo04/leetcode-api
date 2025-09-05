const problemSolutionService = require('../services/problemSolution.service');

class ProblemSolutionController {
    /**
     * Tạo solution mới
     */
    async createSolution(req, res, next) {
        try {
            const solutionData = {
                problem_id: req.body.problem_id,
                language_id: req.body.language_id,
                solution_code: req.body.solution_code,
                explanation: req.body.explanation,
                time_complexity: req.body.time_complexity,
                space_complexity: req.body.space_complexity
            };

            // Validate required fields
            const requiredFields = ['problem_id', 'language_id', 'solution_code'];
            const missingFields = requiredFields.filter(field => !solutionData[field]);

            if (missingFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Missing required fields: ${missingFields.join(', ')}`
                });
            }

            // Validate solution code
            const validation = problemSolutionService.validateSolutionCode(
                solutionData.solution_code,
                solutionData.language_id
            );
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: validation.errors
                });
            }

            const solution = await problemSolutionService.createSolution(solutionData);

            res.status(201).json({
                success: true,
                message: 'Solution created successfully',
                data: { solution },
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
     * Lấy solution theo ID
     */
    async getSolutionById(req, res, next) {
        try {
            const { id } = req.params;
            const solution = await problemSolutionService.getSolutionById(id);

            res.json({
                success: true,
                data: { solution },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'Solution not found'
                });
            }
            next(error);
        }
    }

    /**
     * Lấy solutions của problem
     */
    async getSolutionsByProblem(req, res, next) {
        try {
            const { problemId } = req.params;
            const solutions = await problemSolutionService.getSolutionsByProblem(problemId);

            res.json({
                success: true,
                data: {
                    solutions,
                    total: solutions.length
                },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy solution theo problem và language
     */
    async getSolutionByProblemAndLanguage(req, res, next) {
        try {
            const { problemId, languageId } = req.params;
            const solution = await problemSolutionService.getSolutionByProblemAndLanguage(
                problemId,
                languageId
            );

            res.json({
                success: true,
                data: { solution },
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
     * Lấy tất cả solutions với pagination
     */
    async getAllSolutions(req, res, next) {
        try {
            const options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20,
                problemId: req.query.problem_id ? parseInt(req.query.problem_id) : null,
                languageId: req.query.language_id ? parseInt(req.query.language_id) : null,
                sortBy: req.query.sort_by || 'created_at',
                order: req.query.order || 'DESC'
            };

            const result = await problemSolutionService.getAllSolutions(options);

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
     * Update solution
     */
    async updateSolution(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = {
                solution_code: req.body.solution_code,
                explanation: req.body.explanation,
                time_complexity: req.body.time_complexity,
                space_complexity: req.body.space_complexity
            };

            // Remove undefined fields
            Object.keys(updateData).forEach(key => {
                if (updateData[key] === undefined) {
                    delete updateData[key];
                }
            });

            // Validate solution code if being updated
            if (updateData.solution_code) {
                const currentSolution = await problemSolutionService.getSolutionById(id);
                const validation = problemSolutionService.validateSolutionCode(
                    updateData.solution_code,
                    currentSolution.language_id
                );
                if (!validation.isValid) {
                    return res.status(400).json({
                        success: false,
                        message: 'Validation failed',
                        errors: validation.errors
                    });
                }
            }

            const solution = await problemSolutionService.updateSolution(id, updateData);

            res.json({
                success: true,
                message: 'Solution updated successfully',
                data: { solution },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'Solution not found'
                });
            }
            next(error);
        }
    }

    /**
     * Delete solution
     */
    async deleteSolution(req, res, next) {
        try {
            const { id } = req.params;
            const result = await problemSolutionService.deleteSolution(id);

            res.json({
                success: true,
                message: result.message,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'Solution not found'
                });
            }
            next(error);
        }
    }

    /**
     * Bulk create solutions
     */
    async bulkCreateSolutions(req, res, next) {
        try {
            const { solutions } = req.body;

            if (!solutions || !Array.isArray(solutions)) {
                return res.status(400).json({
                    success: false,
                    message: 'Solutions array is required'
                });
            }

            const result = await problemSolutionService.bulkCreateSolutions(solutions);

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
     * Lấy solution statistics
     */
    async getSolutionStats(req, res, next) {
        try {
            const stats = await problemSolutionService.getSolutionStats();

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
     * Search solutions
     */
    async searchSolutions(req, res, next) {
        try {
            const { query } = req.query;
            const limit = parseInt(req.query.limit) || 10;

            if (!query) {
                return res.status(400).json({
                    success: false,
                    message: 'Search query is required'
                });
            }

            const solutions = await problemSolutionService.searchSolutions(query, limit);

            res.json({
                success: true,
                data: {
                    solutions,
                    query,
                    total: solutions.length
                },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy solutions theo difficulty
     */
    async getSolutionsByDifficulty(req, res, next) {
        try {
            const { difficulty } = req.params;
            const solutions = await problemSolutionService.getSolutionsByDifficulty(difficulty);

            res.json({
                success: true,
                data: {
                    solutions,
                    difficulty,
                    total: solutions.length
                },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('Invalid difficulty')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            next(error);
        }
    }

    /**
     * Clone solution sang language khác
     */
    async cloneSolution(req, res, next) {
        try {
            const { id } = req.params;
            const { new_language_id, modifications } = req.body;

            if (!new_language_id) {
                return res.status(400).json({
                    success: false,
                    message: 'new_language_id is required'
                });
            }

            const newSolution = await problemSolutionService.cloneSolution(
                id,
                new_language_id,
                modifications || {}
            );

            res.status(201).json({
                success: true,
                message: 'Solution cloned successfully',
                data: { solution: newSolution },
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
}

module.exports = new ProblemSolutionController();
