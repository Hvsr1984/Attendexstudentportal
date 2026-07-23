"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CalendarDays, AlertCircle, RefreshCw, Clock, MapPin, User, Bookmark 
} from 'lucide-react';
import { Card, Button, Skeleton } from '@shared';

const API_BASE = "https://attendex-backend-api.vercel.app/api";
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function TimetablePage() {
  const router = useRouter();
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeDay, setActiveDay] = useState('Monday');

  const fetchTimetable = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/timetable`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to load timetable slots');
      }

      const data = await res.json();
      setSchedule(data);
    } catch (err: any) {
      setError(err.message || 'Connecting to backend failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-full animate-pulse" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center border-rose-300 dark:border-rose-900/50">
        <AlertCircle className="h-12 w-12 text-rose-500 mb-4" />
        <h3 className="text-lg font-bold mb-2">Error Loading Timetable</h3>
        <p className="text-sm text-muted-foreground mb-6">{error}</p>
        <Button onClick={fetchTimetable} size="sm">
          <RefreshCw className="h-4 w-4 mr-2" /> Retry Connection
        </Button>
      </Card>
    );
  }

  // Filter slots for the active day and sort them by starting time
  const daySlots = schedule
    .filter(slot => slot.day.toLowerCase() === activeDay.toLowerCase())
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Helper color map based on subject codes
  const getSubjectColorClass = (code: string) => {
    const maps: { [key: string]: string } = {
      DSA: "border-l-4 border-l-blue-500 bg-blue-50/30 text-blue-900 dark:text-blue-200 dark:bg-blue-950/10",
      "UI/UX": "border-l-4 border-l-purple-500 bg-purple-50/30 text-purple-900 dark:text-purple-200 dark:bg-purple-950/10",
      AEM: "border-l-4 border-l-amber-500 bg-amber-50/30 text-amber-900 dark:text-amber-200 dark:bg-amber-950/10",
      DSLD: "border-l-4 border-l-emerald-500 bg-emerald-50/30 text-emerald-900 dark:text-emerald-200 dark:bg-emerald-950/10",
      "Tech. Comm.": "border-l-4 border-l-pink-500 bg-pink-50/30 text-pink-900 dark:text-pink-200 dark:bg-pink-950/10",
      NSP: "border-l-4 border-l-rose-500 bg-rose-50/30 text-rose-900 dark:text-rose-200 dark:bg-rose-950/10",
    };
    return maps[code] || "border-l-4 border-l-slate-400 bg-slate-50 text-slate-900 dark:text-slate-200 dark:bg-slate-900/40";
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Weekly Timetable</h1>
          <p className="text-sm text-muted-foreground">Semester timetable schedule and class mappings</p>
        </div>
        <button 
          onClick={fetchTimetable}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-xs font-semibold hover:bg-secondary rounded-sm transition-colors w-fit"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Reload Slots
        </button>
      </div>

      {/* Weekday Switcher tabs */}
      <div className="w-full overflow-x-auto bg-card border border-border p-1.5 rounded-md flex gap-2">
        {WEEKDAYS.map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-4 py-2 rounded-sm text-xs font-bold transition-all focus:outline-none shrink-0 ${
              activeDay === day 
                ? 'bg-primary text-white shadow-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Timetable Slots Listing */}
      <Card className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
          <h3 className="font-bold text-md text-foreground flex items-center gap-2">
            <CalendarDays className="h-4.5 w-4.5 text-primary dark:text-foreground" />
            Lectures for {activeDay}
          </h3>
          <span className="text-[10px] font-bold text-muted-foreground uppercase select-none">
            {daySlots.length} Scheduled classes
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {daySlots.length > 0 ? (
            daySlots.map((slot) => (
              <div 
                key={slot.id}
                className={`p-5 rounded-md border border-border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${getSubjectColorClass(slot.subjectCode)}`}
              >
                {/* Details layout */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-10">
                  
                  {/* Time info */}
                  <div className="flex items-center gap-2 font-mono text-sm font-bold w-40 shrink-0">
                    <Clock className="h-4.5 w-4.5 opacity-60" />
                    <span>{slot.startTime} - {slot.endTime}</span>
                  </div>

                  {/* Subject Details */}
                  <div>
                    <h4 className="text-md font-bold leading-normal">{slot.subjectName}</h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1.5 font-medium">
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5 shrink-0" /> {slot.facultyName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 shrink-0" /> Classroom {slot.room}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subject tag */}
                <div className="flex items-center gap-2 font-bold text-xs select-none">
                  <Bookmark className="h-3.5 w-3.5 opacity-65" />
                  <span className="uppercase">{slot.subjectCode}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground gap-3">
              <CalendarDays className="h-10 w-10 opacity-30" />
              <div>
                <p className="text-sm font-bold">No lectures scheduled</p>
                <p className="text-xs">There are no classes published for {activeDay}. Enjoy your break!</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
