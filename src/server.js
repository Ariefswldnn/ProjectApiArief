require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
// Middleware dasar
app.use(cors()); // Mengizinkan request dari frontend
app.use(express.json()); // Agar Express bisa membaca request body berformat JSON
app.use('/uploads', express.static('uploads')); // Melayani file statis dari folder uploads

// Rute dasar untuk mengecek apakah server berjalan
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Pirate Coffee API!' });
});

const authRoutes = require('./routes/authRoutes');
const masterRoutes = require('./routes/masterRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const statisticsRoutes = require('./routes/statistics');

// Rute-rute (Routes) API
app.use('/api/auth', authRoutes);
app.use('/api', masterRoutes); // ini akan menangani /api/categories dan /api/products
app.use('/api/transactions', transactionRoutes);
app.use('/api/statistics', statisticsRoutes);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  });
}

module.exports = app;
