import { Link, useNavigate } from "react-router-dom";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";

const ForgotUsername = () => {
  const navigate = useNavigate();
  const handleForgotUsername = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <>
      <h2 className="page-title">LUPA NAMA PENGGUNA</h2>
      <form onSubmit={handleForgotUsername}>
        <p style={{ marginBottom: "20px", color: "#666", lineHeight: "1.5" }}>
          Masukkan alamat email yang terdaftar pada akun Anda. Kami akan
          mengirimkan nama pengguna Anda ke email tersebut.
        </p>

        <InputField
          label="Email Terdaftar"
          type="email"
          placeholder="masukkan email anda..."
        />

        <div style={{ display: "flex", gap: "10px", marginTop: "30px" }}>
          <Link to="/" style={{ width: "100%", textDecoration: "none" }}>
            <Button type="button" variant="secondary">
              Kembali
            </Button>
          </Link>
          <Button type="submit" variant="primary">
            Kirim
          </Button>
        </div>
      </form>
    </>
  );
};

export default ForgotUsername;
