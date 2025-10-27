-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 05, 2025 at 12:00 AM
-- Server version: 5.7.17
-- PHP Version: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `location_voitures`
--

-- --------------------------------------------------------

--
-- Table structure for table `personnes`
--

CREATE TABLE `personnes` (
  `Nom_et_prenom` varchar(60) NOT NULL,
  `Mot_de_Passe` varchar(7) NOT NULL,
  `Adresse` varchar(30) NOT NULL,
  `Mail` varchar(30) NOT NULL,
  `Role` enum('Administrateur','Utilisateur') NOT NULL DEFAULT 'Utilisateur',
  `ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `personnes`
--

INSERT INTO `personnes` (`Nom_et_prenom`, `Mot_de_Passe`, `Adresse`, `Mail`, `Role`, `ID`) VALUES
('Ahmed Ben Hammouda', 'admin', 'ESCT', 'Admin@gmail.com', 'Administrateur', 1),
('Mohamed Aziz Khmiri', 'khmiri', 'Manouba', 'azizkhmiri@gmail.com', 'Utilisateur', 2),
('Mohamed Aziz Lakhal', 'lakhal', 'Medina Jedida', 'azizlakhal@gmail.com', 'Utilisateur', 3),
('Feres Aissaoui', 'feres', 'Grombalia', 'feresaissaoui@gmail.com', 'Utilisateur', 4),
('Mohamed Rayen Khlif', 'rayen', 'Ras jebel', 'Rayenkhlif@gmail.com', 'Utilisateur', 5);

-- --------------------------------------------------------

--
-- Table structure for table `voitures`
--

CREATE TABLE `voitures` (
  `Marque` varchar(30) NOT NULL,
  `Modele` varchar(30) NOT NULL,
  `Age` int(11) NOT NULL,
  `Prix` float NOT NULL,
  `Ref` int(11) NOT NULL,
  `Dispo` tinyint(1) NOT NULL DEFAULT '1',
  `ID_locataire` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `voitures`
--

INSERT INTO `voitures` (`Marque`, `Modele`, `Age`, `Prix`, `Ref`, `Dispo`, `ID_locataire`) VALUES
('Mercedes', 'Class E', 2, 999, 3, 1, NULL),
('Porsche', 'Cayenne', 6, 1999, 4, 1, NULL),
('Toyota', 'Supra mk4', 5, 1700, 5, 1, NULL),
('Suzuki', 'CELERIO', 4, 90, 6, 1, NULL),
('BMW', 'Serie 4', 2, 699, 7, 1, NULL),
('ISUZU', 'D-MAX', 1, 299, 8, 1, NULL),
('KIA', 'Rio', 5, 95, 9, 1, NULL),
('HYUNDAI', 'i20', 8, 95, 10, 1, NULL),
('Renault', 'KADJAR', 6, 99, 11, 1, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `personnes`
--
ALTER TABLE `personnes`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `ID` (`ID`),
  ADD UNIQUE KEY `Mail` (`Mail`),
  ADD UNIQUE KEY `Mail_2` (`Mail`),
  ADD UNIQUE KEY `Mail_3` (`Mail`);

--
-- Indexes for table `voitures`
--
ALTER TABLE `voitures`
  ADD PRIMARY KEY (`Ref`),
  ADD KEY `ID locataire` (`ID_locataire`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `personnes`
--
ALTER TABLE `personnes`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `voitures`
--
ALTER TABLE `voitures`
  MODIFY `Ref` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `voitures`
--
ALTER TABLE `voitures`
  ADD CONSTRAINT `voitures_ibfk_1` FOREIGN KEY (`ID_locataire`) REFERENCES `personnes` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
