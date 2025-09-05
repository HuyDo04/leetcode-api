const { User, Submission } = require('../models');
const bcrypt = require('bcrypt');

class UserService {
    /**
     * Tạo user mới
     */
    async createUser(userData) {
        try {
            // Hash password trước khi lưu
            if (userData.password) {
                const saltRounds = 12;
                userData.password = await bcrypt.hash(userData.password, saltRounds);
            }

            const user = await User.create(userData);

            // Không trả về password
            const { password, ...userResponse } = user.toJSON();
            return userResponse;
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                const field = error.errors[0].path;
                throw new Error(`${field} already exists`);
            }
            throw error;
        }
    }

    /**
     * Lấy user theo ID kèm submissions
     */
    async getUserById(id, includeSubmissions = false) {
        const includeOptions = [];

        if (includeSubmissions) {
            includeOptions.push({
                model: Submission,
                as: 'submissions',
                include: [
                    { model: require('../models').Problem, as: 'problem', attributes: ['id', 'title', 'slug'] },
                    { model: require('../models').Language, as: 'language', attributes: ['id', 'name', 'slug'] }
                ],
                order: [['created_at', 'DESC']]
            });
        }

        const user = await User.findByPk(id, {
            include: includeOptions,
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    /**
     * Lấy user theo username
     */
    async getUserByUsername(username) {
        const user = await User.findOne({
            where: { username },
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    /**
     * Lấy user theo email (cho login)
     */
    async getUserByEmail(email, includePassword = false) {
        const attributes = includePassword ? undefined : { exclude: ['password'] };

        const user = await User.findOne({
            where: { email },
            attributes
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    /**
     * Verify password
     */
    async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    /**
     * Authenticate user (login)
     */
    async authenticateUser(email, password) {
        const user = await this.getUserByEmail(email, true);
        const isValid = await this.verifyPassword(password, user.password);

        if (!isValid) {
            throw new Error('Invalid credentials');
        }

        // Trả về user không có password
        const { password: pwd, ...userResponse } = user.toJSON();
        return userResponse;
    }

    /**
     * Update user
     */
    async updateUser(id, updateData) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }

        // Hash password nếu có update
        if (updateData.password) {
            const saltRounds = 12;
            updateData.password = await bcrypt.hash(updateData.password, saltRounds);
        }

        await user.update(updateData);

        // Trả về user updated không có password
        const { password, ...userResponse } = user.toJSON();
        return userResponse;
    }

    /**
     * Xóa user
     */
    async deleteUser(id) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }

        await user.destroy();
        return { message: 'User deleted successfully' };
    }

    /**
     * Lấy danh sách users với pagination
     */
    async getUsers({ page = 1, limit = 10, search = '' } = {}) {
        const offset = (page - 1) * limit;
        const whereCondition = {};

        if (search) {
            whereCondition[require('sequelize').Op.or] = [
                { username: { [require('sequelize').Op.iLike]: `%${search}%` } },
                { email: { [require('sequelize').Op.iLike]: `%${search}%` } }
            ];
        }

        const { count, rows } = await User.findAndCountAll({
            where: whereCondition,
            attributes: { exclude: ['password'] },
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        return {
            users: rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / limit),
                totalUsers: count,
                hasNextPage: page < Math.ceil(count / limit),
                hasPrevPage: page > 1
            }
        };
    }

    /**
     * Lấy user statistics
     */
    async getUserStats(userId) {
        const user = await this.getUserById(userId, true);

        const stats = {
            totalSubmissions: user.submissions?.length || 0,
            acceptedSubmissions: user.submissions?.filter(s => s.status === 'accepted').length || 0,
            languages: [...new Set(user.submissions?.map(s => s.language.name) || [])],
            recentActivity: user.submissions?.slice(0, 5) || []
        };

        stats.acceptanceRate = stats.totalSubmissions > 0
            ? ((stats.acceptedSubmissions / stats.totalSubmissions) * 100).toFixed(2)
            : 0;

        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                created_at: user.created_at
            },
            stats
        };
    }
}

module.exports = new UserService();
