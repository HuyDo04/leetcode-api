"use strict";

module.exports = (sequelize, DataTypes) => {
    const ProblemStarter = sequelize.define(
        "ProblemStarter",
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
            starter_code: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            version: {
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
            tableName: "problem_starters",
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
                    unique: true,
                    fields: ["problem_id", "language_id"],
                    name: "uniq_problem_starters_problem_language",
                },
            ],
        }
    );

    ProblemStarter.associate = function (models) {
        // ProblemStarter belongs to Problem
        ProblemStarter.belongsTo(models.Problem, {
            foreignKey: "problem_id",
            as: "problem",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });

        // ProblemStarter belongs to Language
        ProblemStarter.belongsTo(models.Language, {
            foreignKey: "language_id",
            as: "language",
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
        });
    };

    return ProblemStarter;
};
