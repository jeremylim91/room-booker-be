export default function initRoomModel(sequelize, DataTypes) {
  return sequelize.define('room', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    room_name: {
      type: DataTypes.STRING,
    },
    max_occupancy: {
      type: DataTypes.INTEGER,
    },
    opening_time: {
      type: DataTypes.TIME,
    },
    closing_time: {
      type: DataTypes.TIME,
    },
    thumbnail: {
      type: DataTypes.STRING,
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
