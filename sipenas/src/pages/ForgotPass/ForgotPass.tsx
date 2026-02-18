import { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPass.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const EyeIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );

  const EyeOffIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  );

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
              Untuk mereset Kata Sandi, masukan email yang telah terdaftar dan
              masukan kata sandi yang baru
            </label>
            <input
              type="email"
              id="Email"
              className="form-input"
              placeholder="Email"
            />
          </div>

          {/* Password*/}
          <div className="form-group">
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-input"
                placeholder="Kata Sandi Baru"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Confirm Password*/}
          <div className="form-group">
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-input"
                placeholder="Konfirmasi Kata Sandi Baru"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
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
