// Backend Server for Pirate Coffee POS
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
// Middleware dasar
app.use(cors()); // Mengizinkan request dari frontend
app.use(express.json({ limit: '10mb' })); // Agar Express bisa membaca request body berformat JSON dengan limit besar
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', express.static('uploads')); // Melayani file statis dari folder uploads

// Auto migration to add tipeAbsen column if not exists
const prisma = require('./config/database');
async function initializeDatabase() {
  try {
    console.log("⏳ Checking database schema...");
    // 1. Buat tabel Absensi jika belum ada
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Absensi" (
        "id" SERIAL PRIMARY KEY,
        "namaKaryawan" VARCHAR(255) NOT NULL,
        "fotoSelfie" TEXT NOT NULL,
        "waktuAbsen" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);
    
    // 2. Tambah kolom tipeAbsen jika belum ada
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Absensi" ADD COLUMN IF NOT EXISTS "tipeAbsen" VARCHAR(20) DEFAULT 'MASUK';
    `);
    
    // 3. Tambah kolom shift jika belum ada
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Absensi" ADD COLUMN IF NOT EXISTS "shift" VARCHAR(20) DEFAULT 'SHIFT_1';
    `);
    console.log("✅ Database schema migrated/verified successfully.");
  } catch (error) {
    console.error("❌ Database schema migration failed:", error);
  }
}
initializeDatabase();

// Rute dasar untuk mengecek apakah server berjalan
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Pirate Coffee API!' });
});

const authRoutes = require('./routes/authRoutes');
const masterRoutes = require('./routes/masterRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const statisticsRoutes = require('./routes/statistics');
const absensiRoutes = require('./routes/absensiRoutes');

// Rute-rute (Routes) API
app.use('/api/auth', authRoutes);
app.use('/api', masterRoutes); // ini akan menangani /api/categories dan /api/products
app.use('/api/transactions', transactionRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/absensi', absensiRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
});

module.exports = app;
