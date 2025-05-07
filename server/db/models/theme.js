'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Theme extends Model {
    static associate(models) {
      Theme.hasMany(models.Card, { foreignKey: 'themeId' });
      Theme.hasMany(models.Result, { foreignKey: 'themeId' });
    }
  }
  Theme.init(
    {
      name: DataTypes.STRING,
      imagePath: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Theme',
    }
  );
  return Theme;
};
