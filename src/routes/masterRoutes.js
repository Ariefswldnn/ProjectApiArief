const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const productController = require('../controllers/productController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// === ROUTE UNTUK KATEGORI ===
// Siapa saja yang sudah login (Kasir/Admin) boleh melihat Kategori
router.get('/categories', verifyToken, categoryController.getAllCategories);

// HANYA ADMIN yang boleh menambah, mengubah, atau menghapus Kategori
router.post('/categories', verifyToken, verifyAdmin, categoryController.createCategory);
router.put('/categories/:id', verifyToken, verifyAdmin, categoryController.updateCategory);
router.delete('/categories/:id', verifyToken, verifyAdmin, categoryController.deleteCategory);

// === ROUTE UNTUK PRODUK ===
// Siapa saja yang sudah login (Kasir/Admin) boleh melihat Produk/Menu
router.get('/products', verifyToken, productController.getAllProducts);

// HANYA ADMIN yang boleh mengelola Produk/Menu
router.post('/products', verifyToken, verifyAdmin, upload.single('gambar'), productController.createProduct);
router.put('/products/:id', verifyToken, verifyAdmin, upload.single('gambar'), productController.updateProduct);
router.delete('/products/:id', verifyToken, verifyAdmin, productController.deleteProduct);

module.exports = router;
