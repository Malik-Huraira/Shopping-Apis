const User = require('./User');
const Session = require('./Session');
const Role = require('./Role');
const Status = require('./Status');

const createUser = async (userData) => {
    return await User.create(userData);
};

const findUserByEmail = async (email) => {
    return await User.findOne({
        where: { email },
        include: [Role, Status]
    });
};

const findUserByPhone = async (phone_number) => {
    return await User.findOne({
        where: { phone_number },
        include: [Role, Status]
    });
};

const saveUserSession = async (userId, token) => {
    return await Session.create({ user_id: userId, token });
};

const deleteUserSession = async (token) => {
    return await Session.destroy({ where: { token } });
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserByPhone,
    saveUserSession,
    deleteUserSession,
};
