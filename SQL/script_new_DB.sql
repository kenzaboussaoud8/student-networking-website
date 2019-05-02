-- MySQL Script generated by MySQL Workbench
-- Sun Mar 10 15:35:27 2019
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema LoveAcademy
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema LoveAcademy
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `LoveAcademy` DEFAULT CHARACTER SET utf8 ;
USE `LoveAcademy` ;

-- -----------------------------------------------------
-- Table `LoveAcademy`.`Department`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `LoveAcademy`.`Department` ;

CREATE TABLE IF NOT EXISTS `LoveAcademy`.`Department` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(3) NULL,
  `nom` varchar(255) NULL,
  `nom_uppercase` varchar(255) NULL,
  `slug` varchar(255) NULL,
  `nom_soundex` varchar(20) NULL,
  INDEX `fk_Department_City1_idx` (`code` ASC),
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `LoveAcademy`.`City`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `LoveAcademy`.`City` ;

CREATE TABLE IF NOT EXISTS `LoveAcademy`.`City` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `department_code` VARCHAR(3) NULL,
  `gps_lat` FLOAT NULL,
  `gps_lng` FLOAT NULL,
  `insee_code` VARCHAR(5) NULL,
  `name` VARCHAR(45) NULL,
  `slug` VARCHAR(45) NULL,
  `zip_code` INT NULL,
  `Department_id` VARCHAR(3) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_City_Department1_idx` (`Department_id` ASC),
  INDEX `fk_City_School1_idx` (`name` ASC),
  CONSTRAINT `fk_City_Department1`
    FOREIGN KEY (`Department_id`)
    REFERENCES `LoveAcademy`.`Department` (`code`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `LoveAcademy`.`School`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `LoveAcademy`.`School` ;

CREATE TABLE IF NOT EXISTS `LoveAcademy`.`School` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `city` VARCHAR(45) NULL,
  `department_code` VARCHAR(2) NULL,
  `idschool` VARCHAR(40) NULL,
  `name` VARCHAR(128) NULL,
  `City_id` VARCHAR(45) NULL,
  `user_id` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_School_City1_idx` (`City_id` ASC),
  CONSTRAINT `fk_School_City1`
    FOREIGN KEY (`City_id`)
    REFERENCES `LoveAcademy`.`City` (`name`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `LoveAcademy`.`User`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `LoveAcademy`.`User` ;

CREATE TABLE IF NOT EXISTS `LoveAcademy`.`User` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(180) NOT NULL,
  `password` VARCHAR(180) NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `birth_date` DATETIME NOT NULL,
  `creation_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_modif_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `student_card` LONGTEXT NULL,
  `gender` ENUM('homme', 'femme') NULL,
  `bio` VARCHAR(280) NULL,
  `profile_picture` LONGTEXT NULL,
  `role` TINYINT NOT NULL DEFAULT '0',
  `interest_gender` ENUM('homme', 'femme', 'les deux') NULL,
  `interest_age` VARCHAR(45) NULL,
  `interest_city_id` INT NULL,
  `School_id` INT NULL,
  `City_id` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_User_School1_idx` (`School_id` ASC),
  INDEX `fk_User_City1_idx` (`City_id` ASC),
  CONSTRAINT `fk_User_School1`
    FOREIGN KEY (`School_id`)
    REFERENCES `LoveAcademy`.`School` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_User_City1`
    FOREIGN KEY (`City_id`)
    REFERENCES `LoveAcademy`.`City` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `LoveAcademy`.`Hobbies`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `LoveAcademy`.`Hobbies` ;

CREATE TABLE IF NOT EXISTS `LoveAcademy`.`Hobbies` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `LoveAcademy`.`Access_tokens`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `LoveAcademy`.`Access_tokens` ;

CREATE TABLE IF NOT EXISTS `LoveAcademy`.`Access_tokens` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `access_token` VARCHAR(500) NOT NULL,  
  `status` ENUM('0', '1') NOT NULL,
  `expires` INT NULL,
  `User_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Access_tokens_User1_idx` (`User_id` ASC),
  CONSTRAINT `fk_Access_tokens_User1`
    FOREIGN KEY (`User_id`)
    REFERENCES `LoveAcademy`.`User` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `LoveAcademy`.`Picture`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `LoveAcademy`.`Picture` ;

CREATE TABLE IF NOT EXISTS `LoveAcademy`.`Picture` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `picture` LONGTEXT NOT NULL,
  `description` VARCHAR(280) NOT NULL,
  `User_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Picture_User1_idx` (`User_id` ASC),
  CONSTRAINT `fk_Picture_User1`
    FOREIGN KEY (`User_id`)
    REFERENCES `LoveAcademy`.`User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `LoveAcademy`.`User_has_Hobbies`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `LoveAcademy`.`User_has_Hobbies` ;

CREATE TABLE IF NOT EXISTS `LoveAcademy`.`User_has_Hobbies` (
  `User_id` INT NOT NULL,
  `Hobbies_id` INT NOT NULL,
  PRIMARY KEY (`User_id`, `Hobbies_id`),
  INDEX `fk_User_has_Hobbies_Hobbies1_idx` (`Hobbies_id` ASC),
  INDEX `fk_User_has_Hobbies_User_idx` (`User_id` ASC),
  CONSTRAINT `fk_User_has_Hobbies_User`
    FOREIGN KEY (`User_id`)
    REFERENCES `LoveAcademy`.`User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_User_has_Hobbies_Hobbies1`
    FOREIGN KEY (`Hobbies_id`)
    REFERENCES `LoveAcademy`.`Hobbies` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `LoveAcademy`.`Request`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `LoveAcademy`.`Request` ;

CREATE TABLE IF NOT EXISTS `LoveAcademy`.`Request` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `User_id_requester` INT NOT NULL,
  `User_id_receiver` INT NOT NULL,
  `status` ENUM('0', '1', '2', '3') NOT NULL DEFAULT '0',
  `sent_date` DATETIME NOT NULL,
  `last_modified` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`User_id_requester`, `User_id_receiver`),
  INDEX `fk_User_has_User_User2_idx` (`User_id_receiver` ASC),
  INDEX `fk_User_has_User_User1_idx` (`User_id_requester` ASC),
  CONSTRAINT `fk_User_has_User_User1`
    FOREIGN KEY (`User_id_requester`)
    REFERENCES `LoveAcademy`.`User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_User_has_User_User2`
    FOREIGN KEY (`User_id_receiver`)
    REFERENCES `LoveAcademy`.`User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `LoveAcademy`.`Notifications`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `LoveAcademy`.`Notifications` ;

CREATE TABLE IF NOT EXISTS `LoveAcademy`.`Notifications` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `LoveAcademy`.`User_has_Notifications`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `LoveAcademy`.`User_has_Notifications` ;

CREATE TABLE IF NOT EXISTS `LoveAcademy`.`User_has_Notifications` (
  `User_id` INT NOT NULL,
  `Notifications_id` INT NOT NULL,
  `statut` ENUM('0', '1') NOT NULL DEFAULT '0',
  PRIMARY KEY (`User_id`, `Notifications_id`),
  INDEX `fk_User_has_Notifications_Notifications1_idx` (`Notifications_id` ASC),
  INDEX `fk_User_has_Notifications_User1_idx` (`User_id` ASC),
  CONSTRAINT `fk_User_has_Notifications_User1`
    FOREIGN KEY (`User_id`)
    REFERENCES `LoveAcademy`.`User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_User_has_Notifications_Notifications1`
    FOREIGN KEY (`Notifications_id`)
    REFERENCES `LoveAcademy`.`Notifications` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


