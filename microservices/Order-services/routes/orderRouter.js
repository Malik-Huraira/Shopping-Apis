const express = require('express');
const { createOrder, getOrderById, getUserOrders, updateOrderStatus, deleteOrder } = require('../controller/orderController');
const  authorizeRoles  = require('../middleware/authorizeRole');
const authenticateUser = require('../middleware/authmiddleware');
const router = express.Router();

router.use(authenticateUser);

router.post('/',  authorizeRoles('Admin', 'User'), createOrder);
router.get('/:id',  authorizeRoles('Admin','User' ), getOrderById);
router.get('/user/:userId',  authorizeRoles('Admin', 'User'), getUserOrders);
router.put('/:id/status',  authorizeRoles('Admin'), updateOrderStatus);
router.delete('/:id', authorizeRoles('Admin'), deleteOrder);

module.exports = router;
