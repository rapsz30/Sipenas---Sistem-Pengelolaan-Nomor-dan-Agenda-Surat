const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { authenticator } = require("otplib");
const qrcode = require("qrcode");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ==========================================
// KONFIGURASI KONEKSI DATABASE
// ==========================================
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "db_sipenas",
});

db.connect((err) => {
  if (err) {
    console.error("Gagal koneksi ke MySQL:", err);
    return;
  }
  console.log("Terhubung ke database MySQL (XAMPP)");
});

// --- ROUTE TESTING ---
app.get("/", (req, res) => {
  res.send("API SIPENAS Berjalan...");
});

// ==========================================
// 1. ROUTE LOGIN (PASSWORD + GOOGLE AUTH)
// ==========================================
app.post("/api/login", async (req, res) => {
  const { username, password, otp } = req.body;

  // UBAH QUERY INI: Lakukan JOIN untuk mendapatkan nama_bidang (sebagai Jabatan)
  const query = `
    SELECT u.*, b.nama_bidang 
    FROM users u 
    LEFT JOIN bidang b ON u.id_bidang = b.id_bidang 
    WHERE u.username = ?
  `;

  db.execute(query, [username], async (err, results) => {
    if (err) return res.status(500).json({ message: "Server Error" });
    if (results.length === 0)
      return res.status(401).json({ message: "User tidak ditemukan" });

    const user = results[0];

    // 1. Cek Password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Password salah" });

    // 2. Cek Wajib Ganti Sandi (Login Pertama)
    if (
      user.is_first_login === 1 ||
      user.is_first_login == "1" ||
      user.is_first_login === true
    ) {
      return res.json({
        message:
          "Ini adalah login pertama Anda. Anda wajib mengganti kata sandi demi keamanan.",
        userId: user.id_users,
        requiresPasswordChange: true,
      });
    }

    // 3. Setup OTP (Jika belum punya rahasia Google Auth)
    if (!user.google_auth_secret) {
      const secret = authenticator.generateSecret();

      // Simpan secret ke database
      db.execute("UPDATE users SET google_auth_secret = ? WHERE id_users = ?", [
        secret,
        user.id_users,
      ]);

      // Buat QR Code URL
      const otpauth = authenticator.keyuri(user.username, "SIPENAS", secret);
      const qrCodeUrl = await qrcode.toDataURL(otpauth);

      return res.json({
        message:
          "Silakan scan QR Code ini di aplikasi Google Authenticator Anda.",
        requiresSetupOTP: true,
        qrCodeUrl: qrCodeUrl,
      });
    }

    // 4. Minta input OTP (Jika sudah punya secret tapi belum ketik OTP)
    if (!otp) {
      return res.json({
        message:
          "Silakan masukkan 6 digit kode OTP dari Google Authenticator Anda.",
        requiresOTP: true,
      });
    }

    // 5. Validasi OTP
    const isValidOTP = authenticator.check(otp, user.google_auth_secret);
    if (!isValidOTP) {
      return res
        .status(401)
        .json({ message: "Kode OTP Salah atau sudah kedaluwarsa!" });
    }

    // 6. SUKSES LOGIN
    res.json({
      message: "Login Berhasil!",
      userId: user.id_users,
      role: user.role,
      namaLengkap: user.nama_lengkap,
      jabatan: user.nama_bidang || "Administrator",
      success: true,
    });
  });
});

