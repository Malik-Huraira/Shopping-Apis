const queries = {
   

    // Products Queries
    GET_ALL_PRODUCTS: "CALL GetAllProducts()",
    GET_PRODUCT_BY_ID: "CALL GetProductById(?)",
    GET_PAGINATED_PRODUCTS: "CALL GetPaginatedProducts(?, ?)",
    GET_TOTAL_PRODUCTS_COUNT: "CALL GetTotalProductsCount()",
    INSERT_PRODUCT: "CALL InsertProduct(?, ?, ?, ?)",
    UPDATE_PRODUCT: "CALL UpdateProduct(?, ?, ?, ?, ?)",
    DELETE_PRODUCT: "CALL DeleteProduct(?)",

};

module.exports = queries;
