const productModel = require("../models/productModels"); // Importing model

const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock } = req.body;

        if (!name || !description || !price || !stock) {
            return res.status(400).json({ error: "All fields (name, description, price, stock) are required" });
        }

        const productId = await productModel.createProduct({ name, description, price, stock });

        res.status(201).json({ message: "Product added successfully", id: productId });
    } catch (error) {
        console.error("Create Product Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        let { page, limit } = req.query;

        // Default values if not provided
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const offset = (page - 1) * limit;

        // Fetch paginated products
        const products = await productModel.getPaginatedProducts(limit, offset);

        // Fetch total products count
        const totalProducts = await productModel.getTotalProductsCount();

        res.status(200).json({
            products,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
            totalProducts,
            limit,
        });

    } catch (error) {
        console.error("Get All Products Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};



const getProductById = async (req, res) => {
    try {
        const product = await productModel.getProductById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        console.error("Get Product By ID Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, description, price, stock } = req.body;

        if (!name || !description || !price || !stock) {
            return res.status(400).json({ error: "All fields (name, description, price, stock) are required" });
        }

        const updatedRows = await productModel.updateProduct(req.params.id, { name, description, price, stock });

        if (updatedRows === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product updated successfully" });
    } catch (error) {
        console.error("Update Product Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const deletedRows = await productModel.deleteProduct(req.params.id);

        if (deletedRows === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Delete Product Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