// ==========================================
// 2. ROUTE GANTI KATA SANDI (PERTAMA LOGIN)
// ==========================================
app.post("/api/change-first-password", async (req, res) => {
  const { userId, newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "Password baru minimal 6 karakter!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const query =
      "UPDATE users SET password = ?, is_first_login = 0 WHERE id_users = ?";
    db.execute(query, [hashedPassword, userId], (err, results) => {
      if (err)
        return res.status(500).json({ message: "Gagal mengupdate password" });

      res.json({
        message: "Kata sandi berhasil diperbarui! Silakan login kembali.",
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// ==========================================
// 3. ROUTE TAMBAH USER (UNTUK ADMIN MANAJEMEN)
// ==========================================
app.post("/api/users", async (req, res) => {
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

    db.execute(
      query,
      [id_bidang, nama_lengkap, username, hashedPassword, role, email],
      (err, results) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
              message: "Username atau Email sudah terdaftar di sistem!",
            });
          }
          return res.status(500).json({
            message: "Gagal menyimpan user ke database",
            error: err.message,
          });
        }
        res
          .status(201)
          .json({ message: "Pengguna baru berhasil ditambahkan secara aman!" });
      },
    );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat memproses password." });
  }
});

// ==========================================
// KONFIGURASI PENGIRIM EMAIL (NODEMAILER)
// ==========================================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ==========================================
// 4. ROUTE LUPA NAMA PENGGUNA (USERNAME)
// ==========================================
app.post("/api/forgot-username", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Alamat email wajib diisi!" });
  }

  // Cari user berdasarkan email
  const query = "SELECT username, nama_lengkap FROM users WHERE email = ?";
  db.execute(query, [email], (err, results) => {
    if (err)
      return res.status(500).json({ message: "Terjadi kesalahan server." });

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "Email tidak terdaftar di sistem kami." });
    }

    const user = results[0];

    // Siapkan kerangka isi email
    const mailOptions = {
      from: `"Admin SIPENAS" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Pemulihan Nama Pengguna (Username) SIPENAS",
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
            `,
    };

    // Kirim Email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Gagal kirim email:", error);
        return res.status(500).json({
          message:
            "Gagal mengirim email. Pastikan konfigurasi email server benar.",
        });
      }
      res.json({
        message:
          "Nama pengguna telah berhasil dikirim ke email Anda! Silakan cek kotak masuk.",
      });
    });
  });
});

// ==========================================
// 5. ROUTE MINTA OTP LUPA PASSWORD (KIRIM KE EMAIL)
// ==========================================
app.post("/api/forgot-password-request", (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ message: "Alamat email wajib diisi!" });

  // Cek apakah email ada di database
  const queryCheck = "SELECT id_users, nama_lengkap FROM users WHERE email = ?";
  db.execute(queryCheck, [email], (err, results) => {
    if (err)
      return res.status(500).json({ message: "Terjadi kesalahan server." });
    if (results.length === 0)
      return res.status(404).json({ message: "Email tidak terdaftar." });

    const user = results[0];

    // Generate 6 digit OTP acak
    const otpEmail = Math.floor(100000 + Math.random() * 900000).toString();

    // Buat waktu kadaluarsa (15 menit dari sekarang)
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 15);

    // Simpan OTP dan Expiry ke database
    const queryUpdate =
      "UPDATE users SET otp_email = ?, otp_expiry = ? WHERE email = ?";
    db.execute(queryUpdate, [otpEmail, expiryDate, email], (errUpdate) => {
      if (errUpdate)
        return res.status(500).json({ message: "Gagal memproses permintaan." });

      // Kirim email
      const mailOptions = {
        from: `"Admin SIPENAS" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Kode OTP Reset Kata Sandi SIPENAS",
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
                `,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error)
          return res.status(500).json({ message: "Gagal mengirim email OTP." });
        res.json({ message: "Kode OTP telah dikirim ke email Anda!" });
      });
    });
  });
});

