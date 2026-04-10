import React, { useEffect, useMemo, useState } from 'react';
import { Home, Send, FileSignature, CheckCircle, XCircle, Clock, RefreshCcw } from 'lucide-react';
import {
  createStudentBookingRequest,
  getAvailableRooms,
  getMyAgreements,
  getMyBookingRequests,
  respondToMyAgreement,
  RoomListDto,
  BookingRequestDto,
  BookingAgreementDto,
} from '../../api/bookingAgreementApi';

type RequestFormState = {
  roomId: string;
  bookingType: 'individual' | 'group';
  groupName: string;
  groupSize: string;
  moveInDate: string;
  durationMonths: string;
  message: string;
};

export default function StudentBookingDashboard() {
  const [rooms, setRooms] = useState<RoomListDto[]>([]);
  const [requests, setRequests] = useState<BookingRequestDto[]>([]);
  const [agreements, setAgreements] = useState<BookingAgreementDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [respondingId, setRespondingId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState<RequestFormState>({
    roomId: '',
    bookingType: 'individual',
    groupName: '',
    groupSize: '1',
    moveInDate: '',
    durationMonths: '6',
    message: '',
  });

  const selectedRoom = useMemo(
    () => rooms.find((room) => room._id === form.roomId) || null,
    [rooms, form.roomId]
  );

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [roomData, requestData, agreementData] = await Promise.all([
        getAvailableRooms(),
        getMyBookingRequests(),
        getMyAgreements(),
      ]);
      setRooms(roomData);
      setRequests(requestData);
      setAgreements(agreementData);

      if (!form.roomId && roomData.length > 0) {
        setForm((prev) => ({ ...prev, roomId: roomData[0]._id }));
      }
    } catch (apiError: any) {
      setError(apiError?.message || 'Failed to load booking dashboard data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setField<K extends keyof RequestFormState>(key: K, value: RequestFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmitRequest(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.roomId || !form.moveInDate) {
      setError('Room and move-in date are required');
      return;
    }

    setSubmitting(true);
    try {
      const created = await createStudentBookingRequest({
        roomId: form.roomId,
        bookingType: form.bookingType,
        groupName: form.bookingType === 'group' ? form.groupName : '',
        groupSize: form.bookingType === 'group' ? Number(form.groupSize) || 1 : 1,
        moveInDate: form.moveInDate,
        durationMonths: Number(form.durationMonths) || 6,
        message: form.message,
      });

      setRequests((prev) => [created, ...prev]);
      setSuccess('Booking request submitted successfully.');
      setForm((prev) => ({
        ...prev,
        bookingType: 'individual',
        groupName: '',
        groupSize: '1',
        durationMonths: '6',
        message: '',
      }));
    } catch (apiError: any) {
      setError(apiError?.message || 'Failed to submit booking request');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAgreementResponse(agreementId: string, status: 'accepted' | 'rejected') {
    setRespondingId(agreementId);
    setError('');
    setSuccess('');
    try {
      const updated = await respondToMyAgreement(agreementId, status);
      setAgreements((prev) => prev.map((item) => (item._id === agreementId ? updated : item)));
      setSuccess(`Agreement ${status}.`);
    } catch (apiError: any) {
      setError(apiError?.message || 'Failed to respond to agreement');
    } finally {
      setRespondingId('');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-300 bg-clip-text text-transparent mb-2">
              Student Booking & Agreements
            </h1>
            <p className="text-gray-400">Submit booking requests and respond to owner agreements.</p>
          </div>
          <button
            onClick={loadData}
            className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20 flex items-center gap-2"
          >
            <RefreshCcw size={14} />
            Refresh
          </button>
        </div>

        {error && <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/40 p-3 text-red-300 text-sm">{error}</div>}
        {success && <div className="mb-4 rounded-lg bg-green-500/10 border border-green-500/40 p-3 text-green-300 text-sm">{success}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmitRequest} className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#1b2340] to-[#111a33] p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Send size={18} className="text-cyan-400" />
                Submit Booking Request
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Room</label>
                  <select
                    value={form.roomId}
                    onChange={(event) => setField('roomId', event.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
                  >
                    <option value="">Select room</option>
                    {rooms.map((room) => (
                      <option key={room._id} value={room._id} className="text-black">
                        {room.name} - Rs. {room.price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-300 mb-1">Booking Type</label>
                  <select
                    value={form.bookingType}
                    onChange={(event) => setField('bookingType', event.target.value as 'individual' | 'group')}
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
                  >
                    <option value="individual" className="text-black">Individual</option>
                    <option value="group" className="text-black">Group</option>
                  </select>
                </div>

                {form.bookingType === 'group' && (
                  <>
                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Group Name</label>
                      <input
                        value={form.groupName}
                        onChange={(event) => setField('groupName', event.target.value)}
                        className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
                        placeholder="SLIIT Friends"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Group Size</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={form.groupSize}
                        onChange={(event) => setField('groupSize', event.target.value)}
                        className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs text-gray-300 mb-1">Move-in Date</label>
                  <input
                    type="date"
                    value={form.moveInDate}
                    onChange={(event) => setField('moveInDate', event.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-300 mb-1">Duration (Months)</label>
                  <input
                    type="number"
                    min="1"
                    max="36"
                    value={form.durationMonths}
                    onChange={(event) => setField('durationMonths', event.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs text-gray-300 mb-1">Message to Owner</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(event) => setField('message', event.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white"
                  placeholder="Any details about your request..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting || loading}
                className="mt-4 w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 font-bold text-white disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : 'Submit Booking Request'}
              </button>
            </form>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a2137] to-[#10182d] p-6">
              <h2 className="text-xl font-bold text-white mb-4">My Booking Requests</h2>
              {requests.length === 0 && !loading && <p className="text-gray-400">No booking requests yet.</p>}
              <div className="space-y-3">
                {requests.map((request) => (
                  <div key={request._id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-white">{request.roomId?.name || request.roomId?.roomNumber || 'Room'}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        request.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : request.status === 'approved'
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 mt-1">Move-in: {new Date(request.moveInDate).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-300">Duration: {request.durationMonths} months</p>
                    {request.rejectionReason && <p className="text-xs text-red-300 mt-1">Reason: {request.rejectionReason}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#1b223a] to-[#121a31] p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FileSignature size={18} className="text-cyan-300" />
                My Agreements
              </h2>
              {agreements.length === 0 && !loading && (
                <p className="text-gray-400 text-sm">No agreements received yet.</p>
              )}
              <div className="space-y-3">
                {agreements.map((agreement) => (
                  <div key={agreement._id} className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <p className="font-semibold text-sm text-white">{agreement.title}</p>
                    <p className="text-xs text-gray-300">Room: {agreement.roomId?.name || agreement.roomId?.roomNumber || 'Room'}</p>
                    <p className="text-xs text-gray-300">Rent: Rs. {agreement.rentAmount.toLocaleString()}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        agreement.status === 'sent'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : agreement.status === 'accepted'
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        {agreement.status === 'sent' && <Clock size={12} className="inline mr-1" />}
                        {agreement.status === 'accepted' && <CheckCircle size={12} className="inline mr-1" />}
                        {agreement.status === 'rejected' && <XCircle size={12} className="inline mr-1" />}
                        {agreement.status}
                      </span>
                    </div>

                    {agreement.status === 'sent' && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button
                          disabled={respondingId === agreement._id}
                          onClick={() => handleAgreementResponse(agreement._id, 'accepted')}
                          className="rounded-md bg-green-600/80 px-2 py-2 text-xs font-semibold text-white hover:bg-green-600 disabled:opacity-60"
                        >
                          Accept
                        </button>
                        <button
                          disabled={respondingId === agreement._id}
                          onClick={() => handleAgreementResponse(agreement._id, 'rejected')}
                          className="rounded-md bg-red-600/80 px-2 py-2 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-60"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    <details className="mt-3 text-xs text-gray-200">
                      <summary className="cursor-pointer text-cyan-300">View agreement terms</summary>
                      <pre className="mt-2 whitespace-pre-wrap font-sans text-xs text-gray-200">{agreement.terms}</pre>
                    </details>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#1b223a] to-[#121a31] p-6">
              <h2 className="text-lg font-bold text-white mb-3">Selected Room Snapshot</h2>
              {!selectedRoom && <p className="text-gray-400 text-sm">Choose a room to view details.</p>}
              {selectedRoom && (
                <>
                  <p className="font-semibold text-white">{selectedRoom.name}</p>
                  <p className="text-sm text-gray-300">{selectedRoom.location}</p>
                  <p className="text-sm text-cyan-300 mt-1">Rs. {selectedRoom.price.toLocaleString()} / month</p>
                  <p className="text-xs text-gray-300 mt-1">Vacancy: {Math.max(0, selectedRoom.totalSpots - selectedRoom.occupancy)} / {selectedRoom.totalSpots}</p>
                  <button
                    onClick={() => window.location.assign('/find')}
                    className="mt-3 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20 flex items-center justify-center gap-2"
                  >
                    <Home size={14} />
                    Browse More Rooms
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
