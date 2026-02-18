import { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";

const ForgotPassword = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <h2 className="page-title">Mereset Kata Sandi</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <p style={{ marginBottom: "20px", color: "#666", lineHeight: "1.5" }}>
            Untuk mereset Kata Sandi, masukan email yang telah terdaftar dan
            masukan kata sandi yang baru
          </p>
          <InputField
            className="form-input"
            type="email"
            placeholder="masukkan email anda..."
          />
          <InputField
            className="form-input"
            type="password"
            isPassword={true}
            placeholder="masukkan kata sandi baru..."
          />
          <InputField
            className="form-input"
            type="password"
            placeholder="Konfirmasi ulang kata sandi baru..."
          />
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <Link to="/" style={{ width: "100%" }}>
            <button type="button" className="btn-secondary">
              Kembali
            </button>
          </Link>
          <button type="submit" className="btn-primary">
            Simpan
          </button>
        </div>
      </form>
    </>
  );
};

export default ForgotPassword;
