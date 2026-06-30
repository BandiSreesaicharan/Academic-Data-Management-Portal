-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: attendance_final
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `attendanceId` bigint NOT NULL,
  `courseId` int NOT NULL,
  `facultyId` int NOT NULL,
  `studentId` int NOT NULL,
  `date` date NOT NULL,
  `status` enum('present','absent') NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`attendanceId`),
  UNIQUE KEY `unique_attendance` (`courseId`,`studentId`,`date`),
  KEY `facultyId` (`facultyId`),
  KEY `studentId` (`studentId`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `courses` (`courseId`) ON DELETE CASCADE,
  CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`facultyId`) REFERENCES `users` (`userId`) ON DELETE CASCADE,
  CONSTRAINT `attendance_ibfk_3` FOREIGN KEY (`studentId`) REFERENCES `students` (`studentId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES (1,101,1111,4087,'2025-11-15','present','2025-11-14 19:32:15'),(1763560524691,101,1111,4087,'2025-11-19','absent','2025-11-19 13:55:24'),(1763560525763,101,1111,4082,'2025-11-19','absent','2025-11-19 13:55:24'),(1763560990906,101,1111,4082,'2025-11-18','absent','2025-11-19 14:03:09'),(1763560997497,101,1111,4087,'2025-11-18','absent','2025-11-19 14:03:09'),(1763561024540,102,1111,1,'2025-11-18','absent','2025-11-19 14:03:44'),(1763563477334,101,1111,4088,'2025-11-19','present','2025-11-19 14:44:28'),(1763565616579,101,1111,4087,'2025-11-20','present','2025-11-19 15:20:16'),(1763565622762,101,1111,4088,'2025-11-20','present','2025-11-19 15:20:16'),(1763565624294,101,1111,4082,'2025-11-20','present','2025-11-19 15:20:16'),(1763813551165,106,1111,4088,'2025-11-22','present','2025-11-22 12:12:29'),(1764142408068,109,1111,4088,'2025-11-26','present','2025-11-26 07:33:21'),(1764144825463,108,1111,4088,'2025-11-26','present','2025-11-26 08:13:40'),(1771585799157,101,1111,4088,'2026-02-20','present','2026-02-20 11:09:56'),(1771585800541,101,1111,4082,'2026-02-20','present','2026-02-20 11:09:56'),(1771585801901,101,1111,4087,'2026-02-20','present','2026-02-20 11:09:56'),(1782836349898,101,1111,4082,'2026-06-30','absent','2026-06-30 16:19:07'),(1782836351009,101,1111,4087,'2026-06-30','absent','2026-06-30 16:19:07'),(1782836356651,101,1111,4088,'2026-06-30','present','2026-06-30 16:19:07');
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `courseId` int NOT NULL,
  `name` varchar(200) NOT NULL,
  `facultyId` int DEFAULT NULL,
  `semester` int NOT NULL,
  PRIMARY KEY (`courseId`),
  KEY `facultyId` (`facultyId`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`facultyId`) REFERENCES `users` (`userId`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (101,'DBMS',1111,1),(102,'IMS',1111,2),(103,'CC',1111,2),(105,'AI',1111,2),(106,'CN',1111,1),(108,'AIML',1111,2),(109,'ML',1111,1);
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mapping`
--

DROP TABLE IF EXISTS `mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mapping` (
  `mapId` int NOT NULL,
  `studentId` int NOT NULL,
  `courseId` int NOT NULL,
  PRIMARY KEY (`mapId`),
  KEY `studentId` (`studentId`),
  KEY `courseId` (`courseId`),
  CONSTRAINT `mapping_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `students` (`studentId`) ON DELETE CASCADE,
  CONSTRAINT `mapping_ibfk_2` FOREIGN KEY (`courseId`) REFERENCES `courses` (`courseId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mapping`
--

LOCK TABLES `mapping` WRITE;
/*!40000 ALTER TABLE `mapping` DISABLE KEYS */;
INSERT INTO `mapping` VALUES (1,4087,101),(2,4082,101),(3,1,102),(4,4088,101),(5,4088,103),(6,4088,106),(9,4088,109),(10,4088,108);
/*!40000 ALTER TABLE `mapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `reportId` int NOT NULL,
  `courseId` int NOT NULL,
  `totalClasses` int DEFAULT '0',
  `presentCount` int DEFAULT '0',
  `attendancePercentage` decimal(5,2) DEFAULT '0.00',
  PRIMARY KEY (`reportId`),
  KEY `courseId` (`courseId`),
  CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `courses` (`courseId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `studentId` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `rollNumber` varchar(100) DEFAULT NULL,
  `batch` varchar(50) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`studentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'saicharan','2403a54088','3','CSE'),(4082,'Saketh','2403a54082','3','CSE'),(4087,'Akshitha','2403a54087','3','CSE'),(4088,'BandiSreesaicharan',NULL,NULL,NULL);
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userId` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `roll` enum('student','faculty','admin') NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'saicharan','student','saicharan@gmail.com','root','CSE','2025-11-14 23:41:15'),(1111,'VijayKumar','faculty','vijay@gmail.com','root','','2025-11-14 19:17:07'),(4082,'Saketh','student','saketh@gmail.com','root','CSE','2025-11-14 19:28:24'),(4087,'Akshitha','student','akshitha@gmail.com','root','CSE','2025-11-14 19:29:02'),(4088,'BandiSreesaicharan','student','bandisreesaicharan@gmail.com','root','','2025-11-14 19:16:10'),(9999,'admin','admin','admin@gmail.com','root','','2025-11-14 19:22:04');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-30 22:53:21
