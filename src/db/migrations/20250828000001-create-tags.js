"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("tags", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING(100),
                unique: true,
                allowNull: false
            },
            slug: {
                type: Sequelize.STRING(100),
                unique: true,
                allowNull: false
            },
            count: {
                type: Sequelize.INTEGER,
                defaultValue: 0
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
    },

    async down(queryInterface) {
        await queryInterface.dropTable("tags");
    },
};
