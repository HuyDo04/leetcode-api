const { Category, Problem, ProblemCategory } = require('../models');
const { Op } = require('sequelize');

/**
 * @desc    Get all categories with problem counts
 * @route   GET /api/categories
 * @access  Public
 */
const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
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
            attributes: ['id', 'name', 'slug', 'icon']
        });

        // Add problem count to each category
        const categoriesWithCount = categories.map(category => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            icon: category.icon,
            problem_count: category.problems ? category.problems.length : 0
        }));

        res.json({
            success: true,
            data: {
                categories: categoriesWithCount
            }
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * @desc    Get problems by category
 * @route   GET /api/categories/:id/problems
 * @access  Public
 */
const getProblemsByCategory = async (req, res) => {
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
                    model: Category,
                    as: 'categories',
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
        console.error('Error fetching problems by category:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    getCategories,
    getProblemsByCategory
};
