import * as fs from 'fs';
import * as path from 'path';
import { 
  Student, Subject, TimetableSlot, FeeLedgerEntry, 
  PaymentRecord, ResultRecord, ComplaintRecord, NoticeRecord 
} from '../../shared/src/types';

interface DatabaseSchema {
  students: Student[];
  subjects: Subject[];
  timetable: TimetableSlot[];
  fees: {
    ledger: FeeLedgerEntry[];
    payments: PaymentRecord[];
  };
  results: ResultRecord[];
  complaints: ComplaintRecord[];
  notices: NoticeRecord[];
}

const DB_FILE = path.join(__dirname, '..', 'database.json');

const INITIAL_DATA: DatabaseSchema = {
  students: [
    {
      id: "student_arnav",
      enrolmentNo: "PIET25CS063",
      name: "Arnav Nagar",
      email: "arnav.nagar@poornima.org",
      phone: "+91 9030123456",
      dob: "06 July 2006",
      address: "Jaipur, Rajasthan",
      program: "B.Tech CSE - 3rd Year",
      semester: "3rd Sem",
      avatarUrl: "" // Will display initials fallback unless updated
    }
  ],
  subjects: [
    { id: "sub_dsa", name: "Data Structures & Algorithms", code: "DSA", semester: "3rd Sem", facultyName: "Bersha Kumari" },
    { id: "sub_uiux", name: "User Interface & Experience", code: "UI/UX", semester: "3rd Sem", facultyName: "Udbhav Ojha" },
    { id: "sub_aem", name: "Advanced Engineering Mathematics", code: "AEM", semester: "3rd Sem", facultyName: "Omprakash Sikhwal" },
    { id: "sub_dsld", name: "Digital System & Logic Design", code: "DSLD", semester: "3rd Sem", facultyName: "Ashwini kumar" },
    { id: "sub_tech_comm", name: "Technical Communication", code: "Tech. Comm.", semester: "3rd Sem", facultyName: "Prince Dawar" },
    { id: "sub_nsp", name: "Network Security & Protocols", code: "NSP", semester: "3rd Sem", facultyName: "Madhu Chaudhary" }
  ],
  timetable: [
    { id: "t1", day: "Monday", startTime: "08:00", endTime: "09:00", subjectId: "sub_dsa", subjectName: "Data Structures & Algorithms", subjectCode: "DSA", facultyName: "Bersha Kumari", room: "LT-101" },
    { id: "t2", day: "Monday", startTime: "09:00", endTime: "10:00", subjectId: "sub_uiux", subjectName: "User Interface & Experience", subjectCode: "UI/UX", facultyName: "Udbhav Ojha", room: "Lab-3" },
    { id: "t3", day: "Monday", startTime: "10:00", endTime: "11:00", subjectId: "sub_aem", subjectName: "Advanced Engineering Mathematics", subjectCode: "AEM", facultyName: "Omprakash Sikhwal", room: "LT-102" },
    { id: "t4", day: "Monday", startTime: "11:00", endTime: "12:00", subjectId: "sub_dsld", subjectName: "Digital System & Logic Design", subjectCode: "DSLD", facultyName: "Ashwini kumar", room: "LT-204" },
    { id: "t5", day: "Monday", startTime: "13:00", endTime: "14:00", subjectId: "sub_tech_comm", subjectName: "Technical Communication", subjectCode: "Tech. Comm.", facultyName: "Prince Dawar", room: "Seminar Hall-1" },
    { id: "t6", day: "Monday", startTime: "14:00", endTime: "15:00", subjectId: "sub_nsp", subjectName: "Network Security & Protocols", subjectCode: "NSP", facultyName: "Madhu Chaudhary", room: "LT-101" }
  ],
  fees: {
    ledger: [
      { id: "f1", particular: "Tuition Fee", total: 64390, paid: 64390, due: 0 },
      { id: "f2", particular: "Development Fee", total: 9999, paid: 9999, due: 0 },
      { id: "f3", particular: "Exam Fess", total: 5000, paid: 5000, due: 0 },
      { id: "f4", particular: "Other Fess", total: 4999, paid: 4999, due: 0 },
      { id: "f5", particular: "Hostel Fees", total: 21000, paid: 21000, due: 0 }
    ],
    payments: [
      { id: "p1", amount: 64390, method: "Net Banking", receiptUrl: "#", paidAt: "2026-06-15T10:30:00Z", status: "success", particular: "Tuition Fee" },
      { id: "p2", amount: 21000, method: "UPI", receiptUrl: "#", paidAt: "2026-06-16T14:45:00Z", status: "success", particular: "Hostel Fees" }
    ]
  },
  results: [
    { id: "r1", year: "1st Year", semester: "1st Sem (Odd)", status: "PASS", sgpa: 8.7, cgpa: 8.7, pdfUrl: "#" },
    { id: "r2", year: "1st Year", semester: "2nd Sem (Even)", status: "PASS", sgpa: 9.1, cgpa: 8.9, pdfUrl: "#" },
    { id: "r3", year: "2nd Year", semester: "3rd Sem (Odd)", status: "PASS", sgpa: 9.2, cgpa: 9.0, pdfUrl: "#" },
    { id: "r4", year: "2nd Year", semester: "4th Sem (Even)", status: "PENDING" }
  ],
  complaints: [
    {
      id: "c1",
      studentId: "student_arnav",
      studentName: "Arnav Nagar",
      category: "Infrastructure & Maintenance",
      description: "Water cooler not working in B-block. Requires immediate cleaning and repair.",
      status: "resolved",
      createdAt: "2026-07-18T10:15:00Z",
      resolvedAt: "2026-07-20T16:30:00Z",
      adminComment: "Technician visited and resolved the compressor issue. The cooler filter has been changed."
    },
    {
      id: "c2",
      studentId: "student_arnav",
      studentName: "Arnav Nagar",
      category: "Others",
      description: "Anti-ragging committee contacts need to be updated on notices.",
      status: "in_progress",
      createdAt: "2026-07-21T09:00:00Z"
    },
    {
      id: "c3",
      studentId: "student_arnav",
      studentName: "Arnav Nagar",
      category: "Wi-Fi & IT Issues",
      description: "Wi-fi issues in reading room. Signal is extremely weak or drops every few minutes.",
      status: "resolved",
      createdAt: "2026-07-22T11:45:00Z",
      resolvedAt: "2026-07-23T14:10:00Z",
      adminComment: "New access point configured and installed in reading room."
    }
  ],
  notices: [
    {
      id: "n1",
      title: "Notice regarding 75% Attendance Requirement",
      body: "Always attend all the classes as per the schedule. Students falling below 75% will be barred from final semester examinations.",
      category: "academic",
      publishedAt: "2026-07-20T08:00:00Z",
      expiresAt: "2026-08-20T00:00:00Z"
    },
    {
      id: "n2",
      title: "Cell Phone Usage Restrictions in Classroom",
      body: "Don't use mobile phones during the class. Strictly keep devices on silent or in lockers. Defaulters will be fined.",
      category: "general",
      publishedAt: "2026-07-19T09:00:00Z",
      expiresAt: "2026-08-19T00:00:00Z"
    },
    {
      id: "n3",
      title: "Medical Leave Policy Update",
      body: "Don't argue with teachers for medical leave. File formal applications with valid government doctor certificates at the administrative block.",
      category: "academic",
      publishedAt: "2026-07-18T10:00:00Z",
      expiresAt: "2026-08-18T00:00:00Z"
    },
    {
      id: "n4",
      title: "Escalation Matrix for Student Queries",
      body: "Write email to higher faculty for any query only after discussing with your Class Representative and Batch Coordinator.",
      category: "general",
      publishedAt: "2026-07-17T11:00:00Z",
      expiresAt: "2026-08-17T00:00:00Z"
    }
  ]
};

