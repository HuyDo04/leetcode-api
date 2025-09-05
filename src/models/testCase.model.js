"use strict";

module.exports = (sequelize, DataTypes) => {
    const TestCase = sequelize.define(
        "TestCase",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            problem_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "problems",
                    key: "id",
                },
                validate: {
                    isInt: true,
                },
            },
            input: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            expected_output: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            is_public: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: "test_cases",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            underscored: true,
            indexes: [
                {
                    fields: ["problem_id"],
                },
                {
                    fields: ["is_public"],
                },
            ],
        }
    );

    TestCase.associate = function (models) {
        // TestCase belongs to Problem
        TestCase.belongsTo(models.Problem, {
            foreignKey: "problem_id",
            as: "problem",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    };

    return TestCase;
};
