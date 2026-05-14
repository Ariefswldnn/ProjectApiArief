const prisma = require('../config/database');

const transactionController = {
  // Membuat transaksi baru (Checkout)
  createTransaction: async (req, res) => {
    try {
      const { namaPelanggan, metodePembayaran, items } = req.body;
      const penggunaId = req.user.id; // Didapat dari token (kasir yang login)

      // Validasi input
      if (!items || items.length === 0) {
        return res.status(400).json({ message: 'Keranjang kosong! Pilih menu terlebih dahulu.' });
      }

      // Hitung total belanja dari barang-barang di keranjang
      let totalBelanja = 0;
      const detailItems = items.map(item => {
        const subtotal = item.hargaJualSaatTransaksi * item.jumlah;
        totalBelanja += subtotal;

        return {
          produkId: parseInt(item.produkId),
          jumlah: parseInt(item.jumlah),
          hargaJualSaatTransaksi: parseInt(item.hargaJualSaatTransaksi)
        };
      });

      // Gunakan Prisma Transaction: Agar kalau gagal di satu tabel, semuanya dibatalkan (Aman)
      const newTransaction = await prisma.transaksi.create({
        data: {
          namaPelanggan: namaPelanggan || 'Umum',
          metodePembayaran: metodePembayaran || 'TUNAI',
          totalBelanja,
          penggunaId,
          detail: {
            create: detailItems // Otomatis insert ke tabel DetailTransaksi
          }
        },
        include: {
          detail: true // Mengembalikan respon lengkap dengan detail transaksinya
        }
      });

      res.status(201).json({ 
        message: 'Transaksi berhasil dibuat!', 
        data: newTransaction 
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Gagal membuat transaksi', error: error.message });
    }
  },

  // Mendapatkan Riwayat Transaksi (Untuk laporan / dashboard)
  getAllTransactions: async (req, res) => {
    try {
      const transactions = await prisma.transaksi.findMany({
        orderBy: { dibuatPada: 'desc' }, // Urutkan dari yang terbaru
        include: {
          pengguna: { select: { nama: true } }, // Tampilkan nama kasirnya
          detail: {
            include: { produk: { select: { nama: true } } } // Tampilkan nama produk yang dibeli
          }
        }
      });
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data transaksi', error: error.message });
    }
  }
};

module.exports = transactionController;
