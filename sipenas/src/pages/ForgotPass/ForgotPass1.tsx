import { Link, useNavigate } from "react-router-dom";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const handleChangePW = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <>
      <h2 className="page-title">Mereset Kata Sandi</h2>
      <form onSubmit={handleChangePW}>
        <div className="form-group">
          <p style={{ marginBottom: "20px", color: "#666", lineHeight: "1.5" }}>
            Untuk mereset Kata Sandi, masukan kode OTP yang telah kami kirim ke
            mail dan masukan kata sandi yang baru
          </p>
          <InputField
            className="form-input"
            placeholder="masukkan kode OTP..."
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
          <Link to="/forgot-password" style={{ width: "100%" }}>
            <button type="button" className="btn-secondary">
              Kembali
            </button>
          </Link>
          <Button type="submit" className="btn-primary">
            Simpan
          </Button>
        </div>
      </form>
    </>
  );
};

export default ForgotPassword;
