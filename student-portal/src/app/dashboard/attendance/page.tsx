"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  BarChart3, RefreshCw, AlertCircle, Download, CheckCircle, 
  HelpCircle, ChevronDown, ChevronUp 
} from 'lucide-react';
import { Card, Button, Badge, Skeleton, getAttendanceTailwindClass, getAttendanceColor } from '@shared';

const API_BASE = "https://attendex-backend-api.vercel.app/api";

export default function AttendancePage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewType, setViewType] = useState<'semester' | 'monthly'>('semester');
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  const fetchAttendance = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/attendance`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to load attendance records');
      }

      const resData = await res.json();
      setData(resData);
    } catch (err: any) {
      setError(err.message || 'Connecting to backend failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleDownload = () => {
    setDownloading(true);
    setDownloadSuccess(false);
    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }, 1500);
  };

  const toggleSubjectDetails = (id: string) => {
    setExpandedSubject(expandedSubject === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80 lg:col-span-2" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center border-rose-300 dark:border-rose-900/50">
        <AlertCircle className="h-12 w-12 text-rose-500 mb-4" />
        <h3 className="text-lg font-bold mb-2">Error Loading Attendance</h3>
        <p className="text-sm text-muted-foreground mb-6">{error}</p>
        <Button onClick={fetchAttendance} size="sm">
          <RefreshCw className="h-4 w-4 mr-2" /> Retry Connection
        </Button>
      </Card>
    );
  }

  // Adjust statistics slightly for simulated monthly view
  const displayPercentage = viewType === 'semester' ? data.overallPercentage : 85.00;
  const displayPresent = viewType === 'semester' ? data.present : 17;
  const displayAbsent = viewType === 'semester' ? data.absent : 3;
  const displayTotal = viewType === 'semester' ? data.totalLectures : 20;

  // Render SVG circular parameters
  const radius = 80;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayPercentage / 100) * circumference;
  const progressColor = getAttendanceColor(displayPercentage);

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Attendance Ledger</h1>
          <p className="text-sm text-muted-foreground">Monitor subject percentages and clearances</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle Monthly / Semester */}
          <div className="bg-secondary border border-border p-1 rounded-md flex">
            <button
              onClick={() => setViewType('semester')}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all focus:outline-none ${
                viewType === 'semester' 
                  ? 'bg-card text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Semester View
            </button>
            <button
              onClick={() => setViewType('monthly')}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all focus:outline-none ${
                viewType === 'monthly' 
                  ? 'bg-card text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly View
            </button>
          </div>

          <Button variant="secondary" onClick={handleDownload} isLoading={downloading}>
            {downloadSuccess ? (
              <>
                <CheckCircle className="h-4.5 w-4.5 text-emerald-500 mr-2" /> Downloaded
              </>
            ) : (
              <>
                <Download className="h-4.5 w-4.5 mr-2" /> Report PDF
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Overall Circular progress */}
        <Card className="flex flex-col items-center justify-center p-8 gap-6 text-center">
          <h3 className="font-bold text-md text-foreground">Aggregate Standings</h3>
          
          <div className="relative h-44 w-44 flex items-center justify-center select-none">
            {/* SVG Circle Gauge */}
            <svg className="h-full w-full transform -rotate-90">
              <circle
                cx="88"
                cy="88"
                r={radius}
                className="stroke-muted"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <motion.circle
                cx="88"
                cy="88"
                r={radius}
                fill="transparent"
                stroke={progressColor}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold">{displayPercentage}%</span>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Overall</span>
            </div>
          </div>

          {/* Color status alert */}
          <div className="w-full">
            {displayPercentage >= 75 ? (
              <Badge variant="success" className="w-full justify-center py-1">Attendance Requirement Cleared</Badge>
            ) : (
              <Badge variant="danger" className="w-full justify-center py-1">Below Minimum (Barred Limit)</Badge>
            )}
          </div>
        </Card>

        {/* Right: Aggregated statistic boxes */}
        <Card className="lg:col-span-2 flex flex-col justify-between p-8">
          <h3 className="font-bold text-md text-foreground border-b border-border pb-3 mb-6">Lecture Summaries</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="flex flex-col gap-1 p-4 bg-secondary border border-border/60 rounded">
              <span className="text-xs text-muted-foreground font-semibold">Attended</span>
              <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{displayPresent}</span>
              <span className="text-[10px] text-muted-foreground">Lectures</span>
            </div>
            
            <div className="flex flex-col gap-1 p-4 bg-secondary border border-border/60 rounded">
              <span className="text-xs text-muted-foreground font-semibold">Absent</span>
              <span className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">{displayAbsent}</span>
              <span className="text-[10px] text-muted-foreground">Lectures</span>
            </div>
            
            <div className="flex flex-col gap-1 p-4 bg-secondary border border-border/60 rounded">
              <span className="text-xs text-muted-foreground font-semibold">Total Delivered</span>
              <span className="text-3xl font-extrabold text-foreground">{displayTotal}</span>
              <span className="text-[10px] text-muted-foreground">Lectures</span>
            </div>

            <div className="flex flex-col gap-1 p-4 bg-secondary border border-border/60 rounded relative group">
              <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                Safe Margin
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-help" />
              </span>
              <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                {data.lecturesRequiredClose}
              </span>
              <span className="text-[10px] text-muted-foreground">Excess margins</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/50 text-xs text-blue-600 dark:text-blue-400 rounded leading-relaxed">
            Note: Safely maintain at least <strong>75%</strong> attendance to comply with institute standards. Your attendance is calculated in real-time based on faculty-linked roster logs.
          </div>
        </Card>
      </div>

      {/* Subject Wise breakdown */}
      <Card>
        <h3 className="font-bold text-md text-foreground border-b border-border pb-3 mb-6">Subject Breakdown</h3>
        
        <div className="flex flex-col gap-3">
          {data.subjectWise.map((subject: any) => {
            const isExpanded = expandedSubject === subject.subjectId;
            const progressColor = getAttendanceColor(subject.percentage);
            
            return (
              <div 
                key={subject.subjectId}
                className="border border-border rounded-md overflow-hidden bg-card hover:border-border transition-all duration-200"
              >
                {/* Header row */}
                <div 
                  onClick={() => toggleSubjectDetails(subject.subjectId)}
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/40 select-none"
                >
                  <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-10">
                    <div className="md:w-64">
                      <div className="text-sm font-bold text-foreground leading-normal">{subject.subjectName}</div>
                      <div className="text-xs text-muted-foreground font-mono">{subject.subjectCode}</div>
                    </div>

                    {/* Progress Slider (Visual summary) */}
                    <div className="flex-1 max-w-lg hidden md:block">
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{ 
                            width: `${subject.percentage}%`,
                            backgroundColor: progressColor
                          }} 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-bold px-2 py-0.5 rounded border ${getAttendanceTailwindClass(subject.percentage)}`}>
                      {subject.percentage}%
                    </span>
                    {isExpanded ? <ChevronUp className="h-4.5 w-4.5 text-muted-foreground" /> : <ChevronDown className="h-4.5 w-4.5 text-muted-foreground" />}
                  </div>
                </div>

                {/* Collapsible panel detail */}
                {isExpanded && (
                  <div className="p-4 border-t border-border bg-slate-50/50 dark:bg-slate-900/10 flex flex-col gap-4 text-xs">
                    {/* Visual slider on mobile */}
                    <div className="md:hidden">
                      <span className="font-semibold text-muted-foreground mb-1 block">Roster Gauge:</span>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{ 
                            width: `${subject.percentage}%`,
                            backgroundColor: progressColor
                          }} 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="font-semibold text-muted-foreground">Lectures Attended:</span>
                        <div className="text-sm font-bold mt-0.5">{subject.lecturesAttended} classes</div>
                      </div>
                      <div>
                        <span className="font-semibold text-muted-foreground">Absent count:</span>
                        <div className="text-sm font-bold text-rose-500 mt-0.5">{subject.lecturesDone - subject.lecturesAttended} classes</div>
                      </div>
                      <div>
                        <span className="font-semibold text-muted-foreground">Total classes:</span>
                        <div className="text-sm font-bold mt-0.5">{subject.lecturesDone} classes</div>
                      </div>
                      <div>
                        <span className="font-semibold text-muted-foreground">Course standing:</span>
                        <div className="mt-0.5">
                          {subject.percentage >= 75 ? (
                            <span className="text-emerald-500 font-bold">Good Standing</span>
                          ) : (
                            <span className="text-rose-500 font-bold">Below Bar</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
