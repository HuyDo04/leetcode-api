const languageService = require('../services/language.service');

class LanguageController {
    /**
     * Tạo language mới
     */
    async createLanguage(req, res, next) {
        try {
            const languageData = {
                name: req.body.name,
                judge0_id: req.body.judge0_id,
                slug: req.body.slug
            };

            const language = await languageService.createLanguage(languageData);

            res.status(201).json({
                success: true,
                message: 'Language created successfully',
                data: { language },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
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
     * Lấy tất cả languages
     */
    async getAllLanguages(req, res, next) {
        try {
            const options = {
                includeStats: req.query.include_stats === 'true',
                sortBy: req.query.sort_by || 'name',
                order: req.query.order || 'ASC'
            };

            const languages = await languageService.getAllLanguages(options);

            res.json({
                success: true,
                data: {
                    languages,
                    total: languages.length
                },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy language theo ID
     */
    async getLanguageById(req, res, next) {
        try {
            const { id } = req.params;
            const includeStats = req.query.include_stats === 'true';

            const language = await languageService.getLanguageById(id, includeStats);

            res.json({
                success: true,
                data: { language },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'Language not found'
                });
            }
            next(error);
        }
    }

    /**
     * Lấy language theo slug
     */
    async getLanguageBySlug(req, res, next) {
        try {
            const { slug } = req.params;
            const language = await languageService.getLanguageBySlug(slug);

            res.json({
                success: true,
                data: { language },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'Language not found'
                });
            }
            next(error);
        }
    }

    /**
     * Update language
     */
    async updateLanguage(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = {
                name: req.body.name,
                judge0_id: req.body.judge0_id,
                slug: req.body.slug
            };

            // Remove undefined fields
            Object.keys(updateData).forEach(key => {
                if (updateData[key] === undefined) {
                    delete updateData[key];
                }
            });

            const language = await languageService.updateLanguage(id, updateData);

            res.json({
                success: true,
                message: 'Language updated successfully',
                data: { language },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'Language not found'
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
     * Delete language
     */
    async deleteLanguage(req, res, next) {
        try {
            const { id } = req.params;
            const result = await languageService.deleteLanguage(id);

            res.json({
                success: true,
                message: result.message,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'Language not found'
                });
            }
            if (error.message.includes('Cannot delete')) {
                return res.status(409).json({
                    success: false,
                    message: error.message
                });
            }
            next(error);
        }
    }

    /**
     * Lấy popular languages
     */
    async getPopularLanguages(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const languages = await languageService.getPopularLanguages(limit);

            res.json({
                success: true,
                data: { languages },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy language statistics
     */
    async getLanguageStats(req, res, next) {
        try {
            const { id } = req.params;
            const stats = await languageService.getLanguageStats(id);

            res.json({
                success: true,
                data: stats,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'Language not found'
                });
            }
            next(error);
        }
    }

    /**
     * Bulk create languages từ Judge0
     */
    async bulkCreateFromJudge0(req, res, next) {
        try {
            const { languages } = req.body;

            if (!languages || !Array.isArray(languages)) {
                return res.status(400).json({
                    success: false,
                    message: 'Languages array is required'
                });
            }

            const result = await languageService.bulkCreateFromJudge0(languages);

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
}

module.exports = new LanguageController();
