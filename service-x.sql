-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Янв 14 2018 г., 19:07
-- Версия сервера: 10.1.29-MariaDB
-- Версия PHP: 7.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `service-x`
--

-- --------------------------------------------------------

--
-- Структура таблицы `mens`
--

CREATE TABLE `mens` (
  `id` int(11) NOT NULL,
  `fio` text CHARACTER SET utf8 COLLATE utf8_general_mysql500_ci,
  `birthday` date DEFAULT NULL,
  `trainer` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `mens`
--

INSERT INTO `mens` (`id`, `fio`, `birthday`, `trainer`) VALUES
(3, 'Петя', '2018-01-01', 4),
(4, 'Лена', '0000-00-00', 3),
(6, 'пуся', '2011-11-02', NULL),
(8, 'Женя', '2015-11-27', 3);

-- --------------------------------------------------------

--
-- Структура таблицы `trainers`
--

CREATE TABLE `trainers` (
  `id` int(11) NOT NULL,
  `fio` varchar(300) CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `trainers`
--

INSERT INTO `trainers` (`id`, `fio`) VALUES
(3, 'Тренер Василио'),
(4, 'Тренер Базилио');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(249) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_cs NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(2) UNSIGNED NOT NULL DEFAULT '0',
  `verified` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `resettable` tinyint(1) UNSIGNED NOT NULL DEFAULT '1',
  `roles_mask` int(10) UNSIGNED NOT NULL DEFAULT '0',
  `registered` int(10) UNSIGNED NOT NULL,
  `last_login` int(10) UNSIGNED DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `username`, `status`, `verified`, `resettable`, `roles_mask`, `registered`, `last_login`) VALUES
(4, 'dimaname@gmail.com', '$2y$10$aS8aBjOgdWU2foOY2AhXM.itmcTYr3QnFRGQ9tWKlzcIcKLkMnO1.', 'admin', 0, 1, 1, 0, 1515952349, 1515952362);

-- --------------------------------------------------------

--
-- Структура таблицы `users_confirmations`
--

CREATE TABLE `users_confirmations` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `email` varchar(249) COLLATE utf8mb4_unicode_ci NOT NULL,
  `selector` varchar(16) CHARACTER SET latin1 COLLATE latin1_general_cs NOT NULL,
  `token` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_cs NOT NULL,
  `expires` int(10) UNSIGNED NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `users_remembered`
--

CREATE TABLE `users_remembered` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user` int(10) UNSIGNED NOT NULL,
  `selector` varchar(24) CHARACTER SET latin1 COLLATE latin1_general_cs NOT NULL,
  `token` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_cs NOT NULL,
  `expires` int(10) UNSIGNED NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `users_remembered`
--

INSERT INTO `users_remembered` (`id`, `user`, `selector`, `token`, `expires`) VALUES
(1, 4, 'f_-UFNR4kO4wegp5Fn4eiv70', '$2y$10$Ghx7eeHQdkv4P4LjHMec3OyofZiaLYZdHbLUb/edo/J61iK/Oi5Oi', 1547509962);

-- --------------------------------------------------------

--
-- Структура таблицы `users_resets`
--

CREATE TABLE `users_resets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user` int(10) UNSIGNED NOT NULL,
  `selector` varchar(20) CHARACTER SET latin1 COLLATE latin1_general_cs NOT NULL,
  `token` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_cs NOT NULL,
  `expires` int(10) UNSIGNED NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `users_throttling`
--

CREATE TABLE `users_throttling` (
  `bucket` varchar(44) CHARACTER SET latin1 COLLATE latin1_general_cs NOT NULL,
  `tokens` float UNSIGNED NOT NULL,
  `replenished_at` int(10) UNSIGNED NOT NULL,
  `expires_at` int(10) UNSIGNED NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `users_throttling`
--

INSERT INTO `users_throttling` (`bucket`, `tokens`, `replenished_at`, `expires_at`) VALUES
('CUeQSH1MUnRpuE3Wqv_fI3nADvMpK_cg6VpYK37vgIw', 4, 1515952349, 1516384349),
('ejWtPDKvxt-q7LZ3mFjzUoIWKJYzu47igC8Jd9mffFk', 72.0036, 1515952362, 1516492362);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `mens`
--
ALTER TABLE `mens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `trainer` (`trainer`);
ALTER TABLE `mens` ADD FULLTEXT KEY `fullName` (`fio`);

--
-- Индексы таблицы `trainers`
--
ALTER TABLE `trainers`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Индексы таблицы `users_confirmations`
--
ALTER TABLE `users_confirmations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `selector` (`selector`),
  ADD KEY `email_expires` (`email`,`expires`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `users_remembered`
--
ALTER TABLE `users_remembered`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `selector` (`selector`),
  ADD KEY `user` (`user`);

--
-- Индексы таблицы `users_resets`
--
ALTER TABLE `users_resets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `selector` (`selector`),
  ADD KEY `user_expires` (`user`,`expires`);

--
-- Индексы таблицы `users_throttling`
--
ALTER TABLE `users_throttling`
  ADD PRIMARY KEY (`bucket`),
  ADD KEY `expires_at` (`expires_at`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `mens`
--
ALTER TABLE `mens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT для таблицы `trainers`
--
ALTER TABLE `trainers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `users_confirmations`
--
ALTER TABLE `users_confirmations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `users_remembered`
--
ALTER TABLE `users_remembered`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT для таблицы `users_resets`
--
ALTER TABLE `users_resets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
