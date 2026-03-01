import React, { useState, useEffect } from "react";
import SidebarAdmin from "../../components/Sidebar/Admin/SidebarAdmin";
import "./DashboardAdmin.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faClock,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

const DashboardAdmin = () => {
  const [statsData, setStatsData] = useState({ total: 0, pending: 0, disetujui: 0 });
  const [aktivitas, setAktivitas] = useState<any[]>([]);
  const [kategori, setKategori] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/dashboard");
        const data = await res.json();

        if (res.ok) {
          setStatsData({
            total: data.stats.total || 0,
            pending: data.stats.pending || 0,
            disetujui: data.stats.disetujui || 0,
          });

          const formattedAktivitas = data.aktivitas.map((a: any) => {
            let statusFront = "Diproses";
            if (a.status === "disetujui") statusFront = "Selesai";
            if (a.status === "ditolak") statusFront = "Ditolak";

            const d = new Date(a.tanggal_pengajuan);
            const dateStr = `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;

            return {
              tanggal: dateStr,
              bidang: a.bidang || "Tanpa Bidang",
              jenis: a.jenis || "Tanpa Jenis",
              status: statusFront,
            };
          });
          setAktivitas(formattedAktivitas);
          const formattedKategori = data.kategori.map((k: any) => ({
            nama: k.nama,
            menunggu: Number(k.menunggu),
            disetujui: Number(k.disetujui),
            ditolak: Number(k.ditolak),
          }));
          setKategori(formattedKategori);
        }
      } catch (err) {
        console.error("Gagal mengambil data dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const stats = [
    {
      title: "Total Surat",
      value: statsData.total,
      change: "Diperbarui hari ini",
      changeColor: "green",
      iconColor: "#2563EB",
      icon: faChartLine,
    },
    {
      title: "Menunggu Tindakan",
      value: statsData.pending,
      change: "Diperbarui hari ini",
      changeColor: "green",
      iconColor: "#D97706",
      icon: faClock,
    },
    {
      title: "Surat Terverifikasi",
      value: statsData.disetujui,
      change: "Diperbarui hari ini",
      changeColor: "red",
      iconColor: "#16A34A",
      icon: faCircleCheck,
    },
  ];

  return (
    <div className="dashboard-layout">
      <SidebarAdmin />

      <main className="dashboard-main">
        <h1 className="dashboard-title">
          Sistem Pengelolaan Nomor dan Agenda Surat
        </h1>

        <h2>Dashboard Admin</h2>
        <div className="dashboard-subtitle">
          Selamat datang di Sistem Pengelolaan Nomor dan Agenda Surat
        </div>
        
        <div className="stats-row">
          {stats.map((s, i) => (
            <div key={i} className="stat-card">
              <div>
                <div className="stat-title">{s.title}</div>
                <div className="stat-number">{isLoading ? "..." : s.value}</div>
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
            <h3>Aktivitas Terkini</h3>
            <span>Pencatatan dokumen terakhir</span>
          </div>

          <table className="history-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Asal Bidang</th>
                <th>Jenis Surat</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "15px" }}>Memuat Data...</td>
                </tr>
              ) : aktivitas.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "15px" }}>Belum ada aktivitas surat.</td>
                </tr>
              ) : (
                aktivitas.map((item, i) => (
                  <tr key={i}>
                    <td>{item.tanggal}</td>
                    <td>{item.bidang}</td>
                    <td>{item.jenis}</td>
                    <td>
                      <span
                        className={
                          item.status === "Selesai"
                            ? "badge success"
                            : item.status === "Ditolak"
                            ? "badge danger"
                            : "badge warning"
                        }
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="large-card">
          <div
            className="table-header"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              textAlign: "left",
              gap: "4px",
              marginBottom: "20px",
            }}
          >
            <h3>Laporan Berdasarkan Kategori</h3>
            <span>Rincian status pengajuan berdasarkan jenis surat</span>
          </div>

          <table className="history-table">
            <thead>
              <tr>
                <th>Kategori Surat</th>
                <th>Menunggu Verifikasi</th>
                <th>Disetujui</th>
                <th>Ditolak</th>
                <th>Total Keseluruhan</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "15px" }}>Memuat Data...</td>
                </tr>
              ) : kategori.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "15px" }}>Belum ada data kategori.</td>
                </tr>
              ) : (
                kategori.map((k, i) => {
                  const total = k.menunggu + k.disetujui + k.ditolak;

                  return (
                    <tr key={i}>
                      <td style={{ fontWeight: "500", color: "#374151" }}>
                        {k.nama}
                      </td>
                      <td style={{ color: "#d97706", fontWeight: "600" }}>
                        {k.menunggu}
                      </td>
                      <td style={{ color: "#166534", fontWeight: "600" }}>
                        {k.disetujui}
                      </td>
                      <td style={{ color: "#b91c1c", fontWeight: "600" }}>
                        {k.ditolak}
                      </td>
                      <td style={{ fontWeight: "700", color: "#111827" }}>
                        {total}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default DashboardAdmin;