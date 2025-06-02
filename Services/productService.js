const Product = require("../models/productModels");

// Get all products
const getAllProducts = async () => {
  return await Product.find({});
};

// Get product by ID
const getProductById = async (id) => {
  return await Product.findById(id);
};

// Create product
const createProduct = async ({ name, description, price, stock }) => {
  const product = new Product({ name, description, price, stock });
  const saved = await product.save();
  return saved._id;
};

// Update product
const updateProduct = async (id, { name, description, price, stock }) => {
  const result = await Product.updateOne(
    { _id: id },
    { $set: { name, description, price, stock } }
  );
  return result.modifiedCount;
};

// Delete product
const deleteProduct = async (id) => {
  const result = await Product.deleteOne({ _id: id });
  return result.deletedCount;
};

// Get paginated products
const getPaginatedProducts = async (limit, offset) => {
  return await Product.find({})
    .skip(offset)
    .limit(limit)
    .sort({ createdAt: -1 });
};

// Count total products
const getTotalProductsCount = async () => {
  return await Product.countDocuments();
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getPaginatedProducts,
  getTotalProductsCount,
};
