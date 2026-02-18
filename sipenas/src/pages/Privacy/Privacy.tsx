import { Link } from "react-router-dom";
import "./Privacy.css";

const Privacy = () => {
  const LoremItem = () => (
    <li className="policy-item">
      <span className="policy-header">Lorem Ipsum</span>
      <p className="policy-text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec gravida,
        eros sed ullamcorper sagittis, lectus urna tempus ex, id elementum ipsum
        dui nec nisi. Proin a velit augue. Integer rutrum, nisi at mattis
        lobortis, ante metus pretium magna, ut cursus ligula magna non nulla.
        Vivamus eget purus sed felis faucibus dignissim. Duis nec urna vitae
        nisi pretium rutrum. Proin nec leo efficitur, fringilla nisi ac, maximus
        purus. Praesent cursus dignissim magna, sit amet condimentum sem feugiat
        quis.
      </p>
    </li>
  );

  return (
    <div className="privasi-container">
      {/* Navigation */}
      <nav className="privasi-nav">
        <Link to="#" className="nav-link-white">
          Bantuan
        </Link>
        <Link to="/" className="nav-link-white">
          Login
        </Link>
        <Link to="/privacy" className="nav-btn-active-glass">
          Privasi
        </Link>
      </nav>

      <div className="privasi-card">
        <h1 className="privasi-title">Kebijakan Privasi dan Keamanan</h1>

        <ol className="policy-list">
          <LoremItem />
          <LoremItem />
          <LoremItem />
          <LoremItem />
        </ol>
      </div>
    </div>
  );
};

export default Privacy;
