const express = require('express');
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const authorizeRoles = require('../middleware/authorizeRole');
const authenticateUser = require('../middleware/authmiddleware'); // Ensure this is the correct path to your middleware
const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authenticateUser, authorizeRoles('Admin'), createProduct);
router.put('/:id', authenticateUser, authorizeRoles('Admin'), updateProduct);
router.delete('/:id', authenticateUser, authorizeRoles('Admin'), deleteProduct);

module.exports = router;
