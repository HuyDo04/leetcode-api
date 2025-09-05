const { ProblemSolution, Problem, Language } = require('../models');

class ProblemSolutionService {
    /**
     * Tạo solution mới
     */
    async createSolution(solutionData) {
        try {
            // Validate references
            await this.validateReferences(solutionData.problem_id, solutionData.language_id);

            const solution = await ProblemSolution.create(solutionData);
            return await this.getSolutionById(solution.id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Lấy solution theo ID
     */
    async getSolutionById(id) {
        const solution = await ProblemSolution.findByPk(id, {
            include: [
                {
                    model: Problem,
                    as: 'problem',
                    attributes: ['id', 'title', 'slug', 'difficulty']
                },
                {
                    model: Language,
                    as: 'language',
                    attributes: ['id', 'name', 'slug']
                }
            ]
        });

        if (!solution) {
            throw new Error('Solution not found');
        }

        return solution;
    }

    /**
     * Lấy tất cả solutions của một problem
     */
    async getSolutionsByProblem(problemId) {
        const solutions = await ProblemSolution.findAll({
            where: { problem_id: problemId },
            include: [
                {
                    model: Language,
                    as: 'language',
                    attributes: ['id', 'name', 'slug']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        return solutions;
    }

    /**
     * Lấy solution theo problem và language
     */
    async getSolutionByProblemAndLanguage(problemId, languageId) {
        const solution = await ProblemSolution.findOne({
            where: {
                problem_id: problemId,
                language_id: languageId
            },
            include: [
                {
                    model: Problem,
                    as: 'problem',
                    attributes: ['id', 'title', 'slug', 'difficulty']
                },
                {
                    model: Language,
                    as: 'language',
                    attributes: ['id', 'name', 'slug']
                }
            ]
        });

        if (!solution) {
            throw new Error('Solution not found for this problem and language combination');
        }

        return solution;
    }

    /**
     * Update solution
     */
    async updateSolution(id, updateData) {
        const solution = await ProblemSolution.findByPk(id);
        if (!solution) {
            throw new Error('Solution not found');
        }

        // Validate references if they're being updated
        if (updateData.problem_id || updateData.language_id) {
            await this.validateReferences(
                updateData.problem_id || solution.problem_id,
                updateData.language_id || solution.language_id
            );
        }

        await solution.update(updateData);
        return await this.getSolutionById(id);
    }

    /**
     * Delete solution
     */
    async deleteSolution(id) {
        const solution = await ProblemSolution.findByPk(id);
        if (!solution) {
            throw new Error('Solution not found');
        }

        await solution.destroy();
        return { message: 'Solution deleted successfully' };
    }

    /**
     * Lấy tất cả solutions với pagination
     */
    async getAllSolutions({
        page = 1,
        limit = 20,
        problemId = null,
        languageId = null,
        sortBy = 'created_at',
        order = 'DESC'
    } = {}) {
        const offset = (page - 1) * limit;
        const whereCondition = {};

        if (problemId) whereCondition.problem_id = problemId;
        if (languageId) whereCondition.language_id = languageId;

        const { count, rows } = await ProblemSolution.findAndCountAll({
            where: whereCondition,
            include: [
                {
                    model: Problem,
                    as: 'problem',
                    attributes: ['id', 'title', 'slug', 'difficulty']
                },
                {
                    model: Language,
                    as: 'language',
                    attributes: ['id', 'name', 'slug']
                }
            ],
            order: [[sortBy, order.toUpperCase()]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        return {
            solutions: rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / limit),
                totalSolutions: count,
                hasNextPage: page < Math.ceil(count / limit),
                hasPrevPage: page > 1
            }
        };
    }

    /**
     * Validate problem and language references
     */
    async validateReferences(problemId, languageId) {
        const problem = await Problem.findByPk(problemId);
        if (!problem) {
            throw new Error('Problem not found');
        }

        const language = await Language.findByPk(languageId);
        if (!language) {
            throw new Error('Language not found');
        }

        return { problem, language };
    }

    /**
     * Check if solution exists for problem-language combination
     */
    async solutionExists(problemId, languageId) {
        const solution = await ProblemSolution.findOne({
            where: {
                problem_id: problemId,
                language_id: languageId
            }
        });

        return !!solution;
    }

    /**
     * Bulk create solutions
     */
    async bulkCreateSolutions(solutionsData) {
        const createdSolutions = [];
        const errors = [];

        for (const solutionData of solutionsData) {
            try {
                // Check if solution already exists
                const exists = await this.solutionExists(solutionData.problem_id, solutionData.language_id);
                if (exists) {
                    errors.push({
                        data: solutionData,
                        error: 'Solution already exists for this problem-language combination'
                    });
                    continue;
                }

                const solution = await this.createSolution(solutionData);
                createdSolutions.push(solution);
            } catch (error) {
                errors.push({
                    data: solutionData,
                    error: error.message
                });
            }
        }

        return {
            created: createdSolutions,
            errors,
            summary: {
                total: solutionsData.length,
                successful: createdSolutions.length,
                failed: errors.length
            }
        };
    }

    /**
     * Get solution statistics
     */
    async getSolutionStats() {
        const totalSolutions = await ProblemSolution.count();

        // Group by language
        const languageStats = await ProblemSolution.findAll({
            include: [
                {
                    model: Language,
                    as: 'language',
                    attributes: ['id', 'name']
                }
            ],
            attributes: ['language_id']
        });

        const languageCounts = languageStats.reduce((acc, solution) => {
            const langName = solution.language.name;
            acc[langName] = (acc[langName] || 0) + 1;
            return acc;
        }, {});

        // Group by problem difficulty
        const difficultyStats = await ProblemSolution.findAll({
            include: [
                {
                    model: Problem,
                    as: 'problem',
                    attributes: ['difficulty']
                }
            ]
        });

        const difficultyCounts = difficultyStats.reduce((acc, solution) => {
            const difficulty = solution.problem.difficulty;
            acc[difficulty] = (acc[difficulty] || 0) + 1;
            return acc;
        }, {});

        return {
            totalSolutions,
            languageDistribution: languageCounts,
            difficultyDistribution: difficultyCounts
        };
    }

    /**
     * Search solutions
     */
    async searchSolutions(query, limit = 10) {
        const solutions = await ProblemSolution.findAll({
            include: [
                {
                    model: Problem,
                    as: 'problem',
                    attributes: ['id', 'title', 'slug'],
                    where: {
                        [require('sequelize').Op.or]: [
                            { title: { [require('sequelize').Op.iLike]: `%${query}%` } },
                            { slug: { [require('sequelize').Op.iLike]: `%${query}%` } }
                        ]
                    }
                },
                {
                    model: Language,
                    as: 'language',
                    attributes: ['id', 'name', 'slug']
                }
            ],
            limit,
            order: [['created_at', 'DESC']]
        });

        return solutions;
    }

    /**
     * Validate solution code
     */
    validateSolutionCode(solutionCode, languageId) {
        const errors = [];

        if (!solutionCode || solutionCode.trim() === '') {
            errors.push('Solution code cannot be empty');
        }

        if (solutionCode.length > 50000) { // 50KB limit
            errors.push('Solution code is too long (max 50KB)');
        }

        // Language-specific validations can be added here
        // e.g., check for specific syntax patterns

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Get solutions by difficulty
     */
    async getSolutionsByDifficulty(difficulty) {
        if (!['easy', 'medium', 'hard'].includes(difficulty)) {
            throw new Error('Invalid difficulty level');
        }

        const solutions = await ProblemSolution.findAll({
            include: [
                {
                    model: Problem,
                    as: 'problem',
                    where: { difficulty },
                    attributes: ['id', 'title', 'slug', 'difficulty']
                },
                {
                    model: Language,
                    as: 'language',
                    attributes: ['id', 'name', 'slug']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        return solutions;
    }

    /**
     * Clone solution to another language
     */
    async cloneSolution(solutionId, newLanguageId, modifications = {}) {
        const originalSolution = await this.getSolutionById(solutionId);

        // Check if solution already exists for new language
        const exists = await this.solutionExists(originalSolution.problem_id, newLanguageId);
        if (exists) {
            throw new Error('Solution already exists for this language');
        }

        const newSolutionData = {
            problem_id: originalSolution.problem_id,
            language_id: newLanguageId,
            solution_code: modifications.solution_code || originalSolution.solution_code,
            explanation: modifications.explanation || originalSolution.explanation,
            time_complexity: modifications.time_complexity || originalSolution.time_complexity,
            space_complexity: modifications.space_complexity || originalSolution.space_complexity
        };

        return await this.createSolution(newSolutionData);
    }
}

module.exports = new ProblemSolutionService();
