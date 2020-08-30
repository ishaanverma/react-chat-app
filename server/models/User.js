const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const UserDefine = (sequelize) => {
  sequelize.define('User', {
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
        is: /^([a-z]+[\s]?[a-z]+)*$/i
      }
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    }
  },  {
    hooks: {
      beforeCreate: async (user, options) => {
        let hashedPassword;
        try {
          const salt = await bcrypt.genSalt(8);
          hashedPassword = await bcrypt.hash(user.password, salt);
        } catch (error) {
          console.log(error);
        }
        user.password = hashedPassword;
      },
    },
  });
}

module.exports = UserDefine;
