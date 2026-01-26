const User = require("./User");
const Role = require("./Role");
const Status = require("./Status");
const Session = require("./Session");

// Define associations
User.hasMany(Session, { foreignKey: "user_id", onDelete: "CASCADE" });
Session.belongsTo(User, { foreignKey: "user_id" });

module.exports = {
  User,
  Role,
  Status,
  Session,
};
