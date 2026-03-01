# SIPENAS - Sistem Pengelolaan Nomor dan Agenda Surat

![SIPENAS Banner](https://via.placeholder.com/1200x300.png?text=SIPENAS+-+Sistem+Pengelolaan+Nomor+dan+Agenda+Surat) **SIPENAS** adalah sebuah aplikasi berbasis web yang dirancang untuk memudahkan instansi atau organisasi dalam mengelola penomoran dan pengarsipan agenda surat secara digital. Dengan SIPENAS, proses pencatatan, pelacakan, dan penyimpanan surat (baik surat masuk maupun surat keluar) menjadi lebih terstruktur, transparan, dan efisien.

## 🚀 Fitur Utama

- **Otentikasi Aman**: Login yang aman menggunakan enkripsi (Bcrypt) & JSON Web Token (JWT). Tersedia juga fitur pemulihan kata sandi (Forgot Password).
- **Manajemen Hak Akses (Role-Based)**: 
  - **Admin**: Memiliki hak akses penuh untuk mengelola pengguna, mengatur periode penomoran surat, dan mengakses dasbor utama.
  - **Operator**: Dapat mengajukan penomoran surat dan melihat daftar surat yang relevan.
- **Pengelolaan Surat**: Mencatat detail surat seperti nomor surat, perihal, tujuan/asal surat, beserta file lampiran (unggah dokumen Word/PDF).
- **Pengaturan Periode**: Admin dapat membuat dan mengatur periode aktif penomoran surat.
- **Dasbor Informatif**: Menampilkan ringkasan statistik dan agenda surat secara *real-time*.
- **Pencarian & Filter**: Kemudahan untuk melacak dan mencari arsip surat lama berdasarkan berbagai kriteria.

## 🛠️ Teknologi yang Digunakan

Proyek ini dibangun menggunakan arsitektur monorepo sederhana yang memisahkan antara _frontend_ dan _backend_.

### Frontend (`/sipenas`)
- **React.js** (dengan Vite untuk build tool yang super cepat)
- **TypeScript** (untuk penulisan kode yang lebih aman dan terstruktur)
- **React Router** (untuk navigasi antar halaman)
- **CSS murni / Framework CSS** (untuk desain antarmuka yang responsif)

### Backend (`/sipenas-api`)
- **Node.js** & **Express.js** (sebagai framework server RESTful API)
- **MySQL** (Sistem Manajemen Basis Data Relasional)
- **Multer** (untuk menangani *upload* file dokumen)
- **Nodemailer** (untuk pengiriman email pemulihan kata sandi)



## 📂 Struktur Repositori

text
├── sipenas/                # Root direktori aplikasi Frontend (React + Vite)
│   ├── public/             # Aset statis publik
│   ├── src/                # Kode sumber aplikasi frontend (komponen, halaman, layanan)
│   └── package.json        # Dependensi dan script frontend
│
├── sipenas-api/            # Root direktori aplikasi Backend (Express API)
│   ├── uploads/            # Direktori penyimpanan file lampiran surat (.docx, .pdf)
│   ├── db_sipenas.sql      # File ekspor basis data MySQL
│   ├── index.js            # Entry point server Express
│   └── package.json        # Dependensi dan script backend
│
└── README.md               # Dokumentasi proyek


## ⚙️ Prasyarat (Prerequisites)

Pastikan sistem Anda telah terpasang perangkat lunak berikut sebelum menjalankan proyek:

* **Node.js** (versi 16.x atau lebih baru direkomendasikan)
* **NPM** atau **Yarn** (biasanya sudah termasuk saat menginstal Node.js)
* **MySQL** Server (contoh: XAMPP, Laragon, atau instalasi MySQL mandiri)



## 💻 Instalasi dan Konfigurasi

Ikuti langkah-langkah di bawah ini untuk menjalankan SIPENAS di lingkungan lokal Anda.

### 1. Konfigurasi Basis Data (Database)

1. Buka MySQL / phpMyAdmin Anda.
2. Buat database baru dengan nama `db_sipenas` (atau nama lain sesuai preferensi Anda).
3. Lakukan impor (import) struktur dan data awal dari file `sipenas-api/db_sipenas.sql` ke dalam database yang baru dibuat.

### 2. Setup Backend (API)

1. Buka terminal/command prompt dan masuk ke direktori backend:
bash
cd sipenas-api

2. Instal semua dependensi backend:
bash
npm install

3. Konfigurasi *Environment Variables*. Buka file `.env` di dalam folder `sipenas-api` (jika belum ada, buat file `.env`) dan sesuaikan dengan konfigurasi sistem Anda:
env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=db_sipenas
JWT_SECRET=rahasia_token_anda_disini

4. Jalankan server backend:
bash
npm start
# atau jika menggunakan nodemon untuk mode pengembangan:
npm run dev

Server akan berjalan di `http://localhost:5000`.

### 3. Setup Frontend (Client)

1. Buka tab terminal baru dan masuk ke direktori frontend:
bash
cd sipenas

2. Instal dependensi frontend:
bash
npm install

3. *(Opsional)* Jika perlu, sesuaikan URL endpoint API di file konfigurasi frontend agar mengarah ke `http://localhost:5000`.
4. Jalankan *development server* Vite:
bash
npm run dev

5. Buka tautan yang muncul di terminal (biasanya `http://localhost:5173`) di browser web Anda.

## 🔒 Akses Default

Jika Anda baru saja mengimpor database, Anda bisa menggunakan akun berikut untuk login pertama kali (sesuaikan jika ada perbedaan di data SQL Anda):

* **Role Admin**
* Username: `Sekretariat`
* Password: `admin123`


* **Role Operator**
* Username: `operator e-gob`
* Password: `operator123`