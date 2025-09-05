"use strict";

module.exports = (sequelize, DataTypes) => {
    const Example = sequelize.define(
        "Example",
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
            output: {
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
            tableName: "examples",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            underscored: true,
            indexes: [
                {
                    fields: ["problem_id"],
                },
            ],
        }
    );

    Example.associate = function (models) {
        // Example belongs to Problem
        Example.belongsTo(models.Problem, {
            foreignKey: "problem_id",
            as: "problem",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    };

    return Example;
};
