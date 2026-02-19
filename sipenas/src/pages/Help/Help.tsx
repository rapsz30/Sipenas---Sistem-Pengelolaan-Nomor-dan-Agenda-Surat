// src/pages/Help/Help.tsx
import Navbar from "../../components/Navbar/Navbar";
import "./Help.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFileLines } from "@fortawesome/free-solid-svg-icons";

const Help = () => {
  const helpCategories = [1, 2, 3, 4];

  return (
    <div className="help-container">
      <div className="help-navbar-wrapper">
        <Navbar />
      </div>

      <section className="search-section">
        <div className="icon-main">
          <FontAwesomeIcon icon={faSearch} />
        </div>

        <h2 className="help-title">Halo, ada yang bisa kami bantu?</h2>

        <div className="search-box">
          <input type="text" placeholder="Cari artikel..." />
          <button className="search-btn">
            <FontAwesomeIcon icon={faSearch} /> Cari
          </button>
        </div>

        <p className="search-hint">
          Ketik untuk mencari artikel, panduan, dan solusi. Tekan Enter untuk
          pencarian lanjutan.
        </p>
      </section>

      <section className="help-grid">
        {helpCategories.map((_, index) => (
          <div key={index} className="help-card">
            <div className="icon-placeholder">
              <FontAwesomeIcon icon={faFileLines} size="lg" />
            </div>

            <h3>Lorem Ipsum</h3>
            <p className="card-desc">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>

            <a href="#" className="card-link">
              Lihat Semua →
            </a>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Help;
