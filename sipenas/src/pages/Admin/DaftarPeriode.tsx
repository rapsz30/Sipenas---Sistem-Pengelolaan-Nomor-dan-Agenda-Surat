import React, { useState, useEffect } from "react";
import SidebarAdmin from "../../components/Sidebar/Admin/SidebarAdmin";
import "./DaftarPeriode.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faDownload } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const DaftarPeriode = () => {
  const [periodeList, setPeriodeList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchPeriode = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/periode");
        const data = await response.json();

        if (response.ok) {
          const formattedData = data.map((item: any) => {
            const formatTgl = (tglAsli: string) => {
              if (!tglAsli) return "-";
              const dateObj = new Date(tglAsli);
              return `${dateObj.getDate().toString().padStart(2, '0')}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getFullYear()}`;
            };

            let statusFront = "Selesai"; 
            if (item.status_periode === "aktif") {
              statusFront = "Aktif";
            }

            return {
              id: item.id_periode,
              nama: item.nama_periode,
              mulai: formatTgl(item.tanggal_mulai),
              akhir: formatTgl(item.tanggal_berakhir),
              status: statusFront,
            };
          });

          setPeriodeList(formattedData);
        }
      } catch (error) {
        console.error("Gagal load data periode:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPeriode();
  }, []);

  return (
    <div className="dashboard-layout">
      <SidebarAdmin />

      <main className="dashboard-main">
        <div className="page-top">
          <h1 className="page-title">
            Sistem Pengelolaan Nomor dan Agenda Surat
          </h1>
          <div className="page-header">
            <h2>Daftar Periode</h2>
            <p>Kelola dan lihat daftar periode pencatatan surat yang tersimpan</p>
          </div>
        </div>

        <div className="large-card">
          <div className="table-header">
            <div>
              <h3>Periode Tersimpan</h3>
              <span>Daftar seluruh periode yang ada di sistem</span>
            </div>
            <Link to="/atur-periode" className="btn-add-periode">
              <FontAwesomeIcon icon={faPlus} /> Tambah Periode
            </Link>
          </div>

          <table className="history-table">
            <thead>
              <tr>
                <th>Nama Periode</th>
                <th>Tanggal Mulai</th>
                <th>Tanggal Berakhir</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>Memuat Data...</td>
                </tr>
              ) : periodeList.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>Belum ada data periode.</td>
                </tr>
              ) : (
                periodeList.map((periode) => (
                  <tr key={periode.id}>
                    <td>{periode.nama}</td>
                    <td>{periode.mulai}</td>
                    <td>{periode.akhir}</td>
                    <td>
                      <span className={`badge ${periode.status === 'Aktif' ? 'success' : 'secondary'}`}>
                        {periode.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-action btn-download" 
                          title="Download Data"
                          onClick={() => alert(`Mendownload data untuk ${periode.nama}...`)}
                        >
                          <FontAwesomeIcon icon={faDownload} />
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
    </div>
  );
};

export default DaftarPeriode;