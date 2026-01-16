-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: hee_coffee
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `unit_price` decimal(10,2) NOT NULL,
  `temperature` varchar(20) DEFAULT NULL,
  `sweetness_level` varchar(20) DEFAULT NULL,
  `ice_level` varchar(20) DEFAULT NULL,
  `special_notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `idx_cart_product` (`cart_id`,`product_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (1,1,7,4,60000.00,NULL,NULL,NULL,NULL,'2025-09-04 06:59:00','2025-09-04 07:12:45'),(2,1,11,1,65000.00,NULL,NULL,NULL,NULL,'2025-09-04 07:01:20','2025-09-04 07:01:20'),(3,1,6,4,45000.00,NULL,NULL,NULL,NULL,'2025-09-04 07:01:22','2025-09-04 07:01:22'),(4,5,9,30,55000.00,NULL,NULL,NULL,NULL,'2025-09-07 08:00:11','2025-09-07 08:03:17');
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `status` enum('ACTIVE','PENDING_PAYMENT','COMPLETED','CANCELED','ABANDONED') DEFAULT 'ACTIVE',
  `total_amount` decimal(12,2) DEFAULT '0.00',
  `total_items` int DEFAULT '0',
  `discount_amount` decimal(12,2) DEFAULT '0.00',
  `tax_amount` decimal(12,2) DEFAULT '0.00',
  `final_amount` decimal(12,2) DEFAULT '0.00',
  `coupon_code` varchar(50) DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `checkout_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_status` (`user_id`,`status`),
  KEY `idx_session` (`session_id`),
  KEY `idx_expires` (`expires_at`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,1,'ACTIVE',0.00,9,NULL,NULL,485000.00,NULL,NULL,NULL,NULL,NULL,'2025-09-04 06:48:11','2025-09-04 07:12:45'),(2,4,'ACTIVE',0.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-09-07 07:32:25','2025-09-07 07:32:25'),(5,3,'ACTIVE',0.00,30,NULL,NULL,1650000.00,NULL,NULL,NULL,NULL,NULL,'2025-09-07 08:00:11','2025-09-07 08:03:17');
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_item`
--

DROP TABLE IF EXISTS `order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `unit_price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_order_item_order` (`order_id`),
  KEY `fk_order_item_product` (`product_id`),
  CONSTRAINT `fk_order_item_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `fk_order_item_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_item`
--

LOCK TABLES `order_item` WRITE;
/*!40000 ALTER TABLE `order_item` DISABLE KEYS */;
INSERT INTO `order_item` VALUES (1,1,9,30,55000.00),(2,2,9,30,55000.00),(3,3,6,4,45000.00),(4,3,7,4,60000.00),(5,3,11,1,65000.00),(6,4,7,4,60000.00),(7,4,11,1,65000.00),(8,4,6,4,45000.00),(9,5,6,4,45000.00),(10,5,7,4,60000.00),(11,5,11,1,65000.00),(12,6,2,1,55000.00),(13,7,2,1,55000.00),(14,8,2,1,55000.00),(15,8,3,8,55000.00),(16,8,4,1,55000.00),(17,9,2,1,55000.00),(18,9,3,8,55000.00),(19,9,4,1,55000.00),(20,10,2,1,55000.00),(21,10,3,8,55000.00),(22,10,4,1,55000.00),(23,11,2,1,55000.00),(24,11,3,8,55000.00),(25,11,4,1,55000.00),(26,12,2,1,55000.00),(27,12,3,8,55000.00),(28,12,4,1,55000.00),(29,13,2,1,55000.00),(30,13,3,8,55000.00),(31,13,4,1,55000.00),(32,14,2,1,55000.00),(33,14,3,8,55000.00),(34,14,4,1,55000.00),(35,15,2,1,55000.00),(36,15,3,8,55000.00),(37,15,4,1,55000.00),(38,16,2,1,55000.00),(39,17,4,2,55000.00),(40,18,2,1,55000.00),(41,19,3,1,55000.00),(42,20,1,1,45000.00),(43,20,3,1,55000.00),(44,21,2,1,55000.00),(45,22,2,1,55000.00),(46,23,3,1,55000.00),(47,24,1,12,45000.00),(48,25,2,3,55000.00),(49,26,2,1,55000.00),(50,27,2,1,55000.00),(51,27,3,1,55000.00),(52,28,2,1,55000.00),(53,28,3,1,55000.00),(54,29,2,1,55000.00),(55,30,2,1,55000.00),(56,31,2,2,55000.00),(57,32,2,2,55000.00),(58,32,10,1,55000.00),(59,33,12,1,60000.00),(60,34,12,1,60000.00),(61,34,1,1,45000.00),(62,35,5,1,55000.00),(63,36,1,1,45000.00),(64,37,2,1,55000.00),(65,38,3,1,55000.00),(66,39,14,1,50000.00),(67,40,16,1,65000.00),(68,41,3,1,55000.00),(69,42,2,1,55000.00),(70,43,2,1,55000.00),(71,44,3,1,55000.00),(72,45,1,1,45000.00),(73,46,1,1,45000.00),(74,47,3,1,55000.00),(75,48,3,1,55000.00),(76,48,1,1,45000.00),(77,49,1,1,45000.00),(78,50,1,1,45000.00),(79,51,17,8,65000.00),(80,52,2,1,55000.00),(81,53,3,1,55000.00),(82,54,4,1,55000.00),(83,55,4,1,55000.00),(84,56,4,1,55000.00),(85,57,3,1,55000.00),(86,58,2,1,55000.00),(87,59,4,1,55000.00),(88,60,7,1,60000.00),(89,61,22,1,45000.00),(90,62,29,1,200000.00),(91,62,1,3,45000.00),(92,62,2,1,55000.00),(93,62,16,2,65000.00),(94,63,2,1,55000.00),(95,64,3,1,55000.00),(96,65,1,1,45000.00),(97,66,6,1,45000.00),(98,67,6,1,45000.00),(99,67,2,1,55000.00),(100,68,3,1,55000.00),(101,69,2,1,55000.00),(102,70,2,1,55000.00),(103,71,20,4,45000.00),(104,71,21,1,45000.00),(105,72,16,1,65000.00),(106,73,13,1,50000.00),(107,74,2,1,55000.00),(108,75,4,1,55000.00),(109,76,2,1,55000.00),(110,77,2,1,55000.00),(111,78,12,1,60000.00);
/*!40000 ALTER TABLE `order_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `guest_name` varchar(255) DEFAULT NULL,
  `guest_email` varchar(255) DEFAULT NULL,
  `guest_address` varchar(255) DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `create_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `guest_phone` varchar(10) DEFAULT NULL,
  `is_paid` tinyint(1) DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_order_user` (`user_id`),
  CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,3,NULL,NULL,NULL,1650000.00,'MOMO','CANCELED','2025-09-08 10:30:10',NULL,NULL,NULL),(2,3,NULL,NULL,NULL,1650000.00,'MOMO','CANCELED','2025-09-08 10:54:26',NULL,NULL,NULL),(3,1,NULL,NULL,NULL,485000.00,'VNPay','CANCELED','2025-09-08 11:01:47',NULL,NULL,NULL),(4,1,NULL,NULL,NULL,485000.00,'VNPay','CANCELED','2025-09-15 12:41:32',NULL,NULL,NULL),(5,1,NULL,NULL,NULL,485000.00,'VNPay','CANCELED','2025-09-15 13:03:10',NULL,NULL,NULL),(6,4,NULL,NULL,'Viet Nam',55000.00,'CASH','CANCELED','2025-11-29 11:18:49','90807070',NULL,NULL),(7,4,NULL,NULL,'Viet Nam',55000.00,'CASH','CANCELED','2025-11-29 11:30:59','0908070605',NULL,NULL),(8,5,NULL,NULL,'as',550000.00,'CARD','CANCELED','2025-11-29 11:32:45','2',NULL,NULL),(9,5,NULL,NULL,'as',550000.00,'CARD','CANCELED','2025-11-29 11:32:48','2',NULL,NULL),(10,5,NULL,NULL,'as',550000.00,'CARD','CANCELED','2025-11-29 11:32:58','2',NULL,NULL),(11,5,NULL,NULL,'as',550000.00,'CARD','CANCELED','2025-11-29 11:33:06','2',NULL,NULL),(12,5,NULL,NULL,'as',550000.00,'CARD','CANCELED','2025-11-29 11:33:07','2',NULL,NULL),(13,5,NULL,NULL,'as',550000.00,'VNPay','CANCELED','2025-11-29 11:33:08','2',NULL,NULL),(14,5,NULL,NULL,'as',550000.00,'MOMO','CANCELED','2025-11-29 11:33:12','2',NULL,NULL),(15,5,NULL,NULL,'as',550000.00,'CASH','CANCELED','2025-11-29 11:33:14','2',NULL,NULL),(16,5,'huy','hee2@gmail.com','as',55000.00,'CASH','CANCELED','2025-11-29 11:49:28','123',NULL,NULL),(17,NULL,'huy','huy@gmai.com','số 1 Võ Văn Ngân, phường Linh Chiểu, Quận Thủ Đức',110000.00,'CASH','CANCELED','2025-11-29 11:50:29','123',NULL,NULL),(18,NULL,'á','sd@gmail.com','huy',55000.00,'CASH','CANCELED','2025-11-29 12:18:09','sd',NULL,NULL),(19,5,'huy','hee2@gmail.com','as',55000.00,'CASH','CANCELED','2025-11-29 12:18:44','0908070605',NULL,NULL),(20,5,'huy','hee2@gmail.com','as',100000.00,'CASH','CANCELED','2025-11-29 12:59:07','0908070605',NULL,NULL),(21,5,'huy','hee2@gmail.com','as',55000.00,'CASH','CANCELED','2025-11-29 13:26:52','0908070605',NULL,NULL),(22,5,'huy','hee2@gmail.com','as',55000.00,'CASH','CANCELED','2025-11-29 13:28:58','sd',NULL,NULL),(23,5,'huy','hee2@gmail.com','as',55000.00,'CASH','CANCELED','2025-11-29 13:29:35','0908070605',NULL,NULL),(24,NULL,'huy','hee2@gmail.com','as',540000.00,'CASH','CANCELED','2025-11-29 14:19:41','0908070605',NULL,NULL),(25,5,'huy','hee2@gmail.com','as',165000.00,'CASH','CANCELED','2025-11-29 14:20:27','0908070605',NULL,NULL),(26,NULL,'huy','hee2@gmail.com','as',55000.00,'CASH','CANCELED','2025-12-01 06:21:37','0908070605',NULL,NULL),(27,13,'Huy','admin@sont.click','HCM',110000.00,'VNPay','CANCELED','2025-12-02 09:21:05','90807070',NULL,NULL),(28,13,'Huy','admin@sont.click','HCM',110000.00,'MOMO','CANCELED','2025-12-02 09:26:59','90807070',NULL,NULL),(29,13,'Huy','admin@sont.click','HCM',55000.00,'MOMO','CANCELED','2025-12-04 07:07:42','90807070',NULL,NULL),(30,13,'Huy','admin@sont.click','HCM',55000.00,'CARD','CANCELED','2025-12-04 07:19:20','90807070',NULL,NULL),(31,13,'Huy','admin@sont.click','HCM',110000.00,'VNPay','CANCELED','2025-12-04 08:14:27','90807070',1,'2025-12-04 15:14:30'),(32,13,'Huy','admin@sont.click','HCM',165000.00,'CASH','CANCELED','2025-12-04 08:29:27','90807070',0,NULL),(33,13,'Huy','admin@sont.click','HCM',60000.00,'MOMO','CANCELED','2025-12-04 08:35:31','90807070',1,'2025-12-04 15:35:33'),(34,13,'Huy','admin@sont.click','HCM',105000.00,'CASH','CANCELED','2025-12-04 08:42:01','90807070',0,NULL),(35,13,'Huy','admin@sont.click','HCM',55000.00,'CASH','CANCELED','2025-12-04 08:46:35','90807070',0,NULL),(36,13,'Huy','admin@sont.click','HCM',45000.00,'CARD','CANCELED','2025-12-04 08:48:01','0908070605',1,'2025-12-04 15:48:04'),(37,13,'Huy','admin@sont.click','HCM',55000.00,'CASH','CANCELED','2025-12-04 14:01:23','0908070605',0,NULL),(38,13,'Huy','admin@sont.click','HCM',55000.00,'VNPay','CANCELED','2025-12-04 15:25:33','0908070605',1,'2025-12-04 22:25:36'),(39,NULL,'Hee','sd@gmail.com','huy',50000.00,'CASH','CANCELED','2025-12-05 08:58:15','1234567891',0,NULL),(40,NULL,'Hee','sd@gmail.com','huy',65000.00,'VNPay','COMPLETED','2025-12-05 08:58:50','1234567891',1,'2025-12-05 15:58:56'),(41,15,'Huy','123@gmail.com','số 1 Võ Văn Ngân, phường Linh Chiểu, Quận Thủ Đức',55000.00,'VNPay','COMPLETED','2025-12-05 08:59:50','1234567891',1,'2025-12-05 15:59:53'),(42,16,NULL,'1234@gmail.com','số 1 Võ Văn Ngân, phường Linh Chiểu, Quận Thủ Đức',55000.00,'CARD','COMPLETED','2025-12-05 09:27:31','1234567891',1,'2025-12-05 16:27:36'),(43,16,'linh','1234@gmail.com','HCM',55000.00,'VNPay','CANCELED','2025-12-05 09:29:41','1234567891',1,'2025-12-05 16:29:44'),(44,13,'Huy','admin@sont.click','HCM',55000.00,'CASH','ABANDONED','2025-12-05 09:56:46','0908070605',0,NULL),(45,NULL,'Sư','huy@gmail.com','số 1 Võ Văn Ngân, phường Linh Chiểu, Quận Thủ Đức',45000.00,'VNPay','CANCELED','2025-12-06 10:38:52','90807070',0,NULL),(46,13,'huy','admin@sont.click','HN',45000.00,'CASH','CANCELED','2025-12-06 10:39:22','90807070',0,NULL),(47,13,'huy','admin@sont.click','HN',55000.00,'MOMO','COMPLETED','2025-12-06 10:39:51','90807070',1,'2025-12-06 19:24:00'),(48,NULL,'huy','admin@sont.click','HN',100000.00,'CASH','COMPLETED','2025-12-06 10:52:48','90807070',1,'2025-12-06 19:24:02'),(49,NULL,'linh','1234@gmail.com','HCM',45000.00,'VNPay','CANCELED','2025-12-06 10:53:01','0908070605',0,NULL),(50,NULL,'linh','1234@gmail.com','HCM',45000.00,'VNPay','CANCELED','2025-12-06 10:57:05','0908070605',0,NULL),(51,NULL,'Huy','1234@gmail.com','số 1 Võ Văn Ngân, phường Linh Chiểu, Quận Thủ Đức',520000.00,'CARD','CANCELED','2025-12-06 11:00:46','1234567891',1,'2025-12-06 18:00:52'),(52,NULL,'Huy','1234@gmail.com','số 1 Võ Văn Ngân, phường Linh Chiểu, Quận Thủ Đức',55000.00,'MOMO','CANCELED','2025-12-06 11:01:39','1234567891',1,'2025-12-06 18:01:41'),(53,NULL,'Huy','huy@gmail.com','HCM',55000.00,'MOMO','CANCELED','2025-12-06 11:11:56','90807070',1,'2025-12-06 18:11:58'),(54,NULL,'Huy','huy@gmail.com','HCM',55000.00,'CASH','CANCELED','2025-12-06 11:13:32','90807070',0,NULL),(55,13,'huy','admin@sont.click','HN',55000.00,'CARD','CANCELED','2025-12-06 11:25:22','0908070605',1,'2025-12-06 18:25:24'),(56,NULL,'huy','admin@sont.click','HN',55000.00,'CASH','COMPLETED','2025-12-06 11:25:38','0908070605',0,NULL),(57,NULL,'huy','admin@sont.click','HN',55000.00,'CASH','CANCELED','2025-12-06 11:29:10','0908070605',1,'2025-12-06 18:37:16'),(58,18,'qwe','test@sont.click','ffff',55000.00,'CASH','CANCELED','2025-12-06 12:18:00','0908070605',0,NULL),(59,19,NULL,'huytruong2412hee@gmail.com','Viet Nam',55000.00,'CARD','CANCELED','2025-12-06 12:19:48','0394209024',1,'2025-12-06 19:19:49'),(60,NULL,'Truong Huy','huytruong2412hee@gmail.com','Viet Nam',60000.00,'CASH','CANCELED','2025-12-06 12:29:35','0394209024',0,NULL),(61,20,NULL,'098@gmail.com','ffff',45000.00,'CASH','CANCELED','2025-12-06 12:30:25','0908070605',1,'2025-12-06 19:32:05'),(62,NULL,'qwe','098@gmail.com','ffff',520000.00,'VNPay','CANCELED','2025-12-06 13:03:47','0908070605',1,'2025-12-06 20:03:57'),(63,NULL,'qwe','098@gmail.com','ffff',55000.00,'CASH','ABANDONED','2025-12-06 13:06:57','0908070605',0,NULL),(64,20,'new','098@gmail.com','số 1 Võ Văn Ngân, phường Linh Chiểu, Quận Thủ Đức',55000.00,'MOMO','CANCELED','2025-12-06 13:07:32','1234567891',1,'2025-12-06 20:07:33'),(65,13,'huy','admin@sont.click','HN',45000.00,'MOMO','CANCELED','2025-12-16 07:48:53','1234567891',1,'2025-12-16 14:57:23'),(66,13,'huy','admin@sont.click','HN',45000.00,'VNPay','CANCELED','2025-12-16 07:57:41','0908070605',1,'2025-12-16 15:42:12'),(67,13,'huy','admin@sont.click','HN',100000.00,'MOMO','ABANDONED','2025-12-16 08:08:09','0908070605',0,NULL),(68,13,'HUY','admin@sont.click','hcm',55000.00,'CARD','COMPLETED','2025-12-17 08:34:00','0908070605',1,'2025-12-17 15:34:02'),(69,NULL,'huy','huy@gmail.com','hcm',55000.00,'CASH','COMPLETED','2025-12-17 09:17:35','0908070605',0,NULL),(70,NULL,'huy','huy@gmail.com','hcm',55000.00,'CASH','ABANDONED','2026-01-01 11:37:53','0908070605',0,NULL),(71,13,'huy','admin@sont.click','HN',225000.00,'CASH','COMPLETED','2026-01-04 09:05:58','0394209024',1,'2026-01-04 16:06:12'),(72,24,'Truong Huy','huytruong2412@gmail.com','Viet Nam',65000.00,'MOMO','COMPLETED','2026-01-04 11:22:41','0394209024',1,'2026-01-04 18:22:44'),(73,25,NULL,'testcase1@gmail.com','hcm',50000.00,'VNPay','CANCELED','2026-01-04 11:25:16','0908070605',1,'2026-01-04 18:25:18'),(74,18,'BTW','test@sont.click','hn',55000.00,'MOMO','COMPLETED','2026-01-14 08:36:05','0908070605',1,'2026-01-14 15:36:07'),(75,18,'HA NOI','test@sont.click','hn',55000.00,'CASH','COMPLETED','2026-01-14 08:36:42','0908070605',1,'2026-01-14 15:37:01'),(76,27,NULL,'test5@gmail.com','hn',55000.00,'CASH','COMPLETED','2026-01-14 08:45:12','0908070605',1,'2026-01-14 15:46:14'),(77,18,'HA NOI','test@sont.click','hn',55000.00,'CASH','CANCELED','2026-01-14 09:28:51','0908070605',0,NULL),(78,NULL,'Huy','1234@gmail.com','số 1 Võ Văn Ngân, phường Linh Chiểu, Quận Thủ Đức',60000.00,'VNPay','COMPLETED','2026-01-14 09:29:10','1234567891',1,'2026-01-14 16:29:11');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_name` varchar(30) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `price` int DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'Espresso','A strong, bold shot of coffee with rich crema.',45000,'espresso','/coffee/espresso.jpg','ACTIVE'),(2,'Cappuccino','Creamy foam layered over strong espresso.',55000,'milk, espresso','/coffee/cappuccino.jpg','ACTIVE'),(3,'Latte','Smooth and balanced with milk and espresso.',55000,'milk, espresso','/coffee/latte.jpg','ACTIVE'),(4,'Flat White','Velvety microfoam over strong espresso.',55000,'milk, espresso','/coffee/flat_white.jpg','ACTIVE'),(5,'Macchiato','Espresso topped with a touch of steamed milk.',55000,'milk, espresso','/coffee/macchiato.jpg','ACTIVE'),(6,'Americano','Espresso with hot water for a lighter taste.',45000,'espresso','/coffee/americano.jpg','ACTIVE'),(7,'Mocha','A sweet blend of chocolate and espresso.',60000,'milk, espresso, chocolate','/coffee/mocha.jpg','ACTIVE'),(8,'Cold Brew','Brewed cold for 12 hours, smooth and refreshing.',50000,'coldbrew','/coffee/cold_brew.jpg','ACTIVE'),(9,'Golden Lemon Cold Brew','A refreshing mix of cold brew and zesty lemon for a bright summer twist.',55000,'coldbrew','/coffee/golden_lemon.jpg','ACTIVE'),(10,'Nitro Cold Brew','Infused with nitrogen for a silky-smooth texture and a rich, creamy finish — no milk needed.',55000,'coldbrew','/coffee/nitro.jpg','ACTIVE'),(11,'Affogato','Vanilla ice cream drowned in hot espresso.',65000,'espresso, dessert','/coffee/affogato.jpg','ACTIVE'),(12,'Caramel Macchiato','Rich espresso with milk and caramel drizzle.',60000,'milk, espresso','/coffee/caramel_macchiato.jpg','ACTIVE'),(13,'Matcha Latte','Earthy matcha blended with creamy milk.',50000,'milk, tea','/coffee/matcha_latte.jpg','ACTIVE'),(14,'Honey Citrus Mint Tea','Bright tea with honey, citrus, and a minty kick.',50000,'tea, fruit','/coffee/flat_white.jpg','ACTIVE'),(15,'Berry Smoothie','Refreshing smoothie with mixed berries.',65000,'smoothie, fruit','/coffee/berry_smoothie.jpg','ACTIVE'),(16,'Avocado Smoothie','Smooth, buttery avocado mixed with milk and honey.',65000,'smoothie, fruit','/coffee/avocado_smoothie.jpg','ACTIVE'),(17,'Mango Smoothie','A tropical blend of ripe mangoes and creamy yogurt.',65000,'smoothie, fruit','/coffee/mango_smoothie.jpg','ACTIVE'),(18,'Strawberry Smoothie','Sweet strawberries blended into a refreshing delight.',65000,'smoothie, fruit','/coffee/strawberry_smoothie.jpg','ACTIVE'),(19,'Orange Juice','Freshly squeezed and full of sunshine.',45000,'juice, fruit','/coffee/orange_juice.jpg','ACTIVE'),(20,'Watermelon Juice','Juicy, hydrating, and perfect for hot days.',45000,'juice, fruit','/coffee/watermelon_juice.jpg','ACTIVE'),(21,'Pineapple Juice','Tangy, sweet, and packed with sunshine.',45000,'fruit, juice','/coffee/pineapple_juice.jpg','ACTIVE'),(22,'Vietnamese Black Coffee','Strong and bold Vietnamese coffee brewed with a traditional phin filter.',45000,'signature','/coffee/black_coffee.jpg','ACTIVE'),(23,'Vietnamese Milk Coffee','Bold coffee with sweetened condensed milk.',50000,'signature','/coffee/vietnamese.jpg','ACTIVE'),(24,'Vietnamese White Coffee','A sweet Vietnamese-style coffee with condensed milk and a hint of espresso.',50000,'signature','/coffee/bac_xiu.jpg','ACTIVE'),(29,'milk','milk',200000,NULL,'https://as1.ftcdn.net/v2/jpg/01/06/68/88/1000_F_106688812_rVoRFXazgIMEUJdvffG9p0XvP8Lntf0a.jpg','INACTIVE');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_type`
