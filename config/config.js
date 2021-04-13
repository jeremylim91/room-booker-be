module.exports = {
  // development: {
  //   username: process.env.USER,
  //   password: null,
  //   database: 'room_booker_development',
  //   host: '127.0.0.1',
  //   dialect: 'postgres',
  // },

  development: {
    username: process.env.DB_USER || 'jeremylim',
    password: process.env.DB_PASSWORD|| null,
    database: process.env.DB_NAME || 'room_booker_development',
    host: process.env.DB_HOST||'localhost',
    dialect: 'postgres',
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: { // https://github.com/sequelize/sequelize/issues/12083
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
