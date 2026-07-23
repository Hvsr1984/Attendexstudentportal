export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
}

export interface Student {
  id: string;
  enrolmentNo: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  program: string;
  semester: string;
  avatarUrl?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  semester: string;
  facultyName: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subjectId: string;
  date: string;
  status: 'present' | 'absent' | 'leave';
  period: number;
}

export interface SubjectAttendance {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  lecturesDone: number;
  lecturesAttended: number;
  percentage: number;
}

export interface AttendanceSummary {
  overallPercentage: number;
  present: number;
  absent: number;
  totalLectures: number;
  lecturesRequiredClose: number; // Lectures to attend to reach 75%
  subjectWise: SubjectAttendance[];
}

export interface TimetableSlot {
  id: string;
  day: string; // e.g. 'Monday', 'Tuesday', ...
  startTime: string; // e.g. '08:00'
  endTime: string; // e.g. '09:00'
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  facultyName: string;
  room: string;
}

export interface FeeLedgerEntry {
  id: string;
  particular: string;
  total: number;
  paid: number;
  due: number;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  method: string;
  receiptUrl?: string;
  paidAt: string;
  status: 'success' | 'failed';
  particular: string;
}

export interface FeesSummary {
  ledger: FeeLedgerEntry[];
  payments: PaymentRecord[];
  totalFees: number;
  totalPaid: number;
  totalDue: number;
}

export interface ResultRecord {
  id: string;
  year: string;
  semester: string;
  status: 'PASS' | 'FAIL' | 'PENDING';
  sgpa?: number;
  cgpa?: number;
  pdfUrl?: string;
}

export interface ComplaintRecord {
  id: string;
  studentId: string;
  studentName: string;
  category: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved';
  attachmentUrl?: string;
  createdAt: string;
  resolvedAt?: string;
  adminComment?: string;
}

export interface NoticeRecord {
  id: string;
  title: string;
  body: string;
  category: 'academic' | 'exam' | 'fee' | 'general' | 'event';
  publishedAt: string;
  expiresAt: string;
}

export interface DashboardOverview {
  student: Student;
  attendanceSummary: {
    overallPercentage: number;
    monthPercentage: number;
  };
  coursesCount: number;
  feeDues: number;
  todaySchedule: TimetableSlot[];
  recentNotices: NoticeRecord[];
  upcomingEvents: { title: string; date: string; time: string; location: string }[];
}
