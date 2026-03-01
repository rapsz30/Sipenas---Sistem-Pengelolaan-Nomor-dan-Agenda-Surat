import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState(""); 
  const [qrCodeUrl, setQrCodeUrl] = useState(""); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(""); 

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, otp }), 
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message);
        return;
      }
      if (data.requiresPasswordChange) {
        alert(data.message);
        localStorage.setItem("tempUserId", data.userId);
        navigate("/force-change-password"); 
        return; 
      }

      if (data.requiresSetupOTP) {
        setQrCodeUrl(data.qrCodeUrl); 
        alert(data.message);
        return;
      }
      if (data.requiresOTP) {
        return; 
      }
      if (data.success) {
        alert("Login Berhasil!");
        localStorage.setItem("user", JSON.stringify(data));

        if (data.role === "admin") {
          navigate("/admin"); 
        } else {
          navigate("/operator");
        }
      }

    } catch (error) {
      console.error("Error:", error);
      setErrorMsg("Tidak dapat terhubung ke server.");
    }
  };

  return (
    <>
      <h2 className="page-title">LOGIN AKUN</h2>

      {errorMsg && (
        <div style={{ color: "red", marginBottom: "15px", textAlign: "center" }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <InputField
          label="Nama Pengguna"
          placeholder="Nama Pengguna"
          value={username}
          onChange={(e: any) => setUsername(e.target.value)}
        />

        <div style={{ textAlign: "left", marginBottom: "15px" }}>
          <Link
            to="/forgot-username"
            style={{ fontSize: "14px", color: "#3b82f6", textDecoration: "none", fontWeight: "500" }}
          >
            Lupa Nama Pengguna?
          </Link>
        </div>

        <InputField
          label="Kata Sandi"
          isPassword={true}
          placeholder="Kata Sandi"
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
        />

        <div style={{ textAlign: "left", marginBottom: "20px" }}>
          <Link
            to="/forgot-password"
            style={{ fontSize: "14px", color: "#3b82f6", textDecoration: "none", fontWeight: "500" }}
          >
            Lupa Kata Sandi?
          </Link>
        </div>
        {qrCodeUrl && (
          <div style={{ textAlign: "center", marginBottom: "20px", padding: "10px", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
            <p style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>
              Scan QR Code Ini di Google Authenticator
            </p>
            <img 
              src={qrCodeUrl} 
              alt="QR Code OTP" 
              style={{ width: "150px", height: "150px", border: "1px solid #ddd" }} 
            />
          </div>
        )}

        <div className="otp-section" style={{ marginBottom: "20px" }}>
          <InputField
            label="Kode OTP"
            placeholder="Masukan 6 Digit Kode OTP"
            value={otp}
            onChange={(e: any) => setOtp(e.target.value)}
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