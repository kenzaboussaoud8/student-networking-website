-- MySQL Script generated by MySQL Workbench
-- Tue Mar  5 14:46:40 2019
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema LoveAcademy
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema LoveAcademy
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `LoveAcademy` DEFAULT CHARACTER SET utf8 ;
USE `LoveAcademy` ;

-- -----------------------------------------------------
-- Table `LoveAcademy`.`User`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `LoveAcademy`.`User` ;

CREATE TABLE IF NOT EXISTS `LoveAcademy`.`User` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `creation_date` DATETIME NOT NULL,
  `first_name` VARCHAR(45) NOT NULL,
  `last_name` VARCHAR(45) NOT NULL,
  `last_modif_date` DATETIME NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `LoveAcademy`.`Administrator`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `LoveAcademy`.`Administrator` ;

CREATE TABLE IF NOT EXISTS `LoveAcademy`.`Administrator` (
  `User_id` INT NOT NULL,
  PRIMARY KEY (`User_id`),
  CONSTRAINT `fk_Administrator_User`
    FOREIGN KEY (`User_id`)
    REFERENCES `LoveAcademy`.`User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `LoveAcademy`.`Student`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `LoveAcademy`.`Student` ;

CREATE TABLE IF NOT EXISTS `LoveAcademy`.`Student` (
  `User_id` INT NOT NULL,
  `birth_date` DATETIME NOT NULL,
  `student_card` TEXT(100) NOT NULL,
  `gender` ENUM('homme', 'femme') NULL,
  `bio` VARCHAR(250) NULL,
  `profile_picture` TEXT(500) NULL,
  `Administrator_User_id` INT NOT NULL,
  `status` ENUM('0', '1', '2') NOT NULL,
  PRIMARY KEY (`User_id`),
  INDEX `fk_Student_Administrator1_idx` (`Administrator_User_id` ASC) VISIBLE,
  CONSTRAINT `fk_Student_User1`
    FOREIGN KEY (`User_id`)
    REFERENCES `LoveAcademy`.`User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Student_Administrator1`
    FOREIGN KEY (`Administrator_User_id`)
    REFERENCES `LoveAcademy`.`Administrator` (`User_id`)
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
  `Administrator_User_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Hobbies_Administrator1_idx` (`Administrator_User_id` ASC) VISIBLE,
  CONSTRAINT `fk_Hobbies_Administrator1`
    FOREIGN KEY (`Administrator_User_id`)
    REFERENCES `LoveAcademy`.`Administrator` (`User_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `LoveAcademy`.`Student_has_Hobbies`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `LoveAcademy`.`Student_has_Hobbies` ;

CREATE TABLE IF NOT EXISTS `LoveAcademy`.`Student_has_Hobbies` (
  `Student_User_id` INT NOT NULL,
  `Hobbies_id` INT NOT NULL,
  PRIMARY KEY (`Student_User_id`, `Hobbies_id`),
  INDEX `fk_Student_has_Hobbies_Hobbies1_idx` (`Hobbies_id` ASC) VISIBLE,
  INDEX `fk_Student_has_Hobbies_Student1_idx` (`Student_User_id` ASC) VISIBLE,
  CONSTRAINT `fk_Student_has_Hobbies_Student1`
    FOREIGN KEY (`Student_User_id`)
    REFERENCES `LoveAcademy`.`Student` (`User_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Student_has_Hobbies_Hobbies1`
    FOREIGN KEY (`Hobbies_id`)
    REFERENCES `LoveAcademy`.`Hobbies` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `LoveAcademy`.`UserPicture`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `LoveAcademy`.`UserPicture` ;

CREATE TABLE IF NOT EXISTS `LoveAcademy`.`UserPicture` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `picture` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;