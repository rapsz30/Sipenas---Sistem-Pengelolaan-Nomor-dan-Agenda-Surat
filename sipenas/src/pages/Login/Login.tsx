import { useState } from 'react';
import './Login.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );
  
  const EyeOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  );

  const RefreshIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
    </svg>
  );

  return (
    <div className="login-container">
      {/* Panel Kiri*/}
      <div className="left-panel">
        <nav className="top-nav">
          <a href="#" className="nav-link">Bantuan</a>
          <div className="nav-btn-active">Login</div>
          <a href="#" className="nav-link">Privasi</a>
        </nav>
      </div>

      {/* Panel Kanan */}
      <div className="right-panel">
        <h2 className="login-title">LOGIN AKUN</h2>
        
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Username*/}
          <div className="form-group">
            <label htmlFor="username">Nama Pengguna</label>
            <input 
              type="text" 
              id="username" 
              className="form-input" 
              placeholder="Nama Pengguna" 
            />
            <a href="#" className="forgot-link">Lupa Nama Pengguna?</a>
          </div>

          {/* Password*/}
          <div className="form-group">
            <label htmlFor="password">Kata Sandi</label>
            <div className="input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                className="form-input" 
                placeholder="Kata Sandi" 
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
            <a href="#" className="forgot-link">Lupa Kata Sandi?</a>
          </div>

          {/* Captcha*/}
          <div className="captcha-section">
            <div className="captcha-display">
              <span className="captcha-code">1RF5VV</span>
              <button type="button" className="refresh-btn" title="Refresh Captcha">
                <RefreshIcon />
              </button>
            </div>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Captcha" 
            />
          </div>

          <button type="submit" className="btn-submit">Masuk</button>
        </form>
      </div>
    </div>
  );
};

export default Login;