"use strict";

module.exports = (sequelize, DataTypes) => {
    const Language = sequelize.define(
        "Language",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(50),
                allowNull: false,
                validate: {
                    len: [1, 50],
                    notEmpty: true,
                },
            },
            judge0_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: true,
                    min: 1,
                },
            },
            slug: {
                type: DataTypes.STRING(50),
                unique: true,
                allowNull: false,
                validate: {
                    len: [1, 50],
                    isLowercase: true,
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
            tableName: "languages",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            underscored: true,
            indexes: [
                {
                    unique: true,
                    fields: ["slug"],
                },
                {
                    fields: ["judge0_id"],
                },
            ],
        }
    );

    Language.associate = function (models) {
        // Language has many Submissions
        Language.hasMany(models.Submission, {
            foreignKey: "language_id",
            as: "submissions",
        });

        // Language has many ProblemSolutions
        Language.hasMany(models.ProblemSolution, {
            foreignKey: "language_id",
            as: "problemSolutions",
        });

        // Language has many ProblemStarters
        Language.hasMany(models.ProblemStarter, {
            foreignKey: "language_id",
            as: "problemStarters",
        });
    };

    return Language;
};
