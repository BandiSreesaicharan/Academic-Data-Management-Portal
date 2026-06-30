
const API = "/api"; 

function signup() {
  const userId = parseInt(document.getElementById("userid").value);
  const name = document.getElementById("name").value.trim();
  const role = document.getElementById("role").value;
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const department = document.getElementById("department").value.trim();
  const rollNumber = document.getElementById("rollNumber").value.trim();
  const batch = document.getElementById("batch").value.trim();

  const msg = document.getElementById("msg");
  msg.style.color = "#c0392b";

  if (!userId || !name || !role || !email || !password) {
    msg.innerText = "Please fill required fields (ID, Name, Role, Email, Password).";
    return;
  }

  fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, name, roll: role, email, password, department, rollNumber, batch })
  })
  .then(r => r.json())
  .then(j => {
    if (!j.success) {
      msg.innerText = j.error?.sqlMessage || j.error || j.message || "Signup failed";
    } else {
      msg.style.color = "#16a34a";
      msg.innerText = "Signup successful — redirecting to login...";
      setTimeout(()=> location.href = "login.html", 1100);
    }
  }).catch(e => { msg.innerText = "Server error"; console.error(e); });
}


function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const msg = document.getElementById("msg");
  msg.style.color = "#c0392b";

  if (!email || !password) { msg.innerText = "Enter email and password"; return; }

  fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  .then(r => r.json())
  .then(j => {
    if (!j.success) {
      msg.innerText = j.message || j.error || "Login failed";
    } else {
      msg.style.color = "#16a34a";
      msg.innerText = "Login successful";
     
      localStorage.setItem("userId", j.userId);
      localStorage.setItem("role", j.role);
      localStorage.setItem("name", j.name);

      setTimeout(() => {
        if (j.role === "student") location.href = "student_dashboard.html";
        else if (j.role === "faculty") location.href = "teacher_dashboard.html";
        else location.href = "admin_dashboard.html";
      }, 700);
    }
  }).catch(e => { msg.innerText = "Server error"; console.error(e); });
}
function addCourse() {
  const courseId = parseInt(document.getElementById("courseId")?.value || document.getElementById("admCourseId")?.value);
  const name = document.getElementById("courseName")?.value || document.getElementById("admCourseName")?.value;
  const facultyId = parseInt(document.getElementById("courseFaculty")?.value || document.getElementById("admCourseFaculty")?.value);
  const semester = parseInt(document.getElementById("courseSem")?.value || document.getElementById("admCourseSem")?.value);
  const msgEl = document.getElementById("course-msg") || document.getElementById("adm-course-msg");

  if (!courseId || !name || !facultyId || !semester) { msgEl.innerText = "Fill all fields"; return; }

  fetch("/api/courses", {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify({ courseId, name, facultyId, semester })
  })
  .then(r=>r.json()).then(j=>{
    if (!j.success) msgEl.innerText = j.error?.sqlMessage || j.error || "Failed";
    else msgEl.innerText = j.message || "Added";
  }).catch(e => { msgEl.innerText="Server error"; console.error(e); });
}

function adminAddCourse(){ addCourse(); } 

function mapStudentToCourse(){
  const mapId = parseInt(document.getElementById("mapId").value);
  const studentId = parseInt(document.getElementById("mapStudent").value);
  const courseId = parseInt(document.getElementById("mapCourse").value);
  const msg = document.getElementById("map-msg");
  if (!mapId || !studentId || !courseId) { msg.innerText = "Fill all fields"; return; }

  fetch("/api/mapping", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ mapId, studentId, courseId })
  }).then(r=>r.json()).then(j=>{
    if (!j.success) msg.innerText = j.error?.sqlMessage || j.error || "Failed";
    else msg.innerText = j.message || "Mapped";
  }).catch(e=>{ msg.innerText="Server error"; console.error(e); });
}


