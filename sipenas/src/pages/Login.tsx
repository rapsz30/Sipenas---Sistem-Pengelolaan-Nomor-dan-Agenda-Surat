import { Link } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";

const Login = () => {
  return (
    <>
      <h2 className="page-title">LOGIN AKUN</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <InputField label="Nama Pengguna" placeholder="Nama Pengguna" />

        <div style={{ textAlign: "left", marginBottom: "20px" }}>
          <Link
            to="/forgot-username"
            style={{
              fontSize: "14px",
              color: "#3b82f6",
              textDecoration: "none",
              fontWeight: 525,
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

        <div style={{ textAlign: "left", marginBottom: "20px" }}>
          <Link
            to="/forgot-password"
            style={{
              fontSize: "14px",
              color: "#3b82f6",
              textDecoration: "none",
              fontWeight: 525,
            }}
          >
            Lupa Kata Sandi?
          </Link>
        </div>

        <Button type="submit" variant="primary">
          Masuk
        </Button>
      </form>
    </>
  );
};

export default Login;
