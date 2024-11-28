-- 0000.sql: CREATE TABLE article and user

//mysql -u<db-user> -p<db-pass> -D<db-name> < schema/0000.sql
//윗줄 명령어를 직접 입력해서 테이블 세팅하고 나서야 됐음

CREATE TABLE `users` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(16) NOT NULL UNIQUE,
    `display_name` VARCHAR(32) NOT NULL UNIQUE,
    `password` VARCHAR(151) NOT NULL,
    `date_joined` DATETIME NOT NULL DEFAULT current_timestamp(),
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `is_staff` TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `articles` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(50) NOT NULL,
    `content` TEXT NOT NULL,
    `author` INT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT current_timestamp(),
    `last_updated` DATETIME NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `is_deleted` TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`author`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
