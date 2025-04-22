const queries = {

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
