DROP TABLE IF EXISTS SC_GROUP;
DROP TABLE IF EXISTS STUDENT_CLASS;
DROP TABLE IF EXISTS _GROUP;
DROP TABLE IF EXISTS PROGRAMME_COURSE;
DROP TABLE IF EXISTS STUDENT;
DROP TABLE IF EXISTS CLASS_TEACHER;
DROP TABLE IF EXISTS PROGRAMME;
DROP TABLE IF EXISTS CLASS;
DROP TABLE IF EXISTS COURSE;
DROP TABLE IF EXISTS TEACHER;
DROP TABLE IF EXISTS USERS;

CREATE TABLE USERS(
	UNAME VARCHAR(256) NOT NULL,
	EMAIL VARCHAR(256),
	PRIMARY KEY(EMAIL)
);

CREATE TABLE TEACHER(
	EMAIL VARCHAR(256),
	NUMBER INT,
	PRIMARY KEY (NUMBER),
	FOREIGN KEY (EMAIL) REFERENCES USERS(EMAIL) ON UPDATE CASCADE
);

CREATE TABLE COURSE(
	CNAME VARCHAR(128) UNIQUE,
	ACRONYM VARCHAR(5),
	COORDINATORNUMBER INT,
	PRIMARY KEY (ACRONYM),
	FOREIGN KEY (COORDINATORNUMBER) REFERENCES TEACHER(NUMBER) ON UPDATE CASCADE
);

CREATE TABLE CLASS(
	IDENTIFIER VARCHAR(5),
	SEMESTER_REPRESENT VARCHAR(5),
	COURSE_ACRONYM VARCHAR(5),
	PRIMARY KEY (IDENTIFIER,SEMESTER_REPRESENT,COURSE_ACRONYM),
	FOREIGN KEY (COURSE_ACRONYM) REFERENCES COURSE(ACRONYM) ON UPDATE CASCADE
);

CREATE TABLE PROGRAMME(
	PROGRAMME_ID VARCHAR(10),
	PNAME VARCHAR(256) UNIQUE ,
	NUMBEROFSEMESTERS INT,
	PRIMARY KEY(PROGRAMME_ID)
);

CREATE TABLE STUDENT(
	EMAIL VARCHAR(256),
	NUMBER INT,
	PROGRAMME_ID VARCHAR(10),
	PRIMARY KEY(NUMBER),
	FOREIGN KEY(EMAIL) REFERENCES USERS(EMAIL)ON UPDATE CASCADE,
	FOREIGN KEY(PROGRAMME_ID) REFERENCES PROGRAMME(PROGRAMME_ID) ON UPDATE CASCADE
);

CREATE TABLE CLASS_TEACHER (
	TEACHERNUMBER INT,
	C_ACRONYM VARCHAR(5),
	IDENTIFIERCLASS VARCHAR(5),
	SEMESTER_REPRESENT VARCHAR(5),
	FOREIGN KEY (TEACHERNUMBER) REFERENCES TEACHER(NUMBER) ON UPDATE CASCADE,
	FOREIGN KEY (IDENTIFIERCLASS,SEMESTER_REPRESENT,C_ACRONYM) REFERENCES CLASS(IDENTIFIER,SEMESTER_REPRESENT,COURSE_ACRONYM) ON UPDATE CASCADE
);

CREATE TABLE PROGRAMME_COURSE (
	PROGRAMME_ID VARCHAR(10),
	COURSEACRONYM VARCHAR(5),
	MANDATORY BOOLEAN NOT NULL,
	CURRICULARSEMESTER VARCHAR(20),
	FOREIGN KEY (PROGRAMME_ID) REFERENCES PROGRAMME(PROGRAMME_ID) ON UPDATE CASCADE,
	FOREIGN KEY (COURSEACRONYM) REFERENCES COURSE(ACRONYM) ON UPDATE CASCADE
);

CREATE TABLE _GROUP (
    GROUP_NUMBER INT,
    PRIMARY KEY(GROUP_NUMBER)
);

CREATE TABLE STUDENT_CLASS (
    STUDENT_NUMBER INT,
    CLASS_IDENTIFIER VARCHAR(5),
    SEMESTER_REPRESENT VARCHAR(5),
    COURSE_ACRONYM VARCHAR(5),
    PRIMARY KEY(STUDENT_NUMBER, CLASS_IDENTIFIER, SEMESTER_REPRESENT, COURSE_ACRONYM),
    FOREIGN KEY(STUDENT_NUMBER) REFERENCES STUDENT(NUMBER) ON UPDATE CASCADE,
    FOREIGN KEY(CLASS_IDENTIFIER,SEMESTER_REPRESENT,COURSE_ACRONYM) REFERENCES CLASS(IDENTIFIER,SEMESTER_REPRESENT,COURSE_ACRONYM) ON UPDATE CASCADE
);

CREATE TABLE SC_GROUP(
	STUDENT_NUMBER INT,
    CLASS_IDENTIFIER VARCHAR(5),
    SEMESTER_REPRESENT VARCHAR(5),
    COURSE_ACRONYM VARCHAR(5),
	GROUP_NUMBER INT,
	
	PRIMARY KEY (STUDENT_NUMBER, CLASS_IDENTIFIER, SEMESTER_REPRESENT, COURSE_ACRONYM, GROUP_NUMBER),
	FOREIGN KEY (STUDENT_NUMBER,CLASS_IDENTIFIER,SEMESTER_REPRESENT,COURSE_ACRONYM) REFERENCES STUDENT_CLASS(STUDENT_NUMBER,CLASS_IDENTIFIER,SEMESTER_REPRESENT,COURSE_ACRONYM) ON UPDATE CASCADE,
    FOREIGN KEY (GROUP_NUMBER) REFERENCES _GROUP(GROUP_NUMBER) ON UPDATE CASCADE
);