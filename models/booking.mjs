export default function initBookingModel(sequelize, DataTypes) {
  return sequelize.define('booking', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    room_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'rooms',
        key: 'id',
      },
    },
    booking_date: {
      type: DataTypes.DATE,
    },
    start_time: {
      type: DataTypes.DATE,
    },
    end_time: {
      type: DataTypes.DATE,
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }, { underscored: true });
}
