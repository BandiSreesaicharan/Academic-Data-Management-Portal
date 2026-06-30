const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); 


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",     
  database: "attendance_final"
});

db.connect(err => {
  if (err) {
    console.error("DB connect error:", err);
  } else {
    console.log("Connected to MySQL db attendance_final");
  }
});


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});



db.query(`CREATE TABLE IF NOT EXISTS mapping (
  mapId INT PRIMARY KEY,
  studentId INT NOT NULL,
  courseId INT NOT NULL,
  FOREIGN KEY (studentId) REFERENCES students(studentId) ON DELETE CASCADE,
  FOREIGN KEY (courseId) REFERENCES courses(courseId) ON DELETE CASCADE
)`, ()=>{});


app.post("/api/auth/register", (req, res) => {
  const { userId, name, roll, email, password, department, rollNumber, batch } = req.body;
  if (!userId || !name || !roll || !email || !password) {
    return res.json({ success: false, error: "Missing required fields" });
  }

  const q = `INSERT INTO users (userId, name, roll, email, password, department) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(q, [userId, name, roll, email, password, department], (err, result) => {
    if (err) return res.json({ success: false, error: err });

   
    if (roll === "student") {
      const s = `INSERT INTO students (studentId, name, rollNumber, batch, department) VALUES (?, ?, ?, ?, ?)`;
      db.query(s, [userId, name, rollNumber || null, batch || null, department || null], (err2) => {
        if (err2) return res.json({ success: false, error: err2 });
        return res.json({ success: true, message: "Student registered" });
      });
    } else {
      return res.json({ success: true, message: "User registered" });
    }
  });
});


app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const q = `SELECT * FROM users WHERE email=? AND password=?`;
  db.query(q, [email, password], (err, rows) => {
    if (err) return res.json({ success: false, error: err });
    if (!rows.length) return res.json({ success: false, message: "Invalid email or password" });
    const u = rows[0];
    return res.json({ success: true, userId: u.userId, name: u.name, role: u.roll, department: u.department });
  });
});


app.post("/api/courses", (req, res) => {
  const { courseId, name, facultyId, semester } = req.body;
  if (!courseId || !name || !facultyId || !semester) return res.json({ success: false, error: "Missing fields" });

  const q = `INSERT INTO courses (courseId, name, facultyId, semester) VALUES (?, ?, ?, ?)`;
  db.query(q, [courseId, name, facultyId, semester], (err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, message: "Course added" });
  });
});


app.post("/api/mapping", (req, res) => {
  const { mapId, studentId, courseId } = req.body;
  if (!mapId || !studentId || !courseId) return res.json({ success: false, error: "Missing fields" });

  const q = `INSERT INTO mapping (mapId, studentId, courseId) VALUES (?, ?, ?)`;
  db.query(q, [mapId, studentId, courseId], (err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, message: "Mapped student to course" });
  });
});


app.post("/api/attendance", (req, res) => {
  const { attendanceId, courseId, facultyId, studentId, date, status } = req.body;
  if (!attendanceId || !courseId || !facultyId || !studentId || !date || !status) {
    return res.json({ success: false, error: "Missing fields" });
  }
  const q = `INSERT INTO attendance (attendanceId, courseId, facultyId, studentId, date, status) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(q, [attendanceId, courseId, facultyId, studentId, date, status], (err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, message: "Attendance marked" });
  });
});


app.get("/api/attendance/date/:courseId", (req, res) => {
  const courseId = req.params.courseId;
  const q = `SELECT a.*, s.rollNumber, s.name as studentName FROM attendance a JOIN students s ON a.studentId=s.studentId WHERE a.courseId=? ORDER BY a.date DESC`;
  db.query(q, [courseId], (err, rows) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: rows });
  });
});


app.get("/api/attendance/student/:studentId", (req, res) => {
  const studentId = req.params.studentId;
  const q = `SELECT a.*, c.name as courseName FROM attendance a LEFT JOIN courses c ON a.courseId=c.courseId WHERE a.studentId=? ORDER BY a.date DESC`;
  db.query(q, [studentId], (err, rows) => {
    if (err) return res.json({ success: false, error: err });
   
    const total = rows.length;
    const present = rows.filter(r => r.status === "present").length;
    const percentage = total ? ((present/total)*100).toFixed(2) : "0.00";
    return res.json({ success: true, total, present, percentage, records: rows });
  });
});


