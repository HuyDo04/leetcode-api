"use strict";

module.exports = (sequelize, DataTypes) => {
    const Submission = sequelize.define(
        "Submission",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                validate: {
                    isInt: true,
                },
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
            language_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "languages",
                    key: "id",
                },
                validate: {
                    isInt: true,
                },
            },
            source_code: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            status: {
                type: DataTypes.ENUM(
                    "pending",
                    "running",
                    "accepted",
                    "wrong_answer",
                    "time_limit_exceeded",
                    "memory_limit_exceeded",
                    "runtime_error",
                    "compile_error"
                ),
                allowNull: false,
                defaultValue: "pending",
                validate: {
                    isIn: [[
                        "pending",
                        "running",
                        "accepted",
                        "wrong_answer",
                        "time_limit_exceeded",
                        "memory_limit_exceeded",
                        "runtime_error",
                        "compile_error"
                    ]],
                },
            },
            output: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            execution_time: {
                type: DataTypes.FLOAT,
                allowNull: true,
                validate: {
                    min: 0,
                },
            },
            memory_used: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    min: 0,
                },
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
            tableName: "submissions",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            underscored: true,
            indexes: [
                {
                    fields: ["user_id"],
                },
                {
                    fields: ["problem_id"],
                },
                {
                    fields: ["language_id"],
                },
                {
                    fields: ["status"],
                },
                {
                    fields: ["created_at"],
                },
                {
                    fields: ["user_id", "problem_id"],
                },
            ],
        }
    );

    Submission.associate = function (models) {
        // Submission belongs to User
        Submission.belongsTo(models.User, {
            foreignKey: "user_id",
            as: "user",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });

        // Submission belongs to Problem
        Submission.belongsTo(models.Problem, {
            foreignKey: "problem_id",
            as: "problem",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });

        // Submission belongs to Language
        Submission.belongsTo(models.Language, {
            foreignKey: "language_id",
            as: "language",
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        });
    };

    return Submission;
};