// ==========================================
// 6. ROUTE VERIFIKASI OTP & RESET PASSWORD
// ==========================================
app.post("/api/forgot-password-reset", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "Semua data wajib diisi!" });
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "Kata sandi baru minimal 6 karakter!" });
  }

  // Cek kecocokan email, OTP, dan waktu kadaluarsa
  const query = "SELECT * FROM users WHERE email = ? AND otp_email = ?";
  db.execute(query, [email, otp], async (err, results) => {
    if (err)
      return res.status(500).json({ message: "Terjadi kesalahan server." });

    if (results.length === 0) {
      return res.status(400).json({ message: "Kode OTP salah!" });
    }

    const user = results[0];
    const now = new Date();

    // Cek apakah OTP sudah kadaluarsa
    if (new Date(user.otp_expiry) < now) {
      return res
        .status(400)
        .json({ message: "Kode OTP sudah kadaluarsa. Silakan minta ulang." });
    }

    try {
      // Hash password baru
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password dan kosongkan kembali OTP di database
      const queryUpdate =
        "UPDATE users SET password = ?, otp_email = NULL, otp_expiry = NULL WHERE email = ?";
      db.execute(queryUpdate, [hashedPassword, email], (errUpdate) => {
        if (errUpdate)
          return res.status(500).json({ message: "Gagal mereset kata sandi." });
        res.json({
          message:
            "Kata sandi berhasil direset! Silakan login dengan sandi baru.",
        });
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Terjadi kesalahan saat memproses sandi." });
    }
  });
});

// ==========================================
// 7. ROUTE DASHBOARD OPERATOR
// ==========================================
app.get("/api/dashboard/operator/:userId", (req, res) => {
  const userId = req.params.userId;

  // 1. Query untuk menghitung statistik surat milik user ini
  const queryStats = `
        SELECT 
            COUNT(*) as totalSurat,
            SUM(CASE WHEN status_pengajuan = 'pending' THEN 1 ELSE 0 END) as pendingSurat,
            SUM(CASE WHEN status_pengajuan = 'disetujui' THEN 1 ELSE 0 END) as disetujuiSurat,
            SUM(CASE WHEN status_pengajuan = 'ditolak' THEN 1 ELSE 0 END) as ditolakSurat
        FROM pengajuan_surat
        WHERE id_user = ?
    `;

  // 2. Query untuk mengambil riwayat tabel (Join dengan jenis_surat)
  const queryTable = `
        SELECT ps.*, js.nama_jenis, p.nama_periode
        FROM pengajuan_surat ps
        LEFT JOIN jenis_surat js ON ps.id_jenis_surat = js.id_jenis_surat
        LEFT JOIN periode p ON ps.id_periode = p.id_periode
        WHERE ps.id_user = ?
        ORDER BY ps.tanggal_pengajuan DESC
    `;

  db.execute(queryStats, [userId], (errStats, statsResults) => {
    if (errStats)
      return res.status(500).json({ message: "Gagal mengambil statistik" });

    db.execute(queryTable, [userId], (errTable, tableResults) => {
      if (errTable)
        return res.status(500).json({ message: "Gagal mengambil data tabel" });

      // Kirim gabungan statistik dan riwayat
      res.json({
        stats: statsResults[0],
        history: tableResults,
      });
    });
  });
});

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Auto create folder uploads jika belum ada
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Folder uploads berhasil dibuat");
}
// 1. Konfigurasi penyimpanan file dengan Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // pakai path absolut
  },
  filename: (req, file, cb) => {
    // Beri nama unik agar file tidak tertimpa
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
app.use("/uploads", express.static(uploadDir));
// ==========================================
// 8. ROUTE AMBIL JENIS SURAT (UNTUK DROPDOWN)
// ==========================================
app.get("/api/jenis-surat", (req, res) => {
  // Ubah db.execute menjadi db.query
  db.query("SELECT * FROM jenis_surat", (err, results) => {
    if (err) {
      console.error("Error Database:", err);
      return res
        .status(500)
        .json({ message: "Gagal mengambil jenis surat", error: err.message });
    }
    res.json(results);
  });
});
// ==========================================
// 9. ROUTE AJUKAN SURAT (DENGAN FILE)
// ==========================================
app.post("/api/pengajuan", upload.single("file_lampiran"), (req, res) => {
  const {
    id_user,
    id_jenis_surat,
    tanggal_pengajuan,
    perihal_surat,
    tujuan_surat,
    keterangan_surat,
  } = req.body;
  const file_lampiran = req.file ? req.file.filename : null;

  if (
    !id_user ||
    !id_jenis_surat ||
    !tanggal_pengajuan ||
    !perihal_surat ||
    !file_lampiran
  ) {
    return res
      .status(400)
      .json({ message: "Data wajib belum lengkap atau file belum diunggah!" });
  }

  // Cari ID Periode yang sedang aktif (Opsional, asumsikan ada tabel periode)
  db.execute(
    "SELECT id_periode FROM periode WHERE status_periode = 'aktif' LIMIT 1",
    (err, periodeResults) => {
      let id_periode = null; // Bisa null jika tidak ada periode aktif
      if (!err && periodeResults.length > 0) {
        id_periode = periodeResults[0].id_periode;
      }

      const query = `
        INSERT INTO pengajuan_surat 
        (id_user, id_jenis_surat, id_periode, tanggal_pengajuan, perihal_surat, keterangan_surat, file_lampiran, status_pengajuan)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
      `;

      db.execute(
        query,
        [
          id_user,
          id_jenis_surat,
          id_periode,
          tanggal_pengajuan,
          perihal_surat,
          keterangan_surat,
          file_lampiran,
        ],
        (errInsert) => {
          if (errInsert) {
            console.error(errInsert);
            return res.status(500).json({
              message: "Gagal menyimpan pengajuan surat ke database.",
            });
          }
          res.json({ message: "Pengajuan surat berhasil dikirim!" });
        },
      );
    },
  );
});

// ==========================================
// 10. ROUTE ADMIN: AMBIL SEMUA PENGAJUAN SURAT
// ==========================================
app.get("/api/admin/surat", (req, res) => {
  const query = `
        SELECT 
            ps.id_pengajuan_surat as id,
            ps.tanggal_pengajuan,
            ps.perihal_surat as perihal,
            ps.status_pengajuan as status,
            ps.file_lampiran as file, 
            ps.nomor_surat_resmi, /* TAMBAHKAN BARIS INI */
            js.nama_jenis as jenis,
            b.nama_bidang as asal
        FROM pengajuan_surat ps
        LEFT JOIN users u ON ps.id_user = u.id_users
        LEFT JOIN bidang b ON u.id_bidang = b.id_bidang
        LEFT JOIN jenis_surat js ON ps.id_jenis_surat = js.id_jenis_surat
        ORDER BY ps.tanggal_pengajuan DESC
    `;
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal mengambil data surat" });
    }
    res.json(results);
  });
});

