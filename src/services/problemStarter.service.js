const { ProblemStarter, Problem, Language } = require('../models');

class ProblemStarterService {
    /**
     * Tạo starter code mới
     */
    async createStarter(starterData) {
        try {
            // Validate references
            await this.validateReferences(starterData.problem_id, starterData.language_id);

            // Check if starter already exists for this combination
            const exists = await this.starterExists(starterData.problem_id, starterData.language_id);
            if (exists) {
                throw new Error('Starter code already exists for this problem-language combination');
            }

            const starter = await ProblemStarter.create(starterData);
            return await this.getStarterById(starter.id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Lấy starter code theo ID
     */
    async getStarterById(id) {
        const starter = await ProblemStarter.findByPk(id, {
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

        if (!starter) {
            throw new Error('Starter code not found');
        }

        return starter;
    }

    /**
     * Lấy tất cả starter codes của một problem
     */
    async getStartersByProblem(problemId) {
        const starters = await ProblemStarter.findAll({
            where: { problem_id: problemId },
            include: [
                {
                    model: Language,
                    as: 'language',
                    attributes: ['id', 'name', 'slug']
                }
            ],
            order: [['language', 'name', 'ASC']]
        });

        return starters;
    }

    /**
     * Lấy starter code theo problem và language
     */
    async getStarterByProblemAndLanguage(problemId, languageId) {
        const starter = await ProblemStarter.findOne({
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

        if (!starter) {
            throw new Error('Starter code not found for this problem and language combination');
        }

        return starter;
    }

    /**
     * Update starter code
     */
    async updateStarter(id, updateData) {
        const starter = await ProblemStarter.findByPk(id);
        if (!starter) {
            throw new Error('Starter code not found');
        }

        // Validate references if they're being updated
        if (updateData.problem_id || updateData.language_id) {
            const newProblemId = updateData.problem_id || starter.problem_id;
            const newLanguageId = updateData.language_id || starter.language_id;

            await this.validateReferences(newProblemId, newLanguageId);

            // Check uniqueness if changing problem or language
            if (newProblemId !== starter.problem_id || newLanguageId !== starter.language_id) {
                const exists = await this.starterExists(newProblemId, newLanguageId);
                if (exists) {
                    throw new Error('Starter code already exists for this problem-language combination');
                }
            }
        }

        await starter.update(updateData);
        return await this.getStarterById(id);
    }

    /**
     * Delete starter code
     */
    async deleteStarter(id) {
        const starter = await ProblemStarter.findByPk(id);
        if (!starter) {
            throw new Error('Starter code not found');
        }

        await starter.destroy();
        return { message: 'Starter code deleted successfully' };
    }

    /**
     * Lấy tất cả starter codes với pagination
     */
    async getAllStarters({
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

        const { count, rows } = await ProblemStarter.findAndCountAll({
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
            starters: rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / limit),
                totalStarters: count,
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
     * Check if starter exists for problem-language combination
     */
    async starterExists(problemId, languageId) {
        const starter = await ProblemStarter.findOne({
            where: {
                problem_id: problemId,
                language_id: languageId
            }
        });

        return !!starter;
    }

    /**
     * Bulk create starter codes
     */
    async bulkCreateStarters(startersData) {
        const createdStarters = [];
        const errors = [];

        for (const starterData of startersData) {
            try {
                const starter = await this.createStarter(starterData);
                createdStarters.push(starter);
            } catch (error) {
                errors.push({
                    data: starterData,
                    error: error.message
                });
            }
        }

        return {
            created: createdStarters,
            errors,
            summary: {
                total: startersData.length,
                successful: createdStarters.length,
                failed: errors.length
            }
        };
    }

    /**
     * Generate default starter code for a language
     */
    generateDefaultStarter(languageSlug, problemTitle) {
        const templates = {
            javascript: `// ${problemTitle}
function solution() {
    // Your code here
    return null;
}

module.exports = solution;`,

            python: `# ${problemTitle}
def solution():
    # Your code here
    pass`,

            java: `// ${problemTitle}
public class Solution {
    public void solution() {
        // Your code here
    }
}`,

            cpp: `// ${problemTitle}
#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    void solution() {
        // Your code here
    }
};`,

            c: `// ${problemTitle}
#include <stdio.h>
#include <stdlib.h>

void solution() {
    // Your code here
}`,

            go: `// ${problemTitle}
package main

import "fmt"

func solution() {
    // Your code here
}`,

            rust: `// ${problemTitle}
fn solution() {
    // Your code here
}`,

            typescript: `// ${problemTitle}
function solution(): any {
    // Your code here
    return null;
}`
        };

        return templates[languageSlug] || `// ${problemTitle}\n// Starter code for ${languageSlug}\n// Your code here`;
    }

    /**
     * Auto-generate starters for all languages of a problem
     */
    async generateStartersForProblem(problemId, languageIds) {
        const problem = await Problem.findByPk(problemId);
        if (!problem) {
            throw new Error('Problem not found');
        }

        const languages = await Language.findAll({
            where: { id: languageIds }
        });

        const startersData = [];

        for (const language of languages) {
            // Skip if starter already exists
            const exists = await this.starterExists(problemId, language.id);
            if (exists) continue;

            const starterCode = this.generateDefaultStarter(language.slug, problem.title);

            startersData.push({
                problem_id: problemId,
                language_id: language.id,
                starter_code: starterCode,
                version: 'auto-generated'
            });
        }

        return await this.bulkCreateStarters(startersData);
    }

    /**
     * Get starter statistics
     */
    async getStarterStats() {
        const totalStarters = await ProblemStarter.count();

        // Group by language
        const languageStats = await ProblemStarter.findAll({
            include: [
                {
                    model: Language,
                    as: 'language',
                    attributes: ['id', 'name']
                }
            ],
            attributes: ['language_id']
        });

        const languageCounts = languageStats.reduce((acc, starter) => {
            const langName = starter.language.name;
            acc[langName] = (acc[langName] || 0) + 1;
            return acc;
        }, {});

        return {
            totalStarters,
            languageDistribution: languageCounts,
            averageStartersPerProblem: totalStarters / await Problem.count() || 0
        };
    }

    /**
     * Clone starter to another language
     */
    async cloneStarter(starterId, newLanguageId, modifications = {}) {
        const originalStarter = await this.getStarterById(starterId);

        // Check if starter already exists for new language
        const exists = await this.starterExists(originalStarter.problem_id, newLanguageId);
        if (exists) {
            throw new Error('Starter code already exists for this language');
        }

        const newLanguage = await Language.findByPk(newLanguageId);
        if (!newLanguage) {
            throw new Error('Target language not found');
        }

        let newStarterCode = modifications.starter_code;
        if (!newStarterCode) {
            // Auto-generate based on new language if not provided
            newStarterCode = this.generateDefaultStarter(newLanguage.slug, originalStarter.problem.title);
        }

        const newStarterData = {
            problem_id: originalStarter.problem_id,
            language_id: newLanguageId,
            starter_code: newStarterCode,
            version: modifications.version || `cloned-from-${originalStarter.language.slug}`
        };

        return await this.createStarter(newStarterData);
    }

    /**
     * Validate starter code
     */
    validateStarterCode(starterCode, languageId) {
        const errors = [];

        if (!starterCode || starterCode.trim() === '') {
            errors.push('Starter code cannot be empty');
        }

        if (starterCode.length > 10000) { // 10KB limit for starter code
            errors.push('Starter code is too long (max 10KB)');
        }

        // Language-specific validations can be added here
        // e.g., check for basic syntax requirements

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Get missing starters for a problem
     */
    async getMissingStarters(problemId) {
        const problem = await Problem.findByPk(problemId);
        if (!problem) {
            throw new Error('Problem not found');
        }

        const allLanguages = await Language.findAll({
            attributes: ['id', 'name', 'slug'],
            order: [['name', 'ASC']]
        });

        const existingStarters = await ProblemStarter.findAll({
            where: { problem_id: problemId },
            attributes: ['language_id']
        });

        const existingLanguageIds = existingStarters.map(s => s.language_id);
        const missingLanguages = allLanguages.filter(lang => !existingLanguageIds.includes(lang.id));

        return {
            problem: {
                id: problem.id,
                title: problem.title,
                slug: problem.slug
            },
            missingLanguages,
            summary: {
                totalLanguages: allLanguages.length,
                existingStarters: existingLanguageIds.length,
                missingStarters: missingLanguages.length
            }
        };
    }
}

module.exports = new ProblemStarterService();
