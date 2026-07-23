"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  BarChart3, Calendar, CreditCard, Award, MessageSquare, AlertCircle,
  TrendingUp, Play, Bell, CalendarDays, ExternalLink, RefreshCw 
} from 'lucide-react';
import { Card, Button, Skeleton, getAttendanceTailwindClass, formatCurrency, formatDate } from '@shared';

const API_BASE = "http://localhost:5000/api";

export default function DashboardHome() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const resData = await res.json();
      setData(resData);
    } catch (err: any) {
      setError(err.message || 'Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-24" />
        </div>
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-72 lg:col-span-2" />
          <Skeleton className="h-72" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center border-rose-300 dark:border-rose-900/50">
        <AlertCircle className="h-12 w-12 text-rose-500 mb-4" />
        <h3 className="text-lg font-bold mb-2">Error Loading Dashboard</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">{error}</p>
        <Button onClick={fetchDashboardData} size="sm">
          <RefreshCw className="h-4 w-4 mr-2" /> Retry Connection
        </Button>
      </Card>
    );
  }

  const { student, attendanceSummary, coursesCount, feeDues, todaySchedule, recentNotices, upcomingEvents } = data;

  return (
    <div className="flex flex-col gap-6">
      
      {/* ========================================== */}
      {/* Header Banner                              */}
      {/* ========================================== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Academic Dashboard</h1>
          <p className="text-xs text-muted-foreground">Logged in as {student.enrolmentNo}</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-xs font-semibold hover:bg-secondary rounded-sm transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh Data
        </button>
      </div>

      {/* ========================================== */}
      {/* Welcome Banner Card                        */}
      {/* ========================================== */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-primary text-white border-primary relative overflow-hidden p-8 flex items-center justify-between">
          {/* Decorative glows */}
          <div className="absolute right-0 top-0 bottom-0 w-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute right-12 top-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="h-16 w-16 rounded-full bg-white/10 text-white flex items-center justify-center font-black text-2xl border border-white/20">
              {student.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold mb-1">Welcome back, {student.name}!</h2>
              <p className="text-xs text-slate-300 font-medium">
                {student.program} • {student.semester}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider bg-white/10 border border-white/10 px-2.5 py-1 rounded">
                PIET Academic Portal
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ========================================== */}
      {/* Key Metrics Grid                           */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Attendance Card */}
        <Link href="/dashboard/attendance">
          <Card hoverEffect className="h-28 flex justify-between items-center group">
            <div className="flex flex-col justify-between h-full">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Attendance</span>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold px-2 py-0.5 rounded-sm border ${getAttendanceTailwindClass(attendanceSummary.overallPercentage)}`}>
                  {attendanceSummary.overallPercentage}%
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground">Month: {attendanceSummary.monthPercentage}%</span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-sm bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform border border-border">
              <BarChart3 className="h-5 w-5" />
            </div>
          </Card>
        </Link>

        {/* Registered Courses Card */}
        <Link href="/dashboard/timetable">
          <Card hoverEffect className="h-28 flex justify-between items-center group">
            <div className="flex flex-col justify-between h-full">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Courses</span>
              <span className="text-3xl font-extrabold">{coursesCount} Subjects</span>
            </div>
            <div className="h-10 w-10 rounded-sm bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform border border-border">
              <Calendar className="h-5 w-5" />
            </div>
          </Card>
        </Link>

        {/* Fees Due Card */}
        <Link href="/dashboard/fees">
          <Card hoverEffect className={`h-28 flex justify-between items-center group ${feeDues > 0 ? 'border-rose-300 dark:border-rose-950/50' : ''}`}>
            <div className="flex flex-col justify-between h-full">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fees Status</span>
              <span className={`text-2xl font-extrabold ${feeDues > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {feeDues > 0 ? `${formatCurrency(feeDues)} Due` : "No Dues"}
              </span>
            </div>
            <div className={`h-10 w-10 rounded-sm flex items-center justify-center group-hover:scale-105 transition-transform border border-border ${
              feeDues > 0 
                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400' 
                : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
            }`}>
              <CreditCard className="h-5 w-5" />
            </div>
          </Card>
        </Link>

        {/* Results CGPA Card */}
        <Link href="/dashboard/results">
          <Card hoverEffect className="h-28 flex justify-between items-center group">
            <div className="flex flex-col justify-between h-full">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Academic Grade</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold">9.0</span>
                <span className="text-xs font-semibold text-muted-foreground">CGPA</span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-sm bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform border border-border">
              <Award className="h-5 w-5" />
            </div>
          </Card>
        </Link>
      </div>

      {/* ========================================== */}
      {/* Secondary Layout Content                   */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Notices & Timetable slots */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Notice Board */}
          <Card className="flex-1 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Bell className="h-4.5 w-4.5 text-primary dark:text-foreground" />
                <h3 className="font-bold text-md">Campus Notice Board</h3>
              </div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground select-none">Pinned Announcements</span>
            </div>

            <div className="flex flex-col gap-3.5">
              {recentNotices.map((notice: any) => (
                <div 
                  key={notice.id} 
                  className="flex flex-col gap-1.5 p-3.5 border border-border/70 rounded bg-slate-50/50 dark:bg-slate-900/30 hover:border-border transition-colors group"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="text-sm font-bold text-foreground group-hover:text-primary dark:group-hover:text-white transition-colors">
                      {notice.title}
                    </h4>
                    <span className="text-[10px] font-semibold text-muted-foreground shrink-0 uppercase">
                      {formatDate(notice.publishedAt)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{notice.body}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Today's Schedule List */}
          <Card>
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4.5 w-4.5 text-primary dark:text-foreground" />
                <h3 className="font-bold text-md">Today's Lectures</h3>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-sm">Active Day</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {todaySchedule.map((slot: any) => (
                <div 
                  key={slot.id} 
                  className="flex items-center justify-between p-3.5 border border-border/60 rounded hover:border-border transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="font-mono text-xs font-bold text-muted-foreground w-20">
                      {slot.startTime} - {slot.endTime}
                    </div>
                    <div>
                      <div className="text-sm font-bold">{slot.subjectName}</div>
                      <div className="text-xs text-muted-foreground">{slot.facultyName} • {slot.room}</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold tracking-wider px-2 py-0.5 bg-secondary border border-border rounded uppercase">
                    {slot.subjectCode}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column: Upcoming Events & Quick Actions */}
        <div className="flex flex-col gap-6">
          
          {/* Quick Actions Panel */}
          <Card>
            <h3 className="font-bold text-md border-b border-border pb-3 mb-4">Quick Operations</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/dashboard/complaints">
                <button className="flex flex-col items-center justify-center gap-2 p-4 border border-border/80 hover:bg-secondary rounded hover:border-border transition-all w-full text-center group cursor-pointer focus:outline-none">
                  <MessageSquare className="h-5 w-5 text-slate-500 group-hover:scale-105 transition-transform" />
                  <span className="text-xs font-semibold">Raise Ticket</span>
                </button>
              </Link>

              <Link href="/dashboard/fees">
                <button className="flex flex-col items-center justify-center gap-2 p-4 border border-border/80 hover:bg-secondary rounded hover:border-border transition-all w-full text-center group cursor-pointer focus:outline-none">
                  <CreditCard className="h-5 w-5 text-slate-500 group-hover:scale-105 transition-transform" />
                  <span className="text-xs font-semibold">Settle Dues</span>
                </button>
              </Link>

              <Link href="/dashboard/timetable">
                <button className="flex flex-col items-center justify-center gap-2 p-4 border border-border/80 hover:bg-secondary rounded hover:border-border transition-all w-full text-center group cursor-pointer focus:outline-none">
                  <Calendar className="h-5 w-5 text-slate-500 group-hover:scale-105 transition-transform" />
                  <span className="text-xs font-semibold">Timetables</span>
                </button>
              </Link>

              <Link href="/dashboard/results">
                <button className="flex flex-col items-center justify-center gap-2 p-4 border border-border/80 hover:bg-secondary rounded hover:border-border transition-all w-full text-center group cursor-pointer focus:outline-none">
                  <Award className="h-5 w-5 text-slate-500 group-hover:scale-105 transition-transform" />
                  <span className="text-xs font-semibold">View Marks</span>
                </button>
              </Link>
            </div>
          </Card>

          {/* Upcoming Campus Events */}
          <Card className="flex-1">
            <h3 className="font-bold text-md border-b border-border pb-3 mb-4">Upcoming Events</h3>
            <div className="flex flex-col gap-4">
              {upcomingEvents.map((event: any, i: number) => (
                <div key={i} className="flex gap-3">
                  <div className="h-10 w-10 bg-primary/5 text-primary dark:text-foreground shrink-0 rounded flex flex-col justify-center items-center border border-border select-none">
                    <span className="text-[10px] font-bold uppercase">{event.date.split('-')[1]}</span>
                    <span className="text-sm font-extrabold leading-none">{event.date.split('-')[2]}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground leading-normal">{event.title}</h4>
                    <div className="text-[10px] text-muted-foreground font-medium mt-0.5">
                      {event.time} • {event.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
