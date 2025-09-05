const { Tag, Problem, ProblemTag } = require('../models');
const { Op } = require('sequelize');

/**
 * @desc    Get all tags with problem counts
 * @route   GET /api/tags
 * @access  Public
 */
const getTags = async (req, res) => {
    try {
        const tags = await Tag.findAll({
            include: [
                {
                    model: Problem,
                    as: 'problems',
                    through: {
                        attributes: []
                    },
                    attributes: ['id']
                }
            ],
            attributes: ['id', 'name', 'slug']
        });

        // Add problem count to each tag
        const tagsWithCount = tags.map(tag => ({
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
            problem_count: tag.problems ? tag.problems.length : 0
        }));

        res.json({
            success: true,
            data: {
                tags: tagsWithCount
            }
        });
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * @desc    Get problems by tag
 * @route   GET /api/tags/:id/problems
 * @access  Public
 */
const getProblemsByTag = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 20, difficulty, search } = req.query;

        const offset = (page - 1) * limit;
        const whereClause = {};

        if (difficulty) {
            whereClause.difficulty = difficulty;
        }

        if (search) {
            whereClause.title = {
                [Op.iLike]: `%${search}%`
            };
        }

        const problems = await Problem.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Tag,
                    as: 'tags',
                    where: { id: id },
                    through: {
                        attributes: []
                    },
                    attributes: ['id', 'name', 'slug']
                }
            ],
            attributes: ['id', 'title', 'slug', 'difficulty', 'description'],
            limit: parseInt(limit),
            offset: offset,
            order: [['id', 'ASC']]
        });

        res.json({
            success: true,
            data: {
                problems: problems.rows,
                pagination: {
                    current_page: parseInt(page),
                    total_pages: Math.ceil(problems.count / limit),
                    total_problems: problems.count,
                    per_page: parseInt(limit)
                }
            }
        });
    } catch (error) {
        console.error('Error fetching problems by tag:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    getTags,
    getProblemsByTag
};
