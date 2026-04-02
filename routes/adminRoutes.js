const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

router.get('/users', authMiddleware, isAdmin, adminController.getAllUsers);
router.put('/update-balance/:id', authMiddleware, isAdmin, adminController.updateBalance);
router.delete('/users/:id', authMiddleware, isAdmin, adminController.deleteUser);

module.exports = router;