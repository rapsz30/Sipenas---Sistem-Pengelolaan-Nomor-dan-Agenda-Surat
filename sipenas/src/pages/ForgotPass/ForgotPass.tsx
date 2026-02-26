import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";

const ForgotPass = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/forgot-password-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message);
      } else {
        alert(data.message); // Menampilkan pesan "Kode OTP telah dikirim..."
        
        // Pindah ke halaman ForgotPass1 (Langkah 2) dan Bawa data email-nya
        // Pastikan URL "/forgot-password-verify" ini sesuai dengan yang kamu daftarkan di App.tsx untuk file ForgotPass1.tsx
        navigate("/forgot-password1", { state: { email } }); 
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
      <h2 className="page-title">LUPA KATA SANDI</h2>
      <p style={{ textAlign: "center", marginBottom: "20px", fontSize: "14px", color: "#555" }}>
        Masukkan alamat email yang terhubung dengan akun Anda. Kami akan mengirimkan 6 digit kode OTP untuk mereset kata sandi.
      </p>

      {errorMsg && (
        <div style={{ color: "red", marginBottom: "15px", textAlign: "center", fontSize: "14px", padding: "10px", backgroundColor: "#fee2e2", borderRadius: "5px" }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <InputField
          label="Alamat Email"
          type="email"
          placeholder="contoh@email.com"
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
          required
        />

        <div style={{ marginTop: "20px" }}>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? "Mengirim Kode..." : "Kirim Kode OTP"}
          </Button>
        </div>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link
            to="/login"
            style={{ fontSize: "14px", color: "#3b82f6", textDecoration: "none", fontWeight: "500" }}
          >
            Kembali ke Halaman Login
          </Link>
        </div>
      </form>
    </>
  );
};

export default ForgotPass;