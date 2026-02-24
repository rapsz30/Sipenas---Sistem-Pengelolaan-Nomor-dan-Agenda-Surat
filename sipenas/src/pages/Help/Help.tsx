import Navbar from "../../components/Navbar/Navbar";
import "./Help.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSearch, 
  faBook, 
  faCircleQuestion, 
  faBullhorn, 
  faHeadset 
} from "@fortawesome/free-solid-svg-icons";

const Help = () => {
const helpCategories = [
    {
      title: "Panduan Pengguna",
      desc: "Pelajari cara menggunakan sistem SIPENAS dari awal hingga mahir.",
      icon: faBook,
      link: "/guide" 
    },
    {
      title: "FAQ",
      desc: "Temukan jawaban untuk pertanyaan yang paling sering diajukan pengguna.",
      icon: faCircleQuestion,
      link: "/faq" 
    },
    {
      title: "Pembaruan Sistem",
      desc: "Informasi mengenai fitur terbaru dan perbaikan pada sistem SIPENAS.",
      icon: faBullhorn,
      link: "/updates"
    },
    {
      title: "Hubungi Kami",
      desc: "Mengalami kendala teknis? Tim dukungan kami siap membantu Anda.",
      icon: faHeadset,
      link: "/contact"
    }
  ];

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
        {helpCategories.map((category, index) => (
          <div key={index} className="help-card">
            <div className="icon-placeholder">
              <FontAwesomeIcon icon={category.icon} size="2x" />
            </div>

            <h3>{category.title}</h3>
            <p className="card-desc">
              {category.desc}
            </p>

            <a href={category.link} className="card-link">
              Lihat Semua →
            </a>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Help;