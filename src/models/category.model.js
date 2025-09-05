'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Category.belongsToMany(models.Problem, {
                through: 'problem_categories',
                foreignKey: 'category_id',
                otherKey: 'problem_id',
                as: 'problems'
            });
        }
    }
    Category.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        icon: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Category',
        tableName: 'categories',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
    return Category;
};
