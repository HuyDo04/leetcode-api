"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("categories", {
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
            icon: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            text: {
                type: Sequelize.STRING(10),
                allowNull: true
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
        await queryInterface.dropTable("categories");
    },
};
