"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("submissions", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
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
      source_code: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'running', 'accepted', 'wrong_answer', 'time_limit_exceeded', 'memory_limit_exceeded', 'runtime_error', 'compile_error'),
        allowNull: false,
        defaultValue: 'pending'
      },
      output: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      execution_time: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      memory_used: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("submissions");
  },
};
