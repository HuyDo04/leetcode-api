const { Language, Submission, ProblemSolution, ProblemStarter } = require('../models');

class LanguageService {
    /**
     * Tạo language mới
     */
    async createLanguage(languageData) {
        try {
            // Validate slug format
            if (languageData.slug) {
                languageData.slug = languageData.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
            }

            const language = await Language.create(languageData);
            return language;
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new Error('Language slug already exists');
            }
            throw error;
        }
    }

    /**
     * Lấy language theo ID
     */
    async getLanguageById(id, includeStats = false) {
        const includeOptions = [];

        if (includeStats) {
            includeOptions.push(
                {
                    model: Submission,
                    as: 'submissions',
                    attributes: ['id', 'status', 'created_at']
                },
                {
                    model: ProblemSolution,
                    as: 'problemSolutions',
                    attributes: ['id', 'problem_id']
                },
                {
                    model: ProblemStarter,
                    as: 'problemStarters',
                    attributes: ['id', 'problem_id']
                }
            );
        }

        const language = await Language.findByPk(id, {
            include: includeOptions
        });

        if (!language) {
            throw new Error('Language not found');
        }

        return language;
    }

    /**
     * Lấy language theo slug
     */
    async getLanguageBySlug(slug) {
        const language = await Language.findOne({
            where: { slug }
        });

        if (!language) {
            throw new Error('Language not found');
        }

        return language;
    }

    /**
     * Lấy language theo Judge0 ID
     */
    async getLanguageByJudge0Id(judge0Id) {
        const language = await Language.findOne({
            where: { judge0_id: judge0Id }
        });

        if (!language) {
            throw new Error('Language not found');
        }

        return language;
    }

    /**
     * Lấy tất cả languages
     */
    async getAllLanguages({ includeStats = false, sortBy = 'name', order = 'ASC' } = {}) {
        const includeOptions = [];

        if (includeStats) {
            includeOptions.push(
                {
                    model: Submission,
                    as: 'submissions',
                    attributes: ['id', 'status']
                }
            );
        }

        const languages = await Language.findAll({
            include: includeOptions,
            order: [[sortBy, order.toUpperCase()]]
        });

        return languages.map(language => {
            const langData = language.toJSON();

            if (includeStats && langData.submissions) {
                langData.stats = {
                    totalSubmissions: langData.submissions.length,
                    acceptedSubmissions: langData.submissions.filter(s => s.status === 'accepted').length
                };
                delete langData.submissions;
            }

            return langData;
        });
    }

    /**
     * Update language
     */
    async updateLanguage(id, updateData) {
        const language = await Language.findByPk(id);
        if (!language) {
            throw new Error('Language not found');
        }

        // Validate slug format if updating
        if (updateData.slug) {
            updateData.slug = updateData.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
        }

        try {
            await language.update(updateData);
            return language;
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new Error('Language slug already exists');
            }
            throw error;
        }
    }

    /**
     * Xóa language
     */
    async deleteLanguage(id) {
        const language = await Language.findByPk(id);
        if (!language) {
            throw new Error('Language not found');
        }

        // Check if language is being used
        const submissionCount = await Submission.count({ where: { language_id: id } });
        if (submissionCount > 0) {
            throw new Error('Cannot delete language that has submissions');
        }

        await language.destroy();
        return { message: 'Language deleted successfully' };
    }

    /**
     * Lấy languages phổ biến
     */
    async getPopularLanguages(limit = 10) {
        const languages = await Language.findAll({
            include: [
                {
                    model: Submission,
                    as: 'submissions',
                    attributes: ['id']
                }
            ]
        });

        return languages
            .map(lang => ({
                ...lang.toJSON(),
                submissionCount: lang.submissions.length
            }))
            .sort((a, b) => b.submissionCount - a.submissionCount)
            .slice(0, limit)
            .map(({ submissions, ...lang }) => lang);
    }

    /**
     * Lấy language statistics
     */
    async getLanguageStats(id) {
        const language = await this.getLanguageById(id, true);

        const stats = {
            name: language.name,
            slug: language.slug,
            judge0_id: language.judge0_id,
            totalSubmissions: language.submissions?.length || 0,
            acceptedSubmissions: language.submissions?.filter(s => s.status === 'accepted').length || 0,
            totalSolutions: language.problemSolutions?.length || 0,
            totalStarters: language.problemStarters?.length || 0,
            recentSubmissions: language.submissions?.slice(-5) || []
        };

        stats.acceptanceRate = stats.totalSubmissions > 0
            ? ((stats.acceptedSubmissions / stats.totalSubmissions) * 100).toFixed(2)
            : 0;

        return stats;
    }

    /**
     * Validate Judge0 connection
     */
    async validateJudge0Language(judge0Id) {
        // This would integrate with Judge0 service to validate
        // For now, just check if ID exists in our system
        const existingLanguage = await Language.findOne({ where: { judge0_id: judge0Id } });
        return !existingLanguage;
    }

    /**
     * Bulk create languages từ Judge0
     */
    async bulkCreateFromJudge0(languagesData) {
        const createdLanguages = [];
        const errors = [];

        for (const langData of languagesData) {
            try {
                const language = await this.createLanguage(langData);
                createdLanguages.push(language);
            } catch (error) {
                errors.push({ data: langData, error: error.message });
            }
        }

        return {
            created: createdLanguages,
            errors,
            summary: {
                total: languagesData.length,
                successful: createdLanguages.length,
                failed: errors.length
            }
        };
    }
}

module.exports = new LanguageService();
