const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, upload.single('profilePic'), userController.updateProfile);
router.post('/deposit', authMiddleware, userController.deposit);
router.post('/withdraw/bank', authMiddleware, userController.withdrawBank);

module.exports = router;