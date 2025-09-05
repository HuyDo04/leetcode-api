'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Create 2 users with proper validation
        await queryInterface.bulkInsert('users', [
            {
                id: 1,
                username: 'admin',
                email: 'admin@leetcode.com',
                password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsXK1K.X6', // password: admin123
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 2,
                username: 'testuser',
                email: 'test@leetcode.com',
                password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsXK1K.X6', // password: admin123
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);

        console.log('✅ User data seeded successfully!');
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('users', null, {});
        console.log('✅ User data removed successfully!');
    }
};
