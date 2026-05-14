const prisma = require('../config/database');

const statisticsController = {

  getStatistics: async (req, res) => {
    try {

      // Total transaksi
      const totalTransaksi = await prisma.transaksi.count();

      // Total pendapatan
      const totalPendapatan = await prisma.transaksi.aggregate({
        _sum: {
          totalBelanja: true
        }
      });

      // Total produk terjual
      const totalProdukTerjual = await prisma.detailTransaksi.aggregate({
        _sum: {
          jumlah: true
        }
      });

      // Produk terlaris
      const produkTerlaris = await prisma.detailTransaksi.groupBy({
        by: ['produkId'],
        _sum: {
          jumlah: true
        },
        orderBy: {
          _sum: {
            jumlah: 'desc'
          }
        },
        take: 1
      });

      // Ambil nama produk terlaris
      let namaProdukTerlaris = '-';

      if (produkTerlaris.length > 0) {
        const produk = await prisma.produk.findUnique({
          where: {
            id: produkTerlaris[0].produkId
          }
        });

        namaProdukTerlaris = produk.nama;
      }

      res.json({
        totalTransaksi,
        totalPendapatan: totalPendapatan._sum.totalBelanja || 0,
        totalProdukTerjual: totalProdukTerjual._sum.jumlah || 0,
        produkTerlaris: namaProdukTerlaris
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: 'Gagal mengambil statistik',
        error: error.message
      });

    }
  }

};

module.exports = statisticsController;