// ==========================================
// 11. ROUTE ADMIN: SETUJUI SURAT
// ==========================================
app.post("/api/admin/surat/:id/approve", (req, res) => {
  const { id } = req.params;
  const { nomor_surat } = req.body;

  if (!nomor_surat)
    return res.status(400).json({ message: "Nomor surat wajib diisi!" });

  const query = `
        UPDATE pengajuan_surat 
        SET status_pengajuan = 'disetujui', nomor_surat_resmi = ?, tanggal_disetujui = NOW() 
        WHERE id_pengajuan_surat = ?
    `;
  db.query(query, [nomor_surat, id], (err) => {
    if (err) return res.status(500).json({ message: "Gagal menyetujui surat" });
    res.json({ message: "Surat berhasil disetujui dan diberikan nomor!" });
  });
});

// ==========================================
// 12. ROUTE ADMIN: TOLAK/REVISI SURAT
// ==========================================
app.post("/api/admin/surat/:id/reject", (req, res) => {
  const { id } = req.params;
  const { catatan_admin } = req.body;

  if (!catatan_admin)
    return res.status(400).json({ message: "Alasan wajib diisi!" });

  const query = `
        UPDATE pengajuan_surat 
        SET status_pengajuan = 'ditolak', catatan_admin = ? 
        WHERE id_pengajuan_surat = ?
    `;
  db.query(query, [catatan_admin, id], (err) => {
    if (err) return res.status(500).json({ message: "Gagal menolak surat" });
    res.json({ message: "Surat berhasil dikembalikan dengan catatan!" });
  });
});

