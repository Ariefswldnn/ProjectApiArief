require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL;

// Buat pool koneksi ke PostgreSQL menggunakan library 'pg'
const pool = new Pool({ connectionString });

// Gunakan driver adapter PostgreSQL untuk Prisma (Syarat wajib di Prisma 7)
const adapter = new PrismaPg(pool);

// Inisialisasi Prisma Client dengan adapter tersebut
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
