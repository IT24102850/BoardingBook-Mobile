import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle, Download, UploadCloud, AlertCircle, Info, Bell, BellOff, Navigation, XCircle } from 'lucide-react';
import { generatePaymentReceiptPDF } from '../../helpers/generateReceipt';

interface PaymentRecord {
  month: string;
  dueDate: string; // ISO string
  status: 'paid' | 'pending' | 'overdue';
  receiptUrl?: string;
}

const initialPayments: PaymentRecord[] = [
  { month: 'Jan 2026', dueDate: '2026-01-20', status: 'paid', receiptUrl: '/receipts/jan2026.pdf' },
  { month: 'Feb 2026', dueDate: '2026-02-20', status: 'paid', receiptUrl: '/receipts/feb2026.pdf' },
  { month: 'Mar 2026', dueDate: '2026-03-20', status: 'pending' },
];

const mockRoommates = [
  { id: '1', name: 'John Doe', avatar: 'J', status: 'paid', amount: 5000 },
  { id: '2', name: 'Alex Smith', avatar: 'A', status: 'pending', amount: 5000 },
];

const TOTAL_ROOM_RENT = 15000;
const MY_BASE_SHARE = TOTAL_ROOM_RENT / (mockRoommates.length + 1);

function formatMonthLabel(m: string) {
  return m;
}