// ==========================================
// 13. ROUTE ADMIN: TAMBAH PERIODE BARU
// ==========================================
app.post("/api/admin/periode", (req, res) => {
  const { nama_periode, tanggal_mulai, tanggal_berakhir } = req.body;

  if (!nama_periode || !tanggal_mulai || !tanggal_berakhir) {
    return res.status(400).json({ message: "Semua data wajib diisi!" });
  }

  const query = `
        INSERT INTO periode (nama_periode, tanggal_mulai, tanggal_berakhir, status_periode) 
        VALUES (?, ?, ?, 'aktif')
    `;

  db.query(query, [nama_periode, tanggal_mulai, tanggal_berakhir], (err) => {
    if (err) {
      console.error("Gagal menambah periode:", err);
      return res
        .status(500)
        .json({ message: "Gagal menyimpan periode ke database." });
    }
    res.json({ message: "Periode berhasil ditambahkan!" });
  });
});

// ==========================================
// 14. ROUTE ADMIN: AMBIL SEMUA PERIODE
// ==========================================
app.get("/api/admin/periode", (req, res) => {
  const query = "SELECT * FROM periode ORDER BY id_periode DESC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Gagal mengambil data periode:", err);
      return res.status(500).json({ message: "Gagal mengambil data periode" });
    }
    res.json(results);
  });
});

// ==========================================
// 15. ROUTE ADMIN: DASHBOARD (STATISTIK, AKTIVITAS, KATEGORI)
// ==========================================
app.get("/api/admin/dashboard", (req, res) => {
  // 1. Query Kotak Statistik
  const queryStats = `
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status_pengajuan = 'pending' THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN status_pengajuan = 'disetujui' THEN 1 ELSE 0 END) as disetujui
        FROM pengajuan_surat
    `;

  // 2. Query Aktivitas Terkini (5 Surat Terbaru)
  const queryAktivitas = `
        SELECT 
            ps.tanggal_pengajuan,
            b.nama_bidang as bidang,
            js.nama_jenis as jenis,
            ps.status_pengajuan as status
        FROM pengajuan_surat ps
        LEFT JOIN users u ON ps.id_user = u.id_users
        LEFT JOIN bidang b ON u.id_bidang = b.id_bidang
        LEFT JOIN jenis_surat js ON ps.id_jenis_surat = js.id_jenis_surat
        ORDER BY ps.tanggal_pengajuan DESC
        LIMIT 5
    `;

  // 3. Query Laporan Berdasarkan Kategori
  const queryKategori = `
        SELECT 
            js.nama_jenis as nama,
            IFNULL(SUM(CASE WHEN ps.status_pengajuan = 'pending' THEN 1 ELSE 0 END), 0) as menunggu,
            IFNULL(SUM(CASE WHEN ps.status_pengajuan = 'disetujui' THEN 1 ELSE 0 END), 0) as disetujui,
            IFNULL(SUM(CASE WHEN ps.status_pengajuan = 'ditolak' THEN 1 ELSE 0 END), 0) as ditolak
        FROM jenis_surat js
        LEFT JOIN pengajuan_surat ps ON js.id_jenis_surat = ps.id_jenis_surat
        GROUP BY js.id_jenis_surat, js.nama_jenis
    `;

  // Eksekusi berurutan
  db.query(queryStats, (errStats, resultsStats) => {
    if (errStats)
      return res.status(500).json({ message: "Error ambil statistik" });

    db.query(queryAktivitas, (errAktivitas, resultsAktivitas) => {
      if (errAktivitas)
        return res.status(500).json({ message: "Error ambil aktivitas" });

      db.query(queryKategori, (errKategori, resultsKategori) => {
        if (errKategori)
          return res.status(500).json({ message: "Error ambil kategori" });

        res.json({
          stats: resultsStats[0] || { total: 0, pending: 0, disetujui: 0 },
          aktivitas: resultsAktivitas || [],
          kategori: resultsKategori || [],
        });
      });
    });
  });
});

