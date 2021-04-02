import { Sequelize } from 'sequelize';
import url from 'url';
import allConfig from '../config/config.js';

// import models
import initUserModel from './user.mjs';
import initRoomModel from './room.mjs';
import initBookingModel from './booking.mjs';

const env = process.env.NODE_ENV || 'development';

const config = allConfig[env];

const db = {};

let sequelize;

if (env === 'production') {
  // break apart the Heroku database url and rebuild the configs we need

  const { DATABASE_URL } = process.env;
  const dbUrl = url.parse(DATABASE_URL);
  const username = dbUrl.auth.substr(0, dbUrl.auth.indexOf(':'));
  const password = dbUrl.auth.substr(dbUrl.auth.indexOf(':') + 1, dbUrl.auth.length);
  const dbName = dbUrl.path.slice(1);

  const host = dbUrl.hostname;
  const { port } = dbUrl;

  config.host = host;
  config.port = port;

  sequelize = new Sequelize(dbName, username, password, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}
// add model defns here
db.User = initUserModel(sequelize, Sequelize.DataTypes);
db.Room = initRoomModel(sequelize, Sequelize.DataTypes);
db.Booking = initBookingModel(sequelize, Sequelize.DataTypes);

// Define associations btw models

// -----define the r/n btw room and booking (one to many) ------
db.Room.hasMany(db.Booking);
db.Booking.belongsTo(db.Room);

// -----define the r/n btw user and booking when user is a booker (i.e. many to one r/s) ------
db.User.hasMany(db.Booking);
db.Booking.belongsTo(db.User, { as: 'booker', foreignKey: 'user_id' });
// -----define the r/n btw user and booking when user is an attendee (i.e. many to many r/s) ------
db.User.belongsToMany(db.Booking, { through: 'user_bookings' });
db.Booking.belongsToMany(db.User, { through: 'user_bookings' });
// -------------------------------------------------------

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
