const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Status = sequelize.define(
  "Status",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "statuses",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

module.exports = Status;
