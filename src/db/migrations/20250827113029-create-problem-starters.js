"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("problem_starters", {
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
      // Mã khởi tạo hiển thị trong editor (skeleton)
      starter_code: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      // (tuỳ chọn) phiên bản/syntax (vd: "node18", "py3.11", "gcc13")
      version: {
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

    // Đảm bảo 1 bài + 1 ngôn ngữ chỉ có duy nhất 1 starter
    await queryInterface.addConstraint("problem_starters", {
      fields: ["problem_id", "language_id"],
      type: "unique",
      name: "uniq_problem_starters_problem_language",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("problem_starters");
  },
};
