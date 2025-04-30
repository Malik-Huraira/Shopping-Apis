const express = require('express');
const { createOrder, getOrderById, getUserOrders, updateOrderStatus, deleteOrder } = require('../controller/orderController');
const  authorizeRoles  = require('../middleware/authorizeRole');
const authenticateUser = require('../middleware/authmiddleware');
const router = express.Router();

router.use(authenticateUser);

router.post('/',  authorizeRoles(1,2), createOrder);
router.get('/:id', authorizeRoles(1, 2), getOrderById);
router.get('/user/:userId', authorizeRoles(1, 2), getUserOrders);
router.put('/:id/status',  authorizeRoles(1), updateOrderStatus);
router.delete('/:id', authorizeRoles(1), deleteOrder);

module.exports = router;
