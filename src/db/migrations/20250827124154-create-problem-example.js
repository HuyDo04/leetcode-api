"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("examples", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      problem_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "problems",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      input: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      output: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      explanation: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("examples");
  },
};
