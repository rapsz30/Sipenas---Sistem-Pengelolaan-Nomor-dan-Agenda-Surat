import React, { useState, useEffect } from "react";
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
  const [statsData, setStatsData] = useState({
    total: 0,
    pending: 0,
    ditolak: 0,
    disetujui: 0,
  });

  const stats = [
    {
      title: "Total Pengajuan",
      value: statsData.total,
      change: "Diperbarui hari ini",
      changeColor: "green",
      iconColor: "#2174FF",
      icon: faFileAlt,
    },
    {
      title: "Menunggu Verifikasi",
      value: statsData.pending,
      change: "Diperbarui hari ini",
      changeColor: "green",
      iconColor: "#D97706",
      icon: faClock,
    },
    {
      title: "Ditolak",
      value: statsData.ditolak,
      change: "Diperbarui hari ini",
      changeColor: "red",
      iconColor: "#ef4444",
      icon: faTimesCircle,
    },
    {
      title: "Disetujui",
      value: statsData.disetujui,
      change: "Diperbarui hari ini",
      changeColor: "red",
      iconColor: "#22c55e",
      icon: faCircleCheck,
    },
  ];
  const [history, setHistory] = useState<any[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedSurat, setSelectedSurat] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      if (!user || !user.userId) return;

      try {
        const response = await fetch(
          `http://localhost:5000/api/dashboard/operator/${user.userId}`,
        );
        const data = await response.json();

        if (response.ok) {
          setStatsData({
            total: data.stats.totalSurat || 0,
            pending: data.stats.pendingSurat || 0,
            disetujui: data.stats.disetujuiSurat || 0,
            ditolak: data.stats.ditolakSurat || 0,
          });

          const formattedHistory = (data.history || []).map((item: any) => {
            let statusFront = "Diproses";
            if (item.status_pengajuan === "disetujui") statusFront = "Diterima";
            if (item.status_pengajuan === "ditolak") statusFront = "Ditolak";
            if (item.status_pengajuan === "pending") statusFront = "Diproses";

            const dateObj = new Date(item.tanggal_pengajuan);
            const dateStr = `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`;

            return {
              id: item.id_pengajuan_surat,
              tanggal: dateStr,
              jenis: item.nama_jenis || "Belum ada jenis",
              perihal: item.perihal_surat || "-",
              status: statusFront,
              nomorSurat: item.nomor_surat_resmi || "-",
              fileAwal: item.file_lampiran || "Tidak ada lampiran",
              fileResmi: item.file_balasan || "",
              catatanAdmin: item.catatan_admin || "",
            };
          });

          setHistory(formattedHistory);
        }
      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
      }
    };

    fetchDashboardData();
  }, []);

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
              {history.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    Belum ada pengajuan surat
                  </td>
                </tr>
              ) : (
                history.map((item) => (
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
                ))
              )}
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
                  <div className="detail-label">File Anda:</div>
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
