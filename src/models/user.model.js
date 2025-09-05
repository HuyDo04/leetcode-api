"use strict";

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING(50),
                unique: true,
                allowNull: false,
                validate: {
                    len: [3, 50],
                    isAlphanumeric: true,
                },
            },
            email: {
                type: DataTypes.STRING(100),
                unique: true,
                allowNull: false,
                validate: {
                    isEmail: true,
                    len: [5, 100],
                },
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    len: [6, 255],
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
            tableName: "users",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            underscored: true,
            indexes: [
                {
                    unique: true,
                    fields: ["username"],
                },
                {
                    unique: true,
                    fields: ["email"],
                },
            ],
        }
    );

    User.associate = function (models) {
        // User has many Submissions
        User.hasMany(models.Submission, {
            foreignKey: "user_id",
            as: "submissions",
            onDelete: "CASCADE",
        });
    };

    return User;
};
