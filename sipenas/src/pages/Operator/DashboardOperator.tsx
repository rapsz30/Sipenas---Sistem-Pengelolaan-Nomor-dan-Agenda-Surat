import React, { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./DashboardOperator.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faFileAlt,
  faClock,
  faCircleCheck,
  faTimesCircle,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";

const DashboardOperator = () => {
  const stats = [
    {
      title: "Total Pengajuan",
      value: 6,
      change: "12% dari minggu lalu",
      changeColor: "green",
      iconColor: "#2174FF",
      icon: faFileAlt,
    },
    {
      title: "Menunggu Verifikasi",
      value: 3,
      change: "8% dari minggu lalu",
      changeColor: "green",
      iconColor: "#D97706",
      icon: faClock,
    },
    {
      title: "Ditolak",
      value: 1,
      change: "1% dari minggu lalu",
      changeColor: "red",
      iconColor: "#ef4444",
      icon: faTimesCircle,
    },
    {
      title: "Disetujui",
      value: 2,
      change: "3% dari minggu lalu",
      changeColor: "red",
      iconColor: "#22c55e",
      icon: faCircleCheck,
    },
  ];

  // Dummy Data yang diperbarui dengan Perihal, Status, dan data untuk Modal
  const [history] = useState([
    {
      id: 1,
      tanggal: "1-2-2026",
      jenis: "Surat Keluar Dinas",
      perihal: "Undangan Rapat Evaluasi",
      status: "Diterima",
      nomorSurat: "005/024/UMUM/2026",
      fileAwal: "Undangan_Rapat_Draft.pdf",
      catatanAdmin: "",
    },
    {
      id: 2,
      tanggal: "2-2-2026",
      jenis: "Surat Keputusan Kadis",
      perihal: "Pencairan Anggaran Q1",
      status: "Diproses",
      nomorSurat: "-",
      fileAwal: "SK_Pencairan_Draft.pdf",
      catatanAdmin: "",
    },
    {
      id: 3,
      tanggal: "3-2-2026",
      jenis: "Surat Cuti",
      perihal: "Cuti Tahunan",
      status: "Ditolak",
      nomorSurat: "-",
      fileAwal: "Form_Cuti_Budi.pdf",
      fileResmi: "Form_Cuti_Revisi_Admin.pdf",
      catatanAdmin:
        "Lampiran kurang lengkap, mohon sertakan tanda tangan atasan langsung.",
    },
    {
      id: 4,
      tanggal: "4-2-2026",
      jenis: "Surat Tidak Absen",
      perihal: "Keterangan Sakit",
      status: "Diterima",
      nomorSurat: "800/015/KEP/2026",
      fileAwal: "Surat_Sakit.pdf",
      catatanAdmin: "",
    },
  ]);

  // STATE UNTUK MODAL DETAIL
  const [showModal, setShowModal] = useState(false);
  const [selectedSurat, setSelectedSurat] = useState<any>(null);

  const handleViewDetail = (surat: any) => {
    setSelectedSurat(surat);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSurat(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Diterima":
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
      <Sidebar />

      <main className="dashboard-main">
        <h1 className="dashboard-title">
          Sistem Pengelolaan Nomor dan Agenda Surat
        </h1>

        <h2>Dashboard</h2>
        <div className="dashboard-subtitle">
          Selamat datang di Sistem Pengelolaan Nomor dan Agenda Surat
        </div>
        <div className="stats-row">
          {stats.map((s, i) => (
            <div key={i} className="stat-card">
              <div>
                <div className="stat-title">{s.title}</div>
                <div className="stat-number">{s.value}</div>
                <div className={`stat-change ${s.changeColor}`}>{s.change}</div>
              </div>

              <FontAwesomeIcon
                icon={s.icon}
                className="stat-icon"
                style={{ color: s.iconColor }}
              />
            </div>
          ))}
        </div>

        <div className="large-card">
          <div className="table-header">
            <h3>Riwayat Pengajuan</h3>
            <span>Pencatatan dokumen terakhir</span>
          </div>

          <table className="history-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Jenis Surat</th>
                <th>Perihal</th>
                <th>Status</th>
                <th>Detail Surat</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id}>
                  <td>{item.tanggal}</td>
                  <td>{item.jenis}</td>
                  <td>{item.perihal}</td>
                  <td>
                    <span className={getStatusBadge(item.status)}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="eye-btn"
                      title="Lihat Detail"
                      onClick={() => handleViewDetail(item)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: "0",
                      }}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {showModal && selectedSurat && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Detail Pengajuan Surat</h3>
              <button className="btn-close-modal" onClick={closeModal}>
                &times;
              </button>
            </div>

            <div className="detail-grid">
              <div className="detail-label">Perihal:</div>
              <div className="detail-value">{selectedSurat.perihal}</div>

              <div className="detail-label">Jenis Surat:</div>
              <div className="detail-value">{selectedSurat.jenis}</div>

              <div className="detail-label">Status:</div>
              <div className="detail-value">
                <span className={getStatusBadge(selectedSurat.status)}>
                  {selectedSurat.status}
                </span>
              </div>
            </div>

            <hr
              style={{
                border: "0",
                borderTop: "1px solid #e5e7eb",
                margin: "16px 0",
              }}
            />

            {selectedSurat.status === "Diterima" && (
              <div className="modal-section">
                <div className="detail-grid" style={{ marginBottom: "0" }}>
                  <div className="detail-label">Nomor Surat Resmi:</div>
                  <div
                    className="detail-value"
                    style={{ color: "#10b981", fontSize: "16px" }}
                  >
                    {selectedSurat.nomorSurat}
                  </div>

                  <div className="detail-label">File Surat Awal:</div>
                  <div className="detail-value">
                    <a href="#" className="file-link">
                      <FontAwesomeIcon icon={faFilePdf} />{" "}
                      {selectedSurat.fileAwal}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {selectedSurat.status === "Ditolak" && (
              <div className="modal-section">
                <div className="detail-label" style={{ marginBottom: "4px" }}>
                  Catatan Admin (Alasan Penolakan):
                </div>
                <div className="catatan-box">{selectedSurat.catatanAdmin}</div>

                <div
                  className="detail-grid"
                  style={{ marginTop: "16px", marginBottom: "0" }}
                >
                  <div className="detail-label">File Surat Resmi/Revisi:</div>
                  <div className="detail-value">
                    <a
                      href="#"
                      className="file-link"
                      style={{ color: "#ef4444" }}
                    >
                      <FontAwesomeIcon icon={faFilePdf} />{" "}
                      {selectedSurat.fileResmi || "Tidak ada lampiran admin"}
                    </a>
                  </div>

                  <div className="detail-label">File Awal Anda:</div>
                  <div className="detail-value">
                    <a
                      href="#"
                      className="file-link"
                      style={{ color: "#6b7280" }}
                    >
                      <FontAwesomeIcon icon={faFilePdf} />{" "}
                      {selectedSurat.fileAwal}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {selectedSurat.status === "Diproses" && (
              <div
                className="modal-section"
                style={{
                  textAlign: "center",
                  padding: "20px 0",
                  color: "#6b7280",
                }}
              >
                <p>
                  Surat Anda sedang dalam antrean verifikasi Admin. Harap
                  menunggu maksimal 1x24 Jam.
                </p>
                <a href="#" className="file-link">
                  <FontAwesomeIcon icon={faFilePdf} /> {selectedSurat.fileAwal}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOperator;
