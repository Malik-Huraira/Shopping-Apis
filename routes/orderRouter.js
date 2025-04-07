const express = require('express');
const { createOrder, getOrderById, getUserOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const  authorizeRoles  = require('../middleware/authorizeRole');

const router = express.Router();

router.post('/', authorizeRoles('user', 'admin'), createOrder);
router.get('/:id', authorizeRoles('user', 'admin'), getOrderById);
router.get('/user/:userId', authorizeRoles('user', 'admin'), getUserOrders);
router.put('/:id/status', authorizeRoles('admin'), updateOrderStatus);
router.delete('/:id', authorizeRoles('admin'), deleteOrder);

module.exports = router;
