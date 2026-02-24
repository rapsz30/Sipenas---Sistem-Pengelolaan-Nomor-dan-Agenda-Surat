import Sidebar from "../../components/Sidebar/Admin/SidebarAdmin";
import "./AturPeriode.css";
import InputField from "../../components/InputField/InputField";
import { Link } from "react-router-dom";

const AjukanSurat = () => {
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
            <h2>Atur Periode</h2>
            <p>Atur periode pencatatan nomor surat</p>
          </div>
        </div>

        <div className="form-card">
          <div className="form-card-header">
            <h3>Formulir Periode Baru</h3>
            <span>Isi informasi periode pencatatan surat</span>
            <Link
              to="/atur-periode"
              style={{
                fontSize: "14px",
                color: "#3b82f6",
                textDecoration: "none",
                fontWeight: "500",
                marginLeft: "67%",
              }}
            >
              Lihat Daftar Periode Tersimpan
            </Link>
          </div>
          <div className="form-group">
            <InputField className="input" label="Masukan Nama Periode Baru*" />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Tanggal Mulai*</label>
              <div className="date-input">
                <input type="date" className="input" />
              </div>
            </div>

            <div className="form-group">
              <label>Tanggal Berakhir*</label>
              <div className="date-input">
                <input type="date" className="input" />
              </div>
            </div>
          </div>

          <div className="form-footer">
            <div className="checkbox-group">
              <input type="checkbox" id="confirm" />
              <label htmlFor="confirm">
                Saya telah memeriksa dan memastikan bahwa periode yang akan
                dibuat sudah benar dan sesuai.
              </label>
            </div>

            <div className="form-actions">
              <button className="btn-submit">Simpan Periode</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AjukanSurat;
