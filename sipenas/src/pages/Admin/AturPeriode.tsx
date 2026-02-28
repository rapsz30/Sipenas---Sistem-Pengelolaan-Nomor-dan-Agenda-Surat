import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Admin/SidebarAdmin";
import "./AturPeriode.css";
import InputField from "../../components/InputField/InputField";

const AturPeriode = () => {
  const navigate = useNavigate();

  const [namaPeriode, setNamaPeriode] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalBerakhir, setTanggalBerakhir] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!isConfirmed) {
      alert("Centang kotak persetujuan terlebih dahulu!");
      return;
    }

    if (!namaPeriode || !tanggalMulai || !tanggalBerakhir) {
      alert("Mohon lengkapi semua kolom bertanda bintang (*)");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/admin/periode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_periode: namaPeriode,
          tanggal_mulai: tanggalMulai,
          tanggal_berakhir: tanggalBerakhir,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Berhasil! " + data.message);
        navigate("/daftar-periode");
      } else {
        alert("Gagal: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="operator-layout">
      <Sidebar />

      <main className="operator-content">
        <div className="page-top">
          <h1 className="page-title">
            Sistem Pengelolaan Nomor dan Agenda Surat
          </h1>

          <div className="page-header">
            <h2>Pengaturan</h2>
            <p>Atur periode pencatatan nomor surat dan kuota surat</p>
          </div>
        </div>

        <div className="form-card">
          <div className="form-card-header">
            <h3>Formulir Periode Baru</h3>
            <span>Isi informasi periode pencatatan surat</span>
            <Link
              to="/daftar-periode"
              style={{
                fontSize: "14px",
                color: "#3b82f6",
                textDecoration: "none",
                fontWeight: "500",
                marginLeft: "67%",
              }}
            >
              Lihat Daftar Periode Tersimpan
            </Link>
          </div>
          
          <div className="form-group">
            <InputField 
              className="input" 
              label="Masukan Nama Periode Baru*" 
              value={namaPeriode}
              onChange={(e: any) => setNamaPeriode(e.target.value)}
            />
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Tanggal Mulai*</label>
              <div className="date-input">
                <input 
                  type="date" 
                  className="input" 
                  value={tanggalMulai}
                  onChange={(e) => setTanggalMulai(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Tanggal Berakhir*</label>
              <div className="date-input">
                <input 
                  type="date" 
                  className="input" 
                  value={tanggalBerakhir}
                  onChange={(e) => setTanggalBerakhir(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-footer">
            <div className="checkbox-group">
              <input 
                type="checkbox" 
                id="confirm" 
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
              />
              <label htmlFor="confirm">
                Saya telah memeriksa dan memastikan bahwa periode yang akan
                dibuat sudah benar dan sesuai.
              </label>
            </div>

            <div className="form-actions">
              <button 
                className="btn-submit" 
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Menyimpan..." : "Simpan Periode"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AturPeriode;