app.get("/api/attendance/course/:courseId", (req, res) => {
  const courseId = req.params.courseId;


  const q1 = `
      SELECT status, COUNT(*) AS cnt
      FROM attendance
      WHERE courseId=?
      GROUP BY status
  `;

 
  const q2 = `
      SELECT COUNT(*) AS studentCount
      FROM mapping
      WHERE courseId=?
  `;

  db.query(q1, [courseId], (err, rows1) => {
      if (err) return res.json({ success: false, error: err });

      let total = 0, present = 0;

      rows1.forEach(r => {
          total += r.cnt;
          if (r.status === "present") present = r.cnt;
      });

      const percentage = total ? ((present / total) * 100).toFixed(2) : "0.00";

      db.query(q2, [courseId], (err2, rows2) => {
          if (err2) return res.json({ success: false, error: err2 });

          const studentCount = rows2[0].studentCount;

          return res.json({
              success: true,
              studentCount,
              total,
              present,
              percentage
          });
      });
  });
});

app.get("/api/student/summary/:studentId", (req, res) => {
    const studentId = req.params.studentId;

    const sql = `
        SELECT 
            c.name AS courseName,
            COUNT(a.attendanceId) AS totalClasses,
            SUM(a.status='present') AS presentCount,
            ROUND((SUM(a.status='present')/COUNT(a.attendanceId))*100, 2) AS percentage
        FROM attendance a
        JOIN courses c ON a.courseId = c.courseId
        WHERE a.studentId = ?
        GROUP BY c.courseId;
    `;

    db.query(sql, [studentId], (err, rows) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: rows });
    });
});




app.put("/api/attendance/:id", (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  const q = `UPDATE attendance SET status=? WHERE attendanceId=?`;
  db.query(q, [status, id], (err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, message: "Attendance updated" });
  });
});


app.get("/api/reports/low-attendance", (req, res) => {

  const q = `SELECT studentId, 
                    COUNT(*) AS total,
                    SUM(status='present') AS present
             FROM attendance
             GROUP BY studentId`;
  db.query(q, [], (err, rows) => {
    if (err) return res.json({ success: false, error: err });
    const low = rows.filter(r => {
      const perc = r.total ? (r.present / r.total) * 100 : 0;
      return perc < 75;
    }).map(r => ({ studentId: r.studentId, present: r.present, total: r.total, percentage: r.total ? ((r.present/r.total)*100).toFixed(2) : "0.00" }));
    return res.json({ success: true, data: low });
  });
});


app.get("/api/reports/attendance-summary", (req, res) => {
  const q = `SELECT courseId, COUNT(*) AS total, SUM(status='present') AS present FROM attendance GROUP BY courseId`;
  db.query(q, [], (err, rows) => {
    if (err) return res.json({ success: false, error: err });
    const out = rows.map(r => ({ courseId: r.courseId, total: r.total, present: r.present, percentage: r.total ? ((r.present/r.total)*100).toFixed(2) : "0.00" }));
    return res.json({ success: true, data: out });
  });
});


app.get("/api/courses", (req, res) => {
  db.query("SELECT * FROM courses", (err, rows) => {
    if (err) return res.json({ success: false, error: err });
    res.json({ success: true, data: rows });
  });
});
app.get("/api/students", (req, res) => {
  db.query("SELECT * FROM students", (err, rows) => {
    if (err) return res.json({ success: false, error: err });
    res.json({ success: true, data: rows });
  });
});
app.get("/api/users", (req, res) => {
  db.query("SELECT userId, name, roll, email, department FROM users", (err, rows) => {
    if (err) return res.json({ success: false, error: err });
    res.json({ success: true, data: rows });
  });
});

app.get("/api/teacher/courses/:facultyId", (req, res) => {
    const facultyId = req.params.facultyId;

    const q = `SELECT * FROM courses WHERE facultyId = ?`;

    db.query(q, [facultyId], (err, rows) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: rows });
    });
});

app.get("/api/teacher/students/:courseId", (req, res) => {
    const id = req.params.courseId;

    const q = `
        SELECT s.studentId, s.name, s.rollNumber, s.batch 
        FROM mapping m
        JOIN students s ON m.studentId = s.studentId
        WHERE m.courseId = ?
    `;

    db.query(q, [id], (err, rows) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: rows });
    });
});

