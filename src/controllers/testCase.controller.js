const testCaseService = require('../services/testCase.service');

class TestCaseController {
    /**
     * Tạo test case mới
     */
    async createTestCase(req, res, next) {
        try {
            const testCaseData = {
                problem_id: req.body.problem_id,
                input: req.body.input,
                expected_output: req.body.expected_output,
                is_public: req.body.is_public !== undefined ? req.body.is_public : true
            };

            // Validate required fields
            const requiredFields = ['problem_id', 'input', 'expected_output'];
            const missingFields = requiredFields.filter(field => !testCaseData[field]);

            if (missingFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Missing required fields: ${missingFields.join(', ')}`
                });
            }

            // Validate test case content
            const validation = testCaseService.validateTestCase(testCaseData.input, testCaseData.expected_output);
            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: validation.errors
                });
            }

            const testCase = await testCaseService.createTestCase(testCaseData);

            res.status(201).json({
                success: true,
                message: 'Test case created successfully',
                data: { testCase },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            next(error);
        }
    }

    /**
     * Lấy test case theo ID
     */
    async getTestCaseById(req, res, next) {
        try {
            const { id } = req.params;
            const testCase = await testCaseService.getTestCaseById(id);

            res.json({
                success: true,
                data: { testCase },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'Test case not found'
                });
            }
            next(error);
        }
    }

    /**
     * Lấy test cases của problem (public only cho user)
     */
    async getPublicTestCases(req, res, next) {
        try {
            const { problemId } = req.params;
            const testCases = await testCaseService.getPublicTestCases(problemId);

            res.json({
                success: true,
                data: {
                    testCases,
                    total: testCases.length
                },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy tất cả test cases của problem (admin only)
     */
    async getAllTestCases(req, res, next) {
        try {
            const { problemId } = req.params;
            const testCases = await testCaseService.getAllTestCases(problemId);

            res.json({
                success: true,
                data: {
                    testCases,
                    total: testCases.length
                },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update test case
     */
    async updateTestCase(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = {
                input: req.body.input,
                expected_output: req.body.expected_output,
                is_public: req.body.is_public
            };

            // Remove undefined fields
            Object.keys(updateData).forEach(key => {
                if (updateData[key] === undefined) {
                    delete updateData[key];
                }
            });

            // Validate if input/output are being updated
            if (updateData.input || updateData.expected_output) {
                const currentTestCase = await testCaseService.getTestCaseById(id);
                const input = updateData.input || currentTestCase.input;
                const expectedOutput = updateData.expected_output || currentTestCase.expected_output;

                const validation = testCaseService.validateTestCase(input, expectedOutput);
                if (!validation.isValid) {
                    return res.status(400).json({
                        success: false,
                        message: 'Validation failed',
                        errors: validation.errors
                    });
                }
            }

            const testCase = await testCaseService.updateTestCase(id, updateData);

            res.json({
                success: true,
                message: 'Test case updated successfully',
                data: { testCase },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'Test case not found'
                });
            }
            next(error);
        }
    }

    /**
     * Delete test case
     */
    async deleteTestCase(req, res, next) {
        try {
            const { id } = req.params;
            const result = await testCaseService.deleteTestCase(id);

            res.json({
                success: true,
                message: result.message,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'Test case not found'
                });
            }
            next(error);
        }
    }

    /**
     * Bulk create test cases
     */
    async bulkCreateTestCases(req, res, next) {
        try {
            const { problemId } = req.params;
            const { testCases } = req.body;

            if (!testCases || !Array.isArray(testCases)) {
                return res.status(400).json({
                    success: false,
                    message: 'Test cases array is required'
                });
            }

            const createdTestCases = await testCaseService.bulkCreateTestCases(problemId, testCases);

            res.status(201).json({
                success: true,
                message: 'Test cases created successfully',
                data: {
                    testCases: createdTestCases,
                    total: createdTestCases.length
                },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            next(error);
        }
    }

    /**
     * Toggle test case visibility
     */
    async toggleVisibility(req, res, next) {
        try {
            const { id } = req.params;
            const testCase = await testCaseService.toggleTestCaseVisibility(id);

            res.json({
                success: true,
                message: `Test case visibility changed to ${testCase.is_public ? 'public' : 'private'}`,
                data: { testCase },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: 'Test case not found'
                });
            }
            next(error);
        }
    }

    /**
     * Lấy test case statistics
     */
    async getTestCaseStats(req, res, next) {
        try {
            const { problemId } = req.params;
            const stats = await testCaseService.getTestCaseStats(problemId);

            res.json({
                success: true,
                data: stats,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Export test cases
     */
    async exportTestCases(req, res, next) {
        try {
            const { problemId } = req.params;
            const exportData = await testCaseService.exportTestCases(problemId);

            res.json({
                success: true,
                data: exportData,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            next(error);
        }
    }

    /**
     * Import test cases
     */
    async importTestCases(req, res, next) {
        try {
            const { problemId } = req.params;
            const importData = req.body;

            const result = await testCaseService.importTestCases(problemId, importData);

            res.json({
                success: true,
                message: 'Test cases imported successfully',
                data: result,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            if (error.message.includes('Invalid import data')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            next(error);
        }
    }
}

module.exports = new TestCaseController();
