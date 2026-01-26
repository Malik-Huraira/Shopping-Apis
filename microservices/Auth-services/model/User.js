const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const Role = require("./Role");
const Status = require("./Status");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100],
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
      index: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING(20),
      unique: true,
      validate: {
        len: [10, 20],
      },
      index: true,
    },
    address: {
      type: DataTypes.TEXT,
    },
    description: {
      type: DataTypes.TEXT,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "roles",
        key: "id",
      },
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "statuses",
        key: "id",
      },
    },
    last_login: {
      type: DataTypes.DATE,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      index: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    paranoid: true, // Soft deletes
    deletedAt: "deleted_at",
    indexes: [
      {
        fields: ["email"],
      },
      {
        fields: ["phone_number"],
      },
      {
        fields: ["role_id"],
      },
      {
        fields: ["status_id"],
      },
    ],
  },
);

User.belongsTo(Role, { foreignKey: "role_id", onDelete: "RESTRICT" });
User.belongsTo(Status, { foreignKey: "status_id", onDelete: "RESTRICT" });

module.exports = User;
