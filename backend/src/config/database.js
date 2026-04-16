require('dotenv').config();

const { buildMysqlSslOptions } = require('./mysqlSsl');

const mysqlSslOptions = buildMysqlSslOptions();

const buildDbConfig = (database) => {
  const config = {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
  };

  if (mysqlSslOptions) {
    config.dialectOptions = { ssl: mysqlSslOptions };
  }

  return config;
};

const config = {
  development: buildDbConfig(process.env.DB_NAME),
  test: buildDbConfig(`${process.env.DB_NAME}_test`),
  production: buildDbConfig(process.env.DB_NAME),
};

module.exports = config;
