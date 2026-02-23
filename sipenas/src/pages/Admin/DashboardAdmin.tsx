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

  const kategori = [
    { nama: "Surat Keluar Dinas", masuk: 10, keluar: 5, total: 15 },
    { nama: "Surat Keputusan Kadis", masuk: 20, keluar: 10, total: 30 },
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
        {/* Stats */}
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

        {/* Aktivitas */}
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

        {/* Laporan */}
        <div className="large-card">
          <div className="table-header">
            <h3>Laporan Berdasarkan Kategori</h3>
            <span>Rincian surat per kategori</span>
          </div>

          <table className="history-table">
            <thead>
              <tr>
                <th>Kategori</th>
                <th>Surat Masuk</th>
                <th>Surat Keluar</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {kategori.map((k, i) => (
                <tr key={i}>
                  <td>{k.nama}</td>
                  <td>{k.masuk}</td>
                  <td>{k.keluar}</td>
                  <td>{k.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default DashboardAdmin;
