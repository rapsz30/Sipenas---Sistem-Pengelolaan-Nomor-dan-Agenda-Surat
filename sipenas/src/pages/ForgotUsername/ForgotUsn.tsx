import { Link } from "react-router-dom";
import "./ForgotUsn.css";

const Login = () => {
  return (
    <div className="login-container">
      {/* Panel Kiri*/}
      <div className="left-panel">
        <nav className="top-nav">
          <Link to="#" className="nav-link-white">
            Bantuan
          </Link>
          <Link to="/" className="nav-btn-active-glass">
            Login
          </Link>
          <Link to="/privacy" className="nav-link-white">
            Privasi
          </Link>
        </nav>
      </div>

      {/* Panel Kanan */}
      <div className="right-panel">
        <h2 className="login-title">Mereset Kata Sandi</h2>

        <form onSubmit={(e) => e.preventDefault()}>
          {/* Email*/}
          <div className="form-group">
            <label htmlFor="Email">
              Untuk mendapatkan Nama Pengguna, masukan email yang telah
              terdaftar. <b>Nama Pengguna akan dikirimkan ke email terkait.</b>
            </label>
            <input
              type="email"
              id="Email"
              className="form-input"
              placeholder="Email"
            />
          </div>

          <div className="button-group">
            <button type="submit" className="btn-back">
              Kembali
            </button>
            <button type="submit" className="btn-submit">
              Masuk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
