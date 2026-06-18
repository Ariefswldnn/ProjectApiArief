const express = require('express');
const router = express.Router();
const absensiController = require('../controllers/absensiController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

// Route untuk absensi karyawan (siapa saja yang sudah login bisa absen)
router.post('/', verifyToken, absensiController.createAbsensi);

// Route untuk melihat riwayat absensi (hanya admin yang bisa melihat)
router.get('/', verifyToken, verifyAdmin, absensiController.getAllAbsensi);

module.exports = router;
