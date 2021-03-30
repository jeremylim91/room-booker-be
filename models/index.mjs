import { Sequelize } from 'sequelize';
import url from 'url';
import allConfig from '../config/config.js';

// import models
import initUserModel from './initUserModel.mjs';
import initRoomModel from './initRoomModel.mjs';
import initBookingModel from './initBookingModel.mjs';
import initAttendeeModel from './initAttendeeModel.mjs';

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
db.Attendee = initAttendeeModel(sequelize, Sequelize.DataTypes);

// Define associations btw models

// -----define the r/n btw user and booking when user is a booker (i.e. many to one r/s) ------
db.User.hasMany(db.Booking);
db.Booking.belongsTo(db.User, { as: 'booker' });
// -----define the r/n btw user and booking when user is an attendee (i.e. many to many r/s) ------
db.User.belongsToMany(db.Booking, { as: 'meetings' });
db.Booking.belongsToMany(db.User, { as: 'attendees' });
// -------------------------------------------------------

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
