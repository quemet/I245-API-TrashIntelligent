CREATE TABLE T_TEACHER(
   teaId INT,
   usePassword VARCHAR(50) NOT NULL,
   useUsername VARCHAR(255) NOT NULL,
   teaIsMdc BOOLEAN NOT NULL,
   teaIsAdmin BOOLEAN NOT NULL,
   PRIMARY KEY(teaId),
   UNIQUE(usePassword),
   UNIQUE(useUsername)
);
 
CREATE TABLE T_CLASS(
   claId INT,
   claLinkSchedule VARCHAR(255) NOT NULL,
   claNmbStudent INT NOT NULL,
   teaId INT NOT NULL,
   PRIMARY KEY(claId),
   UNIQUE(teaId),
   UNIQUE(claLinkSchedule),
   FOREIGN KEY(teaId) REFERENCES T_TEACHER(teaId)
);
 
CREATE TABLE Other(
   id INT AUTO_INCREMENT,
   teaIsAdmin BOOLEAN NOT NULL,
   PRIMARY KEY(id)
);
 
CREATE TABLE T_Student(
   id INT AUTO_INCREMENT,
   useUsername VARCHAR(255) NOT NULL,
   usePassword VARCHAR(50) NOT NULL,
   claId INT,
   PRIMARY KEY(id),
   UNIQUE(useUsername),
   UNIQUE(usePassword),
   FOREIGN KEY(claId) REFERENCES T_CLASS(claId)
);
 
CREATE TABLE T_ABSENCE(
   absId INT,
   absLateAbsence BOOLEAN NOT NULL,
   absJustify BOOLEAN NOT NULL,
   dateLateAbsence DATE NOT NULL,
   id INT NOT NULL,
   PRIMARY KEY(absId),
   FOREIGN KEY(id) REFERENCES T_Student(id)
);