import Sidebar from "../../components/Sidebar/Sidebar";
import "./DashboardOperator.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faFileAlt,
  faClock,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

const DashboardOperator = () => {
  const stats = [
    {
      title: "Total Pengajuan",
      value: 5,
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
      title: "Disetujui",
      value: 2,
      change: "3% dari minggu lalu",
      changeColor: "red",
      iconColor: "#22c55e",
      icon: faCircleCheck,
    },
  ];

  const history = [
    { tanggal: "1-2-2026", jenis: "Surat Keluar Dinas" },
    { tanggal: "2-2-2026", jenis: "Surat Keputusan Kadis" },
    { tanggal: "3-2-2026", jenis: "Surat Cuti" },
    { tanggal: "4-2-2026", jenis: "Surat Tidak Absen" },
  ];

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
                <th>Status</th>
                <th>Detail Surat</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.tanggal}</td>
                  <td>{item.jenis}</td>
                  <td>Status</td>
                  <td>
                    <FontAwesomeIcon icon={faEye} className="eye-btn" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default DashboardOperator;
