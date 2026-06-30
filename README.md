# Academic Data Management Portal

A database-driven **Academic Data Management Portal** designed to streamline academic operations through efficient management of students, faculty, courses, attendance, and reports.

The project demonstrates the practical implementation of **Database Management Systems (DBMS)** concepts, **Relational Database Design**, **SQL**, and **Role-Based Authentication**, while providing separate dashboards for **Students**, **Teachers**, and **Administrators**.

---

# Project Overview

The Academic Data Management Portal centralizes academic information into a single platform, enabling efficient management of academic workflows.

The system provides:

-  Student Management
-  Faculty Management
-  Course Management
-  Student–Course Mapping
-  Role-Based Authentication & Authorization
-  Attendance Management
-  Attendance Analytics
-  Attendance Summary Reports
-  Students Below Attendance Threshold
-  Real-Time Data Retrieval using MySQL

---

# Features

## Student Dashboard

- Secure Login
- Subject-wise Attendance
- Attendance Percentage
- Date-wise Attendance Filtering
- Attendance History

---

## Teacher Dashboard

- View Assigned Courses
- View Students in a Course
- Mark Attendance
- Save Attendance Records
- Course Attendance Summary

---

## Administrator Dashboard

- Add Courses
- Student-Course Mapping
- Attendance Summary Reports
- Students Below Custom Attendance Percentage

---

# System Architecture

```
Students
          \
Teachers ----> Node.js + Express.js Server ----> MySQL Database
          /
Administrators
```

---

# 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | MySQL |
| APIs | REST APIs |
| Authentication | Role-Based Authentication |
| Database Concepts | DBMS, SQL, Relational Database Design |

---

# Database Schema

The project consists of the following relational tables:

- Users
- Courses
- Mapping
- Attendance

These tables maintain relationships between users, faculty, courses, and attendance records while ensuring efficient querying and data integrity.

---

# 📊 Entity Relationship Diagram

```text
                                   +--------------------------------------+
                                   |               USERS                  |
                                   +--------------------------------------+
                                   | PK  userId          INT              |
                                   |     name            VARCHAR(100)     |
                                   |     role            ENUM             |
                                   |     email           VARCHAR(150)     |
                                   |     password        VARCHAR(255)     |
                                   |     department      VARCHAR(100)     |
                                   |     createdAt       TIMESTAMP        |
                                   +--------------------------------------+
                                        |                    |
                        Student (role='student')     Faculty (role='faculty')
                                        |                    |
                                        |                    |
                                        |                    |
                        +---------------+                    +----------------+
                        |                                     teaches         |
                        |                                                     |
                        ▼                                                     ▼
              +--------------------------+          +----------------------------------+
              |         MAPPING          |          |             COURSES              |
              +--------------------------+          +----------------------------------+
              | PK  mapId       INT      |          | PK  courseId        INT          |
              | FK  studentId   INT -----+--------> |     name            VARCHAR(200) |
              | FK  courseId    INT -------------+  | FK  facultyId ------+----------+
              +--------------------------+       |  |     semester        INT        |
                                                 |  +----------------------------------+
                                                 |
                                                 ▼
                              +------------------------------------------------------+
                              |                    ATTENDANCE                        |
                              +------------------------------------------------------+
                              | PK  attendanceId      BIGINT                         |
                              | FK  courseId          INT                            |
                              | FK  facultyId         INT                            |
                              | FK  studentId         INT                            |
                              |     date              DATE                           |
                              |     status            ENUM                           |
                              |     createdAt         TIMESTAMP                      |
                              +------------------------------------------------------+
```

---

# 📈 SQL & DBMS Concepts Used

- Relational Database Design
- SQL Queries
- CRUD Operations
- Primary & Foreign Keys
- JOIN Operations
- Aggregate Functions
- Query Optimization
- Data Integrity
- Role-Based Access Control
- REST API Integration

---

# 📂 Project Structure

```
Academic-Data-Management-Portal
│
├── node_modules/
├── Screenshots/
│
├── admin_dashboard.html
├── attendance_summary.html
├── below_percentage.html
├── index.html
├── login.html
├── signup.html
├── student_dashboard.html
├── teacher_dashboard.html
│
├── script.js
├── styles.css
├── server.js
│
├── package.json
├── package-lock.json
│
└── README.md
```

---

# 📸 Screenshots

## Login Page

> <img width="1110" height="907" alt="login" src="https://github.com/user-attachments/assets/c55c9ae3-b75b-47dc-b9fe-533eeaf341be" />

---

## Student Dashboard

> <img width="868" height="915" alt="Student_dashboard" src="https://github.com/user-attachments/assets/ef15923f-6390-47d3-8ebf-779aedd25021" />


---

## Teacher Dashboard

> <img width="651" height="803" alt="Teacher_dashboard (2)" src="https://github.com/user-attachments/assets/778a46c2-96a0-4646-9d67-e6e9702c1cf0" />
<img width="632" height="917" alt="Teacher_dashboard (1)" src="https://github.com/user-attachments/assets/db763052-5828-4a0f-a7d2-219e9a9a2c60" />


---

## Admin Dashboard

> <img width="845" height="917" alt="Admin_dashboard" src="https://github.com/user-attachments/assets/f923d9ac-87e6-4336-8aeb-2d23bf54a455" />


---

## Attendance Summary

> <img width="967" height="905" alt="Attendance Summury" src="https://github.com/user-attachments/assets/34cfebde-5b02-41ea-a06b-157aa21e3422" />


---

## Students Below Attendance Percentage

> <img width="962" height="916" alt="Students_below_Percentage" src="https://github.com/user-attachments/assets/589aca83-be8f-41fc-a804-1bf08632d60e" />


---
# Database Implementation

### Database Tables
Relational database schema implemented in MySQL.

<img width="1918" height="942" alt="Tables_Schema" src="https://github.com/user-attachments/assets/480172c6-e8b8-4379-95c2-47503307a457" />
<img width="1918" height="1013" alt="Tables   Relationships (1)" src="https://github.com/user-attachments/assets/15f6f0f6-bcdc-4782-8f03-11875393c9f0" />
<img width="1918" height="563" alt="Tables   Relationships (2)" src="https://github.com/user-attachments/assets/2d0c90ab-25a4-430e-9c12-e7447a7e1b54" />


---

# Backend

### Backend Server
Node.js and Express.js server successfully connected to the MySQL database.

<img width="1918" height="1017" alt="Backend" src="https://github.com/user-attachments/assets/ea6ccd35-9e1b-4c3e-a348-2594cb720c55" />


---

---

# Learning Outcomes

This project strengthened my understanding of:

- Database Management Systems (DBMS)
- SQL & MySQL
- Relational Database Design
- Data Modeling
- Data Management
- CRUD Operations
- RESTful APIs
- Role-Based Authentication
- Query Optimization
- Attendance Analytics
- Backend Data Processing

---
