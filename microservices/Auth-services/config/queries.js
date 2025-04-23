const queries = {
    
    GET_USER_BY_EMAIL: "CALL GetUserByEmail(?)",
    GET_USER_BY_ID: "CALL GetUserById(?)",
    INSERT_USER: "CALL InsertUser(?, ?, ?, ?, ?, ?, ?, ?)",
    UPDATE_USER: "CALL UpdateUser(?, ?, ?, ?, ?, ?, ?, ?)",
    DELETE_USER: "CALL DeleteUser(?)",
    // Sessions Queries
    INSERT_SESSION: "CALL InsertSession(?, ?)",
    DELETE_SESSION: "CALL DeleteSession(?)",

};

module.exports = queries;
