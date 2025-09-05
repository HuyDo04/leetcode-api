const userService = require('../services/user.service');

class UserController {
    /**
     * Tạo user mới
     */
    async createUser(req, res, next) {
        try {
            const userData = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            };

            const user = await userService.createUser(userData);

            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: { user },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Login user
     */
    async loginUser(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email and password are required'
                });
            }

            const user = await userService.authenticateUser(email, password);

            res.json({
                success: true,
                message: 'Login successful',
                data: { user },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found') || error.message.includes('Invalid credentials')) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }
            next(error);
        }
    }

    /**
     * Lấy user theo ID
     */
    async getUserById(req, res, next) {
        try {
            const { id } = req.params;
            const includeSubmissions = req.query.include_submissions === 'true';

            const user = await userService.getUserById(id, includeSubmissions);

            res.json({
                success: true,
                data: { user },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            next(error);
        }
    }

    /**
     * Lấy user theo username
     */
    async getUserByUsername(req, res, next) {
        try {
            const { username } = req.params;
            const user = await userService.getUserByUsername(username);

            res.json({
                success: true,
                data: { user },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            next(error);
        }
    }

    /**
     * Update user
     */
    async updateUser(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            };

            // Remove undefined fields
            Object.keys(updateData).forEach(key => {
                if (updateData[key] === undefined) {
                    delete updateData[key];
                }
            });

            const user = await userService.updateUser(id, updateData);

            res.json({
                success: true,
                message: 'User updated successfully',
                data: { user },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            next(error);
        }
    }

    /**
     * Delete user
     */
    async deleteUser(req, res, next) {
        try {
            const { id } = req.params;
            const result = await userService.deleteUser(id);

            res.json({
                success: true,
                message: result.message,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            next(error);
        }
    }

    /**
     * Lấy danh sách users với pagination
     */
    async getUsers(req, res, next) {
        try {
            const options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                search: req.query.search || ''
            };

            const result = await userService.getUsers(options);

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
     * Lấy user statistics
     */
    async getUserStats(req, res, next) {
        try {
            const { id } = req.params;
            const stats = await userService.getUserStats(id);

            res.json({
                success: true,
                data: stats,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            next(error);
        }
    }
}

module.exports = new UserController();
