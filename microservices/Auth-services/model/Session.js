const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const User = require("./User");

const Session = sequelize.define(
  "Session",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      index: true,
    },
    token: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    ip_address: {
      type: DataTypes.STRING(45),
    },
    user_agent: {
      type: DataTypes.TEXT,
    },
    is_revoked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      index: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "sessions",
    timestamps: false,
    indexes: [
      {
        fields: ["user_id"],
      },
      {
        fields: ["token"],
      },
      {
        fields: ["expires_at"],
      },
      {
        fields: ["is_revoked"],
      },
    ],
  },
);

Session.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

module.exports = Session;
