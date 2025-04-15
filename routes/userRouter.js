const express = require('express');
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const  authorizeRoles  = require('../middleware/authorizeRole');


const router = express.Router();

router.get('/', authorizeRoles('admin'), getAllUsers);
router.get('/:id', authorizeRoles('admin', 'user'), getUserById);
router.put('/:id', authorizeRoles('admin'), updateUser);
router.delete('/:id', authorizeRoles('admin'), deleteUser);


module.exports = router;