export class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = INITIAL_DATA;
    this.load();
  }

  private load() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const fileContent = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(fileContent);
      } catch (e) {
        console.error("Error reading database file, using fallback.", e);
        this.save();
      }
    } else {
      this.save();
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (e) {
      console.error("Error writing database file.", e);
    }
  }

  public getStudent(id: string): Student | undefined {
    return this.data.students.find(s => s.id === id);
  }

  public getStudentByEnrolment(enrolmentNo: string): Student | undefined {
    return this.data.students.find(s => s.enrolmentNo === enrolmentNo);
  }

  public getStudentByEmail(email: string): Student | undefined {
    return this.data.students.find(s => s.email.toLowerCase() === email.toLowerCase());
  }

  public getSubjects(): Subject[] {
    return this.data.subjects;
  }

  public getTimetable(): TimetableSlot[] {
    return this.data.timetable;
  }

  public getFees() {
    return this.data.fees;
  }

  public getResults(): ResultRecord[] {
    return this.data.results;
  }

  public getComplaints(): ComplaintRecord[] {
    return this.data.complaints;
  }

  public getComplaintsByStudent(studentId: string): ComplaintRecord[] {
    return this.data.complaints.filter(c => c.studentId === studentId);
  }

  public addComplaint(complaint: Omit<ComplaintRecord, 'id' | 'createdAt'>): ComplaintRecord {
    const newComplaint: ComplaintRecord = {
      ...complaint,
      id: "complaint_" + Date.now(),
      createdAt: new Date().toISOString(),
    };
    this.data.complaints.unshift(newComplaint);
    this.save();
    return newComplaint;
  }

  public getNotices(): NoticeRecord[] {
    return this.data.notices;
  }

  public updateStudentProfile(id: string, updates: Partial<Student>): Student | undefined {
    const student = this.getStudent(id);
    if (student) {
      Object.assign(student, updates);
      this.save();
      return student;
    }
    return undefined;
  }
}

export const db = new Database();
