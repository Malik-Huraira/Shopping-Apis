const db = require('../config/db');
const queries = require('../config/queries');

const getAllProducts = async () => {
    const [products] = await db.query(queries.GET_ALL_PRODUCTS);
    return products;
};

const getProductById = async (id) => {
    const [product] = await db.query(queries.GET_PRODUCT_BY_ID, [id]);
    return product.length ? product[0] : null;
};

const createProduct = async ({ name, description, price, stock }) => {
    const [result] = await db.query(queries.INSERT_PRODUCT, [name, description, price, stock]);
    return result.insertId;
};

const updateProduct = async (id, { name, description, price, stock }) => {
    const [result] = await db.query(queries.UPDATE_PRODUCT, [name, description, price, stock, id]);
    return result.affectedRows;
};

const deleteProduct = async (id) => {
    const [result] = await db.query(queries.DELETE_PRODUCT, [id]);
    return result.affectedRows;
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
