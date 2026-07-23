"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Mail, Phone, Calendar, MapPin, RefreshCw, AlertCircle,
  ShieldCheck, Lock, HelpCircle, ChevronDown, ChevronUp, LogOut
} from 'lucide-react';
import { Card, Button, Badge, Skeleton, Input, ERP_CONFIG } from '@shared';

const API_BASE = "https://attendex-backend-api.vercel.app/api";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Expandable sections states
  const [expandedSection, setExpandedSection] = useState<string | null>('personal');

  // Change Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to load profile details');
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
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordMsg('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setUpdatingPassword(true);
    setTimeout(() => {
      setUpdatingPassword(false);
      setPasswordMsg('Password changed successfully (simulated)!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMsg(''), 4000);
    }, 1500);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full animate-pulse" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center border-rose-300 dark:border-rose-900/50">
        <AlertCircle className="h-12 w-12 text-rose-500 mb-4" />
        <h3 className="text-lg font-bold mb-2">Error Loading Profile</h3>
        <p className="text-sm text-muted-foreground mb-6">{error}</p>
        <Button onClick={fetchProfile} size="sm">
          <RefreshCw className="h-4 w-4 mr-2" /> Retry Connection
        </Button>
      </Card>
    );
  }

  const { student, user } = data;
  const isGoogleLinked = user?.email.endsWith('@poornima.org'); // Check if linked

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Student Profile</h1>
          <p className="text-sm text-muted-foreground">Manage details, credentials, and settings</p>
        </div>
        <button 
          onClick={fetchProfile}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-xs font-semibold hover:bg-secondary rounded-sm transition-colors w-fit focus:outline-none"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Reload Profile
        </button>
      </div>

      {/* Profile Details Header Card */}
      <Card className="p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-900/10 dark:to-slate-900/30">
        <div className="h-20 w-20 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-3xl border-2 border-border shrink-0 select-none">
          {student.name.split(' ').map((n: string) => n[0]).join('')}
        </div>
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
          <div>
            <h2 className="text-xl font-extrabold text-foreground">{student.name}</h2>
            <div className="text-xs font-semibold text-muted-foreground mt-1">
              Enrolment No: <strong>{student.enrolmentNo}</strong>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {student.program} • {student.semester}
            </div>
          </div>
          
          <Button variant="danger" size="sm" onClick={handleLogout} className="w-full sm:w-auto">
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>
      </Card>

      {/* Google Link Status */}
      <Card className="p-6 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="flex items-center gap-3">
          <ShieldCheck className={`h-8 w-8 shrink-0 ${isGoogleLinked ? 'text-emerald-500' : 'text-slate-400'}`} />
          <div>
            <h3 className="font-bold text-xs">Google Account Integration</h3>
            <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">
              {isGoogleLinked 
                ? `Associated with verified Google account: ${user.email}` 
                : 'Google sign-in is not linked to your student profile.'}
            </p>
          </div>
        </div>
        
        {isGoogleLinked ? (
          <Badge variant="success">Google Associated</Badge>
        ) : (
          <Button variant="secondary" size="sm">Link Google</Button>
        )}
      </Card>

      {/* Accordion Panels */}
      <div className="flex flex-col gap-3">
        
        {/* 1. Personal Information */}
        <div className="border border-border bg-card rounded-md overflow-hidden">
          <button
            onClick={() => toggleSection('personal')}
            className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-sm text-foreground focus:outline-none hover:bg-secondary/40 select-none"
          >
            <span className="flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-slate-500" /> Personal Information
            </span>
            {expandedSection === 'personal' ? <ChevronUp className="h-4.5 w-4.5 text-muted-foreground" /> : <ChevronDown className="h-4.5 w-4.5 text-muted-foreground" />}
          </button>
          
          {expandedSection === 'personal' && (
            <div className="px-6 pb-6 pt-2 border-t border-border flex flex-col gap-6 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="flex flex-col gap-1.5">
                  <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Mail className="h-4 w-4" /> Email Address
                  </span>
                  <span className="text-sm font-semibold truncate">{student.email}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Phone className="h-4 w-4" /> Phone Number
                  </span>
                  <span className="text-sm font-semibold">{student.phone}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" /> Date of Birth
                  </span>
                  <span className="text-sm font-semibold">{student.dob}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> Home Address
                  </span>
                  <span className="text-sm font-semibold leading-relaxed">{student.address}</span>
                </div>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 rounded leading-relaxed">
                <strong>Read-only Records Disclaimer:</strong> Critical personal contact details are synchronized from canonical university registers. Updates require formal requests with administrative approval.
              </div>
            </div>
          )}
        </div>

        {/* 2. Change Password */}
        <div className="border border-border bg-card rounded-md overflow-hidden">
          <button
            onClick={() => toggleSection('password')}
            className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-sm text-foreground focus:outline-none hover:bg-secondary/40 select-none"
          >
            <span className="flex items-center gap-2">
              <Lock className="h-4.5 w-4.5 text-slate-500" /> Account Security Credentials
            </span>
            {expandedSection === 'password' ? <ChevronUp className="h-4.5 w-4.5 text-muted-foreground" /> : <ChevronDown className="h-4.5 w-4.5 text-muted-foreground" />}
          </button>
          
          {expandedSection === 'password' && (
            <div className="px-6 pb-6 pt-2 border-t border-border flex flex-col gap-4 text-xs">
              <div className="max-w-md w-full pt-2 flex flex-col gap-4">
                {passwordError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 rounded-sm font-medium">
                    {passwordError}
                  </div>
                )}
                {passwordMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-sm font-medium">
                    {passwordMsg}
                  </div>
                )}

                <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
                  <Input
                    label="Current Password"
                    type="password"
                    placeholder="••••••••"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    disabled={updatingPassword}
                    required
                  />

                  <Input
                    label="New Password"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={updatingPassword}
                    required
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={updatingPassword}
                    required
                  />

                  <Button type="submit" className="w-fit" isLoading={updatingPassword}>
                    Update Credentials
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* 3. Privacy Policy & Terms */}
        <div className="border border-border bg-card rounded-md overflow-hidden">
          <button
            onClick={() => toggleSection('privacy')}
            className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-sm text-foreground focus:outline-none hover:bg-secondary/40 select-none"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-slate-500" /> Student Data Privacy Policy
            </span>
            {expandedSection === 'privacy' ? <ChevronUp className="h-4.5 w-4.5 text-muted-foreground" /> : <ChevronDown className="h-4.5 w-4.5 text-muted-foreground" />}
          </button>
          
          {expandedSection === 'privacy' && (
            <div className="px-6 pb-6 pt-4 border-t border-border text-xs text-muted-foreground leading-relaxed flex flex-col gap-3">
              <p>
                Attendex is committed to safeguarding student data. In compliance with India's Digital Personal Data Protection (DPDP) Act, 2023:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>No Personally Identifiable Information (PII) is shared or exposed to external entities.</li>
                <li>Financial details and payment histories are kept strictly confidential under secure payment channels.</li>
                <li>Session access histories are audited periodically to block malicious credential exploits.</li>
              </ul>
            </div>
          )}
        </div>

        {/* 4. Help & Support */}
        <div className="border border-border bg-card rounded-md overflow-hidden">
          <button
            onClick={() => toggleSection('support')}
            className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-sm text-foreground focus:outline-none hover:bg-secondary/40 select-none"
          >
            <span className="flex items-center gap-2">
              <HelpCircle className="h-4.5 w-4.5 text-slate-500" /> Institutional Help Desk
            </span>
            {expandedSection === 'support' ? <ChevronUp className="h-4.5 w-4.5 text-muted-foreground" /> : <ChevronDown className="h-4.5 w-4.5 text-muted-foreground" />}
          </button>
          
          {expandedSection === 'support' && (
            <div className="px-6 pb-6 pt-4 border-t border-border text-xs text-muted-foreground leading-relaxed flex flex-col gap-3">
              <p>For support, portal glitches, and queries, please use the following coordinates:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 font-semibold">
                <div className="p-3 border border-border rounded bg-secondary/30">
                  <div className="text-foreground text-xs font-bold">Admin Helpdesk Support</div>
                  <div className="text-muted-foreground mt-0.5 font-medium">{ERP_CONFIG.supportEmail}</div>
                </div>
                <div className="p-3 border border-border rounded bg-secondary/30">
                  <div className="text-foreground text-xs font-bold">Academic Registrar Office</div>
                  <div className="text-muted-foreground mt-0.5 font-medium">ext-registar.piet@poornima.org</div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
