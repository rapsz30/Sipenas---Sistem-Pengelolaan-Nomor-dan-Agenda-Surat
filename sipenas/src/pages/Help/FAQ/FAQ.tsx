import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./FAQ.css";

const FAQ = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "Bagaimana cara mengajukan nomor surat baru?",
      answer: "Untuk mengajukan nomor surat, silakan login sebagai Operator. Buka menu 'Ajukan Surat', isi formulir yang disediakan termasuk perihal, jenis surat, dan lampiran jika ada, lalu klik tombol 'Kirim Pengajuan'."
    },
    {
      question: "Berapa lama proses persetujuan nomor surat?",
      answer: "Proses persetujuan biasanya memakan waktu 1x24 jam hari kerja. Surat Anda akan diverifikasi oleh Admin Bidang Umum sebelum nomor resmi diterbitkan."
    },
    {
      question: "Apa yang harus dilakukan jika surat ditolak/dikembalikan?",
      answer: "Jika surat dikembalikan untuk revisi, Anda dapat melihat catatan dari Admin pada halaman Detail Surat. Lakukan perbaikan sesuai catatan tersebut, lalu ajukan kembali."
    },
    {
      question: "Apakah saya bisa membatalkan pengajuan yang sudah dikirim?",
      answer: "Pengajuan hanya bisa dibatalkan jika statusnya masih 'Menunggu' atau 'Diproses'. Jika status sudah 'Selesai' dan nomor telah terbit, pengajuan tidak dapat dibatalkan melalui sistem."
    },
    {
      question: "Saya lupa kata sandi akun saya, apa solusinya?",
      answer: "Silakan klik menu 'Lupa Kata Sandi' pada halaman Login. Masukkan Username atau Email Anda, dan ikuti instruksi yang akan kami kirimkan untuk mereset kata sandi."
    }
  ];

  return (
    <div className="faq-container">
        <Navbar />

      <div className="faq-content">
        <button className="btn-back" onClick={() => navigate("/help")}>
          <FontAwesomeIcon icon={faArrowLeft} /> Kembali ke Pusat Bantuan
        </button>

        <div className="faq-header">
          <h1>Frequently Asked Questions (FAQ)</h1>
          <p>Temukan jawaban cepat untuk pertanyaan yang sering diajukan terkait penggunaan sistem SIPENAS.</p>
        </div>

        <div className="faq-list">
          {faqData.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
            >
              <button 
                className="faq-question" 
                onClick={() => toggleAccordion(index)}
              >
                {faq.question}
                <FontAwesomeIcon icon={faChevronDown} className="faq-icon" />
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;