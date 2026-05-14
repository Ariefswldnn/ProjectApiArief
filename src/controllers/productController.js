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

  createProduct: async (req, res) => {
    try {
      const { nama, hargaJual, kategoriId } = req.body;
      
      const newProduct = await prisma.produk.create({
        data: { 
          nama, 
          hargaJual: parseInt(hargaJual), 
          kategoriId: parseInt(kategoriId),
        }
      });
      res.status(201).json({ message: 'Produk berhasil ditambahkan', data: newProduct });
    } catch (error) {
      res.status(500).json({ message: 'Gagal menambah produk', error: error.message });
    }
  },

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
