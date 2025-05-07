'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Result extends Model {
    static associate(models) {
      Result.belongsTo(models.User, { foreignKey: 'userId' });
      Result.belongsTo(models.Theme, { foreignKey: 'themeId' });
    }
  }
  Result.init(
    {
      result: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Result',
    }
  );
  return Result;
};
