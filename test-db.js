const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("⏳ Mencoba terhubung ke database PostgreSQL...");
    
    // Mencoba melakukan koneksi
    await prisma.$connect();
    
    console.log("✅ BERHASIL! Database sudah berhasil terhubung ke Backend.");
    console.log("Password Anda di .env sudah BENAR.");
  } catch (error) {
    console.error("❌ GAGAL! Tidak dapat terhubung ke database.");
    console.error("--------------------------------------------------");
    console.error("Pesan Error:", error.message);
    console.error("--------------------------------------------------");
    console.error("Kemungkinan penyebab:");
    console.error("1. Password di file .env masih salah.");
    console.error("2. Database 'db_kasir' belum dibuat di pgAdmin.");
    console.error("3. Server PostgreSQL belum berjalan.");
  } finally {
    await prisma.$disconnect();
  }
}

main();
