import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./AjukanSuratOperator.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import InputField from "../../components/InputField/InputField";

const AjukanSurat = () => {
  const navigate = useNavigate();

  // STATE UNTUK FORM
  const [jenisSuratList, setJenisSuratList] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    id_jenis_surat: "",
    tanggal_pengajuan: "",
    perihal_surat: "",
    tujuan_surat: "",
    keterangan_surat: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Ambil Data User Sesi Saat Ini
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  // FETCH JENIS SURAT UNTUK DROPDOWN SAAT HALAMAN DIMUAT
  useEffect(() => {
    fetch("http://localhost:5000/api/jenis-surat")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setJenisSuratList(data);
      })
      .catch((err) => console.error("Gagal load jenis surat:", err));
  }, []);

  // HANDLER PERUBAHAN INPUT TEKS
  const handleChange = (e: any, fieldName: string) => {
    setFormData({ ...formData, [fieldName]: e.target.value });
  };

  // HANDLER PERUBAHAN FILE
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  // HANDLER SUBMIT KE BACKEND
  const handleSubmit = async () => {
    if (!isConfirmed) {
      alert("Centang kotak persetujuan terlebih dahulu!");
      return;
    }
    if (!formData.id_jenis_surat || !formData.tanggal_pengajuan || !formData.perihal_surat || !file) {
      alert("Mohon lengkapi semua kolom yang bertanda bintang (*)!");
      return;
    }

    setIsLoading(true);

    // KITA HARUS MENGGUNAKAN FORMDATA KARENA MENGIRIM FILE
    const submitData = new FormData();
    submitData.append("id_user", user.userId);
    submitData.append("id_jenis_surat", formData.id_jenis_surat);
    submitData.append("tanggal_pengajuan", formData.tanggal_pengajuan);
    submitData.append("perihal_surat", formData.perihal_surat);
    submitData.append("tujuan_surat", formData.tujuan_surat);
    submitData.append("keterangan_surat", formData.keterangan_surat);
    submitData.append("file_lampiran", file);

    try {
      const response = await fetch("http://localhost:5000/api/pengajuan", {
        method: "POST",
        body: submitData, // Tidak butuh header Content-Type, otomatis diatur browser
      });

      const data = await response.json();

      if (response.ok) {
        alert("Berhasil! " + data.message);
        navigate("/operator"); // Kembali ke dashboard setelah sukses
      } else {
        alert("Gagal: " + data.message);
      }
    } catch (error) {
      alert("Terjadi kesalahan server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="operator-layout">
      <Sidebar />

      <main className="operator-content">
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
            <div className="form-group">
              <label>Jenis Surat*</label>
              <select 
                className="input" 
                value={formData.id_jenis_surat} 
                onChange={(e) => handleChange(e, "id_jenis_surat")}
              >
                <option value="">Type Surat</option>
                {/* Looping data dari database */}
                {jenisSuratList.map((jenis) => (
                  <option key={jenis.id_jenis_surat} value={jenis.id_jenis_surat}>
                    {jenis.nama_jenis}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Tanggal Surat*</label>
              <div className="date-input">
                <input 
                  type="date" 
                  className="input" 
                  value={formData.tanggal_pengajuan}
                  onChange={(e) => handleChange(e, "tanggal_pengajuan")}
                />
              </div>
            </div>

            <div className="form-group">
              <InputField
                className="input"
                placeholder="Masukan Perihal Surat"
                label="Masukan Perihal Surat*"
                value={formData.perihal_surat}
                onChange={(e: any) => handleChange(e, "perihal_surat")}
              />
            </div>

            <div className="form-group">
              <InputField
                className="input"
                placeholder="Masukan Tujuan Surat"
                label="Tujuan Surat*"
                value={formData.tujuan_surat}
                onChange={(e: any) => handleChange(e, "tujuan_surat")}
              />
            </div>
          </div>
          
          <div className="form-group">
            <InputField 
              className="input" 
              label="Keterangan" 
              value={formData.keterangan_surat}
              onChange={(e: any) => handleChange(e, "keterangan_surat")}
            />
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
          <div className="form-footer">
            <div className="checkbox-group">
              <input 
                type="checkbox" 
                id="confirm" 
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
              />
              <label htmlFor="confirm">
                Saya telah memeriksa dan memastikan bahwa surat yang akan
                diajukan sudah benar dan sesuai.
              </label>
            </div>

            <div className="form-actions">
              <button className="btn-cancel" onClick={() => navigate("/operator")}>Batal</button>
              <button 
                className="btn-submit" 
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Mengirim..." : "Ajukan Surat"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AjukanSurat;