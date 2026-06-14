const prisma = require('./src/config/database');

async function main() {
  try {
    const users = await prisma.pengguna.findMany();
    console.log("Daftar Pengguna di Database:");
    console.log(users.map(u => ({
      id: u.id,
      nama: u.nama,
      username: u.username,
      peran: u.peran,
      passwordHash: u.password.substring(0, 10) + "..."
    })));
  } catch (error) {
    console.error("Gagal mengambil data pengguna:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
