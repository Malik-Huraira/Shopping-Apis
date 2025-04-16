const express = require('express');
const { createOrder, getOrderById, getUserOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const  authorizeRoles  = require('../middleware/authorizeRole');
const authenticateUser = require('../middleware/authmiddleware');
const router = express.Router();

router.post('/', authenticateUser, authorizeRoles('Admin', 'User'), createOrder);
router.get('/:id', authenticateUser, authorizeRoles('Admin','User' ), getOrderById);
router.get('/user/:userId', authenticateUser, authorizeRoles('Admin', 'User'), getUserOrders);
router.put('/:id/status', authenticateUser, authorizeRoles('Admin'), updateOrderStatus);
router.delete('/:id', authenticateUser, authorizeRoles('Admin'), deleteOrder);

module.exports = router;
