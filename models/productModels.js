const db = require('../config/db');
const queries = require('../config/queries');

// Get all products
const getAllProducts = async () => {
    const [products] = await db.query("CALL GetAllProducts()");
    return products;
};

// Get a product by ID
const getProductById = async (id) => {
    const [product] = await db.query("CALL GetProductById(?)", [id]);
    return product.length ? product[0] : null;
};

// Create a new product
const createProduct = async ({ name, description, price, stock }) => {
    const [result] = await db.query("CALL InsertProduct(?, ?, ?, ?)", [name, description, price, stock]);
    return result.insertId;
};

// Update an existing product
const updateProduct = async (id, { name, description, price, stock }) => {
    const [result] = await db.query("CALL UpdateProduct(?, ?, ?, ?, ?)", [id, name, description, price, stock]);
    return result.affectedRows;
};

// Delete a product
const deleteProduct = async (id) => {
    const [result] = await db.query("CALL DeleteProduct(?)", [id]);
    return result.affectedRows;
};

// Get paginated products
const getPaginatedProducts = async (limit, offset) => {
    const [products] = await db.query("CALL GetPaginatedProducts(?, ?)", [limit, offset]);
    return products;
};

// Get the total count of products
const getTotalProductsCount = async () => {
    const [result] = await db.query("CALL GetTotalProductsCount()");
    return result[0].total;
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getPaginatedProducts,
    getTotalProductsCount
};
