const { DataTypes } = require('sequelize');

const ChatDefine = (sequelize) => {
  sequelize.define('Chat', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
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