app.put("/api/teacher/attendance/update", (req, res) => {
    const { attendanceId, status } = req.body;

    const q = `UPDATE attendance SET status=? WHERE attendanceId=?`;

    db.query(q, [status, attendanceId], (err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, message: "Attendance updated" });
    });
});

app.post("/api/attendance/bulk", (req, res) => {
    const records = req.body.records;

    if (!records || !records.length) {
        return res.json({ success: false, message: "No records provided" });
    }

    const sql = `
        INSERT INTO attendance (attendanceId, courseId, facultyId, studentId, date, status)
        VALUES ?
        ON DUPLICATE KEY UPDATE
            status = VALUES(status),
            facultyId = VALUES(facultyId)
    `;

    const values = records.map(r => [
        r.attendanceId,
        r.courseId,
        r.facultyId,
        r.studentId,
        r.date,
        r.status
    ]);

    db.query(sql, [values], (err, result) => {
        if (err) {
            console.log("BULK ATT ERROR:", err);
            return res.json({ success: false, error: err });
        }

        return res.json({
            success: true,
            message: "Attendance saved/updated successfully!",
            inserted: result.affectedRows
        });
    });
});


app.get("/api/admin/summary", (req, res) => {
    const sql = `
        SELECT 
            s.studentId, 
            s.name, 
            COALESCE(c.name, '-') AS courseName,
            COUNT(a.attendanceId) AS total,
            COALESCE(SUM(a.status = 'present'), 0) AS present,
            CASE 
                WHEN COUNT(a.attendanceId) = 0 THEN 0
                ELSE ROUND((SUM(a.status='present')/COUNT(a.attendanceId))*100, 2)
            END AS percentage
        FROM students s
        LEFT JOIN attendance a ON s.studentId = a.studentId
        LEFT JOIN courses c ON a.courseId = c.courseId
        GROUP BY s.studentId, c.courseId
        ORDER BY s.studentId;
    `;

    db.query(sql, (err, rows) => {
        if (err) return res.json({ success: false, error: err });
        res.json({ success: true, data: rows });
    });
});


app.get("/api/student/filter", (req, res) => {
    console.log("FILTER HIT:", req.query);

    const { studentId, from, to } = req.query;

    const sql = `
        SELECT c.name AS courseName, a.date, a.status
        FROM attendance a
        JOIN courses c ON a.courseId = c.courseId
        WHERE a.studentId = ?
        AND a.date BETWEEN ? AND ?
        ORDER BY a.date;
    `;

    db.query(sql, [studentId, from, to], (err, rows) => {
        if (err) {
            console.log("SQL ERR:", err);
            return res.json({ success: false, error: err });
        }

        res.json({ success: true, data: rows });
    });
});

app.get("/api/admin/below", (req, res) => {
    const min = req.query.min;

    const sql = `
        SELECT s.studentId, s.name, c.name AS courseName,
               COUNT(a.attendanceId) AS total,
               SUM(a.status='present') AS present,
               ROUND((SUM(a.status='present')/COUNT(a.attendanceId))*100, 2) AS percentage
        FROM attendance a
        JOIN students s ON a.studentId = s.studentId
        JOIN courses c ON a.courseId = c.courseId
        GROUP BY s.studentId, c.courseId
        HAVING percentage <= ?
        ORDER BY percentage ASC;
    `;

    db.query(sql, [min], (err, rows) => {
        if (err) return res.json({ success: false, error: err });
        res.json({ success: true, data: rows });
    });
});

app.get("/api/admin/summary", (req, res) => {
    const sql = `
        SELECT s.studentId, s.name, c.name AS courseName,
               COUNT(a.attendanceId) AS total,
               SUM(a.status='present') AS present,
               ROUND((SUM(a.status='present')/COUNT(a.attendanceId))*100, 2) AS percentage
        FROM attendance a
        JOIN students s ON a.studentId = s.studentId
        JOIN courses c ON a.courseId = c.courseId
        GROUP BY s.studentId, c.courseId
        ORDER BY s.studentId;
    `;

    db.query(sql, (err, rows) => {
        if (err) return res.json({ success: false, error: err });
        res.json({ success: true, data: rows });
    });
});





// start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on http://localhost:" + PORT));
