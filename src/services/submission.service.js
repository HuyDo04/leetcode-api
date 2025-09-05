const { Submission, User, Problem, Language, TestCase } = require('../models');
const { Op } = require('sequelize');

class SubmissionService {
    /**
     * Tạo và submit code
     */
    async createSubmission(submissionData) {
        try {
            // Validate references exist
            await this.validateReferences(submissionData);

            // Create submission with pending status
            const submission = await Submission.create({
                ...submissionData,
                status: 'pending'
            });

            // Submit to Judge0 for execution
            await this.processSubmission(submission.id);

            return await this.getSubmissionById(submission.id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Lấy submission theo ID
     */
    async getSubmissionById(id, includeDetails = true) {
        const include = [];

        if (includeDetails) {
            include.push(
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username']
                },
                {
                    model: Problem,
                    as: 'problem',
                    attributes: ['id', 'title', 'slug', 'difficulty']
                },
                {
                    model: Language,
                    as: 'language',
                    attributes: ['id', 'name', 'slug', 'judge0_id']
                }
            );
        }

        const submission = await Submission.findByPk(id, { include });

        if (!submission) {
            throw new Error('Submission not found');
        }

        return submission;
    }

    /**
     * Lấy submissions của user
     */
    async getUserSubmissions(userId, {
        page = 1,
        limit = 20,
        problemId = null,
        languageId = null,
        status = null,
        sortBy = 'created_at',
        order = 'DESC'
    } = {}) {
        const offset = (page - 1) * limit;
        const whereCondition = { user_id: userId };

        if (problemId) whereCondition.problem_id = problemId;
        if (languageId) whereCondition.language_id = languageId;
        if (status) whereCondition.status = status;

        const { count, rows } = await Submission.findAndCountAll({
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
            submissions: rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / limit),
                totalSubmissions: count,
                hasNextPage: page < Math.ceil(count / limit),
                hasPrevPage: page > 1
            }
        };
    }

    /**
     * Lấy submissions của problem
     */
    async getProblemSubmissions(problemId, {
        page = 1,
        limit = 20,
        status = null,
        userId = null
    } = {}) {
        const offset = (page - 1) * limit;
        const whereCondition = { problem_id: problemId };

        if (status) whereCondition.status = status;
        if (userId) whereCondition.user_id = userId;

        const { count, rows } = await Submission.findAndCountAll({
            where: whereCondition,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username']
                },
                {
                    model: Language,
                    as: 'language',
                    attributes: ['id', 'name', 'slug']
                }
            ],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        return {
            submissions: rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / limit),
                totalSubmissions: count,
                hasNextPage: page < Math.ceil(count / limit),
                hasPrevPage: page > 1
            }
        };
    }

    /**
     * Process submission với hệ thống run code hiện tại
     */
    async processSubmission(submissionId) {
        try {
            const submission = await this.getSubmissionById(submissionId);

            // Update status to running
            await submission.update({ status: 'running' });

            // Get test cases for the problem
            const testCases = await TestCase.findAll({
                where: {
                    problem_id: submission.problem_id,
                    is_public: true
                }
            });

            if (testCases.length === 0) {
                await submission.update({
                    status: 'compile_error',
                    output: 'No test cases found for this problem'
                });
                return;
            }

            // Use our existing code execution system
            const results = await this.runCodeAgainstTestCases(submission.source_code, testCases);

            // Update submission with results
            await this.updateSubmissionResult(submissionId, results, testCases);

        } catch (error) {
            // Update submission with error
            await Submission.findByPk(submissionId).then(submission => {
                if (submission) {
                    submission.update({
                        status: 'runtime_error',
                        output: error.message
                    });
                }
            });
            throw error;
        }
    }

    /**
     * Run code against test cases using our execution system
     */
    async runCodeAgainstTestCases(sourceCode, testCases) {
        const results = [];
        let allPassed = true;
        let totalExecutionTime = 0;

        for (const testCase of testCases) {
            try {
                const result = await this.executeJavaScriptCode(sourceCode, testCase);
                results.push({
                    testCase: testCase.id,
                    input: testCase.input,
                    expected: testCase.expected_output,
                    output: result.output,
                    passed: result.passed,
                    error: result.error,
                    executionTime: result.executionTime || 0
                });

                if (!result.passed) {
                    allPassed = false;
                }

                totalExecutionTime += result.executionTime || 0;
            } catch (error) {
                results.push({
                    testCase: testCase.id,
                    input: testCase.input,
                    expected: testCase.expected_output,
                    output: 'Runtime Error',
                    passed: false,
                    error: error.message,
                    executionTime: 0
                });
                allPassed = false;
            }
        }

        return {
            results,
            allPassed,
            totalExecutionTime,
            summary: {
                total: results.length,
                passed: results.filter(r => r.passed).length,
                failed: results.filter(r => !r.passed).length,
                allPassed
            }
        };
    }

    /**
     * Execute JavaScript code (copied from problem controller)
     */
    async executeJavaScriptCode(userCode, testCase) {
        const startTime = Date.now();

        try {
            // Check if test case input contains complete test setup (like First Bad Version)
            if (testCase.input.includes('const isBadVersion') || testCase.input.includes('const firstBadVersion')) {
                // This is a complete test case that needs to be executed as-is
                const executionCode = `
                    ${userCode}
                    
                    // Execute the complete test case
                    (async () => {
                        ${testCase.input}
                    })();
                `;

                const result = await eval(executionCode);
                const resultStr = JSON.stringify(result);

                // Compare with expected output
                const expected = testCase.expected_output.trim();
                const passed = this.compareOutputs(resultStr, expected);

                return {
                    output: resultStr,
                    passed: passed,
                    error: null,
                    executionTime: Date.now() - startTime
                };
            }

            // Original logic for simple function calls
            let functionName, params;

            // Check if input is already a function call format
            const functionCallMatch = testCase.input.match(/(\w+)\((.*)\)/);
            if (functionCallMatch) {
                // Input is already in function call format
                functionName = functionCallMatch[1];
                params = functionCallMatch[2];
            } else {
                // Input is raw parameters, need to determine function name from user code
                // Try to extract function name from user code
                const functionNameMatch = userCode.match(/(?:function\s+(\w+)|const\s+(\w+)\s*=\s*(?:async\s+)?\(|let\s+(\w+)\s*=\s*(?:async\s+)?\(|var\s+(\w+)\s*=\s*(?:async\s+)?\(|(\w+)\s*=\s*(?:async\s+)?\()/);

                if (!functionNameMatch) {
                    // If no function found, try to find the last function declaration
                    const lastFunctionMatch = userCode.match(/(?:function\s+(\w+)|const\s+(\w+)\s*=\s*(?:async\s+)?\(|let\s+(\w+)\s*=\s*(?:async\s+)?\(|var\s+(\w+)\s*=\s*(?:async\s+)?\(|(\w+)\s*=\s*(?:async\s+)?\()/g);
                    if (lastFunctionMatch && lastFunctionMatch.length > 0) {
                        const lastMatch = lastFunctionMatch[lastFunctionMatch.length - 1];
                        const extractedMatch = lastMatch.match(/(?:function\s+(\w+)|const\s+(\w+)\s*=\s*(?:async\s+)?\(|let\s+(\w+)\s*=\s*(?:async\s+)?\(|var\s+(\w+)\s*=\s*(?:async\s+)?\(|(\w+)\s*=\s*(?:async\s+)?\()/);
                        if (extractedMatch) {
                            functionName = extractedMatch[1] || extractedMatch[2] || extractedMatch[3] || extractedMatch[4] || extractedMatch[5];
                        }
                    }
                } else {
                    functionName = functionNameMatch[1] || functionNameMatch[2] || functionNameMatch[3] || functionNameMatch[4] || functionNameMatch[5];
                }

                if (!functionName) {
                    throw new Error('Could not determine function name from code');
                }

                params = testCase.input;
            }

            // Create execution context with async support
            const executionCode = `
                ${userCode}
                
                // Execute the function and handle async
                (async () => {
                    const result = await ${functionName}(${params});
                    return result;
                })();
            `;

            // Execute in a controlled environment
            const result = await eval(executionCode);
            const resultStr = JSON.stringify(result);

            // Compare with expected output
            const expected = testCase.expected_output.trim();
            const passed = this.compareOutputs(resultStr, expected);

            return {
                output: resultStr,
                passed: passed,
                error: null,
                executionTime: Date.now() - startTime
            };
        } catch (error) {
            return {
                output: 'Runtime Error',
                passed: false,
                error: error.message,
                executionTime: Date.now() - startTime
            };
        }
    }

    /**
     * Compare actual result with expected output
     */
    compareOutputs(actual, expected) {
        try {
            const actualStr = actual; // actual is already a JSON string
            const expectedStr = expected.trim();

            // Direct comparison
            if (actualStr === expectedStr) {
                return true;
            }

            // Try parsing both as JSON for deep comparison
            try {
                const actualObj = JSON.parse(actualStr);
                const expectedObj = JSON.parse(expectedStr);
                return JSON.stringify(actualObj) === JSON.stringify(expectedObj);
            } catch {
                // Compare as strings without quotes
                const actualClean = actualStr.replace(/"/g, '');
                const expectedClean = expectedStr.replace(/"/g, '');
                return actualClean === expectedClean;
            }
        } catch (err) {
            return false;
        }
    }

    /**
     * Update submission result từ our execution system
     */
    async updateSubmissionResult(submissionId, executionResults, testCases) {
        const submission = await Submission.findByPk(submissionId);
        if (!submission) return;

        const { results, allPassed, totalExecutionTime, summary } = executionResults;

        let status = allPassed ? 'accepted' : 'wrong_answer';
        let output = `Test Results: ${summary.passed}/${summary.total} passed\n\n`;

        // Add detailed results
        results.forEach((result, index) => {
            output += `Test Case ${index + 1}: ${result.passed ? 'PASSED' : 'FAILED'}\n`;
            output += `Input: ${result.input}\n`;
            output += `Expected: ${result.expected}\n`;
            output += `Output: ${result.output}\n`;
            if (result.error) {
                output += `Error: ${result.error}\n`;
            }
            output += '\n';
        });

        await submission.update({
            status,
            output,
            execution_time: totalExecutionTime,
            memory_used: null // We don't track memory in our simple execution
        });
    }

    /**
     * Rerun submission
     */
    async rerunSubmission(submissionId) {
        const submission = await Submission.findByPk(submissionId);
        if (!submission) {
            throw new Error('Submission not found');
        }

        // Reset status và reprocess
        await submission.update({
            status: 'pending',
            output: null,
            execution_time: null,
            memory_used: null
        });

        await this.processSubmission(submissionId);
        return await this.getSubmissionById(submissionId);
    }

    /**
     * Delete submission
     */
    async deleteSubmission(id, userId = null) {
        const whereCondition = { id };
        if (userId) whereCondition.user_id = userId; // User can only delete their own

        const submission = await Submission.findOne({ where: whereCondition });
        if (!submission) {
            throw new Error('Submission not found or access denied');
        }

        await submission.destroy();
        return { message: 'Submission deleted successfully' };
    }

    /**
     * Get submission statistics
     */
    async getSubmissionStats({
        userId = null,
        problemId = null,
        languageId = null,
        dateRange = null
    } = {}) {
        const whereCondition = {};
        if (userId) whereCondition.user_id = userId;
        if (problemId) whereCondition.problem_id = problemId;
        if (languageId) whereCondition.language_id = languageId;

        if (dateRange) {
            whereCondition.created_at = {
                [Op.between]: [dateRange.start, dateRange.end]
            };
        }

        const submissions = await Submission.findAll({
            where: whereCondition,
            attributes: ['status', 'execution_time', 'memory_used', 'created_at']
        });

        const total = submissions.length;
        const statusCounts = submissions.reduce((acc, sub) => {
            acc[sub.status] = (acc[sub.status] || 0) + 1;
            return acc;
        }, {});

        const acceptedSubmissions = submissions.filter(s => s.status === 'accepted');
        const avgExecutionTime = acceptedSubmissions.length > 0
            ? acceptedSubmissions.reduce((sum, s) => sum + (s.execution_time || 0), 0) / acceptedSubmissions.length
            : 0;

        const avgMemoryUsed = acceptedSubmissions.length > 0
            ? acceptedSubmissions.reduce((sum, s) => sum + (s.memory_used || 0), 0) / acceptedSubmissions.length
            : 0;

        return {
            total,
            statusCounts,
            acceptanceRate: total > 0 ? ((statusCounts.accepted || 0) / total * 100).toFixed(2) : 0,
            averageExecutionTime: avgExecutionTime.toFixed(3),
            averageMemoryUsed: Math.round(avgMemoryUsed)
        };
    }

    /**
     * Get recent submissions
     */
    async getRecentSubmissions(limit = 10, includeDetails = true) {
        const include = includeDetails ? [
            {
                model: User,
                as: 'user',
                attributes: ['id', 'username']
            },
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
        ] : [];

        return await Submission.findAll({
            include,
            order: [['created_at', 'DESC']],
            limit
        });
    }

    /**
     * Validate references before creating submission
     */
    async validateReferences({ user_id, problem_id, language_id }) {
        const user = await User.findByPk(user_id);
        if (!user) throw new Error('User not found');

        const problem = await Problem.findByPk(problem_id);
        if (!problem) throw new Error('Problem not found');

        const language = await Language.findByPk(language_id);
        if (!language) throw new Error('Language not found');

        return { user, problem, language };
    }

    /**
     * Get user's best submission for a problem
     */
    async getUserBestSubmission(userId, problemId) {
        const acceptedSubmission = await Submission.findOne({
            where: {
                user_id: userId,
                problem_id: problemId,
                status: 'accepted'
            },
            order: [['execution_time', 'ASC'], ['memory_used', 'ASC']],
            include: [
                { model: Language, as: 'language', attributes: ['id', 'name', 'slug'] }
            ]
        });

        if (acceptedSubmission) return acceptedSubmission;

        // If no accepted submission, return latest one
        return await Submission.findOne({
            where: {
                user_id: userId,
                problem_id: problemId
            },
            order: [['created_at', 'DESC']],
            include: [
                { model: Language, as: 'language', attributes: ['id', 'name', 'slug'] }
            ]
        });
    }
}

module.exports = new SubmissionService();
