-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 17, 2026 at 04:54 PM
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
-- Database: `ecommerce_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `address`
--

CREATE TABLE `address` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `firstName` varchar(191) NOT NULL,
  `lastName` varchar(191) NOT NULL,
  `phone` varchar(191) NOT NULL,
  `country` varchar(191) NOT NULL,
  `city` varchar(191) NOT NULL,
  `area` varchar(191) DEFAULT NULL,
  `address` varchar(191) NOT NULL,
  `apartment` varchar(191) DEFAULT NULL,
  `postalCode` varchar(191) DEFAULT NULL,
  `isDefault` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `address`
--

INSERT INTO `address` (`id`, `userId`, `firstName`, `lastName`, `phone`, `country`, `city`, `area`, `address`, `apartment`, `postalCode`, `isDefault`, `createdAt`, `updatedAt`) VALUES
('cmu1bhmhd001028iofpcmk76z', 'cmtx7jzkc00015jxjcpb4mz1w', 'Ahmed', 'Farghally', '01065962515', 'Egypt', 'الغردقة', 'شبرا الخيمة ثان', '1 ش عبده القصاص الشارع الجديد ناصية هايبر الشرقية شبرا الخيمة ثان', '10', '13111', 0, '2026-09-14 14:07:24.432', '2026-09-16 22:34:42.116'),
('cmu1bv7gb001228iou9oaeh6x', 'cmtx7jzkc00015jxjcpb4mz1w', 'ايمان', 'رافت', '01144954837', 'Egypt', 'العبور', 'الحي السابع', 'شارع عبد المنعم واصل بجوزتر بنك مصر', '150', '11211', 1, '2026-09-14 14:17:58.135', '2026-09-16 22:12:09.198');

-- --------------------------------------------------------

--
-- Table structure for table `adminuser`
--

CREATE TABLE `adminuser` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `avatar` varchar(191) DEFAULT NULL,
  `role` enum('SUPER_ADMIN','ADMIN') NOT NULL DEFAULT 'ADMIN',
  `status` enum('ACTIVE','SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `adminuser`
--

INSERT INTO `adminuser` (`id`, `name`, `email`, `password`, `avatar`, `role`, `status`, `createdAt`, `updatedAt`) VALUES
('cmtx7hbik00005jxj8h0h0g9u', 'ahmed farghally', 'ahmed.fr1988@gmail.com', '$2b$10$JI5f9Hd5S2dXsIo9oioAMujZ8U.zzSRMJRHpNy9zbRt4gBxvMnmKK', NULL, 'SUPER_ADMIN', 'ACTIVE', '2026-09-11 17:04:07.051', '2026-09-12 15:43:32.045'),
('cmtyi9zlj000i5jxj4ou5vbdy', 'أسر فرغلي', 'asser@gmail.com', '$2b$10$Ub1c1pH/e7TKUVBxIahICO662Xwtgls/3Qjt20slsO1dfsckRhgqm', NULL, 'ADMIN', 'ACTIVE', '2026-09-12 14:54:06.967', '2026-09-16 19:17:35.610');

-- --------------------------------------------------------

--
-- Table structure for table `adminuserpermission`
--

CREATE TABLE `adminuserpermission` (
  `adminUserId` varchar(191) NOT NULL,
  `permissionId` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `adminuserpermission`
--

INSERT INTO `adminuserpermission` (`adminUserId`, `permissionId`) VALUES
('cmtyi9zlj000i5jxj4ou5vbdy', 'cmtyih3ot000dqmuopa5q274u'),
('cmtyi9zlj000i5jxj4ou5vbdy', 'cmtyih3oy000eqmuo4isg5za5'),
('cmtyi9zlj000i5jxj4ou5vbdy', 'cmtyih3p2000fqmuoqu1iw5zh'),
('cmtyi9zlj000i5jxj4ou5vbdy', 'cmtyih3p6000gqmuotneae4eg');

-- --------------------------------------------------------

--
-- Table structure for table `banner`
--

CREATE TABLE `banner` (
  `id` varchar(191) NOT NULL,
  `titleEn` varchar(191) DEFAULT NULL,
  `titleAr` varchar(191) DEFAULT NULL,
  `image` varchar(191) NOT NULL,
  `link` varchar(191) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `position` varchar(191) NOT NULL DEFAULT 'GRID'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `banner`
--

INSERT INTO `banner` (`id`, `titleEn`, `titleAr`, `image`, `link`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`, `position`) VALUES
('cmu193s2l000028ior295joho', '', '', '/uploads/sliders/1789390831006-offer_banner_31-1-1-1.png', 'category/mens_fashion', 1, 0, '2026-09-14 13:00:39.241', '2026-09-14 13:15:15.320', 'GRID'),
('cmu195clq000128iohvcrvbkj', '', '', '/uploads/sliders/1789390884566-offer_banner_41-1-1-1.jpg', 'category/mens_fashion', 1, 2, '2026-09-14 13:01:52.526', '2026-09-14 13:18:53.260', 'GRID'),
('cmu195z87000228io2vhp7gtx', '', '', '/uploads/sliders/1789390927641-offer_banner_21-1-1-1.jpg', 'category/electronics', 1, 0, '2026-09-14 13:02:21.846', '2026-09-14 13:18:34.750', 'GRID'),
('cmu1kbtr60000kxmtaeyxostr', '', '', '/uploads/sliders/1789409671905-617pmtQ_xNL._AC_SL1080_.jpg', '', 1, 0, '2026-09-14 18:14:50.429', '2026-09-14 18:15:03.425', 'SPECIAL_OFFER');

-- --------------------------------------------------------

--
-- Table structure for table `brand`
--

CREATE TABLE `brand` (
  `id` varchar(191) NOT NULL,
  `nameEn` varchar(191) NOT NULL,
  `nameAr` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `descriptionEn` text DEFAULT NULL,
  `descriptionAr` text DEFAULT NULL,
  `logo` varchar(191) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `brand`
--

INSERT INTO `brand` (`id`, `nameEn`, `nameAr`, `slug`, `descriptionEn`, `descriptionAr`, `logo`, `isActive`, `createdAt`, `updatedAt`) VALUES
('cmu04yevk000076ht6s7z2woe', 'samsung', 'سامسونج', 'samsung', 'Samsung is a leading global brand offering a wide range of electronics and innovative technology, combining quality, performance, and modern design.', 'سامسونج علامة تجارية عالمية رائدة تقدم مجموعة واسعة من الأجهزة الإلكترونية والتقنيات المبتكرة، مع التركيز على الجودة والأداء والتصميم العصري.', '/uploads/sliders/1789323356361-Samsung_Orig_Wordmark_BLACK_RGB.png', 1, '2026-09-13 18:16:44.218', '2026-09-13 18:16:44.218'),
('cmu050mc6000176httfgbwf6g', 'Apple', 'ابل', 'apple', 'Apple is a leading global technology brand known for innovative products that combine powerful performance, elegant design, high quality, and ease of use.', 'آبل علامة تجارية عالمية رائدة في مجال التكنولوجيا، تقدم أجهزة مبتكرة تجمع بين الأداء القوي، التصميم الأنيق، الجودة العالية وسهولة الاستخدام.', '/uploads/sliders/1789323503974-images.png', 1, '2026-09-13 18:18:27.220', '2026-09-13 18:18:27.220'),
('cmu051z75000276htc8c4zld1', 'OPPO', 'اوبو', 'OPPO', 'OPPO is a global technology brand specializing in smartphones and smart devices, known for modern designs, powerful performance, and innovative technology at competitive prices.', 'أوبو علامة تجارية عالمية متخصصة في الهواتف الذكية والأجهزة التقنية، وتتميز بتقديم تصميمات عصرية، أداء قوي، وتقنيات مبتكرة بأسعار تنافسية.', '/uploads/sliders/1789323567915-oppo-logo-1.png', 1, '2026-09-13 18:19:30.541', '2026-09-13 18:19:30.541'),
('cmu16tzl4001u8rzewdl0thqz', 'Others', 'أخرى', 'Others', 'Others Brand', 'براندات متنوعة', '', 1, '2026-09-14 11:57:03.207', '2026-09-14 11:57:03.207');

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) DEFAULT NULL,
  `sessionId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cartitem`
--

