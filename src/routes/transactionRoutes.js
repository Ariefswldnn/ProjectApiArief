const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

// === ROUTE UNTUK TRANSAKSI ===

// Semua Kasir (dan Admin) bisa membuat transaksi baru
router.post('/', verifyToken, transactionController.createTransaction);

// Semua Kasir (dan Admin) bisa melihat riwayat transaksi
// Catatan: Di sistem riil, biasanya Kasir hanya boleh melihat transaksi hari ini miliknya sendiri,
// sedangkan Admin boleh melihat semuanya. Namun untuk kemudahan awal, kita buka untuk semua yang sudah login.
router.get('/', verifyToken, transactionController.getAllTransactions);

module.exports = router;
