import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, Clock, Home, User, XCircle } from 'lucide-react';
import {
  BookingRequestDto,
  getOwnerBookingRequests,
  updateOwnerBookingRequestStatus,
} from '../api/bookingAgreementApi';

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected';

export default function OwnerApprovalPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<BookingRequestDto[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState('');

  const selectedRequest = useMemo(
    () => requests.find((item) => item._id === selectedId) || null,
    [requests, selectedId]
  );

  const pendingCount = useMemo(
    () => requests.filter((item) => item.status === 'pending').length,
    [requests]
  );

  async function loadRequests() {
    setLoading(true);
    setError('');
    try {
      const data = await getOwnerBookingRequests(filterStatus === 'all' ? undefined : filterStatus);
      setRequests(data);
      if (data.length > 0 && !data.some((item) => item._id === selectedId)) {
        setSelectedId(data[0]._id);
      }
      if (data.length === 0) {
        setSelectedId('');
      }
    } catch (apiError: any) {
      setError(apiError?.message || 'Failed to load booking requests');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  async function handleApprove(requestId: string) {
    setActionLoadingId(requestId);
    setError('');
    try {
      const updated = await updateOwnerBookingRequestStatus(requestId, { status: 'approved' });
      setRequests((prev) => prev.map((item) => (item._id === requestId ? updated : item)));
    } catch (apiError: any) {
      setError(apiError?.message || 'Failed to approve booking request');
    } finally {
      setActionLoadingId('');
    }
  }

  async function handleReject(requestId: string) {
    const reason = window.prompt('Enter rejection reason (minimum 5 characters):', 'Not eligible for this room');
    if (reason === null) {
      return;
    }

    setActionLoadingId(requestId);
    setError('');
    try {
      const updated = await updateOwnerBookingRequestStatus(requestId, {
        status: 'rejected',
        rejectionReason: reason,
      });
      setRequests((prev) => prev.map((item) => (item._id === requestId ? updated : item)));
    } catch (apiError: any) {
      setError(apiError?.message || 'Failed to reject booking request');
    } finally {
      setActionLoadingId('');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b]">
      <div className="sticky top-0 z-50 bg-gradient-to-r from-[#0a1124] to-[#131d3a] border-b border-white/10 p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Owner Booking Requests</h1>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-3 py-1">
            <AlertCircle size={16} className="text-yellow-400" />
            <span className="text-yellow-400 font-bold text-sm">{pendingCount} pending</span>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterStatus === status
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
          <button
            onClick={loadRequests}
            className="ml-auto px-4 py-2 rounded-lg bg-white/10 text-gray-200 hover:bg-white/20 transition"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {loading && (
              <div className="bg-white/5 rounded-lg p-8 border border-white/10 text-center text-gray-300">Loading booking requests...</div>
            )}

            {!loading && requests.map((request) => {
              const studentName = request.studentId?.fullName || request.studentId?.email || 'Student';
              const roomName = request.roomId?.name || request.roomId?.roomNumber || 'Room';
              return (
                <div
                  key={request._id}
                  onClick={() => setSelectedId(request._id)}
                  className={`bg-white/5 rounded-lg p-4 border-2 cursor-pointer transition ${
                    selectedId === request._id
                      ? 'border-cyan-400 bg-cyan-500/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-bold text-lg">{studentName}</h3>
                      <p className="text-gray-400 text-sm">{roomName}</p>
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${
                        request.status === 'pending'
                          ? 'bg-yellow-500/30 text-yellow-300'
                          : request.status === 'approved'
                          ? 'bg-green-500/30 text-green-300'
                          : 'bg-red-500/30 text-red-300'
                      }`}
                    >
                      {request.status === 'pending' && <Clock size={14} />}
                      {request.status === 'approved' && <CheckCircle size={14} />}
                      {request.status === 'rejected' && <XCircle size={14} />}
                      {request.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-gray-400">Requested</span>
                      <p className="text-white font-semibold">{new Date(request.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Move-in</span>
                      <p className="text-white font-semibold">{new Date(request.moveInDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Monthly Rent</span>
                      <p className="text-cyan-400 font-bold">Rs. {(request.roomId?.price || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {!loading && requests.length === 0 && (
              <div className="bg-white/5 rounded-lg p-8 border border-white/10 text-center">
                <p className="text-gray-400">No booking requests for this filter</p>
              </div>
            )}
          </div>

          {selectedRequest && (
            <div className="bg-white/5 rounded-lg p-6 border border-white/10 h-fit sticky top-20">
              <h3 className="text-white font-bold text-lg mb-4">Request Details</h3>

              <div className="space-y-4 mb-6">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="text-cyan-400" size={20} />
                    <span className="text-gray-400 text-sm">Student</span>
                  </div>
                  <p className="text-white font-semibold">{selectedRequest.studentId?.fullName || selectedRequest.studentId?.email || 'Student'}</p>
                  <p className="text-cyan-400 text-sm mt-1">{selectedRequest.studentId?.email || 'No email'}</p>
                  <p className="text-cyan-400 text-sm">{selectedRequest.studentId?.phoneNumber || selectedRequest.studentId?.mobileNumber || 'No phone'}</p>
                </div>

                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Home className="text-cyan-400" size={20} />
                    <span className="text-gray-400 text-sm">Booking</span>
                  </div>
                  <p className="text-white font-semibold">{selectedRequest.roomId?.name || selectedRequest.roomId?.roomNumber || 'Room'}</p>
                  <p className="text-gray-300 text-sm">Type: {selectedRequest.bookingType}</p>
                  <p className="text-gray-300 text-sm">Duration: {selectedRequest.durationMonths} months</p>
                  {selectedRequest.bookingType === 'group' && (
                    <p className="text-gray-300 text-sm">
                      Group: {selectedRequest.groupName || 'Unnamed'} ({selectedRequest.groupSize || 1})
                    </p>
                  )}
                  {selectedRequest.message && (
                    <p className="text-gray-300 text-sm mt-2">Message: {selectedRequest.message}</p>
                  )}
                </div>
              </div>

              {selectedRequest.status === 'pending' && (
                <div className="space-y-2">
                  <button
                    disabled={actionLoadingId === selectedRequest._id}
                    onClick={() => handleApprove(selectedRequest._id)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 disabled:opacity-60 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Approve Booking
                  </button>
                  <button
                    disabled={actionLoadingId === selectedRequest._id}
                    onClick={() => handleReject(selectedRequest._id)}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 disabled:opacity-60 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} />
                    Reject Request
                  </button>
                </div>
              )}

              {selectedRequest.status === 'approved' && (
                <div className="space-y-2">
                  <div className="text-center py-3 rounded-lg bg-green-500/20 text-green-300 font-bold">Approved</div>
                  <button
                    onClick={() => navigate('/owner-agreements', { state: { bookingRequestId: selectedRequest._id } })}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-2 px-4 rounded-lg transition"
                  >
                    {selectedRequest.agreementId?._id ? 'View Agreement' : 'Create & Send Agreement'}
                  </button>
                </div>
              )}

              {selectedRequest.status === 'rejected' && (
                <div className="text-center py-3 rounded-lg bg-red-500/20 text-red-300">
                  <p className="font-bold">Rejected</p>
                  {selectedRequest.rejectionReason && (
                    <p className="text-xs text-red-200 mt-1">{selectedRequest.rejectionReason}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
