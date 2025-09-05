"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("problem_solutions", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      problem_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "problems",
          key: "id"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      language_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "languages",
          key: "id"
        },
        onDelete: "RESTRICT",
        onUpdate: "CASCADE"
      },
      solution_code: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      explanation: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      time_complexity: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      space_complexity: {
        type: Sequelize.STRING(50),
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
    await queryInterface.dropTable("problem_solutions");
  },
};
