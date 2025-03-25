const db = require('../config/db');


const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock } = req.body;

        if (!name || !description || !price || !stock) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const [result] = await db.query(
            'INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)',
            [name, description, price, stock]
        );

        res.status(201).json({ message: 'Product added successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Database error', details: error.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM products');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Database error', details: error.message });
    }
};


const getProductById = async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(products[0]);
    } catch (error) {
        res.status(500).json({ error: 'Database error', details: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, description, price, stock } = req.body;
        const [result] = await db.query(
            'UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?',
            [name, description, price, stock, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error', details: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error', details: error.message });
    }
};

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