// ======================================================================
// ROUTE 1: GET NOMOR SURAT TERSEDIA (GENERATE BUFFER OTOMATIS JIKA KOSONG)
// ======================================================================
app.get("/api/nomor-surat/tersedia/:id_pengajuan", async (req, res) => {
  const { id_pengajuan } = req.params;

  // 1. Ambil data pengajuan untuk tahu tanggal dan id_jenis_surat
  const queryPengajuan = `
    SELECT p.tanggal_pengajuan, p.id_jenis_surat, j.kode_klasifikasi 
    FROM pengajuan_surat p 
    JOIN jenis_surat j ON p.id_jenis_surat = j.id_jenis_surat 
    WHERE p.id_pengajuan_surat = ?
  `;

  db.query(queryPengajuan, [id_pengajuan], (err, results) => {
    if (err || results.length === 0)
      return res.status(500).json({ message: "Error ambil data pengajuan" });

    const pengajuan = results[0];

    // Format tanggal MySQL (hindari masalah zona waktu)
    const dateObj = new Date(pengajuan.tanggal_pengajuan);
    // Tambahkan koreksi waktu lokal agar tanggal tidak mundur 1 hari
    dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset());
    const tglPengajuan = dateObj.toISOString().split("T")[0];

    // 2. Cek apakah di tanggal tersebut sudah ada nomor yang available
    db.query(
      `SELECT nomor_surat FROM nomor_surat WHERE id_jenis_surat = ? AND tanggal = ? AND available = 'Yes' ORDER BY id_nomor ASC`,
      [pengajuan.id_jenis_surat, tglPengajuan],
      (err, availableNumbers) => {
        if (err)
          return res
            .status(500)
            .json({ message: "Error cek ketersediaan nomor" });

        // JIKA SUDAH ADA NOMOR (Entah hari ini, atau sisa buffer dari backdate), langsung kembalikan datanya
        if (availableNumbers.length > 0) {
          return res.json({
            success: true,
            data: availableNumbers.map((n) => n.nomor_surat),
          });
        }

        // JIKA KOSONG: KITA GENERATE BARU + 10 BUFFER SESUAI RUMUS ANDA
        // Cari nomor urut terakhir (paling besar) dari keseluruhan tabel untuk jenis_surat ini
        db.query(
          `SELECT nomor_surat FROM nomor_surat WHERE id_jenis_surat = ? ORDER BY id_nomor DESC LIMIT 1`,
          [pengajuan.id_jenis_surat],
          (err, lastRecord) => {
            if (err)
              return res.status(500).json({ message: "Error cek max nomor" });

            let lastSequence = 0;
            if (lastRecord.length > 0) {
              // Ekstrak angka dari format "C.01/12" -> dapat angka 12
              const parts = lastRecord[0].nomor_surat.split("/");
              if (parts.length === 2) {
                lastSequence = parseInt(parts[1]) || 0;
              }
            }

            // Siapkan 11 nomor baru (1 untuk dipakai, 10 untuk kuota tambahan)
            const newNumbers = [];
            for (let i = 1; i <= 11; i++) {
              const nextSeq = lastSequence + i;
              // Format: KodeKlasifikasi/NomorUrut (Misal: C.01/13)
              newNumbers.push([
                pengajuan.id_jenis_surat,
                `${pengajuan.kode_klasifikasi}/${nextSeq}`,
                tglPengajuan,
                "Yes",
              ]);
            }

            // Insert massal ke tabel nomor_surat
            db.query(
              `INSERT INTO nomor_surat (id_jenis_surat, nomor_surat, tanggal, available) VALUES ?`,
              [newNumbers],
              (err, insertResult) => {
                if (err)
                  return res
                    .status(500)
                    .json({ message: "Error insert nomor baru", error: err });

                // Kembalikan daftar nomor yang baru saja digenerate
                const generatedNumbers = newNumbers.map((n) => n[1]);
                res.json({ success: true, data: generatedNumbers });
              },
            );
          },
        );
      },
    );
  });
});

