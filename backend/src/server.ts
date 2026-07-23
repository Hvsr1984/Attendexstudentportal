import express, { Response } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { db } from './db';
import { authenticateToken, requireRole, generateToken, AuthenticatedRequest } from './middleware/auth';
import { User, ComplaintRecord, NoticeRecord } from '../../shared/src/types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Public Auth Endpoints
app.post('/api/auth/login', (req, res) => {
  const { identifier, password } = req.body; // username, email, or enrolment

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Identifier and password are required' });
  }

  // Find student by enrolment, email or name
  const student = db.getStudentByEnrolment(identifier) || db.getStudentByEmail(identifier);

  if (!student) {
    return res.status(404).json({ error: 'Student account not found' });
  }

  // Simple demo credentials verification
  if (password !== 'password123') {
    return res.status(401).json({ error: 'Invalid password. Hint: use password123' });
  }

  const userPayload: User = {
    id: student.id,
    email: student.email,
    name: student.name,
    role: 'student'
  };

  const token = generateToken(userPayload);
  res.json({ token, user: userPayload, student });
});

// Admin Manual Login
app.post('/api/auth/admin/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (email === 'admin@poornima.org' && password === 'admin123') {
    const userPayload: User = {
      id: 'admin_user',
      email: 'admin@poornima.org',
      name: 'ERP Administrator',
      role: 'admin'
    };

    const token = generateToken(userPayload);
    res.json({ token, user: userPayload });
  } else {
    res.status(401).json({ error: 'Invalid admin credentials. Use admin@poornima.org / admin123' });
  }
});

// Google SSO Authentication & Linking
// Frontend sends a token that simulates Google login. 
// We support "arnav.nagar@poornima.org" as existing, or others as new.
app.post('/api/auth/google', (req, res) => {
  const { email, name, avatarUrl } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email from Google token is required' });
  }

  const student = db.getStudentByEmail(email);

  if (student) {
    // Student already exists with this email, login directly
    const userPayload: User = {
      id: student.id,
      email: student.email,
      name: student.name,
      avatarUrl: avatarUrl || student.avatarUrl,
      role: 'student'
    };

    const token = generateToken(userPayload);
    return res.json({ token, user: userPayload, student, linked: true });
  } else {
    // Student not linked yet. We prompt for identity linking.
    return res.json({ 
      linked: false, 
      email, 
      name, 
      message: 'Account linking required. Please verify your identity with enrolment number.' 
    });
  }
});

// Link Google Account to Student Record
app.post('/api/auth/link-google', (req, res) => {
  const { enrolmentNo, dob, email, name, avatarUrl } = req.body;

  if (!enrolmentNo || !dob || !email) {
    return res.status(400).json({ error: 'Enrolment number, date of birth, and email are required' });
  }

  const student = db.getStudentByEnrolment(enrolmentNo);

  if (!student) {
    return res.status(404).json({ error: 'No student found with this enrolment number' });
  }

  // DOB validation check (e.g. 06 July 2006)
  if (student.dob.toLowerCase().trim() !== dob.toLowerCase().trim()) {
    return res.status(400).json({ error: 'Date of birth does not match academic records' });
  }

  // Perform linking (update student's email and avatar)
  const updatedStudent = db.updateStudentProfile(student.id, { email, avatarUrl });

  const userPayload: User = {
    id: student.id,
    email: email,
    name: student.name,
    avatarUrl: avatarUrl,
    role: 'student'
  };

  const token = generateToken(userPayload);
  res.json({ token, user: userPayload, student: updatedStudent, success: true });
});

// Authenticated Endpoints (Student or Admin)
app.use('/api', authenticateToken);

app.get('/api/me', (req: AuthenticatedRequest, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.user.role === 'student') {
    const student = db.getStudent(req.user.id);
    res.json({ user: req.user, student });
  } else {
    res.json({ user: req.user });
  }
});

// Get Dashboard Overview aggregates
app.get('/api/dashboard', requireRole(['student']), (req: AuthenticatedRequest, res) => {
  const student = db.getStudent(req.user!.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });

  // Calculate attendance averages
  const subjects = db.getSubjects();
  const timetable = db.getTimetable();
  const fees = db.getFees();
  const notices = db.getNotices();

  // Mock aggregates
  const totalDues = fees.ledger.reduce((acc, item) => acc + item.due, 0);
  const activeTimetable = timetable.filter(slot => slot.day === "Monday"); // Monday as active default
  const activeNotices = notices.slice(0, 4);

  res.json({
    student,
    attendanceSummary: {
      overallPercentage: 87.73,
      monthPercentage: 85.00
    },
    coursesCount: subjects.length,
    feeDues: totalDues,
    todaySchedule: activeTimetable,
    recentNotices: activeNotices,
    upcomingEvents: [
      { title: "Hackathon 2026 Registration", date: "2026-07-25", time: "10:00 AM", location: "Auditorium-2" },
      { title: "Guest Lecture: AI & Ethics", date: "2026-07-28", time: "02:00 PM", location: "Seminar Hall-1" }
    ]
  });
});

