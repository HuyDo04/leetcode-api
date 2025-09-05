"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("problem_hints", {
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
      // Thứ tự hiển thị hint (1,2,3…)
      hint_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      // Nếu bạn muốn cho xem công khai hay ẩn sau khi submit
      is_public: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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

    // Không trùng thứ tự trong cùng 1 problem
    await queryInterface.addConstraint("problem_hints", {
      fields: ["problem_id", "hint_order"],
      type: "unique",
      name: "uniq_problem_hints_problem_order",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("problem_hints");
  },
};
