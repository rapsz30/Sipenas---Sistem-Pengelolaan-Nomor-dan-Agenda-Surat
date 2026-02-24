import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./Contact.css";

const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className="contact-container">
      <Navbar />
      <div className="contact-content">
        <button className="btn-back" onClick={() => navigate("/help")}>
          <FontAwesomeIcon icon={faArrowLeft} /> Kembali ke Pusat Bantuan
        </button>
        <div className="faq-header">
          <h1>Hubungi Kami</h1>
          <p>
            Sampaikan kendala atau pertanyaan Anda, tim kami akan segera
            membalas.
          </p>
        </div>

        <div className="contact-form">
          <div className="form-group">
            <label>Nama Lengkap</label>
            <input type="text" placeholder="Masukkan nama Anda" />
          </div>
          <div className="form-group">
            <label>Alamat Email</label>
            <input type="email" placeholder="contoh@email.com" />
          </div>
          <div className="form-group">
            <label>Pesan atau Kendala</label>
            <textarea
              rows={5}
              placeholder="Jelaskan kendala yang Anda hadapi secara detail..."
            ></textarea>
          </div>
          <button className="btn-send" onClick={() => alert("Pesan terkirim!")}>
            Kirim Pesan
          </button>
        </div>
      </div>
    </div>
  );
};
export default Contact;
