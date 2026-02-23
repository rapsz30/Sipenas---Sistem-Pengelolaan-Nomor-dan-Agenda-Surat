import { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./AjukanSuratOperator.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import InputField from "../../components/InputField/InputField";

const AjukanSurat = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <div className="operator-layout">
      <Sidebar />

      <main className="operator-content">
        {/* Top Header */}
        <div className="page-top">
          <h1 className="page-title">
            Sistem Pengelolaan Nomor dan Agenda Surat
          </h1>

          <div className="page-header">
            <h2>Ajukan Surat</h2>
            <p>
              Ajukan permohonan penomoran surat secara resmi dan terstruktur.
            </p>
          </div>
        </div>

        <div className="form-card">
          <div className="form-card-header">
            <h3>Formulir Pengajuan Surat</h3>
            <span>Isi detail surat untuk mengajukan</span>
          </div>

          <div className="form-grid">
            {/* Jenis Surat */}
            <div className="form-group">
              <label>Jenis Surat*</label>
              <select className="input">
                <option>Type Surat</option>
                <option>Surat Dinas</option>
                <option>Surat Undangan</option>
                <option>Surat Keputusan</option>
              </select>
            </div>

            {/* Tanggal Surat */}
            <div className="form-group">
              <label>Tanggal Surat*</label>
              <div className="date-input">
                <input type="date" className="input" />
              </div>
            </div>

            <div className="form-group">
              <InputField
                className="input"
                placeholder="Masukan Perihal Surat"
                label="Masukan Perihal Surat*"
              />
            </div>

            <div className="form-group">
              <InputField
                className="input"
                placeholder="Masukan Tujuan Surat"
                label="Tujuan Surat*"
              />
            </div>
          </div>
          
          <div className="form-group">
            <InputField className="input" label="Keterangan" />
          </div>

          {/* Upload File */}
          <div className="form-group">
            <label>Unggah File Surat*</label>

            {!file ? (
              <label className="upload-box">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
                <div className="upload-content">
                  <FontAwesomeIcon icon={faUpload} size="2x" />
                  <p>Drag and drop file Anda di sini</p>
                  <span>atau klik untuk memilih file</span>
                  <small>Format: PDF, DOC, DOCX (Maksimal 10 MB)</small>
                </div>
              </label>
            ) : (
              <div className="file-preview">
                <div className="file-info">
                  <strong>{file.name}</strong>
                  <span>{(file.size / 1024).toFixed(2)} KB</span>
                </div>
                <button onClick={removeFile} className="remove-file">
                  Hapus
                </button>
              </div>
            )}
          </div>

          {/* Footer Area */}
          <div className="form-footer">
            <div className="checkbox-group">
              <input type="checkbox" id="confirm" />
              <label htmlFor="confirm">
                Saya telah memeriksa dan memastikan bahwa surat yang akan
                diajukan sudah benar dan sesuai.
              </label>
            </div>

            <div className="form-actions">
              <button className="btn-cancel">Batal</button>
              <button className="btn-submit">Ajukan Surat</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AjukanSurat;
