-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Фев 02 2018 г., 11:51
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
(49, 'Кучин Александр Михайлович', '2000-12-06', 4),
(50, 'Тихонов Данил Сергеевич', '2002-09-12', 4),
(51, 'Барзанов Матвей Алексеевич', '2003-05-27', 4),
(52, 'Кострикин Вячеслав Павлович', '2004-03-03', 4),
(53, 'Пахомов Владислав Эдуардович', '2004-05-25', 4),
(54, 'Кладов Северьян Эдуардович', '2004-07-02', 4),
(55, 'Терзиогло Кирилл Алексеевич', '2004-07-27', 4),
(56, 'Романенко Богдан Сергеевич', '2004-11-03', 4),
(57, 'Смирнов Николай Евгеньевич', '2004-02-07', 4),
(58, 'Воробьев Матвей Юрьевич', '2004-05-23', 4),
(59, 'Ибрагимов Максим Ибрагим', '2004-01-09', 4),
(60, 'Титюшин Роман Евгеньевич', '2005-01-31', 4),
(61, 'Руммега Александр Владимирович', '2005-01-04', 4),
(62, 'Баранов Артем Игоревич', '2005-12-14', 4),
(63, 'Скакун Антон Денисович', '2005-01-30', 4),
(64, 'Белехов Илья Алексеевич', '2005-09-27', 4),
(65, 'Баранов Николай Сергеевич', '2005-06-20', 4),
(66, 'Новиков Виталий Алексеевич', '2005-09-25', 4),
(67, 'Кутюхин Степан Владиславович', '2005-05-26', 4),
(68, 'Симонов Артем Александрович', '2005-07-27', 4),
(69, 'Шкураев Данил Максимович', '2006-05-31', 4),
(70, 'Васильев Илья Анатольевич', '2005-08-22', 4),
(71, 'Комоватов Вячеслав Иванович', '2005-02-18', 4),
(72, 'Бурков Виктор Александрович', '2005-07-29', 4),
(73, 'Черных Ростислав Артемович', '2007-01-01', 4),
(74, 'Новиков Никита Михайлович', '2006-02-22', 4),
(75, 'Елистратов Алексей Алексеевич', '2006-04-17', 4),
(76, 'Шихалеев Арсений Алексеевич', '2006-11-17', 4),
(77, 'Иляхин Андрей Евгеньевич', '2006-03-01', 4),
(78, 'Александров Артем Дмитриевич', '2006-05-16', 4),
(79, 'Иванов Макар Андреевич', '2007-10-23', 4),
(80, 'Ратников Владимир Дмитриевич', '2007-05-27', 4),
(81, 'Соседков Александр Сергеевич', '2007-01-14', 4),
(82, 'Коледин Никита Алексеевич', '2007-07-16', 4),
(83, 'Пантелеев Александр Андреевич', '2007-02-13', 4),
(84, 'Юркин Роман Сергеевич', '2007-07-24', 4),
(85, 'Костылев Ярослав Дмитриевич', '2007-08-01', 4),
(86, 'Постовалов Андрей Алексеевич', '2007-05-23', 4),
(87, 'Колесов Артем Сергеевич', '2006-12-23', 4),
(88, 'Кулагин Никита Алексеевич', '2007-04-27', 4);

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
(3, 'Хамзин Алексей Ахатович'),
(4, 'Полевов И.С.');

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
(4, 'dimaname@gmail.com', '$2y$10$aS8aBjOgdWU2foOY2AhXM.itmcTYr3QnFRGQ9tWKlzcIcKLkMnO1.', 'admin', 0, 1, 1, 0, 1515952349, 1517142556);

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
(302, 4, '2EPK1pJdZL8jgd1FfUWFflRa', '$2y$10$6gVGyAOm.E.r8hXQEF3yn.xURBKh7QwEuD2xDnmRChsTnJhdK4WSm', 1548700156),
(301, 4, 'WzBZTIUs7KsJ__WEfxHL7UrB', '$2y$10$W5rbf0Mrf1wABg70ogwVqOtW/FyFpwYK65XjuiBV2qrcVnuu4QX5W', 1548700015);

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
('elGd3LRVY1JT_kBXvKtq3Vs-Fl2MW2GDRAmQwCzUyGQ', 499, 1517086734, 1517259534),
('OMhkmdh1HUEdNPRi-Pe4279tbL5SQ-WMYf551VVvH8U', 18.1756, 1517086892, 1517122892),
('QduM75nGblH2CDKFyk0QeukPOwuEVDAUFE54ITnHM38', 66.1359, 1517087223, 1517627223),
('ejWtPDKvxt-q7LZ3mFjzUoIWKJYzu47igC8Jd9mffFk', 19.7607, 1517142556, 1517682556),
('sy6eH-7PCl70FyuQyo_P6SkhyJgGWhF725QL1j4Yo6M', 499, 1517086892, 1517259692);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=303;

--
-- AUTO_INCREMENT для таблицы `users_resets`
--
ALTER TABLE `users_resets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