function markAttendance(){
  const attendanceId = parseInt(document.getElementById("attId").value);
  const courseId = parseInt(document.getElementById("attCourse").value);
  const facultyId = parseInt(document.getElementById("attFaculty").value);
  const studentId = parseInt(document.getElementById("attStudent").value);
  const date = document.getElementById("attDate").value;
  const status = document.getElementById("attStatus").value;
  const msg = document.getElementById("att-msg");
  if (!attendanceId || !courseId || !facultyId || !studentId || !date || !status) { msg.innerText="Fill all fields"; return; }

  fetch("/api/attendance", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ attendanceId, courseId, facultyId, studentId, date, status })
  }).then(r=>r.json()).then(j=>{
    if (!j.success) msg.innerText = j.error?.sqlMessage || j.error || "Failed";
    else msg.innerText = j.message || "Marked";
  }).catch(e=>{ msg.innerText="Server error"; console.error(e); });
}

function viewCourseSummary(){
  const courseId = document.getElementById("viewCourseId").value;
  const out = document.getElementById("course-out");
  if (!courseId) { out.innerText = "Enter courseId"; return; }
  fetch(`/api/attendance/course/${courseId}`).then(r=>r.json()).then(j=>{
    if (!j.success) out.innerText = j.error || "Failed";
    else out.innerText = JSON.stringify(j, null, 2);
  }).catch(e=> out.innerText = "Server error");
}

function showSummary() {
    let cid = document.getElementById("summaryCourseId").value;
    if (!cid) {
        document.getElementById("summaryOut").innerHTML = "<p>Please enter a Course ID.</p>";
        return;
    }

    fetch(`/api/attendance/course/${cid}`)
        .then(r => r.json())
        .then(j => {
            const out = document.getElementById("summaryOut");

            if (!j.success && j.error) {
                out.innerHTML = `<p>${j.error}</p>`;
                return;
            }

            const total = j.total ?? 0;
            const present = j.present ?? 0;
            const percentage = j.percentage ?? "0.00";

            out.innerHTML = `
                <div class="summary-card">
                    <h4>Course ID: ${cid}</h4>
                    <div class="summary-grid">
                        <div class="summary-item">
                            <span class="label">Students</span>
                            <span class="value">${j.studentCount ?? "-"}</span>
                        </div>
                        <div class="summary-item">
                            <span class="label">Total Classes</span>
                            <span class="value">${total}</span>
                        </div>
                        <div class="summary-item">
                            <span class="label">Present Marks</span>
                            <span class="value present">${present}</span>
                        </div>
                        <div class="summary-item">
                            <span class="label">Overall Percentage</span>
                            <span class="value percent">${percentage}%</span>
                        </div>
                    </div>
                </div>
            `;
        });
}


function getMyAttendance(){
  const studentId = document.getElementById("myStudentId").value;
  const out = document.getElementById("my-att");
  if (!studentId) { out.innerText = "Enter studentId"; return; }
  fetch(`/api/attendance/student/${studentId}`).then(r=>r.json()).then(j=>{
    if (!j.success) out.innerText = j.error || "Failed";
    else out.innerText = `Total: ${j.total}\nPresent: ${j.present}\n%: ${j.percentage}\n\nRecords:\n${JSON.stringify(j.records,null,2)}`;
  }).catch(e=> out.innerText = "Server error");
}

function getLowAttendance(){
  const out = document.getElementById("reports-out");
  fetch("/api/reports/low-attendance").then(r=>r.json()).then(j=>{
    if (!j.success) out.innerText = j.error || "Failed";
    else out.innerText = JSON.stringify(j.data, null, 2);
  }).catch(e=> out.innerText = "Server error");
}

function getAttendanceSummary(){
  const out = document.getElementById("reports-out");
  fetch("/api/reports/attendance-summary").then(r=>r.json()).then(j=>{
    if (!j.success) out.innerText = j.error || "Failed";
    else out.innerText = JSON.stringify(j.data, null, 2);
  }).catch(e=> out.innerText = "Server error");
}

function logout(){
  localStorage.clear();
  location.href = "index.html";
}

