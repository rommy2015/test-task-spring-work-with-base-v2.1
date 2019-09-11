DROP SCHEMA IF EXISTS `task_test`;
CREATE SCHEMA IF NOT EXISTS `task_test`;
USE `task_test`;

CREATE TABLE `users` (
  id            BIGINT UNIQUE AUTO_INCREMENT NOT NULL,
  first_name     VARCHAR(255)               NOT NULL,
  last_name      VARCHAR(255)               NOT NULL,
  login          VARCHAR(255) UNIQUE        NOT NULL,
  password       VARCHAR(255)               NOT NULL,
  email          VARCHAR(255)       NOT NULL,
  credit_number  VARCHAR(25)          NOT NULL,
  telephone      VARCHAR(50)          NOT NULL,
  date_reg       DATE                       NOT NULL,
  authority     varchar(50)  not null,
  status_user VARCHAR(30)               NOT NULL,

  PRIMARY KEY (id)
);

#заполнение таблицы
INSERT INTO users (
  `first_name`, `last_name`, `login`, `password`, `email`,
  `credit_number`, `telephone`,  `date_reg`, `authority`,
  `status_user`
)
    #пароль -  `admin@123`
VALUES
  ('Анна', 'Лунина', 'a.lunina', '$2a$10$hbxecwitQQ.dDT4JOFzQAulNySFwEpaFLw38jda6Td.Y/cOiRzDFu', 'a.lunina@mail.com',
   145689997676, '11111111111', '2018-05-10', "ADMIN","ACTIVE"),
  ('Aлекс', 'Королев', 'a.korolev', '$2a$10$hbxecwitQQ.dDT4JOFzQAulNySFwEpaFLw38jda6Td.Y/cOiRzDFu', 'a.korolev@mail.com',
   14568934397466, '11123321111', '2018-05-11',"USER","ACTIVE"),
  ('Роман', 'Лавров', 'r.lavrov', 'pass', 'r.lavrov@mail.com',
   14568934397766, '11123321114', '2018-05-12',"USER","ACTIVE");



#Для хранения маркеров безопасности для клиентов, которые прошли аутентификацию
# и активировали опцию remember-me (используется Spring Security)
CREATE TABLE IF NOT EXISTS `persistent_logins` (
  username  VARCHAR(64) NOT NULL,
  series    VARCHAR(64) NOT NULL,
  tokenName     VARCHAR(64) NOT NULL,
  last_used TIMESTAMP   NOT NULL,
  PRIMARY KEY (series)
);

#Для хранения маркера безопасности
CREATE TABLE IF NOT EXISTS `tokens` (
  id  BIGINT NOT NULL AUTO_INCREMENT,
  value    VARCHAR(255) NOT NULL,
  user_id BIGINT NOT NULL,
  PRIMARY KEY (id),
  constraint fk_tokens_users foreign key(user_id) references `users`(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

#просмотр таблиц
SHOW TABLES;
