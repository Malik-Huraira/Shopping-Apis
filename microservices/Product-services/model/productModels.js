const Product = require('./product');

// Get all products
const getAllProducts = async () => {
    return await Product.findAll();
};

// Get a product by ID
const getProductById = async (id) => {
    return await Product.findByPk(id);
};

// Create a new product
const createProduct = async ({ name, description, price, stock }) => {
    const product = await Product.create({ name, description, price, stock });
    return product.id;
};

// Update an existing product
const updateProduct = async (id, { name, description, price, stock }) => {
    const product = await Product.findByPk(id);
    if (!product) {
        return null; // or throw new Error('Product not found');
    }

    await product.update({ name, description, price, stock });
    return product;
};

// Delete a product
const deleteProduct = async (id) => {
    const product = await Product.findByPk(id);
    if (!product) {
        return 0;
    }

    await product.destroy();
    return 1;
};

// Get paginated products
const getPaginatedProducts = async (limit, offset) => {
    try {
        const products = await Product.findAll({
            limit,
            offset,
        });
        return products;
    } catch (error) {
        console.error("Error fetching paginated products:", error);
        throw error; // Propagate the error to be handled in the controller
    }
};
// Get the total count of products
const getTotalProductsCount = async () => {
    return await Product.count();
};

const bulkFetchProducts = async (ids) => {
    try {
        return await Product.findAll({
            where: { id: ids }
        });
    } catch (error) {
        throw new Error("Error fetching products in bulk: " + error.message);
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getPaginatedProducts,
    getTotalProductsCount,
    bulkFetchProducts
};
