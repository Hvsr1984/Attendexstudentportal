"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Sun, Moon, Bell, Search, LogOut, ChevronRight,
  LayoutDashboard, Calendar, CreditCard, Award, MessageSquare, User, ChevronLeft
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Badge, Button, ERP_CONFIG } from '@shared';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  // Responsive state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Desktop default
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [student, setStudent] = useState<any>(null);

  // Dropdowns state
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([
    "Your complaint #c1 has been updated to Resolved.",
    "First semester Results have been published.",
    "Fee payment of Tuition Fee (INR 64,390) was successful."
  ]);

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
    } else {
      if (userJson) {
        // Fetch student detail from local storage cache or API
        const user = JSON.parse(userJson);
        setStudent(user);
      }
      setMounted(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const navItems: SidebarItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Attendance', href: '/dashboard/attendance', icon: BarChart3 },
    { name: 'Timetable', href: '/dashboard/timetable', icon: Calendar },
    { name: 'Fees Details', href: '/dashboard/fees', icon: CreditCard },
    { name: 'Academic Result', href: '/dashboard/results', icon: Award },
    { name: 'Complaints', href: '/dashboard/complaints', icon: MessageSquare },
    { name: 'Profile', href: '/dashboard/profile', icon: User }
  ];

  // Helper custom icon for Attendance (BarChart3 replacement since we import it as BarChart3)
  // Let's declare BarChart3 inline or import it
  function BarChart3(props: any) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path d="M3 3v18h18" />
        <path d="M18 17V9" />
        <path d="M13 17V5" />
        <path d="M8 17v-3" />
      </svg>
    );
  }

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      
      {/* ========================================== */}
      {/* MOBILE DRAWER BACKDROP & SIDEBAR           */}
      {/* ========================================== */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            {/* Sidebar drawer content */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
              className="fixed top-0 bottom-0 left-0 w-70 bg-card border-r border-border flex flex-col justify-between shadow-2xl p-6"
            >
              <div className="flex flex-col gap-8">
                {/* Logo and close btn */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-extrabold text-sm border border-emerald-500">
                      A
                    </div>
                    <span className="font-extrabold tracking-tight text-md">{ERP_CONFIG.appName}</span>
                  </div>
                  <button 
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary focus:outline-none"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link 
                        key={item.name} 
                        href={item.href}
                        onClick={() => setIsMobileDrawerOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-semibold border transition-all ${
                          isActive 
                            ? 'bg-primary text-white border-primary shadow-sm' 
                            : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary'
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom profile info */}
              <div className="border-t border-border pt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {student ? student.name.split(' ').map((n: string) => n[0]).join('') : 'U'}
                  </div>
                  <div>
                    <div className="text-sm font-bold truncate max-w-36">{student?.name || 'Loading...'}</div>
                    <div className="text-xs text-muted-foreground">Student</div>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-muted-foreground hover:text-rose-600 rounded-full hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-colors"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* DESKTOP SIDEBAR (Static/Collapsible)       */}
      {/* ========================================== */}
      <aside 
        className={`hidden lg:flex flex-col justify-between shrink-0 bg-card border-r border-border transition-all duration-300 p-6 relative ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-8 -right-3 h-6 w-6 bg-card border border-border rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground shadow-sm cursor-pointer z-10"
        >
          {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        <div className="flex flex-col gap-10">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 select-none">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-extrabold text-sm border border-emerald-500 shadow-sm shrink-0">
              A
            </div>
            {isSidebarOpen && (
              <span className="font-extrabold tracking-tight text-md text-primary dark:text-foreground">
                {ERP_CONFIG.appName}
              </span>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-semibold border transition-all ${
                    isActive 
                      ? 'bg-primary text-white border-primary shadow-sm' 
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary'
                  } ${!isSidebarOpen ? 'justify-center' : ''}`}
                  title={!isSidebarOpen ? item.name : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {isSidebarOpen && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card */}
        <div className="border-t border-border pt-4 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-9 w-9 rounded-full bg-primary/10 text-primary dark:text-white flex items-center justify-center font-bold text-sm shrink-0">
              {student ? student.name.split(' ').map((n: string) => n[0]).join('') : 'U'}
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <div className="text-sm font-bold truncate max-w-32">{student?.name || 'Loading...'}</div>
                <div className="text-xs text-muted-foreground truncate">PIET25CS063</div>
              </div>
            )}
          </div>
          {isSidebarOpen && (
            <button 
              onClick={handleLogout}
              className="p-2 text-muted-foreground hover:text-rose-600 rounded-full hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          )}
        </div>
      </aside>

      {/* ========================================== */}
      {/* MAIN CONTAINER (Navbar + Canvas Content)   */}
      {/* ========================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between relative z-20">
          <div className="flex items-center gap-4">
            {/* Hamburger trigger on mobile */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary lg:hidden focus:outline-none"
            >
              <Menu className="h-5.5 w-5.5" />
            </button>

            {/* Search Input Mock */}
            <div className="hidden sm:flex items-center gap-2 bg-secondary border border-border rounded-sm px-3 py-1.5 w-64 max-w-full">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input 
                type="text" 
                placeholder="Search ERP (e.g. results...)" 
                className="bg-transparent border-none text-xs focus:outline-none text-foreground placeholder:text-muted-foreground w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 relative">
            {/* Light/Dark Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notification Badge Bell */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors relative"
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 border border-white" />
                )}
              </button>

              {/* Notification Popover Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-md shadow-2xl p-4 z-20 flex flex-col gap-3"
                    >
                      <div className="flex justify-between items-center border-b border-border pb-2">
                        <span className="font-bold text-sm">Notifications</span>
                        <Badge variant="danger">{notifications.length}</Badge>
                      </div>
                      
                      <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notif, index) => (
                            <div key={index} className="text-xs p-2 rounded-sm bg-secondary border border-border/50 text-foreground leading-normal">
                              {notif}
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-muted-foreground py-4 text-center">No new notifications</div>
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <button 
                          onClick={() => setNotifications([])}
                          className="text-center text-xs font-bold text-primary dark:text-white pt-2 hover:underline focus:outline-none"
                        >
                          Clear all
                        </button>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown Trigger */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-1.5 hover:bg-secondary rounded-full border border-transparent hover:border-border transition-all"
              >
                <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  {student ? student.name.split(' ').map((n: string) => n[0]).join('') : 'U'}
                </div>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-md shadow-2xl p-2 z-20 flex flex-col gap-1"
                    >
                      <div className="px-3 py-2 border-b border-border/80 mb-1">
                        <div className="text-sm font-bold text-foreground">{student?.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{student?.email}</div>
                      </div>
                      
                      <Link 
                        href="/dashboard/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary rounded-sm transition-colors"
                      >
                        <User className="h-4 w-4" /> Account Settings
                      </Link>

                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-sm transition-colors text-left"
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Inner Content Canvas with Scroll */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
