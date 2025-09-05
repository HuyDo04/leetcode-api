"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("problem_categories", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            problem_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'problems',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            category_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'categories',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }
        });

        // Add unique constraint to prevent duplicate problem-category combinations
        await queryInterface.addConstraint('problem_categories', {
            fields: ['problem_id', 'category_id'],
            type: 'unique',
            name: 'unique_problem_category'
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("problem_categories");
    },
};
