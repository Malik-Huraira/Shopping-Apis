const queries = {
   
    // Users Queries
    GET_USER_BY_EMAIL: "CALL GetUserByEmail(?)",
    GET_USER_BY_ID: "CALL GetUserById(?)",
    INSERT_USER: "CALL InsertUser(?, ?, ?, ?, ?, ?, ?, ?)",
    UPDATE_USER: "CALL UpdateUser(?, ?, ?, ?, ?, ?, ?, ?)",
    DELETE_USER: "CALL DeleteUser(?)",
    GET_TOTAL_USERS_COUNT: "CALL GetTotalUsersCount()",
    GET_PAGINATED_USERS: "CALL GetPaginatedUsers(?, ?)",
    // Sessions Queries
    INSERT_SESSION: "CALL InsertSession(?, ?)",
    DELETE_SESSION: "CALL DeleteSession(?)",


    // Products Queries
    GET_ALL_PRODUCTS: "CALL GetAllProducts()",
    GET_PRODUCT_BY_ID: "CALL GetProductById(?)",
    GET_PAGINATED_PRODUCTS: "CALL GetPaginatedProducts(?, ?)",
    GET_TOTAL_PRODUCTS_COUNT: "CALL GetTotalProductsCount()",
    INSERT_PRODUCT: "CALL InsertProduct(?, ?, ?, ?)",
    UPDATE_PRODUCT: "CALL UpdateProduct(?, ?, ?, ?, ?)",
    DELETE_PRODUCT: "CALL DeleteProduct(?)",

    // Orders Queries
    GET_PRODUCT_PRICE: "CALL GetProductPrice(?)",
    INSERT_ORDER: "CALL InsertOrder(?, ?)",
    INSERT_ORDER_ITEM: "CALL InsertOrderItem(?, ?, ?, ?)",
    GET_ORDER_BY_ID: "CALL GetOrderById(?)",
    GET_USER_ORDERS: "CALL GetUserOrders(?)",
    GET_PAGINATED_USER_ORDERS: "CALL GetPaginatedUserOrders(?, ?)",
    GET_TOTAL_USER_ORDERS_COUNT: "CALL GetTotalUserOrdersCount(?)",
    UPDATE_ORDER_STATUS: "CALL UpdateOrderStatus(?, ?)",
    DELETE_ORDER: "CALL DeleteOrder(?)"

};

module.exports = queries;
