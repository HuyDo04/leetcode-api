"use strict";

module.exports = (sequelize, DataTypes) => {
    const ProblemSolution = sequelize.define(
        "ProblemSolution",
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
            solution_code: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            explanation: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            time_complexity: {
                type: DataTypes.STRING(50),
                allowNull: true,
                validate: {
                    len: [1, 50],
                },
            },
            space_complexity: {
                type: DataTypes.STRING(50),
                allowNull: true,
                validate: {
                    len: [1, 50],
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
            tableName: "problem_solutions",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            underscored: true,
            indexes: [
                {
                    fields: ["problem_id"],
                },
                {
                    fields: ["language_id"],
                },
                {
                    fields: ["problem_id", "language_id"],
                },
            ],
        }
    );

    ProblemSolution.associate = function (models) {
        // ProblemSolution belongs to Problem
        ProblemSolution.belongsTo(models.Problem, {
            foreignKey: "problem_id",
            as: "problem",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });

        // ProblemSolution belongs to Language
        ProblemSolution.belongsTo(models.Language, {
            foreignKey: "language_id",
            as: "language",
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        });
    };

    return ProblemSolution;
};
