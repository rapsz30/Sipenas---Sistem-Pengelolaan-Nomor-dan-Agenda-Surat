const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { authenticator } = require('otplib');
const qrcode = require('qrcode');
const jwt = require('jsonwebtoken');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ==========================================
// KONFIGURASI KONEKSI DATABASE
// ==========================================
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'db_sipenas'
});

db.connect((err) => {
    if (err) {
        console.error('Gagal koneksi ke MySQL:', err);
        return;
    }
    console.log('Terhubung ke database MySQL (XAMPP)');
});

// --- ROUTE TESTING ---
app.get('/', (req, res) => {
    res.send('API SIPENAS Berjalan...');
});

// ==========================================
// 1. ROUTE LOGIN (PASSWORD + GOOGLE AUTH)
// ==========================================
app.post('/api/login', async (req, res) => {
    const { username, password, otp } = req.body;

    const query = "SELECT * FROM users WHERE username = ?";
    db.execute(query, [username], async (err, results) => {
        if (err) return res.status(500).json({ message: "Server Error" });
        if (results.length === 0) return res.status(401).json({ message: "User tidak ditemukan" });

        const user = results[0];

        // 1. Cek Password
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Password salah" });

        // 2. Cek Wajib Ganti Sandi (Login Pertama)
        if (user.is_first_login === 1 || user.is_first_login == '1' || user.is_first_login === true) {
            return res.json({
                message: "Ini adalah login pertama Anda. Anda wajib mengganti kata sandi demi keamanan.",
                userId: user.id_users, 
                requiresPasswordChange: true 
            });
        }

        // 3. Setup OTP (Jika belum punya rahasia Google Auth)
        if (!user.google_auth_secret) {
            const secret = authenticator.generateSecret();
            
            // Simpan secret ke database
            db.execute("UPDATE users SET google_auth_secret = ? WHERE id_users = ?", [secret, user.id_users]);

            // Buat QR Code URL
            const otpauth = authenticator.keyuri(user.username, 'SIPENAS', secret);
            const qrCodeUrl = await qrcode.toDataURL(otpauth);

            return res.json({
                message: "Silakan scan QR Code ini di aplikasi Google Authenticator Anda.",
                requiresSetupOTP: true,
                qrCodeUrl: qrCodeUrl
            });
        }

        // 4. Minta input OTP (Jika sudah punya secret tapi belum ketik OTP)
        if (!otp) {
            return res.json({
                message: "Silakan masukkan 6 digit kode OTP dari Google Authenticator Anda.",
                requiresOTP: true 
            });
        }

        // 5. Validasi OTP
        const isValidOTP = authenticator.check(otp, user.google_auth_secret);
        if (!isValidOTP) {
            return res.status(401).json({ message: "Kode OTP Salah atau sudah kedaluwarsa!" });
        }

        // 6. SUKSES LOGIN
        res.json({
            message: "Login Berhasil!",
            userId: user.id_users,
            role: user.role,
            success: true 
        });
    });
});

// ==========================================
// 2. ROUTE GANTI KATA SANDI (PERTAMA LOGIN)
// ==========================================
app.post('/api/change-first-password', async (req, res) => {
    const { userId, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: "Password baru minimal 6 karakter!" });
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const query = "UPDATE users SET password = ?, is_first_login = 0 WHERE id_users = ?";
        db.execute(query, [hashedPassword, userId], (err, results) => {
            if (err) return res.status(500).json({ message: "Gagal mengupdate password" });
            
            res.json({ message: "Kata sandi berhasil diperbarui! Silakan login kembali." });
        });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
});

// ==========================================
// 3. ROUTE TAMBAH USER (UNTUK ADMIN MANAJEMEN)
// ==========================================
app.post('/api/users', async (req, res) => {
    const { id_bidang, nama_lengkap, username, password, role, email } = req.body;

    if (!nama_lengkap || !username || !password || !role || !email) {
        return res.status(400).json({ message: "Semua kolom wajib diisi!" });
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const query = `
            INSERT INTO users (id_bidang, nama_lengkap, username, password, role, email) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        db.execute(query, [id_bidang, nama_lengkap, username, hashedPassword, role, email], (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: "Username atau Email sudah terdaftar di sistem!" });
                }
                return res.status(500).json({ message: "Gagal menyimpan user ke database", error: err.message });
            }
            res.status(201).json({ message: "Pengguna baru berhasil ditambahkan secara aman!" });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan saat memproses password." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server backend jalan di http://localhost:${PORT}`);
});