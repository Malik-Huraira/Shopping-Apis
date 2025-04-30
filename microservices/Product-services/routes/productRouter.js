const express = require('express');
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, bulkFetchProducts } = require('../controller/productController');
const authorizeRoles = require('../middleware/authorizeRole');
const authenticateUser = require('../middleware/authmiddleware'); // Ensure this is the correct path to your middleware
const router = express.Router();

router.use(authenticateUser);

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authorizeRoles(1), createProduct);
router.put('/:id', authorizeRoles(1), updateProduct);
router.delete('/:id', authorizeRoles(1), deleteProduct);
router.post('/bulk', bulkFetchProducts);
module.exports = router;
