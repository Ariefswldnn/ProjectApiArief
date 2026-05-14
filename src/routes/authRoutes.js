const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route untuk Login (Bisa diakses siapa saja)
router.post('/login', authController.login);

// Route untuk Register (Sementara bisa diakses siapa saja agar Anda bisa membuat akun pertama)
// Nanti setelah akun Admin jadi, ini bisa dilindungi dengan authMiddleware
router.post('/register', authController.register);

module.exports = router;
