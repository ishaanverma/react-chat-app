const applyRelations = (sequelize) => {
  const { User: user, Chat: chat, Message: message } = sequelize.models;

  // one to many (user to message)
  user.hasMany(message);
  message.belongsTo(user);

  // one to many (chat to message)
  chat.hasMany(message);
  message.belongsTo(chat);

  // many to many (user to chat)
  user.belongsToMany(chat, { through: 'UserChats' });
  chat.belongsToMany(user, { through: 'UserChats' });
}

module.exports = { applyRelations };