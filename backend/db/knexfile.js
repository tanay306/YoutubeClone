// Update with your config settings.
const {knexSnakeCaseMappers} = require('objection'); 
require('dotenv').config()
const { DB_NAME, DB_USERNAME, DB_PASSWORD} = process.env;

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: DB_NAME,
      user:     DB_USERNAME,
      password: DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './seeds'
    },
    ...knexSnakeCaseMappers
  },

};
