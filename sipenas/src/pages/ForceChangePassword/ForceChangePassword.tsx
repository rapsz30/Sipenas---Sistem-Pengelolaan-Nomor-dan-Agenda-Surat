import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";


const ForceChangePassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const userId = localStorage.getItem("tempUserId");

  useEffect(() => {
    if (!userId) {
      navigate("/");
    }
  }, [userId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (newPassword.length < 6) {
      setErrorMsg("Kata sandi baru minimal 6 karakter!");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Konfirmasi kata sandi tidak cocok!");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/change-first-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, newPassword }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message);
        return;
      }

      alert(data.message);
      localStorage.removeItem("tempUserId");
      navigate("/");
    } catch (error) {
      setErrorMsg("Tidak dapat terhubung ke server.");
    }
  };

  return (
    <>
      <h2 className="page-title">GANTI KATA SANDI</h2>
      <p
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "14px",
          color: "#555",
        }}
      >
        Ini adalah login pertama Anda. Demi keamanan, Anda wajib mengganti kata
        sandi bawaan.
      </p>

      {errorMsg && (
        <div
          style={{ color: "red", marginBottom: "15px", textAlign: "center" }}
        >
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <InputField
          label="Kata Sandi Baru"
          isPassword={true}
          placeholder="Masukkan sandi baru"
          value={newPassword}
          onChange={(e: any) => setNewPassword(e.target.value)}
        />

        <InputField
          label="Konfirmasi Kata Sandi"
          isPassword={true}
          placeholder="Ketik ulang sandi baru"
          value={confirmPassword}
          onChange={(e: any) => setConfirmPassword(e.target.value)}
        />

        <div style={{ marginTop: "20px" }}>
          <Button type="submit" variant="primary">
            Simpan & Login Ulang
          </Button>
        </div>
      </form>
    </>
  );
};

export default ForceChangePassword;
