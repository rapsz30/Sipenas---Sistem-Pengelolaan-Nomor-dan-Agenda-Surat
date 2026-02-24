# ✉️ SIPENAS (Sistem Pengelolaan Nomor dan Agenda Surat)

SIPENAS adalah aplikasi berbasis web yang dirancang untuk mendigitalisasi, mempermudah, dan mempercepat proses pengajuan, verifikasi, serta pencatatan agenda nomor surat resmi di sebuah instansi atau perusahaan.

Sistem ini memisahkan hak akses antara **Operator** (yang mengajukan surat) dan **Admin** (yang memverifikasi dan mengelola sistem), sehingga alur birokrasi persuratan menjadi lebih transparan, rapi, dan terdokumentasi dengan baik.

---

## ✨ Fitur Utama

### 👨‍💼 Hak Akses Operator
* **Dashboard Operator:** Ringkasan statistik status pengajuan surat.
* **Pengajuan Surat Baru:** Formulir untuk meminta nomor surat resmi dilengkapi dengan unggahan lampiran.
* **Riwayat Pengajuan:** Melacak status surat yang sedang diproses, disetujui, atau butuh revisi.

### 🛡️ Hak Akses Admin
* **Dashboard Admin:** Statistik komprehensif seluruh aktivitas persuratan di dalam sistem.
* **Kelola Surat:** * Melihat daftar antrean surat masuk.
  * Fitur *Search* dan *Filter* lanjutan (berdasarkan jenis, status, tanggal, dan asal bidang).
  * **Approve:** Menyetujui surat dan menerbitkan nomor urut otomatis.
  * **Reject/Revisi:** Mengembalikan surat ke operator disertai dengan catatan perbaikan.
* **Manajemen Periode:** Menambah, melihat, dan mengunduh data berdasarkan periode pencatatan (misal: Triwulan I 2026).

### 🌐 Fitur Umum
* **Autentikasi:** Login aman, Lupa Kata Sandi, dan Lupa Username.
* **Pusat Bantuan (Help Center):** Halaman FAQ interaktif, Panduan Pengguna (Admin & Operator), Catatan Rilis (Updates), dan form Hubungi Kami.
* **Kebijakan Privasi:** Halaman informasi transparansi keamanan data pengguna.

---

## 🛠️ Teknologi yang Digunakan

Proyek ini dibangun menggunakan ekosistem *Frontend* modern:
* **Framework:** [React 18](https://reactjs.org/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Bahasa Pemrograman:** [TypeScript](https://www.typescriptlang.org/)
* **Routing:** [React Router DOM](https://reactrouter.com/)
* **Styling:** Vanilla CSS (Pendekatan Modular)
* **Iconography:** [FontAwesome](https://fontawesome.com/)

---

## 🚀 Cara Instalasi & Menjalankan Proyek

Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) di komputer Anda sebelum menjalankan perintah di bawah ini.

1. **Clone repositori ini:**
   git clone https://github.com/rapsz30/Sipenas---Sistem-Pengelolaan-Nomor-dan-Agenda-Surat.git

2. **Masuk ke direktori proyek:**
    cd sipenas
    
3. **Instal dependensi (packages):**
    npm install

4. **Jalankan server development:**
    npm run dev

5. **Buka di Browser:**
    Aplikasi akan berjalan secara lokal. Buka browser Anda dan kunjungi tautan yang muncul di terminal (biasanya http://localhost:5173).

📂 Struktur Direktori Utama
Plaintext
sipenas/
├── public/                 # Aset publik statis
├── src/
│   ├── assets/             # Gambar, ikon, dll
│   ├── components/         # Komponen UI Reusable (Navbar, Sidebar, Button, dll)
│   ├── layouts/            # Layout pembungkus halaman (AuthLayout, dll)
│   ├── pages/              # Komponen Halaman Utama
│   │   ├── Admin/          # Halaman khusus Admin (Dashboard, Kelola Surat, Periode)
│   │   ├── Operator/       # Halaman khusus Operator
│   │   ├── Login/          # Halaman Autentikasi
│   │   └── Help/           # Halaman Pusat Bantuan & FAQ
│   ├── App.tsx             # Pengaturan Routing Aplikasi
│   └── main.tsx            # Entry point React
├── index.html              # Template HTML utama
├── package.json            # Daftar dependensi & scripts
└── vite.config.ts          # Konfigurasi Vite