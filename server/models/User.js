const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const UserDefine = (sequelize) => {
  sequelize.define('User', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unqiue: true,
      validate: {
        isEmail: true
      }
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isAlpha: true
      }
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        is: /^[0-9a-f]{64}$/i
      }
    }
  },  {
    hooks: {
      beforeCreate: async (user, options) => {
        const hashedPassword = await bcrypt.hash(user.password, await bcrypt.genSalt(8));
        user.password = hashedPassword;
      },
    },
  });
}

module.exports = UserDefine;
