import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./Updates.css";

const Updates = () => {
  const navigate = useNavigate();

  return (
    <div className="updates-container">
      <Navbar />
      <div className="updates-content">
        <button className="btn-back" onClick={() => navigate("/help")}>
          <FontAwesomeIcon icon={faArrowLeft} /> Kembali ke Pusat Bantuan
        </button>
        <div className="faq-header">
          <h1>Pembaruan Sistem</h1>
          <p>
            Catatan rilis (Release Notes) tentang fitur terbaru dan perbaikan di
            SIPENAS.
          </p>
        </div>

        <div className="timeline-item">
          <div className="timeline-dot"></div>
          <div>
            <span className="version-badge">Versi 1.0.0</span>
            <span className="update-date">27 Februari 2026</span>
          </div>
          <div className="update-card">
            <ul>
              <li>
                <strong>Rilis Perdana:</strong> Peluncuran sistem SIPENAS
                (Sistem Pengendalian Nomor dan Agenda Surat).
              </li>
              <li>Modul Login Multi-Role (Admin & Operator).</li>
              <li>Modul Pengajuan Nomor Surat untuk Operator.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Updates;