// ======================================================================
// ROUTE 2: ADMIN APPROVE SURAT (MEMAKAI NOMOR YANG DIPILIH)
// ======================================================================
app.put("/api/admin/pengajuan/:id/approve", (req, res) => {
  const { id } = req.params;
  const { nomor_surat_terpilih } = req.body; // Ini akan dikirim dari Modal Frontend Admin

  if (!nomor_surat_terpilih)
    return res
      .status(400)
      .json({ message: "Nomor surat harus dipilih/tersedia!" });

  // 1. Kunci nomor tersebut di tabel nomor_surat (Tandai 'No' dan catat waktu dipakai)
  db.query(
    `UPDATE nomor_surat SET available = 'No', tanggal_dipakai = NOW() WHERE nomor_surat = ?`,
    [nomor_surat_terpilih],
    (err, updateNomor) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Gagal update status di bank nomor surat" });

      // 2. Update status pengajuan menjadi disetujui dan pasang nomor resminya
      db.query(
        `UPDATE pengajuan_surat SET status_pengajuan = 'disetujui', nomor_surat_resmi = ? WHERE id_pengajuan_surat = ?`,
        [nomor_surat_terpilih, id],
        (err, updatePengajuan) => {
          if (err)
            return res
              .status(500)
              .json({ message: "Gagal menyetujui pengajuan surat" });

          res.json({
            success: true,
            message:
              "Surat berhasil disetujui dengan nomor: " + nomor_surat_terpilih,
          });
        },
      );
    },
  );
});

const cron = require("node-cron");

// CRON JOB: Berjalan setiap jam 23:59 WIB untuk generate 10 Kuota Mundur
cron.schedule(
  "59 23 * * *",
  async () => {
    try {
      const [jenisSurat] = await db
        .promise()
        .query("SELECT * FROM jenis_surat");
      const today = new Date()
        .toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" })
        .split("T")[0];

      for (const jenis of jenisSurat) {
        const [rows] = await db
          .promise()
          .query(
            "SELECT MAX(nomor_urut) as maxUrut FROM nomor_surat WHERE id_jenis_surat = ?",
            [jenis.id_jenis_surat],
          );
        let currentMax = rows[0].maxUrut || 0;

        for (let i = 1; i <= 10; i++) {
          currentMax++;
          const kode = jenis.kode_klasifikasi;
          let formatSurat = "";

          if (["SKD.01", "SKK.01", "TA.01", "ST.01"].includes(kode)) {
            formatSurat = `${kode}/${currentMax}`;
          } else if (kode === "C.01") {
            formatSurat = `800/${kode}/${currentMax}-Sekre`;
          } else {
            formatSurat = `${kode}/${currentMax}`;
          }

          await db.promise().query(
            `INSERT INTO nomor_surat (nomor_surat, nomor_urut, tanggal, id_jenis_surat, available) 
                     VALUES (?, ?, ?, ?, 'yes')`,
            [formatSurat, currentMax, today, jenis.id_jenis_surat],
          );
        }
      }
      console.log(
        "Cron Job Sukses: Kuota penomoran mundur (10) berhasil dicadangkan.",
      );
    } catch (error) {
      console.error("Error Cron Job:", error);
    }
  },
  {
    timezone: "Asia/Jakarta",
  },
);

