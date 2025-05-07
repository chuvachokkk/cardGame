'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Card extends Model {
    static associate(models) {
      Card.belongsTo(models.User, { foreignKey: 'userId' });
      Card.belongsTo(models.Theme, { foreignKey: 'themeId' });
    }
  }
  Card.init(
    {
      english: DataTypes.STRING,
      russian: DataTypes.STRING,
      learned: DataTypes.BOOLEAN,
      imagePath: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Card',
    }
  );
  return Card;
};
