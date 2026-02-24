import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./Guide.css";

const Guide = () => {
  const navigate = useNavigate();

  return (
    <div className="guide-container">
      <Navbar />
      <div className="guide-content">
        <button className="btn-back" onClick={() => navigate("/help")}>
          <FontAwesomeIcon icon={faArrowLeft} /> Kembali ke Pusat Bantuan
        </button>
        <div className="faq-header">
          <h1>Panduan Pengguna</h1>
          <p>Langkah demi langkah cara menggunakan fitur utama di SIPENAS.</p>
        </div>
        <div className="guide-card">
          <h3>1. Cara Mengajukan Surat Baru (Operator)</h3>
          <p>Ikuti langkah berikut untuk meminta nomor surat resmi:</p>
          <div className="guide-step">
            <div className="step-number">1</div>
            <div className="step-text">Login sebagai <b>Operator</b> menggunakan akun Anda.</div>
          </div>
          <div className="guide-step">
            <div className="step-number">2</div>
            <div className="step-text">Pilih menu <b>Ajukan Surat</b> pada navigasi sebelah kiri.</div>
          </div>
          <div className="guide-step">
            <div className="step-number">3</div>
            <div className="step-text">Isi form pengajuan secara lengkap, seperti Perihal, Jenis Surat, dan upload dokumen lampiran jika ada.</div>
          </div>
          <div className="guide-step">
            <div className="step-number">4</div>
            <div className="step-text">Klik tombol <b>Kirim Pengajuan</b> dan tunggu proses verifikasi serta persetujuan dari Admin.</div>
          </div>
        </div>
        <div className="guide-card">
          <h3>2. Cara Memverifikasi & Mengelola Surat (Admin)</h3>
          <p>Langkah-langkah bagi Admin untuk memproses pengajuan nomor surat:</p>
          <div className="guide-step">
            <div className="step-number">1</div>
            <div className="step-text">Login sebagai <b>Admin</b> menggunakan akun Anda.</div>
          </div>
          <div className="guide-step">
            <div className="step-number">2</div>
            <div className="step-text">Pilih menu <b>Kelola Surat</b> pada navigasi sebelah kiri untuk melihat daftar antrean surat.</div>
          </div>
          <div className="guide-step">
            <div className="step-number">3</div>
            <div className="step-text">Cari surat dengan status <b>Diproses</b>. Gunakan fitur pencarian atau filter jika data terlalu banyak.</div>
          </div>
          <div className="guide-step">
            <div className="step-number">4</div>
            <div className="step-text">Klik icon <b>Setujui (Centang Hijau)</b> untuk memverifikasi dan menerbitkan nomor surat, atau klik icon <b>Kembalikan (Silang Merah)</b> untuk menolak/meminta revisi beserta catatan.</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Guide;