--

DROP TABLE IF EXISTS `product_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_type` (
  `product_id` int NOT NULL,
  `type_id` int NOT NULL,
  PRIMARY KEY (`product_id`,`type_id`),
  KEY `type_id` (`type_id`),
  CONSTRAINT `product_type_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `product_type_ibfk_2` FOREIGN KEY (`type_id`) REFERENCES `type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_type`
--

LOCK TABLES `product_type` WRITE;
/*!40000 ALTER TABLE `product_type` DISABLE KEYS */;
INSERT INTO `product_type` VALUES (8,1),(9,1),(10,1),(1,2),(2,2),(3,2),(4,2),(5,2),(6,2),(7,2),(11,2),(12,2),(2,3),(3,3),(5,3),(7,3),(12,3),(13,3),(29,3),(15,4),(16,4),(17,4),(18,4),(13,5),(14,5),(14,6),(15,6),(16,6),(17,6),(18,6),(19,6),(20,6),(21,6),(7,7),(11,8),(19,9),(20,9),(21,9),(22,10),(23,10),(24,10);
/*!40000 ALTER TABLE `product_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type`
--

DROP TABLE IF EXISTS `type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type`
--

LOCK TABLES `type` WRITE;
/*!40000 ALTER TABLE `type` DISABLE KEYS */;
INSERT INTO `type` VALUES (1,'coldbrew'),(2,'espresso'),(3,'milk'),(4,'smoothie'),(5,'tea'),(6,'fruit'),(7,'chocolate'),(8,'dessert'),(9,'juice'),(10,'signature');
/*!40000 ALTER TABLE `type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `age` int DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'USER',
  `phone_number` varchar(10) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT NULL,
  `deleted_at` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,25,'LOL','test@example.com','$2a$10$gP8rJFDeQsdcW8XyQQ5Af.Mff.VygxlEKDD2x9cUGDMHz/g/EMONS','HCM','USER',NULL,0,NULL),(3,23,'Shane','Shane@gmail.com','$2a$10$9ZUS2cdkoRivF7LwNMCctOP9aLaAp9v4WCR2I7qYvPW7bhXRX3smO','Ap Bac',NULL,NULL,0,NULL),(4,23,'Aiko Tanaka','aiko.t@japan.jp','$2a$10$l32ws1f0YbmmLdDeR3kFyOVAQxE1PcuBVJ1o1JcIvSN9o3Ysmi3he','789 Shibuya',NULL,NULL,0,NULL),(5,24,'LMAO','test9@example.com','$2a$10$IRQYGsbBUChfElA1uwN8vOJHo6qhGCgOx0fpJpfNEy.ahA7Cj.bci','LBB',NULL,NULL,0,NULL),(6,25,'Nguyen Van A','vana@example.com','$2a$10$q0FiWqCRTH0JyP67mCr0Ue/zOyYgwDvhgaGgI2yP.H9YlmgVGJSBG','123 Nguyen Trai, Ha Noi',NULL,NULL,0,NULL),(13,25,'HUY','admin@sont.click','$2a$10$NWq9D/lDi1jQ0hosIjVtpeFhcGpXqfHOM/5wmd3usienbHP/lJLFu','hcm','ADMIN','0394209025',0,NULL),(14,25,'huy','user@sont.click','$2a$10$CHy0qZnRa44pdSNpceiqZ.08h1uL0Ug8B2tZIW6iPxEArrnAo0YWS','HCM','USER',NULL,0,NULL),(15,25,'Huy','123@gmail.com','$2a$10$xTYX7eyqaJOTzRo2fY//JOkjpgPmwowEv/hyEMwfUg61a117LRz4K','số 1 Võ Văn Ngân, phường Linh Chiểu, Quận Thủ Đức','USER',NULL,0,NULL),(16,25,'linh','1234@gmail.com','$2a$10$DQ1JMHdU4JQHnL3oFiGRTOINRoRcSk9XWWo3326.VIAuGZTLY7Spe','HCM','USER',NULL,0,NULL),(17,25,'Sư','12345@gmail.com','$2a$10$Y5LFP2D/PKApzdR0WO4ZTuaxjILbMN3sKFFcv3I85wBSCWZ9z6f3q','HN','USER',NULL,0,NULL),(18,25,'HA NOI','test@sont.click','$2a$10$0b05CmgZU4Hi8rGTPD6jUuOFdcNlM2SUsPzVokvtYMnSQLflleCMa','hn','USER','',0,NULL),(19,25,'Truong Huy','huytruong2412hee@gmail.com','$2a$10$.FHyFh3mnrZ1S55RDRuzK.pxVfj63D/oIhsM953.5jtjMQt33jhK6','Viet Nam','USER',NULL,0,NULL),(20,25,'new','098@gmail.com','$2a$10$eGPelUnGVJ7ZZi61X7pEuORBga6mvQGJz94jrc12ZGFArpbQnh1kq','HN','USER',NULL,0,NULL),(22,25,'12','test1@sont.click','$2a$10$6UtdFV.jBcvaDmqgnJKzDOKELby7lmsiVPJBLfywCvmkfemnAdM1G','24','USER',NULL,0,NULL),(23,23,'Admin','test2@sont.click','$2a$10$/jLja1u7omU8t1PPNWE4g.JJMut5X.vf/vnS7IX6DuGcSA2oiO36u','HN','USER',NULL,0,NULL),(24,26,'Truong Huy','huytruong2412@gmail.com','$2a$10$iPB.qDJc7TVYtp84BcKn0OS5Mw1oD4pEnrtZA1FsnyBtx7N4OQdoa','Viet Nam','USER','0908070602',0,NULL),(25,26,'huy','testcase1@gmail.com','$2a$10$BkrqfJ.E6Y0nCB2OiffSA.1cc/mRb1HcabR7TWHIAjreauzuLTWMO','HCM','USER',NULL,0,NULL),(26,26,'Huy','test3@sont.click','$2a$10$1YEmotBS/khStnkdzefDv.opIeFLVaF8iI51mFIBiMuCgFQfYC/w6','số 1 Võ Văn Ngân, phường Linh Chiểu, Quận Thủ Đức','USER',NULL,0,NULL),(27,26,'test5@gmail.com','test5@gmail.com','$2a$10$wSG1YjE5FsWm04ffefRbPOHwNJ2K9FKqUaJGgR.c4RYmYhEe7uE0K','số 1 Võ Văn Ngân, phường Linh Chiểu, Quận Thủ Đức','USER',NULL,1,'2026-01-14');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-16 15:07:29
