const fs = require('fs');
const path = require('path');
const prisma = require('../config/database');

const absensiController = {
  // Mencatat absensi baru dengan foto selfie (base64)
  createAbsensi: async (req, res) => {
    try {
      const { namaKaryawan, fotoSelfie, tipeAbsen, shift } = req.body;

      if (!namaKaryawan || !fotoSelfie) {
        return res.status(400).json({ message: 'Nama karyawan dan foto selfie wajib diisi!' });
      }

      // Pastikan direktori uploads/absensi sudah ada
      const absensiDir = path.join(__dirname, '../../uploads/absensi');
      if (!fs.existsSync(absensiDir)) {
        fs.mkdirSync(absensiDir, { recursive: true });
      }

      // Ekstrak data base64
      const matches = fotoSelfie.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ message: 'Format foto selfie tidak valid!' });
      }

      const fileType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');

      // Tentukan ekstensi file
      let extension = 'png';
      if (fileType.includes('jpeg') || fileType.includes('jpg')) {
        extension = 'jpg';
      }

      const fileName = `selfie-${Date.now()}-${Math.round(Math.random() * 1e9)}.${extension}`;
      const filePath = path.join(absensiDir, fileName);

      // Simpan file
      fs.writeFileSync(filePath, buffer);

      const savedPath = `/uploads/absensi/${fileName}`;
      const typeOfAbsen = tipeAbsen || 'MASUK';
      const selectedShift = shift || 'SHIFT_1';

      // Simpan ke database
      const newAbsen = await prisma.absensi.create({
        data: {
          namaKaryawan,
          fotoSelfie: savedPath,
          tipeAbsen: typeOfAbsen,
          shift: selectedShift,
        },
      });

      res.status(201).json({
        message: 'Absen berhasil dicatat!',
        data: newAbsen,
      });
    } catch (error) {
      console.error('Error saat absensi:', error);
      res.status(500).json({ message: 'Gagal mencatat absensi', error: error.message });
    }
  },

  // Mendapatkan riwayat absensi (Hanya untuk Admin)
  getAllAbsensi: async (req, res) => {
    try {
      const records = await prisma.absensi.findMany({
        orderBy: { waktuAbsen: 'desc' },
      });
      res.json(records);
    } catch (error) {
      console.error('Error mengambil absensi:', error);
      res.status(500).json({ message: 'Terjadi kesalahan saat mengambil riwayat absensi', error: error.message });
    }
  },
};

module.exports = absensiController;
