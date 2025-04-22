const express = require('express');
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controller/productController');
const authorizeRoles = require('../middleware/authorizeRole');
const authenticateUser = require('../middleware/authmiddleware'); // Ensure this is the correct path to your middleware
const router = express.Router();

router.use(authenticateUser);

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authorizeRoles('Admin'), createProduct);
router.put('/:id', authorizeRoles('Admin'), updateProduct);
router.delete('/:id', authorizeRoles('Admin'), deleteProduct);

module.exports = router;
