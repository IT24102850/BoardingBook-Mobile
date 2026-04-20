import { Platform } from 'react-native';
import { BookingRecord, BookingType } from '../types';

const API_BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:5000/api/bookings' : 'http://localhost:5000/api/bookings';

interface RequestPayload {
  bookingType: BookingType;
  requesterName: string;
  studentNames: string[];
  roomDetails: string;
  monthlyRent: number;
  periodStart: string;
  periodEnd: string;
}

const normalizeBooking = (booking: any): BookingRecord => ({
  id: String(booking.id || booking._id),
  bookingType: booking.bookingType,
  requesterName: booking.requesterName,
  studentNames: Array.isArray(booking.studentNames) ? booking.studentNames : [],
  roomDetails: booking.roomDetails,
  monthlyRent: Number(booking.monthlyRent),
  periodStart: booking.periodStart,
  periodEnd: booking.periodEnd,
  status: booking.status,
  createdAt: booking.createdAt,
  ownerDecisionNote: booking.ownerDecisionNote,
  agreement: booking.agreement
    ? {
        agreementId: booking.agreement.agreementId,
        generatedAt: booking.agreement.generatedAt,
        studentSignatures: booking.agreement.studentSignatures || {},
        ownerConfirmedAt: booking.agreement.ownerConfirmedAt,
        pdfDataUri: booking.agreement.pdfDataUri,
      }
    : undefined,
});

const parseJson = async (response: Response) => {
  const text = await response.text();
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
};

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  const data = await parseJson(response);

  if (!response.ok) {
    const message = data?.error || 'Request failed';
    throw new Error(message);
  }

  return data as T;
};

export const fetchBookings = async (): Promise<BookingRecord[]> => {
  const data = await request<any[]>('/', { method: 'GET' });
  return data.map(normalizeBooking);
};

export const submitBookingRequest = async (payload: RequestPayload): Promise<BookingRecord> => {
  const data = await request<any>('/request', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return normalizeBooking(data);
};

export const ownerDecision = async (
  bookingId: string,
  decision: 'approve' | 'reject',
  note?: string,
): Promise<BookingRecord> => {
  const data = await request<any>(`/${bookingId}/owner-decision`, {
    method: 'PATCH',
    body: JSON.stringify({ decision, note: note || '' }),
  });
  return normalizeBooking(data);
};

export const generateAgreement = async (bookingId: string): Promise<BookingRecord> => {
  const data = await request<any>(`/${bookingId}/generate-agreement`, {
    method: 'POST',
  });
  return normalizeBooking(data);
};

export const signAgreementAsStudent = async (bookingId: string, studentName: string): Promise<BookingRecord> => {
  const data = await request<any>(`/${bookingId}/student-sign`, {
    method: 'POST',
    body: JSON.stringify({ studentName }),
  });
  return normalizeBooking(data);
};

export const ownerConfirmAgreement = async (bookingId: string): Promise<BookingRecord> => {
  const data = await request<any>(`/${bookingId}/owner-confirm`, {
    method: 'POST',
  });
  return normalizeBooking(data);
};

export const fetchAgreementPdf = async (bookingId: string): Promise<string> => {
  const data = await request<{ pdfDataUri: string }>(`/${bookingId}/agreement-pdf`, {
    method: 'GET',
  });
  return data.pdfDataUri;
};
