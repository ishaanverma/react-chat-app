const { DataTypes } = require('sequelize');

const ChatDefine = (sequelize) => {
  sequelize.define('Chat', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    public: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  });
}

module.exports = ChatDefine;
