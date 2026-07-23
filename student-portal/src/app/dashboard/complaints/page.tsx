"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Plus, AlertCircle, RefreshCw, CheckCircle2,
  Clock, Search, Filter, ShieldCheck, HelpCircle, ArrowRight
} from 'lucide-react';
import { Card, Button, Badge, Skeleton, Dialog, Input, COMPLAINT_CATEGORIES, COLOR_TOKENS, formatDate } from '@shared';

const API_BASE = "http://localhost:5000/api";

export default function ComplaintsPage() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Tabs and filters
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState(COMPLAINT_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const fetchComplaints = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/complaints`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to load complaints');
      }

      const data = await res.json();
      setComplaints(data);
    } catch (err: any) {
      setError(err.message || 'Connecting to backend failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setSubmitError('Please enter a description');
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_BASE}/complaints`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ category, description })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit complaint');
      }

      // Prepend the new complaint and clear form
      setComplaints([data, ...complaints]);
      setDescription('');
      setIsModalOpen(false);
      
      setSuccessToast('Complaint registered successfully!');
      setTimeout(() => setSuccessToast(''), 4000);
    } catch (err: any) {
      setSubmitError(err.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center border-rose-300 dark:border-rose-900/50">
        <AlertCircle className="h-12 w-12 text-rose-500 mb-4" />
        <h3 className="text-lg font-bold mb-2">Error Loading Complaints</h3>
        <p className="text-sm text-muted-foreground mb-6">{error}</p>
        <Button onClick={fetchComplaints} size="sm">
          <RefreshCw className="h-4 w-4 mr-2" /> Retry Connection
        </Button>
      </Card>
    );
  }

  // Computing stats
  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === 'resolved').length;
  const inProgress = complaints.filter(c => c.status === 'in_progress').length;
  const pending = complaints.filter(c => c.status === 'pending').length;

  const resolvedPercent = total > 0 ? Math.round((resolved / total) * 100) : 0;
  const inProgressPercent = total > 0 ? Math.round((inProgress / total) * 100) : 0;
  const pendingPercent = total > 0 ? Math.round((pending / total) * 100) : 0;

  // Filter complaints list
  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'resolved') return <Badge variant="success">Resolved</Badge>;
    if (status === 'in_progress') return <Badge variant="warning">In Progress</Badge>;
    return <Badge variant="danger">Pending</Badge>;
  };

  const getStatusCardClass = (status: string) => {
    if (status === 'resolved') return "border-l-4 border-l-emerald-500 bg-emerald-50/10";
    if (status === 'in_progress') return "border-l-4 border-l-amber-500 bg-amber-50/10";
    return "border-l-4 border-l-rose-500 bg-rose-50/10";
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 p-4 bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/50 rounded-sm text-emerald-600 dark:text-emerald-400 shadow-xl flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="text-sm font-semibold">{successToast}</span>
        </div>
      )}

      {/* Raise New Complaint Dialog */}
      <Dialog 
        isOpen={isModalOpen} 
        onClose={() => !submitting && setIsModalOpen(false)} 
        title="Raise Complaint or Suggestion"
      >
        <form onSubmit={handleSubmitComplaint} className="flex flex-col gap-4 text-xs">
          {submitError && (
            <div className="p-3 bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 rounded-sm font-medium">
              {submitError}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground/80">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={submitting}
              className="flex h-10 w-full rounded-sm border border-border bg-card px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              {COMPLAINT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground/80">Issue Description</label>
            <textarea
              placeholder="Provide specific details about your issue (e.g. block name, classroom, timelines)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
              rows={4}
              required
              className="flex w-full rounded-sm border border-border bg-card px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-border pt-4 mt-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              File Complaint
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Grievance Portal</h1>
          <p className="text-sm text-muted-foreground">Register complaints and track resolution status</p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4.5 w-4.5 mr-2" /> New Complaint
          </Button>
          <button 
            onClick={fetchComplaints}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-xs font-semibold hover:bg-secondary rounded-sm transition-colors w-fit focus:outline-none"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Reload Tickets
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="bg-secondary border border-border p-1 rounded-md flex w-fit select-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-sm text-xs font-bold transition-all focus:outline-none ${
            activeTab === 'overview' 
              ? 'bg-card text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Portal Overview
        </button>
        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2 rounded-sm text-xs font-bold transition-all focus:outline-none ${
            activeTab === 'submissions' 
              ? 'bg-card text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          My Submissions ({total})
        </button>
      </div>

      {/* Render Active Tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' ? (
          /* OVERVIEW STATS TAB */
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* Metric counters Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="p-5 flex flex-col gap-1.5 bg-slate-50/50 dark:bg-slate-900/10">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">Total Tickets</span>
                <span className="text-3xl font-extrabold text-foreground">{total}</span>
              </Card>

              <Card className="p-5 flex flex-col gap-1.5 border-emerald-300/60 dark:border-emerald-950/20 bg-emerald-50/5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">Resolved</span>
                <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{resolvedPercent}%</span>
              </Card>

              <Card className="p-5 flex flex-col gap-1.5 border-amber-300/60 dark:border-amber-950/20 bg-amber-50/5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">In Progress</span>
                <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">{inProgressPercent}%</span>
              </Card>

              <Card className="p-5 flex flex-col gap-1.5 border-rose-300/60 dark:border-rose-950/20 bg-rose-50/5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">Pending</span>
                <span className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">{pendingPercent}%</span>
              </Card>
            </div>

            {/* General FAQs or Guidelines Card */}
            <Card className="flex flex-col gap-4">
              <h3 className="font-bold text-md text-foreground border-b border-border pb-3">Grievance Handling Guidelines</h3>
              <ul className="text-xs text-muted-foreground space-y-2.5 leading-relaxed list-disc pl-5">
                <li>Submit issues in correct categories (e.g. IT issues go to System Admins, hostel to Warden).</li>
                <li>Write precise details (specify Block, Floor, Room numbers) to ensure quick troubleshooting.</li>
                <li>Average ticket response times ranges between 2 to 5 business working days.</li>
                <li>You will receive push notifications or email alerts whenever ticket actions or status revisions occur.</li>
              </ul>
            </Card>
          </motion.div>
        ) : (
          /* SUBMISSIONS LIST TAB */
          <motion.div
            key="submissions"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* Filter controls */}
            <Card className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Search bar */}
              <div className="flex items-center gap-2 bg-secondary border border-border rounded-sm px-3 py-1.5 w-full sm:w-80">
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search complaints description..." 
                  className="bg-transparent border-none text-xs focus:outline-none text-foreground placeholder:text-muted-foreground w-full"
                />
              </div>

              {/* Category Filter dropdown */}
              <div className="flex items-center gap-2 bg-card border border-border rounded-sm px-3 py-1.5 w-full sm:w-64">
                <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-transparent border-none text-xs focus:outline-none text-foreground w-full font-semibold"
                >
                  <option value="All">All Categories</option>
                  {COMPLAINT_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </Card>

            {/* List of complaints */}
            <div className="flex flex-col gap-4">
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((c) => (
                  <div
                    key={c.id}
                    className={`p-5 rounded-md border border-border flex flex-col gap-4 shadow-sm ${getStatusCardClass(c.status)}`}
                  >
                    {/* Header line */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-extrabold text-foreground">{c.category}</span>
                        <span className="text-[10px] font-semibold text-muted-foreground font-mono">#{c.id.split('_')[1]}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs font-semibold">
                        <span className="text-muted-foreground font-medium text-[10px]">
                          {formatDate(c.createdAt)}
                        </span>
                        {getStatusBadge(c.status)}
                      </div>
                    </div>

                    {/* Body */}
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {c.description}
                    </p>

                    {/* Admin response comment */}
                    {c.adminComment && (
                      <div className="mt-2 p-3 bg-secondary/80 border border-border rounded text-xs text-foreground/80 leading-normal flex flex-col gap-1">
                        <span className="font-bold text-foreground block text-[10px] uppercase tracking-wider text-primary dark:text-foreground">
                          Administrator Response:
                        </span>
                        <p>{c.adminComment}</p>
                        {c.resolvedAt && (
                          <span className="text-[9px] text-muted-foreground font-semibold mt-1">
                            Resolved on {formatDate(c.resolvedAt)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground gap-3">
                  <MessageSquare className="h-10 w-10 opacity-30" />
                  <div>
                    <p className="text-sm font-bold">No complaint tickets found</p>
                    <p className="text-xs">No entries match your search query or filters.</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
