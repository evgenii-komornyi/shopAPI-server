-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Май 30 2024 г., 16:45
-- Версия сервера: 8.0.30
-- Версия PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `Shop`
--

-- --------------------------------------------------------

--
-- Структура таблицы `Addresses`
--

CREATE TABLE `Addresses` (
  `Id` int NOT NULL,
  `ClientId` int DEFAULT NULL,
  `Country` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `City` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Address` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `PostalCode` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `Addresses`
--

INSERT INTO `Addresses` (`Id`, `ClientId`, `Country`, `City`, `Address`, `PostalCode`) VALUES
(20, 67, 'Lithuania', 'Vilnus', 'Nava pr. 10', 'EU-5203'),
(23, 72, 'Latvia', 'Riga', 'Kurzemes prospekts 10', 'LV-1069'),
(24, 73, 'Lithuania', 'Vilnus', 'Nava pr. 10', 'EU-5203'),
(25, 74, 'Lithuania', 'Vilnus', 'Nava pr. 10', 'EU-5203'),
(26, 75, 'Lithuania', 'Vilnus', 'Nava pr. 10', 'EU-5203'),
(27, 76, 'Lithuania', 'Vilnus', 'Nava pr. 10', 'EU-5203');

-- --------------------------------------------------------

--
-- Структура таблицы `Clients`
--

CREATE TABLE `Clients` (
  `Id` int NOT NULL,
  `Email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `PhoneNumber` varchar(15) NOT NULL,
  `CreationDate` datetime NOT NULL,
  `UpdateDate` datetime NOT NULL,
  `FirstName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `LastName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `UClientId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `Clients`
--

INSERT INTO `Clients` (`Id`, `Email`, `PhoneNumber`, `CreationDate`, `UpdateDate`, `FirstName`, `LastName`, `UClientId`) VALUES
(67, 'test@test.test', '+669852114556', '2024-05-14 10:54:09', '2024-05-14 10:54:09', 'Test', 'Testov', '5949341030486182'),
(68, 'blackdead666999@gmail.com', '25615015', '2024-05-15 13:48:19', '2024-05-15 13:48:19', 'Evgenii', 'Komornyi', '6920319108756100'),
(69, 'blackdead666999@gmail.com', '25615015', '2024-05-16 07:50:39', '2024-05-16 07:50:39', 'Evgenii', 'Komornyi', '7067334726571925'),
(72, 'blackdead666999@gmail.com', '+37125615015', '2024-05-23 12:53:13', '2024-05-23 12:53:13', 'Evgenii', 'Komornyi', '6043758673305800'),
(73, 'test@test.test', '+669852114556', '2024-05-29 08:21:33', '2024-05-29 08:21:33', 'Test', 'Testov', '9271638288031502'),
(74, 'test@test.test', '+669852114556', '2024-05-29 08:23:53', '2024-05-29 08:23:53', 'Test', 'Testov', '9444715654556702'),
(75, 'test@test.test', '+669852114556', '2024-05-29 08:26:11', '2024-05-29 08:26:11', 'Test', 'Testov', '2215859638481371'),
(76, 'test@test.test', '+669852114556', '2024-05-29 08:27:54', '2024-05-29 08:27:54', 'Test', 'Testov', '1034931860054593'),
(77, 'test@tet.test', '+37125615015', '2024-05-30 12:10:08', '2024-05-30 12:10:08', 'Vasia', 'Pupkin', '0381093492489530');

-- --------------------------------------------------------

--
-- Структура таблицы `Items`
--

CREATE TABLE `Items` (
  `Id` int NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `TypeId` int NOT NULL,
  `IsInStock` tinyint(1) NOT NULL DEFAULT '1',
  `IsAvailable` tinyint(1) NOT NULL DEFAULT '1',
  `CreationDate` datetime NOT NULL,
  `Price` decimal(4,2) NOT NULL DEFAULT '0.00',
  `Discount` int NOT NULL DEFAULT '0',
  `Sex` varchar(8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `Items`
--

INSERT INTO `Items` (`Id`, `Name`, `Description`, `TypeId`, `IsInStock`, `IsAvailable`, `CreationDate`, `Price`, `Discount`, `Sex`) VALUES
(1, 'RARE SUPER BLACK HALFMOON BETTA FISH', 'Rare Super Black Halfmoon Betta Fish is a stunning exotic species originating from Thailand, selectively bred by our breeders to have a perfect black color on its body. Its striking half-moon shaped tail and vibrant colors make it a captivating addition to any aquarium. Bring home The Super Black Halfmoon Betta Fish today and experience the beauty of this magnificent creature.', 1, 1, 1, '2024-04-24 00:00:00', '93.37', 20, 'male'),
(2, 'RARE HALFMOON RUBY RED BUTTERFLY BETTA FISH', 'Halfmoon Ruby Red Butterfly Betta Fish is a stunning exotic species originating from Thailand, selectively bred by our breeders to have a perfect ruby red color on its body. Its striking half-moon shaped tail and vibrant colors make it a captivating addition to any aquarium. Bring home The Halfmoon Ruby Red Butterfly Betta Fish today and experience the beauty of this magnificent creature.', 1, 1, 1, '2024-04-24 00:00:00', '56.00', 15, 'male'),
(3, 'HALFMOON BLUE BETTA FISH', 'Halfmoon Blue Betta Fish is a stunning exotic species originating from Thailand, selectively bred by our breeders to have a perfect sparkling purple blue on its body. Its striking half-moon shaped tail and vibrant colors make it a captivating addition to any aquarium. Bring home The Halfmoon Blue Betta Fish today and experience the beauty of this magnificent creature.', 1, 1, 1, '2024-04-24 00:00:00', '49.04', 20, 'male'),
(6, 'KOI GALAXY HALFMOON PRAKAT BETTA FISH', 'Koi Galaxy Halfmoon Prakat Betta Fish (HMPK) is a stunning exotic species that originates from Thailand. Our breeder has specially bred this fish with unique color genes that create the same erratically spotted patterns as Japanese koi fish. Its ornate Japanese fan-style fins and striking multi-colored appearance make it a captivating sight that is sure to catch the eye of any observer. The scattered iridescent scales of the Betta resemble the patterns of koi fish, adding to its allure. Add The Koi Galaxy Halfmoon Prakat Betta Fishto your aquarium today and experience the beauty of this magnificent creature.', 2, 1, 1, '2024-04-24 00:00:00', '51.23', 25, 'male'),
(7, 'HALFMOON KOI CANDY BETTA FISH', 'A stunning exotic species originating from Thailand. Our breeder has specially bred this fish with unique color genes that lend it striking yellow, red and blue hues on its body, reminiscent of a delightful candy treat. This fascinating fish derives its name from its resemblance to a confectionery delight. Buy live rare and premium betta fish for sale to your aquarium today and experience the beauty of this magnificent creature.', 2, 1, 1, '2024-04-24 00:00:00', '56.00', 20, 'male'),
(8, 'RARE YELLOW TIGER BETTA FISH', 'A stunning exotic species originating from Thailand. Our breeder has specially bred this fish with unique color genes that lend it striking multicolors on its body, reminiscent of a delightful koi treat. This fascinating fish derives its name from its resemblance to a confectionery delight. Buy live rare and premium betta fish for sale to your aquarium today and experience the beauty of this magnificent creature.', 2, 1, 1, '2024-04-24 00:00:00', '56.00', 30, 'male'),
(9, 'RARE GIANT HALFMOON SUPER RED BETTA FISH', 'Discover our unique selection of betta fish that are larger than the standard variety. These fish are believed to have originated in Thailand, where many of the most successful and well-known giant betta breeders are located. The majority of giant betta fish sold internationally also come from Thailand. Our betta fish have striking white coloration and are adorned with iridescent red on their fins and bodies. Our breeders have selectively crafted a perfect color on their bodies. Buy a rare and premium betta fish from Thailand and marvel at the beauty of these magnificent creatures.', 3, 1, 1, '2024-04-24 00:00:00', '60.67', 25, 'male'),
(10, 'RARE GIANT MULTICOLORS BETTA FISH', 'Discover our unique selection of betta fish that are larger than the standard variety. These fish are believed to have originated in Thailand, where many of the most successful and well-known giant betta breeders are located. The majority of giant betta fish sold internationally also come from Thailand. Our betta fish have striking coloration and are adorned with iridescent multicolors on their fins and bodies. Our breeders have selectively crafted a perfect color on their bodies. Buy a rare and premium pair of betta fish from Thailand and marvel at the beauty of these magnificent creatures.', 3, 1, 1, '2024-04-24 00:00:00', '56.00', 20, 'male'),
(11, 'RARE GIANT HALFMOON KOI RED DEVIL BETTA FISH', 'Discover our unique selection of betta fish that are larger than the standard variety. These fish are believed to have originated in Thailand, where many of the most successful and well-known giant betta breeders are located. The majority of giant betta fish sold internationally also come from Thailand. Our betta fish have striking white coloration and are adorned with iridescent red, copper and black on their fins and bodies. Our breeders have selectively crafted a perfect color on their bodies. Buy a rare and premium betta fish from Thailand and marvel at the beauty of these magnificent creatures.', 3, 1, 1, '2024-04-24 00:00:00', '60.67', 30, 'male');

-- --------------------------------------------------------

--
-- Структура таблицы `ItemsFiles`
--

CREATE TABLE `ItemsFiles` (
  `Id` int NOT NULL,
  `FileName` varchar(255) NOT NULL,
  `ItemId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `ItemsFiles`
--

INSERT INTO `ItemsFiles` (`Id`, `FileName`, `ItemId`) VALUES
(12, '1.webp', 1),
(13, '2.webp', 2),
(14, '3.webp', 3),
(15, '6.webp', 6),
(16, '7.webp', 7),
(17, '8.webp', 8),
(18, '9.webp', 9),
(19, '10.webp', 10),
(20, '11.webp', 11);

-- --------------------------------------------------------

--
-- Структура таблицы `Orders`
--

CREATE TABLE `Orders` (
  `Id` int NOT NULL,
  `Status` varchar(20) NOT NULL,
  `OrderDate` datetime NOT NULL,
  `ClientId` int NOT NULL,
  `DeliveryAddressId` int DEFAULT NULL,
  `DeliveryComment` varchar(100) DEFAULT NULL,
  `TotalPrice` decimal(9,2) NOT NULL,
  `DeliveryType` varchar(255) NOT NULL,
  `UOrderId` varchar(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `Orders`
--

INSERT INTO `Orders` (`Id`, `Status`, `OrderDate`, `ClientId`, `DeliveryAddressId`, `DeliveryComment`, `TotalPrice`, `DeliveryType`, `UOrderId`) VALUES
(38, 'pending', '2024-05-14 10:54:09', 67, 20, 'Call me before delivery', '50.50', 'courier', '702150625'),
(39, 'pending', '2024-05-15 13:48:19', 68, NULL, '', '78.43', 'shop', '563802416'),
(40, 'pending', '2024-05-16 07:50:39', 69, NULL, '', '44.80', 'shop', '369316588'),
(43, 'pending', '2024-05-23 12:53:13', 72, 23, '', '127.41', 'courier', '731580628'),
(44, 'pending', '2024-05-29 08:21:33', 73, 24, 'Call me before delivery', '50.50', 'courier', '823026019'),
(45, 'pending', '2024-05-29 08:23:53', 74, 25, 'Call me before delivery', '50.50', 'courier', '311365157'),
(46, 'pending', '2024-05-29 08:26:11', 75, 26, 'Call me before delivery', '50.50', 'courier', '355495655'),
(47, 'pending', '2024-05-29 08:27:54', 76, 27, 'Call me before delivery', '50.50', 'courier', '060479837'),
(48, 'pending', '2024-05-30 12:10:08', 77, NULL, '', '91.00', 'shop', '930054097');

-- --------------------------------------------------------

--
-- Структура таблицы `OrdersItems`
--

CREATE TABLE `OrdersItems` (
  `Id` int NOT NULL,
  `OrderId` int NOT NULL,
  `ItemId` int NOT NULL,
  `ItemPrice` decimal(4,2) NOT NULL DEFAULT '0.00',
  `ItemQuantity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `OrdersItems`
--

INSERT INTO `OrdersItems` (`Id`, `OrderId`, `ItemId`, `ItemPrice`, `ItemQuantity`) VALUES
(63, 38, 1, '74.70', 1),
(64, 38, 3, '39.23', 1),
(65, 38, 2, '47.60', 1),
(66, 39, 3, '39.23', 1),
(67, 39, 8, '39.20', 1),
(68, 40, 7, '44.80', 1),
(74, 43, 11, '42.47', 3),
(75, 44, 2, '47.60', 1),
(76, 44, 3, '39.23', 1),
(77, 44, 1, '74.70', 1),
(78, 45, 1, '74.70', 1),
(79, 45, 2, '47.60', 1),
(80, 45, 3, '39.23', 1),
(81, 46, 1, '74.70', 1),
(82, 46, 3, '39.23', 1),
(83, 46, 2, '47.60', 1),
(84, 47, 1, '74.70', 1),
(85, 47, 3, '39.23', 1),
(86, 47, 2, '47.60', 1),
(87, 48, 9, '45.50', 2);

-- --------------------------------------------------------

--
-- Структура таблицы `TypeFiles`
--

CREATE TABLE `TypeFiles` (
  `Id` int NOT NULL,
  `FileName` varchar(255) NOT NULL,
  `TypeId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `TypeFiles`
--

INSERT INTO `TypeFiles` (`Id`, `FileName`, `TypeId`) VALUES
(1, 'Halfmoon_Butterfly.webp', 1),
(2, 'Koi_Galaxy.webp', 2),
(3, 'Giant_Koi_Galaxy.webp', 3);

-- --------------------------------------------------------

--
-- Структура таблицы `Types`
--

CREATE TABLE `Types` (
  `Id` int NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `Types`
--

INSERT INTO `Types` (`Id`, `Name`, `Description`) VALUES
(1, 'Halfmoon', 'The Halfmoon Betta is a sought-after variety of Betta Fish, recognized for its striking half-moon shaped tail and vibrant colors. Originating by Thai breeders, the goal was to create a Betta Fish with a tail that forms a perfect half-circle when fully flared. Today, halfmoon butterfly betta for sale are available in a range of solid and multi-colored varieties, making them a popular choice for aquarium enthusiasts of all levels.'),
(2, 'Koi', 'The Koi Betta is a type of Betta fish with unique color patterns resembling those found in Koi fish. Originating in Thailand, Koi Betta Fish for sale were selectively bred for their distinctive coloration, resulting in striking black, white, and red markings.'),
(3, 'Giant', 'The giant betta is a type of betta fish that is larger than the standard variety. It is believed to have originated in Thailand, where many of the most successful and well-known super giant betta breeders are located, and where the majority of Giant Betta Fish for sale internationally come from.'),
(4, 'Dumbo', 'The Dumbo Betta fish gets its name from its large and distinctive pectoral fins that resemble the ears of an elephant. These fins give the fish a unique and striking appearance that has made them a popular choice for aquarium enthusiasts.'),
(5, 'Wild', 'The Wild Betta Fish, native to Thailand, is a stunning freshwater species for aquarium enthusiasts. Its ability to breathe air from the surface using a labyrinth organ, coupled with its long fins and aggressive behavior, make it an attractive and fascinating addition to any tank. Explore our collection of Wild Betta for sale including betta Imbellis, betta Smaragdina, betta Splendens and Mahachai betta Now!'),
(6, 'Alien', 'The Alien bettas are a relatively new hybrid breed of betta fish created by cross-breeding various species of wild bettas. Due to their unique colorations and patterns, they have become increasingly popular among aquarium hobbyists. These fish are typically characterized by a black or dark brown body with a striking metallic sheen, which creates a beautiful iridescence and pattern.'),
(7, 'Dragon', 'A Dragon Betta fish is a popular variety of Betta fish  known for its vibrant, metallic scales that have a shimmering, iridescent effect. The scales are often described as having a \"dragon-like\" appearance, hence the name.'),
(8, 'Samurai', 'Explore our captivating collection of Samurai Betta for sale at our online store. Find your ideal aquatic companion and embrace the elegance of these magnificent Samurai betta Fish. Shop now!'),
(9, 'Plakat', 'Explore our mesmerizing Collection of Plakat Betta for sale! Discover stunning Plakat Betta fish with vibrant colors and elegant fins. Bring home the beauty of these captivating aquatic companions. Shop now and find your perfect Betta!'),
(10, 'Crowntail', 'The Crowntail betta fish is a unique freshwater fish often kept as a pet in aquariums due to its long, flowing fins with spiky rays extending from its tail. Originating from Thailand, they are often bred for their beauty and unique patterns. Its name comes from the distinctive shape of its tail, resembling a crown or spiky comb.'),
(11, 'Veiltail', 'The Veiltail Betta Fish are popular and vibrant aquarium pets known for their long, flowing tails. Originating from Southeast Asia, particularly Thailand, the name \"Veiltail\" refers to the shape of the fish\'s tail, which is long and flowing like a veil.  Buy rare and premium Veiltail Betta for sale and experience the beauty of this magnificent creature.'),
(12, 'Tiger', 'Explore our online store for captivating Tiger Betta Fish for sale. Discover striking tiger betta varieties and add wild beauty to your tank. Find your perfect aquatic companion and bring home mesmerizing allure today! Shop now!'),
(13, 'Spade', 'Discover Spade Tail Betta for sale at our online store. Explore a stunning selection of these graceful bettas and find your perfect aquatic companion. Shop now and bring home the beauty of these captivating Spade Tail Betta Fish!'),
(14, 'Avatar', 'The Avatar Betta Fish, also know as the Black Star Betta, is a majestic aquatic marvel for your tank! With its vibrant, iridescent colors reminiscent of the mythical world, this betta fish embodies ethereal beauty. Its flowing fins and captivating hues create a stunning aquatic spectacle.');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `Addresses`
--
ALTER TABLE `Addresses`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `ClientId` (`ClientId`);

--
-- Индексы таблицы `Clients`
--
ALTER TABLE `Clients`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `UClientId` (`UClientId`);

--
-- Индексы таблицы `Items`
--
ALTER TABLE `Items`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `fish_ibfk_1` (`TypeId`);

--
-- Индексы таблицы `ItemsFiles`
--
ALTER TABLE `ItemsFiles`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FishId` (`ItemId`);

--
-- Индексы таблицы `Orders`
--
ALTER TABLE `Orders`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `UOrderId` (`UOrderId`),
  ADD KEY `ClientId` (`ClientId`);

--
-- Индексы таблицы `OrdersItems`
--
ALTER TABLE `OrdersItems`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `OrderId` (`OrderId`),
  ADD KEY `ItemId` (`ItemId`);

--
-- Индексы таблицы `TypeFiles`
--
ALTER TABLE `TypeFiles`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `TypeId` (`TypeId`);

--
-- Индексы таблицы `Types`
--
ALTER TABLE `Types`
  ADD PRIMARY KEY (`Id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `Addresses`
--
ALTER TABLE `Addresses`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT для таблицы `Clients`
--
ALTER TABLE `Clients`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT для таблицы `Items`
--
ALTER TABLE `Items`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT для таблицы `ItemsFiles`
--
ALTER TABLE `ItemsFiles`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT для таблицы `Orders`
--
ALTER TABLE `Orders`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT для таблицы `OrdersItems`
--
ALTER TABLE `OrdersItems`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT для таблицы `TypeFiles`
--
ALTER TABLE `TypeFiles`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `Types`
--
ALTER TABLE `Types`
  MODIFY `Id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `Addresses`
--
ALTER TABLE `Addresses`
  ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`ClientId`) REFERENCES `Clients` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Ограничения внешнего ключа таблицы `Items`
--
ALTER TABLE `Items`
  ADD CONSTRAINT `items_ibfk_1` FOREIGN KEY (`TypeId`) REFERENCES `Types` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Ограничения внешнего ключа таблицы `ItemsFiles`
--
ALTER TABLE `ItemsFiles`
  ADD CONSTRAINT `itemsfiles_ibfk_1` FOREIGN KEY (`ItemId`) REFERENCES `Items` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Ограничения внешнего ключа таблицы `Orders`
--
ALTER TABLE `Orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`ClientId`) REFERENCES `Clients` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Ограничения внешнего ключа таблицы `OrdersItems`
--
ALTER TABLE `OrdersItems`
  ADD CONSTRAINT `ordersitems_ibfk_1` FOREIGN KEY (`OrderId`) REFERENCES `Orders` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `ordersitems_ibfk_2` FOREIGN KEY (`ItemId`) REFERENCES `Items` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Ограничения внешнего ключа таблицы `TypeFiles`
--
ALTER TABLE `TypeFiles`
  ADD CONSTRAINT `typefiles_ibfk_1` FOREIGN KEY (`TypeId`) REFERENCES `Types` (`Id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
