"use strict";

module.exports = (sequelize, DataTypes) => {
    const Problem = sequelize.define(
        "Problem",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            slug: {
                type: DataTypes.STRING(100),
                unique: true,
                allowNull: false,
                validate: {
                    len: [1, 100],
                    isLowercase: true,
                },
            },
            title: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    len: [1, 255],
                    notEmpty: true,
                },
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            difficulty: {
                type: DataTypes.ENUM("easy", "medium", "hard"),
                allowNull: false,
                validate: {
                    isIn: [["easy", "medium", "hard"]],
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
            tableName: "problems",
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
                    fields: ["difficulty"],
                },
                {
                    fields: ["created_at"],
                },
            ],
        }
    );

    Problem.associate = function (models) {
        // Problem has many TestCases
        Problem.hasMany(models.TestCase, {
            foreignKey: "problem_id",
            as: "testCases",
            onDelete: "CASCADE",
        });

        // Problem has many Submissions
        Problem.hasMany(models.Submission, {
            foreignKey: "problem_id",
            as: "submissions",
            onDelete: "CASCADE",
        });

        // Problem has many ProblemSolutions
        Problem.hasMany(models.ProblemSolution, {
            foreignKey: "problem_id",
            as: "solutions",
            onDelete: "CASCADE",
        });

        // Problem has many ProblemStarters
        Problem.hasMany(models.ProblemStarter, {
            foreignKey: "problem_id",
            as: "starters",
            onDelete: "CASCADE",
        });

        // Problem has many ProblemHints
        Problem.hasMany(models.ProblemHint, {
            foreignKey: "problem_id",
            as: "hints",
            onDelete: "CASCADE",
        });

        // Problem has many Examples
        Problem.hasMany(models.Example, {
            foreignKey: "problem_id",
            as: "examples",
            onDelete: "CASCADE",
        });

        // Problem belongs to many Tags
        Problem.belongsToMany(models.Tag, {
            through: 'problem_tags',
            foreignKey: 'problem_id',
            otherKey: 'tag_id',
            as: 'tags'
        });

        // Problem belongs to many Categories
        Problem.belongsToMany(models.Category, {
            through: 'problem_categories',
            foreignKey: 'problem_id',
            otherKey: 'category_id',
            as: 'categories'
        });
    };

    return Problem;
};
