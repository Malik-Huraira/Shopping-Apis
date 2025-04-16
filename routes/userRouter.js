const express = require('express');
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const  authorizeRoles  = require('../middleware/authorizeRole');
const authenticateUser = require('../middleware/authmiddleware'); // Ensure this is the correct path to your middleware

const router = express.Router();

router.get('/',authenticateUser, authorizeRoles('Admin'), getAllUsers);
router.get('/:id', authorizeRoles('Admin', 'User'), getUserById);
router.put('/:id', authenticateUser, authorizeRoles('Admin'), updateUser);
router.delete('/:id', authenticateUser, authorizeRoles('Admin'), deleteUser);


module.exports = router;
