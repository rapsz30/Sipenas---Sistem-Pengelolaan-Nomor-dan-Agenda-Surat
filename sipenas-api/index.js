const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { authenticator } = require('otplib');
const qrcode = require('qrcode');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

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

// ==========================================
// KONFIGURASI PENGIRIM EMAIL (NODEMAILER)
// ==========================================
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ==========================================
// 4. ROUTE LUPA NAMA PENGGUNA (USERNAME)
// ==========================================
app.post('/api/forgot-username', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Alamat email wajib diisi!" });
    }

    // Cari user berdasarkan email
    const query = "SELECT username, nama_lengkap FROM users WHERE email = ?";
    db.execute(query, [email], (err, results) => {
        if (err) return res.status(500).json({ message: "Terjadi kesalahan server." });
        
        if (results.length === 0) {
            return res.status(404).json({ message: "Email tidak terdaftar di sistem kami." });
        }

        const user = results[0];

        // Siapkan kerangka isi email
        const mailOptions = {
            from: `"Admin SIPENAS" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Pemulihan Nama Pengguna (Username) SIPENAS',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #2b6cb0;">Halo, ${user.nama_lengkap}!</h2>
                    <p>Anda telah meminta informasi nama pengguna (username) untuk akun SIPENAS Anda.</p>
                    <p>Berikut adalah detail login Anda:</p>
                    <div style="background-color: #f1f5f9; padding: 10px 20px; font-size: 20px; font-weight: bold; border-left: 4px solid #3b82f6; display: inline-block;">
                        ${user.username}
                    </div>
                    <p style="margin-top: 20px;">Silakan kembali ke halaman login dan gunakan username tersebut untuk masuk.</p>
                    <br/>
                    <p>Terima kasih,</p>
                    <p><strong>Tim Administrator SIPENAS</strong></p>
                </div>
            `
        };

        // Kirim Email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Gagal kirim email:", error);
                return res.status(500).json({ message: "Gagal mengirim email. Pastikan konfigurasi email server benar." });
            }
            res.json({ message: "Nama pengguna telah berhasil dikirim ke email Anda! Silakan cek kotak masuk." });
        });
    });
});

// ==========================================
// 5. ROUTE MINTA OTP LUPA PASSWORD (KIRIM KE EMAIL)
// ==========================================
app.post('/api/forgot-password-request', (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Alamat email wajib diisi!" });

    // Cek apakah email ada di database
    const queryCheck = "SELECT id_users, nama_lengkap FROM users WHERE email = ?";
    db.execute(queryCheck, [email], (err, results) => {
        if (err) return res.status(500).json({ message: "Terjadi kesalahan server." });
        if (results.length === 0) return res.status(404).json({ message: "Email tidak terdaftar." });

        const user = results[0];

        // Generate 6 digit OTP acak
        const otpEmail = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Buat waktu kadaluarsa (15 menit dari sekarang)
        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 15);

        // Simpan OTP dan Expiry ke database
        const queryUpdate = "UPDATE users SET otp_email = ?, otp_expiry = ? WHERE email = ?";
        db.execute(queryUpdate, [otpEmail, expiryDate, email], (errUpdate) => {
            if (errUpdate) return res.status(500).json({ message: "Gagal memproses permintaan." });

            // Kirim email
            const mailOptions = {
                from: `"Admin SIPENAS" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Kode OTP Reset Kata Sandi SIPENAS',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                        <h2 style="color: #2b6cb0;">Halo, ${user.nama_lengkap}!</h2>
                        <p>Kami menerima permintaan untuk mereset kata sandi akun Anda.</p>
                        <p>Berikut adalah kode rahasia OTP Anda (berlaku selama 15 menit):</p>
                        <div style="background-color: #f1f5f9; padding: 10px 20px; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-left: 4px solid #3b82f6; display: inline-block;">
                            ${otpEmail}
                        </div>
                        <p style="margin-top: 20px; color: red; font-size: 12px;">Jangan berikan kode ini kepada siapapun.</p>
                    </div>
                `
            };

            transporter.sendMail(mailOptions, (error) => {
                if (error) return res.status(500).json({ message: "Gagal mengirim email OTP." });
                res.json({ message: "Kode OTP telah dikirim ke email Anda!" });
            });
        });
    });
});

// ==========================================
// 6. ROUTE VERIFIKASI OTP & RESET PASSWORD
// ==========================================
app.post('/api/forgot-password-reset', async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: "Semua data wajib diisi!" });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ message: "Kata sandi baru minimal 6 karakter!" });
    }

    // Cek kecocokan email, OTP, dan waktu kadaluarsa
    const query = "SELECT * FROM users WHERE email = ? AND otp_email = ?";
    db.execute(query, [email, otp], async (err, results) => {
        if (err) return res.status(500).json({ message: "Terjadi kesalahan server." });
        
        if (results.length === 0) {
            return res.status(400).json({ message: "Kode OTP salah!" });
        }

        const user = results[0];
        const now = new Date();

        // Cek apakah OTP sudah kadaluarsa
        if (new Date(user.otp_expiry) < now) {
            return res.status(400).json({ message: "Kode OTP sudah kadaluarsa. Silakan minta ulang." });
        }

        try {
            // Hash password baru
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update password dan kosongkan kembali OTP di database
            const queryUpdate = "UPDATE users SET password = ?, otp_email = NULL, otp_expiry = NULL WHERE email = ?";
            db.execute(queryUpdate, [hashedPassword, email], (errUpdate) => {
                if (errUpdate) return res.status(500).json({ message: "Gagal mereset kata sandi." });
                res.json({ message: "Kata sandi berhasil direset! Silakan login dengan sandi baru." });
            });
        } catch (error) {
            res.status(500).json({ message: "Terjadi kesalahan saat memproses sandi." });
        }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server backend jalan di http://localhost:${PORT}`);
});