CREATE TABLE `cartitem` (
  `id` varchar(191) NOT NULL,
  `cartId` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `variantId` varchar(191) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` varchar(191) NOT NULL,
  `nameEn` varchar(191) NOT NULL,
  `nameAr` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `descriptionEn` text DEFAULT NULL,
  `descriptionAr` text DEFAULT NULL,
  `image` varchar(191) DEFAULT NULL,
  `parentId` varchar(191) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `showInHeader` tinyint(1) NOT NULL DEFAULT 1,
  `showInFooter` tinyint(1) NOT NULL DEFAULT 1,
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `metaTitle` varchar(191) DEFAULT NULL,
  `metaDescription` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `canonicalUrl` varchar(191) DEFAULT NULL,
  `customSchema` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `nameEn`, `nameAr`, `slug`, `descriptionEn`, `descriptionAr`, `image`, `parentId`, `isActive`, `showInHeader`, `showInFooter`, `sortOrder`, `metaTitle`, `metaDescription`, `createdAt`, `updatedAt`, `canonicalUrl`, `customSchema`) VALUES
('cmtykesmo0001mt97hnbgsc6f', 'Electronics', ' الإلكترونيات', 'electronics', 'Discover a wide range of modern electronics and accessories. Choose from high-quality products designed to meet your everyday needs at great prices.', 'اكتشف مجموعة متنوعة من الأجهزة والإكسسوارات الإلكترونية الحديثة، واختر من منتجات عالية الجودة تلبي احتياجاتك اليومية بأسعار مميزة.', '/uploads/sliders/1789228427825-Consumer-Electronics-Appliance_blog.jpeg', NULL, 1, 1, 1, 0, NULL, NULL, '2026-09-12 15:53:50.441', '2026-09-13 18:12:10.301', NULL, NULL),
('cmtzur0fo00066slzufe7yc69', 'Mobiles', 'موبايلات', 'Mobiles', 'Discover the latest smartphones with modern designs and a variety of features. Find the perfect phone for your needs at great prices.', 'اكتشف أحدث الهواتف الذكية بمواصفات متنوعة وتصاميم عصرية، واختر الهاتف المناسب لاحتياجاتك بأفضل الأسعار.', '/uploads/sliders/1789306258786-Bild_Samsung_Galaxy_S24_Ultra-757955.jpg', NULL, 1, 1, 1, 0, NULL, NULL, '2026-09-13 13:31:02.764', '2026-09-13 13:31:02.764', NULL, NULL),
('cmtzutg5800086slzs3x2n822', 'Home appliances', 'الأجهزة المنزلية', 'hom_appliances', 'Discover a wide range of modern and practical home appliances designed to meet your everyday needs, with great quality and competitive prices.', 'اكتشف مجموعة متنوعة من الأجهزة المنزلية العملية والحديثة، واختر ما يناسب احتياجات منزلك بجودة عالية وأسعار مميزة.', '/uploads/sliders/1789306372492-2222-jpg.webp', NULL, 1, 1, 1, 0, NULL, NULL, '2026-09-13 13:32:56.442', '2026-09-13 18:12:21.899', NULL, NULL),
('cmtzuw93u000a6slzcgsx9zj4', 'Perfumes', 'العطور', 'perfumes', 'Discover a premium collection of fragrances with captivating scents to suit every taste and occasion.', 'اكتشف مجموعة مميزة من العطور الفاخرة بروائح جذابة ومتنوعة تناسب جميع الأذواق والمناسبات.', '/uploads/sliders/1789306501135-LmIDLX0W6uwnaScL1hMPyDeoOkyNxgUDjszcdpum.webp', NULL, 1, 1, 0, 0, NULL, NULL, '2026-09-13 13:35:07.289', '2026-09-13 16:17:00.168', NULL, NULL),
('cmtzuzoeb000c6slzup6gnug1', 'Games', 'العاب', 'games', 'Discover a wide variety of fun and exciting games for all ages, perfect for enjoying entertaining moments filled with fun and challenges.', 'اكتشف مجموعة متنوعة من الألعاب الممتعة والمميزة لجميع الأعمار، واختر ألعابك المفضلة لقضاء أوقات مليئة بالمرح والتحدي.', '/uploads/sliders/1789306664558-kidstoys.jpg', NULL, 1, 1, 0, 0, NULL, NULL, '2026-09-13 13:37:47.074', '2026-09-13 16:16:53.737', NULL, NULL),
('cmtzv208n000e6slzx39wmyzo', 'Women’s fashion', 'ملابس حريمي', 'womens_fashion', 'Discover the latest women’s fashion trends with a stylish collection of modern clothing designed to suit every taste and occasion.', 'اكتشفي أحدث صيحات الموضة النسائية بتشكيلة متنوعة من الملابس الأنيقة والعصرية التي تناسب مختلف الأذواق والمناسبات.', '/uploads/sliders/1789306773336-istockphoto-2209015082-612x612.jpg', NULL, 1, 1, 1, 0, NULL, NULL, '2026-09-13 13:39:35.735', '2026-09-13 18:12:41.395', NULL, NULL),
('cmtzv44qk000g6slz0fbhmive', 'Men’s fashion', 'ملابس رجالي', 'mens_fashion', 'Discover the latest men’s fashion trends with a versatile collection of stylish and modern clothing for every taste and occasion.', 'اكتشف أحدث صيحات الموضة الرجالية مع تشكيلة متنوعة من الملابس الأنيقة والعصرية التي تناسب مختلف الأذواق والمناسبات.', '/uploads/sliders/1789306873138-rBVaR1vK5ySAOZGGAAXU8m4MjvE869.jpg', NULL, 1, 1, 0, 0, NULL, NULL, '2026-09-13 13:41:14.875', '2026-09-13 18:12:49.900', NULL, NULL),
('cmu027g3t0003567zjkk03ql4', 'Home Essentials', 'مستلزمات المنزل', 'home_essentials', 'Description: Discover a wide range of practical home essentials designed to make your everyday life easier and more comfortable, with great quality and affordable prices.', 'الوصف: اكتشف مجموعة متنوعة من مستلزمات المنزل العملية التي تساعدك على جعل حياتك اليومية أسهل وأكثر راحة، بجودة عالية وأسعار مناسبة.', '/uploads/sliders/1789318770251-8693395019874-2.jpg', NULL, 1, 0, 0, 0, NULL, NULL, '2026-09-13 16:59:46.879', '2026-09-13 18:11:32.180', NULL, NULL),
('cmu02e5we0005567zv9c5ftd0', 'Beauty Tools', 'ادوات تجميل', 'beauty_tools', 'Discover a wide range of beauty tools and personal care essentials designed to help you achieve a beautiful look with ease and comfort.', 'اكتشفي مجموعة متنوعة من أدوات ومستلزمات التجميل والعناية الشخصية، المصممة لتمنحك إطلالة أنيقة وتجربة سهلة ومريحة.', '/uploads/sliders/1789319088100-Picture1.png', NULL, 1, 1, 0, 0, NULL, NULL, '2026-09-13 17:05:00.252', '2026-09-13 17:05:00.252', NULL, NULL),
('cmu032q810007567zgm1iu4ac', 'Supermarket', 'السوبر ماركت', 'Supermarket', 'Discover a wide range of groceries, beverages, and everyday essentials you need for your home, with great quality and affordable prices.', 'اكتشف مجموعة متنوعة من المنتجات الغذائية والمشروبات والمستلزمات اليومية التي تحتاجها في منزلك، بجودة عالية وأسعار مناسبة.', '/uploads/sliders/1789320239345-istockphoto-2223757149-612x612.jpg', NULL, 1, 1, 0, 0, NULL, NULL, '2026-09-13 17:24:06.326', '2026-09-13 17:24:06.326', NULL, NULL),
('cmu0358z10009567z6mbtnxg2', 'Others', 'أخرى', 'Others', 'Discover a variety of unique and useful products that meet your everyday needs and suit different uses.', 'اكتشف مجموعة متنوعة من المنتجات المتنوعة والمميزة التي تلبي احتياجاتك اليومية وتناسب مختلف الاستخدامات.', '/uploads/sliders/1789320359214-61cjuqjUU4L._AC_UF894_1000_QL80_.jpg', NULL, 1, 0, 1, 0, NULL, NULL, '2026-09-13 17:26:03.900', '2026-09-13 18:10:56.243', NULL, NULL),
('cmu1d6ab40009a7f0bkwp8db0', 'Samsung', 'سامسونج', 'Samsung', 'lastset mobile', 'احدث موبايلات سامسونج', '/uploads/sliders/1789402124094-samsung-logo-samsung-icon-free-free-vector.jpg', 'cmtzur0fo00066slzufe7yc69', 1, 0, 0, 0, NULL, NULL, '2026-09-14 14:54:34.670', '2026-09-14 16:08:45.767', NULL, NULL),
('cmu1e8nlz000ha7f0nxatcqjm', 'apple', 'ابل', 'apple', 'Apple is one of the world\'s leading technology brands, offering a wide range of innovative products including iPhone, iPad, Mac, Apple Watch, AirPods, and more.', 'Apple هي واحدة من أشهر العلامات التجارية العالمية في مجال التكنولوجيا، وتقدم مجموعة واسعة من الأجهزة والمنتجات المبتكرة، بما في ذلك iPhone وiPad وMac وApple Watch وAirPods وغيرها.', '/uploads/sliders/1789402178074-images.png', 'cmtzur0fo00066slzufe7yc69', 1, 0, 0, 0, NULL, NULL, '2026-09-14 15:24:24.837', '2026-09-14 16:09:39.690', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `contactmessage`
--

CREATE TABLE `contactmessage` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `subject` varchar(191) NOT NULL,
  `message` text NOT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contactmessage`
--

INSERT INTO `contactmessage` (`id`, `name`, `email`, `phone`, `subject`, `message`, `isRead`, `createdAt`) VALUES
('cmu4ik33m001411st2r94447c', 'ahmed farghly', 'ahmed.fr1988@gmail.com', '01065962515', 'تكلفة المتجر الالكتروني', 'عاوز اعمل متجر الكتروني يخص الملابس وادوات التجميل عاوز اعرف التكلفة وهل السعر يشمل الدومين والباستضافة', 1, '2026-09-16 19:48:35.119');

-- --------------------------------------------------------

--
-- Table structure for table `country`
--

CREATE TABLE `country` (
  `id` varchar(191) NOT NULL,
  `code` varchar(191) NOT NULL,
  `nameEn` varchar(191) NOT NULL,
  `nameAr` varchar(191) NOT NULL,
  `currencyId` varchar(191) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `country`
--

INSERT INTO `country` (`id`, `code`, `nameEn`, `nameAr`, `currencyId`, `isActive`, `createdAt`, `updatedAt`) VALUES
('cmu494yyc0001tpnzp3or7y28', 'EG', 'Egypt', 'مصر', 'cmu2n79up0000v5xdoixucerx', 1, '2026-09-16 15:24:53.359', '2026-09-16 15:24:53.359'),
('cmu499tf20003tpnzx1i99mws', 'SA', 'Saudi Arabia', 'السعودية', 'cmu2o0cb80001tep6ejz8xs0b', 1, '2026-09-16 15:28:39.470', '2026-09-16 15:28:39.470'),
('cmu49puq10009tpnzbhf2v30q', 'OTHER', 'All Cuntries', 'جميع البلاد', 'cmu2nxaef0000tep6u7as0hc8', 1, '2026-09-16 15:41:07.658', '2026-09-16 15:42:41.832');

-- --------------------------------------------------------

--
-- Table structure for table `coupon`
--

CREATE TABLE `coupon` (
  `id` varchar(191) NOT NULL,
  `code` varchar(191) NOT NULL,
  `type` enum('PERCENTAGE','FIXED') NOT NULL DEFAULT 'PERCENTAGE',
  `value` decimal(10,2) NOT NULL,
  `minimumOrder` decimal(10,2) DEFAULT NULL,
  `maximumDiscount` decimal(10,2) DEFAULT NULL,
  `usageLimit` int(11) DEFAULT NULL,
  `usedCount` int(11) NOT NULL DEFAULT 0,
  `startsAt` datetime(3) DEFAULT NULL,
  `expiresAt` datetime(3) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `coupon`
--

INSERT INTO `coupon` (`id`, `code`, `type`, `value`, `minimumOrder`, `maximumDiscount`, `usageLimit`, `usedCount`, `startsAt`, `expiresAt`, `isActive`, `createdAt`, `updatedAt`) VALUES
('cmu1bbzqd000y28io4tney29k', 'WELCOME', 'FIXED', 1000.00, 30.00, 1000.00, 10, 2, '2026-09-14 11:02:00.000', '2026-09-30 11:02:00.000', 1, '2026-09-14 14:03:01.666', '2026-09-16 21:35:21.109'),
('cmu4mc64t0000mw7qebrzjkii', 'OFFER50', 'FIXED', 500.00, 50.00, 600.00, 100, 3, '2026-09-16 21:34:00.000', '2026-09-29 21:34:00.000', 1, '2026-09-16 21:34:24.269', '2026-09-16 22:35:30.777'),
('cmu4md0za0001mw7qz8sz4krf', 'AHMED', 'PERCENTAGE', 10.00, 50.00, 2500.00, 10, 3, '2026-09-16 21:34:00.000', '2026-10-28 21:34:00.000', 1, '2026-09-16 21:35:04.247', '2026-09-16 22:32:01.599');

-- --------------------------------------------------------

--
-- Table structure for table `currency`
--

CREATE TABLE `currency` (
  `id` varchar(191) NOT NULL,
  `code` varchar(191) NOT NULL,
  `nameEn` varchar(191) NOT NULL,
  `nameAr` varchar(191) NOT NULL,
  `symbol` varchar(191) NOT NULL,
  `exchangeRate` decimal(10,6) NOT NULL,
  `isBase` tinyint(1) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `currency`
--

INSERT INTO `currency` (`id`, `code`, `nameEn`, `nameAr`, `symbol`, `exchangeRate`, `isBase`, `isActive`, `createdAt`, `updatedAt`) VALUES
('cmu2n79up0000v5xdoixucerx', 'EGP', 'Egyptian Pound', 'الجنيه المصري', 'EGP', 1.000000, 1, 1, '2026-09-15 12:23:03.073', '2026-09-15 13:21:08.538'),
('cmu2nxaef0000tep6u7as0hc8', 'USD', 'Dollar', 'دولار', '$', 49.000000, 0, 1, '2026-09-15 12:43:16.839', '2026-09-15 13:25:28.419'),
('cmu2o0cb80001tep6ejz8xs0b', 'SAR', 'Rreal Saudi', 'ريال سعودي', ' ر س', 13.840000, 0, 1, '2026-09-15 12:45:39.284', '2026-09-15 13:26:32.189');

-- --------------------------------------------------------

--
-- Table structure for table `heroslide`
--

CREATE TABLE `heroslide` (
  `id` varchar(191) NOT NULL,
  `titleEn` varchar(191) NOT NULL,
  `titleAr` varchar(191) NOT NULL,
  `descriptionEn` text DEFAULT NULL,
  `descriptionAr` text DEFAULT NULL,
  `image` varchar(191) NOT NULL,
  `mobileImage` varchar(191) DEFAULT NULL,
  `buttonTextEn` varchar(191) DEFAULT NULL,
  `buttonTextAr` varchar(191) DEFAULT NULL,
  `buttonUrl` varchar(191) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `heroslide`
--

INSERT INTO `heroslide` (`id`, `titleEn`, `titleAr`, `descriptionEn`, `descriptionAr`, `image`, `mobileImage`, `buttonTextEn`, `buttonTextAr`, `buttonUrl`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES
('cmtzttbye00026slz76j6hrr4', '', '', NULL, NULL, '/uploads/sliders/1789403084611-banner-2-scaled.webp', NULL, NULL, NULL, NULL, 1, 0, '2026-09-13 13:04:51.398', '2026-09-14 16:24:47.961'),
('cmtztud6v00036slz857gc76b', '', '', NULL, NULL, '/uploads/sliders/1789403101784-Ecommerce-Banner.jpg', NULL, NULL, NULL, NULL, 1, 1, '2026-09-13 13:05:39.655', '2026-09-14 16:25:04.098'),
('cmtzudu3o00046slzx3os9ude', '', '', NULL, NULL, '/uploads/sliders/1789411304612-banner-6-scaled.webp', NULL, NULL, NULL, NULL, 1, 2, '2026-09-13 13:20:48.001', '2026-09-14 18:41:59.025');

-- --------------------------------------------------------

--
-- Table structure for table `newslettersubscriber`
--

CREATE TABLE `newslettersubscriber` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `newslettersubscriber`
--

INSERT INTO `newslettersubscriber` (`id`, `email`, `isActive`, `createdAt`, `updatedAt`) VALUES
('cmtzzyfmx0000567ztywrhc8a', 'ahmed.fr1988@gmail.com', 1, '2026-09-13 15:56:47.146', '2026-09-13 15:56:47.146'),
('cmu0018fj0001567zsucmttzu', 'composercore@gmail.com', 1, '2026-09-13 15:58:57.776', '2026-09-13 15:58:57.776');

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `message` text NOT NULL,
  `link` varchar(191) DEFAULT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notification`
--

INSERT INTO `notification` (`id`, `type`, `title`, `message`, `link`, `isRead`, `createdAt`) VALUES
('cmtx7jzks00025jxjb8rskz39', 'NEW_CUSTOMER', 'عميل جديد', 'قام Ahmed Ahmed Farghally (ahmed.fr1988@gmail.com) بالتسجيل وينتظر الموافقة', '/admin/customers', 1, '2026-09-11 17:06:11.549'),
('cmu1amyue000b28iok3boqodr', 'NEW_REVIEW', 'تقييم جديد', 'تم إضافة تقييم جديد للمنتج من قبل Ahmed Ahmed Farghally. بانتظار موافقتك.', '/admin/reviews', 1, '2026-09-14 13:43:34.114'),
('cmu1ara8j000e28io82dltw06', 'NEW_REVIEW', 'تقييم جديد', 'تم إضافة تقييم جديد للمنتج من قبل Ahmed Ahmed Farghally. بانتظار موافقتك.', '/admin/reviews', 1, '2026-09-14 13:46:55.508'),
('cmu1bvyxr001828io3w7orugk', 'NEW_ORDER', 'طلب جديد', 'طلب جديد #ORD-20260914-6614 من ايمان رافت (01144954837) بقيمة 124605 جنيه', '/admin/orders/cmu1bvyv8001428iovvzy7xbb', 1, '2026-09-14 14:18:33.758'),
('cmu1cn2be0006a7f00cf4obts', 'NEW_ORDER', 'طلب جديد', 'طلب جديد #ORD-20260914-5062 من Ahmed Farghally (01065962515) بقيمة 249740 جنيه', '/admin/orders/cmu1cn2a20001a7f0mt4x56po', 1, '2026-09-14 14:39:37.851'),
('cmu1couxc0007a7f0y281vyvs', 'ORDER_CANCELLED', 'طلب ملغي', 'قام العميل بإلغاء الطلب رقم #ORD-20260914-6614', '/admin/orders/cmu1bvyv8001428iovvzy7xbb', 1, '2026-09-14 14:41:01.584'),
('cmu2o3mr50005tep6td2n46cl', 'NEW_ORDER', 'طلب جديد', 'طلب جديد #ORD-20260915-3471 من ايمان رافت (01144954837) بقيمة 64.62 جنيه', '/admin/orders/cmu2o3mqg0003tep6wgqw8w2k', 1, '2026-09-15 12:48:12.785'),
('cmu2onlrl0006tep6o0frwnm2', 'ORDER_CANCELLED', 'طلب ملغي', 'قام العميل بإلغاء الطلب رقم #ORD-20260915-3471', '/admin/orders/cmu2o3mqg0003tep6wgqw8w2k', 1, '2026-09-15 13:03:44.626'),
('cmu2op79u0007tep6ndtkuxef', 'ORDER_CANCELLED', 'طلب ملغي', 'قام العميل بإلغاء الطلب رقم #ORD-20260915-3471', '/admin/orders/cmu2o3mqg0003tep6wgqw8w2k', 1, '2026-09-15 13:04:59.154'),
('cmu49f9mp0007tpnziujw31dk', 'NEW_ORDER', 'طلب جديد', 'طلب جديد #ORD-20260916-5043 من Ahmed Farghally (01065962515) بقيمة 60.69 جنيه', '/admin/orders/cmu49f9m40005tpnz4yw3sik6', 1, '2026-09-16 15:32:53.761'),
('cmu49s5w2000ftpnz4z88alad', 'NEW_ORDER', 'طلب جديد', 'طلب جديد #ORD-20260916-8784 من Ahmed Farghally (01065962515) بقيمة 661.9399999999999 جنيه', '/admin/orders/cmu49s5va000btpnzpieeegy6', 1, '2026-09-16 15:42:55.443'),
('cmu4he2m50003m67fjpx8wbrw', 'NEW_ORDER', 'طلب جديد', 'طلب جديد #ORD-20260916-6844 من Ahmed Farghally (01065962515) بقيمة 1250 جنيه', '/admin/orders/cmu4he2lb0001m67fmk9gkb77', 1, '2026-09-16 19:15:54.941'),
('cmu4ik34a001511stelk9a421', 'NEW_MESSAGE', 'رسالة جديدة من اتصل بنا', 'وصلت رسالة جديدة من ahmed farghly بخصوص: تكلفة المتجر الالكتروني', '/admin/messages', 1, '2026-09-16 19:48:35.147'),
('cmu4mde000005mw7qxw27va7u', 'NEW_ORDER', 'طلب جديد', 'طلب جديد #ORD-20260916-7788 من Ahmed Farghally (01065962515) بقيمة 7740 جنيه', '/admin/orders/cmu4mddyo0003mw7qg2nww73u', 1, '2026-09-16 21:35:21.120'),
('cmu4meiv2000amw7qjcpsj2or', 'NEW_ORDER', 'طلب جديد', 'طلب جديد #ORD-20260916-8022 من Ahmed Farghally (01065962515) بقيمة 980 جنيه', '/admin/orders/cmu4meiu90007mw7q3roj9xio', 1, '2026-09-16 21:36:14.079'),
('cmu4mexfm000emw7qn9udezy7', 'NEW_ORDER', 'طلب جديد', 'طلب جديد #ORD-20260916-9946 من Ahmed Farghally (01065962515) بقيمة 2930 جنيه', '/admin/orders/cmu4mexev000cmw7q95or8vvq', 1, '2026-09-16 21:36:32.962'),
('cmu4ndx350002cx5m0l1oj11p', 'NEW_REVIEW', 'تقييم جديد', 'تم إضافة تقييم جديد للمنتج من قبل Ahmed Ahmed Farghally. بانتظار موافقتك.', '/admin/reviews', 1, '2026-09-16 22:03:45.471'),
('cmu4nn3850006cx5masrl9lp7', 'NEW_ORDER', 'طلب جديد', 'طلب جديد #ORD-20260916-7238 من Ahmed Farghally (01065962515) بقيمة 1130 جنيه', '/admin/orders/cmu4nn36x0004cx5m9b03ryzk', 1, '2026-09-16 22:10:53.334'),
('cmu4nqbrl0007cx5mu3h1h936', 'ORDER_CANCELLED', 'طلب ملغي', 'قام العميل بإلغاء الطلب رقم #ORD-20260916-7238', '/admin/orders/cmu4nn36x0004cx5m9b03ryzk', 1, '2026-09-16 22:13:24.369'),
('cmu4nzs8k000bcx5mxvf5rpr9', 'NEW_ORDER', 'طلب جديد', 'طلب جديد #ORD-20260916-3789 من ايمان رافت (01144954837) بقيمة 4316 جنيه', '/admin/orders/cmu4nzs7s0009cx5m1qk69rbp', 1, '2026-09-16 22:20:45.620'),
('cmu4oe9u3000fcx5me2btnnog', 'NEW_ORDER', 'طلب جديد', 'طلب جديد #ORD-20260916-1675 من Ahmed Farghally (01065962515) بقيمة 1130 جنيه', '/admin/orders/cmu4oe9t4000dcx5mgm4512a6', 1, '2026-09-16 22:32:01.611'),
('cmu4oir8g000ocx5m0w7zrzqi', 'NEW_ORDER', 'طلب جديد', 'طلب جديد #ORD-20260916-5133 من Ahmed Farghally (01065962515) بقيمة 128325 جنيه', '/admin/orders/cmu4oir7k000hcx5mwt3ojj45', 1, '2026-09-16 22:35:30.784'),
('cmu4p3tyl000scx5m7pt35834', 'ORDER_UPDATED', 'تعديل عنوان طلب', 'قام العميل بتعديل عنوان الشحن للطلب رقم #ORD-20260916-5133', '/admin/orders/cmu4oir7k000hcx5mwt3ojj45', 1, '2026-09-16 22:51:54.092'),
('cmu4p4d89000tcx5mpz7mb55l', 'ORDER_UPDATED', 'تعديل عنوان طلب', 'قام العميل بتعديل عنوان الشحن للطلب رقم #ORD-20260916-5133', '/admin/orders/cmu4oir7k000hcx5mwt3ojj45', 1, '2026-09-16 22:52:19.066'),
('cmu4p4nmx000ucx5mt1s3th1y', 'ORDER_UPDATED', 'تعديل عنوان طلب', 'قام العميل بتعديل عنوان الشحن للطلب رقم #ORD-20260916-5133', '/admin/orders/cmu4oir7k000hcx5mwt3ojj45', 1, '2026-09-16 22:52:32.553'),
('cmu4p4t1i000vcx5mkuzgxlot', 'ORDER_UPDATED', 'تعديل عنوان طلب', 'قام العميل بتعديل عنوان الشحن للطلب رقم #ORD-20260916-5133', '/admin/orders/cmu4oir7k000hcx5mwt3ojj45', 1, '2026-09-16 22:52:39.559'),
('cmu4p52if000wcx5m5948nsk5', 'ORDER_UPDATED', 'تعديل عنوان طلب', 'قام العميل بتعديل عنوان الشحن للطلب رقم #ORD-20260916-5133', '/admin/orders/cmu4oir7k000hcx5mwt3ojj45', 1, '2026-09-16 22:52:51.832'),
('cmu4p587d000xcx5mryloy09n', 'ORDER_UPDATED', 'تعديل عنوان طلب', 'قام العميل بتعديل عنوان الشحن للطلب رقم #ORD-20260916-5133', '/admin/orders/cmu4oir7k000hcx5mwt3ojj45', 1, '2026-09-16 22:52:59.209');

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `id` varchar(191) NOT NULL,
  `orderNumber` varchar(191) NOT NULL,
  `userId` varchar(191) DEFAULT NULL,
  `status` enum('PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  `paymentStatus` enum('PENDING','PAID','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  `paymentMethod` varchar(191) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `shipping` decimal(10,2) NOT NULL DEFAULT 0.00,
  `tax` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL,
  `currency` varchar(191) NOT NULL DEFAULT 'EGP',
  `customerName` varchar(191) NOT NULL,
  `customerEmail` varchar(191) NOT NULL,
  `customerPhone` varchar(191) NOT NULL,
  `shippingAddress` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`shippingAddress`)),
  `notes` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `cancelReason` text DEFAULT NULL,
  `baseDiscount` decimal(10,2) DEFAULT NULL,
  `baseShipping` decimal(10,2) DEFAULT NULL,
  `baseSubtotal` decimal(10,2) DEFAULT NULL,
  `baseTax` decimal(10,2) DEFAULT NULL,
  `baseTotal` decimal(10,2) DEFAULT NULL,
  `exchangeRate` decimal(10,6) DEFAULT NULL,
  `paymentGatewayData` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`paymentGatewayData`)),
  `transactionId` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`id`, `orderNumber`, `userId`, `status`, `paymentStatus`, `paymentMethod`, `subtotal`, `discount`, `shipping`, `tax`, `total`, `currency`, `customerName`, `customerEmail`, `customerPhone`, `shippingAddress`, `notes`, `createdAt`, `updatedAt`, `cancelReason`, `baseDiscount`, `baseShipping`, `baseSubtotal`, `baseTax`, `baseTotal`, `exchangeRate`, `paymentGatewayData`, `transactionId`) VALUES
('cmu1bvyv8001428iovvzy7xbb', 'ORD-20260914-6614', 'cmtx7jzkc00015jxjcpb4mz1w', 'CANCELLED', 'PENDING', 'CASH_ON_DELIVERY', 124555.00, 0.00, 50.00, 0.00, 124605.00, 'EGP', 'ايمان رافت', 'ahmed.fr1988@gmail.com', '01144954837', '{\"city\":\"العبور\",\"address\":\"الحي السابع, شارع عبد المنعم واصل بجوزتر بنك مصر, 150\"}', '', '2026-09-14 14:18:33.656', '2026-09-14 14:41:01.486', 'المنتج اغلى من السوق بقارق كبير', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('cmu1cn2a20001a7f0mt4x56po', 'ORD-20260914-5062', 'cmtx7jzkc00015jxjcpb4mz1w', 'DELIVERED', 'PAID', 'CASH_ON_DELIVERY', 250690.00, 1000.00, 50.00, 0.00, 249740.00, 'EGP', 'Ahmed Farghally', 'ahmed.fr1988@gmail.com', '01065962515', '{\"city\":\"القليوبية\",\"address\":\"شبرا الخيمة ثان, 1 ش عبده القصاص الشارع الجديد ناصية هايبر الشرقية شبرا الخيمة ثان, 10\"}', '', '2026-09-14 14:39:37.798', '2026-09-15 13:06:03.881', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('cmu2o3mqg0003tep6wgqw8w2k', 'ORD-20260915-3471', 'cmtx7jzkc00015jxjcpb4mz1w', 'CANCELLED', 'FAILED', 'CASH_ON_DELIVERY', 60.77, 0.00, 3.85, 0.00, 64.62, 'SAR', 'ايمان رافت', 'ahmed.fr1988@gmail.com', '01144954837', '{\"city\":\"العبور\",\"address\":\"الحي السابع, شارع عبد المنعم واصل بجوزتر بنك مصر, 150\"}', '', '2026-09-15 12:48:12.757', '2026-09-15 13:04:59.109', 'عن طريق الخطأ', 0.00, 50.00, 790.00, 0.00, 840.00, 13.000000, NULL, NULL),
('cmu49f9m40005tpnz4yw3sik6', 'ORD-20260916-5043', 'cmtx7jzkc00015jxjcpb4mz1w', 'PENDING', 'PENDING', 'CASH_ON_DELIVERY', 57.08, 0.00, 3.61, 0.00, 60.69, 'SAR', 'Ahmed Farghally', 'ahmed.fr1988@gmail.com', '01065962515', '{\"city\":\"القليوبية\",\"address\":\"شبرا الخيمة ثان, 1 ش عبده القصاص الشارع الجديد ناصية هايبر الشرقية شبرا الخيمة ثان, 10\"}', '', '2026-09-16 15:32:53.737', '2026-09-16 15:32:53.737', NULL, 0.00, 50.00, 790.00, 0.00, 840.00, 13.840000, NULL, NULL),
('cmu49s5va000btpnzpieeegy6', 'ORD-20260916-8784', 'cmtx7jzkc00015jxjcpb4mz1w', 'REFUNDED', 'PENDING', 'CASH_ON_DELIVERY', 660.92, 0.00, 1.02, 0.00, 661.94, 'USD', 'Ahmed Farghally', 'ahmed.fr1988@gmail.com', '01065962515', '{\"city\":\"القليوبية\",\"address\":\"شبرا الخيمة ثان, 1 ش عبده القصاص الشارع الجديد ناصية هايبر الشرقية شبرا الخيمة ثان, 10\"}', '', '2026-09-16 15:42:55.409', '2026-09-16 21:37:02.111', NULL, 0.00, 50.00, 32385.00, 0.00, 32435.00, 49.000000, NULL, NULL),
('cmu4he2lb0001m67fmk9gkb77', 'ORD-20260916-6844', 'cmtx7jzkc00015jxjcpb4mz1w', 'CANCELLED', 'PENDING', 'CASH_ON_DELIVERY', 1200.00, 0.00, 50.00, 0.00, 1250.00, 'EGP', 'Ahmed Farghally', 'ahmed.fr1988@gmail.com', '01065962515', '{\"city\":\"القليوبية\",\"address\":\"شبرا الخيمة ثان, 1 ش عبده القصاص الشارع الجديد ناصية هايبر الشرقية شبرا الخيمة ثان, 10\"}', '', '2026-09-16 19:15:54.906', '2026-09-16 21:37:00.045', NULL, 0.00, 50.00, 1200.00, 0.00, 1250.00, 1.000000, NULL, NULL),
('cmu4mddyo0003mw7qg2nww73u', 'ORD-20260916-7788', 'cmtx7jzkc00015jxjcpb4mz1w', 'DELIVERED', 'PENDING', 'CASH_ON_DELIVERY', 8690.00, 1000.00, 50.00, 0.00, 7740.00, 'EGP', 'Ahmed Farghally', 'ahmed.fr1988@gmail.com', '01065962515', '{\"city\":\"القليوبية\",\"address\":\"شبرا الخيمة ثان, 1 ش عبده القصاص الشارع الجديد ناصية هايبر الشرقية شبرا الخيمة ثان, 10\"}', '', '2026-09-16 21:35:21.068', '2026-09-16 21:36:55.622', NULL, 1000.00, 50.00, 8690.00, 0.00, 7740.00, 1.000000, NULL, NULL),
('cmu4meiu90007mw7q3roj9xio', 'ORD-20260916-8022', 'cmtx7jzkc00015jxjcpb4mz1w', 'SHIPPED', 'PENDING', 'CASH_ON_DELIVERY', 1430.00, 500.00, 50.00, 0.00, 980.00, 'EGP', 'Ahmed Farghally', 'ahmed.fr1988@gmail.com', '01065962515', '{\"city\":\"القليوبية\",\"address\":\"شبرا الخيمة ثان, 1 ش عبده القصاص الشارع الجديد ناصية هايبر الشرقية شبرا الخيمة ثان, 10\"}', '', '2026-09-16 21:36:14.049', '2026-09-16 21:36:53.803', NULL, 500.00, 50.00, 1430.00, 0.00, 980.00, 1.000000, NULL, NULL),
('cmu4mexev000cmw7q95or8vvq', 'ORD-20260916-9946', 'cmtx7jzkc00015jxjcpb4mz1w', 'CANCELLED', 'FAILED', 'CASH_ON_DELIVERY', 3200.00, 320.00, 50.00, 0.00, 2930.00, 'EGP', 'Ahmed Farghally', 'ahmed.fr1988@gmail.com', '01065962515', '{\"city\":\"القليوبية\",\"address\":\"شبرا الخيمة ثان, 1 ش عبده القصاص الشارع الجديد ناصية هايبر الشرقية شبرا الخيمة ثان, 10\"}', '', '2026-09-16 21:36:32.935', '2026-09-16 22:14:12.887', NULL, 320.00, 50.00, 3200.00, 0.00, 2930.00, 1.000000, NULL, NULL),
('cmu4nn36x0004cx5m9b03ryzk', 'ORD-20260916-7238', 'cmtx7jzkc00015jxjcpb4mz1w', 'CANCELLED', 'PENDING', 'CASH_ON_DELIVERY', 1580.00, 500.00, 50.00, 0.00, 1130.00, 'EGP', 'Ahmed Farghally', 'ahmed.fr1988@gmail.com', '01065962515', '{\"city\":\"القليوبية\",\"address\":\"شبرا الخيمة ثان, 1 ش عبده القصاص الشارع الجديد ناصية هايبر الشرقية شبرا الخيمة ثان, 10\"}', '', '2026-09-16 22:10:53.286', '2026-09-16 22:13:24.327', 'السعر اعلى من السوق', 500.00, 50.00, 1580.00, 0.00, 1130.00, 1.000000, NULL, NULL),
('cmu4nzs7s0009cx5m1qk69rbp', 'ORD-20260916-3789', 'cmtx7jzkc00015jxjcpb4mz1w', 'PENDING', 'PENDING', 'CASH_ON_DELIVERY', 4740.00, 474.00, 50.00, 0.00, 4316.00, 'EGP', 'ايمان رافت', 'ahmed.fr1988@gmail.com', '01144954837', '{\"city\":\"العبور\",\"address\":\"الحي السابع, شارع عبد المنعم واصل بجوزتر بنك مصر, 150\"}', 'برجاء ارسال المنتج قبل الساعه الخامسة مساءاً', '2026-09-16 22:20:45.591', '2026-09-16 22:20:45.591', NULL, 474.00, 50.00, 4740.00, 0.00, 4316.00, 1.000000, NULL, NULL),
('cmu4oe9t4000dcx5mgm4512a6', 'ORD-20260916-1675', 'cmtx7jzkc00015jxjcpb4mz1w', 'PENDING', 'PENDING', 'CASH_ON_DELIVERY', 1200.00, 120.00, 50.00, 0.00, 1130.00, 'EGP', 'Ahmed Farghally', 'ahmed.fr1988@gmail.com', '01065962515', '{\"city\":\"القليوبية\",\"address\":\"شبرا الخيمة ثان, 1 ش عبده القصاص الشارع الجديد ناصية هايبر الشرقية شبرا الخيمة ثان, 10\"}', 'برجاء الاتصال قبل تحرك مندوب الشحن للتاكيد اننى متواجد بالمكان ', '2026-09-16 22:32:01.573', '2026-09-16 22:32:01.573', NULL, 120.00, 50.00, 1200.00, 0.00, 1130.00, 1.000000, NULL, NULL),
('cmu4oir7k000hcx5mwt3ojj45', 'ORD-20260916-5133', 'cmtx7jzkc00015jxjcpb4mz1w', 'PENDING', 'PENDING', 'CASH_ON_DELIVERY', 128775.00, 500.00, 50.00, 0.00, 128325.00, 'EGP', 'Ahmed Farghally', 'ahmed.fr1988@gmail.com', '01065962515', '{\"city\":\"الاسكندرية\",\"address\":\"شبرا الخيمة ثان, 1 ش عبده القصاص الشارع الجديد ناصية هايبر الشرقية شبرا الخيمة ثان, 10\",\"apartment\":\"\",\"area\":\"\"}', 'لا يوجد', '2026-09-16 22:35:30.752', '2026-09-16 22:53:18.284', NULL, 500.00, 50.00, 128775.00, 0.00, 128325.00, 1.000000, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `orderitem`
--

CREATE TABLE `orderitem` (
  `id` varchar(191) NOT NULL,
  `orderId` varchar(191) NOT NULL,
  `productId` varchar(191) DEFAULT NULL,
  `variantId` varchar(191) DEFAULT NULL,
  `productNameEn` varchar(191) NOT NULL,
  `productNameAr` varchar(191) NOT NULL,
  `sku` varchar(191) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `basePrice` decimal(10,2) DEFAULT NULL,
  `baseTotal` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orderitem`
--

INSERT INTO `orderitem` (`id`, `orderId`, `productId`, `variantId`, `productNameEn`, `productNameAr`, `sku`, `price`, `quantity`, `total`, `basePrice`, `baseTotal`) VALUES
('cmu1bvyvb001528io0a7jjpsw', 'cmu1bvyv8001428iovvzy7xbb', 'cmu065jcq000476ht4xnxckv6', NULL, 'Samsung Galaxy A57 5G Android Smartphone', 'موبايل أندرويد سامسونج جالاكسي A57 شبكة الجيل الخامس 5G', '', 28955.00, 1, 28955.00, NULL, NULL),
('cmu1bvyvb001628iol7hhlj9r', 'cmu1bvyv8001428iovvzy7xbb', 'cmu08izkq001j126su94oym33', NULL, 'Apple iPhone 17 Pro Max (256GB)', 'ابل آيفون 17 Pro Max (256 جيجابايت)', '', 94400.00, 1, 94400.00, NULL, NULL),
('cmu1bvyvb001728ioud79bmd4', 'cmu1bvyv8001428iovvzy7xbb', 'cmu16sse2001h8rzebgua9kln', NULL, 'Black Regular Lined Buttoned Woven Blazer Jacket ', 'بليزر أسود كلاسيكي بقصة عادية وأزرار أمامية', '', 1200.00, 1, 1200.00, NULL, NULL),
('cmu1cn2a20002a7f0laxx1a7l', 'cmu1cn2a20001a7f0mt4x56po', 'cmu17t0o8002k8rzeow0qvsba', NULL, 'Oraimo Smart Watch 5 Lite OSW-804, 2.01\" TFT Display, IP68 – Black', 'ساعة ذكية 5 لايت (OSW-804)، شاشة لمس كاملة HD 2 عالية الدقة', '', 790.00, 2, 1580.00, NULL, NULL),
('cmu1cn2a20003a7f0ypa3ieem', 'cmu1cn2a20001a7f0mt4x56po', 'cmu16sse2001h8rzebgua9kln', NULL, 'Black Regular Lined Buttoned Woven Blazer Jacket ', 'بليزر أسود كلاسيكي بقصة عادية وأزرار أمامية', '', 1200.00, 2, 2400.00, NULL, NULL),
('cmu1cn2a20004a7f0zq7yjjn6', 'cmu1cn2a20001a7f0mt4x56po', 'cmu08izkq001j126su94oym33', NULL, 'Apple iPhone 17 Pro Max (256GB)', 'ابل آيفون 17 Pro Max (256 جيجابايت)', '', 94400.00, 2, 188800.00, NULL, NULL),
('cmu1cn2a20005a7f0zqownjwo', 'cmu1cn2a20001a7f0mt4x56po', 'cmu065jcq000476ht4xnxckv6', NULL, 'Samsung Galaxy A57 5G Android Smartphone', 'موبايل أندرويد سامسونج جالاكسي A57 شبكة الجيل الخامس 5G', '', 28955.00, 2, 57910.00, NULL, NULL),
('cmu2o3mqg0004tep630byaw4a', 'cmu2o3mqg0003tep6wgqw8w2k', 'cmu17t0o8002k8rzeow0qvsba', NULL, 'Oraimo Smart Watch 5 Lite OSW-804, 2.01\" TFT Display, IP68 – Black', 'ساعة ذكية 5 لايت (OSW-804)، شاشة لمس كاملة HD 2 عالية الدقة', '', 60.77, 1, 60.77, 790.00, 790.00),
('cmu49f9m50006tpnzct8k93gq', 'cmu49f9m40005tpnz4yw3sik6', 'cmu17t0o8002k8rzeow0qvsba', NULL, 'Oraimo Smart Watch 5 Lite OSW-804, 2.01\" TFT Display, IP68 – Black', 'ساعة ذكية 5 لايت (OSW-804)، شاشة لمس كاملة HD 2 عالية الدقة', '', 57.08, 1, 57.08, 790.00, 790.00),
('cmu49s5vb000ctpnz8ogbhe3l', 'cmu49s5va000btpnzpieeegy6', 'cmu1jzfuw001ess4a2rnxtcfy', NULL, 'BOBS from SKECHERS Bobs Sport Squad', 'حذاء رياضي سبورت سكواد كايوس 4 من سكيتشرز بوبس', '', 65.31, 1, 65.31, 3200.00, 3200.00),
('cmu49s5vb000dtpnzzrm6rtp1', 'cmu49s5va000btpnzpieeegy6', 'cmu17jl5t002d8rzeup33o4ez', NULL, 'Sibel Stick Lipstick – Pinky Beige 303', 'أحمر شفاه من سيبيل ستيك بلون بينكي بيج 303', '', 4.69, 1, 4.69, 230.00, 230.00),
('cmu49s5vb000etpnzw0v58vyb', 'cmu49s5va000btpnzpieeegy6', 'cmu065jcq000476ht4xnxckv6', NULL, 'Samsung Galaxy A57 5G Android Smartphone', 'موبايل أندرويد سامسونج جالاكسي A57 شبكة الجيل الخامس 5G', '', 590.92, 1, 590.92, 28955.00, 28955.00),
('cmu4he2lc0002m67fsmal2kpm', 'cmu4he2lb0001m67fmk9gkb77', 'cmu16sse2001h8rzebgua9kln', NULL, 'Black Regular Lined Buttoned Woven Blazer Jacket ', 'بليزر أسود كلاسيكي بقصة عادية وأزرار أمامية', '', 1200.00, 1, 1200.00, 1200.00, 1200.00),
('cmu4mddyo0004mw7qcdi4rwjj', 'cmu4mddyo0003mw7qg2nww73u', 'cmu17t0o8002k8rzeow0qvsba', NULL, 'Oraimo Smart Watch 5 Lite OSW-804, 2.01\" TFT Display, IP68 – Black', 'ساعة ذكية 5 لايت (OSW-804)، شاشة لمس كاملة HD 2 عالية الدقة', '', 790.00, 11, 8690.00, 790.00, 8690.00),
('cmu4meiu90008mw7q1z9wfr70', 'cmu4meiu90007mw7q3roj9xio', 'cmu17jl5t002d8rzeup33o4ez', NULL, 'Sibel Stick Lipstick – Pinky Beige 303', 'أحمر شفاه من سيبيل ستيك بلون بينكي بيج 303', '', 230.00, 1, 230.00, 230.00, 230.00),
('cmu4meiu90009mw7q25et8h86', 'cmu4meiu90007mw7q3roj9xio', 'cmu16sse2001h8rzebgua9kln', NULL, 'Black Regular Lined Buttoned Woven Blazer Jacket ', 'بليزر أسود كلاسيكي بقصة عادية وأزرار أمامية', '', 1200.00, 1, 1200.00, 1200.00, 1200.00),
('cmu4mexev000dmw7qshzzfrfx', 'cmu4mexev000cmw7q95or8vvq', 'cmu1jzfuw001ess4a2rnxtcfy', NULL, 'BOBS from SKECHERS Bobs Sport Squad', 'حذاء رياضي سبورت سكواد كايوس 4 من سكيتشرز بوبس', '', 3200.00, 1, 3200.00, 3200.00, 3200.00),
('cmu4nn36y0005cx5mqodrshsq', 'cmu4nn36x0004cx5m9b03ryzk', 'cmu17t0o8002k8rzeow0qvsba', NULL, 'Oraimo Smart Watch 5 Lite OSW-804, 2.01\" TFT Display, IP68 – Black', 'ساعة ذكية 5 لايت (OSW-804)، شاشة لمس كاملة HD 2 عالية الدقة', '', 790.00, 2, 1580.00, 790.00, 1580.00),
('cmu4nzs7s000acx5mkn9dme6h', 'cmu4nzs7s0009cx5m1qk69rbp', 'cmu17t0o8002k8rzeow0qvsba', NULL, 'Oraimo Smart Watch 5 Lite OSW-804, 2.01\" TFT Display, IP68 – Black', 'ساعة ذكية 5 لايت (OSW-804)، شاشة لمس كاملة HD 2 عالية الدقة', '', 790.00, 6, 4740.00, 790.00, 4740.00),
('cmu4oe9t5000ecx5m0en8gi3t', 'cmu4oe9t4000dcx5mgm4512a6', 'cmu16sse2001h8rzebgua9kln', 'cmu16sse2001m8rzebd0ceaot', 'Black Regular Lined Buttoned Woven Blazer Jacket ', 'بليزر أسود كلاسيكي بقصة عادية وأزرار أمامية', '', 1200.00, 1, 1200.00, 1200.00, 1200.00),
('cmu4oir7l000icx5ma0ajr2zv', 'cmu4oir7k000hcx5mwt3ojj45', 'cmu16sse2001h8rzebgua9kln', NULL, 'Black Regular Lined Buttoned Woven Blazer Jacket ', 'بليزر أسود كلاسيكي بقصة عادية وأزرار أمامية', '', 1200.00, 1, 1200.00, 1200.00, 1200.00),
('cmu4oir7l000jcx5mhau3e4s9', 'cmu4oir7k000hcx5mwt3ojj45', 'cmu08izkq001j126su94oym33', NULL, 'Apple iPhone 17 Pro Max (256GB)', 'ابل آيفون 17 Pro Max (256 جيجابايت)', '', 94400.00, 1, 94400.00, 94400.00, 94400.00),
('cmu4oir7l000kcx5mn26ns3t7', 'cmu4oir7k000hcx5mwt3ojj45', 'cmu17jl5t002d8rzeup33o4ez', NULL, 'Sibel Stick Lipstick – Pinky Beige 303', 'أحمر شفاه من سيبيل ستيك بلون بينكي بيج 303', '', 230.00, 1, 230.00, 230.00, 230.00),
('cmu4oir7l000lcx5m8mgdyhc4', 'cmu4oir7k000hcx5mwt3ojj45', 'cmu17t0o8002k8rzeow0qvsba', NULL, 'Oraimo Smart Watch 5 Lite OSW-804, 2.01\" TFT Display, IP68 – Black', 'ساعة ذكية 5 لايت (OSW-804)، شاشة لمس كاملة HD 2 عالية الدقة', '', 790.00, 1, 790.00, 790.00, 790.00),
('cmu4oir7l000mcx5m6pgc27af', 'cmu4oir7k000hcx5mwt3ojj45', 'cmu1jzfuw001ess4a2rnxtcfy', NULL, 'BOBS from SKECHERS Bobs Sport Squad', 'حذاء رياضي سبورت سكواد كايوس 4 من سكيتشرز بوبس', '', 3200.00, 1, 3200.00, 3200.00, 3200.00),
('cmu4oir7l000ncx5mt7x06nee', 'cmu4oir7k000hcx5mwt3ojj45', 'cmu065jcq000476ht4xnxckv6', NULL, 'Samsung Galaxy A57 5G Android Smartphone', 'موبايل أندرويد سامسونج جالاكسي A57 شبكة الجيل الخامس 5G', '', 28955.00, 1, 28955.00, 28955.00, 28955.00);

-- --------------------------------------------------------

--
-- Table structure for table `permission`
--

CREATE TABLE `permission` (
  `id` varchar(191) NOT NULL,
  `action` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permission`
--

INSERT INTO `permission` (`id`, `action`, `description`) VALUES
('cmtyih3mm0000qmuohxdpdplk', 'dashboard.view', NULL),
('cmtyih3my0001qmuo211a955n', 'products.view', NULL),
('cmtyih3na0002qmuoewam5z7r', 'products.create', NULL),
('cmtyih3ne0003qmuo16i86xpi', 'products.edit', NULL),
('cmtyih3nl0004qmuos1y1vq3n', 'products.delete', NULL),
('cmtyih3np0005qmuoh6b0qtyg', 'categories.view', NULL),
('cmtyih3nt0006qmuodxh77583', 'categories.create', NULL),
('cmtyih3ny0007qmuod5ri0o25', 'categories.edit', NULL),
('cmtyih3o40008qmuoc3sf7uix', 'categories.delete', NULL),
('cmtyih3o90009qmuol21nj473', 'brands.view', NULL),
('cmtyih3oe000aqmuornsafe7i', 'brands.create', NULL),
('cmtyih3oj000bqmuodpwpkd7o', 'brands.edit', NULL),
('cmtyih3on000cqmuo3a9rcs9o', 'brands.delete', NULL),
('cmtyih3ot000dqmuopa5q274u', 'orders.view', NULL),
('cmtyih3oy000eqmuo4isg5za5', 'orders.create', NULL),
('cmtyih3p2000fqmuoqu1iw5zh', 'orders.edit', NULL),
('cmtyih3p6000gqmuotneae4eg', 'orders.delete', NULL),
('cmtyih3p9000hqmuobhwnu50m', 'customers.view', NULL),
('cmtyih3pf000iqmuoxxx9uv2t', 'customers.create', NULL),
('cmtyih3pl000jqmuohir0yfv8', 'customers.edit', NULL),
('cmtyih3po000kqmuowdx342u9', 'customers.delete', NULL),
('cmtyih3ps000lqmuo6k4k66yk', 'customers.approve', NULL),
('cmtyih3px000mqmuofg13y5rh', 'customers.suspend', NULL),
('cmtyih3q1000nqmuocbeur2g8', 'admin_users.view', NULL),
('cmtyih3q5000oqmuoos3p2jhg', 'admin_users.create', NULL),
('cmtyih3q8000pqmuotvkf3izj', 'admin_users.edit', NULL),
('cmtyih3qe000qqmuo050pfquc', 'admin_users.delete', NULL),
('cmtyih3qi000rqmuog0son81b', 'admin_users.permissions', NULL),
('cmtyih3qn000sqmuo1boi8npe', 'coupons.view', NULL),
('cmtyih3qs000tqmuo6cyc5a7m', 'coupons.create', NULL),
('cmtyih3qw000uqmuo0rzzmvwf', 'coupons.edit', NULL),
('cmtyih3r3000vqmuoxjajve99', 'coupons.delete', NULL),
('cmtyih3r7000wqmuo9wowaod6', 'settings.view', NULL),
('cmtyih3rc000xqmuo4golk5ak', 'settings.edit', NULL),
('cmtyih3rg000yqmuo8b1t0qry', 'media.view', NULL),
('cmtyiq2tj0000penps8s3m86u', 'sliders.view', NULL),
('cmtyiq2tz0001penpjm3fxly0', 'sliders.create', NULL),
('cmtyiq2u30002penp9jx32xfk', 'sliders.edit', NULL),
('cmtyiq2uc0003penp2fmc0tll', 'sliders.delete', NULL),
('cmu00kx1r0000wtzh45bu40ql', 'newsletter.view', NULL),
('cmu00kx290001wtzhp6hjfp9d', 'newsletter.send', NULL),
('cmu00kx2k0002wtzh19uaj15b', 'newsletter.delete', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` varchar(191) NOT NULL,
  `nameEn` varchar(191) NOT NULL,
  `nameAr` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `shortDescriptionEn` text DEFAULT NULL,
  `shortDescriptionAr` text DEFAULT NULL,
  `descriptionEn` text DEFAULT NULL,
  `descriptionAr` text DEFAULT NULL,
  `sku` varchar(191) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `compareAtPrice` decimal(10,2) DEFAULT NULL,
  `costPrice` decimal(10,2) DEFAULT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `lowStockThreshold` int(11) NOT NULL DEFAULT 5,
  `weight` decimal(8,2) DEFAULT NULL,
  `isFeatured` tinyint(1) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `categoryId` varchar(191) DEFAULT NULL,
  `brandId` varchar(191) DEFAULT NULL,
  `metaTitle` varchar(191) DEFAULT NULL,
  `metaDescription` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `showRelatedProducts` tinyint(1) NOT NULL DEFAULT 1,
  `isLatest` tinyint(1) NOT NULL DEFAULT 0,
  `isSpecialOffer` tinyint(1) NOT NULL DEFAULT 0,
  `canonicalUrl` varchar(191) DEFAULT NULL,
  `customSchema` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `nameEn`, `nameAr`, `slug`, `shortDescriptionEn`, `shortDescriptionAr`, `descriptionEn`, `descriptionAr`, `sku`, `price`, `compareAtPrice`, `costPrice`, `stock`, `lowStockThreshold`, `weight`, `isFeatured`, `isActive`, `categoryId`, `brandId`, `metaTitle`, `metaDescription`, `createdAt`, `updatedAt`, `showRelatedProducts`, `isLatest`, `isSpecialOffer`, `canonicalUrl`, `customSchema`) VALUES
('cmu065jcq000476ht4xnxckv6', 'Samsung Galaxy A57 5G Android Smartphone', 'موبايل أندرويد سامسونج جالاكسي A57 شبكة الجيل الخامس 5G', 'Samsung_Galaxy_A57_5G_Android_Smartphone', 'Samsung Galaxy A57 5G Android Smartphone, 256GB Storage, 8GB RAM, 6 OS Upgrades, Large Display, 50MP Camera, Long-Lasting Battery, Navy, Local Version', 'موبايل أندرويد سامسونج جالاكسي A57 شبكة الجيل الخامس 5G بسعة تخزين 256 جيجا وذاكرة رام 8 جيجا مع 6 ترقيات لنظام التشغيل وشاشة كبيرة وكاميرا 50 ميجابيكسل وبطارية تدوم لفترة طويلة، كحلي، نسخة محلية', 'About This Product\n\nSlim and Stylish Design\nThe **Samsung Galaxy A57 5G** features a slim and elegant design with a thickness of just **6.9 mm**, making it comfortable and easy to hold with one hand. It comes with a **6.7-inch Super AMOLED Plus display** with FHD+ resolution and slim bezels, providing an immersive and spacious viewing experience.\n\nSmart Features\nEnjoy a range of intelligent features designed to make everyday use easier, including **Circle to Search, Transcript Assist, Object Eraser, Edit Suggestions, Filters, Auto Trim, and Best Face**.\n\nAdvanced 50MP Camera\nThe Galaxy A57 5G features an advanced rear camera system that includes:\n- 50MP wide-angle main camera** with Optical Image Stabilization (OIS).\n- 12MP ultra-wide camera.\n- 5MP macro camera.\n\nThe camera system delivers bright, sharp, and detailed photos and videos, with enhanced image processing for improved low-light photography. The **12MP front camera with Super HDR** helps produce more vibrant and detailed selfie photos and videos with improved colors, contrast, and saturation.\n\nIP68 Water and Dust Resistance\nThe Galaxy A57 5G comes with an **IP68 rating**, providing protection against dust and water for greater peace of mind during everyday use.\n\nLong-Lasting Battery\nThe phone is equipped with a **5,000mAh battery** designed to provide long-lasting usage, with up to **48 hours of use** depending on usage conditions. It also supports **Super Fast Charging 2.0**, allowing the phone to charge up to **60% in approximately 30 minutes**.\n\nLong-Term Software Updates\nThe Galaxy A57 5G supports up to **6 generations of OS upgrades** and up to **6 years of security updates**, helping keep your device updated, secure, and reliable for years to come.', 'عن هذه السلعة\n\n تصميم أنيق ونحيف\nيأتي **Samsung Galaxy A57 5G** بتصميم نحيف وأنيق بسمك يبلغ 6.9 مم، مما يجعله مريحًا وسهل الاستخدام بيد واحدة. ويتميز بشاشة **Super AMOLED Plus مقاس 6.7 بوصة** بدقة FHD+ مع حواف شاشة نحيفة، لتوفير تجربة مشاهدة واسعة وواضحة.\n\nمزايا ذكية\nاستمتع بمجموعة من الميزات الذكية التي تساعدك في الاستخدام اليومي، بما في ذلك **الدائرة للبحث، النسخ الصوتي، ممحاة العناصر، اقتراحات التعديل والفلاتر، التشذيب التلقائي، وأفضل وجه**.\n\n كاميرا متطورة بدقة 50 ميجابكسل\nيتميز الهاتف بنظام كاميرا خلفية متطور يضم:\n- كاميرا رئيسية واسعة بدقة **50 ميجابكسل** مع مثبت بصري للصورة (OIS).\n- كاميرا فائقة الاتساع بدقة **12 ميجابكسل**.\n- كاميرا ماكرو بدقة **5 ميجابكسل**.\n\nيوفر نظام التصوير صورًا وفيديوهات واضحة ومفصلة، مع تحسينات خاصة للتصوير في الإضاءة المنخفضة. كما تدعم الكاميرا الأمامية تقنية **Super HDR بدقة 12 ميجابكسل** للحصول على صور وفيديوهات سيلفي أكثر حيوية ووضوحًا.\n\nمقاومة الماء والغبار IP68\nتم تصميم Galaxy A57 5G بتصنيف **IP68** لمقاومة الماء والغبار، ليمنحك حماية إضافية للاستخدام اليومي.\n\nبطارية تدوم طويلًا\nيأتي الهاتف ببطارية بسعة **5000 مللي أمبير/ساعة** توفر استخدامًا طويلًا يصل إلى 48 ساعة وفقًا لظروف الاستخدام. كما يدعم تقنية **Super Fast Charging 2.0**، والتي تتيح شحن الهاتف حتى 60% خلال حوالي 30 دقيقة.\n\nتحديثات طويلة المدى\nيقدم Galaxy A57 5G دعمًا يصل إلى **6 أجيال من تحديثات نظام التشغيل** وما يصل إلى **6 سنوات من التحديثات الأمنية**، مما يساعد على الحفاظ على الهاتف محدثًا وآمنًا لفترة طويلة.', 'NBESEP500', 28955.00, 0.00, 0.00, 10, 5, 150.00, 1, 1, 'cmu1d6ab40009a7f0bkwp8db0', 'cmu04yevk000076ht6s7z2woe', '', '', '2026-09-13 18:50:16.246', '2026-09-14 17:44:54.790', 1, 1, 1, NULL, NULL),
('cmu08izkq001j126su94oym33', 'Apple iPhone 17 Pro Max (256GB)', 'ابل آيفون 17 Pro Max (256 جيجابايت)', 'Apple_iPhone_17_Pro_Max_(256GB)', 'Apple iPhone 17 Pro Max (256GB) – Silver, Face ID, Tax Included, 2-Year Official Warranty', 'ابل آيفون 17 Pro Max (256 جيجابايت) - فضي مع خاصية Face ID | مدفوع الضريبة | ضمان رسمي لمدة سنتين', 'Product Description\n\nApple iPhone 17 Pro Max (256GB)\n\nNetwork Technology\n\nGSM / CDMA / HSPA / EVDO / LTE / 5G\n\nBody & Design\n\nDimensions: 163.4 × 78 × 8.8 mm\n\nWeight: 233 g\n\nBuild: Ceramic Shield 2 front glass, aluminum alloy frame, aluminum alloy / Ceramic Shield glass back\n\nSIM Options:\n\nNano-SIM + eSIM + eSIM (up to 2 active simultaneously; International)\n\neSIM + eSIM (8 or more eSIMs, up to 2 active simultaneously; USA)\n\nNano-SIM + Nano-SIM (China)\n\nWater & Dust Resistance: IP68, up to 6 meters for 30 minutes\n\nApple Pay: Certified for Visa, MasterCard, and American Express\n\nDisplay\n\nType: LTPO Super Retina XDR OLED, 120Hz, HDR10, Dolby Vision\n\nSize: 6.9 inches (~90.7% screen-to-body ratio)\n\nResolution: 1320 × 2868 pixels (~460 ppi)\n\nBrightness: 1000 nits typical, 1600 nits HBM, up to 3000 nits peak\n\nProtection: Ceramic Shield 2, Mohs level 5, anti-reflective coating\n\nPlatform & Performance\n\nOperating System: iOS 26\n\nChipset: Apple A19 Pro (3nm)\n\nCPU: Hexa-core (2×4.26 GHz + 4×X.X GHz)\n\nGPU: Apple GPU (6-core)\n\nRAM: 12GB\n\nInternal Storage: 256GB NVMe\n\nMemory Card: Not supported\n\nMain Camera\n\nTriple rear camera system:\n\n48MP Wide: f/1.8, 24mm, Dual Pixel PDAF, OIS\n\n48MP Periscope Telephoto: f/2.8, 100mm, PDAF, 3D sensor-shift OIS, 4× optical zoom\n\n48MP Ultra-Wide: f/2.2, 13mm, 120˚, PDAF\n\nTOF 3D LiDAR: Depth sensor\n\nCamera Features:\n\nDual-tone LED flash\n\nHDR\n\nPanorama\n\nVideo Recording:\n\n4K at 24/25/30/60/100/120fps\n\n1080p at 25/30/60/120/240fps\n\n10-bit HDR\n\nDolby Vision HDR up to 120fps\n\nProRes\n\nProRes RAW up to 120fps\n\nApple Log 2\n\nSpatial video and spatial audio\n\nStereo sound recording\n\nFront Camera\n\n18MP Ultra-Wide: f/1.9, 20mm, PDAF, OIS\n\nSL 3D: Depth and biometric sensor\n\nFeatures: HDR, Dolby Vision HDR, spatial audio, stereo sound recording, ProRes RAW, Apple Log 2\n\nVideo: 4K at 24/25/30/60fps, 1080p at 25/30/60/120fps, gyro-EIS\n\nFeatures & Security\n\nFace ID\n\nAccelerometer\n\nGyroscope\n\nProximity sensor\n\nCompass\n\nBarometer\n\nSecond-generation Ultra Wideband (UWB)\n\nEmergency SOS, Messages, and Find My via satellite\n\nStereo speakers\n\nNo 3.5mm headphone jack\n\nConnectivity\n\nWi-Fi: 802.11 a/b/g/n/ac/6e/7, tri-band, hotspot\n\nBluetooth: 6.0, A2DP, LE\n\nGPS: L1 + L5\n\nGLONASS, GALILEO, BDS, QZSS, NavIC\n\nNFC: Yes\n\nUSB: USB Type-C 3.2 Gen 2, DisplayPort\n\nBattery & Charging\n\nBattery: Li-Ion 4832mAh (Nano-SIM version)\n\nBattery: Li-Ion 5088mAh (eSIM-only version)\n\nWired Charging: PD3.2/AVS, up to 50% in 20 minutes\n\nWireless Charging: MagSafe/Qi2 up to 25W\n\nWireless Charging: Up to 50% in 30 minutes (15W China version)\n\nReverse Wired Charging: 4.5W', '\nوصف المنتج\n\nApple iPhone 17 Pro Max (256GB):\n\nتقنية الشبكة:\nGSM / CDMA / HSPA / EVDO / LTE / 5G\n\nالجسم:\nالأبعاد: 163.4 × 78 × 8.8 مم\nالوزن: 233 جرام\nالخامة: واجهة زجاجية (Ceramic Shield 2)، إطار من سبائك الألومنيوم، ظهر من سبائك الألومنيوم / زجاج (Ceramic Shield)\nالشريحة:\n\nNano-SIM + eSIM + eSIM (أقصى 2 في نفس الوقت؛ دولي)\n\neSIM + eSIM (8 أو أكثر، أقصى 2 في نفس الوقت؛ الولايات المتحدة)\n\nNano-SIM + Nano-SIM (الصين)\nمقاومة الغبار/الماء IP68 (حتى 6م لمدة 30 دقيقة)\nApple Pay (معتمد: فيزا، ماستركارد، أمريكان إكسبريس)\n\nالشاشة:\nالنوع: LTPO Super Retina XDR OLED، 120Hz، HDR10، Dolby Vision\nالحجم: 6.9 بوصة (~90.7% نسبة الشاشة إلى الجسم)\nالدقة: 1320 × 2868 بكسل (~460 بكسل لكل بوصة)\nالسطوع: 1000 شمعة (عادي)، 1600 شمعة (HBM)، 3000 شمعة (أقصى)\nالحماية: Ceramic Shield 2، مستوى Mohs 5، طبقة مضادة للانعكاس\n\nالمنصة:\nنظام التشغيل: iOS 26\nالمعالج: Apple A19 Pro (3 نانومتر)\nالمعالج المركزي: Hexa-core (2×4.26 GHz + 4×X.X GHz)\nالمعالج الرسومي: Apple GPU (6 نوى رسومية)\nالرام: 12GB\nالتخزين الداخلي: 256GB NVMe\nفتحة بطاقة: لا\n\nالكاميرا الرئيسية:\n\n48MP واسعة، f/1.8، 24مم، Dual Pixel PDAF، مثبت بصري OIS\n\n48MP تلي فوتو بيريسكوب، f/2.8، 100مم، PDAF، مثبت بصري 3D sensor-shift OIS، تكبير بصري 4×\n\n48MP واسعة جدًا، f/2.2، 13مم، 120˚، PDAF\n\nTOF 3D LiDAR (مستشعر العمق)\nالميزات: فلاش LED مزدوج اللون، HDR (صور/بانوراما)\nالفيديو: 4K@24/25/30/60/100/120fps، 1080p@25/30/60/120/240fps، 10-bit HDR، Dolby Vision HDR (حتى 120fps)، ProRes، ProRes RAW (حتى 120fps)، Apple Log 2، فيديو/صوت ثلاثي الأبعاد، تسجيل صوت ستيريو\n\nكاميرا السيلفي:\n18MP واسعة جدًا، f/1.9، 20مم، PDAF، OIS\nSL 3D (مستشعر العمق/البيومتريك)\nالميزات: HDR، Dolby Vision HDR، صوت ثلاثي الأبعاد، تسجيل صوت ستيريو، ProRes RAW، Apple Log 2\nالفيديو: 4K@24/25/30/60fps، 1080p@25/30/60/120fps، gyro-EIS\n\nالمميزات:\nFace ID\nالحساسات: Accelerometer، Gyro، Proximity، Compass، Barometer\nUltra Wideband (UWB) الجيل الثاني\nSOS طارئ، الرسائل، وFind My عبر الأقمار الصناعية\nمكبرات صوت ستيريو\nلا يوجد مدخل 3.5 مم\n\nالاتصال:\nWi-Fi 802.11 a/b/g/n/ac/6e/7، ثلاثي النطاق، هوت سبوت\nBluetooth 6.0، A2DP، LE\nتحديد المواقع: GPS (L1+L5)، GLONASS، GALILEO، BDS، QZSS، NavIC\nNFC: نعم\nUSB: USB Type-C 3.2 Gen 2، DisplayPort\n\nالبطارية:\nLi-Ion 4832 mAh (نسخة Nano SIM)\nLi-Ion 5088 mAh (نسخة eSIM فقط)\nشحن سلكي PD3.2/AVS، 50% في 20 دقيقة\nشحن لاسلكي MagSafe/Qi2 25W، 50% في 30 دقيقة (15W - الصين)\nشحن عكسي سلكي 4.5W', 'NBESEP599 ', 94400.00, 0.00, 0.00, 10, 5, 210.00, 1, 1, 'cmu1e8nlz000ha7f0nxatcqjm', 'cmu050mc6000176httfgbwf6g', '', '', '2026-09-13 19:56:43.034', '2026-09-14 17:44:48.680', 1, 1, 1, NULL, NULL),
('cmu16sse2001h8rzebgua9kln', 'Black Regular Lined Buttoned Woven Blazer Jacket ', 'بليزر أسود كلاسيكي بقصة عادية وأزرار أمامية', 'Black_Regular_Lined_Buttoned_Woven_Blazer_Jacket', '', '', 'Black Regular Lined Buttoned Woven Blazer Jacket\n\nA stylish black blazer featuring a classic design and a comfortable regular fit. Designed with a fully lined interior and a front button closure, this versatile piece adds a polished and sophisticated touch to any outfit. Perfect for pairing with tailored trousers for a formal look or jeans for a smart-casual style.\n\nDetails:\n\nColor: Black\n\nFit: Regular Fit\n\nDesign: Front button closure\n\nLined interior\n\nSuitable for formal and smart-casual looks\n\nProduct Code: TWOAW22CE0168', 'بليزر أسود كلاسيكي بقصة عادية وأزرار أمامية\n\nبليزر أنيق باللون الأسود بتصميم كلاسيكي وقصة مريحة تناسب مختلف الإطلالات. يأتي بتصميم مبطن من الداخل مع إغلاق أمامي بالأزرار، مما يمنحه مظهراً أنيقاً واحترافياً. قطعة عملية يمكن تنسيقها مع البنطلونات الرسمية أو الجينز لإطلالة عصرية مناسبة للعمل والمناسبات.\n\nالتفاصيل:\n\nاللون: أسود\n\nالقصة: Regular Fit\n\nالتصميم: أزرار أمامية\n\nمبطن من الداخل\n\nمناسب للإطلالات الرسمية والكاجوال الأنيقة\n\nكود المنتج: TWOAW22CE0168\n\n', 'TWOAW22CE0168', 1200.00, 0.00, 0.00, 20, 5, 320.00, 1, 1, 'cmtzv208n000e6slzx39wmyzo', 'cmu16tzl4001u8rzewdl0thqz', '', '', '2026-09-14 11:56:07.226', '2026-09-14 17:44:42.798', 1, 1, 1, NULL, NULL),
('cmu17jl5t002d8rzeup33o4ez', 'Sibel Stick Lipstick – Pinky Beige 303', 'أحمر شفاه من سيبيل ستيك بلون بينكي بيج 303', 'Sibel_Stick_Lipstick_Pinky_Beige_303', 'Add an elegant and natural touch to your lips with Sibel Stick Lipstick in Pinky Beige 303', 'منتج فريد يجمع بين تركيز اللون والثبات طويل الأمد مع نعومة الشفاه وترطيبها العالي لأنه يحتوي على زبدة المانجو البرية المعروفة بإعادة بناء الشفاه وحمايتها من التشقق بألوان متعددة وجذابة تناسب جميع الأذواق', 'Sibel Stick Lipstick – Pinky Beige 303\n\nAdd an elegant and natural touch to your lips with Sibel Stick Lipstick in Pinky Beige 303. Featuring a soft pink-beige shade, it creates a sophisticated and flattering look that is perfect for everyday wear and soft makeup styles.\n\nDetails:\n\nBrand: Sibel Stick\nType: Stick Lipstick\nhade: Pinky Beige\nShade Number: 303\nIdeal for everyday and natural makeup looks\nProvides an elegant and attractive lip color', 'أحمر شفاه سيبيل ستيك – بينكي بيج 303\n\nامنحي شفتيك لمسة أنيقة وناعمة مع أحمر الشفاه من سيبيل ستيك بلون Pinky Beige 303. يتميز بدرجة بيج وردية راقية تمنح الشفاه مظهراً طبيعياً وجذاباً، مما يجعله مناسباً للاستخدام اليومي ولإطلالات المكياج الناعمة.\n\nالتفاصيل:\n\nالماركة: سيبيل ستيك\nالنوع: أحمر شفاه ستيك\nاللون: بينكي بيج\nرقم الدرجة: 303\nمناسب للإطلالات اليومية والناعمة\nيمنح الشفاه لوناً أنيقاً وجذاباً', 'B09P8GM8GJ', 230.00, 0.00, 0.00, 10, 5, 0.00, 1, 1, 'cmu02e5we0005567zv9c5ftd0', 'cmu16tzl4001u8rzewdl0thqz', '', '', '2026-09-14 12:16:57.566', '2026-09-14 17:44:37.048', 1, 1, 1, NULL, NULL),
('cmu17t0o8002k8rzeow0qvsba', 'Oraimo Smart Watch 5 Lite OSW-804, 2.01\" TFT Display, IP68 – Black', 'ساعة ذكية 5 لايت (OSW-804)، شاشة لمس كاملة HD 2 عالية الدقة', 'Oraimo_Smart_Watch_5_Lite_OSW-804,_2.01_TFT_Display_IP68_Black', 'Up to 7 days of normal use and over 28 days of standby time, with IP68 water resistance for everyday wear.', 'ساعة ذكية 5 لايت (OSW-804)، شاشة لمس كاملة HD 2 عالية الدقة بوصة، تصنيف مقاوم الماء والغبار IP68، وقت استخدام عادي 7 أيام، وقت استعداد اكثر من 28 يوم، أطراف أذن مضادة للبكتيريا من اورايمو، لون أسود', 'About this item\nUseful Gadgets Your Caring Life Helper Press the Home button of the watch to discover more useful gadgets for daily life, such as remote camera, alarm clock, stopwatch, timer, calculator, flashlight, find my phone, music control, etc.\n2.01\" HD Touch Screen Vivid Clarity, Sharp Visuals The expansive screen offers ultra-smooth operation and vibrant, saturated colors. Experience stunning brightness and clarity that make every interaction engaging and enjoyable, bringing life to your daily moments.\nMore than 28-Day Standby, 7-Day Usage Time Extended Power, Uninterrupted Use The Watch 5 Lite lasts over 28 days on a single charge, giving you the freedom to stay powered during extended outings without worrying about recharging.\nWireless HD Calling Keep in Touch Easily Make calls directly on your wrist, without the hassle of picking up your phone, connecting effortlessly with loved ones.\nBlood Oxygen & Heart Rate Monitor Convenient Immediate Health Feedback Watch 5 Lite features health monitoring for heart rate, blood oxygen, stress, sleep, women\'s health, providing timely and accessible data feedback.\n\n\nOperating System	Proprietary OS\nMemory Storage Capacity	64 MB\nSpecial Features	2.01-Inch TFT Display, 28+ Days Standby Time, IP68 Water & Dust Resistance, Smartwatch Design, Up to 7 Days Normal Usage2.01-Inch TFT Display, 28+ Days Standby Time, IP68 Water & Dust Resistance, Smartwatch Design, Up to 7 Days Normal Usage\nBattery Capacity	300 Amp Hours\nConnectivity Technology	Bluetooth\nWireless Communication Standard	Bluetooth\nBattery Cell Composition	Lithium Ion\nGPS	No GPS\nItem Shape	Rectangular\nScreen Size	2.01 Inches', 'عن هذه السلعة\nأدوات ذكية مفيدة – مساعدك اليومي للحياة الأفضل. اضغط على زر الصفحة الرئيسية في الساعة لاكتشاف المزيد من الأدوات العملية التي تسهّل حياتك اليومية، مثل التحكم بالكاميرا عن بُعد، المنبه، ساعة الإيقاف، المؤقّت، الآلة الحاسبة، الكشاف، العثور على الهاتف، التحكم بالموسيقى وغيرها من المزايا الذكية.\nشاشة تعمل باللمس HD عالية الدقة 2 بوصة وضوح حيوي، مرئيات حادة. توفر الشاشة الواسعة تشغيلًا سلسًا للغاية وألوانًا نابضة بالحياة ومشبعة. جرب سطوع الشاشة والوضوح المذهلين اللذين يجعلان كل تفاعل جذابًا وممتعًا، مما يضفي الحياة على لحظاتك اليومية.\nأكثر من 28 يومًا في وضع الاستعداد، طاقة ممتدة لمدة 7 أيام، استخدام متواصل، تدوم ساعة 5 لايت أكثر من 28 يومًا بشحنة واحدة، مما يمنحك حرية البقاء في الطاقة أثناء الرحلات الطويلة دون القلق بشأن إعادة الشحن.\nمكالمات لاسلكية عالية الدقة: ابق على اتصال بسهولة قم بإجراء المكالمات مباشرة على معصمك، دون متاعب حمل الموبايل، والتواصل بسهولة مع أحبائك.\nمراقب معدل ضربات القلب ومستوى الأكسجين في الدم: تتميز ساعة 5 لايت بمراقبة شاملة للصحة تشمل معدل ضربات القلب، مستوى الأكسجين في الدم، التوتر، النوم، وصحة المرأة، مما يوفر بيانات دقيقة وفورية تساعدك على متابعة صحتك بسهولة وفي أي وقت.\n105 وضع رياضي مصمم خصيصًا لاحتياجات لياقتك البدنية مع أكثر من 105 وضع رياضي، بما في ذلك الجري وركوب الدراجات والرقص، تدعم ساعة 5 لايت جميع أنشطتك المفضلة، مما يبقيك متحمسًا لتحقيق أهدافك.\nمقاومة للماء والغبار بتصنيف مقاومة للماء والغبار IP68 لاستكشاف بلا حدود، لا تقلق بشأن رذاذ الماء أو المطر غير المتوقع، ساعة 5 لايت محمية بأمان بتصنيف IP68، مما يضمن مقاومتها للرذاذ والماء والغبار.\nواجهات ساعة مُنشأة بالذكاء الاصطناعي: أسلوب قابل للتخصيص وخيارات لا نهائية تتميز ساعة 5 لايت بواجهات تم إنشاؤها بواسطة الذكاء الاصطناعي، مما يوفر مجموعة واسعة من التصاميم الديناميكية والشخصية لتناسب كل ذوق وأسلوب. مع أكثر من 120 مينا متاحًا على تطبيق اورايمو هيلث، عبّر عن أسلوبك الفريد دون عناء مع تجربة ملونة تتكيف مع شخصيتك.\n\nنظام التشغيل	بروبريتاري OS\nمميزات خاصة	استخدام عادي لمدة تصل إلى 7 أيام, تصميم الساعة الذكية, شاشة تي اف تي مقاس 2.01 انش, مقاومة للماء والغبار بتصنيف IP68, وقت الاستعداد لأكثر من 28 يومًا\nنظام تحديد المواقع	بدون نظام GPS\nنوع مادة الحزام	معدن\nمستوى مقاومة الماء	ضد الماء\nإدخال الواجهة البشرية	شاشة تعمل باللمس\nالتطبيق المدعوم	Camera, آلة حاسبة, ساعة إيقاف, مصباح يدوي, منبه\nعمق مقاومة الماء	1,5 أمتار\nنوع العداد	مراقب الأكسجين في الدم، مراقب معدل ضربات القلب\nنوع الاغلاق	مشبك', 'B0DWLK9JJH', 790.00, 0.00, 0.00, 10, 5, 420.00, 1, 1, 'cmtykesmo0001mt97hnbgsc6f', 'cmu16tzl4001u8rzewdl0thqz', '', '', '2026-09-14 12:24:17.519', '2026-09-14 17:44:04.433', 1, 1, 1, NULL, NULL),
('cmu1jzfuw001ess4a2rnxtcfy', 'BOBS from SKECHERS Bobs Sport Squad', 'حذاء رياضي سبورت سكواد كايوس 4 من سكيتشرز بوبس', 'BOBS_from_SKECHERS_Bobs_Sport_Squad', 'BOBS from SKECHERS Bobs Sport Squad Chaos 4 Hands-Free Slip-Ins', 'حذاء رياضي سبورت سكواد كايوس 4 من سكيتشرز بوبس، بتقنية هاندز-فري سليب-انز للارتداء السريع دون استخدام اليدين', 'Product details\nTop highlights\nSole materialThermoplastic Elastomers\nOuter material14% Synthetic; 86% Textile\nInner materialLeather\nClosure typeLace-Up\nAbout this item\nHands Free Slip-ins design with Exclusive Heel Pillow for easy wear and secure fit.\nSkechers Memory Foam insole and ULTRA GO cushioning for lightweight, responsive comfort.\nMesh upper with stretch No-Tie Fit laces for breathability and ease of movement.\nContoured shock-absorbing midsole, 1¼-inch heel height, and BOBS Sport logo detail.\nStyle\nColor	TAUPE\nOccasion Type	Multi Occasion\nHeel Type	Flat\nToe Style	Closed Toe\nOccasion Lifestyle	Casual\nStyle Name	Sneaker\nPattern	Solid\nSeasons	All\nPattern	Solid\nFeatures & Specs\nSpecial Features	Lightweight\nClosure Type	Lace-Up\nShoe Type	Athletic Shoe\nWater Resistance Level	Not Water Resistant\nStrap Type	slip_on\nHas Shoe Adjustability	No', 'تفاصيل المنتج\nأهم النقاط البارزة\nمادة النعللدائن حرارية مرنة\nالمادة الخارجية14% صناعي؛ 86% نسيج\nالمواد الداخليةجلد\nنوع السحّابرباط حذاء\nمعلومات عن السلعة\nإغلاق برباط مع نوع حزام انزلاقي وأربطة مطاطية بدون ربط لارتداء آمن ومحكم\nنوع كعب مسطح مع نعل أوسط ماص للصدمات ومحدد الشكل ونعل داخلي من فوم الذاكرة من سكيتشرز\nمصمم للرياضة ونمط الحياة اليومي مع بنية حذاء رياضي\nموديل سليب-إنز: بوبز سبورت سكواد كاوس 4، رقم الموديل 118423 بلون التوب\nنمط سادة مناسب لجميع الفصول مع ارتفاع متوسط وميزة خاصة خفيفة الوزن\nالنمط\nاللون	بني داكن\nمناسبة	مناسبات متعددة\nنوع الكعب	عريض\nنمط مقدمة الحذاء	مقدمة مغلقة\nنمط الاستخدام حسب المناسبة	غير رسمي\nالنمط	حذاء سنيكر رياضي\nتصميم النمط	سادة\nالمواسم	الكل\nالنمط	سادة\nالميزات والمواصفات\nالميزات الخاصة	خفيف الوزن\nنوع الإغلاق	رباط حذاء\nاستخدامات محددة للمنتج	رياضات\nنوع الحذاء	حذاء رياضي\nمستوى مقاومة الماء	غير مقاومة للماء\nنوع الحزام	سليب_اون\nتتمتع بإمكانية تعديل الحذاء	لا', 'B0DP7PJFQ3', 3200.00, 0.00, 0.00, 0, 5, 0.00, 0, 1, 'cmu0358z10009567z6mbtnxg2', 'cmu16tzl4001u8rzewdl0thqz', '', '', '2026-09-14 18:05:12.582', '2026-09-14 18:05:48.067', 1, 0, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `productimage`
--

CREATE TABLE `productimage` (
  `id` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `url` varchar(191) NOT NULL,
  `alt` varchar(191) DEFAULT NULL,
  `sortOrder` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `productimage`
--

INSERT INTO `productimage` (`id`, `productId`, `url`, `alt`, `sortOrder`) VALUES
('cmu1j89cu0000ss4a0ariq7gk', 'cmu17t0o8002k8rzeow0qvsba', '/uploads/sliders/1789388589413-41kxbkppx_L._AC_.jpg', NULL, 0),
('cmu1j89cv0001ss4ar3c4nkhc', 'cmu17t0o8002k8rzeow0qvsba', '/uploads/sliders/1789388594186-51NPBd65xiL._AC_SL1080_.jpg', NULL, 1),
('cmu1j89cv0002ss4awt7bokxx', 'cmu17t0o8002k8rzeow0qvsba', '/uploads/sliders/1789388600097-61d3sh6V6TL._AC_SL1080_.jpg', NULL, 2),
('cmu1j89cv0003ss4ae3mjm1si', 'cmu17t0o8002k8rzeow0qvsba', '/uploads/sliders/1789388602769-61pf7Z9sZyL._AC_SL1280_.jpg', NULL, 3),
('cmu1j89cv0004ss4aorxqvntw', 'cmu17t0o8002k8rzeow0qvsba', '/uploads/sliders/1789388606843-61RF1EYqB1L._AC_SL1080_.jpg', NULL, 4),
('cmu1j89cv0005ss4agy8om8bd', 'cmu17t0o8002k8rzeow0qvsba', '/uploads/sliders/1789388613037-61wE8xqmjHL._AC_SL1280_.jpg', NULL, 5),
('cmu1j89cv0006ss4ax9qciodl', 'cmu17t0o8002k8rzeow0qvsba', '/uploads/sliders/1789388615873-61Zyxg83hfL._AC_SL1080_.jpg', NULL, 6),
('cmu1j89cv0007ss4ae4ckbscc', 'cmu17t0o8002k8rzeow0qvsba', '/uploads/sliders/1789388623288-71JgQoeeK1L._AC_SL1500_.jpg', NULL, 7),
('cmu1j89cv0008ss4agw6dthcl', 'cmu17t0o8002k8rzeow0qvsba', '/uploads/sliders/1789388630529-617pmtQ_xNL._AC_SL1080_.jpg', NULL, 8),
('cmu1j89cv0009ss4aeqrclsq3', 'cmu17t0o8002k8rzeow0qvsba', '/uploads/sliders/1789388635528-614sFEeeYKL._AC_SL1080_.jpg', NULL, 9),
('cmu1j8yih000ass4a39h6zi5b', 'cmu17jl5t002d8rzeup33o4ez', '/uploads/sliders/1789388183768-31zb4s48ZnL._AC_SX679_.jpg', NULL, 0),
('cmu1j8yih000bss4am4d0gg24', 'cmu17jl5t002d8rzeup33o4ez', '/uploads/sliders/1789388188378-41OusWLaZEL._AC_SL1128_.jpg', NULL, 1),
('cmu1j8yih000css4axjro8ux5', 'cmu17jl5t002d8rzeup33o4ez', '/uploads/sliders/1789388192763-21_yBHbKAeL._AC_.jpg', NULL, 2),
('cmu1j92y6000dss4ap1118lzt', 'cmu16sse2001h8rzebgua9kln', '/uploads/sliders/1789386930664-551ae54b-a390-4fe8-b322-5671ba3a1c71.avif', NULL, 0),
('cmu1j92y6000ess4agefas6nc', 'cmu16sse2001h8rzebgua9kln', '/uploads/sliders/1789386934705-7eb701de-9944-4639-ac04-dc6dff0323d5.avif', NULL, 1),
('cmu1j92y6000fss4ae9xhlhu4', 'cmu16sse2001h8rzebgua9kln', '/uploads/sliders/1789386939241-b1a449e7-1706-4520-8424-5565fdd1dde0.avif', NULL, 2),
('cmu1j97hl000gss4a3pk5m94u', 'cmu08izkq001j126su94oym33', '/uploads/sliders/1789329188221-61RuWaEMZ6L._AC_SX522_.jpg', NULL, 0),
('cmu1j97hl000hss4a2gxz58u4', 'cmu08izkq001j126su94oym33', '/uploads/sliders/1789329193940-71mbXQKWnDL._AC_SX522_.jpg', NULL, 1),
('cmu1j97hl000iss4azu6qw1r9', 'cmu08izkq001j126su94oym33', '/uploads/sliders/1789329196968-71JgQoeeK1L._AC_SL1500_.jpg', NULL, 2),
('cmu1j97hl000jss4af3urbgnt', 'cmu08izkq001j126su94oym33', '/uploads/sliders/1789329200208-61r2Fl6_-jL._AC_SL1500_.jpg', NULL, 3),
('cmu1j97hl000kss4ak6uez36p', 'cmu08izkq001j126su94oym33', '/uploads/sliders/1789329203377-5158cerENZL._AC_SL1500_.jpg', NULL, 4),
('cmu1j9c7a000lss4a5txm41xd', 'cmu065jcq000476ht4xnxckv6', '/uploads/sliders/1789325202055-71osmLqm8FL._AC_SX522_.jpg', NULL, 0),
('cmu1j9c7a000mss4a1apv3wtg', 'cmu065jcq000476ht4xnxckv6', '/uploads/sliders/1789325207580-71sPYM6UAiL._AC_SX522_.jpg', NULL, 1),
('cmu1j9c7a000nss4a7ai8zq52', 'cmu065jcq000476ht4xnxckv6', '/uploads/sliders/1789325209988-81LLNHy6jJL._AC_SX522_.jpg', NULL, 2),
('cmu1j9c7a000oss4a9q94py16', 'cmu065jcq000476ht4xnxckv6', '/uploads/sliders/1789325213995-81GrW2LV3dL._AC_SX522_.jpg', NULL, 3),
('cmu1j9c7a000pss4a1x6pq6tp', 'cmu065jcq000476ht4xnxckv6', '/uploads/sliders/1789325216951-71mbXQKWnDL._AC_SX522_.jpg', NULL, 4),
('cmu1j9c7a000qss4a7vnbfxl7', 'cmu065jcq000476ht4xnxckv6', '/uploads/sliders/1789325219233-51_vMlVLx1L._AC_SL1500_.jpg', NULL, 5),
('cmu1k078m001oss4atatvmizt', 'cmu1jzfuw001ess4a2rnxtcfy', '/uploads/sliders/1789408922656-71uCWHfr04L._AC_SY695_.jpg', NULL, 0),
('cmu1k078m001pss4a5409i9ze', 'cmu1jzfuw001ess4a2rnxtcfy', '/uploads/sliders/1789408925657-71KofJaWRDL._AC_SY695_.jpg', NULL, 1),
('cmu1k078m001qss4arfya4xit', 'cmu1jzfuw001ess4a2rnxtcfy', '/uploads/sliders/1789408928684-71kY7aQAFPL._AC_SY695_.jpg', NULL, 2),
('cmu1k078m001rss4aqgd9pb81', 'cmu1jzfuw001ess4a2rnxtcfy', '/uploads/sliders/1789408931368-61Vq4RD8H_L._AC_SY695_.jpg', NULL, 3),
('cmu1k078m001sss4a84zxmpf0', 'cmu1jzfuw001ess4a2rnxtcfy', '/uploads/sliders/1789408938711-71Q_aVcG8QL._AC_SY695_.jpg', NULL, 4);

-- --------------------------------------------------------

--
-- Table structure for table `productvariant`
--

CREATE TABLE `productvariant` (
  `id` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `nameEn` varchar(191) NOT NULL,
  `nameAr` varchar(191) NOT NULL,
  `sku` varchar(191) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `attributes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`attributes`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `productvariant`
--

INSERT INTO `productvariant` (`id`, `productId`, `nameEn`, `nameAr`, `sku`, `price`, `stock`, `attributes`) VALUES
('cmu06im61001f76hthq6jf9dt', 'cmu065jcq000476ht4xnxckv6', '1TB - GOLD', '1TB - GOLD', 'NBESEP5010', 28955.00, 0, '{\"الحجم\":\"1TB\",\"COLOR\":\"GOLD\"}'),
('cmu06im66001h76htfe9pqg6h', 'cmu065jcq000476ht4xnxckv6', '1TB - WHITE', '1TB - WHITE', 'NBESEP5020', 3215.00, 3, '{\"الحجم\":\"1TB\",\"COLOR\":\"WHITE\"}'),
('cmu06im6b001j76htxsj1hy9j', 'cmu065jcq000476ht4xnxckv6', '1TB - BLACK', '1TB - BLACK', 'NBESEP5030', 3522.00, 10, '{\"الحجم\":\"1TB\",\"COLOR\":\"BLACK\"}'),
('cmu06im6j001l76htsvnzrhxi', 'cmu065jcq000476ht4xnxckv6', '1TB - SILVER', '1TB - SILVER', 'NBESEP5040', 3621.00, 10, '{\"الحجم\":\"1TB\",\"COLOR\":\"SILVER\"}'),
('cmu06im6o001n76htdeyq3gzx', 'cmu065jcq000476ht4xnxckv6', '128GB - GOLD', '128GB - GOLD', 'NBESEP5050', 3854.00, 10, '{\"الحجم\":\"128GB\",\"COLOR\":\"GOLD\"}'),
('cmu06im6x001p76ht27y84j47', 'cmu065jcq000476ht4xnxckv6', '128GB - WHITE', '128GB - WHITE', 'NBESEP5060', 3966.00, 10, '{\"الحجم\":\"128GB\",\"COLOR\":\"WHITE\"}'),
('cmu06im72001r76htjzi9su11', 'cmu065jcq000476ht4xnxckv6', '128GB - BLACK', '128GB - BLACK', 'NBESEP5070', 4100.00, 10, '{\"الحجم\":\"128GB\",\"COLOR\":\"BLACK\"}'),
('cmu06im76001t76htl0mme21r', 'cmu065jcq000476ht4xnxckv6', '128GB - SILVER', '128GB - SILVER', 'NBESEP5080', 4257.00, 10, '{\"الحجم\":\"128GB\",\"COLOR\":\"SILVER\"}'),
('cmu06im7c001v76htg60jf8va', 'cmu065jcq000476ht4xnxckv6', '512GB - GOLD', '512GB - GOLD', 'NBESEP5090', 5245.00, 10, '{\"الحجم\":\"512GB\",\"COLOR\":\"GOLD\"}'),
('cmu06im7g001x76ht1sqmbguz', 'cmu065jcq000476ht4xnxckv6', '512GB - WHITE', '512GB - WHITE', 'NBESEP50100', 8524.00, 10, '{\"الحجم\":\"512GB\",\"COLOR\":\"WHITE\"}'),
('cmu06im7l001z76htaealew9e', 'cmu065jcq000476ht4xnxckv6', '512GB - BLACK', '512GB - BLACK', 'NBESEP50101', 8955.00, 10, '{\"الحجم\":\"512GB\",\"COLOR\":\"BLACK\"}'),
('cmu06im7p002176htg9y4kpv8', 'cmu065jcq000476ht4xnxckv6', '512GB - SILVER', '512GB - SILVER', 'NBESEP50102', 5211.00, 10, '{\"الحجم\":\"512GB\",\"COLOR\":\"SILVER\"}'),
('cmu08izkq001p126s6a72k74e', 'cmu08izkq001j126su94oym33', '128BG - GOLD', '128BG - GOLD', 'ABESEP599', 94400.00, 10, '{\"size\":\"128BG\",\"COLOR\":\"GOLD\"}'),
('cmu08izkr001q126sprhfpaj3', 'cmu08izkq001j126su94oym33', '128BG - WHITE', '128BG - WHITE', 'BBESEP599', 94400.00, 10, '{\"size\":\"128BG\",\"COLOR\":\"WHITE\"}'),
('cmu08izkr001r126ssr99tf1w', 'cmu08izkq001j126su94oym33', '128BG - SILVER', '128BG - SILVER', 'CBESEP59', 94400.00, 10, '{\"size\":\"128BG\",\"COLOR\":\"SILVER\"}'),
('cmu08izkr001s126s9jcjj4et', 'cmu08izkq001j126su94oym33', '521GB - GOLD', '521GB - GOLD', 'DBESEP599', 94400.00, 10, '{\"size\":\"521GB\",\"COLOR\":\"GOLD\"}'),
('cmu08izkr001t126s0ebwyrec', 'cmu08izkq001j126su94oym33', '521GB - WHITE', '521GB - WHITE', 'EBESEP599', 94400.00, 10, '{\"size\":\"521GB\",\"COLOR\":\"WHITE\"}'),
('cmu08izkr001u126smr71vr6y', 'cmu08izkq001j126su94oym33', '521GB - SILVER', '521GB - SILVER', 'FBESEP599 ', 94400.00, 10, '{\"size\":\"521GB\",\"COLOR\":\"SILVER\"}'),
('cmu08izkr001v126slkbfq5rw', 'cmu08izkq001j126su94oym33', '1TB - GOLD', '1TB - GOLD', 'GBESEP599', 94400.00, 10, '{\"size\":\"1TB\",\"COLOR\":\"GOLD\"}'),
('cmu08izkr001w126s5k240qut', 'cmu08izkq001j126su94oym33', '1TB - WHITE', '1TB - WHITE', 'HBESEP599', 94400.00, 10, '{\"size\":\"1TB\",\"COLOR\":\"WHITE\"}'),
('cmu08izkr001x126su43t9int', 'cmu08izkq001j126su94oym33', '1TB - SILVER', '1TB - SILVER', 'IBESEP599', 94400.00, 10, '{\"size\":\"1TB\",\"COLOR\":\"SILVER\"}'),
('cmu16sse2001l8rzejzlju8ax', 'cmu16sse2001h8rzebgua9kln', 'S - BLACK', 'S - BLACK', 'TWOAW22CE0169', 1200.00, 10, '{\"المقاسات\":\"S\",\"الألوان\":\"BLACK\"}'),
('cmu16sse2001m8rzebd0ceaot', 'cmu16sse2001h8rzebgua9kln', 'S - BLUE', 'S - BLUE', 'TWOAW22CE01610', 1200.00, 10, '{\"المقاسات\":\"S\",\"الألوان\":\"BLUE\"}'),
('cmu16sse2001n8rzep11yfkco', 'cmu16sse2001h8rzebgua9kln', 'S - WHITE', 'S - WHITE', 'TWOAW22CE01611', 1200.00, 10, '{\"المقاسات\":\"S\",\"الألوان\":\"WHITE\"}'),
('cmu16sse2001o8rzexqevbp4w', 'cmu16sse2001h8rzebgua9kln', 'M - BLACK', 'M - BLACK', 'TWOAW22CE01612', 1300.00, 10, '{\"المقاسات\":\"M\",\"الألوان\":\"BLACK\"}'),
('cmu16sse2001p8rzepdkbihu3', 'cmu16sse2001h8rzebgua9kln', 'M - BLUE', 'M - BLUE', 'TWOAW22CE01613', 1300.00, 10, '{\"المقاسات\":\"M\",\"الألوان\":\"BLUE\"}'),
('cmu16sse3001q8rze5kpi71da', 'cmu16sse2001h8rzebgua9kln', 'M - WHITE', 'M - WHITE', 'TWOAW22CE01614', 1300.00, 10, '{\"المقاسات\":\"M\",\"الألوان\":\"WHITE\"}'),
('cmu16sse3001r8rze1zwutdus', 'cmu16sse2001h8rzebgua9kln', 'L - BLACK', 'L - BLACK', 'TWOAW22CE01615', 1400.00, 10, '{\"المقاسات\":\"L\",\"الألوان\":\"BLACK\"}'),
('cmu16sse3001s8rzeqharo2y8', 'cmu16sse2001h8rzebgua9kln', 'L - BLUE', 'L - BLUE', 'TWOAW22CE01616', 1400.00, 10, '{\"المقاسات\":\"L\",\"الألوان\":\"BLUE\"}'),
('cmu16sse3001t8rzek36tt9dl', 'cmu16sse2001h8rzebgua9kln', 'L - WHITE', 'L - WHITE', 'TWOAW22CE01617', 1400.00, 10, '{\"المقاسات\":\"L\",\"الألوان\":\"WHITE\"}'),
('cmu17jl5u002h8rzeafrrbbc7', 'cmu17jl5t002d8rzeup33o4ez', 'S', 'S', 'B09P8GM8GF', 230.00, 10, '{\"المقاسات\":\"S\"}'),
('cmu17jl5u002i8rze5etbv2ch', 'cmu17jl5t002d8rzeup33o4ez', 'L', 'L', 'B09P8GM8GE', 230.00, 10, '{\"المقاسات\":\"L\"}'),
('cmu1jzfux001kss4a2d6hqwkm', 'cmu1jzfuw001ess4a2rnxtcfy', '42', '42', 'B0DP7PJFQ4', 3200.00, 5, '{\"المقاسات\":\"42\"}'),
('cmu1jzfux001lss4an1fog5v0', 'cmu1jzfuw001ess4a2rnxtcfy', '43', '43', 'B0DP7PJFQ5', 3200.00, 5, '{\"المقاسات\":\"43\"}'),
('cmu1jzfux001mss4ayxlsiy8n', 'cmu1jzfuw001ess4a2rnxtcfy', '44', '44', 'B0DP7PJFQ6', 3200.00, 5, '{\"المقاسات\":\"44\"}'),
('cmu1jzfux001nss4af56kg0gt', 'cmu1jzfuw001ess4a2rnxtcfy', '45', '45', 'B0DP7PJFQ7', 3200.00, 5, '{\"المقاسات\":\"45\"}');

-- --------------------------------------------------------

--
-- Table structure for table `redirect`
--

CREATE TABLE `redirect` (
  `id` varchar(191) NOT NULL,
  `source` varchar(191) NOT NULL,
  `destination` varchar(191) NOT NULL,
  `isPermanent` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `rating` int(11) NOT NULL,
  `title` varchar(191) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `isApproved` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `review`
--

INSERT INTO `review` (`id`, `userId`, `productId`, `rating`, `title`, `comment`, `isApproved`, `createdAt`, `updatedAt`) VALUES
('cmu1a9mtk000428ionjkloho4', 'cmtx7jzkc00015jxjcpb4mz1w', 'cmu17t0o8002k8rzeow0qvsba', 3, NULL, 'منتج معقول قيمة مقابل سعر ليس الافضل ولكنه مناسب للاستعمال الخفيف', 1, '2026-09-14 13:33:12.003', '2026-09-14 13:39:03.820'),
('cmu1amytt000a28io40u1o5ep', 'cmtx7jzkc00015jxjcpb4mz1w', 'cmu17t0o8002k8rzeow0qvsba', 5, NULL, 'منتج جيد جدا', 1, '2026-09-14 13:43:34.094', '2026-09-16 21:45:58.794'),
('cmu1ara84000d28iohrspk6qt', 'cmtx7jzkc00015jxjcpb4mz1w', 'cmu08izkq001j126su94oym33', 5, NULL, 'هذا الهاتف ليس لهو مثال', 1, '2026-09-14 13:46:55.492', '2026-09-14 13:47:07.146'),
('cmu4ndx280001cx5mupp9lv2l', 'cmtx7jzkc00015jxjcpb4mz1w', 'cmu16sse2001h8rzebgua9kln', 5, NULL, 'منتج ممتاز جدا جدا جدا', 1, '2026-09-16 22:03:45.434', '2026-09-16 22:04:33.919');

-- --------------------------------------------------------

--
-- Table structure for table `setting`
--

CREATE TABLE `setting` (
  `id` varchar(191) NOT NULL,
  `key` varchar(191) NOT NULL,
  `value` text NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `setting`
--

INSERT INTO `setting` (`id`, `key`, `value`, `createdAt`, `updatedAt`) VALUES
('cmtx7t0e900035jxjoelsk8p7', 'store_name', 'PLUSE ', '2026-09-11 17:13:12.513', '2026-09-16 20:53:58.616'),
('cmtx7t0ej00045jxjdo7znooq', 'contact_email', 'info@store.com', '2026-09-11 17:13:12.523', '2026-09-16 20:53:58.651'),
('cmtx7t0er00055jxj83p6tzkc', 'currency', 'EGP', '2026-09-11 17:13:12.531', '2026-09-16 19:39:17.541'),
('cmtx7t0f400065jxjj6rl1172', 'contact_phone', '01065962515', '2026-09-11 17:13:12.545', '2026-09-16 20:53:58.657'),
('cmtx7t0f900075jxj0oysgflp', 'whatsapp', '01144954837', '2026-09-11 17:13:12.549', '2026-09-16 20:53:58.665'),
('cmtx7t0fg00085jxj910475ki', 'address', 'Cairo', '2026-09-11 17:13:12.556', '2026-09-16 20:53:58.671'),
('cmtx7t0fm00095jxjt2ix8wqi', 'logo', '/uploads/sliders/1789230271656-Gemini_Generated_Image_ez13n5ez13n5ez13.png', '2026-09-11 17:13:12.562', '2026-09-16 20:53:58.686'),
('cmtx7t0fq000a5jxj763ivj2y', 'header_tagline_ar', 'شحن سريع | أفضل الأسعار | ضمان الجودة', '2026-09-11 17:13:12.566', '2026-09-16 20:53:58.705'),
('cmtx7t0fw000b5jxjmy1e2vmo', 'header_tagline_en', 'Fast Shipping | Best Prices | Quality Guaranteed', '2026-09-11 17:13:12.572', '2026-09-16 20:53:58.714'),
('cmtx7t0g1000c5jxj1z8qx5jh', 'custom_social_links', '[{\"id\":\"1789146661563\",\"name\":\"facebook\",\"url\":\"https://www.facebook.com/ComposerCoreEg/\"},{\"id\":\"1789146687990\",\"name\":\"instagram\",\"url\":\"https://www.instagram.com/composercore/\"}]', '2026-09-11 17:13:12.578', '2026-09-16 20:53:58.749'),
('cmtx7t0g6000d5jxjh7sck1i0', 'shipping_base_cost', '100', '2026-09-11 17:13:12.582', '2026-09-16 22:36:12.829'),
('cmtx7t0gb000e5jxj1lotjfm4', 'shipping_free_threshold', '', '2026-09-11 17:13:12.588', '2026-09-16 22:36:12.829'),
('cmtx7t0gh000f5jxjamvowrl9', 'shipping_regions', '[{\"id\":\"1789146763531\",\"name\":\"القاهرة\",\"cost\":\"30\"},{\"id\":\"1789146777524\",\"name\":\"الاسكندرية\",\"cost\":\"50\"}]', '2026-09-11 17:13:12.593', '2026-09-16 22:36:12.829'),
('cmtzx6l9b000o6slz54gwf20l', 'footer_logo', '', '2026-09-13 14:39:08.832', '2026-09-16 20:53:58.692'),
('cmtzx6lb9000p6slz8u3z29z3', 'favicon', '/uploads/media/1789310340683-favicon.png', '2026-09-13 14:39:08.901', '2026-09-16 20:53:58.699'),
('cmu15o8qr000b8rzec1676eyw', 'index_title_ar', 'الصفحة الرئيسية | بلاستيجو', '2026-09-14 11:24:35.523', '2026-09-16 20:53:58.719'),
('cmu15o8r0000c8rze6s2glyqz', 'index_title_en', 'HomePage | Plustigo', '2026-09-14 11:24:35.533', '2026-09-16 20:53:58.725'),
('cmu15o8r6000d8rzedbhbtry4', 'index_description_ar', 'افضل موقع تسويق في مصر والوطن العربي', '2026-09-14 11:24:35.539', '2026-09-16 20:53:58.734'),
('cmu15o8ra000e8rze7qmfaot9', 'index_description_en', 'The Best Marketing Agency in Egypt and the Arab World', '2026-09-14 11:24:35.543', '2026-09-16 20:53:58.740'),
('cmu1kr1oh0000ksak7os8jiqk', 'site_visits', '12', '2026-09-14 18:26:40.578', '2026-09-17 11:52:52.854'),
('cmu4i7mce000611st0zy0f79l', 'store_location_map', '<iframe src=\"https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d27607.73758448659!2d31.2687442!3d30.123752099999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sar!2seg!4v1789587515588!5m2!1sar!2seg\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"strict-origin-when-cross-origin\"></iframe>', '2026-09-16 19:38:53.534', '2026-09-16 20:53:58.681'),
('cmu4k7vuy000g116wu8u5a6gr', 'privacy_policy_title_ar', 'سياسة الخصوصية ', '2026-09-16 20:35:05.099', '2026-09-16 20:53:58.756'),
('cmu4k7vvc000h116w2n78959b', 'privacy_policy_title_en', 'Privacy Policy', '2026-09-16 20:35:05.112', '2026-09-16 20:53:58.765'),
('cmu4k7vw4000i116wgkhxh344', 'privacy_policy_ar', '<p><strong>آخر&nbsp;تحديث:&nbsp;[16-09-2026]</strong></p><p>نحن&nbsp;في&nbsp;<strong>[اسم&nbsp;المتجر]</strong>&nbsp;نحترم&nbsp;خصوصيتك&nbsp;ونلتزم&nbsp;بحماية&nbsp;بياناتك&nbsp;الشخصية.&nbsp;توضح&nbsp;سياسة&nbsp;الخصوصية&nbsp;هذه&nbsp;كيفية&nbsp;جمع&nbsp;معلوماتك&nbsp;واستخدامها&nbsp;وتخزينها&nbsp;وحمايتها&nbsp;عند&nbsp;استخدامك&nbsp;لموقعنا&nbsp;الإلكتروني&nbsp;وخدماتنا.</p><p>باستخدامك&nbsp;للموقع&nbsp;أو&nbsp;إنشاء&nbsp;حساب&nbsp;أو&nbsp;إجراء&nbsp;طلب،&nbsp;فإنك&nbsp;توافق&nbsp;على&nbsp;الممارسات&nbsp;الموضحة&nbsp;في&nbsp;هذه&nbsp;السياسة.</p><p></p><h2>1.&nbsp;المعلومات&nbsp;التي&nbsp;نجمعها</h2><p>قد&nbsp;نقوم&nbsp;بجمع&nbsp;المعلومات&nbsp;التالية&nbsp;عند&nbsp;استخدامك&nbsp;لموقعنا:</p><h3>معلومات&nbsp;الحساب</h3><ul><li>الاسم&nbsp;الكامل.</li><li>عنوان&nbsp;البريد&nbsp;الإلكتروني.</li><li>رقم&nbsp;الهاتف.</li><li>كلمة&nbsp;المرور&nbsp;الخاصة&nbsp;بالحساب،&nbsp;والتي&nbsp;يتم&nbsp;تخزينها&nbsp;بطريقة&nbsp;آمنة&nbsp;ومشفرة.</li><li>أي&nbsp;معلومات&nbsp;أخرى&nbsp;تقدمها&nbsp;عند&nbsp;إنشاء&nbsp;أو&nbsp;تحديث&nbsp;حسابك.</li></ul><h3>معلومات&nbsp;الطلبات</h3><p>عند&nbsp;إجراء&nbsp;عملية&nbsp;شراء،&nbsp;قد&nbsp;نجمع:</p><ul><li>المنتجات&nbsp;التي&nbsp;طلبتها.</li><li>تفاصيل&nbsp;الطلب&nbsp;وقيمته.</li><li>عنوان&nbsp;الشحن&nbsp;والتوصيل.</li><li>بيانات&nbsp;الفواتير&nbsp;عند&nbsp;الحاجة.</li><li>معلومات&nbsp;التواصل&nbsp;المتعلقة&nbsp;بالطلب.</li></ul><h3>معلومات&nbsp;الدفع</h3><p>قد&nbsp;يتم&nbsp;التعامل&nbsp;مع&nbsp;بيانات&nbsp;الدفع&nbsp;من&nbsp;خلال&nbsp;مزودي&nbsp;خدمات&nbsp;دفع&nbsp;خارجيين&nbsp;وآمنين.&nbsp;لا&nbsp;نقوم&nbsp;بتخزين&nbsp;بيانات&nbsp;بطاقات&nbsp;الدفع&nbsp;الكاملة&nbsp;على&nbsp;خوادمنا&nbsp;إلا&nbsp;إذا&nbsp;كان&nbsp;ذلك&nbsp;ضروريًا&nbsp;ومسموحًا&nbsp;به&nbsp;وفقًا&nbsp;للمتطلبات&nbsp;الأمنية&nbsp;والتنظيمية&nbsp;المعمول&nbsp;بها.</p><h3>المعلومات&nbsp;التقنية</h3><p>قد&nbsp;يتم&nbsp;جمع&nbsp;بعض&nbsp;المعلومات&nbsp;تلقائيًا&nbsp;عند&nbsp;زيارة&nbsp;الموقع،&nbsp;مثل:</p><ul><li>عنوان&nbsp;IP.</li><li>نوع&nbsp;الجهاز&nbsp;والمتصفح.</li><li>نظام&nbsp;التشغيل.</li><li>الصفحات&nbsp;التي&nbsp;تزورها.</li><li>تاريخ&nbsp;ووقت&nbsp;الزيارة.</li><li>معلومات&nbsp;الاستخدام&nbsp;والتفاعل&nbsp;مع&nbsp;الموقع.</li><li></li></ul><h2>2.&nbsp;كيف&nbsp;نستخدم&nbsp;معلوماتك؟</h2><p>نستخدم&nbsp;المعلومات&nbsp;التي&nbsp;نجمعها&nbsp;للأغراض&nbsp;التالية:</p><ul><li>إنشاء&nbsp;وإدارة&nbsp;حسابك.</li><li>معالجة&nbsp;الطلبات&nbsp;وتأكيدها.</li><li>تجهيز&nbsp;وشحن&nbsp;وتسليم&nbsp;المنتجات.</li><li>التواصل&nbsp;معك&nbsp;بشأن&nbsp;طلباتك.</li><li>تقديم&nbsp;خدمة&nbsp;العملاء&nbsp;والدعم.</li><li>تحسين&nbsp;أداء&nbsp;الموقع&nbsp;وتجربة&nbsp;المستخدم.</li><li>اكتشاف&nbsp;ومنع&nbsp;الاحتيال&nbsp;أو&nbsp;الاستخدام&nbsp;غير&nbsp;المصرح&nbsp;به.</li><li>حماية&nbsp;أمن&nbsp;الموقع&nbsp;وأنظمته.</li><li>إرسال&nbsp;العروض&nbsp;والتحديثات&nbsp;التسويقية&nbsp;عندما&nbsp;تسمح&nbsp;بذلك&nbsp;إعداداتك&nbsp;والقوانين&nbsp;المعمول&nbsp;بها.</li><li>الالتزام&nbsp;بالمتطلبات&nbsp;القانونية&nbsp;والتنظيمية.</li></ul><p></p><h2>3.&nbsp;مشاركة&nbsp;المعلومات</h2><p>نحن&nbsp;لا&nbsp;نبيع&nbsp;أو&nbsp;نؤجر&nbsp;بياناتك&nbsp;الشخصية&nbsp;لأطراف&nbsp;أخرى.</p><p>قد&nbsp;نشارك&nbsp;بعض&nbsp;المعلومات&nbsp;الضرورية&nbsp;مع&nbsp;جهات&nbsp;موثوقة&nbsp;تساعدنا&nbsp;في&nbsp;تشغيل&nbsp;خدماتنا،&nbsp;مثل:</p><ul><li>شركات&nbsp;الشحن&nbsp;والتوصيل.</li><li>مزودي&nbsp;خدمات&nbsp;الدفع.</li><li>مزودي&nbsp;الاستضافة&nbsp;والبنية&nbsp;التحتية&nbsp;التقنية.</li><li>خدمات&nbsp;البريد&nbsp;الإلكتروني&nbsp;والإشعارات.</li><li>مزودي&nbsp;خدمات&nbsp;التحليلات&nbsp;والأمان.</li><li>الجهات&nbsp;الحكومية&nbsp;أو&nbsp;القانونية&nbsp;عندما&nbsp;يكون&nbsp;ذلك&nbsp;مطلوبًا&nbsp;بموجب&nbsp;القانون.</li></ul><p>يتم&nbsp;مشاركة&nbsp;الحد&nbsp;الأدنى&nbsp;من&nbsp;المعلومات&nbsp;اللازمة&nbsp;لتنفيذ&nbsp;الغرض&nbsp;المطلوب.</p><p></p><h2>4.&nbsp;حماية&nbsp;معلوماتك</h2><p>نتخذ&nbsp;إجراءات&nbsp;تقنية&nbsp;وتنظيمية&nbsp;مناسبة&nbsp;للمساعدة&nbsp;في&nbsp;حماية&nbsp;معلوماتك&nbsp;الشخصية&nbsp;من&nbsp;الوصول&nbsp;غير&nbsp;المصرح&nbsp;به&nbsp;أو&nbsp;التعديل&nbsp;أو&nbsp;الكشف&nbsp;أو&nbsp;الإتلاف.</p><p>ومع&nbsp;ذلك،&nbsp;لا&nbsp;يمكن&nbsp;ضمان&nbsp;أن&nbsp;تكون&nbsp;أي&nbsp;عملية&nbsp;نقل&nbsp;أو&nbsp;تخزين&nbsp;للبيانات&nbsp;عبر&nbsp;الإنترنت&nbsp;آمنة&nbsp;بنسبة&nbsp;100%.</p><p>ننصحك&nbsp;باستخدام&nbsp;كلمة&nbsp;مرور&nbsp;قوية&nbsp;وعدم&nbsp;مشاركتها&nbsp;مع&nbsp;أي&nbsp;شخص.</p><p></p><h2>5.&nbsp;ملفات&nbsp;تعريف&nbsp;الارتباط&nbsp;(Cookies)</h2><p>قد&nbsp;يستخدم&nbsp;موقعنا&nbsp;ملفات&nbsp;تعريف&nbsp;الارتباط&nbsp;وتقنيات&nbsp;مشابهة&nbsp;من&nbsp;أجل:</p><ul><li>تشغيل&nbsp;وظائف&nbsp;الموقع&nbsp;الأساسية.</li><li>الحفاظ&nbsp;على&nbsp;تسجيل&nbsp;الدخول&nbsp;وسلة&nbsp;التسوق.</li><li>تذكر&nbsp;تفضيلاتك.</li><li>تحسين&nbsp;أداء&nbsp;الموقع.</li><li>فهم&nbsp;كيفية&nbsp;استخدام&nbsp;الزوار&nbsp;للموقع.</li><li>تحسين&nbsp;الخدمات&nbsp;والمحتوى&nbsp;والإعلانات،&nbsp;عند&nbsp;استخدام&nbsp;خدمات&nbsp;التسويق&nbsp;أو&nbsp;التحليلات&nbsp;ذات&nbsp;الصلة.</li></ul><p>يمكنك&nbsp;التحكم&nbsp;في&nbsp;ملفات&nbsp;تعريف&nbsp;الارتباط&nbsp;من&nbsp;خلال&nbsp;إعدادات&nbsp;المتصفح،&nbsp;إلا&nbsp;أن&nbsp;تعطيل&nbsp;بعض&nbsp;أنواعها&nbsp;قد&nbsp;يؤثر&nbsp;على&nbsp;وظائف&nbsp;الموقع.</p><p></p><h2>6.&nbsp;الاحتفاظ&nbsp;بالبيانات</h2><p>نحتفظ&nbsp;بالمعلومات&nbsp;الشخصية&nbsp;فقط&nbsp;للمدة&nbsp;اللازمة&nbsp;لتحقيق&nbsp;الأغراض&nbsp;الموضحة&nbsp;في&nbsp;هذه&nbsp;السياسة،&nbsp;أو&nbsp;حسبما&nbsp;تقتضيه&nbsp;المتطلبات&nbsp;القانونية&nbsp;والمحاسبية&nbsp;والتنظيمية.</p><p>عند&nbsp;عدم&nbsp;الحاجة&nbsp;إلى&nbsp;المعلومات،&nbsp;قد&nbsp;نقوم&nbsp;بحذفها&nbsp;أو&nbsp;إخفاء&nbsp;هويتها&nbsp;أو&nbsp;الاحتفاظ&nbsp;بها&nbsp;بشكل&nbsp;آمن&nbsp;عندما&nbsp;يكون&nbsp;الاحتفاظ&nbsp;بها&nbsp;مطلوبًا&nbsp;قانونيًا.</p><p></p><h2>7.&nbsp;حقوقك</h2><p>بحسب&nbsp;القوانين&nbsp;المعمول&nbsp;بها،&nbsp;قد&nbsp;يكون&nbsp;لديك&nbsp;بعض&nbsp;الحقوق&nbsp;المتعلقة&nbsp;ببياناتك&nbsp;الشخصية،&nbsp;ومنها:</p><ul><li>طلب&nbsp;معرفة&nbsp;البيانات&nbsp;التي&nbsp;نحتفظ&nbsp;بها&nbsp;عنك.</li><li>طلب&nbsp;تصحيح&nbsp;المعلومات&nbsp;غير&nbsp;الصحيحة.</li><li>طلب&nbsp;حذف&nbsp;بياناتك&nbsp;في&nbsp;الحالات&nbsp;التي&nbsp;يسمح&nbsp;بها&nbsp;القانون.</li><li>طلب&nbsp;تقييد&nbsp;أو&nbsp;الاعتراض&nbsp;على&nbsp;بعض&nbsp;طرق&nbsp;معالجة&nbsp;بياناتك.</li><li>سحب&nbsp;موافقتك&nbsp;على&nbsp;الاتصالات&nbsp;التسويقية&nbsp;في&nbsp;أي&nbsp;وقت.</li><li>طلب&nbsp;الحصول&nbsp;على&nbsp;نسخة&nbsp;من&nbsp;بعض&nbsp;بياناتك&nbsp;الشخصية.</li></ul><p>يمكنك&nbsp;التواصل&nbsp;معنا&nbsp;لممارسة&nbsp;حقوقك&nbsp;أو&nbsp;للاستفسار&nbsp;عن&nbsp;كيفية&nbsp;معالجة&nbsp;بياناتك.</p><p></p><h2>8.&nbsp;الاتصالات&nbsp;التسويقية</h2><p>إذا&nbsp;اخترت&nbsp;الاشتراك&nbsp;في&nbsp;الرسائل&nbsp;التسويقية،&nbsp;فقد&nbsp;نرسل&nbsp;إليك&nbsp;عروضًا&nbsp;وتحديثات&nbsp;وأخبارًا&nbsp;متعلقة&nbsp;بمنتجاتنا&nbsp;وخدماتنا.</p><p>يمكنك&nbsp;إلغاء&nbsp;الاشتراك&nbsp;في&nbsp;الرسائل&nbsp;التسويقية&nbsp;في&nbsp;أي&nbsp;وقت&nbsp;من&nbsp;خلال&nbsp;رابط&nbsp;إلغاء&nbsp;الاشتراك&nbsp;الموجود&nbsp;في&nbsp;الرسالة&nbsp;أو&nbsp;عن&nbsp;طريق&nbsp;التواصل&nbsp;معنا.</p><p></p><h2>9.&nbsp;روابط&nbsp;الجهات&nbsp;الخارجية</h2><p>قد&nbsp;يحتوي&nbsp;موقعنا&nbsp;على&nbsp;روابط&nbsp;لمواقع&nbsp;أو&nbsp;خدمات&nbsp;تابعة&nbsp;لأطراف&nbsp;أخرى.</p><p>نحن&nbsp;لسنا&nbsp;مسؤولين&nbsp;عن&nbsp;سياسات&nbsp;الخصوصية&nbsp;أو&nbsp;ممارسات&nbsp;حماية&nbsp;البيانات&nbsp;الخاصة&nbsp;بهذه&nbsp;المواقع،&nbsp;ونوصي&nbsp;بمراجعة&nbsp;سياسة&nbsp;الخصوصية&nbsp;الخاصة&nbsp;بأي&nbsp;موقع&nbsp;خارجي&nbsp;تزوره.</p><p></p><h2>10.&nbsp;خصوصية&nbsp;الأطفال</h2><p>خدماتنا&nbsp;ليست&nbsp;موجهة&nbsp;بشكل&nbsp;أساسي&nbsp;إلى&nbsp;الأطفال.&nbsp;نحن&nbsp;لا&nbsp;نجمع&nbsp;معلومات&nbsp;شخصية&nbsp;من&nbsp;الأطفال&nbsp;عن&nbsp;قصد&nbsp;دون&nbsp;وجود&nbsp;أساس&nbsp;قانوني&nbsp;مناسب&nbsp;أو&nbsp;موافقة&nbsp;ولي&nbsp;الأمر&nbsp;عندما&nbsp;تكون&nbsp;مطلوبة.</p><p>إذا&nbsp;علمنا&nbsp;أن&nbsp;بيانات&nbsp;شخصية&nbsp;لطفل&nbsp;قد&nbsp;تم&nbsp;جمعها&nbsp;بطريقة&nbsp;غير&nbsp;مناسبة،&nbsp;فيمكنك&nbsp;التواصل&nbsp;معنا&nbsp;لاتخاذ&nbsp;الإجراءات&nbsp;اللازمة.</p><p></p><h2>11.&nbsp;التغييرات&nbsp;على&nbsp;سياسة&nbsp;الخصوصية</h2><p>قد&nbsp;نقوم&nbsp;بتحديث&nbsp;سياسة&nbsp;الخصوصية&nbsp;من&nbsp;وقت&nbsp;لآخر&nbsp;لمواكبة&nbsp;التغييرات&nbsp;في&nbsp;خدماتنا&nbsp;أو&nbsp;المتطلبات&nbsp;القانونية.</p><p>سيتم&nbsp;نشر&nbsp;النسخة&nbsp;المحدثة&nbsp;على&nbsp;هذه&nbsp;الصفحة&nbsp;مع&nbsp;تعديل&nbsp;تاريخ&nbsp;&quot;آخر&nbsp;تحديث&quot;.</p><p></p><h2>12.&nbsp;التواصل&nbsp;معنا</h2><p>إذا&nbsp;كانت&nbsp;لديك&nbsp;أي&nbsp;أسئلة&nbsp;أو&nbsp;طلبات&nbsp;تتعلق&nbsp;بسياسة&nbsp;الخصوصية&nbsp;أو&nbsp;بياناتك&nbsp;الشخصية،&nbsp;يمكنك&nbsp;التواصل&nbsp;معنا&nbsp;من&nbsp;خلال:</p><p><strong>اسم&nbsp;المتجر:</strong>&nbsp;[PLUSE]</p><p><strong>البريد&nbsp;الإلكتروني:</strong>&nbsp;[ahmed.fr1988@gmail.com]</p><p><strong>رقم&nbsp;الهاتف:</strong>&nbsp;[+201065962515]</p><p><strong>العنوان:</strong>&nbsp;[مصر&nbsp;,&nbsp;القاهرة]</p>', '2026-09-16 20:35:05.141', '2026-09-16 20:53:58.772'),
('cmu4k7vwa000j116wt5b56hs4', 'privacy_policy_en', '<p><strong>Last&nbsp;Updated:&nbsp;[16-09-2026]</strong></p><p>At&nbsp;<strong>[Store&nbsp;Name]</strong>,&nbsp;we&nbsp;respect&nbsp;your&nbsp;privacy&nbsp;and&nbsp;are&nbsp;committed&nbsp;to&nbsp;protecting&nbsp;your&nbsp;personal&nbsp;information.&nbsp;This&nbsp;Privacy&nbsp;Policy&nbsp;explains&nbsp;how&nbsp;we&nbsp;collect,&nbsp;use,&nbsp;store,&nbsp;and&nbsp;protect&nbsp;your&nbsp;information&nbsp;when&nbsp;you&nbsp;use&nbsp;our&nbsp;website&nbsp;and&nbsp;services.</p><p>By&nbsp;using&nbsp;our&nbsp;website,&nbsp;creating&nbsp;an&nbsp;account,&nbsp;or&nbsp;placing&nbsp;an&nbsp;order,&nbsp;you&nbsp;agree&nbsp;to&nbsp;the&nbsp;practices&nbsp;described&nbsp;in&nbsp;this&nbsp;Privacy&nbsp;Policy.</p><p></p><h2>1.&nbsp;Information&nbsp;We&nbsp;Collect</h2><p>We&nbsp;may&nbsp;collect&nbsp;the&nbsp;following&nbsp;information&nbsp;when&nbsp;you&nbsp;use&nbsp;our&nbsp;website:</p><h3>Account&nbsp;Information</h3><ul><li>Full&nbsp;name.</li><li>Email&nbsp;address.</li><li>Phone&nbsp;number.</li><li>Account&nbsp;password,&nbsp;which&nbsp;is&nbsp;stored&nbsp;securely&nbsp;using&nbsp;appropriate&nbsp;security&nbsp;measures.</li><li>Any&nbsp;other&nbsp;information&nbsp;you&nbsp;provide&nbsp;when&nbsp;creating&nbsp;or&nbsp;updating&nbsp;your&nbsp;account.</li></ul><h3>Order&nbsp;Information</h3><p>When&nbsp;you&nbsp;place&nbsp;an&nbsp;order,&nbsp;we&nbsp;may&nbsp;collect:</p><ul><li>Products&nbsp;you&nbsp;purchase.</li><li>Order&nbsp;details&nbsp;and&nbsp;total&nbsp;amount.</li><li>Shipping&nbsp;and&nbsp;delivery&nbsp;address.</li><li>Billing&nbsp;information&nbsp;when&nbsp;required.</li><li>Contact&nbsp;information&nbsp;related&nbsp;to&nbsp;your&nbsp;order.</li></ul><h3>Payment&nbsp;Information</h3><p>Payment&nbsp;information&nbsp;may&nbsp;be&nbsp;processed&nbsp;through&nbsp;secure&nbsp;third-party&nbsp;payment&nbsp;providers.&nbsp;We&nbsp;do&nbsp;not&nbsp;store&nbsp;complete&nbsp;payment&nbsp;card&nbsp;details&nbsp;on&nbsp;our&nbsp;servers&nbsp;unless&nbsp;necessary&nbsp;and&nbsp;permitted&nbsp;under&nbsp;applicable&nbsp;security&nbsp;and&nbsp;regulatory&nbsp;requirements.</p><h3>Technical&nbsp;Information</h3><p>Some&nbsp;information&nbsp;may&nbsp;be&nbsp;collected&nbsp;automatically&nbsp;when&nbsp;you&nbsp;visit&nbsp;our&nbsp;website,&nbsp;including:</p><ul><li>IP&nbsp;address.</li><li>Device&nbsp;and&nbsp;browser&nbsp;type.</li><li>Operating&nbsp;system.</li><li>Pages&nbsp;you&nbsp;visit.</li><li>Date&nbsp;and&nbsp;time&nbsp;of&nbsp;your&nbsp;visit.</li><li>Website&nbsp;usage&nbsp;and&nbsp;interaction&nbsp;information.</li></ul><p></p><h2>2.&nbsp;How&nbsp;We&nbsp;Use&nbsp;Your&nbsp;Information</h2><p>We&nbsp;may&nbsp;use&nbsp;the&nbsp;information&nbsp;we&nbsp;collect&nbsp;to:</p><ul><li>Create&nbsp;and&nbsp;manage&nbsp;your&nbsp;account.</li><li>Process&nbsp;and&nbsp;confirm&nbsp;your&nbsp;orders.</li><li>Prepare,&nbsp;ship,&nbsp;and&nbsp;deliver&nbsp;products.</li><li>Communicate&nbsp;with&nbsp;you&nbsp;regarding&nbsp;your&nbsp;orders.</li><li>Provide&nbsp;customer&nbsp;service&nbsp;and&nbsp;support.</li><li>Improve&nbsp;our&nbsp;website&nbsp;and&nbsp;user&nbsp;experience.</li><li>Detect&nbsp;and&nbsp;prevent&nbsp;fraud&nbsp;or&nbsp;unauthorized&nbsp;activity.</li><li>Protect&nbsp;the&nbsp;security&nbsp;of&nbsp;our&nbsp;website&nbsp;and&nbsp;systems.</li><li>Send&nbsp;marketing&nbsp;communications&nbsp;and&nbsp;offers&nbsp;where&nbsp;permitted&nbsp;by&nbsp;your&nbsp;preferences&nbsp;and&nbsp;applicable&nbsp;law.</li><li>Comply&nbsp;with&nbsp;legal&nbsp;and&nbsp;regulatory&nbsp;requirements.</li></ul><p></p><h2>3.&nbsp;Sharing&nbsp;Your&nbsp;Information</h2><p>We&nbsp;do&nbsp;not&nbsp;sell&nbsp;or&nbsp;rent&nbsp;your&nbsp;personal&nbsp;information&nbsp;to&nbsp;third&nbsp;parties.</p><p>We&nbsp;may&nbsp;share&nbsp;necessary&nbsp;information&nbsp;with&nbsp;trusted&nbsp;service&nbsp;providers&nbsp;that&nbsp;help&nbsp;us&nbsp;operate&nbsp;our&nbsp;business,&nbsp;including:</p><ul><li>Shipping&nbsp;and&nbsp;delivery&nbsp;companies.</li><li>Payment&nbsp;service&nbsp;providers.</li><li>Hosting&nbsp;and&nbsp;infrastructure&nbsp;providers.</li><li>Email&nbsp;and&nbsp;notification&nbsp;service&nbsp;providers.</li><li>Analytics&nbsp;and&nbsp;security&nbsp;service&nbsp;providers.</li><li>Government&nbsp;authorities&nbsp;or&nbsp;legal&nbsp;entities&nbsp;when&nbsp;required&nbsp;by&nbsp;law.</li></ul><p>We&nbsp;aim&nbsp;to&nbsp;share&nbsp;only&nbsp;the&nbsp;information&nbsp;necessary&nbsp;for&nbsp;the&nbsp;relevant&nbsp;purpose.</p><p></p><h2>4.&nbsp;How&nbsp;We&nbsp;Protect&nbsp;Your&nbsp;Information</h2><p>We&nbsp;use&nbsp;appropriate&nbsp;technical&nbsp;and&nbsp;organizational&nbsp;measures&nbsp;to&nbsp;help&nbsp;protect&nbsp;your&nbsp;personal&nbsp;information&nbsp;from&nbsp;unauthorized&nbsp;access,&nbsp;alteration,&nbsp;disclosure,&nbsp;or&nbsp;destruction.</p><p>However,&nbsp;no&nbsp;method&nbsp;of&nbsp;transmission&nbsp;or&nbsp;storage&nbsp;over&nbsp;the&nbsp;Internet&nbsp;can&nbsp;be&nbsp;guaranteed&nbsp;to&nbsp;be&nbsp;completely&nbsp;secure.</p><p>We&nbsp;recommend&nbsp;using&nbsp;a&nbsp;strong&nbsp;password&nbsp;and&nbsp;keeping&nbsp;your&nbsp;account&nbsp;credentials&nbsp;confidential.</p><h2>5.&nbsp;Cookies</h2><p>Our&nbsp;website&nbsp;may&nbsp;use&nbsp;cookies&nbsp;and&nbsp;similar&nbsp;technologies&nbsp;to:</p><ul><li>Enable&nbsp;essential&nbsp;website&nbsp;functionality.</li><li>Maintain&nbsp;login&nbsp;sessions&nbsp;and&nbsp;shopping&nbsp;carts.</li><li>Remember&nbsp;your&nbsp;preferences.</li><li>Improve&nbsp;website&nbsp;performance.</li><li>Understand&nbsp;how&nbsp;visitors&nbsp;use&nbsp;our&nbsp;website.</li><li>Improve&nbsp;services,&nbsp;content,&nbsp;and&nbsp;advertising&nbsp;when&nbsp;relevant&nbsp;analytics&nbsp;or&nbsp;marketing&nbsp;services&nbsp;are&nbsp;used.</li></ul><p>You&nbsp;can&nbsp;control&nbsp;cookies&nbsp;through&nbsp;your&nbsp;browser&nbsp;settings.&nbsp;However,&nbsp;disabling&nbsp;certain&nbsp;cookies&nbsp;may&nbsp;affect&nbsp;some&nbsp;website&nbsp;functionality.</p><p></p><h2>6.&nbsp;Data&nbsp;Retention</h2><p>We&nbsp;retain&nbsp;personal&nbsp;information&nbsp;only&nbsp;for&nbsp;as&nbsp;long&nbsp;as&nbsp;necessary&nbsp;to&nbsp;fulfill&nbsp;the&nbsp;purposes&nbsp;described&nbsp;in&nbsp;this&nbsp;Privacy&nbsp;Policy&nbsp;or&nbsp;as&nbsp;required&nbsp;by&nbsp;applicable&nbsp;legal,&nbsp;accounting,&nbsp;or&nbsp;regulatory&nbsp;requirements.</p><p>When&nbsp;information&nbsp;is&nbsp;no&nbsp;longer&nbsp;required,&nbsp;we&nbsp;may&nbsp;delete&nbsp;it,&nbsp;anonymize&nbsp;it,&nbsp;or&nbsp;securely&nbsp;retain&nbsp;it&nbsp;when&nbsp;retention&nbsp;is&nbsp;legally&nbsp;required.</p><p></p><h2>7.&nbsp;Your&nbsp;Rights</h2><p>Depending&nbsp;on&nbsp;applicable&nbsp;laws,&nbsp;you&nbsp;may&nbsp;have&nbsp;certain&nbsp;rights&nbsp;regarding&nbsp;your&nbsp;personal&nbsp;information,&nbsp;including:</p><ul><li>Requesting&nbsp;access&nbsp;to&nbsp;the&nbsp;personal&nbsp;information&nbsp;we&nbsp;hold&nbsp;about&nbsp;you.</li><li>Requesting&nbsp;correction&nbsp;of&nbsp;inaccurate&nbsp;information.</li><li>Requesting&nbsp;deletion&nbsp;of&nbsp;your&nbsp;information&nbsp;where&nbsp;legally&nbsp;permitted.</li><li>Requesting&nbsp;restriction&nbsp;of&nbsp;or&nbsp;objecting&nbsp;to&nbsp;certain&nbsp;processing&nbsp;activities.</li><li>Withdrawing&nbsp;consent&nbsp;for&nbsp;marketing&nbsp;communications&nbsp;at&nbsp;any&nbsp;time.</li><li>Requesting&nbsp;a&nbsp;copy&nbsp;of&nbsp;certain&nbsp;personal&nbsp;information.</li></ul><p>You&nbsp;may&nbsp;contact&nbsp;us&nbsp;to&nbsp;exercise&nbsp;your&nbsp;rights&nbsp;or&nbsp;ask&nbsp;questions&nbsp;about&nbsp;how&nbsp;we&nbsp;process&nbsp;your&nbsp;information.</p><p></p><h2>8.&nbsp;Marketing&nbsp;Communications</h2><p>If&nbsp;you&nbsp;choose&nbsp;to&nbsp;subscribe&nbsp;to&nbsp;marketing&nbsp;communications,&nbsp;we&nbsp;may&nbsp;send&nbsp;you&nbsp;offers,&nbsp;updates,&nbsp;and&nbsp;news&nbsp;related&nbsp;to&nbsp;our&nbsp;products&nbsp;and&nbsp;services.</p><p>You&nbsp;can&nbsp;unsubscribe&nbsp;from&nbsp;marketing&nbsp;communications&nbsp;at&nbsp;any&nbsp;time&nbsp;by&nbsp;using&nbsp;the&nbsp;unsubscribe&nbsp;link&nbsp;included&nbsp;in&nbsp;our&nbsp;emails&nbsp;or&nbsp;by&nbsp;contacting&nbsp;us.</p><p></p><h2>9.&nbsp;Third-Party&nbsp;Links</h2><p>Our&nbsp;website&nbsp;may&nbsp;contain&nbsp;links&nbsp;to&nbsp;third-party&nbsp;websites&nbsp;or&nbsp;services.</p><p>We&nbsp;are&nbsp;not&nbsp;responsible&nbsp;for&nbsp;the&nbsp;privacy&nbsp;practices&nbsp;or&nbsp;data&nbsp;protection&nbsp;policies&nbsp;of&nbsp;third-party&nbsp;websites.&nbsp;We&nbsp;recommend&nbsp;reviewing&nbsp;the&nbsp;privacy&nbsp;policy&nbsp;of&nbsp;any&nbsp;external&nbsp;website&nbsp;you&nbsp;visit.</p><p></p><h2>10.&nbsp;Children&#39;s&nbsp;Privacy</h2><p>Our&nbsp;services&nbsp;are&nbsp;not&nbsp;primarily&nbsp;directed&nbsp;toward&nbsp;children.&nbsp;We&nbsp;do&nbsp;not&nbsp;knowingly&nbsp;collect&nbsp;personal&nbsp;information&nbsp;from&nbsp;children&nbsp;without&nbsp;an&nbsp;appropriate&nbsp;legal&nbsp;basis&nbsp;or&nbsp;parental&nbsp;consent&nbsp;where&nbsp;required.</p><p>If&nbsp;you&nbsp;believe&nbsp;that&nbsp;personal&nbsp;information&nbsp;belonging&nbsp;to&nbsp;a&nbsp;child&nbsp;has&nbsp;been&nbsp;collected&nbsp;improperly,&nbsp;please&nbsp;contact&nbsp;us&nbsp;so&nbsp;that&nbsp;we&nbsp;can&nbsp;take&nbsp;appropriate&nbsp;action.</p><p></p><h2>11.&nbsp;Changes&nbsp;to&nbsp;This&nbsp;Privacy&nbsp;Policy</h2><p>We&nbsp;may&nbsp;update&nbsp;this&nbsp;Privacy&nbsp;Policy&nbsp;from&nbsp;time&nbsp;to&nbsp;time&nbsp;to&nbsp;reflect&nbsp;changes&nbsp;to&nbsp;our&nbsp;services&nbsp;or&nbsp;applicable&nbsp;legal&nbsp;requirements.</p><p>Any&nbsp;updated&nbsp;version&nbsp;will&nbsp;be&nbsp;published&nbsp;on&nbsp;this&nbsp;page,&nbsp;along&nbsp;with&nbsp;a&nbsp;revised&nbsp;&quot;Last&nbsp;Updated&quot;&nbsp;date.</p><p></p><h2>12.&nbsp;Contact&nbsp;Us</h2><p>If&nbsp;you&nbsp;have&nbsp;any&nbsp;questions&nbsp;or&nbsp;requests&nbsp;regarding&nbsp;this&nbsp;Privacy&nbsp;Policy&nbsp;or&nbsp;your&nbsp;personal&nbsp;information,&nbsp;please&nbsp;contact&nbsp;us:</p><p><strong>Store&nbsp;Name:</strong>&nbsp;[PLUSE]</p><p><strong>Email:</strong>&nbsp;[ahmed.fr1988@gmail.com]</p><p><strong>Phone:</strong>&nbsp;[+201065962515]</p><p><strong>Address:</strong>&nbsp;[Egypt&nbsp;,&nbsp;Cairo]</p>', '2026-09-16 20:35:05.146', '2026-09-16 20:53:58.782'),
('cmu4k7vwm000k116wrvdmjrt4', 'terms_of_use_title_ar', 'شروط الاستخدام ', '2026-09-16 20:35:05.159', '2026-09-16 20:53:58.788'),
('cmu4k7vwt000l116wmn0kbil0', 'terms_of_use_title_en', 'Terms of Use', '2026-09-16 20:35:05.165', '2026-09-16 20:53:58.797'),
('cmu4k7vx7000m116wt2er7gxm', 'terms_of_use_ar', '<p><strong>آخر&nbsp;تحديث:&nbsp;[التاريخ]</strong></p><p>مرحبًا&nbsp;بك&nbsp;في&nbsp;<strong>[اسم&nbsp;المتجر]</strong>.&nbsp;تحكم&nbsp;شروط&nbsp;الاستخدام&nbsp;هذه&nbsp;استخدامك&nbsp;لموقعنا&nbsp;الإلكتروني&nbsp;وخدماتنا&nbsp;وعمليات&nbsp;الشراء&nbsp;التي&nbsp;تتم&nbsp;من&nbsp;خلاله.</p><p>باستخدام&nbsp;الموقع&nbsp;أو&nbsp;إنشاء&nbsp;حساب&nbsp;أو&nbsp;إجراء&nbsp;عملية&nbsp;شراء،&nbsp;فإنك&nbsp;تقر&nbsp;بأنك&nbsp;قرأت&nbsp;هذه&nbsp;الشروط&nbsp;ووافقت&nbsp;على&nbsp;الالتزام&nbsp;بها.&nbsp;إذا&nbsp;كنت&nbsp;لا&nbsp;توافق&nbsp;على&nbsp;أي&nbsp;جزء&nbsp;من&nbsp;هذه&nbsp;الشروط،&nbsp;يرجى&nbsp;عدم&nbsp;استخدام&nbsp;الموقع.</p><h2>1.&nbsp;استخدام&nbsp;الموقع</h2><p>يُسمح&nbsp;لك&nbsp;باستخدام&nbsp;الموقع&nbsp;للأغراض&nbsp;القانونية&nbsp;والمشروعة&nbsp;فقط.</p><p>أنت&nbsp;توافق&nbsp;على&nbsp;عدم:</p><ul><li>استخدام&nbsp;الموقع&nbsp;بطريقة&nbsp;تخالف&nbsp;القوانين&nbsp;أو&nbsp;اللوائح&nbsp;المعمول&nbsp;بها.</li><li>محاولة&nbsp;الوصول&nbsp;غير&nbsp;المصرح&nbsp;به&nbsp;إلى&nbsp;أنظمة&nbsp;الموقع&nbsp;أو&nbsp;حسابات&nbsp;المستخدمين&nbsp;الآخرين.</li><li>تعطيل&nbsp;أو&nbsp;إتلاف&nbsp;الموقع&nbsp;أو&nbsp;التأثير&nbsp;على&nbsp;أدائه.</li><li>استخدام&nbsp;الموقع&nbsp;لأغراض&nbsp;احتيالية&nbsp;أو&nbsp;مضللة.</li><li>نسخ&nbsp;أو&nbsp;إعادة&nbsp;إنتاج&nbsp;محتوى&nbsp;الموقع&nbsp;دون&nbsp;الحصول&nbsp;على&nbsp;إذن&nbsp;مسبق.</li><li>استخدام&nbsp;أي&nbsp;أدوات&nbsp;آلية&nbsp;لجمع&nbsp;البيانات&nbsp;من&nbsp;الموقع&nbsp;بطريقة&nbsp;غير&nbsp;مصرح&nbsp;بها.</li></ul><h2>2.&nbsp;إنشاء&nbsp;الحساب</h2><p>قد&nbsp;تتطلب&nbsp;بعض&nbsp;خدمات&nbsp;الموقع&nbsp;إنشاء&nbsp;حساب&nbsp;مستخدم.</p><p>عند&nbsp;إنشاء&nbsp;حساب،&nbsp;فإنك&nbsp;توافق&nbsp;على:</p><ul><li>تقديم&nbsp;معلومات&nbsp;صحيحة&nbsp;ودقيقة.</li><li>تحديث&nbsp;معلوماتك&nbsp;عند&nbsp;الحاجة.</li><li>الحفاظ&nbsp;على&nbsp;سرية&nbsp;بيانات&nbsp;تسجيل&nbsp;الدخول&nbsp;الخاصة&nbsp;بك.</li><li>تحمل&nbsp;مسؤولية&nbsp;الأنشطة&nbsp;التي&nbsp;تتم&nbsp;من&nbsp;خلال&nbsp;حسابك.</li><li>إبلاغنا&nbsp;فورًا&nbsp;في&nbsp;حال&nbsp;اكتشاف&nbsp;استخدام&nbsp;غير&nbsp;مصرح&nbsp;به&nbsp;لحسابك.</li></ul><p>نحتفظ&nbsp;بالحق&nbsp;في&nbsp;تعليق&nbsp;أو&nbsp;إلغاء&nbsp;أي&nbsp;حساب&nbsp;يخالف&nbsp;هذه&nbsp;الشروط&nbsp;أو&nbsp;يتم&nbsp;استخدامه&nbsp;بطريقة&nbsp;غير&nbsp;قانونية&nbsp;أو&nbsp;احتيالية.</p><h2>3.&nbsp;المنتجات&nbsp;والأسعار</h2><p>نبذل&nbsp;قصارى&nbsp;جهدنا&nbsp;لعرض&nbsp;المنتجات&nbsp;والمعلومات&nbsp;والأسعار&nbsp;بطريقة&nbsp;دقيقة.</p><p>ومع&nbsp;ذلك،&nbsp;قد&nbsp;تحدث&nbsp;أخطاء&nbsp;غير&nbsp;مقصودة&nbsp;في&nbsp;وصف&nbsp;المنتجات&nbsp;أو&nbsp;الأسعار&nbsp;أو&nbsp;توفر&nbsp;المخزون.</p><p>نحتفظ&nbsp;بالحق&nbsp;في:</p><ul><li>تصحيح&nbsp;الأخطاء&nbsp;في&nbsp;الأسعار&nbsp;أو&nbsp;معلومات&nbsp;المنتجات.</li><li>تحديث&nbsp;أو&nbsp;تغيير&nbsp;المنتجات&nbsp;المتاحة.</li><li>تعديل&nbsp;الأسعار&nbsp;في&nbsp;أي&nbsp;وقت.</li><li>إلغاء&nbsp;الطلبات&nbsp;التي&nbsp;تم&nbsp;إنشاؤها&nbsp;نتيجة&nbsp;خطأ&nbsp;واضح&nbsp;في&nbsp;السعر&nbsp;أو&nbsp;المعلومات.</li></ul><p>في&nbsp;حال&nbsp;إلغاء&nbsp;طلب&nbsp;بعد&nbsp;الدفع،&nbsp;سيتم&nbsp;التعامل&nbsp;مع&nbsp;المبلغ&nbsp;المدفوع&nbsp;وفقًا&nbsp;لسياسة&nbsp;الاسترداد&nbsp;وطريقة&nbsp;الدفع&nbsp;المستخدمة.</p><h2>4.&nbsp;الطلبات&nbsp;والشراء</h2><p>عند&nbsp;تقديم&nbsp;طلب&nbsp;من&nbsp;خلال&nbsp;الموقع،&nbsp;فإنك&nbsp;تقدم&nbsp;طلبًا&nbsp;لشراء&nbsp;المنتجات&nbsp;المحددة&nbsp;في&nbsp;طلبك.</p><p>استلام&nbsp;تأكيد&nbsp;الطلب&nbsp;لا&nbsp;يعني&nbsp;بالضرورة&nbsp;أن&nbsp;الطلب&nbsp;قد&nbsp;تم&nbsp;قبوله&nbsp;نهائيًا.&nbsp;قد&nbsp;نقوم&nbsp;بمراجعة&nbsp;الطلب&nbsp;أو&nbsp;رفضه&nbsp;أو&nbsp;إلغائه&nbsp;في&nbsp;بعض&nbsp;الحالات،&nbsp;مثل:</p><ul><li>عدم&nbsp;توفر&nbsp;المنتج.</li><li>وجود&nbsp;خطأ&nbsp;واضح&nbsp;في&nbsp;السعر&nbsp;أو&nbsp;معلومات&nbsp;المنتج.</li><li>الاشتباه&nbsp;في&nbsp;وجود&nbsp;نشاط&nbsp;احتيالي.</li><li>وجود&nbsp;مشكلة&nbsp;في&nbsp;معلومات&nbsp;الدفع&nbsp;أو&nbsp;الشحن.</li><li>وجود&nbsp;أسباب&nbsp;قانونية&nbsp;أو&nbsp;تشغيلية&nbsp;تمنع&nbsp;تنفيذ&nbsp;الطلب.</li></ul><p>في&nbsp;حالة&nbsp;إلغاء&nbsp;الطلب&nbsp;بعد&nbsp;الدفع،&nbsp;سيتم&nbsp;رد&nbsp;المبلغ&nbsp;وفقًا&nbsp;للإجراءات&nbsp;المعمول&nbsp;بها.</p><h2>5.&nbsp;الدفع</h2><p>يجب&nbsp;تقديم&nbsp;معلومات&nbsp;دفع&nbsp;صحيحة&nbsp;وصالحة&nbsp;عند&nbsp;إجراء&nbsp;عملية&nbsp;الشراء.</p><p>قد&nbsp;تتم&nbsp;معالجة&nbsp;المدفوعات&nbsp;من&nbsp;خلال&nbsp;مزودي&nbsp;خدمات&nbsp;دفع&nbsp;خارجيين.&nbsp;وتخضع&nbsp;عمليات&nbsp;الدفع&nbsp;أيضًا&nbsp;لشروط&nbsp;وسياسات&nbsp;مزود&nbsp;الدفع&nbsp;المستخدم.</p><p>نحن&nbsp;لا&nbsp;نتحمل&nbsp;مسؤولية&nbsp;أي&nbsp;مشكلة&nbsp;ناتجة&nbsp;مباشرة&nbsp;عن&nbsp;أنظمة&nbsp;أو&nbsp;خدمات&nbsp;مزود&nbsp;الدفع&nbsp;الخارجي،&nbsp;مع&nbsp;التزامنا&nbsp;بالتعاون&nbsp;لمعالجة&nbsp;أي&nbsp;مشكلة&nbsp;متعلقة&nbsp;بالطلب.</p><h2>6.&nbsp;الشحن&nbsp;والتوصيل</h2><p>نقوم&nbsp;بتوصيل&nbsp;الطلبات&nbsp;إلى&nbsp;عناوين&nbsp;الشحن&nbsp;التي&nbsp;يقدمها&nbsp;العميل&nbsp;أثناء&nbsp;عملية&nbsp;الشراء.</p><p>قد&nbsp;تختلف&nbsp;مدة&nbsp;التوصيل&nbsp;حسب:</p><ul><li>موقع&nbsp;العميل.</li><li>شركة&nbsp;الشحن.</li><li>توفر&nbsp;المنتج.</li><li>الظروف&nbsp;التشغيلية&nbsp;أو&nbsp;اللوجستية.</li><li>العطلات&nbsp;أو&nbsp;الظروف&nbsp;الخارجة&nbsp;عن&nbsp;السيطرة.</li></ul><p>يجب&nbsp;على&nbsp;العميل&nbsp;التأكد&nbsp;من&nbsp;صحة&nbsp;عنوان&nbsp;ورقم&nbsp;الهاتف&nbsp;المستخدمين&nbsp;في&nbsp;الطلب.</p><p>قد&nbsp;تحدث&nbsp;تأخيرات&nbsp;خارجة&nbsp;عن&nbsp;سيطرتنا،&nbsp;ولا&nbsp;نضمن&nbsp;موعدًا&nbsp;محددًا&nbsp;للتوصيل&nbsp;إلا&nbsp;إذا&nbsp;تم&nbsp;ذكر&nbsp;ذلك&nbsp;صراحة.</p><h2>7.&nbsp;الإلغاء&nbsp;والاسترجاع&nbsp;والاسترداد</h2><p>تخضع&nbsp;عمليات&nbsp;إلغاء&nbsp;الطلبات&nbsp;واسترجاع&nbsp;المنتجات&nbsp;واسترداد&nbsp;الأموال&nbsp;إلى&nbsp;<strong>سياسة&nbsp;الإرجاع&nbsp;والاسترداد</strong>&nbsp;الخاصة&nbsp;بالمتجر.</p><p>يمكن&nbsp;الاطلاع&nbsp;على&nbsp;الشروط&nbsp;والإجراءات&nbsp;الخاصة&nbsp;بالإرجاع&nbsp;والاسترداد&nbsp;من&nbsp;خلال&nbsp;الصفحة&nbsp;المخصصة&nbsp;لذلك.</p><h2>8.&nbsp;الملكية&nbsp;الفكرية</h2><p>جميع&nbsp;المحتويات&nbsp;الموجودة&nbsp;على&nbsp;الموقع،&nbsp;بما&nbsp;في&nbsp;ذلك&nbsp;على&nbsp;سبيل&nbsp;المثال&nbsp;لا&nbsp;الحصر:</p><ul><li>النصوص.</li><li>الصور.</li><li>الشعارات.</li><li>التصميمات.</li><li>الرسومات.</li><li>الأيقونات.</li><li>أسماء&nbsp;المنتجات&nbsp;والعلامات&nbsp;التجارية.</li><li>البرمجيات.</li><li>الأكواد&nbsp;والمكونات&nbsp;التقنية.</li></ul><p>تظل&nbsp;مملوكة&nbsp;لـ&nbsp;<strong>[اسم&nbsp;المتجر]</strong>&nbsp;أو&nbsp;لأصحاب&nbsp;الحقوق&nbsp;المعنيين،&nbsp;ولا&nbsp;يجوز&nbsp;نسخها&nbsp;أو&nbsp;تعديلها&nbsp;أو&nbsp;توزيعها&nbsp;أو&nbsp;استخدامها&nbsp;تجاريًا&nbsp;دون&nbsp;الحصول&nbsp;على&nbsp;إذن&nbsp;مسبق،&nbsp;ما&nbsp;لم&nbsp;يسمح&nbsp;القانون&nbsp;بذلك.</p><h2>9.&nbsp;محتوى&nbsp;المستخدم</h2><p>إذا&nbsp;كان&nbsp;الموقع&nbsp;يسمح&nbsp;للمستخدمين&nbsp;بإضافة&nbsp;تقييمات&nbsp;أو&nbsp;تعليقات&nbsp;أو&nbsp;محتوى&nbsp;آخر،&nbsp;فإنك&nbsp;تتحمل&nbsp;مسؤولية&nbsp;المحتوى&nbsp;الذي&nbsp;تنشره.</p><p>يجب&nbsp;ألا&nbsp;يحتوي&nbsp;المحتوى&nbsp;على:</p><ul><li>معلومات&nbsp;مضللة&nbsp;أو&nbsp;احتيالية.</li><li>محتوى&nbsp;مسيء&nbsp;أو&nbsp;غير&nbsp;قانوني.</li><li>انتهاك&nbsp;لحقوق&nbsp;الآخرين.</li><li>معلومات&nbsp;شخصية&nbsp;حساسة&nbsp;لأشخاص&nbsp;آخرين.</li><li>مواد&nbsp;محمية&nbsp;بحقوق&nbsp;الملكية&nbsp;الفكرية&nbsp;دون&nbsp;تصريح.</li></ul><p>نحتفظ&nbsp;بالحق&nbsp;في&nbsp;إزالة&nbsp;أي&nbsp;محتوى&nbsp;يخالف&nbsp;هذه&nbsp;الشروط&nbsp;أو&nbsp;القوانين&nbsp;المعمول&nbsp;بها.</p><h2>10.&nbsp;روابط&nbsp;الجهات&nbsp;الخارجية</h2><p>قد&nbsp;يحتوي&nbsp;الموقع&nbsp;على&nbsp;روابط&nbsp;أو&nbsp;خدمات&nbsp;مقدمة&nbsp;من&nbsp;جهات&nbsp;خارجية.</p><p>هذه&nbsp;الروابط&nbsp;مقدمة&nbsp;لراحتك،&nbsp;ولا&nbsp;نتحمل&nbsp;مسؤولية&nbsp;محتوى&nbsp;أو&nbsp;سياسات&nbsp;أو&nbsp;ممارسات&nbsp;المواقع&nbsp;والخدمات&nbsp;التابعة&nbsp;لأطراف&nbsp;أخرى.</p><h2>11.&nbsp;توفر&nbsp;الموقع</h2><p>نسعى&nbsp;إلى&nbsp;الحفاظ&nbsp;على&nbsp;توفر&nbsp;الموقع&nbsp;وتشغيله&nbsp;بشكل&nbsp;مستمر،&nbsp;ولكن&nbsp;لا&nbsp;نضمن&nbsp;أن&nbsp;الموقع&nbsp;سيعمل&nbsp;دون&nbsp;انقطاع&nbsp;أو&nbsp;أخطاء.</p><p>قد&nbsp;نقوم&nbsp;بتعليق&nbsp;الموقع&nbsp;مؤقتًا&nbsp;لأغراض&nbsp;الصيانة&nbsp;أو&nbsp;التحديث&nbsp;أو&nbsp;لأسباب&nbsp;أمنية&nbsp;أو&nbsp;تقنية.</p><h2>12.&nbsp;حدود&nbsp;المسؤولية</h2><p>إلى&nbsp;الحد&nbsp;الذي&nbsp;يسمح&nbsp;به&nbsp;القانون&nbsp;المعمول&nbsp;به،&nbsp;لا&nbsp;نتحمل&nbsp;مسؤولية&nbsp;الأضرار&nbsp;الناتجة&nbsp;عن:</p><ul><li>سوء&nbsp;استخدام&nbsp;الموقع.</li><li>عدم&nbsp;القدرة&nbsp;على&nbsp;الوصول&nbsp;إلى&nbsp;الموقع&nbsp;بسبب&nbsp;ظروف&nbsp;خارجة&nbsp;عن&nbsp;سيطرتنا.</li><li>تأخير&nbsp;شركات&nbsp;الشحن&nbsp;أو&nbsp;مزودي&nbsp;الخدمات&nbsp;الخارجيين.</li><li>أخطاء&nbsp;ناتجة&nbsp;عن&nbsp;معلومات&nbsp;غير&nbsp;صحيحة&nbsp;قدمها&nbsp;العميل.</li><li>أي&nbsp;أحداث&nbsp;خارجة&nbsp;عن&nbsp;سيطرتنا&nbsp;المعقولة.</li></ul><p>ولا&nbsp;تؤثر&nbsp;هذه&nbsp;الشروط&nbsp;على&nbsp;أي&nbsp;حقوق&nbsp;قانونية&nbsp;لا&nbsp;يجوز&nbsp;استبعادها&nbsp;أو&nbsp;تقييدها&nbsp;بموجب&nbsp;القانون.</p><h2>13.&nbsp;التعديلات&nbsp;على&nbsp;الشروط</h2><p>قد&nbsp;نقوم&nbsp;بتعديل&nbsp;شروط&nbsp;الاستخدام&nbsp;من&nbsp;وقت&nbsp;لآخر.</p><p>سيتم&nbsp;نشر&nbsp;النسخة&nbsp;المحدثة&nbsp;على&nbsp;هذه&nbsp;الصفحة&nbsp;مع&nbsp;تعديل&nbsp;تاريخ&nbsp;&quot;آخر&nbsp;تحديث&quot;.</p><p>استمرارك&nbsp;في&nbsp;استخدام&nbsp;الموقع&nbsp;بعد&nbsp;نشر&nbsp;التعديلات&nbsp;يعني&nbsp;قبولك&nbsp;للشروط&nbsp;المحدثة،&nbsp;بالقدر&nbsp;الذي&nbsp;يسمح&nbsp;به&nbsp;القانون.</p><h2>14.&nbsp;القانون&nbsp;المعمول&nbsp;به</h2><p>تخضع&nbsp;شروط&nbsp;الاستخدام&nbsp;هذه&nbsp;للقوانين&nbsp;واللوائح&nbsp;المعمول&nbsp;بها&nbsp;في&nbsp;<strong>[الدولة]</strong>.</p><p>وأي&nbsp;نزاع&nbsp;يتعلق&nbsp;باستخدام&nbsp;الموقع&nbsp;أو&nbsp;خدماته&nbsp;يخضع&nbsp;للجهات&nbsp;القضائية&nbsp;المختصة&nbsp;وفقًا&nbsp;للقانون&nbsp;المعمول&nbsp;به.</p><h2>15.&nbsp;التواصل&nbsp;معنا</h2><p>إذا&nbsp;كانت&nbsp;لديك&nbsp;أي&nbsp;أسئلة&nbsp;حول&nbsp;شروط&nbsp;الاستخدام،&nbsp;يمكنك&nbsp;التواصل&nbsp;معنا&nbsp;من&nbsp;خلال:</p><p><strong>اسم&nbsp;المتجر:</strong>&nbsp;[اسم&nbsp;المتجر]</p><p><strong>البريد&nbsp;الإلكتروني:</strong>&nbsp;[البريد&nbsp;الإلكتروني]</p><p><strong>رقم&nbsp;الهاتف:</strong>&nbsp;[رقم&nbsp;الهاتف]</p><p><strong>العنوان:</strong>&nbsp;[العنوان]</p>', '2026-09-16 20:35:05.179', '2026-09-16 20:53:58.805'),
('cmu4k7vxf000n116wydqd7lyy', 'terms_of_use_en', '<p><strong>Last&nbsp;Updated:&nbsp;[Date]</strong></p><p>Welcome&nbsp;to&nbsp;<strong>[Store&nbsp;Name]</strong>.&nbsp;These&nbsp;Terms&nbsp;of&nbsp;Use&nbsp;govern&nbsp;your&nbsp;use&nbsp;of&nbsp;our&nbsp;website,&nbsp;services,&nbsp;and&nbsp;purchases&nbsp;made&nbsp;through&nbsp;our&nbsp;online&nbsp;store.</p><p>By&nbsp;accessing&nbsp;the&nbsp;website,&nbsp;creating&nbsp;an&nbsp;account,&nbsp;or&nbsp;placing&nbsp;an&nbsp;order,&nbsp;you&nbsp;acknowledge&nbsp;that&nbsp;you&nbsp;have&nbsp;read&nbsp;and&nbsp;agreed&nbsp;to&nbsp;these&nbsp;Terms&nbsp;of&nbsp;Use.&nbsp;If&nbsp;you&nbsp;do&nbsp;not&nbsp;agree&nbsp;with&nbsp;any&nbsp;part&nbsp;of&nbsp;these&nbsp;terms,&nbsp;please&nbsp;do&nbsp;not&nbsp;use&nbsp;our&nbsp;website.</p><h2>1.&nbsp;Use&nbsp;of&nbsp;the&nbsp;Website</h2><p>You&nbsp;may&nbsp;use&nbsp;our&nbsp;website&nbsp;only&nbsp;for&nbsp;lawful&nbsp;and&nbsp;legitimate&nbsp;purposes.</p><p>You&nbsp;agree&nbsp;not&nbsp;to:</p><ul><li>Use&nbsp;the&nbsp;website&nbsp;in&nbsp;violation&nbsp;of&nbsp;applicable&nbsp;laws&nbsp;or&nbsp;regulations.</li><li>Attempt&nbsp;to&nbsp;gain&nbsp;unauthorized&nbsp;access&nbsp;to&nbsp;our&nbsp;systems&nbsp;or&nbsp;other&nbsp;users&#39;&nbsp;accounts.</li><li>Disrupt,&nbsp;damage,&nbsp;or&nbsp;interfere&nbsp;with&nbsp;the&nbsp;operation&nbsp;or&nbsp;security&nbsp;of&nbsp;the&nbsp;website.</li><li>Use&nbsp;the&nbsp;website&nbsp;for&nbsp;fraudulent&nbsp;or&nbsp;misleading&nbsp;purposes.</li><li>Copy&nbsp;or&nbsp;reproduce&nbsp;website&nbsp;content&nbsp;without&nbsp;prior&nbsp;permission.</li><li>Use&nbsp;automated&nbsp;tools&nbsp;to&nbsp;collect&nbsp;data&nbsp;from&nbsp;the&nbsp;website&nbsp;without&nbsp;authorization.</li></ul><h2>2.&nbsp;User&nbsp;Accounts</h2><p>Some&nbsp;website&nbsp;services&nbsp;may&nbsp;require&nbsp;you&nbsp;to&nbsp;create&nbsp;a&nbsp;user&nbsp;account.</p><p>When&nbsp;creating&nbsp;an&nbsp;account,&nbsp;you&nbsp;agree&nbsp;to:</p><ul><li>Provide&nbsp;accurate&nbsp;and&nbsp;truthful&nbsp;information.</li><li>Keep&nbsp;your&nbsp;information&nbsp;up&nbsp;to&nbsp;date.</li><li>Keep&nbsp;your&nbsp;login&nbsp;credentials&nbsp;confidential.</li><li>Accept&nbsp;responsibility&nbsp;for&nbsp;activities&nbsp;conducted&nbsp;through&nbsp;your&nbsp;account.</li><li>Notify&nbsp;us&nbsp;immediately&nbsp;if&nbsp;you&nbsp;believe&nbsp;your&nbsp;account&nbsp;has&nbsp;been&nbsp;accessed&nbsp;without&nbsp;authorization.</li></ul><p>We&nbsp;reserve&nbsp;the&nbsp;right&nbsp;to&nbsp;suspend&nbsp;or&nbsp;terminate&nbsp;accounts&nbsp;that&nbsp;violate&nbsp;these&nbsp;Terms&nbsp;or&nbsp;are&nbsp;used&nbsp;for&nbsp;unlawful&nbsp;or&nbsp;fraudulent&nbsp;activities.</p><h2>3.&nbsp;Products&nbsp;and&nbsp;Prices</h2><p>We&nbsp;make&nbsp;reasonable&nbsp;efforts&nbsp;to&nbsp;ensure&nbsp;that&nbsp;product&nbsp;descriptions,&nbsp;images,&nbsp;prices,&nbsp;and&nbsp;availability&nbsp;are&nbsp;accurate.</p><p>However,&nbsp;unintended&nbsp;errors&nbsp;may&nbsp;occasionally&nbsp;occur.</p><p>We&nbsp;reserve&nbsp;the&nbsp;right&nbsp;to:</p><ul><li>Correct&nbsp;errors&nbsp;in&nbsp;prices&nbsp;or&nbsp;product&nbsp;information.</li><li>Update&nbsp;or&nbsp;modify&nbsp;available&nbsp;products.</li><li>Change&nbsp;prices&nbsp;at&nbsp;any&nbsp;time.</li><li>Cancel&nbsp;orders&nbsp;resulting&nbsp;from&nbsp;an&nbsp;obvious&nbsp;pricing&nbsp;or&nbsp;product&nbsp;information&nbsp;error.</li></ul><p>If&nbsp;an&nbsp;order&nbsp;is&nbsp;cancelled&nbsp;after&nbsp;payment&nbsp;has&nbsp;been&nbsp;made,&nbsp;the&nbsp;amount&nbsp;paid&nbsp;will&nbsp;be&nbsp;handled&nbsp;in&nbsp;accordance&nbsp;with&nbsp;our&nbsp;Refund&nbsp;Policy&nbsp;and&nbsp;the&nbsp;applicable&nbsp;payment&nbsp;method.</p><h2>4.&nbsp;Orders&nbsp;and&nbsp;Purchases</h2><p>When&nbsp;you&nbsp;place&nbsp;an&nbsp;order&nbsp;through&nbsp;our&nbsp;website,&nbsp;you&nbsp;are&nbsp;submitting&nbsp;a&nbsp;request&nbsp;to&nbsp;purchase&nbsp;the&nbsp;products&nbsp;listed&nbsp;in&nbsp;your&nbsp;order.</p><p>Receiving&nbsp;an&nbsp;order&nbsp;confirmation&nbsp;does&nbsp;not&nbsp;necessarily&nbsp;mean&nbsp;that&nbsp;your&nbsp;order&nbsp;has&nbsp;been&nbsp;finally&nbsp;accepted.&nbsp;We&nbsp;may&nbsp;review,&nbsp;reject,&nbsp;or&nbsp;cancel&nbsp;an&nbsp;order&nbsp;in&nbsp;certain&nbsp;circumstances,&nbsp;including:</p><ul><li>Product&nbsp;unavailability.</li><li>An&nbsp;obvious&nbsp;pricing&nbsp;or&nbsp;product&nbsp;information&nbsp;error.</li><li>Suspected&nbsp;fraudulent&nbsp;activity.</li><li>Payment&nbsp;or&nbsp;shipping&nbsp;issues.</li><li>Legal&nbsp;or&nbsp;operational&nbsp;reasons&nbsp;that&nbsp;prevent&nbsp;us&nbsp;from&nbsp;fulfilling&nbsp;the&nbsp;order.</li></ul><p>If&nbsp;an&nbsp;order&nbsp;is&nbsp;cancelled&nbsp;after&nbsp;payment,&nbsp;the&nbsp;applicable&nbsp;refund&nbsp;procedures&nbsp;will&nbsp;be&nbsp;followed.</p><h2>5.&nbsp;Payments</h2><p>You&nbsp;must&nbsp;provide&nbsp;valid&nbsp;and&nbsp;accurate&nbsp;payment&nbsp;information&nbsp;when&nbsp;placing&nbsp;an&nbsp;order.</p><p>Payments&nbsp;may&nbsp;be&nbsp;processed&nbsp;through&nbsp;third-party&nbsp;payment&nbsp;providers&nbsp;and&nbsp;may&nbsp;also&nbsp;be&nbsp;subject&nbsp;to&nbsp;the&nbsp;terms&nbsp;and&nbsp;policies&nbsp;of&nbsp;the&nbsp;applicable&nbsp;payment&nbsp;provider.</p><p>We&nbsp;are&nbsp;not&nbsp;responsible&nbsp;for&nbsp;issues&nbsp;directly&nbsp;caused&nbsp;by&nbsp;the&nbsp;systems&nbsp;or&nbsp;services&nbsp;of&nbsp;third-party&nbsp;payment&nbsp;providers,&nbsp;while&nbsp;we&nbsp;will&nbsp;reasonably&nbsp;cooperate&nbsp;to&nbsp;help&nbsp;resolve&nbsp;order-related&nbsp;issues.</p><h2>6.&nbsp;Shipping&nbsp;and&nbsp;Delivery</h2><p>Orders&nbsp;will&nbsp;be&nbsp;delivered&nbsp;to&nbsp;the&nbsp;shipping&nbsp;address&nbsp;provided&nbsp;by&nbsp;the&nbsp;customer&nbsp;during&nbsp;checkout.</p><p>Delivery&nbsp;times&nbsp;may&nbsp;vary&nbsp;depending&nbsp;on:</p><ul><li>Customer&nbsp;location.</li><li>Shipping&nbsp;provider.</li><li>Product&nbsp;availability.</li><li>Operational&nbsp;or&nbsp;logistical&nbsp;circumstances.</li><li>Holidays&nbsp;or&nbsp;circumstances&nbsp;beyond&nbsp;our&nbsp;reasonable&nbsp;control.</li></ul><p>Customers&nbsp;are&nbsp;responsible&nbsp;for&nbsp;providing&nbsp;accurate&nbsp;shipping&nbsp;addresses&nbsp;and&nbsp;contact&nbsp;information.</p><p>Delivery&nbsp;delays&nbsp;may&nbsp;occur&nbsp;due&nbsp;to&nbsp;circumstances&nbsp;beyond&nbsp;our&nbsp;control,&nbsp;and&nbsp;we&nbsp;do&nbsp;not&nbsp;guarantee&nbsp;a&nbsp;specific&nbsp;delivery&nbsp;date&nbsp;unless&nbsp;expressly&nbsp;stated.</p><h2>7.&nbsp;Cancellation,&nbsp;Returns,&nbsp;and&nbsp;Refunds</h2><p>Order&nbsp;cancellations,&nbsp;product&nbsp;returns,&nbsp;and&nbsp;refunds&nbsp;are&nbsp;subject&nbsp;to&nbsp;our&nbsp;<strong>Return&nbsp;and&nbsp;Refund&nbsp;Policy</strong>.</p><p>Please&nbsp;refer&nbsp;to&nbsp;the&nbsp;dedicated&nbsp;Return&nbsp;and&nbsp;Refund&nbsp;Policy&nbsp;page&nbsp;for&nbsp;applicable&nbsp;conditions&nbsp;and&nbsp;procedures.</p><h2>8.&nbsp;Intellectual&nbsp;Property</h2><p>All&nbsp;content&nbsp;available&nbsp;on&nbsp;our&nbsp;website,&nbsp;including&nbsp;but&nbsp;not&nbsp;limited&nbsp;to:</p><ul><li>Text.</li><li>Images.</li><li>Logos.</li><li>Designs.</li><li>Graphics.</li><li>Icons.</li><li>Product&nbsp;names&nbsp;and&nbsp;trademarks.</li><li>Software.</li><li>Code&nbsp;and&nbsp;technical&nbsp;components.</li></ul><p>is&nbsp;owned&nbsp;by&nbsp;<strong>[Store&nbsp;Name]</strong>&nbsp;or&nbsp;the&nbsp;respective&nbsp;rights&nbsp;holders&nbsp;and&nbsp;may&nbsp;not&nbsp;be&nbsp;copied,&nbsp;modified,&nbsp;distributed,&nbsp;or&nbsp;commercially&nbsp;used&nbsp;without&nbsp;prior&nbsp;permission,&nbsp;unless&nbsp;otherwise&nbsp;permitted&nbsp;by&nbsp;applicable&nbsp;law.</p><h2>9.&nbsp;User-Generated&nbsp;Content</h2><p>If&nbsp;our&nbsp;website&nbsp;allows&nbsp;users&nbsp;to&nbsp;submit&nbsp;reviews,&nbsp;comments,&nbsp;or&nbsp;other&nbsp;content,&nbsp;you&nbsp;are&nbsp;responsible&nbsp;for&nbsp;the&nbsp;content&nbsp;you&nbsp;submit.</p><p>Content&nbsp;must&nbsp;not&nbsp;contain:</p><ul><li>Misleading&nbsp;or&nbsp;fraudulent&nbsp;information.</li><li>Abusive&nbsp;or&nbsp;unlawful&nbsp;material.</li><li>Content&nbsp;that&nbsp;infringes&nbsp;the&nbsp;rights&nbsp;of&nbsp;others.</li><li>Sensitive&nbsp;personal&nbsp;information&nbsp;belonging&nbsp;to&nbsp;other&nbsp;individuals.</li><li>Copyrighted&nbsp;or&nbsp;protected&nbsp;material&nbsp;without&nbsp;authorization.</li></ul><p>We&nbsp;reserve&nbsp;the&nbsp;right&nbsp;to&nbsp;remove&nbsp;content&nbsp;that&nbsp;violates&nbsp;these&nbsp;Terms&nbsp;or&nbsp;applicable&nbsp;laws.</p><h2>10.&nbsp;Third-Party&nbsp;Links</h2><p>Our&nbsp;website&nbsp;may&nbsp;contain&nbsp;links&nbsp;to&nbsp;third-party&nbsp;websites&nbsp;or&nbsp;services.</p><p>These&nbsp;links&nbsp;are&nbsp;provided&nbsp;for&nbsp;convenience,&nbsp;and&nbsp;we&nbsp;are&nbsp;not&nbsp;responsible&nbsp;for&nbsp;the&nbsp;content,&nbsp;policies,&nbsp;or&nbsp;practices&nbsp;of&nbsp;third-party&nbsp;websites&nbsp;or&nbsp;services.</p><h2>11.&nbsp;Website&nbsp;Availability</h2><p>We&nbsp;make&nbsp;reasonable&nbsp;efforts&nbsp;to&nbsp;keep&nbsp;our&nbsp;website&nbsp;available&nbsp;and&nbsp;functioning&nbsp;properly,&nbsp;but&nbsp;we&nbsp;do&nbsp;not&nbsp;guarantee&nbsp;that&nbsp;the&nbsp;website&nbsp;will&nbsp;always&nbsp;operate&nbsp;without&nbsp;interruptions&nbsp;or&nbsp;errors.</p><p>We&nbsp;may&nbsp;temporarily&nbsp;suspend&nbsp;the&nbsp;website&nbsp;for&nbsp;maintenance,&nbsp;updates,&nbsp;security,&nbsp;technical&nbsp;reasons,&nbsp;or&nbsp;other&nbsp;operational&nbsp;purposes.</p><h2>12.&nbsp;Limitation&nbsp;of&nbsp;Liability</h2><p>To&nbsp;the&nbsp;extent&nbsp;permitted&nbsp;by&nbsp;applicable&nbsp;law,&nbsp;we&nbsp;are&nbsp;not&nbsp;responsible&nbsp;for&nbsp;damages&nbsp;resulting&nbsp;from:</p><ul><li>Misuse&nbsp;of&nbsp;the&nbsp;website.</li><li>Inability&nbsp;to&nbsp;access&nbsp;the&nbsp;website&nbsp;due&nbsp;to&nbsp;circumstances&nbsp;beyond&nbsp;our&nbsp;control.</li><li>Delays&nbsp;caused&nbsp;by&nbsp;shipping&nbsp;companies&nbsp;or&nbsp;third-party&nbsp;service&nbsp;providers.</li><li>Errors&nbsp;resulting&nbsp;from&nbsp;incorrect&nbsp;information&nbsp;provided&nbsp;by&nbsp;the&nbsp;customer.</li><li>Events&nbsp;beyond&nbsp;our&nbsp;reasonable&nbsp;control.</li></ul><p>Nothing&nbsp;in&nbsp;these&nbsp;Terms&nbsp;limits&nbsp;or&nbsp;excludes&nbsp;any&nbsp;legal&nbsp;rights&nbsp;that&nbsp;cannot&nbsp;be&nbsp;excluded&nbsp;or&nbsp;limited&nbsp;under&nbsp;applicable&nbsp;law.</p><h2>13.&nbsp;Changes&nbsp;to&nbsp;These&nbsp;Terms</h2><p>We&nbsp;may&nbsp;update&nbsp;these&nbsp;Terms&nbsp;of&nbsp;Use&nbsp;from&nbsp;time&nbsp;to&nbsp;time.</p><p>Any&nbsp;updated&nbsp;version&nbsp;will&nbsp;be&nbsp;published&nbsp;on&nbsp;this&nbsp;page&nbsp;along&nbsp;with&nbsp;a&nbsp;revised&nbsp;&quot;Last&nbsp;Updated&quot;&nbsp;date.</p><p>Your&nbsp;continued&nbsp;use&nbsp;of&nbsp;the&nbsp;website&nbsp;after&nbsp;changes&nbsp;are&nbsp;posted&nbsp;constitutes&nbsp;acceptance&nbsp;of&nbsp;the&nbsp;updated&nbsp;Terms,&nbsp;to&nbsp;the&nbsp;extent&nbsp;permitted&nbsp;by&nbsp;applicable&nbsp;law.</p><h2>14.&nbsp;Governing&nbsp;Law</h2><p>These&nbsp;Terms&nbsp;of&nbsp;Use&nbsp;are&nbsp;governed&nbsp;by&nbsp;the&nbsp;laws&nbsp;and&nbsp;regulations&nbsp;applicable&nbsp;in&nbsp;<strong>[Country]</strong>.</p><p>Any&nbsp;dispute&nbsp;relating&nbsp;to&nbsp;the&nbsp;use&nbsp;of&nbsp;our&nbsp;website&nbsp;or&nbsp;services&nbsp;will&nbsp;be&nbsp;subject&nbsp;to&nbsp;the&nbsp;jurisdiction&nbsp;of&nbsp;the&nbsp;competent&nbsp;courts&nbsp;in&nbsp;accordance&nbsp;with&nbsp;applicable&nbsp;law.</p><h2>15.&nbsp;Contact&nbsp;Us</h2><p>If&nbsp;you&nbsp;have&nbsp;any&nbsp;questions&nbsp;regarding&nbsp;these&nbsp;Terms&nbsp;of&nbsp;Use,&nbsp;please&nbsp;contact&nbsp;us:</p><p><strong>Store&nbsp;Name:</strong>&nbsp;[Store&nbsp;Name]</p><p><strong>Email:</strong>&nbsp;[Email&nbsp;Address]</p><p><strong>Phone:</strong>&nbsp;[Phone&nbsp;Number]</p><p><strong>Address:</strong>&nbsp;[Address]</p>', '2026-09-16 20:35:05.187', '2026-09-16 20:53:58.819');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `avatar` varchar(191) DEFAULT NULL,
  `role` enum('CUSTOMER') NOT NULL DEFAULT 'CUSTOMER',
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `customerStatus` enum('PENDING','APPROVED','REJECTED','SUSPENDED') NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `password`, `phone`, `avatar`, `role`, `status`, `customerStatus`, `createdAt`, `updatedAt`) VALUES
('cmtx7jzkc00015jxjcpb4mz1w', 'Ahmed Ahmed Farghally', 'ahmed.fr1988@gmail.com', '$2b$12$0G8SBWB/Up/x5opnStOo5eLrwhJwFBOZaZamr1vPQc4fE/6DwfoAa', '+201065962515', '/uploads/avatars/1789227936601-IMG20191011211211.jpg', 'CUSTOMER', 1, 'APPROVED', '2026-09-11 17:06:11.532', '2026-09-12 15:45:39.645');

-- --------------------------------------------------------

--
-- Table structure for table `wishlist`
--

CREATE TABLE `wishlist` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Address_userId_fkey` (`userId`);

--
-- Indexes for table `adminuser`
--
ALTER TABLE `adminuser`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `AdminUser_email_key` (`email`);

--
-- Indexes for table `adminuserpermission`
--
ALTER TABLE `adminuserpermission`
  ADD PRIMARY KEY (`adminUserId`,`permissionId`),
  ADD KEY `AdminUserPermission_permissionId_fkey` (`permissionId`);

--
-- Indexes for table `banner`
--
ALTER TABLE `banner`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `brand`
--
ALTER TABLE `brand`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Brand_slug_key` (`slug`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Cart_userId_key` (`userId`),
  ADD UNIQUE KEY `Cart_sessionId_key` (`sessionId`);

--
-- Indexes for table `cartitem`
--
ALTER TABLE `cartitem`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `CartItem_cartId_productId_variantId_key` (`cartId`,`productId`,`variantId`),
  ADD KEY `CartItem_productId_fkey` (`productId`),
  ADD KEY `CartItem_variantId_fkey` (`variantId`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Category_slug_key` (`slug`),
  ADD KEY `Category_parentId_fkey` (`parentId`);

--
-- Indexes for table `contactmessage`
--
ALTER TABLE `contactmessage`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `country`
--
ALTER TABLE `country`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Country_code_key` (`code`),
  ADD KEY `Country_currencyId_fkey` (`currencyId`);

--
-- Indexes for table `coupon`
--
ALTER TABLE `coupon`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Coupon_code_key` (`code`);

--
-- Indexes for table `currency`
--
ALTER TABLE `currency`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Currency_code_key` (`code`);

--
-- Indexes for table `heroslide`
--
ALTER TABLE `heroslide`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `newslettersubscriber`
--
ALTER TABLE `newslettersubscriber`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `NewsletterSubscriber_email_key` (`email`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Order_orderNumber_key` (`orderNumber`),
  ADD UNIQUE KEY `Order_transactionId_key` (`transactionId`),
  ADD KEY `Order_userId_fkey` (`userId`);

--
-- Indexes for table `orderitem`
--
ALTER TABLE `orderitem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `OrderItem_orderId_fkey` (`orderId`);

--
-- Indexes for table `permission`
--
ALTER TABLE `permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Permission_action_key` (`action`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Product_slug_key` (`slug`),
  ADD UNIQUE KEY `Product_sku_key` (`sku`),
  ADD KEY `Product_categoryId_fkey` (`categoryId`),
  ADD KEY `Product_brandId_fkey` (`brandId`);

--
-- Indexes for table `productimage`
--
ALTER TABLE `productimage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ProductImage_productId_fkey` (`productId`);

--
-- Indexes for table `productvariant`
--
ALTER TABLE `productvariant`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ProductVariant_sku_key` (`sku`),
  ADD KEY `ProductVariant_productId_fkey` (`productId`);

--
-- Indexes for table `redirect`
--
ALTER TABLE `redirect`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Redirect_source_key` (`source`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Review_userId_fkey` (`userId`),
  ADD KEY `Review_productId_fkey` (`productId`);

--
-- Indexes for table `setting`
--
ALTER TABLE `setting`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Setting_key_key` (`key`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Indexes for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Wishlist_userId_productId_key` (`userId`,`productId`),
  ADD KEY `Wishlist_productId_fkey` (`productId`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `address`
--
ALTER TABLE `address`
  ADD CONSTRAINT `Address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `adminuserpermission`
--
ALTER TABLE `adminuserpermission`
  ADD CONSTRAINT `AdminUserPermission_adminUserId_fkey` FOREIGN KEY (`adminUserId`) REFERENCES `adminuser` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `AdminUserPermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `permission` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `Cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `cartitem`
--
ALTER TABLE `cartitem`
  ADD CONSTRAINT `CartItem_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `cart` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `CartItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `CartItem_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `productvariant` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `Category_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `country`
--
ALTER TABLE `country`
  ADD CONSTRAINT `Country_currencyId_fkey` FOREIGN KEY (`currencyId`) REFERENCES `currency` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `orderitem`
--
ALTER TABLE `orderitem`
  ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `Product_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brand` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `productimage`
--
ALTER TABLE `productimage`
  ADD CONSTRAINT `ProductImage_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `productvariant`
--
ALTER TABLE `productvariant`
  ADD CONSTRAINT `ProductVariant_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `Review_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `Wishlist_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Wishlist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
