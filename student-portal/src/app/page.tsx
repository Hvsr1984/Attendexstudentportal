"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, CheckCircle2, ChevronDown, ShieldCheck, 
  BarChart3, Calendar, CreditCard, Award, MessageSquare, Moon, Sun 
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Card, Button } from '@shared';

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const features = [
    {
      icon: BarChart3,
      title: "Real-Time Attendance",
      desc: "Instant visibility into overall percentage and class summaries. Get notified when close to limits."
    },
    {
      icon: Calendar,
      title: "Intelligent Timetable",
      desc: "Live daily schedules detailing lecture topics, faculty profiles, and classroom allocations."
    },
    {
      icon: CreditCard,
      title: "Transparent Ledger",
      desc: "Itemized billing structure, real-time payment gateway triggers, and immediate receipt downloads."
    },
    {
      icon: Award,
      title: "Academic Performance",
      desc: "Visual trackers mapping semester SGPAs, cumulative CGPA growth, and RTU-affiliated marksheets."
    },
    {
      icon: MessageSquare,
      title: "Grievance Redressal",
      desc: "Submit complaints and suggestions with visual status tags (Pending, In Progress, Resolved) and notifications."
    },
    {
      icon: ShieldCheck,
      title: "Google Single Sign-On",
      desc: "Link your identity safely to your institute email and log in securely without password fatigue."
    }
  ];

  const stats = [
    { value: "99.9%", label: "System Uptime" },
    { value: "20k+", label: "Active Enrolments" },
    { value: "< 15 Min", label: "Attendance Sync Lag" },
    { value: "5 Days", label: "Avg Complaint Resolution" }
  ];

  const faqs = [
    {
      q: "How do I log in for the first time?",
      a: "Click on 'Access Portal', select 'Sign in with Google' using your student email. If your Google ID is not linked yet, you will be prompted to enter your Enrolment Number (e.g. PIET25CS063) and DOB to verify your identity. Once matched, it will be linked permanently."
    },
    {
      q: "What is the minimum attendance requirement?",
      a: "As per Rajasthan Technical University (RTU) guidelines, you must maintain at least 75% overall attendance. The portal displays a warning in amber if your attendance falls below 75%, and red if it drops below 65%."
    },
    {
      q: "Is my personal data secure on the ERP?",
      a: "Yes. All personal data, including contact details and address records, are encrypted at rest and masked in server logs. Authentic access is restricted via JWT tokens with strict Role-Based Access Control (RBAC)."
    },
    {
      q: "Can I pay my fees directly through the website?",
      a: "Yes, any outstanding dues on your Fee Details page link directly to the secure institute payment gateway. Once processed, your ledger updates instantly and a receipt becomes available for download."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Floating Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border glass transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo Emblem */}
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-extrabold text-sm border border-emerald-500 shadow-sm">
              A
            </div>
            <span className="font-extrabold tracking-tight text-lg text-primary dark:text-foreground">
              ATTENDEX
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#stats" className="hover:text-primary transition-colors">Metrics</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQs</a>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link href="/login">
              <Button size="sm">
                Access Portal <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[90px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary border border-border text-xs font-semibold text-muted-foreground mb-6"
          >
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            Empowering Poornima Institute Students
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-[1.15] mb-6"
          >
            Smart Attendance & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 dark:from-white dark:to-slate-400">
              Campus Management
            </span> System
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
          >
            A unified student academic companion portal. Track lectures, check fee breaks, download transcripts, and submit complaints on a single, secure SaaS dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Sign In to Student Portal <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Explore Features
              </Button>
            </a>
          </motion.div>

          {/* Animated Dashboard Mockup Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="w-full max-w-4xl mt-16 p-2 rounded-xl bg-slate-900/5 dark:bg-slate-900/40 border border-border/80 shadow-2xl glass overflow-hidden relative group"
          >
            <div className="absolute top-0 inset-x-0 h-10 bg-slate-100 dark:bg-slate-900 border-b border-border/60 flex items-center px-4 gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500" />
              <span className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono text-muted-foreground ml-4 select-none">attendex.poornima.org/dashboard</span>
            </div>
            
            <div className="pt-10 select-none">
              <div className="bg-background min-h-[400px] p-6 text-left flex flex-col gap-6">
                {/* Header Mock */}
                <div className="flex justify-between items-center pb-6 border-b border-border/60">
                  <div>
                    <div className="h-6 w-36 bg-muted rounded mb-2" />
                    <div className="h-3 w-48 bg-muted/65 rounded" />
                  </div>
                  <div className="h-9 w-9 rounded-full bg-primary/20" />
                </div>
                
                {/* Grid Content Mock */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-card border border-border rounded p-4 h-36 flex flex-col justify-between">
                    <div className="h-4 w-28 bg-muted rounded" />
                    <div className="flex items-baseline gap-2">
                      <div className="h-8 w-16 bg-emerald-500/20 text-emerald-600 rounded flex items-center justify-center font-bold text-lg">87.7%</div>
                      <div className="h-3 w-16 bg-muted rounded" />
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded p-4 h-36 flex flex-col justify-between">
                    <div className="h-4 w-28 bg-muted rounded" />
                    <div className="flex items-baseline gap-2">
                      <div className="h-8 w-12 bg-muted rounded" />
                      <div className="h-3 w-20 bg-muted rounded" />
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded p-4 h-36 flex flex-col justify-between">
                    <div className="h-4 w-28 bg-muted rounded" />
                    <div className="flex items-baseline gap-2">
                      <div className="h-8 w-24 bg-muted rounded" />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                  <div className="bg-card border border-border rounded p-4 h-48">
                    <div className="h-4.5 w-32 bg-muted rounded mb-4" />
                    <div className="space-y-2.5">
                      <div className="h-3.5 w-full bg-muted/60 rounded" />
                      <div className="h-3.5 w-5/6 bg-muted/60 rounded" />
                      <div className="h-3.5 w-4/5 bg-muted/60 rounded" />
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded p-4 h-48 flex flex-col gap-3">
                    <div className="h-4.5 w-32 bg-muted rounded mb-1" />
                    <div className="flex justify-between items-center"><div className="h-3.5 w-24 bg-muted rounded" /><div className="h-3 w-12 bg-emerald-500/20 rounded" /></div>
                    <div className="flex justify-between items-center"><div className="h-3.5 w-32 bg-muted rounded" /><div className="h-3 w-12 bg-amber-500/20 rounded" /></div>
                    <div className="flex justify-between items-center"><div className="h-3.5 w-28 bg-muted rounded" /><div className="h-3 w-12 bg-rose-500/20 rounded" /></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-20 bg-slate-50 dark:bg-slate-900/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight mb-4">
              Everything Students Need, In One Place
            </h2>
            <p className="text-muted-foreground text-md">
              No more queues or logging into obsolete portals. Get direct, beautiful breakdowns of your academic and institutional records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, i) => (
              <Card key={i} className="hover:scale-[1.01] transition-transform duration-200">
                <div className="h-10 w-10 rounded-sm bg-primary/10 text-primary dark:text-foreground flex items-center justify-center mb-5 border border-border">
                  <feat.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section id="stats" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col gap-2">
                <span className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary dark:text-foreground">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-slate-50 dark:bg-slate-900/30 border-t border-border">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-md">
              Got questions about the Attendex student companion portal? We've got answers.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className="bg-card border border-border rounded-md overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-md text-foreground focus:outline-none hover:bg-muted/40"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                    openFaq === i ? "rotate-180 text-foreground" : ""
                  }`} />
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ${
                    openFaq === i ? "max-h-48 py-5 border-t border-border" : "max-h-0"
                  }`}
                >
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 text-center flex flex-col items-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6">
            Ready to access your companion portal?
          </h2>
          <p className="text-muted-foreground text-md max-w-xl mb-10">
            Log in with your official Poornima Google student account or manual fallback credentials to access your dashboard.
          </p>
          <Link href="/login">
            <Button size="lg">
              Sign In to Attendex Now <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-full bg-white flex items-center justify-center text-slate-950 font-extrabold text-xs">
              A
            </div>
            <span className="font-extrabold tracking-tight text-white">
              ATTENDEX
            </span>
          </div>

          <span className="text-xs">
            © {new Date().getFullYear()} Poornima Institute of Engineering & Technology. All rights reserved.
          </span>

          <div className="flex gap-6 text-xs">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Support Helpline</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
