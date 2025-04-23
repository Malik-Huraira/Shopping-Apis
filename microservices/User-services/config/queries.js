const queries = {
   
    // Users Queries
    GET_USER_BY_EMAIL: "CALL GetUserByEmail(?)",
    GET_USER_BY_ID: "CALL GetUserById(?)",
    INSERT_USER: "CALL InsertUser(?, ?, ?, ?, ?, ?, ?, ?)",
    UPDATE_USER: "CALL UpdateUser(?, ?, ?, ?, ?, ?, ?, ?)",
    DELETE_USER: "CALL DeleteUser(?)",
    GET_TOTAL_USERS_COUNT: "CALL GetTotalUsersCount()",
    GET_PAGINATED_USERS: "CALL GetPaginatedUsers(?, ?)"



};

module.exports = queries;
