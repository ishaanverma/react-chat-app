const { Sequelize } = require('sequelize');
const { applyRelations } = require('./setup');

const sequelize = new Sequelize({
  dialect: 'postgres',
  database: process.env.POSTGRES_DB || 'postgresdb-chat',
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  port: process.env.POSTGRES_PORT || 5432,
});

const modelDefiners = [
  require('./User'),
  require('./Message'),
  require('./Chat')
]

// define all models according to their files
for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

applyRelations(sequelize);

// export sequelize
module.exports = sequelize;