const productModel = require("../model/productModels");
const HTTP = require("../utils/httpStatusCodes");
const redisClient = require('../config/redisClient');
const { clearProductCache } = require('../utils/cacheUtils');


// Create a new product
const createProduct = async (req, res) => {
    const { name, description, price, stock } = req.body;

    if (!name || !description || price == null || stock == null) {
        return res.status(HTTP.BadRequest).json({
            error: "All fields (name, description, price, stock) are required"
        });
    }

    try {
        const productId = await productModel.createProduct({ name, description, price, stock });
        res.status(HTTP.Created).json({ message: "Product added successfully", id: productId });
    } catch (error) {
        console.error("Create Product Error:", error);
        res.status(HTTP.InternalServerError).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get all products (paginated)
const getAllProducts = async (req, res) => {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const cacheKey = `products:page=${page}&limit=${limit}`;

    try {
        // Check cache
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            console.log("Serving from Redis cache");
            return res.status(HTTP.OK).json(JSON.parse(cachedData));
        }

        // Fetch from DB
        const [products, totalProducts] = await Promise.all([
            productModel.getPaginatedProducts(limit, offset),
            productModel.getTotalProductsCount()
        ]);

        const result = {
            products,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
            totalProducts,
            limit
        };

        // Cache result for 5 minutes
        await redisClient.setEx(cacheKey, 300, JSON.stringify(result));

        res.status(HTTP.OK).json(result);
    } catch (error) {
        console.error("Get All Products Error:", error);
        res.status(HTTP.InternalServerError).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get product by ID
const getProductById = async (req, res) => {
    const id = req.params.id;
    const cacheKey = `product:${id}`;

    try {
        // Check cache
        const cachedProduct = await redisClient.get(cacheKey);
        if (cachedProduct) {
            console.log("Serving product from Redis");
            return res.status(HTTP.OK).json(JSON.parse(cachedProduct));
        }

        // Fetch from DB
        const product = await productModel.getProductById(id);

        if (!product) {
            return res.status(HTTP.NotFound).json({ message: "Product not found" });
        }

        // Cache result
        await redisClient.setEx(cacheKey, 300, JSON.stringify(product));

        res.status(HTTP.OK).json(product);
    } catch (error) {
        console.error("Get Product By ID Error:", error);
        res.status(HTTP.InternalServerError).json({ error: "Internal Server Error", details: error.message });
    }
};
// Update product
const updateProduct = async (req, res) => {
    const { name, description, price, stock } = req.body;

    if (!name || !description || price == null || stock == null) {
        return res.status(HTTP.BadRequest).json({
            error: "All fields (name, description, price, stock) are required"
        });
    }

    try {
        const updatedRows = await productModel.updateProduct(req.params.id, {
            name, description, price, stock
        });

        if (updatedRows === 0) {
            return res.status(HTTP.NotFound).json({ message: "Product not found" });
        }
        await clearProductCache(req.params.id);

        res.status(HTTP.OK).json({ message: "Product updated successfully" });
    } catch (error) {
        console.error("Update Product Error:", error);
        res.status(HTTP.InternalServerError).json({ error: "Internal Server Error", details: error.message });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const deletedRows = await productModel.deleteProduct(req.params.id);

        if (deletedRows === 0) {
            return res.status(HTTP.NotFound).json({ message: "Product not found" });
        }
        await clearProductCache(req.params.id);

        res.status(HTTP.OK).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Delete Product Error:", error);
        res.status(HTTP.InternalServerError).json({ error: "Internal Server Error", details: error.message });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
