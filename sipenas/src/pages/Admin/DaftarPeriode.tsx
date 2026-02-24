// src/pages/Admin/DaftarPeriode.tsx

import React, { useState } from "react";
import SidebarAdmin from "../../components/Sidebar/Admin/SidebarAdmin";
import "./DaftarPeriode.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEye, faDownload } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const DaftarPeriode = () => {
  const [periodeList] = useState([
    {
      id: 1,
      nama: "Periode Triwulan I 2026",
      mulai: "01-01-2026",
      akhir: "31-03-2026",
      status: "Aktif",
    },
    {
      id: 2,
      nama: "Periode Triwulan IV 2025",
      mulai: "01-10-2025",
      akhir: "31-12-2025",
      status: "Selesai",
    },
    {
      id: 3,
      nama: "Periode Triwulan III 2025",
      mulai: "01-07-2025",
      akhir: "30-09-2025",
      status: "Selesai",
    }
  ]);

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
              {periodeList.map((periode) => (
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
                      <button className="btn-action btn-view" title="Lihat Detail">
                        <FontAwesomeIcon icon={faEye} />
                      </button>
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
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default DaftarPeriode;