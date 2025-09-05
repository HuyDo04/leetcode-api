"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("problem_tags", {
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
            tag_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'tags',
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

        // Add unique constraint to prevent duplicate problem-tag combinations
        await queryInterface.addConstraint('problem_tags', {
            fields: ['problem_id', 'tag_id'],
            type: 'unique',
            name: 'unique_problem_tag'
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("problem_tags");
    },
};