export default function StudentPayment() {
  const [payments] = useState<PaymentRecord[]>(initialPayments);
  const [notification, setNotification] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'warn'>('warn');

  // Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentRemark, setPaymentRemark] = useState<string>('');

  // Validation Errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const MONTHLY_RENT = MY_BASE_SHARE; // Rs. per month
  const MAX_REMARK_CHARS = 250;

  const [isSplitMode, setIsSplitMode] = useState(false);

  const nextPending = useMemo(() => payments.find(p => p.status === 'pending'), [payments]);
  const highlightDate = nextPending ? new Date(nextPending.dueDate) : null;

  const today = new Date();
  const calendarYear = today.getFullYear();
  const calendarMonth = today.getMonth();

  useEffect(() => {
    const now = new Date();
    if (nextPending) {
      const due = new Date(nextPending.dueDate);
      const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (diff === 5) setNotification('Reminder: payment due in 5 days');
      else if (diff > 0 && diff < 5) setNotification('Payment due soon');
      else if (diff <= 0 && diff >= -5) setNotification('Warning: payment within short overdue window');
      else if (diff < -5) setNotification('Payment overdue!');
    }
  }, [nextPending]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    const maxSizeBytes = 5 * 1024 * 1024; // 5 MB

    if (!allowedTypes.includes(file.type)) {
      setFormErrors(prev => ({ ...prev, file: 'Invalid file type. Please upload PNG, JPG, or PDF only.' }));
      return;
    }
    if (file.size > maxSizeBytes) {
      setFormErrors(prev => ({ ...prev, file: `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Max size is 5 MB.` }));
      return;
    }
    setFormErrors(prev => { const n = { ...prev }; delete n.file; return n; });
    setUploadedFile(file);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate = new Date();
    minDate.setDate(today.getDate() - 90);

    // Amount validation
    const amountNum = parseFloat(paymentAmount);
    if (!paymentAmount || isNaN(amountNum)) {
      errors.amount = 'Payment amount is required.';
    } else if (amountNum <= 0) {
      errors.amount = 'Amount must be greater than Rs. 0.';
    } else if (amountNum > MONTHLY_RENT * 2) {
      errors.amount = `Amount cannot exceed Rs. ${(MONTHLY_RENT * 2).toLocaleString()} (2x monthly rent).`;
    }

    // Date validation
    const dateVal = new Date(paymentDate);
    if (!paymentDate) {
      errors.date = 'Payment date is required.';
    } else if (dateVal > today) {
      errors.date = 'Payment date cannot be in the future.';
    } else if (dateVal < minDate) {
      errors.date = 'Payment date cannot be older than 90 days.';
    }

    // Remarks validation
    if (paymentRemark.length > MAX_REMARK_CHARS) {
      errors.remarks = `Remarks must be ${MAX_REMARK_CHARS} characters or fewer.`;
    }

    // File validation
    if (!uploadedFile) {
      errors.file = 'You must attach a payment slip (PNG, JPG, or PDF).';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setNotificationType('success');
    setNotification('Payment slip submitted successfully for verification!');
    setShowUploadModal(false);

    // Reset form
    setUploadedFile(null);
    setPaymentAmount('');
    setPaymentRemark('');
  };

  const renderCalendar = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const rows: React.ReactNode[] = [];
    let day = 1 - firstDay;
    while (day <= daysInMonth) {
      const cols: React.ReactNode[] = [];
      for (let i = 0; i < 7; i++, day++) {
        if (day < 1 || day > daysInMonth) cols.push(<td key={i} className="p-1" />);
        else {
          const d = new Date(year, month, day);
          const isToday = d.toDateString() === new Date().toDateString();
          const isHighlight = highlightDate && d.toDateString() === highlightDate.toDateString();
          cols.push(
            <td key={i} className="p-1 text-center align-middle">
              <div className={`w-8 h-8 flex items-center justify-center mx-auto text-xs ${isHighlight ? 'bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-500/30' : isToday ? 'bg-white/10 rounded-full font-bold' : ''}`}>
                {day}
              </div>
            </td>
          );
        }
      }
      rows.push(<tr key={day}>{cols}</tr>);
    }
    return rows;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      <div className="bg-gradient-to-b from-slate-900/60 to-slate-900/95 rounded-2xl p-6 text-white shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar calendar */}
          <aside className="md:col-span-3 bg-white/5 rounded-lg p-4 relative z-10 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Next Due Date</h3>
              <span className="text-xs text-gray-300">{today.toLocaleString('default', { month: 'long' })} {calendarYear}</span>
            </div>
            <table className="w-full text-sm table-fixed">
              <thead>
                <tr className="text-xs text-gray-300">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <th key={d} className="py-1 w-[14%] whitespace-nowrap text-center">{d}</th>)}
                </tr>
              </thead>
              <tbody className="text-gray-200">{renderCalendar(calendarYear, calendarMonth)}</tbody>
            </table>

            <div className="mt-4 text-xs text-gray-300 flex items-center gap-2">
              <span className="inline-flex items-center gap-2"><span className="w-3 h-3 bg-emerald-500 rounded-full" /> Next Due</span>
            </div>
          </aside>

          {/* Main content */}
          <main className="md:col-span-9">
            {notification && (
              <div className="mb-4 p-3 rounded-lg bg-yellow-600/20 text-yellow-200 flex items-center gap-3">
                <AlertCircle size={18} />
                <div className="text-sm">{notification}</div>
              </div>
            )}

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Payment History</h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {payments.map(p => (
                  <div key={p.month} className="min-w-[140px] bg-white/3 rounded-lg p-4 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle size={28} className={p.status === 'paid' ? 'text-emerald-400' : p.status === 'pending' ? 'text-yellow-300' : 'text-rose-400'} />
                        <div>
                          <div className="font-medium">{formatMonthLabel(p.month)}</div>
                          <div className="text-xs text-gray-300">Due {new Date(p.dueDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="text-xs px-2 py-1 rounded-full bg-white/5">{p.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Details & Split Module */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Current Dues</h3>
                    <p className="text-sm text-gray-400">Total Room Rent: Rs. {TOTAL_ROOM_RENT.toLocaleString()}</p>
                  </div>

                  {/* Modern Toggle */}
                  <div className="flex items-center gap-3 bg-slate-800/50 p-1.5 rounded-full border border-white/5 shadow-inner">
                    <button
                      onClick={() => setIsSplitMode(false)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${!isSplitMode ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'text-gray-400 hover:text-white'}`}
                    >
                      Pay Full
                    </button>
                    <button
                      onClick={() => setIsSplitMode(true)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${isSplitMode ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'text-gray-400 hover:text-white'}`}
                    >
                      Split Rate
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-5 border border-white/5 mb-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Your Share To Pay</p>
                      <p className="text-3xl font-bold tracking-tight text-white">
                        Rs. {isSplitMode ? MY_BASE_SHARE.toLocaleString() : TOTAL_ROOM_RENT.toLocaleString()}
                      </p>
                    </div>
                    {isSplitMode && (
                      <div className="text-right">
                        <p className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">
                          Saving Rs. {(TOTAL_ROOM_RENT - MY_BASE_SHARE).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Smooth Expandable Roommates Area */}
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isSplitMode ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="border-t border-white/10 pt-4 mt-2">
                    <h4 className="text-sm font-semibold text-gray-300 mb-4 flex items-center justify-between">
                      Roommates Status
                      <span className="text-xs font-normal text-cyan-400">3 Members Total</span>
                    </h4>

                    <div className="space-y-3">
                      {mockRoommates.map(rm => (
                        <div key={rm.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                              {rm.avatar}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{rm.name}</p>
                              <p className="text-xs text-gray-400">Share: Rs. {rm.amount.toLocaleString()}</p>
                            </div>
                          </div>
                          <div>
                            <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${rm.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                              {rm.status === 'paid' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                              {rm.status.charAt(0).toUpperCase() + rm.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="text-sm font-medium mb-3">Upload Payment Slip</h4>
                  <button
                    onClick={() => {
                      setPaymentAmount(isSplitMode ? MY_BASE_SHARE.toString() : TOTAL_ROOM_RENT.toString());
                      setShowUploadModal(true);
                    }}
                    className="w-full relative group overflow-hidden bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl p-4 shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                    <div className="relative flex items-center justify-center gap-3">
                      <UploadCloud size={24} />
                      <span className="font-semibold text-lg">Make a Payment</span>
                    </div>
                  </button>
                  <p className="text-xs text-center text-gray-400 mt-3">Click to enter details and attach slip</p>
                </div>
              </div>

              <div className="bg-white/3 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">Download Receipts</h3>
                <div className="space-y-3">
                  {payments.filter(p => p.status === 'paid').map(p => (
                    <div key={p.month} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-500/10 rounded-full">
                          <Download size={16} className="text-cyan-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{p.month} Receipt</div>
                          <div className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle size={10} /> Approved</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const doc = generatePaymentReceiptPDF({
                            tenantName: 'Current Student', // Mock data for current logged-in user
                            roomNumber: '102',
                            placeName: 'Sunrise Boarding House',
                            amount: 15000,
                            date: p.month,
                            receiptNumber: `REC-${Math.floor(Math.random() * 100000)}`,
                            paymentMethod: 'Bank Transfer'
                          });
                          doc.save(`Receipt_${p.month.replace(' ', '_')}.pdf`);
                        }}
                        className="text-xs font-medium bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-cyan-500/25"
                      >
                        Download PDF
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

          </main>
        </div>

        {/* System Reminders Section */}
        <section className="bg-white/3 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Bell size={20} className="text-amber-400" />
            System Reminders
          </h3>
          <div className="flex flex-col items-center justify-center py-10 border border-dashed border-white/10 rounded-lg text-gray-400">
            <BellOff size={32} className="mb-3 opacity-30" />
            <p className="text-sm">No reminders</p>
          </div>
        </section>
      </div>

      {/* Upload Slip Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-opacity">
          <div className="bg-slate-900/80 backdrop-blur-2xl ring-1 ring-white/10 w-full max-w-md rounded-3xl shadow-[0_0_40px_-10px_rgba(6,182,212,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/[0.02]">
              <h3 className="text-lg font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/20">
                  <UploadCloud size={18} className="text-cyan-400" />
                </div>
                Submit Payment
              </h3>
              <button
                onClick={() => { setShowUploadModal(false); setFormErrors({}); }}
                className="text-gray-500 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all"
              >
                <XCircle size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="p-6 space-y-5" noValidate>

              {/* Amount */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-2">Payment Amount</label>
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-cyan-400 transition-colors">Rs.</span>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => { setPaymentAmount(e.target.value); setFormErrors(prev => { const n = { ...prev }; delete n.amount; return n; }); }}
                    className={`w-full bg-white/5 border rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-600 focus:bg-white/10 focus:ring-2 transition-all outline-none ${formErrors.amount ? 'border-rose-500/70 focus:ring-rose-500/30' : 'border-white/10 focus:ring-cyan-500/40 focus:border-cyan-500/50'
                      }`}
                    placeholder="e.g. 15000"
                  />
                </div>
                {formErrors.amount && (
                  <p className="flex items-center gap-1.5 text-[11px] text-rose-400 mt-1.5 font-medium">
                    <AlertCircle size={12} /> {formErrors.amount}
                  </p>
                )}
                {!formErrors.amount && <p className="text-[10px] text-cyan-500/70 mt-1.5 font-medium">Entering less than full rent automatically marks it as partial.</p>}
              </div>

              {/* Date */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-2">Date of Transfer</label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => { setPaymentDate(e.target.value); setFormErrors(prev => { const n = { ...prev }; delete n.date; return n; }); }}
                  className={`w-full bg-white/5 border rounded-xl py-2.5 px-4 text-white focus:bg-white/10 focus:ring-2 transition-all outline-none [color-scheme:dark] ${formErrors.date ? 'border-rose-500/70 focus:ring-rose-500/30' : 'border-white/10 focus:ring-cyan-500/40 focus:border-cyan-500/50'
                    }`}
                />
                {formErrors.date && (
                  <p className="flex items-center gap-1.5 text-[11px] text-rose-400 mt-1.5 font-medium">
                    <AlertCircle size={12} /> {formErrors.date}
                  </p>
                )}
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-2">Remarks / Note (Optional)</label>
                <textarea
                  value={paymentRemark}
                  onChange={(e) => { setPaymentRemark(e.target.value); setFormErrors(prev => { const n = { ...prev }; delete n.remarks; return n; }); }}
                  className={`w-full bg-white/5 border rounded-xl py-2.5 px-4 text-white placeholder-gray-600 focus:bg-white/10 focus:ring-2 transition-all resize-none outline-none h-20 ${formErrors.remarks ? 'border-rose-500/70 focus:ring-rose-500/30' : 'border-white/10 focus:ring-cyan-500/40 focus:border-cyan-500/50'
                    }`}
                  placeholder="e.g. Paid half now, will pay rest next week..."
                />
                <div className="flex justify-between items-center mt-1">
                  {formErrors.remarks ? (
                    <p className="flex items-center gap-1.5 text-[11px] text-rose-400 font-medium">
                      <AlertCircle size={12} /> {formErrors.remarks}
                    </p>
                  ) : <span />}
                  <p className={`text-[10px] ml-auto ${paymentRemark.length > MAX_REMARK_CHARS ? 'text-rose-400' : 'text-gray-500'}`}>
                    {paymentRemark.length}/{MAX_REMARK_CHARS}
                  </p>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-2">Attach Slip</label>
                <label className={`block border border-dashed rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.01] ${formErrors.file ? 'border-rose-500/50 bg-rose-500/5' :
                    uploadedFile ? 'border-emerald-500/50 bg-emerald-500/5' :
                      'border-cyan-500/30 bg-cyan-500/5 hover:border-cyan-400/50 hover:bg-cyan-500/10'
                  }`}>
                  <div className="flex flex-col items-center justify-center p-6 text-sm text-center">
                    {uploadedFile ? (
                      <>
                        <div className="p-2 bg-emerald-500/20 rounded-full mb-3 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                          <CheckCircle size={28} className="text-emerald-400" />
                        </div>
                        <span className="font-semibold text-emerald-300">{uploadedFile.name}</span>
                        <span className="text-[10px] text-gray-500 mt-1">Click to replace file</span>
                      </>
                    ) : (
                      <>
                        <div className={`p-2 rounded-full mb-3 ${formErrors.file ? 'bg-rose-500/10' : 'bg-cyan-500/10'}`}>
                          <UploadCloud size={28} className={formErrors.file ? 'text-rose-400' : 'text-cyan-400'} />
                        </div>
                        <span className={`font-semibold ${formErrors.file ? 'text-rose-300' : 'text-cyan-200'}`}>Upload Image or PDF</span>
                        <span className="text-[10px] text-gray-500 mt-1">PNG, JPG, PDF up to 5MB</span>
                      </>
                    )}
                  </div>
                  <input type="file" accept="image/png,image/jpeg,image/jpg,application/pdf" onChange={handleUpload} className="sr-only" />
                </label>
                {formErrors.file && (
                  <p className="flex items-center gap-1.5 text-[11px] text-rose-400 mt-1.5 font-medium">
                    <AlertCircle size={12} /> {formErrors.file}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold tracking-wide py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Submit Payment
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
