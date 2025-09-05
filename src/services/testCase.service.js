const { TestCase, Problem } = require('../models');

class TestCaseService {
    /**
     * Tạo test case mới
     */
    async createTestCase(testCaseData) {
        try {
            // Validate problem exists
            const problem = await Problem.findByPk(testCaseData.problem_id);
            if (!problem) {
                throw new Error('Problem not found');
            }

            const testCase = await TestCase.create(testCaseData);
            return testCase;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Lấy test case theo ID
     */
    async getTestCaseById(id) {
        const testCase = await TestCase.findByPk(id, {
            include: [
                {
                    model: Problem,
                    as: 'problem',
                    attributes: ['id', 'title', 'slug']
                }
            ]
        });

        if (!testCase) {
            throw new Error('Test case not found');
        }

        return testCase;
    }

    /**
     * Lấy tất cả test cases của một problem
     */
    async getTestCasesByProblem(problemId, includePrivate = false) {
        const whereCondition = { problem_id: problemId };

        if (!includePrivate) {
            whereCondition.is_public = true;
        }

        const testCases = await TestCase.findAll({
            where: whereCondition,
            order: [['id', 'ASC']]
        });

        return testCases;
    }

    /**
     * Lấy public test cases cho user
     */
    async getPublicTestCases(problemId) {
        return await this.getTestCasesByProblem(problemId, false);
    }

    /**
     * Lấy tất cả test cases (admin only)
     */
    async getAllTestCases(problemId) {
        return await this.getTestCasesByProblem(problemId, true);
    }

    /**
     * Update test case
     */
    async updateTestCase(id, updateData) {
        const testCase = await TestCase.findByPk(id);
        if (!testCase) {
            throw new Error('Test case not found');
        }

        await testCase.update(updateData);
        return testCase;
    }

    /**
     * Delete test case
     */
    async deleteTestCase(id) {
        const testCase = await TestCase.findByPk(id);
        if (!testCase) {
            throw new Error('Test case not found');
        }

        await testCase.destroy();
        return { message: 'Test case deleted successfully' };
    }

    /**
     * Bulk create test cases cho một problem
     */
    async bulkCreateTestCases(problemId, testCasesData) {
        try {
            // Validate problem exists
            const problem = await Problem.findByPk(problemId);
            if (!problem) {
                throw new Error('Problem not found');
            }

            const testCasesToCreate = testCasesData.map(testCase => ({
                ...testCase,
                problem_id: problemId
            }));

            const createdTestCases = await TestCase.bulkCreate(testCasesToCreate);
            return createdTestCases;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Validate test case input/output
     */
    validateTestCase(input, expectedOutput) {
        const errors = [];

        if (!input || input.trim() === '') {
            errors.push('Input cannot be empty');
        }

        if (!expectedOutput || expectedOutput.trim() === '') {
            errors.push('Expected output cannot be empty');
        }

        // Additional validation rules can be added here
        // e.g., check for valid JSON format if needed

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Toggle test case visibility
     */
    async toggleTestCaseVisibility(id) {
        const testCase = await TestCase.findByPk(id);
        if (!testCase) {
            throw new Error('Test case not found');
        }

        await testCase.update({ is_public: !testCase.is_public });
        return testCase;
    }

    /**
     * Get test case statistics for a problem
     */
    async getTestCaseStats(problemId) {
        const allTestCases = await TestCase.findAll({
            where: { problem_id: problemId }
        });

        const publicTestCases = allTestCases.filter(tc => tc.is_public);
        const privateTestCases = allTestCases.filter(tc => !tc.is_public);

        return {
            total: allTestCases.length,
            public: publicTestCases.length,
            private: privateTestCases.length,
            testCases: allTestCases.map(tc => ({
                id: tc.id,
                is_public: tc.is_public,
                input_length: tc.input.length,
                output_length: tc.expected_output.length,
                created_at: tc.created_at
            }))
        };
    }

    /**
     * Run test case against code (dry run)
     */
    async runTestCase(testCaseId, sourceCode, languageId) {
        const testCase = await this.getTestCaseById(testCaseId);

        // This would integrate with Judge0 service
        // For now, return mock result
        return {
            testCase: {
                id: testCase.id,
                input: testCase.input,
                expected_output: testCase.expected_output
            },
            result: {
                status: 'pending',
                message: 'Test case execution not implemented yet'
            }
        };
    }

    /**
     * Compare outputs
     */
    compareOutputs(expected, actual) {
        const normalizedExpected = expected.trim().replace(/\r\n/g, '\n');
        const normalizedActual = actual.trim().replace(/\r\n/g, '\n');

        return {
            isMatch: normalizedExpected === normalizedActual,
            expected: normalizedExpected,
            actual: normalizedActual,
            diff: this.generateDiff(normalizedExpected, normalizedActual)
        };
    }

    /**
     * Generate simple diff between expected and actual output
     */
    generateDiff(expected, actual) {
        const expectedLines = expected.split('\n');
        const actualLines = actual.split('\n');
        const maxLines = Math.max(expectedLines.length, actualLines.length);
        const diff = [];

        for (let i = 0; i < maxLines; i++) {
            const expectedLine = expectedLines[i] || '';
            const actualLine = actualLines[i] || '';

            if (expectedLine !== actualLine) {
                diff.push({
                    line: i + 1,
                    expected: expectedLine,
                    actual: actualLine,
                    type: expectedLine === '' ? 'added' : actualLine === '' ? 'removed' : 'modified'
                });
            }
        }

        return diff;
    }

    /**
     * Export test cases for backup
     */
    async exportTestCases(problemId) {
        const problem = await Problem.findByPk(problemId);
        if (!problem) {
            throw new Error('Problem not found');
        }

        const testCases = await this.getAllTestCases(problemId);

        return {
            problem: {
                id: problem.id,
                title: problem.title,
                slug: problem.slug
            },
            testCases: testCases.map(tc => ({
                input: tc.input,
                expected_output: tc.expected_output,
                is_public: tc.is_public
            })),
            exported_at: new Date().toISOString()
        };
    }

    /**
     * Import test cases from backup
     */
    async importTestCases(problemId, importData) {
        try {
            const problem = await Problem.findByPk(problemId);
            if (!problem) {
                throw new Error('Problem not found');
            }

            // Validate import data structure
            if (!importData.testCases || !Array.isArray(importData.testCases)) {
                throw new Error('Invalid import data format');
            }

            // Clear existing test cases if requested
            // await TestCase.destroy({ where: { problem_id: problemId } });

            const testCasesToCreate = importData.testCases.map(tc => ({
                problem_id: problemId,
                input: tc.input,
                expected_output: tc.expected_output,
                is_public: tc.is_public !== undefined ? tc.is_public : true
            }));

            const createdTestCases = await TestCase.bulkCreate(testCasesToCreate);

            return {
                imported: createdTestCases.length,
                testCases: createdTestCases
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new TestCaseService();
