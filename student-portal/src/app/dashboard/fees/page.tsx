"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, AlertCircle, RefreshCw, CheckCircle2, Download,
  Coins, Wallet, Receipt, DollarSign, Calendar
} from 'lucide-react';
import { Card, Button, Badge, Skeleton, Dialog, formatCurrency, formatDate } from '@shared';

const API_BASE = "https://attendex-backend-api.vercel.app/api";

function amountToWords(num: number): string {
  const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
  const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  if (num === 0) return 'zero';

  let n = Math.floor(num);
  if (n < 0) return '';

  let str = '';

  if (n >= 10000000) {
    str += amountToWords(Math.floor(n / 10000000)) + ' crore ';
    n %= 10000000;
  }
  if (n >= 100000) {
    str += amountToWords(Math.floor(n / 100000)) + ' lakh ';
    n %= 100000;
  }
  if (n >= 1000) {
    str += amountToWords(Math.floor(n / 1000)) + ' thousand ';
    n %= 1000;
  }
  if (n >= 100) {
    str += amountToWords(Math.floor(n / 100)) + ' hundred ';
    n %= 100;
  }
  if (n > 0) {
    if (str !== '') str += 'and ';
    if (n < 20) {
      str += a[n];
    } else {
      str += b[Math.floor(n / 10)] + (n % 10 !== 0 ? '-' + a[n % 10] : '');
    }
  }

  return str.trim();
}

