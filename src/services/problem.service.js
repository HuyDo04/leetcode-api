const { Problem, TestCase, Submission, ProblemSolution, ProblemStarter, ProblemHint, User, Language, Example, Category, Tag, ProblemCategory, ProblemTag } = require('../models');
const { Op } = require('sequelize');

class ProblemService {
    /**
     * Tạo problem mới
     */
    async createProblem(problemData) {
        try {
            // Generate slug if not provided
            if (!problemData.slug && problemData.title) {
                problemData.slug = this.generateSlug(problemData.title);
            }

            const problem = await Problem.create(problemData);
            return problem;
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new Error('Problem slug already exists');
            }
            throw error;
        }
    }

    /**
     * Lấy problem theo ID với đầy đủ thông tin
     */
    async getProblemById(id, includeOptions = {}) {
        const {
            includeTestCases = false,
            includeSubmissions = false,
            includeSolutions = false,
            includeStarters = false,
            includeHints = false,
            includeExamples = false,
            userId = null
        } = includeOptions;

        const include = [];

        if (includeTestCases) {
            include.push({
                model: TestCase,
                as: 'testCases',
                where: { is_public: true },
                required: false
            });
        }

        if (includeSubmissions) {
            const submissionInclude = {
                model: Submission,
                as: 'submissions',
                include: [
                    { model: User, as: 'user', attributes: ['id', 'username'] },
                    { model: Language, as: 'language', attributes: ['id', 'name', 'slug'] }
                ],
                order: [['created_at', 'DESC']]
            };

            if (userId) {
                submissionInclude.where = { user_id: userId };
            }

            include.push(submissionInclude);
        }

        if (includeSolutions) {
            include.push({
                model: ProblemSolution,
                as: 'solutions',
                include: [{ model: Language, as: 'language', attributes: ['id', 'name', 'slug'] }]
            });
        }

        if (includeStarters) {
            include.push({
                model: ProblemStarter,
                as: 'starters',
                include: [{ model: Language, as: 'language', attributes: ['id', 'name', 'slug'] }]
            });
        }

        if (includeHints) {
            include.push({
                model: ProblemHint,
                as: 'hints',
                where: { is_public: true },
                order: [['hint_order', 'ASC']],
                required: false
            });
        }

        if (includeExamples) {
            include.push({
                model: Example,
                as: 'examples',
                order: [['id', 'ASC']],
                required: false
            });
        }

        const problem = await Problem.findByPk(id, { include });

        if (!problem) {
            throw new Error('Problem not found');
        }

        return problem;
    }

    /**
     * Lấy problem theo slug
     */
    async getProblemBySlug(slug, includeOptions = {}) {
        const problem = await Problem.findOne({
            where: { slug },
            include: this.buildIncludeOptions(includeOptions)
        });

        if (!problem) {
            throw new Error('Problem not found');
        }

        return problem;
    }

    /**
     * Lấy danh sách problems với filters và pagination
     */
    async getProblems({
        page = 1,
        limit = 20,
        difficulty = null,
        search = '',
        sortBy = 'created_at',
        order = 'DESC',
        userId = null,
        categoryId = null,
        tagId = null
    } = {}) {
        const offset = (page - 1) * limit;
        const whereCondition = {};

        // Filter by difficulty
        if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty)) {
            whereCondition.difficulty = difficulty;
        }

        // Search in title and description
        if (search) {
            whereCondition[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const include = [];

        // Include user submissions if userId provided
        if (userId) {
            include.push({
                model: Submission,
                as: 'submissions',
                where: { user_id: userId },
                required: false,
                attributes: ['id', 'status', 'created_at']
            });
        }

        // Filter by category
        if (categoryId) {
            include.push({
                model: Category,
                as: 'categories',
                where: { id: categoryId },
                through: {
                    attributes: []
                },
                required: true
            });
        }

        // Filter by tag
        if (tagId) {
            include.push({
                model: Tag,
                as: 'tags',
                where: { id: tagId },
                through: {
                    attributes: []
                },
                required: true
            });
        }

        const { count, rows } = await Problem.findAndCountAll({
            where: whereCondition,
            include,
            order: [[sortBy, order.toUpperCase()]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        return {
            problems: rows.map(problem => {
                const problemData = problem.toJSON();

                if (userId && problemData.submissions) {
                    problemData.userStatus = {
                        attempted: problemData.submissions.length > 0,
                        solved: problemData.submissions.some(s => s.status === 'accepted'),
                        lastSubmission: problemData.submissions[0] || null
                    };
                    delete problemData.submissions;
                }

                return problemData;
            }),
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / limit),
                totalProblems: count,
                hasNextPage: page < Math.ceil(count / limit),
                hasPrevPage: page > 1
            }
        };
    }

    /**
     * Update problem
     */
    async updateProblem(id, updateData) {
        const problem = await Problem.findByPk(id);
        if (!problem) {
            throw new Error('Problem not found');
        }

        // Generate new slug if title changed
        if (updateData.title && updateData.title !== problem.title) {
            updateData.slug = this.generateSlug(updateData.title);
        }

        try {
            await problem.update(updateData);
            return problem;
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new Error('Problem slug already exists');
            }
            throw error;
        }
    }

    /**
     * Xóa problem
     */
    async deleteProblem(id) {
        const problem = await Problem.findByPk(id);
        if (!problem) {
            throw new Error('Problem not found');
        }

        await problem.destroy();
        return { message: 'Problem deleted successfully' };
    }

    /**
     * Lấy problem statistics
     */
    async getProblemStats(id) {
        const problem = await Problem.findByPk(id, {
            include: [
                {
                    model: Submission,
                    as: 'submissions',
                    attributes: ['id', 'status', 'language_id', 'user_id', 'created_at'],
                    include: [
                        { model: Language, as: 'language', attributes: ['name'] }
                    ]
                }
            ]
        });

        if (!problem) {
            throw new Error('Problem not found');
        }

        const submissions = problem.submissions || [];
        const totalSubmissions = submissions.length;
        const acceptedSubmissions = submissions.filter(s => s.status === 'accepted').length;
        const uniqueUsers = new Set(submissions.map(s => s.user_id)).size;
        const languageStats = {};

        submissions.forEach(submission => {
            const langName = submission.language.name;
            if (!languageStats[langName]) {
                languageStats[langName] = { total: 0, accepted: 0 };
            }
            languageStats[langName].total++;
            if (submission.status === 'accepted') {
                languageStats[langName].accepted++;
            }
        });

        return {
            problem: {
                id: problem.id,
                title: problem.title,
                slug: problem.slug,
                difficulty: problem.difficulty
            },
            stats: {
                totalSubmissions,
                acceptedSubmissions,
                acceptanceRate: totalSubmissions > 0 ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(2) : 0,
                uniqueUsers,
                languageStats,
                recentSubmissions: submissions.slice(-10)
            }
        };
    }

    /**
     * Lấy problems theo difficulty
     */
    async getProblemsByDifficulty(difficulty) {
        if (!['easy', 'medium', 'hard'].includes(difficulty)) {
            throw new Error('Invalid difficulty level');
        }

        return await Problem.findAll({
            where: { difficulty },
            order: [['created_at', 'DESC']]
        });
    }

    /**
     * Search problems
     */
    async searchProblems(query, limit = 10) {
        return await Problem.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.iLike]: `%${query}%` } },
                    { description: { [Op.iLike]: `%${query}%` } }
                ]
            },
            limit,
            order: [['title', 'ASC']]
        });
    }

    /**
     * Helper: Generate slug from title
     */
    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .trim('-'); // Remove leading/trailing hyphens
    }

    /**
     * Helper: Build include options
     */
    buildIncludeOptions(options = {}) {
        const include = [];

        if (options.includeTestCases) {
            include.push({
                model: TestCase,
                as: 'testCases',
                where: { is_public: true },
                required: false
            });
        }

        if (options.includeHints) {
            include.push({
                model: ProblemHint,
                as: 'hints',
                where: { is_public: true },
                order: [['hint_order', 'ASC']],
                required: false
            });
        }

        if (options.includeStarters) {
            include.push({
                model: ProblemStarter,
                as: 'starters',
                include: [{ model: Language, as: 'language' }]
            });
        }

        return include;
    }

    /**
     * Get trending problems
     */
    async getTrendingProblems(limit = 10, days = 7) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const problems = await Problem.findAll({
            include: [
                {
                    model: Submission,
                    as: 'submissions',
                    where: {
                        created_at: { [Op.gte]: startDate }
                    },
                    required: false,
                    attributes: ['id']
                }
            ]
        });

        return problems
            .map(problem => ({
                ...problem.toJSON(),
                submissionCount: problem.submissions.length
            }))
            .sort((a, b) => b.submissionCount - a.submissionCount)
            .slice(0, limit)
            .map(({ submissions, ...problem }) => problem);
    }

    /**
     * Get test cases for a problem
     */
    async getTestCasesByProblemId(problemId, options = {}) {
        const { publicOnly = false } = options;

        const where = { problem_id: problemId };
        if (publicOnly) {
            where.is_public = true;
        }

        const testCases = await TestCase.findAll({
            where,
            order: [['id', 'ASC']]
        });

        return testCases;
    }
}

module.exports = new ProblemService();
