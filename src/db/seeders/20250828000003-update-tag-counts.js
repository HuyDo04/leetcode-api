'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Update tag counts based on problem-tag relationships
        await queryInterface.sequelize.query(`
      UPDATE tags 
      SET count = (
        SELECT COUNT(*) 
        FROM problem_tags 
        WHERE problem_tags.tag_id = tags.id
      )
    `);

        console.log('✅ Tag counts updated successfully!');
    },

    async down(queryInterface, Sequelize) {
        // Reset tag counts to 0
        await queryInterface.sequelize.query(`
      UPDATE tags SET count = 0
    `);

        console.log('✅ Tag counts reset successfully!');
    }
};