export default function FeesPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Payment states
  const [payingItem, setPayingItem] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [processing, setProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Receipts downloader mock
  const [receiptDownloading, setReceiptDownloading] = useState<string | null>(null);

  const fetchFees = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/fees`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to load fee information');
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
    fetchFees();
  }, []);

  const triggerPayment = (ledgerItem: any) => {
    setPayingItem(ledgerItem);
  };

  const handleProcessPayment = async () => {
    if (!payingItem) return;
    setProcessing(true);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/fees/pay`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ledgerId: payingItem.id,
          amount: payingItem.due,
          method: paymentMethod
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Payment failed');
      }

      setSuccessMsg(`Payment of ${formatCurrency(payingItem.due)} for ${payingItem.particular} successful!`);
      setPayingItem(null);
      setTimeout(() => setSuccessMsg(''), 4000);
      
      // Refresh the ledger data from the backend
      fetchFees();
    } catch (e: any) {
      alert(e.message || 'Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadReceipt = (id: string) => {
    setReceiptDownloading(id);
    setTimeout(() => {
      setReceiptDownloading(null);
      // Simulate file download by popping alert
      alert("Receipt PDF generated and saved successfully!");
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center border-rose-300 dark:border-rose-900/50">
        <AlertCircle className="h-12 w-12 text-rose-500 mb-4" />
        <h3 className="text-lg font-bold mb-2">Error Loading Fees</h3>
        <p className="text-sm text-muted-foreground mb-6">{error}</p>
        <Button onClick={fetchFees} size="sm">
          <RefreshCw className="h-4 w-4 mr-2" /> Retry Connection
        </Button>
      </Card>
    );
  }

  const { ledger, payments, totalFees, totalPaid, totalDue } = data;

  return (
    <div className="flex flex-col gap-6">
      
      {/* Transaction Success Toast */}
      {successMsg && (
        <div className="fixed top-20 right-6 z-50 p-4 bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/50 rounded-sm text-emerald-600 dark:text-emerald-400 shadow-xl flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="text-sm font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Payment Gateway Mock Dialog */}
      <Dialog 
        isOpen={!!payingItem} 
        onClose={() => !processing && setPayingItem(null)} 
        title="Institute Payment Gateway"
      >
        {payingItem && (
          <div className="flex flex-col gap-4 text-xs">
            <div className="p-4 bg-secondary border border-border/80 rounded flex justify-between items-center mb-2">
              <div>
                <div className="font-bold text-sm text-foreground">{payingItem.particular}</div>
                <div className="text-muted-foreground mt-0.5">Poornima Academic Dues</div>
              </div>
              <div className="text-base font-extrabold text-primary dark:text-foreground">
                {formatCurrency(payingItem.due)}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-bold text-muted-foreground">Select Payment Method:</span>
              <div className="grid grid-cols-3 gap-3">
                {['UPI', 'Net Banking', 'Card'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    disabled={processing}
                    className={`p-3 border rounded-sm font-semibold text-center transition-colors focus:outline-none ${
                      paymentMethod === method 
                        ? 'border-primary bg-primary/5 text-primary dark:border-white dark:text-white dark:bg-white/10' 
                        : 'border-border hover:bg-secondary text-muted-foreground'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod === 'UPI' && (
              <div className="flex flex-col items-center gap-3 p-4 border border-border bg-slate-50 dark:bg-slate-900/30 rounded mt-2 select-none">
                <span className="font-bold text-foreground text-xs">Scan UPI QR to complete transaction</span>
                <div className="h-48 w-48 bg-white p-2 rounded border border-border flex items-center justify-center overflow-hidden shadow-sm">
                  <img 
                    src="/payment-qr.png" 
                    alt="Payment QR Code" 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <span className="text-sm font-extrabold text-foreground">
                    Amount: {formatCurrency(payingItem.due)}
                  </span>
                  <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">
                    ({amountToWords(payingItem.due)} Rupees Only)
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground font-semibold">UPI ID: piet.attendex@ybl</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-muted-foreground border-t border-border pt-4 mt-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Secure 256-bit encrypted gateway verification
            </div>

            <div className="flex gap-3 justify-end mt-4">
              <Button 
                variant="secondary" 
                onClick={() => setPayingItem(null)} 
                disabled={processing}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleProcessPayment} 
                isLoading={processing}
              >
                Settle Transaction
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Fee Statements</h1>
          <p className="text-sm text-muted-foreground">Detailed billing ledger and payment records</p>
        </div>
        <button 
          onClick={fetchFees}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-xs font-semibold hover:bg-secondary rounded-sm transition-colors w-fit"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Reload Ledger
        </button>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4">
          <div className="h-10 w-10 bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 rounded flex items-center justify-center border border-border shrink-0">
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">Total Annual Fees</span>
            <span className="text-2xl font-extrabold text-foreground">{formatCurrency(totalFees)}</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="h-10 w-10 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 rounded flex items-center justify-center border border-border shrink-0">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">Total Fees Settled</span>
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalPaid)}</span>
          </div>
        </Card>

        <Card className={`flex items-center gap-4 ${totalDue > 0 ? 'border-rose-300 dark:border-rose-900/50' : ''}`}>
          <div className={`h-10 w-10 rounded flex items-center justify-center border border-border shrink-0 ${
            totalDue > 0 
              ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400' 
              : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
          }`}>
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">Total Dues Outstanding</span>
            <span className={`text-2xl font-extrabold ${totalDue > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {formatCurrency(totalDue)}
            </span>
          </div>
        </Card>
      </div>

      {/* Billing Breakdown Table */}
      <Card>
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <h3 className="font-bold text-md text-foreground flex items-center gap-2">
            <Receipt className="h-4.5 w-4.5 text-primary dark:text-foreground" />
            Billing Breakdown (Odd Semester)
          </h3>
          <span className="text-[10px] font-bold text-muted-foreground uppercase select-none">Current Session Ledger</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/80 text-[10px] uppercase text-muted-foreground tracking-wider select-none font-bold">
                <th className="py-3 px-4">Fee Particulars</th>
                <th className="py-3 px-4 text-right">Total (₹)</th>
                <th className="py-3 px-4 text-right">Paid (₹)</th>
                <th className="py-3 px-4 text-right">Outstanding (₹)</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs">
              {ledger.map((item: any) => (
                <tr key={item.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-foreground">{item.particular}</td>
                  <td className="py-3.5 px-4 text-right font-semibold">{formatCurrency(item.total).replace('₹', '')}</td>
                  <td className="py-3.5 px-4 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(item.paid).replace('₹', '')}
                  </td>
                  <td className={`py-3.5 px-4 text-right font-extrabold ${item.due > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}`}>
                    {formatCurrency(item.due).replace('₹', '')}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {item.due > 0 ? (
                      <button 
                        onClick={() => triggerPayment(item)}
                        className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-sm shadow-sm transition-colors text-[10px] cursor-pointer focus:outline-none uppercase"
                      >
                        Pay Now
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-500 font-bold flex items-center justify-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Cleared
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              
              {/* Total Row */}
              <tr className="bg-secondary/40 font-extrabold text-sm border-t border-border">
                <td className="py-4 px-4 text-foreground">Total Fee Standings</td>
                <td className="py-4 px-4 text-right">{formatCurrency(totalFees).replace('₹', '')}</td>
                <td className="py-4 px-4 text-right text-emerald-600 dark:text-emerald-400">{formatCurrency(totalPaid).replace('₹', '')}</td>
                <td className={`py-4 px-4 text-right ${totalDue > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}`}>
                  {formatCurrency(totalDue).replace('₹', '')}
                </td>
                <td className="py-4 px-4" />
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Payment History */}
      <Card>
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <h3 className="font-bold text-md text-foreground flex items-center gap-2">
            <Calendar className="h-4.5 w-4.5 text-primary dark:text-foreground" />
            Settled Transaction Logs
          </h3>
          <span className="text-[10px] font-bold text-muted-foreground uppercase select-none">Receipt Archives</span>
        </div>

        <div className="flex flex-col gap-3">
          {payments.length > 0 ? (
            payments.map((pay: any) => (
              <div 
                key={pay.id}
                className="p-4 border border-border/80 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/10 hover:border-border transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-full flex items-center justify-center border border-border shrink-0">
                    <Receipt className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">{pay.particular}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      Settle via {pay.method} • {formatDate(pay.paidAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 text-xs">
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-foreground">{formatCurrency(pay.amount)}</span>
                    <Badge variant="success" className="py-0 px-1.5 mt-0.5 text-[8px]">Success</Badge>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleDownloadReceipt(pay.id)}
                    isLoading={receiptDownloading === pay.id}
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground text-xs font-medium">
              No payments logged yet.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