// Attendance Breakdown
app.get('/api/attendance', requireRole(['student']), (req: AuthenticatedRequest, res) => {
  // Return mocked detailed summary
  const summary = {
    overallPercentage: 87.73,
    present: 38,
    absent: 6,
    totalLectures: 47,
    lecturesRequiredClose: 19,
    subjectWise: [
      { subjectId: "sub_dsa", subjectName: "Data Structures & Algorithms", subjectCode: "DSA", lecturesDone: 15, lecturesAttended: 15, percentage: 100 },
      { subjectId: "sub_uiux", subjectName: "User Interface & Experience", subjectCode: "UI/UX", lecturesDone: 12, lecturesAttended: 12, percentage: 100 },
      { subjectId: "sub_aem", subjectName: "Advanced Engineering Mathematics", subjectCode: "AEM", lecturesDone: 10, lecturesAttended: 8, percentage: 80 },
      { subjectId: "sub_dsld", subjectName: "Digital System & Logic Design", subjectCode: "DSLD", lecturesDone: 16, lecturesAttended: 12, percentage: 75 },
      { subjectId: "sub_tech_comm", subjectName: "Technical Communication", subjectCode: "Tech. Comm.", lecturesDone: 18, lecturesAttended: 14, percentage: 78 },
      { subjectId: "sub_nsp", subjectName: "Network Security & Protocols", subjectCode: "NSP", lecturesDone: 15, lecturesAttended: 10, percentage: 66.7 }
    ]
  };
  res.json(summary);
});

// Timetable schedule
app.get('/api/timetable', requireRole(['student']), (req, res) => {
  res.json(db.getTimetable());
});

// Fees summary
app.get('/api/fees', requireRole(['student']), (req: AuthenticatedRequest, res) => {
  const fees = db.getFees();
  const totalFees = fees.ledger.reduce((acc, item) => acc + item.total, 0);
  const totalPaid = fees.ledger.reduce((acc, item) => acc + item.paid, 0);
  const totalDue = fees.ledger.reduce((acc, item) => acc + item.due, 0);

  res.json({
    ledger: fees.ledger,
    payments: fees.payments,
    totalFees,
    totalPaid,
    totalDue
  });
});

// Results Ledger
app.get('/api/results', requireRole(['student']), (req, res) => {
  res.json(db.getResults());
});

// Complaints routes
app.get('/api/complaints', requireRole(['student']), (req: AuthenticatedRequest, res) => {
  res.json(db.getComplaintsByStudent(req.user!.id));
});

app.post('/api/complaints', requireRole(['student']), (req: AuthenticatedRequest, res) => {
  const { category, description, attachmentUrl } = req.body;

  if (!category || !description) {
    return res.status(400).json({ error: 'Category and description are required' });
  }

  const complaint = db.addComplaint({
    studentId: req.user!.id,
    studentName: req.user!.name,
    category,
    description,
    status: 'pending',
    attachmentUrl
  });

  res.status(201).json(complaint);
});

// Notices
app.get('/api/notices', (req, res) => {
  res.json(db.getNotices());
});

// Admin-Only ERP Console Routes (RBAC enforced)
app.get('/api/admin/complaints', requireRole(['admin']), (req, res) => {
  res.json(db.getComplaints());
});

app.post('/api/admin/complaints/:id/resolve', requireRole(['admin']), (req, res) => {
  const { id } = req.params;
  const { status, adminComment } = req.body;

  if (!status || !['in_progress', 'resolved'].includes(status)) {
    return res.status(400).json({ error: 'Status must be in_progress or resolved' });
  }

  const complaints = db.getComplaints();
  const complaint = complaints.find(c => c.id === id);

  if (!complaint) {
    return res.status(404).json({ error: 'Complaint ticket not found' });
  }

  complaint.status = status as any;
  if (adminComment) {
    complaint.adminComment = adminComment;
  }
  if (status === 'resolved') {
    complaint.resolvedAt = new Date().toISOString();
  }

  // Trigger db save
  // Direct modification on reference since db loads it in memory
  // Let's call private save through a public API update method or direct write.
  // We can force save by writing back
  db.updateStudentProfile("non_existent", {}); // dummy trigger to force save
  res.json(complaint);
});

app.post('/api/admin/notices', requireRole(['admin']), (req, res) => {
  const { title, body, category, expiresAt } = req.body;

  if (!title || !body || !category) {
    return res.status(400).json({ error: 'Title, body, and category are required' });
  }

  const newNotice: NoticeRecord = {
    id: "notice_" + Date.now(),
    title,
    body,
    category,
    publishedAt: new Date().toISOString(),
    expiresAt: expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  };

  db.getNotices().unshift(newNotice);
  db.updateStudentProfile("non_existent", {}); // force save
  res.status(201).json(newNotice);
});

// Start listening
app.listen(PORT, () => {
  console.log(`ATTENDEX Backend running on http://localhost:${PORT}`);
});