function loadMyCourses() {
    let fid = localStorage.getItem("userId");

    fetch(`/api/teacher/courses/${fid}`)
        .then(r => r.json())
        .then(j => {
            let div = document.getElementById("courseList");
            div.innerHTML = "";

            if (!j.data || j.data.length === 0) {
                div.innerHTML = "<p>No courses assigned.</p>";
                return;
            }

            j.data.forEach(c => {
                div.innerHTML += `
                    <div class='card'>
                        <div class="section-title">${c.name}</div>
                        <div>Course ID: <b>${c.courseId}</b></div>
                        <div>Semester: <b>${c.semester}</b></div>
                    </div>
                `;
            });
        });
}



function loadSubjectAttendance() {
    let studentId = localStorage.getItem("userId");

    fetch(`/api/student/summary/${studentId}`)
        .then(r => r.json())
        .then(j => {
            let div = document.getElementById("subjectAttendance");
            div.innerHTML = "";

            if (!j.data || j.data.length === 0) {
                div.innerHTML = "<p>No attendance data.</p>";
                return;
            }

            j.data.forEach(s => {
                div.innerHTML += `
                    <div class="card">
                        <div class="section-title">${s.courseName}</div>
                        <div>Present: <b>${s.presentCount}</b> / ${s.totalClasses}</div>
                        <div style="margin-top:6px;">
                            Overall Attendance:
                            <b class="${s.percentage >= 75 ? 'present' : 'absent'}">${s.percentage}%</b>
                        </div>
                    </div>
                `;
            });
        });
}

function filterAttendance() {
    let studentId = localStorage.getItem("userId");
    let from = document.getElementById("fromDate").value;
    let to = document.getElementById("toDate").value;

    fetch(`/api/student/filter?studentId=${studentId}&from=${from}&to=${to}`)
        .then(r => r.json())
        .then(j => {
            let div = document.getElementById("dateWiseResult");

            if (!j.data || j.data.length === 0) {
                div.innerHTML = "<p>No attendance records found.</p>";
                return;
            }

            let table = `
                <table class="table">
                    <tr>
                        <th>Date</th>
                        <th>Course</th>
                        <th>Status</th>
                    </tr>
            `;

            j.data.forEach(a => {
                const formattedDate = new Date(a.date).toLocaleDateString();

                table += `
                    <tr>
                        <td>${formattedDate}</td>
                        <td>${a.courseName}</td>
                        <td class="${a.status}">${a.status}</td>
                    </tr>
                `;
            });

            table += `</table>`;

            div.innerHTML = table;
        });
}


function fetchBelowPercentage() {
    let min = document.getElementById("percentInput").value;

    fetch(`/api/admin/below?min=${min}`)
        .then(r => r.json())
        .then(j => {
            let div = document.getElementById("belowResult");
            if (!j.data || j.data.length === 0) {
                div.innerHTML = "<p>No students found.</p>";
                return;
            }

            let table = `
                <table class="table">
                    <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Course</th>
                        <th>Total Classes</th>
                        <th>Present</th>
                        <th>Percentage</th>
                    </tr>
            `;

            j.data.forEach(row => {
                table += `
                    <tr>
                        <td>${row.studentId}</td>
                        <td>${row.name}</td>
                        <td>${row.courseName}</td>
                        <td>${row.total}</td>
                        <td>${row.present}</td>
                        <td>${row.percentage}%</td>
                    </tr>
                `;
            });

            table += "</table>";
            div.innerHTML = table;
        });
}


function loadAdminSummary() {
    fetch(`/api/admin/summary`)
        .then(r => r.json())
        .then(j => {
            let div = document.getElementById("summaryTable");

            let table = `
                <table class="table">
                    <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Course</th>
                        <th>Total</th>
                        <th>Present</th>
                        <th>Percentage</th>
                    </tr>
            `;

            j.data.forEach(row => {
                table += `
                    <tr>
                        <td>${row.studentId}</td>
                        <td>${row.name}</td>
                        <td>${row.courseName}</td>
                        <td>${row.total}</td>
                        <td>${row.present}</td>
                        <td>${row.percentage}%</td>
                    </tr>
                `;
            });

            table += "</table>";
            div.innerHTML = table;
        });
}



