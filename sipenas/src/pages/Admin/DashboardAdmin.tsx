import SidebarAdmin from "../../components/Sidebar/Admin/SidebarAdmin";
import "./DashboardAdmin.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faClock,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

const DashboardAdmin = () => {
  const stats = [
    {
      title: "Total Surat",
      value: 254,
      change: "12% dari minggu lalu",
      changeColor: "green",
      iconColor: "#2563EB",
      icon: faChartLine,
    },
    {
      title: "Menunggu Tindakan",
      value: 128,
      change: "8% dari minggu lalu",
      changeColor: "green",
      iconColor: "#D97706",
      icon: faClock,
    },
    {
      title: "Surat Terverifikasi",
      value: 123,
      change: "3% dari minggu lalu",
      changeColor: "red",
      iconColor: "#16A34A",
      icon: faCircleCheck,
    },
  ];

  const aktivitas = [
    {
      tanggal: "1-2-2026",
      bidang: "Surat Keluar Dinas",
      jenis: "Surat Keluar Dinas",
      status: "Diproses",
    },
    {
      tanggal: "2-2-2026",
      bidang: "Surat Keputusan Kadis",
      jenis: "Surat Keputusan Kadis",
      status: "Selesai",
    },
    {
      tanggal: "3-2-2026",
      bidang: "Surat Cuti",
      jenis: "Surat Cuti",
      status: "Diproses",
    },
    {
      tanggal: "4-2-2026",
      bidang: "Surat Tidak Absen",
      jenis: "Surat Tidak Absen",
      status: "Selesai",
    },
  ];

  // Dummy Data Kategori yang Diperbarui
  const kategori = [
    { nama: "Surat Keluar Dinas", menunggu: 5, disetujui: 9, ditolak: 1 },
    { nama: "Surat Keputusan Kadis", menunggu: 12, disetujui: 18, ditolak: 0 },
    { nama: "Surat Cuti", menunggu: 3, disetujui: 15, ditolak: 2 },
    { nama: "Surat Edaran", menunggu: 1, disetujui: 5, ditolak: 0 },
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
              {aktivitas.map((item, i) => (
                <tr key={i}>
                  <td>{item.tanggal}</td>
                  <td>{item.bidang}</td>
                  <td>{item.jenis}</td>
                  <td>
                    <span
                      className={
                        item.status === "Selesai"
                          ? "badge success"
                          : "badge warning"
                      }
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
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
              {kategori.map((k, i) => {
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
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default DashboardAdmin;
