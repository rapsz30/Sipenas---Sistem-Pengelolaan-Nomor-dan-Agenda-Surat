import { Link } from "react-router-dom";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/operator");
  };

  return (
    <>
      <h2 className="page-title">LOGIN AKUN</h2>

      <form onSubmit={handleLogin}>
        <InputField label="Nama Pengguna" placeholder="Nama Pengguna" />

        <div
          style={{
            textAlign: "left",
            marginBottom: "15px",
          }}
        >
          <Link
            to="/forgot-username"
            style={{
              fontSize: "14px",
              color: "#3b82f6",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Lupa Nama Pengguna?
          </Link>
        </div>

        <InputField
          label="Kata Sandi"
          isPassword={true}
          placeholder="Kata Sandi"
        />

        <div
          style={{
            textAlign: "left",
            marginBottom: "20px",
          }}
        >
          <Link
            to="/forgot-password"
            style={{
              fontSize: "14px",
              color: "#3b82f6",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Lupa Kata Sandi?
          </Link>
        </div>

        <div className="otp-section" style={{ marginBottom: "20px" }}>

          {/* Disini scan qr google authenticator dulu baru kodenya muncul lewat app authenticator */}

          <InputField
            label="Kode OTP"
            placeholder="Masukan Kode OTP"
          />
        </div>

        <Button type="submit" variant="primary">
          Masuk
        </Button>
      </form>
    </>
  );
};

export default Login;
