import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  BookingRequestDto,
  createOwnerAgreement,
  getOwnerAgreements,
  getOwnerBookingRequests,
} from '../../api/bookingAgreementApi';

type AgreementFormState = {
  bookingRequestId: string;
  title: string;
  terms: string;
  rentAmount: string;
  depositAmount: string;
  periodStart: string;
  periodEnd: string;
  additionalClauses: string;
};

export default function BookingAgreement() {
  const location = useLocation();
  const preferredRequestId = (location.state as any)?.bookingRequestId || '';

  const [approvedRequests, setApprovedRequests] = useState<BookingRequestDto[]>([]);
  const [agreements, setAgreements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState<AgreementFormState>({
    bookingRequestId: '',
    title: '',
    terms: '',
    rentAmount: '',
    depositAmount: '0',
    periodStart: '',
    periodEnd: '',
    additionalClauses: '',
  });

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [requests, sentAgreements] = await Promise.all([
        getOwnerBookingRequests('approved'),
        getOwnerAgreements(),
      ]);

      const withoutAgreement = requests.filter((item) => !item.agreementId?._id);
      setApprovedRequests(withoutAgreement);
      setAgreements(sentAgreements);

      const chosenId = preferredRequestId && withoutAgreement.some((item) => item._id === preferredRequestId)
        ? preferredRequestId
        : withoutAgreement[0]?._id || '';

      if (chosenId) {
        const chosen = withoutAgreement.find((item) => item._id === chosenId);
        setForm((prev) => ({
          ...prev,
          bookingRequestId: chosenId,
          rentAmount: String(chosen?.roomId?.price || prev.rentAmount || 0),
          title: prev.title || 'Boarding House Rental Agreement',
        }));
      }
    } catch (apiError: any) {
      setError(apiError?.message || 'Failed to load agreements data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedRequest = useMemo(
    () => approvedRequests.find((item) => item._id === form.bookingRequestId) || null,
    [approvedRequests, form.bookingRequestId]
  );

  function updateForm<K extends keyof AgreementFormState>(key: K, value: AgreementFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.bookingRequestId) {
      setError('Select an approved booking request');
      return;
    }

    if (form.terms.trim().length < 20) {
      setError('Agreement terms must be at least 20 characters');
      return;
    }

    setSubmitting(true);
    try {
      await createOwnerAgreement({
        bookingRequestId: form.bookingRequestId,
        title: form.title.trim() || 'Boarding House Rental Agreement',
        terms: form.terms.trim(),
        rentAmount: Number(form.rentAmount) || 0,
        depositAmount: Number(form.depositAmount) || 0,
        periodStart: form.periodStart,
        periodEnd: form.periodEnd,
        additionalClauses: form.additionalClauses
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
      });

      setSuccess('Digital agreement created and sent to the approved booking request.');
      setForm((prev) => ({
        ...prev,
        title: 'Boarding House Rental Agreement',
        terms: '',
        additionalClauses: '',
      }));
      await loadData();
    } catch (apiError: any) {
      setError(apiError?.message || 'Failed to send agreement');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#12243f] to-[#14325d] px-4 py-8 text-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-bold mb-1">Manual Digital Agreement</h2>
          <p className="text-gray-300 text-sm mb-6">
            Create agreement terms manually, then send to an approved booking request.
          </p>

          {error && <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/40 p-3 text-red-300 text-sm">{error}</div>}
          {success && <div className="mb-4 rounded-lg bg-green-500/10 border border-green-500/40 p-3 text-green-300 text-sm">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Approved Booking Request</label>
              <select
                value={form.bookingRequestId}
                onChange={(e) => updateForm('bookingRequestId', e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
              >
                <option value="">Select request</option>
                {approvedRequests.map((req) => {
                  const studentName = req.studentId?.fullName || req.studentId?.email || 'Student';
                  const roomName = req.roomId?.name || req.roomId?.roomNumber || 'Room';
                  return (
                    <option key={req._id} value={req._id} className="text-black">
                      {studentName} - {roomName}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Agreement Title</label>
              <input
                value={form.title}
                onChange={(e) => updateForm('title', e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
                placeholder="Boarding House Rental Agreement"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Monthly Rent (LKR)</label>
                <input
                  type="number"
                  min="0"
                  value={form.rentAmount}
                  onChange={(e) => updateForm('rentAmount', e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Deposit Amount (LKR)</label>
                <input
                  type="number"
                  min="0"
                  value={form.depositAmount}
                  onChange={(e) => updateForm('depositAmount', e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Period Start</label>
                <input
                  type="date"
                  value={form.periodStart}
                  onChange={(e) => updateForm('periodStart', e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Period End</label>
                <input
                  type="date"
                  value={form.periodEnd}
                  onChange={(e) => updateForm('periodEnd', e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Agreement Terms</label>
              <textarea
                rows={7}
                value={form.terms}
                onChange={(e) => updateForm('terms', e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
                placeholder="Write the full manual agreement terms here..."
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Additional Clauses (one per line)</label>
              <textarea
                rows={4}
                value={form.additionalClauses}
                onChange={(e) => updateForm('additionalClauses', e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 font-bold disabled:opacity-60"
            >
              {submitting ? 'Sending Agreement...' : 'Create & Send Agreement'}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-lg font-bold mb-2">Approved Requests</h3>
            {loading && <p className="text-gray-300 text-sm">Loading...</p>}
            {!loading && approvedRequests.length === 0 && (
              <p className="text-gray-300 text-sm">No approved requests waiting for an agreement.</p>
            )}
            {!loading && approvedRequests.map((item) => (
              <button
                key={item._id}
                onClick={() => updateForm('bookingRequestId', item._id)}
                className={`w-full mb-2 rounded-lg border px-3 py-2 text-left ${
                  form.bookingRequestId === item._id
                    ? 'border-cyan-400 bg-cyan-500/10'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <p className="font-semibold">{item.studentId?.fullName || item.studentId?.email || 'Student'}</p>
                <p className="text-xs text-gray-300">{item.roomId?.name || item.roomId?.roomNumber || 'Room'}</p>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-lg font-bold mb-2">Sent Agreements</h3>
            {agreements.length === 0 && <p className="text-gray-300 text-sm">No agreements sent yet.</p>}
            {agreements.map((agreement) => (
              <div key={agreement._id} className="mb-2 rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="font-semibold text-sm">{agreement.title}</p>
                <p className="text-xs text-gray-300">{agreement.studentId?.fullName || agreement.studentId?.email || 'Student'}</p>
                <p className="text-xs text-cyan-300 mt-1">Status: {agreement.status}</p>
              </div>
            ))}
          </div>

          {selectedRequest && (
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4">
              <h3 className="text-sm font-semibold mb-1">Selected Request Snapshot</h3>
              <p className="text-sm">{selectedRequest.studentId?.fullName || selectedRequest.studentId?.email || 'Student'}</p>
              <p className="text-xs text-gray-300">Move-in: {new Date(selectedRequest.moveInDate).toLocaleDateString()}</p>
              <p className="text-xs text-gray-300">Duration: {selectedRequest.durationMonths} months</p>
              <p className="text-xs text-gray-300">Room: {selectedRequest.roomId?.name || selectedRequest.roomId?.roomNumber || 'Room'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
