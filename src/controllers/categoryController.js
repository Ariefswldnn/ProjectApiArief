const prisma = require('../config/database');

const categoryController = {
  // Mendapatkan semua kategori
  getAllCategories: async (req, res) => {
    try {
      const categories = await prisma.kategori.findMany({
        include: { _count: { select: { produk: true } } } // Opsional: tampilkan jumlah produk
      });
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
  },

  // Membuat kategori baru
  createCategory: async (req, res) => {
    try {
      const { nama } = req.body;
      const newCategory = await prisma.kategori.create({ data: { nama } });
      res.status(201).json({ message: 'Kategori berhasil dibuat', data: newCategory });
    } catch (error) {
      res.status(500).json({ message: 'Gagal membuat kategori', error: error.message });
    }
  },

  // Mengubah nama kategori
  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { nama } = req.body;
      const updatedCategory = await prisma.kategori.update({
        where: { id: parseInt(id) },
        data: { nama }
      });
      res.json({ message: 'Kategori berhasil diupdate', data: updatedCategory });
    } catch (error) {
      res.status(500).json({ message: 'Gagal mengupdate kategori', error: error.message });
    }
  },

  // Menghapus kategori
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.kategori.delete({ where: { id: parseInt(id) } });
      res.json({ message: 'Kategori berhasil dihapus' });
    } catch (error) {
      res.status(500).json({ message: 'Gagal menghapus kategori', error: error.message });
    }
  }
};

module.exports = categoryController;
