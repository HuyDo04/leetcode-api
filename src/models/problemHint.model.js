"use strict";

module.exports = (sequelize, DataTypes) => {
    const ProblemHint = sequelize.define(
        "ProblemHint",
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
            hint_order: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
                validate: {
                    isInt: true,
                    min: 1,
                },
            },
            title: {
                type: DataTypes.STRING(255),
                allowNull: true,
                validate: {
                    len: [1, 255],
                },
            },
            content: {
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
            tableName: "problem_hints",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            underscored: true,
            indexes: [
                {
                    fields: ["problem_id"],
                },
                {
                    fields: ["hint_order"],
                },
                {
                    fields: ["is_public"],
                },
                {
                    unique: true,
                    fields: ["problem_id", "hint_order"],
                    name: "uniq_problem_hints_problem_order",
                },
            ],
        }
    );

    ProblemHint.associate = function (models) {
        // ProblemHint belongs to Problem
        ProblemHint.belongsTo(models.Problem, {
            foreignKey: "problem_id",
            as: "problem",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    };

    return ProblemHint;
};
