import { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";

const ForgotUsn = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/forgot-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message);
      } else {
        setMessage(data.message); // Tampilkan pesan sukses dari backend
        setEmail(""); // Kosongkan input setelah berhasil
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
      <h2 className="page-title">LUPA NAMA PENGGUNA</h2>
      <p style={{ textAlign: "center", marginBottom: "20px", fontSize: "14px", color: "#555" }}>
        Masukkan alamat email yang terdaftar. Kami akan mengirimkan nama pengguna Anda ke email tersebut.
      </p>

      {/* Tampilkan pesan Error atau Sukses */}
      {errorMsg && (
        <div style={{ color: "red", marginBottom: "15px", textAlign: "center", fontSize: "14px", padding: "10px", backgroundColor: "#fee2e2", borderRadius: "5px" }}>
          {errorMsg}
        </div>
      )}
      {message && (
        <div style={{ color: "green", marginBottom: "15px", textAlign: "center", fontSize: "14px", padding: "10px", backgroundColor: "#d1fae5", borderRadius: "5px" }}>
          {message}
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
            {isLoading ? "Mengirim Email..." : "Kirim Username"}
          </Button>
        </div>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link
            to="/"
            style={{ fontSize: "14px", color: "#3b82f6", textDecoration: "none", fontWeight: "500" }}
          >
            Kembali ke Halaman Login
          </Link>
        </div>
      </form>
    </>
  );
};

export default ForgotUsn;