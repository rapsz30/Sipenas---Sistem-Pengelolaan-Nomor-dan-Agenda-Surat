import React, { useState } from "react";
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
  // Dummy data untuk tabel surat
  const [suratList] = useState([
    {
      id: 1,
      tanggal: "01-02-2026",
      asal: "Bidang Umum",
      jenis: "Surat Keluar Dinas",
      perihal: "Undangan Rapat Evaluasi",
      status: "Diproses",
    },
    {
      id: 2,
      tanggal: "02-02-2026",
      asal: "Bidang Keuangan",
      jenis: "Surat Keputusan Kadis",
      perihal: "Pencairan Anggaran Q1",
      status: "Selesai",
    },
    {
      id: 3,
      tanggal: "03-02-2026",
      asal: "Bidang Kepegawaian",
      jenis: "Surat Cuti",
      perihal: "Cuti Tahunan a.n. Budi",
      status: "Diproses",
    },
    {
      id: 4,
      tanggal: "04-02-2026",
      asal: "Bidang Umum",
      jenis: "Surat Tidak Absen",
      perihal: "Keterangan Sakit a.n. Siti",
      status: "Ditolak",
    },
  ]);

  // STATE UNTUK MODAL APPROVE
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedSurat, setSelectedSurat] = useState<any>(null);

  // FUNGSI UNTUK MEMBUKA MODAL
  const handleApproveClick = (surat: any) => {
    setSelectedSurat(surat);
    setShowApproveModal(true);
  };

  // FUNGSI UNTUK MENUTUP MODAL
  const closeApproveModal = () => {
    setShowApproveModal(false);
    setSelectedSurat(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Selesai":
        return "badge success";
      case "Diproses":
        return "badge warning";
      case "Ditolak":
        return "badge danger";
      default:
        return "badge";
    }
  };

  return (
    <div className="dashboard-layout">
      <SidebarAdmin />

      <main className="dashboard-main">
        {/* Top Header */}
        <div className="page-top">
          <h1 className="page-title">
            Sistem Pengelolaan Nomor dan Agenda Surat
          </h1>
          <div className="page-header">
            <h2>Kelola Surat</h2>
            <p>Daftar surat pengajuan yang perlu diperiksa dan dikelola</p>
          </div>
        </div>

        {/* Tabel Area */}
        <div className="large-card">
          <div className="table-controls">
            <div className="search-bar">
              <FontAwesomeIcon icon={faSearch} />
              <input type="text" placeholder="Cari berdasarkan perihal atau jenis surat..." />
            </div>
            <button className="filter-btn">
              <FontAwesomeIcon icon={faFilter} />
              Filter Data
            </button>
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
              {suratList.map((surat) => (
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
                      <button className="btn-action btn-view" title="Lihat Detail">
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      
                      {/* BUTTON APPROVE MEMANGGIL handleApproveClick */}
                      <button 
                        className="btn-action btn-approve" 
                        title="Setujui Surat"
                        onClick={() => handleApproveClick(surat)}
                      >
                        <FontAwesomeIcon icon={faCheckCircle} />
                      </button>

                      <button className="btn-action btn-reject" title="Tolak Surat">
                        <FontAwesomeIcon icon={faTimesCircle} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* MODAL APPROVE SURAT */}
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
              <h4>Informasi Sistem</h4>
              <div className="info-grid">
                <div className="info-label">Kode Klasifikasi:</div>
                <div className="info-value">005 (Dummy)</div>
                
                <div className="info-label">Urutan Terakhir:</div>
                <div className="info-value">023 (Dummy)</div>
              </div>
            </div>

            <div className="modal-section">
              <h4>Nomor Surat Resmi</h4>
              {/* Dummy Value untuk nomor surat otomatis */}
              <input 
                type="text" 
                className="input-nomor" 
                defaultValue="005/024/UMUM/2026" 
                placeholder="Masukkan Nomor Surat..." 
              />
            </div>

            <div className="modal-actions">
              <button className="btn-cancel-modal" onClick={closeApproveModal}>
                Batal
              </button>
              <button 
                className="btn-submit-modal" 
                onClick={() => {
                  alert("Surat berhasil disetujui!");
                  closeApproveModal();
                }}
              >
                Setujui & Terbitkan Nomor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaSurat;