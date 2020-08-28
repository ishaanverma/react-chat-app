const { DataTypes } = require('sequelize');

const UserDefine = (sequelize) => {
  sequelize.define('User', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
      unqiue: true,
      validate: {
        is: /^\w{3,}$/
      }
    }
  });
}

module.exports = UserDefine;