let attendanceData = []; 

function loadStudents() {
    const courseId = document.getElementById("selectedCourseId").value;

    
    document.getElementById("studentList").innerHTML = "";
    document.getElementById("attendanceButtons").innerHTML = "";
    attendanceData = [];

    if (!courseId) {
        alert("Please enter a valid Course ID.");
        return;
    }

    fetch(`/api/teacher/students/${courseId}`)
        .then(r => r.json())
        .then(j => {
            if (!j.data || j.data.length === 0) {
                document.getElementById("studentList").innerHTML =
                    "<p>No students mapped to this course.</p>";
                return;
            }

            document.getElementById("studentList").innerHTML = "<h4>Students:</h4>";

            j.data.forEach(s => {

               
                document.getElementById("studentList").innerHTML += `
                    <p style="margin: 6px 0; font-weight:600;">
                        ${s.name} (${s.studentId})
                    </p>
                `;

             
                attendanceData.push({
                    studentId: s.studentId,
                    status: "absent"
                });

               
                document.getElementById("attendanceButtons").innerHTML += `
                    <div class="card" 
                        style="display:flex; 
                        justify-content:space-between; 
                        align-items:center; 
                        margin-bottom:10px;">

                        <div>
                            <b>${s.name}</b> (${s.studentId})
                        </div>

                        <label class="switch">
                          <input type="checkbox" onchange="toggleStatus('${s.studentId}', this)">
                          <span class="slider"></span>
                        </label>
                    </div>
                `;
            });
        });
}


function loadAttendanceButtons(students) {
    let div = document.getElementById("attendanceButtons");
    div.innerHTML = "";
    attendanceData = []; 

    let cid = document.getElementById("selectedCourseId").value;
    let fid = localStorage.getItem("userId");

    students.forEach(s => {
        attendanceData.push({
            studentId: s.studentId,
            status: "absent" 
        });

        div.innerHTML += `
            <div class="card" style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <b>${s.name}</b> (${s.studentId})
                </div>

                <label class="switch">
                  <input type="checkbox" onchange="toggleStatus('${s.studentId}', this)">
                  <span class="slider"></span>
                </label>
            </div>
        `;
    });
}


function toggleStatus(studentId, checkbox) {
    for (let item of attendanceData) {
        if (item.studentId == studentId) {
            item.status = checkbox.checked ? "present" : "absent";
            break;
        }
    }
}



function mark(studentId, courseId, facultyId, status) {
    const attendanceId = document.getElementById("attId").value;
    const date = document.getElementById("attDate").value;

    fetch("/api/attendance", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ attendanceId, courseId, facultyId, studentId, date, status })
    })
    .then(r => r.json())
    .then(j => alert(j.message));
}

function showSummary() {
    let cid = document.getElementById("summaryCourseId").value;

    fetch(`/api/attendance/course/${cid}`)
        .then(r => r.json())
        .then(j => {
            document.getElementById("summaryOut").innerText = JSON.stringify(j, null, 2);
        });
}

function saveAttendance() {
    const courseId = document.getElementById("selectedCourseId").value;
    const facultyId = localStorage.getItem("userId");
    const date = document.getElementById("attDate").value;

    if (!date) {
        alert("Please select a date first!");
        return;
    }

    const payload = attendanceData.map(a => ({
        attendanceId: Date.now() + Math.floor(Math.random() * 9999),
        courseId,
        facultyId,
        studentId: a.studentId,
        status: a.status,
        date
    }));

    fetch("/api/attendance/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records: payload })
    })
    .then(res => res.json())
    .then(data => {
        if (!data.success) {
            alert("Attendance saving failed");
            console.log("BULK ATT ERROR:", data.error);
        } else {
            alert("Attendance saved successfully!");
            console.log(data);
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("role") === "student") {
        const span = document.getElementById("studentName");
        if (span) {
            span.innerText = localStorage.getItem("name") || "";
        }
    }
});
