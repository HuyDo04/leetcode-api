'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Tag extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Tag.belongsToMany(models.Problem, {
                through: 'problem_tags',
                foreignKey: 'tag_id',
                otherKey: 'problem_id',
                as: 'problems'
            });
        }
    }
    Tag.init({
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
        }
    }, {
        sequelize,
        modelName: 'Tag',
        tableName: 'tags',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
    return Tag;
};
