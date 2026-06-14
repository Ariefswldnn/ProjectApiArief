const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const { JWT_SECRET } = require('../middlewares/authMiddleware');

const authController = {
  // Fungsi untuk Login
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Cari user berdasarkan username
      const user = await prisma.pengguna.findUnique({
        where: { username }
      });

      if (!user) {
        return res.status(404).json({ message: 'Username tidak ditemukan!' });
      }

      // Cek apakah password cocok (mendukung plain-text untuk data seed lama)
      let isPasswordValid = false;
      const isBcrypt = user.password.startsWith('$2b$') || user.password.startsWith('$2a$');

      if (isBcrypt) {
        isPasswordValid = await bcrypt.compare(password, user.password);
      } else {
        isPasswordValid = (password === user.password);
        // Migrasi otomatis ke bcrypt jika password plain-text cocok
        if (isPasswordValid) {
          try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            await prisma.pengguna.update({
              where: { id: user.id },
              data: { password: hashedPassword }
            });
            console.log(`Password pengguna ${user.username} berhasil di-upgrade ke bcrypt.`);
          } catch (upgradeError) {
            console.error('Gagal meng-upgrade password:', upgradeError);
          }
        }
      }

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Password salah!' });
      }

      // Jika cocok, buat token JWT
      const token = jwt.sign(
        { id: user.id, username: user.username, peran: user.peran },
        JWT_SECRET,
        { expiresIn: '24h' } // Token berlaku 24 jam
      );

      res.json({
        message: 'Login berhasil!',
        token,
        user: {
          id: user.id,
          nama: user.nama,
          peran: user.peran
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
  },

  // Fungsi untuk mendaftarkan akun baru (Biasanya hanya boleh dilakukan ADMIN)
  register: async (req, res) => {
    try {
      const { nama, username, password, peran } = req.body;

      // Cek apakah username sudah ada
      const existingUser = await prisma.pengguna.findUnique({
        where: { username }
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Username sudah digunakan!' });
      }

      // Hash password (enkripsi agar aman di database)
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Simpan user baru ke database
      const newUser = await prisma.pengguna.create({
        data: {
          nama,
          username,
          password: hashedPassword,
          peran: peran || 'KASIR' // Default KASIR jika tidak diisi
        }
      });

      res.status(201).json({
        message: 'Akun berhasil dibuat!',
        user: { id: newUser.id, nama: newUser.nama, peran: newUser.peran }
      });
    } catch (error) {
      res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
  }
};

module.exports = authController;
