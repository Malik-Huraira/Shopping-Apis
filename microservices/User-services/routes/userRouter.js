const express = require('express');
const { getAllUsers, getUserById, updateUser, deleteUser,createUser } = require('../controller/userController');
const authorizeRoles = require('../middleware/authorizeRole');
const authenticateUser = require('../middleware/authmiddleware'); // Ensure this is the correct path to your middleware

const router = express.Router();

router.use(authenticateUser);

router.get('/', authorizeRoles(1), getAllUsers);
router.get('/:id', authorizeRoles(1,2), getUserById);
router.put('/:id', authorizeRoles(1), updateUser);
router.delete('/:id', authorizeRoles(1), deleteUser);
router.post('/', authorizeRoles(1),createUser);

module.exports = router;
