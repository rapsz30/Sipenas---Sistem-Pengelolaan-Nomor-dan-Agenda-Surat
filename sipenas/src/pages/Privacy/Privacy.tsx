import Navbar from "../../components/Navbar/Navbar";
import "./Privacy.css";

const Privacy = () => {
  return (
    <div className="privasi-container">
      <div className="privasi-nav">
        <Navbar />
      </div>

      <div className="privasi-card">
        <h1 className="privasi-title">Kebijakan Privasi dan Keamanan</h1>

        <ol className="policy-list">
          <li
            className="policy-item"
            style={{
              fontWeight: "bold",
              fontSize: "16px",
              marginBottom: "4px",
            }}
          >
            Pengumpulan Data Informasi
          </li>
          <p
            className="policy-text"
            style={{ marginTop: "0px", marginBottom: "20px" }}
          >
            Sistem SIPENAS mengumpulkan data pribadi yang Anda berikan saat
            mendaftar atau menggunakan layanan kami, seperti nama lengkap,
            alamat email, nomor telepon, dan data instansi/jabatan. Kami juga
            dapat mengumpulkan log aktivitas penggunaan sistem untuk tujuan
            analisis dan peningkatan performa layanan. Semua data yang
            dikumpulkan akan dijaga kerahasiaannya dan hanya digunakan untuk
            keperluan operasional sistem pengelolaan surat.
          </p>

          <li
            className="policy-item"
            style={{
              fontWeight: "bold",
              fontSize: "16px",
              marginBottom: "4px",
            }}
          >
            Penggunaan Informasi Pengguna
          </li>
          <p
            className="policy-text"
            style={{ marginTop: "0px", marginBottom: "20px" }}
          >
            Informasi yang kami kumpulkan digunakan secara eksklusif untuk
            memfasilitasi proses pembuatan, pengelolaan, dan verifikasi nomor
            surat. Kami dapat menggunakan alamat email Anda untuk mengirimkan
            notifikasi penting terkait pengajuan surat (misalnya: surat
            disetujui atau ditolak), pembaruan sistem, atau informasi terkait
            pemulihan kata sandi. Kami tidak akan pernah menjual atau menyewakan
            informasi pribadi Anda kepada pihak ketiga.
          </p>

          <li
            className="policy-item"
            style={{
              fontWeight: "bold",
              fontSize: "16px",
              marginBottom: "4px",
            }}
          >
            Keamanan dan Perlindungan Data
          </li>
          <p
            className="policy-text"
            style={{ marginTop: "0px", marginBottom: "20px" }}
          >
            Kami berkomitmen penuh untuk melindungi keamanan data Anda beserta
            seluruh dokumen persuratan yang ada di dalam SIPENAS. Kami
            mengimplementasikan berbagai perlindungan keamanan teknis, termasuk
            enkripsi kata sandi dan pembatasan hak akses berbasis peran
            (Role-Based Access Control) untuk mencegah akses yang tidak sah.
            Dokumen yang diunggah hanya dapat dilihat oleh pihak-pihak yang
            memiliki wewenang (Operator dan Admin terkait).
          </p>

          <li
            className="policy-item"
            style={{
              fontWeight: "bold",
              fontSize: "16px",
              marginBottom: "4px",
            }}
          >
            Hak Akses dan Kendali Pengguna
          </li>
          <p
            className="policy-text"
            style={{ marginTop: "0px", marginBottom: "20px" }}
          >
            Sebagai pengguna sistem, Anda memiliki hak untuk mengakses,
            memeriksa, dan meminta pembaruan terhadap informasi profil Anda jika
            terdapat kesalahan. Apabila Anda menemukan kejanggalan pada data
            surat atau aktivitas akun Anda, Anda dapat segera melaporkannya
            melalui menu "Hubungi Kami" pada Pusat Bantuan. Kebijakan privasi
            ini dapat diperbarui sewaktu-waktu dan akan diinformasikan melalui
            halaman rilis sistem.
          </p>
        </ol>
      </div>
    </div>
  );
};

export default Privacy;
