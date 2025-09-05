'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ProblemCategory extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            ProblemCategory.belongsTo(models.Problem, {
                foreignKey: 'problem_id',
                as: 'problem'
            });
            ProblemCategory.belongsTo(models.Category, {
                foreignKey: 'category_id',
                as: 'category'
            });
        }
    }
    ProblemCategory.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        problem_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'problems',
                key: 'id'
            }
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'categories',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'ProblemCategory',
        tableName: 'problem_categories',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
    return ProblemCategory;
};
