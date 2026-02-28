import React, { useState, useEffect } from "react";
import SidebarAdmin from "../../components/Sidebar/Admin/SidebarAdmin";
import "./KelolaSurat.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faEye,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

const KelolaSurat = () => {
  const [suratList, setSuratList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- STATE UNTUK PENCARIAN DAN FILTER ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");

  // State untuk form modal Approve (SUDAH DIUBAH UNTUK FITUR KUOTA NOMOR)
  const [availableNumbers, setAvailableNumbers] = useState<string[]>([]);
  const [selectedNumber, setSelectedNumber] = useState("");
  const [isLoadingNumbers, setIsLoadingNumbers] = useState(false);
  const [alasanTolak, setAlasanTolak] = useState("");

  // Modal Approve
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedSurat, setSelectedSurat] = useState<any>(null);
  
  // Modal Reject
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectSurat, setRejectSurat] = useState<any>(null);

  // --- 1. MENGAMBIL DATA DARI BACKEND ---
  const fetchSurat = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/surat");
      const data = await res.json();
      
      const formattedData = data.map((item: any) => {
         let statusFront = "Diproses";
         if (item.status === "disetujui") statusFront = "Selesai";
         if (item.status === "ditolak") statusFront = "Ditolak";
         
         const dateObj = new Date(item.tanggal_pengajuan);
         const dateStr = `${dateObj.getDate().toString().padStart(2, '0')}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getFullYear()}`;

         return {
           id: item.id,
           tanggal: dateStr,
           asal: item.asal || "Tanpa Bidang",
           jenis: item.jenis || "Tanpa Jenis",
           perihal: item.perihal || "-",
           status: statusFront,
           file: item.file || "" // Mengambil nama file dari backend
         };
      });
      setSuratList(formattedData);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSurat(); 
  }, []);

  // --- LOGIKA FILTER DAN PENCARIAN ---
  const filteredSuratList = suratList.filter((surat) => {
    // 1. Cek kecocokan teks pencarian (perihal atau jenis surat)
    const matchesSearch = 
      surat.perihal.toLowerCase().includes(searchTerm.toLowerCase()) || 
      surat.jenis.toLowerCase().includes(searchTerm.toLowerCase());
      
    // 2. Cek kecocokan status (jika "Semua", maka selalu true)
    const matchesStatus = filterStatus === "Semua" || surat.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // --- HANDLER BUKA FILE (TAB BARU) ---
  const handleViewFile = (fileName: string) => {
    if (!fileName) {
      alert("Pengajuan ini tidak memiliki file lampiran.");
      return;
    }
    // Membuka folder /uploads/ di backend
    window.open(`http://localhost:5000/uploads/${fileName}`, "_blank");
  };

  // --- HANDLER MODAL SETUJUI DENGAN API KUOTA NOMOR ---
  const handleApproveClick = async (surat: any) => {
    setSelectedSurat(surat);
    setShowApproveModal(true);
    setIsLoadingNumbers(true);

    try {
      // Memanggil API generate/cek nomor surat yang kita buat sebelumnya di index.js
      const res = await fetch(`http://localhost:5000/api/nomor-surat/tersedia/${surat.id}`);
      const result = await res.json();

      if (result.success && result.data.length > 0) {
        setAvailableNumbers(result.data);
        setSelectedNumber(result.data[0]); // Default ke opsi pertama
      } else {
        setAvailableNumbers([]);
        setSelectedNumber("");
      }
    } catch (err) {
      console.error("Gagal mengambil nomor surat:", err);
    } finally {
      setIsLoadingNumbers(false);
    }
  };

  const closeApproveModal = () => {
    setShowApproveModal(false);
    setSelectedSurat(null);
    setAvailableNumbers([]);
    setSelectedNumber("");
  };

  const submitApprove = async () => {
    if (!selectedNumber) return alert("Silakan pilih Nomor Surat Resmi!");

    try {
      // Menggunakan endpoint API Approve yang baru kita buat di index.js
      const res = await fetch(`http://localhost:5000/api/admin/pengajuan/${selectedSurat.id}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nomor_surat_terpilih: selectedNumber })
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Surat berhasil disetujui!");
        closeApproveModal();
        fetchSurat(); 
      } else {
        alert("Gagal: " + (data.message || "Terjadi kesalahan"));
      }
    } catch (err) {
      alert("Terjadi kesalahan server");
    }
  };

  // --- HANDLER MODAL TOLAK ---
  const handleRejectClick = (surat: any) => {
    setRejectSurat(surat);
    setAlasanTolak(""); 
    setShowRejectModal(true);
  };
  const closeRejectModal = () => {
    setShowRejectModal(false);
    setRejectSurat(null);
  };

  const submitReject = async () => {
    if (!alasanTolak) return alert("Silakan masukkan Alasan Penolakan!");

    try {
      const res = await fetch(`http://localhost:5000/api/admin/surat/${rejectSurat.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ catatan_admin: alasanTolak })
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        closeRejectModal();
        fetchSurat(); 
      } else {
        alert("Gagal: " + data.message);
      }
    } catch (err) {
      alert("Terjadi kesalahan server");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Selesai": return "badge success";
      case "Diproses": return "badge warning";
      case "Ditolak": return "badge danger";
      default: return "badge";
    }
  };

  return (
    <div className="dashboard-layout">
      <SidebarAdmin />

      <main className="dashboard-main">
        <div className="page-top">
          <h1 className="page-title">Sistem Pengelolaan Nomor dan Agenda Surat</h1>
          <div className="page-header">
            <h2>Kelola Surat</h2>
            <p>Daftar surat pengajuan yang perlu diperiksa dan dikelola</p>
          </div>
        </div>
        
        <div className="large-card">
          <div className="table-controls">
            
            {/* INPUT PENCARIAN KITA */}
            <div className="search-bar">
              <FontAwesomeIcon icon={faSearch} />
              <input 
                type="text" 
                placeholder="Cari berdasarkan perihal atau jenis surat..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* UBAH TOMBOL JADI DROPDOWN FILTER */}
            <div style={{ position: "relative" }}>
              <select 
                className="filter-btn" 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ 
                  appearance: "none", 
                  padding: "8px 16px 8px 36px", // Space untuk icon
                  borderRadius: "8px", 
                  border: "1px solid #e5e7eb", 
                  outline: "none", 
                  backgroundColor: "white", 
                  cursor: "pointer", 
                  fontSize: "14px", 
                  fontWeight: "500", 
                  color: "#374151" 
                }}
              >
                <option value="Semua">Semua Status</option>
                <option value="Diproses">Diproses</option>
                <option value="Selesai">Selesai</option>
                <option value="Ditolak">Ditolak</option>
              </select>
              <FontAwesomeIcon icon={faFilter} style={{ position: "absolute", left: "12px", top: "10px", color: "#6b7280" }} />
            </div>

          </div>

          <table className="history-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Asal Bidang</th>
                <th>Jenis Surat</th>
                <th>Perihal</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>Memuat Data...</td></tr>
              ) : filteredSuratList.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>Tidak ada surat yang sesuai kriteria</td></tr>
              ) : (
                // MENGGUNAKAN filteredSuratList bukan suratList
                filteredSuratList.map((surat) => (
                  <tr key={surat.id}>
                    <td>{surat.tanggal}</td>
                    <td>{surat.asal}</td>
                    <td>{surat.jenis}</td>
                    <td>{surat.perihal}</td>
                    <td>
                      <span className={getStatusBadge(surat.status)}>
                        {surat.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-action btn-approve"
                          title="Setujui Surat"
                          onClick={() => handleApproveClick(surat)}
                          disabled={surat.status !== "Diproses"} 
                          style={{ opacity: surat.status !== "Diproses" ? 0.3 : 1, cursor: surat.status !== "Diproses" ? "not-allowed" : "pointer" }}
                        >
                          <FontAwesomeIcon icon={faCheckCircle} />
                        </button>
                        
                        {/* TOMBOL LIHAT FILE */}
                        <button 
                          className="btn-action btn-view" 
                          title="Lihat Detail/Buka File" 
                          onClick={() => handleViewFile(surat.file)}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>

                        <button
                          className="btn-action btn-reject"
                          title="Kembalikan Surat"
                          onClick={() => handleRejectClick(surat)}
                          disabled={surat.status !== "Diproses"} 
                          style={{ opacity: surat.status !== "Diproses" ? 0.3 : 1, cursor: surat.status !== "Diproses" ? "not-allowed" : "pointer" }}
                        >
                          <FontAwesomeIcon icon={faTimesCircle} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* MODAL APPROVE (SETUJUI) */}
      {showApproveModal && selectedSurat && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Verifikasi & Berikan Nomor Surat</h3>
            </div>

            <div className="modal-section">
              <h4>Informasi Surat</h4>
              <div className="info-grid">
                <div className="info-label">Asal Bidang:</div>
                <div className="info-value">{selectedSurat.asal}</div>
                <div className="info-label">Jenis Surat:</div>
                <div className="info-value">{selectedSurat.jenis}</div>
                <div className="info-label">Perihal:</div>
                <div className="info-value">{selectedSurat.perihal}</div>
                <div className="info-label">Tgl. Pengajuan:</div>
                <div className="info-value">{selectedSurat.tanggal}</div>
              </div>
            </div>

            <div className="modal-section">
              <h4 style={{ marginBottom: "10px" }}>Pilih Nomor Surat Resmi</h4>
              {isLoadingNumbers ? (
                <p style={{ fontSize: "14px", color: "#3b82f6", fontStyle: "italic" }}>
                  Sedang mengambil kuota nomor dari sistem...
                </p>
              ) : (
                <select
                  className="input-nomor"
                  value={selectedNumber}
                  onChange={(e) => setSelectedNumber(e.target.value)}
                  style={{ width: "100%", cursor: "pointer" }}
                >
                  {availableNumbers.length > 0 ? (
                    availableNumbers.map((num, idx) => (
                      <option key={idx} value={num}>
                        {num}
                      </option>
                    ))
                  ) : (
                    <option value="">-- Tidak ada nomor tersedia --</option>
                  )}
                </select>
              )}
            </div>

            <div className="modal-actions">
              <button className="btn-cancel-modal" onClick={closeApproveModal}>Batal</button>
              <button 
                className="btn-submit-modal" 
                onClick={submitApprove}
                disabled={isLoadingNumbers || availableNumbers.length === 0}
                style={{ opacity: (isLoadingNumbers || availableNumbers.length === 0) ? 0.6 : 1 }}
              >
                Setujui & Terbitkan Nomor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REJECT (TOLAK) */}
      {showRejectModal && rejectSurat && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: "450px" }}>
            <div className="modal-header">
              <h3>Kembalikan Surat</h3>
            </div>

            <div className="modal-section">
              <div className="form-group" style={{ textAlign: "left", marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151", fontSize: "14px" }}>
                  Tindakan
                </label>
                <select className="input-nomor">
                  <option value="revisi">Revisi</option>
                  <option value="tolak">Tolak</option>
                </select>
              </div>

              <div className="form-group" style={{ textAlign: "left", marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#374151", fontSize: "14px" }}>
                  Alasan
                </label>
                <textarea
                  className="input-nomor"
                  rows={4}
                  value={alasanTolak}
                  onChange={(e) => setAlasanTolak(e.target.value)}
                  placeholder="Masukkan alasan pengembalian/penolakan surat..."
                  style={{ resize: "vertical", fontFamily: "inherit", fontWeight: "400" }}
                ></textarea>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel-modal" onClick={closeRejectModal}>Batal</button>
              <button
                className="btn-submit-modal"
                style={{ background: "#ef4444", boxShadow: "0 4px 6px rgba(239, 68, 68, 0.2)" }}
                onClick={submitReject}
              >
                Kirim Catatan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaSurat;