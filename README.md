# Litek-D - Aplikasi FAQ Modern & Interaktif

Aplikasi FAQ (Frequently Asked Questions) yang ringan, cepat, dan responsif dengan tema biru cerah serta animasi interaktif modern yang terinspirasi dari konsep Antigravity.

## ✨ Fitur Utama

- 🔍 **Pencarian Real-Time**: Pencarian instan pada pertanyaan dan jawaban tanpa reload halaman.
- 🏷️ **Kategori FAQ**: Filter pertanyaan berdasarkan kategori (Semua, Akun, Layanan, Dukungan, Keamanan, Umum, dll).
- 🪗 **Accordion Halus**: Animasi accordion buka-tutup dengan efek spring.
- 🔐 **Panel Admin**:
  - Autentikasi Admin login.
  - CRUD FAQ (Tambah, Edit, Hapus pertanyaan & jawaban).
  - Pengaturan status Aktif / Nonaktif.
  - Ringkasan statistik FAQ.
- 🎨 **Desain & Animasi Interaktif**:
  - Tema Biru Cerah (Light Blue Modern Gradient).
  - Floating geometric particle system & interaksi kursor.
  - Mouse glow aura & cursor trail.
  - Dynamic animated wave separator.
  - 3D card tilt & scroll reveal.
  - Smooth count-up counter statistik.
  - Scroll progress indicator.
  - Dukungan preferensi `prefers-reduced-motion`.
- ⚡ **Ringan & Tanpa Dependensi Berat**:
  - Dibangun dengan native PHP + SQLite (database auto-generate dan auto-seed pada akses pertama).
  - Vanilla CSS & JavaScript murni (tanpa runtime node.js/npm).

## 🚀 Persyaratan Sistem

- PHP 8.0 atau lebih baru (dengan ekstensi `pdo_sqlite` aktif).
- Web server Apache / Nginx / Laragon / PHP built-in server.

## 🛠️ Instalasi & Menjalankan

1. Clone repositori ini:
   ```bash
   git clone https://github.com/sidarta-david/Litek-D.git
   ```
2. Pindahkan folder ke direktori web server Anda (misalnya `laragon/www/Litek-D` atau `htdocs/Litek-D`).
3. Atau jalankan menggunakan PHP built-in server:
   ```bash
   php -S localhost:8000
   ```
4. Buka di browser:
   - **Halaman Utama**: `http://localhost:8000`
   - **Halaman Admin**: `http://localhost:8000/admin/`

### 🔑 Akses Default Admin
- **Username**: `admin`
- **Password**: `admin123`

*(Catatan: Anda dapat mengubah kredensial admin pada file `config.php`)*

## 📁 Struktur Folder

```
Litek-D/
├── index.php              # Halaman utama FAQ (Pencarian & daftar FAQ)
├── config.php             # Konfigurasi database SQLite & autentikasi
├── admin/
│   └── index.php          # Dashboard Admin (Login & CRUD FAQ)
├── assets/
│   ├── css/
│   │   └── style.css      # Styling tema biru cerah, layout & animasi
│   └── js/
│       └── app.js         # Interaktivitas pencarian, filter, dan sistem animasi
├── database/              # Folder penyimpanan database SQLite (auto-generate)
└── README.md
```
