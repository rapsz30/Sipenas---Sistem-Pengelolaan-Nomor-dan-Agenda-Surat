-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 28, 2026 at 10:21 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_sipenas`
--

-- --------------------------------------------------------

--
-- Table structure for table `bidang`
--

CREATE TABLE `bidang` (
  `id_bidang` int(11) NOT NULL,
  `nama_bidang` varchar(100) NOT NULL,
  `kode_bidang` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bidang`
--

INSERT INTO `bidang` (`id_bidang`, `nama_bidang`, `kode_bidang`) VALUES
(1, 'Administrasi', 'ADM'),
(2, 'Bidang Infrastruktur Teknologi Informasi dan Komunikasi', 'INF'),
(3, 'Bidang Layanan E-Government', 'EGOV'),
(4, 'Bidang Pengelolaan Informasi dan Komunikasi Publik', 'PIKP'),
(5, 'Bidang Persandiandan Keamaanan Informasi', 'SKI'),
(6, 'Bidang Statistik Sektoral', 'STAT');

-- --------------------------------------------------------

--
-- Table structure for table `jenis_surat`
--

CREATE TABLE `jenis_surat` (
  `id_jenis_surat` int(11) NOT NULL,
  `nama_jenis` enum('Surat Keluar Dinas','Surat Keputusan Kadis','Surat Cuti','Surat Tidak Absen','Surat Tugas') NOT NULL,
  `kode_klasifikasi` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jenis_surat`
--

INSERT INTO `jenis_surat` (`id_jenis_surat`, `nama_jenis`, `kode_klasifikasi`) VALUES
(16, 'Surat Keluar Dinas', 'SKD.01'),
(17, 'Surat Keputusan Kadis', 'SKK.01'),
(18, 'Surat Cuti', 'C.01'),
(19, 'Surat Tidak Absen', 'TA.01'),
(20, 'Surat Tugas', 'ST.01');

-- --------------------------------------------------------

--
-- Table structure for table `nomor_surat`
--

CREATE TABLE `nomor_surat` (
  `id_nomor` int(11) NOT NULL,
  `id_jenis_surat` int(11) NOT NULL,
  `nomor_surat` varchar(50) NOT NULL,
  `tanggal` date NOT NULL,
  `available` enum('Yes','No') NOT NULL DEFAULT 'Yes',
  `tanggal_dipakai` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nomor_surat`
--

INSERT INTO `nomor_surat` (`id_nomor`, `id_jenis_surat`, `nomor_surat`, `tanggal`, `available`, `tanggal_dipakai`) VALUES
(45, 17, 'SKK.01/1', '2026-01-01', 'No', '2026-02-28 16:14:51'),
(46, 17, 'SKK.01/2', '2026-01-01', 'Yes', NULL),
(47, 17, 'SKK.01/3', '2026-01-01', 'Yes', NULL),
(48, 17, 'SKK.01/4', '2026-01-01', 'Yes', NULL),
(49, 17, 'SKK.01/5', '2026-01-01', 'Yes', NULL),
(50, 17, 'SKK.01/6', '2026-01-01', 'Yes', NULL),
(51, 17, 'SKK.01/7', '2026-01-01', 'Yes', NULL),
(52, 17, 'SKK.01/8', '2026-01-01', 'Yes', NULL),
(53, 17, 'SKK.01/9', '2026-01-01', 'Yes', NULL),
(54, 17, 'SKK.01/10', '2026-01-01', 'Yes', NULL),
(55, 17, 'SKK.01/11', '2026-01-01', 'Yes', NULL),
(56, 16, 'SKD.01/1', '2026-01-01', 'No', '2026-02-28 16:15:11'),
(57, 16, 'SKD.01/2', '2026-01-01', 'Yes', NULL),
(58, 16, 'SKD.01/3', '2026-01-01', 'Yes', NULL),
(59, 16, 'SKD.01/4', '2026-01-01', 'Yes', NULL),
(60, 16, 'SKD.01/5', '2026-01-01', 'Yes', NULL),
(61, 16, 'SKD.01/6', '2026-01-01', 'Yes', NULL),
(62, 16, 'SKD.01/7', '2026-01-01', 'Yes', NULL),
(63, 16, 'SKD.01/8', '2026-01-01', 'Yes', NULL),
(64, 16, 'SKD.01/9', '2026-01-01', 'Yes', NULL),
(65, 16, 'SKD.01/10', '2026-01-01', 'Yes', NULL),
(66, 16, 'SKD.01/11', '2026-01-01', 'Yes', NULL),
(67, 17, 'SKK.01/12', '2026-02-18', 'No', '2026-02-28 16:15:39'),
(68, 17, 'SKK.01/13', '2026-02-18', 'Yes', NULL),
(69, 17, 'SKK.01/14', '2026-02-18', 'Yes', NULL),
(70, 17, 'SKK.01/15', '2026-02-18', 'Yes', NULL),
(71, 17, 'SKK.01/16', '2026-02-18', 'Yes', NULL),
(72, 17, 'SKK.01/17', '2026-02-18', 'Yes', NULL),
(73, 17, 'SKK.01/18', '2026-02-18', 'Yes', NULL),
(74, 17, 'SKK.01/19', '2026-02-18', 'Yes', NULL),
(75, 17, 'SKK.01/20', '2026-02-18', 'Yes', NULL),
(76, 17, 'SKK.01/21', '2026-02-18', 'Yes', NULL),
(77, 17, 'SKK.01/22', '2026-02-18', 'Yes', NULL),
(78, 17, 'SKK.01/23', '2026-02-28', 'No', '2026-02-28 16:16:36'),
(79, 17, 'SKK.01/24', '2026-02-28', 'No', '2026-02-28 16:16:43'),
(80, 17, 'SKK.01/25', '2026-02-28', 'Yes', NULL),
(81, 17, 'SKK.01/26', '2026-02-28', 'Yes', NULL),
(82, 17, 'SKK.01/27', '2026-02-28', 'Yes', NULL),
(83, 17, 'SKK.01/28', '2026-02-28', 'Yes', NULL),
(84, 17, 'SKK.01/29', '2026-02-28', 'Yes', NULL),
(85, 17, 'SKK.01/30', '2026-02-28', 'Yes', NULL),
(86, 17, 'SKK.01/31', '2026-02-28', 'Yes', NULL),
(87, 17, 'SKK.01/32', '2026-02-28', 'Yes', NULL),
(88, 17, 'SKK.01/33', '2026-02-28', 'Yes', NULL),
(89, 16, 'SKD.01/12', '2026-02-28', 'No', '2026-02-28 16:16:48'),
(90, 16, 'SKD.01/13', '2026-02-28', 'Yes', NULL),
(91, 16, 'SKD.01/14', '2026-02-28', 'Yes', NULL),
(92, 16, 'SKD.01/15', '2026-02-28', 'Yes', NULL),
(93, 16, 'SKD.01/16', '2026-02-28', 'Yes', NULL),
(94, 16, 'SKD.01/17', '2026-02-28', 'Yes', NULL),
(95, 16, 'SKD.01/18', '2026-02-28', 'Yes', NULL),
(96, 16, 'SKD.01/19', '2026-02-28', 'Yes', NULL),
(97, 16, 'SKD.01/20', '2026-02-28', 'Yes', NULL),
(98, 16, 'SKD.01/21', '2026-02-28', 'Yes', NULL),
(99, 16, 'SKD.01/22', '2026-02-28', 'Yes', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `pengajuan_surat`
--

CREATE TABLE `pengajuan_surat` (
  `id_pengajuan_surat` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_jenis_surat` int(11) NOT NULL,
  `id_periode` int(11) NOT NULL,
  `perihal_surat` text NOT NULL,
  `file_lampiran` varchar(255) DEFAULT NULL,
  `tanggal_pengajuan` timestamp NOT NULL DEFAULT current_timestamp(),
  `status_pengajuan` enum('pending','disetujui','ditolak') DEFAULT 'pending',
  `nomor_surat_resmi` varchar(100) DEFAULT NULL,
  `keterangan_surat` text DEFAULT NULL,
  `catatan_admin` text DEFAULT NULL,
  `tanggal_disetujui` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pengajuan_surat`
--

INSERT INTO `pengajuan_surat` (`id_pengajuan_surat`, `id_user`, `id_jenis_surat`, `id_periode`, `perihal_surat`, `file_lampiran`, `tanggal_pengajuan`, `status_pengajuan`, `nomor_surat_resmi`, `keterangan_surat`, `catatan_admin`, `tanggal_disetujui`) VALUES
(10, 3, 16, 2, 'S', '1772269998685.pdf', '2025-12-31 17:00:00', 'disetujui', 'SKD.01/1', '', NULL, NULL),
(11, 3, 16, 2, 'S', '1772270021514.docx', '2026-02-27 17:00:00', 'disetujui', 'SKD.01/12', 'S', NULL, NULL),
(12, 3, 17, 2, 'S', '1772270039998.docx', '2025-12-31 17:00:00', 'disetujui', 'SKK.01/1', '', NULL, NULL),
(13, 3, 17, 2, 'S', '1772270057190.docx', '2026-02-17 17:00:00', 'disetujui', 'SKK.01/12', '', NULL, NULL),
(14, 3, 17, 2, 'S', '1772270074173.docx', '2026-02-27 17:00:00', 'disetujui', 'SKK.01/24', 'S', NULL, NULL),
(15, 3, 17, 2, 'k', '1772270172403.pdf', '2026-02-27 17:00:00', 'disetujui', 'SKK.01/23', '', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `periode`
--

CREATE TABLE `periode` (
  `id_periode` int(11) NOT NULL,
  `nama_periode` varchar(50) NOT NULL,
  `tanggal_mulai` date NOT NULL,
  `tanggal_berakhir` date NOT NULL,
  `status_periode` enum('aktif','tidak aktif') DEFAULT 'aktif'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `periode`
--

INSERT INTO `periode` (`id_periode`, `nama_periode`, `tanggal_mulai`, `tanggal_berakhir`, `status_periode`) VALUES
(1, 'Periode Q1 2026', '2026-01-01', '2026-02-01', 'tidak aktif'),
(2, 'Periode Q2 2026', '2026-02-01', '2026-02-28', 'aktif');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_users` int(11) NOT NULL,
  `id_bidang` int(11) DEFAULT NULL,
  `nama_lengkap` varchar(150) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_first_login` tinyint(1) DEFAULT 1,
  `role` enum('admin','operator') NOT NULL,
  `email` varchar(100) NOT NULL,
  `google_auth_secret` varchar(100) DEFAULT NULL,
  `otp_email` varchar(10) DEFAULT NULL,
  `otp_expiry` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_users`, `id_bidang`, `nama_lengkap`, `username`, `password`, `is_first_login`, `role`, `email`, `google_auth_secret`, `otp_email`, `otp_expiry`) VALUES
(2, 1, 'Rafi', 'Sekretariat', '$2b$10$ZE9wdFXzC/iELvv/qh/fuuqVQhPE.5n9ThvfPFfOl4yBjXlXP.mqK', 0, 'admin', 'rafihendryansyah26@gmail.com', 'FFSFS7AEMJTV6FTG', '503231', '2026-02-26 14:38:48'),
(3, 3, 'Mohamad Rafi', 'operator e-gov', '$2b$10$xEZZND.fbFzqyEsZxAEq8OhE9mz1E9vFBH/pAhRL/k.uoI0ywGQjG', 0, 'operator', '23523064@students.uii.ac.id', 'GQACCTKFARZCGF2X', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bidang`
--
ALTER TABLE `bidang`
  ADD PRIMARY KEY (`id_bidang`),
  ADD UNIQUE KEY `kode_bidang` (`kode_bidang`);

--
-- Indexes for table `jenis_surat`
--
ALTER TABLE `jenis_surat`
  ADD PRIMARY KEY (`id_jenis_surat`);

--
-- Indexes for table `nomor_surat`
--
ALTER TABLE `nomor_surat`
  ADD PRIMARY KEY (`id_nomor`),
  ADD UNIQUE KEY `nomor_surat` (`nomor_surat`),
  ADD KEY `id_jenis_surat` (`id_jenis_surat`);

--
-- Indexes for table `pengajuan_surat`
--
ALTER TABLE `pengajuan_surat`
  ADD PRIMARY KEY (`id_pengajuan_surat`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_jenis_surat` (`id_jenis_surat`),
  ADD KEY `id_periode` (`id_periode`),
  ADD KEY `fk_nomor_surat_resmi` (`nomor_surat_resmi`);

--
-- Indexes for table `periode`
--
ALTER TABLE `periode`
  ADD PRIMARY KEY (`id_periode`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_users`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `id_bidang` (`id_bidang`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bidang`
--
ALTER TABLE `bidang`
  MODIFY `id_bidang` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `jenis_surat`
--
ALTER TABLE `jenis_surat`
  MODIFY `id_jenis_surat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `nomor_surat`
--
ALTER TABLE `nomor_surat`
  MODIFY `id_nomor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

--
-- AUTO_INCREMENT for table `pengajuan_surat`
--
ALTER TABLE `pengajuan_surat`
  MODIFY `id_pengajuan_surat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `periode`
--
ALTER TABLE `periode`
  MODIFY `id_periode` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_users` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `nomor_surat`
--
ALTER TABLE `nomor_surat`
  ADD CONSTRAINT `nomor_surat_ibfk_1` FOREIGN KEY (`id_jenis_surat`) REFERENCES `jenis_surat` (`id_jenis_surat`) ON DELETE CASCADE;

--
-- Constraints for table `pengajuan_surat`
--
ALTER TABLE `pengajuan_surat`
  ADD CONSTRAINT `fk_nomor_surat_resmi` FOREIGN KEY (`nomor_surat_resmi`) REFERENCES `nomor_surat` (`nomor_surat`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `pengajuan_surat_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_users`) ON DELETE CASCADE,
  ADD CONSTRAINT `pengajuan_surat_ibfk_2` FOREIGN KEY (`id_jenis_surat`) REFERENCES `jenis_surat` (`id_jenis_surat`),
  ADD CONSTRAINT `pengajuan_surat_ibfk_3` FOREIGN KEY (`id_periode`) REFERENCES `periode` (`id_periode`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`id_bidang`) REFERENCES `bidang` (`id_bidang`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
