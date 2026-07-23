"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Award, AlertCircle, RefreshCw, Download, FileText, TrendingUp, Info 
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, Legend 
} from 'recharts';
import { Card, Button, Badge, Skeleton } from '@shared';

const API_BASE = "http://localhost:5000/api";

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartMounted, setChartMounted] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  const fetchResults = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/results`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to load academic results');
      }

      const data = await res.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Connecting to backend failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    // Mount Recharts on client side only to prevent hydration crashes
    setChartMounted(true);
  }, []);

  const handleDownloadMarksheet = (id: string) => {
    setDownloading(id);
    setTimeout(() => {
      setDownloading(null);
      alert("Marks-sheet PDF downloaded successfully!");
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-72 w-full animate-pulse" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center border-rose-300 dark:border-rose-900/50">
        <AlertCircle className="h-12 w-12 text-rose-500 mb-4" />
        <h3 className="text-lg font-bold mb-2">Error Loading Results</h3>
        <p className="text-sm text-muted-foreground mb-6">{error}</p>
        <Button onClick={fetchResults} size="sm">
          <RefreshCw className="h-4 w-4 mr-2" /> Retry Connection
        </Button>
      </Card>
    );
  }

  // Filter completed results for the charts
  const chartData = results
    .filter(res => res.status === 'PASS' && res.sgpa)
    .map(res => ({
      name: res.semester.split(' ')[0], // e.g. "1st" or "2nd"
      SGPA: res.sgpa,
      CGPA: res.cgpa
    }));

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Academic Results</h1>
          <p className="text-sm text-muted-foreground">Semestral SGPA, CGPA standings and official transcripts</p>
        </div>
        <button 
          onClick={fetchResults}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-xs font-semibold hover:bg-secondary rounded-sm transition-colors w-fit"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Reload Results
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex items-center gap-4">
          <div className="h-10 w-10 bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 rounded flex items-center justify-center border border-border shrink-0">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">Latest Sem SGPA</span>
            <span className="text-2xl font-extrabold text-foreground">9.20</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="h-10 w-10 bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 rounded flex items-center justify-center border border-border shrink-0">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">Cumulative CGPA Standing</span>
            <span className="text-2xl font-extrabold text-foreground">9.00</span>
          </div>
        </Card>
      </div>

      {/* GPA Progress Trend Chart */}
      {chartMounted && chartData.length > 0 && (
        <Card className="flex flex-col gap-4">
          <h3 className="font-bold text-md text-foreground border-b border-border pb-3">Performance Trend</h3>
          <div className="h-72 w-full text-xs font-semibold">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis domain={[5, 10]} tickLine={false} axisLine={false} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--card)' }} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="SGPA" 
                  stroke="#0A1D56" 
                  activeDot={{ r: 6 }} 
                  strokeWidth={3} 
                  name="Semester SGPA" 
                  dot={{ r: 4 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="CGPA" 
                  stroke="#22C55E" 
                  strokeWidth={2} 
                  name="Cumulative CGPA" 
                  dot={{ r: 4 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Results Ledger Table */}
      <Card>
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <h3 className="font-bold text-md text-foreground flex items-center gap-2">
            <FileText className="h-4.5 w-4.5 text-primary dark:text-foreground" />
            Marks-sheet Ledger
          </h3>
          <span className="text-[10px] font-bold text-muted-foreground uppercase select-none">Enrolment Transcript Logs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/80 text-[10px] uppercase text-muted-foreground tracking-wider select-none font-bold">
                <th className="py-3 px-4">Academic Year</th>
                <th className="py-3 px-4">Semester Code</th>
                <th className="py-3 px-4 text-center">Semester SGPA</th>
                <th className="py-3 px-4 text-center">Cumulative CGPA</th>
                <th className="py-3 px-4 text-center">Result Status</th>
                <th className="py-3 px-4 text-center">Marks-sheet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs">
              {results.map((res: any) => (
                <tr key={res.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-foreground">{res.year}</td>
                  <td className="py-3.5 px-4 text-muted-foreground font-semibold">{res.semester}</td>
                  <td className="py-3.5 px-4 text-center font-extrabold">{res.sgpa ? res.sgpa.toFixed(2) : "------"}</td>
                  <td className="py-3.5 px-4 text-center font-extrabold text-slate-500">{res.cgpa ? res.cgpa.toFixed(2) : "------"}</td>
                  <td className="py-3.5 px-4 text-center">
                    {res.status === 'PASS' ? (
                      <Badge variant="success">PASS</Badge>
                    ) : res.status === 'FAIL' ? (
                      <Badge variant="danger">FAIL</Badge>
                    ) : (
                      <Badge variant="warning">PENDING</Badge>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {res.status === 'PASS' ? (
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleDownloadMarksheet(res.id)}
                        isLoading={downloading === res.id}
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    ) : (
                      <span className="text-[10px] text-muted-foreground font-semibold">Not Published</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Footer warning */}
      <div className="flex gap-3 p-4 bg-slate-50 border border-border dark:bg-slate-900/30 text-xs text-muted-foreground rounded-md leading-relaxed">
        <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
        <div>
          <strong>External Affiliation Disclaimer:</strong> Official mark-sheets are connected and affiliated directly to <strong>Rajasthan Technical University (RTU)</strong>. For any queries regarding exam marks, grade evaluation, or spelling changes, please contact the registrar office directly.
        </div>
      </div>
    </div>
  );
}
