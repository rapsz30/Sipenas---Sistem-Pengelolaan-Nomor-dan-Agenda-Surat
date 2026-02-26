import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";

const ForgotPass1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const emailToReset = location.state?.email;

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Jika user iseng mengakses halaman ini secara langsung tanpa mengisi email di halaman sebelumnya, tendang balik
  useEffect(() => {
    if (!emailToReset) {
      navigate("/forgot-password");
    }
  }, [emailToReset, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Validasi input di sisi frontend
    if (newPassword.length < 6) {
      setErrorMsg("Kata sandi baru minimal 6 karakter!");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Konfirmasi kata sandi tidak cocok!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/forgot-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: emailToReset, 
          otp, 
          newPassword 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message);
      } else {
        alert("Berhasil! " + data.message);
        navigate("/"); // Pindah kembali ke halaman login jika sukses
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMsg("Tidak dapat terhubung ke server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className="page-title">BUAT SANDI BARU</h2>
      <p style={{ textAlign: "center", marginBottom: "20px", fontSize: "14px", color: "#555" }}>
        Kode OTP telah dikirim ke <strong>{emailToReset}</strong>. Silakan masukkan kode tersebut beserta kata sandi baru Anda.
      </p>

      {errorMsg && (
        <div style={{ color: "red", marginBottom: "15px", textAlign: "center", fontSize: "14px", padding: "10px", backgroundColor: "#fee2e2", borderRadius: "5px" }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <InputField
            label="Kode OTP"
            type="text"
            placeholder="Masukkan 6 Digit OTP dari Email"
            value={otp}
            onChange={(e: any) => setOtp(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <InputField
            label="Kata Sandi Baru"
            isPassword={true}
            placeholder="Sandi baru (Min. 6 Karakter)"
            value={newPassword}
            onChange={(e: any) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <InputField
            label="Konfirmasi Kata Sandi"
            isPassword={true}
            placeholder="Ketik ulang sandi baru"
            value={confirmPassword}
            onChange={(e: any) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Memproses..." : "Reset Kata Sandi"}
        </Button>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link
            to="/login"
            style={{ fontSize: "14px", color: "#3b82f6", textDecoration: "none", fontWeight: "500" }}
          >
            Batal dan Kembali Login
          </Link>
        </div>
      </form>
    </>
  );
};

export default ForgotPass1;