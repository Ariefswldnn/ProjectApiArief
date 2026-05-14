const jwt = require('jsonwebtoken');

// Di production, gunakan Secret dari .env. Untuk testing kita hardcode dulu
const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_bajak_laut_123';

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Akses Ditolak. Token tidak ditemukan!' });
  }

  try {
    // Biasa format tokennya adalah "Bearer <token>"
    const tokenClean = token.split(" ")[1] || token;
    
    const verified = jwt.verify(tokenClean, JWT_SECRET);
    req.user = verified; // Menyimpan data user (id, peran) ke request
    next(); // Lanjut ke proses controller
  } catch (error) {
    res.status(400).json({ message: 'Token tidak valid!' });
  }
};

// Middleware tambahan untuk mengecek apakah user adalah ADMIN
const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.peran === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Akses Ditolak. Hanya ADMIN yang diizinkan!' });
  }
};

module.exports = { verifyToken, verifyAdmin, JWT_SECRET };
