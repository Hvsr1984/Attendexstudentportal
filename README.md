# Attendex — Student Attendance & Analytics Portal

An enterprise-grade, full-stack student attendance portal and analytics dashboard designed for academic institutions to monitor attendance criteria, predict shortages, and empower students with real-time academic tracking.

---

## 📌 Overview

**Attendex** is engineered to eliminate uncertainty around student attendance. Built as a high-performance monorepo, it pairs a modern Next.js 16 web application with a secure Express/TypeScript backend and Firebase cloud services. Students can monitor aggregate and subject-specific attendance percentages, visualize historical trends, and stay ahead of mandatory eligibility thresholds.

---

## ✨ Features

- **Real-Time Attendance Metrics:** Instant calculation of overall attendance percentage against institutional criteria.
- **Subject-Wise Breakdown:** Granular visibility into individual courses, lectures attended, and classes conducted.
- **Interactive Visualizations:** Historical trend analysis and visual indicators powered by Recharts.
- **Secure Authentication:** Firebase authentication and JWT-backed session control with role separation.
- **Fluid User Interface:** Responsive, accessible interface built with Tailwind CSS v4 and Framer Motion micro-interactions.
- **Automated Threshold Warnings:** Visual alerts when attendance drops near or below mandatory thresholds (e.g., 75%).

---

## 🛠️ Tech Stack

### Frontend (`student-portal`)
- **Framework:** Next.js 16 (App Router) + React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Charts & UI:** Recharts, Lucide React, Framer Motion
- **Client Auth:** Firebase SDK v12

### Backend (`backend`)
- **Runtime:** Node.js + Express
- **Language:** TypeScript
- **Admin Services:** Firebase Admin SDK v14
- **Security:** JSON Web Tokens (JWT), bcryptjs, CORS

---

## 🚀 Live Demo

- **Live Web Application:** [https://attendex-student.vercel.app](https://attendex-student.vercel.app)

---

## 📂 Project Structure

```
Attendexstudentportal/
├── student-portal/          # Next.js 16 frontend web application
│   ├── src/app/             # App router pages (dashboard, login, profile)
│   ├── public/              # Static assets and icons
│   └── package.json         # Frontend dependencies
├── backend/                 # Node.js + Express API backend
│   ├── src/                 # TypeScript controllers, routes, and services
│   └── package.json         # Backend dependencies
├── shared/                  # Shared TypeScript interfaces and types
├── package.json             # Root monorepo workspace configuration
└── vercel.json              # Vercel deployment configuration
```

---

## 💻 Installation & Local Setup

### Prerequisites
- Node.js (v18.x or later)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/Hvsr1984/Attendexstudentportal.git
cd Attendexstudentportal
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file inside `student-portal/` with your Firebase project credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run Development Servers
**Frontend:**
```bash
cd student-portal
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

**Backend:**
```bash
cd ../backend
npm run dev
```

---

## 🔮 Future Improvements

- [ ] Automated push notifications and timetable schedule integration
- [ ] Exportable attendance compliance reports (PDF/Excel)
- [ ] Faculty portal integration for direct roll-call marking

---

## 👤 Author

**Harshvardhan Singh Rajawat**  
*CSE Student • Web Developer • AI Builder*  
Poornima Institute of Engineering and Technology, Jaipur

- **GitHub:** [@Hvsr1984](https://github.com/Hvsr1984)
- **Live Demo:** [attendex-student.vercel.app](https://attendex-student.vercel.app)
- **Email:** [2025pietcsharshvardhan063@poornima.org](mailto:2025pietcsharshvardhan063@poornima.org)