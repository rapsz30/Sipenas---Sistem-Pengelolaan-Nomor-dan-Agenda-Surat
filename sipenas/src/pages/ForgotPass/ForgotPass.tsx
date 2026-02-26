import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      const response = await fetch(
        "http://localhost:5000/api/forgot-password-request",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message);
      } else {
        alert(data.message); 
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
      <p
        style={{
          textAlign: "left",
          marginBottom: "20px",
          fontSize: "14px",
          color: "#555",
        }}
      >
        Masukkan alamat email yang terhubung dengan akun Anda. Kami akan
        mengirimkan 6 digit kode OTP untuk mereset kata sandi.
      </p>

      {errorMsg && (
        <div
          style={{
            color: "red",
            marginBottom: "15px",
            textAlign: "left",
            fontSize: "14px",
            padding: "10px",
            backgroundColor: "#fee2e2",
            borderRadius: "5px",
          }}
        >
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
        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/")}
          >
            Kembali
          </Button>

          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? "Mengirim Kode..." : "Kirim Kode OTP"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default ForgotPass;
