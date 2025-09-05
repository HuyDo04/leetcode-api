'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ProblemTag extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            ProblemTag.belongsTo(models.Problem, {
                foreignKey: 'problem_id',
                as: 'problem'
            });
            ProblemTag.belongsTo(models.Tag, {
                foreignKey: 'tag_id',
                as: 'tag'
            });
        }
    }
    ProblemTag.init({
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
        tag_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tags',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'ProblemTag',
        tableName: 'problem_tags',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
    return ProblemTag;
};
