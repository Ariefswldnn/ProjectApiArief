# Dokumentasi Lengkap API - Pirate Coffee POS

Gunakan daftar ini untuk pengujian di Postman. 
Base URL: `http://localhost:5000/api`

---

## 1. Autentikasi (Auth)
Digunakan untuk urusan login dan pendaftaran akun.

### Login
*   **Method:** `POST`
*   **URL:** `http://localhost:5000/api/auth/login`
*   **Body (JSON):**
    ```json
    {
      "username": "admin",
      "password": "password_kamu"
    }
    ```

### Register (Daftar Akun Baru)
*   **Method:** `POST`
*   **URL:** `http://localhost:5000/api/auth/register`
*   **Body (JSON):**
    ```json
    {
      "nama": "Nama Pengguna",
      "username": "user123",
      "password": "password123",
      "peran": "KASIR"
    }
    ```
    *(Pilihan peran: ADMIN atau KASIR)*

---

## 2. Manajemen Produk (Master Data)
**PENTING:** Harus menyertakan `Bearer Token` di Header Authorization.

### Lihat Semua Produk
*   **Method:** `GET`
*   **URL:** `http://localhost:5000/api/products`

### Tambah Produk Baru
*   **Method:** `POST`
*   **URL:** `http://localhost:5000/api/products`
*   **Body (JSON):**
    ```json
    {
      "nama": "Caramel Macchiato",
      "hargaJual": 35000,
      "kategoriId": 1
    }
    ```

### Update Produk (Ubah Harga/Nama)
*   **Method:** `PUT`
*   **URL:** `http://localhost:5000/api/products/:id`

### Hapus Produk
*   **Method:** `DELETE`
*   **URL:** `http://localhost:5000/api/products/:id`

---

## 3. Transaksi (Kasir)
**PENTING:** Harus menyertakan `Bearer Token` di Header Authorization.

### Simpan Pesanan Baru (Checkout)
*   **Method:** `POST`
*   **URL:** `http://localhost:5000/api/transactions`
*   **Body (JSON):**
    ```json
    {
      "namaPelanggan": "Pembeli Umum",
      "metodePembayaran": "TUNAI",
      "items": [
        { "produkId": 1, "jumlah": 2 },
        { "produkId": 2, "jumlah": 1 }
      ]
    }
    ```

### Lihat Riwayat Transaksi
*   **Method:** `GET`
*   **URL:** `http://localhost:5000/api/transactions`

---

STATISTICS
http://localhost:5000/api/statistics

## Cara Menggunakan Token di Postman:
1.  Lakukan **Login** terlebih dahulu.
2.  Copy kode `token` yang muncul di hasil login.
3.  Di tab endpoint lain (misal Get Products), klik tab **Authorization**.
4.  Pilih Type: **Bearer Token**.
5.  Paste token tersebut di kotak yang tersedia.
6.  Klik **Send**.
