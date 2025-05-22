const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Message = sequelize.define(
  "Message",
  {
    senderId: { type: DataTypes.INTEGER, allowNull: false },
    receiverId: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    orderId: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    timestamps: true,
  }
);

module.exports = Message;
