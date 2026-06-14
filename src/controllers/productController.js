const prisma = require('../config/database');

const productController = {
  // Mendapatkan semua produk
  getAllProducts: async (req, res) => {
    try {
      const products = await prisma.produk.findMany({
        include: { kategori: true } // Tarik sekalian data nama kategorinya
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
  },

  // MENAMBAH PRODUK (Sudah diperbaiki untuk mendukung upload gambar)
  createProduct: async (req, res) => {
    try {
      const { nama, hargaJual, kategoriId } = req.body;

      // Buat objek data dasar
      const data = {
        nama,
        hargaJual: parseInt(hargaJual),
        kategoriId: parseInt(kategoriId),
      };

      // PERBAIKAN: Cek apakah ada file gambar yang diunggah saat pembuatan produk
      if (req.file) {
        data.gambar = `/uploads/${req.file.filename}`;
      }

      const newProduct = await prisma.produk.create({
        data: data
      });

      res.status(201).json({ message: 'Produk berhasil ditambahkan', data: newProduct });
    } catch (error) {
      res.status(500).json({ message: 'Gagal menambah produk', error: error.message });
    }
  },

  // UPDATE PRODUK
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { nama, hargaJual, kategoriId } = req.body;
      const data = {
        nama,
        hargaJual: parseInt(hargaJual),
        kategoriId: parseInt(kategoriId)
      };

      if (req.file) {
        data.gambar = `/uploads/${req.file.filename}`;
      }

      const updatedProduct = await prisma.produk.update({
        where: { id: parseInt(id) },
        data
      });
      res.json({ message: 'Produk berhasil diupdate', data: updatedProduct });
    } catch (error) {
      res.status(500).json({ message: 'Gagal mengupdate produk', error: error.message });
    }
  },

  // HAPUS PRODUK
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.produk.delete({ where: { id: parseInt(id) } });
      res.json({ message: 'Produk berhasil dihapus' });
    } catch (error) {
      res.status(500).json({ message: 'Gagal menghapus produk', error: error.message });
    }
  }
};

module.exports = productController;