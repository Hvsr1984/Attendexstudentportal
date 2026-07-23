"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, Mail, User, ShieldAlert, ArrowRight, ArrowLeft, KeyRound, Smartphone
} from 'lucide-react';
import { Card, Button, Input, COMPLAINT_CATEGORIES, ERP_CONFIG } from '@shared';

const API_BASE = "https://attendex-backend-api.vercel.app/api";

export default function LoginPage() {
  const router = useRouter();
  
  // Forms states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Google SSO simulated state
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [linkingState, setLinkingState] = useState<{
    required: boolean;
    email: string;
    name: string;
    enrolmentNo: string;
    dob: string;
  } | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Save credentials & redirect
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Connecting to backend failed. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const triggerGoogleLogin = () => {
    setShowGoogleChooser(true);
  };

  const handleSelectGoogleAccount = async (email: string, name: string) => {
    setShowGoogleChooser(false);
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, avatarUrl: '' }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Google SSO failed');
      }

      if (data.linked) {
        // Log in directly
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        // Link screen transition
        setLinkingState({
          required: true,
          email: data.email,
          name: data.name,
          enrolmentNo: '',
          dob: ''
        });
      }
    } catch (err: any) {
      setError(err.message || 'Google Auth connection failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccountLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkingState || !linkingState.enrolmentNo || !linkingState.dob) {
      setError('Please fill in both Enrolment Number and DOB');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/auth/link-google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrolmentNo: linkingState.enrolmentNo,
          dob: linkingState.dob,
          email: linkingState.email,
          name: linkingState.name
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Linking failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Google Chooser Modal */}
      <AnimatePresence>
        {showGoogleChooser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGoogleChooser(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-md shadow-2xl p-6 max-w-sm w-full relative z-10 text-center"
            >
              <div className="flex justify-center mb-4">
                {/* Google Logo Mock */}
                <div className="flex gap-0.5 text-xl font-bold">
                  <span className="text-blue-500">G</span>
                  <span className="text-red-500">o</span>
                  <span className="text-yellow-500">o</span>
                  <span className="text-blue-500">g</span>
                  <span className="text-green-500">l</span>
                  <span className="text-red-500">e</span>
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">Sign in to Attendex</h3>
              <p className="text-xs text-muted-foreground mb-6">Choose an account to continue</p>
              
              <div className="flex flex-col gap-2 mb-6">
                <button 
                  onClick={() => handleSelectGoogleAccount('arnav.nagar@poornima.org', 'Arnav Nagar')}
                  className="flex items-center gap-3 p-3 text-left border border-border rounded-sm hover:bg-secondary transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    AN
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Arnav Nagar</div>
                    <div className="text-xs text-muted-foreground">arnav.nagar@poornima.org</div>
                  </div>
                </button>

                <button 
                  onClick={() => handleSelectGoogleAccount('unknown.student@poornima.org', 'New Student')}
                  className="flex items-center gap-3 p-3 text-left border border-border rounded-sm hover:bg-secondary transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm">
                    NS
                  </div>
                  <div>
                    <div className="text-sm font-semibold">New Student (Not Linked)</div>
                    <div className="text-xs text-muted-foreground">unknown.student@poornima.org</div>
                  </div>
                </button>
              </div>

              <Button variant="secondary" size="sm" onClick={() => setShowGoogleChooser(false)} className="w-full">
                Cancel
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Left panel - branding graphic (Hidden on small screens) */}
      <div className="hidden lg:flex w-1/2 bg-primary dark:bg-slate-950 relative flex-col justify-between p-12 text-white border-r border-border/30 overflow-hidden">
        {/* Glow grid background */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-primary font-black text-md border border-emerald-500">
            A
          </div>
          <span className="font-extrabold tracking-tight text-lg">{ERP_CONFIG.appName}</span>
        </div>

        <div className="max-w-md my-auto relative z-10">
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight mb-4">
            Welcome to the new era of campus ERP.
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Log in to view live attendance progress bars, access your weekly timetables, track outstanding hostel/tuition fees, and resolve grievances with administration.
          </p>
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded bg-white/10 border border-white/10 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Active Session: 2026-2027 (Odd Semester)
          </div>
        </div>

        <div className="text-xs text-slate-400 relative z-10">
          Powered by Poornima Institute of Engineering & Technology.
        </div>
      </div>

      {/* Right panel - forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/50 rounded-sm text-sm text-rose-600 dark:text-rose-400 flex gap-2">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {!linkingState ? (
              /* Regular Login View */
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-8">
                  <h1 className="text-2xl font-extrabold tracking-tight mb-2">Student Portal Sign In</h1>
                  <p className="text-sm text-muted-foreground">Access your ERP companion dashboard</p>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Google SSO Button */}
                  <button
                    type="button"
                    onClick={triggerGoogleLogin}
                    disabled={loading}
                    className="flex items-center justify-center gap-3 w-full h-11 border border-border hover:bg-secondary text-sm font-semibold rounded-sm transition-colors active:scale-[0.99] disabled:opacity-50"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Sign in with Google
                  </button>

                  <div className="flex items-center my-2">
                    <span className="w-full h-px bg-border" />
                    <span className="text-xs text-muted-foreground uppercase px-4 select-none">Or login with details</span>
                    <span className="w-full h-px bg-border" />
                  </div>

                  {/* Manual Login Form */}
                  <form onSubmit={handleManualLogin} className="flex flex-col gap-4">
                    <Input
                      label="Enrolment No / Email / Mobile"
                      placeholder="e.g. PIET25CS063"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      icon={User}
                      disabled={loading}
                      required
                    />

                    <Input
                      label="Password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      icon={Lock}
                      disabled={loading}
                      required
                    />

                    <div className="flex items-center justify-between mt-1 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer font-medium text-muted-foreground">
                        <input type="checkbox" className="rounded border-border accent-primary h-3.5 w-3.5" />
                        Remember me
                      </label>
                      <a href="#" className="font-bold text-primary dark:text-foreground hover:underline">Forgot password?</a>
                    </div>

                    <Button type="submit" className="w-full h-11 mt-4" isLoading={loading}>
                      Sign In to Account
                    </Button>
                  </form>
                </div>
              </motion.div>
            ) : (
              /* Google Identity Linking View */
              <motion.div
                key="linking-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <button 
                  onClick={() => setLinkingState(null)}
                  className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground mb-6 focus:outline-none"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
                </button>

                <div className="mb-6">
                  <h1 className="text-xl font-extrabold tracking-tight mb-2">Link Your Google Account</h1>
                  <p className="text-sm text-muted-foreground">
                    Link <strong>{linkingState.email}</strong> to your institutional record.
                  </p>
                </div>

                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/50 rounded-sm text-xs text-blue-600 dark:text-blue-400">
                  We found a verified Google account, but it's not linked to any student profile. Verification is required once.
                </div>

                <form onSubmit={handleAccountLink} className="flex flex-col gap-4">
                  <Input
                    label="Enrolment Number"
                    placeholder="e.g. PIET25CS063"
                    value={linkingState.enrolmentNo}
                    onChange={(e) => setLinkingState({ ...linkingState, enrolmentNo: e.target.value })}
                    icon={KeyRound}
                    disabled={loading}
                    required
                  />

                  <Input
                    label="Date of Birth"
                    placeholder="e.g. 06 July 2006"
                    value={linkingState.dob}
                    onChange={(e) => setLinkingState({ ...linkingState, dob: e.target.value })}
                    icon={Smartphone}
                    disabled={loading}
                    required
                  />

                  <Button type="submit" className="w-full h-11 mt-4" isLoading={loading}>
                    Link & Log In <ArrowRight className="h-4.5 w-4.5" />
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
