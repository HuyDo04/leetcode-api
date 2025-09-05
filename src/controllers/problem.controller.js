const problemService = require('../services/problem.service');

class ProblemController {
    /**
     * Tạo problem mới
     */
    async createProblem(req, res, next) {
        try {
            const problemData = {
                title: req.body.title,
                description: req.body.description,
                difficulty: req.body.difficulty,
                slug: req.body.slug
            };

            const problem = await problemService.createProblem(problemData);

            res.status(201).json({
                success: true,
                message: 'Problem created successfully',
                data: { problem },
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
     * Lấy tất cả problems với filters
     */
    async getProblems(req, res, next) {
        try {
            const options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20,
                difficulty: req.query.difficulty,
                search: req.query.search || '',
                sortBy: req.query.sort_by || 'created_at',
                order: req.query.order || 'DESC',
                userId: req.query.user_id ? parseInt(req.query.user_id) : null,
                categoryId: req.query.category_id ? parseInt(req.query.category_id) : null,
                tagId: req.query.tag_id ? parseInt(req.query.tag_id) : null
            };

            const result = await problemService.getProblems(options);

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
     * Lấy problem theo ID
     */
    async getProblemById(req, res, next) {
        try {
            const { id } = req.params;
            const includeOptions = {
                includeTestCases: req.query.include_test_cases === 'true',
                includeSubmissions: req.query.include_submissions === 'true',
                includeSolutions: req.query.include_solutions === 'true',
                includeStarters: req.query.include_starters === 'true',
                includeHints: req.query.include_hints === 'true',
                includeExamples: req.query.include_examples === 'true',
                userId: req.query.user_id ? parseInt(req.query.user_id) : null
            };

            const problem = await problemService.getProblemById(id, includeOptions);

            res.json({
                success: true,
                data: { problem },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'Problem not found'
                });
            }
            next(error);
        }
    }

    /**
     * Lấy problem theo slug
     */
    async getProblemBySlug(req, res, next) {
        try {
            const { slug } = req.params;
            const includeOptions = {
                includeTestCases: req.query.include_test_cases === 'true',
                includeHints: req.query.include_hints === 'true',
                includeStarters: req.query.include_starters === 'true',
                userId: req.query.user_id ? parseInt(req.query.user_id) : null
            };

            const problem = await problemService.getProblemBySlug(slug, includeOptions);

            res.json({
                success: true,
                data: { problem },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'Problem not found'
                });
            }
            next(error);
        }
    }

    /**
     * Update problem
     */
    async updateProblem(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = {
                title: req.body.title,
                description: req.body.description,
                difficulty: req.body.difficulty,
                slug: req.body.slug
            };

            // Remove undefined fields
            Object.keys(updateData).forEach(key => {
                if (updateData[key] === undefined) {
                    delete updateData[key];
                }
            });

            const problem = await problemService.updateProblem(id, updateData);

            res.json({
                success: true,
                message: 'Problem updated successfully',
                data: { problem },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'Problem not found'
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
     * Delete problem
     */
    async deleteProblem(req, res, next) {
        try {
            const { id } = req.params;
            const result = await problemService.deleteProblem(id);

            res.json({
                success: true,
                message: result.message,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'Problem not found'
                });
            }
            next(error);
        }
    }

    /**
     * Lấy problem statistics
     */
    async getProblemStats(req, res, next) {
        try {
            const { id } = req.params;
            const stats = await problemService.getProblemStats(id);

            res.json({
                success: true,
                data: stats,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'Problem not found'
                });
            }
            next(error);
        }
    }

    /**
     * Lấy problems theo difficulty
     */
    async getProblemsByDifficulty(req, res, next) {
        try {
            const { difficulty } = req.params;
            const problems = await problemService.getProblemsByDifficulty(difficulty);

            res.json({
                success: true,
                data: { problems },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('Invalid difficulty')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            next(error);
        }
    }

    /**
     * Search problems
     */
    async searchProblems(req, res, next) {
        try {
            const { query } = req.query;
            const limit = parseInt(req.query.limit) || 10;

            if (!query) {
                return res.status(400).json({
                    success: false,
                    message: 'Search query is required'
                });
            }

            const problems = await problemService.searchProblems(query, limit);

            res.json({
                success: true,
                data: {
                    problems,
                    query,
                    total: problems.length
                },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy trending problems
     */
    async getTrendingProblems(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const days = parseInt(req.query.days) || 7;

            const problems = await problemService.getTrendingProblems(limit, days);

            res.json({
                success: true,
                data: {
                    problems,
                    criteria: { limit, days }
                },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Run code against test cases
     */
    async runCode(req, res, next) {
        console.log("runCode");

        try {
            const { id } = req.params;
            console.log("id", id);

            const { code, language_id = 1 } = req.body;
            console.log("code", code);
            console.log("language_id", language_id);

            if (!code || !code.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Code is required'
                });
            }

            // Get test cases for the problem
            const testCases = await problemService.getTestCasesByProblemId(id, { publicOnly: true });

            if (!testCases || testCases.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No test cases found for this problem'
                });
            }

            // Execute code against each test case
            const results = [];

            for (const testCase of testCases) {
                try {
                    const result = await executeJavaScriptCode(code, testCase);
                    results.push({
                        testCase: testCase.id,
                        input: testCase.input,
                        expected: testCase.expected_output,
                        output: result.output,
                        passed: result.passed,
                        error: result.error
                    });
                } catch (error) {
                    results.push({
                        testCase: testCase.id,
                        input: testCase.input,
                        expected: testCase.expected_output,
                        output: 'Runtime Error',
                        passed: false,
                        error: error.message
                    });
                }
            }

            const allPassed = results.every(r => r.passed);

            res.json({
                success: true,
                data: {
                    results,
                    summary: {
                        total: results.length,
                        passed: results.filter(r => r.passed).length,
                        failed: results.filter(r => !r.passed).length,
                        allPassed
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Run code against test cases by slug
     */
    async runCodeBySlug(req, res, next) {
        try {
            const { slug } = req.params;
            const { code, language_id = 1 } = req.body;

            if (!code || !code.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Code is required'
                });
            }

            // Get problem by slug first to get the ID
            const problem = await problemService.getProblemBySlug(slug);
            if (!problem) {
                return res.status(404).json({
                    success: false,
                    message: 'Problem not found'
                });
            }

            // Get test cases for the problem
            const testCases = await problemService.getTestCasesByProblemId(problem.id, { publicOnly: true });

            if (!testCases || testCases.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No test cases found for this problem'
                });
            }

            // Execute code against each test case
            const results = [];

            for (const testCase of testCases) {
                try {
                    const result = await executeJavaScriptCode(code, testCase);
                    results.push({
                        testCase: testCase.id,
                        input: testCase.input,
                        expected: testCase.expected_output,
                        output: result.output,
                        passed: result.passed,
                        error: result.error
                    });
                } catch (error) {
                    results.push({
                        testCase: testCase.id,
                        input: testCase.input,
                        expected: testCase.expected_output,
                        output: 'Runtime Error',
                        passed: false,
                        error: error.message
                    });
                }
            }

            const allPassed = results.every(r => r.passed);

            res.json({
                success: true,
                data: {
                    results,
                    summary: {
                        total: results.length,
                        passed: results.filter(r => r.passed).length,
                        failed: results.filter(r => !r.passed).length,
                        allPassed
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }


}

/**
 * Execute JavaScript code (simple sandbox)
 */
async function executeJavaScriptCode(userCode, testCase) {
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
            const passed = compareOutputs(resultStr, expected);

            return {
                output: resultStr,
                passed: passed,
                error: null
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
        const passed = compareOutputs(resultStr, expected);

        return {
            output: resultStr,
            passed: passed,
            error: null
        };
    } catch (error) {
        return {
            output: 'Runtime Error',
            passed: false,
            error: error.message
        };
    }
}

/**
 * Compare actual result with expected output
 */
function compareOutputs(actual, expected) {
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

module.exports = new ProblemController();
