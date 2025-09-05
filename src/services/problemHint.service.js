const { ProblemHint, Problem } = require('../models');
const { Op } = require('sequelize');

class ProblemHintService {
    /**
     * Tạo hint mới
     */
    async createHint(hintData) {
        try {
            // Validate problem exists
            const problem = await Problem.findByPk(hintData.problem_id);
            if (!problem) {
                throw new Error('Problem not found');
            }

            // Auto-set hint_order if not provided
            if (!hintData.hint_order) {
                const maxOrder = await ProblemHint.max('hint_order', {
                    where: { problem_id: hintData.problem_id }
                });
                hintData.hint_order = (maxOrder || 0) + 1;
            } else {
                // Check if hint_order already exists
                const existingHint = await ProblemHint.findOne({
                    where: {
                        problem_id: hintData.problem_id,
                        hint_order: hintData.hint_order
                    }
                });

                if (existingHint) {
                    throw new Error(`Hint with order ${hintData.hint_order} already exists for this problem`);
                }
            }

            const hint = await ProblemHint.create(hintData);
            return await this.getHintById(hint.id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Lấy hint theo ID
     */
    async getHintById(id) {
        const hint = await ProblemHint.findByPk(id, {
            include: [
                {
                    model: Problem,
                    as: 'problem',
                    attributes: ['id', 'title', 'slug', 'difficulty']
                }
            ]
        });

        if (!hint) {
            throw new Error('Hint not found');
        }

        return hint;
    }

    /**
     * Lấy tất cả hints của một problem
     */
    async getHintsByProblem(problemId, includePrivate = false) {
        const whereCondition = { problem_id: problemId };

        if (!includePrivate) {
            whereCondition.is_public = true;
        }

        const hints = await ProblemHint.findAll({
            where: whereCondition,
            order: [['hint_order', 'ASC']]
        });

        return hints;
    }

    /**
     * Lấy public hints cho user
     */
    async getPublicHints(problemId) {
        return await this.getHintsByProblem(problemId, false);
    }

    /**
     * Lấy tất cả hints (admin only)
     */
    async getAllHints(problemId) {
        return await this.getHintsByProblem(problemId, true);
    }

    /**
     * Update hint
     */
    async updateHint(id, updateData) {
        const hint = await ProblemHint.findByPk(id);
        if (!hint) {
            throw new Error('Hint not found');
        }

        // If updating hint_order, check for conflicts
        if (updateData.hint_order && updateData.hint_order !== hint.hint_order) {
            const existingHint = await ProblemHint.findOne({
                where: {
                    problem_id: hint.problem_id,
                    hint_order: updateData.hint_order,
                    id: { [Op.ne]: id } // Exclude current hint
                }
            });

            if (existingHint) {
                throw new Error(`Hint with order ${updateData.hint_order} already exists for this problem`);
            }
        }

        await hint.update(updateData);
        return await this.getHintById(id);
    }

    /**
     * Delete hint
     */
    async deleteHint(id) {
        const hint = await ProblemHint.findByPk(id);
        if (!hint) {
            throw new Error('Hint not found');
        }

        const problemId = hint.problem_id;
        const deletedOrder = hint.hint_order;

        await hint.destroy();

        // Reorder remaining hints
        await this.reorderHints(problemId, deletedOrder);

        return { message: 'Hint deleted successfully' };
    }

    /**
     * Reorder hints after deletion
     */
    async reorderHints(problemId, deletedOrder) {
        const hintsToReorder = await ProblemHint.findAll({
            where: {
                problem_id: problemId,
                hint_order: { [Op.gt]: deletedOrder }
            },
            order: [['hint_order', 'ASC']]
        });

        for (const hint of hintsToReorder) {
            await hint.update({ hint_order: hint.hint_order - 1 });
        }
    }

    /**
     * Reorder all hints for a problem
     */
    async reorderAllHints(problemId, newOrder) {
        const hints = await ProblemHint.findAll({
            where: { problem_id: problemId },
            order: [['hint_order', 'ASC']]
        });

        if (newOrder.length !== hints.length) {
            throw new Error('New order array must contain all hint IDs');
        }

        // Validate all hint IDs exist
        const hintIds = hints.map(h => h.id);
        const invalidIds = newOrder.filter(id => !hintIds.includes(id));
        if (invalidIds.length > 0) {
            throw new Error(`Invalid hint IDs: ${invalidIds.join(', ')}`);
        }

        // Update hint orders
        for (let i = 0; i < newOrder.length; i++) {
            const hint = hints.find(h => h.id === newOrder[i]);
            if (hint && hint.hint_order !== i + 1) {
                await hint.update({ hint_order: i + 1 });
            }
        }

        return await this.getHintsByProblem(problemId, true);
    }

    /**
     * Move hint up in order
     */
    async moveHintUp(id) {
        const hint = await ProblemHint.findByPk(id);
        if (!hint) {
            throw new Error('Hint not found');
        }

        if (hint.hint_order <= 1) {
            throw new Error('Hint is already at the top');
        }

        const previousHint = await ProblemHint.findOne({
            where: {
                problem_id: hint.problem_id,
                hint_order: hint.hint_order - 1
            }
        });

        if (previousHint) {
            // Swap orders
            await previousHint.update({ hint_order: hint.hint_order });
            await hint.update({ hint_order: hint.hint_order - 1 });
        }

        return await this.getHintById(id);
    }

    /**
     * Move hint down in order
     */
    async moveHintDown(id) {
        const hint = await ProblemHint.findByPk(id);
        if (!hint) {
            throw new Error('Hint not found');
        }

        const maxOrder = await ProblemHint.max('hint_order', {
            where: { problem_id: hint.problem_id }
        });

        if (hint.hint_order >= maxOrder) {
            throw new Error('Hint is already at the bottom');
        }

        const nextHint = await ProblemHint.findOne({
            where: {
                problem_id: hint.problem_id,
                hint_order: hint.hint_order + 1
            }
        });

        if (nextHint) {
            // Swap orders
            await nextHint.update({ hint_order: hint.hint_order });
            await hint.update({ hint_order: hint.hint_order + 1 });
        }

        return await this.getHintById(id);
    }

    /**
     * Toggle hint visibility
     */
    async toggleHintVisibility(id) {
        const hint = await ProblemHint.findByPk(id);
        if (!hint) {
            throw new Error('Hint not found');
        }

        await hint.update({ is_public: !hint.is_public });
        return hint;
    }

    /**
     * Bulk create hints
     */
    async bulkCreateHints(problemId, hintsData) {
        try {
            // Validate problem exists
            const problem = await Problem.findByPk(problemId);
            if (!problem) {
                throw new Error('Problem not found');
            }

            const createdHints = [];
            const errors = [];

            for (let i = 0; i < hintsData.length; i++) {
                try {
                    const hintData = {
                        ...hintsData[i],
                        problem_id: problemId,
                        hint_order: hintsData[i].hint_order || (i + 1)
                    };

                    const hint = await this.createHint(hintData);
                    createdHints.push(hint);
                } catch (error) {
                    errors.push({
                        data: hintsData[i],
                        error: error.message
                    });
                }
            }

            return {
                created: createdHints,
                errors,
                summary: {
                    total: hintsData.length,
                    successful: createdHints.length,
                    failed: errors.length
                }
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get hint statistics for a problem
     */
    async getHintStats(problemId) {
        const allHints = await ProblemHint.findAll({
            where: { problem_id: problemId },
            order: [['hint_order', 'ASC']]
        });

        const publicHints = allHints.filter(hint => hint.is_public);
        const privateHints = allHints.filter(hint => !hint.is_public);

        return {
            total: allHints.length,
            public: publicHints.length,
            private: privateHints.length,
            hints: allHints.map(hint => ({
                id: hint.id,
                hint_order: hint.hint_order,
                title: hint.title,
                is_public: hint.is_public,
                content_length: hint.content.length,
                created_at: hint.created_at
            }))
        };
    }

    /**
     * Search hints by content
     */
    async searchHints(query, problemId = null, limit = 10) {
        const whereCondition = {
            [Op.or]: [
                { title: { [Op.iLike]: `%${query}%` } },
                { content: { [Op.iLike]: `%${query}%` } }
            ]
        };

        if (problemId) {
            whereCondition.problem_id = problemId;
        }

        const hints = await ProblemHint.findAll({
            where: whereCondition,
            include: [
                {
                    model: Problem,
                    as: 'problem',
                    attributes: ['id', 'title', 'slug']
                }
            ],
            limit,
            order: [['hint_order', 'ASC']]
        });

        return hints;
    }

    /**
     * Get next hint in sequence
     */
    async getNextHint(problemId, currentOrder) {
        const nextHint = await ProblemHint.findOne({
            where: {
                problem_id: problemId,
                hint_order: { [Op.gt]: currentOrder },
                is_public: true
            },
            order: [['hint_order', 'ASC']]
        });

        return nextHint;
    }

    /**
     * Get progressive hints (up to a certain order)
     */
    async getProgressiveHints(problemId, maxOrder) {
        const hints = await ProblemHint.findAll({
            where: {
                problem_id: problemId,
                hint_order: { [Op.lte]: maxOrder },
                is_public: true
            },
            order: [['hint_order', 'ASC']]
        });

        return hints;
    }

    /**
     * Validate hint content
     */
    validateHintContent(content, title = '') {
        const errors = [];

        if (!content || content.trim() === '') {
            errors.push('Hint content cannot be empty');
        }

        if (content.length > 5000) { // 5KB limit
            errors.push('Hint content is too long (max 5KB)');
        }

        if (title && title.length > 255) {
            errors.push('Hint title is too long (max 255 characters)');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Get hints summary for multiple problems
     */
    async getHintsSummaryForProblems(problemIds) {
        const hints = await ProblemHint.findAll({
            where: {
                problem_id: { [Op.in]: problemIds }
            },
            include: [
                {
                    model: Problem,
                    as: 'problem',
                    attributes: ['id', 'title', 'slug']
                }
            ]
        });

        const summary = problemIds.reduce((acc, problemId) => {
            const problemHints = hints.filter(h => h.problem_id === problemId);
            acc[problemId] = {
                total: problemHints.length,
                public: problemHints.filter(h => h.is_public).length,
                private: problemHints.filter(h => !h.is_public).length
            };
            return acc;
        }, {});

        return summary;
    }
}

module.exports = new ProblemHintService();
