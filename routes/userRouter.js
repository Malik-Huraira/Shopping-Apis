const express = require('express');
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const  authorizeRoles  = require('../middleware/authorizeRole');
const authenticateUser = require('../middleware/authmiddleware'); // Ensure this is the correct path to your middleware

const router = express.Router();

router.use(authenticateUser);

router.get('/', authorizeRoles('Admin'), getAllUsers);
router.get('/:id', authorizeRoles('Admin', 'User'), getUserById);
router.put('/:id',  authorizeRoles('Admin'), updateUser);
router.delete('/:id', authorizeRoles('Admin'), deleteUser);


module.exports = router;