// ENDPOINT UNTUK MENDAPATKAN OPSI NOMOR SURAT (DROPDOWN)
app.get("/api/nomor-surat/options", async (req, res) => {
  const { tanggal, id_jenis_surat } = req.query;

  // Pastikan format tanggal hanya "YYYY-MM-DD" dan menggunakan zona waktu lokal (WIB)
  const requestDate = new Date(tanggal)
    .toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" })
    .split("T")[0];
  const today = new Date()
    .toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" })
    .split("T")[0];

  try {
    if (requestDate >= today) {
      // SKENARIO 1: HARI INI (Cuma 1 Opsi, Generate Nomor Baru)
      const [rows] = await db
        .promise()
        .query(
          "SELECT MAX(nomor_urut) as maxUrut FROM nomor_surat WHERE id_jenis_surat = ?",
          [id_jenis_surat],
        );
      // Tambahkan 1 dari nomor terakhir yang ada di database
      const nextUrut = (rows[0].maxUrut || 0) + 1;

      const [jenisRow] = await db
        .promise()
        .query(
          "SELECT kode_klasifikasi FROM jenis_surat WHERE id_jenis_surat = ?",
          [id_jenis_surat],
        );
      const kode = jenisRow[0].kode_klasifikasi;

      let formatSurat = "";
      if (["SKD.01", "SKK.01", "TA.01", "ST.01"].includes(kode)) {
        formatSurat = `${kode}/${nextUrut}`;
      } else if (kode === "C.01") {
        formatSurat = `800/${kode}/${nextUrut}-Sekre`;
      } else {
        formatSurat = `${kode}/${nextUrut}`;
      }

      return res.json([
        {
          is_new: true, // Flag bahwa ini bukan dari kuota mundur
          nomor_surat: formatSurat,
          nomor_urut: nextUrut,
        },
      ]);
    } else {
      // SKENARIO 2: TANGGAL MUNDUR (Maksimal 10 Opsi dari kuota sisa cron job)
      const [options] = await db.promise().query(
        `SELECT id_nomor_surat, nomor_surat, nomor_urut 
                 FROM nomor_surat 
                 WHERE DATE(tanggal) = ? AND id_jenis_surat = ? AND available = 'yes'
                 ORDER BY nomor_urut ASC LIMIT 10`,
        [requestDate, id_jenis_surat],
      );

      return res.json(
        options.map((opt) => ({
          is_new: false,
          id_nomor_surat: opt.id_nomor_surat,
          nomor_surat: opt.nomor_surat,
          nomor_urut: opt.nomor_urut,
        })),
      );
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ENDPOINT UNTUK ACC SURAT & PENOMORAN
app.put("/api/pengajuan-surat/:id/acc", async (req, res) => {
  const { id } = req.params;
  const { nomor_surat_resmi, nomor_data } = req.body;

  try {
    await db.promise().query("BEGIN"); // Mulai transaksi DB

    // 1. Dapatkan data pengajuan
    const [pengajuan] = await db
      .promise()
      .query(
        "SELECT tanggal, id_jenis_surat FROM pengajuan_surat WHERE id_pengajuan = ?",
        [id],
      );

    if (pengajuan.length === 0) {
      await db.promise().query("ROLLBACK");
      return res.status(404).json({ message: "Pengajuan tidak ditemukan" });
    }

    const surat = pengajuan[0];
    const tglSurat = new Date(surat.tanggal)
      .toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" })
      .split("T")[0];

    // 2. Kunci Logika Penomoran
    if (nomor_data.is_new) {
      // SKENARIO 1 (HARI INI): Insert nomor baru ini ke database dengan status available = 'no' (terpakai).
      // Ini yang membuat surat hari ini berikutnya akan mendapatkan nomor selanjutnya (+1).
      await db.promise().query(
        `INSERT INTO nomor_surat (nomor_surat, nomor_urut, tanggal, id_jenis_surat, available) 
             VALUES (?, ?, ?, ?, 'no')`,
        [
          nomor_data.nomor_surat,
          nomor_data.nomor_urut,
          tglSurat,
          surat.id_jenis_surat,
        ],
      );
    } else {
      // SKENARIO 2 (TANGGAL MUNDUR): Ubah status kuota nomor tersebut menjadi 'no' (terpakai).
      await db
        .promise()
        .query(
          `UPDATE nomor_surat SET available = 'no' WHERE id_nomor_surat = ?`,
          [nomor_data.id_nomor_surat],
        );
    }

    // 3. Update status surat pengajuan
    await db
      .promise()
      .query(
        "UPDATE pengajuan_surat SET status = 'Selesai', nomor_surat_resmi = ? WHERE id_pengajuan = ?",
        [nomor_surat_resmi, id],
      );

    await db.promise().query("COMMIT"); // Simpan semua perubahan
    res.json({ message: "Surat berhasil disetujui dan dinomori" });
  } catch (error) {
    await db.promise().query("ROLLBACK"); // Batalkan jika ada error
    console.error("Gagal menyetujui surat:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server backend jalan di http://localhost:${PORT}`);
});
