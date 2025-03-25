const express = require('express');
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { authorizeRoles } = require('../middleware/authmiddleware');

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authorizeRoles('admin'), createProduct);
router.put('/:id', authorizeRoles('admin'), updateProduct);
router.delete('/:id', authorizeRoles('admin'), deleteProduct);

module.exports = router;
