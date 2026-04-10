const API_BASE_URL = (((import.meta as any).env?.VITE_API_URL as string) || '').replace(/\/$/, '');

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

export type BookingRequestDto = {
  _id: string;
  bookingType: 'individual' | 'group';
  groupName?: string;
  groupSize?: number;
  moveInDate: string;
  durationMonths: number;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  roomId?: {
    _id: string;
    name?: string;
    roomNumber?: string;
    price?: number;
    location?: string;
  };
  studentId?: {
    _id: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    mobileNumber?: string;
  };
  agreementId?: {
    _id: string;
    title?: string;
    status?: 'sent' | 'accepted' | 'rejected';
    sentAt?: string;
  };
};

export type BookingAgreementDto = {
  _id: string;
  title: string;
  terms: string;
  rentAmount: number;
  depositAmount: number;
  periodStart: string;
  periodEnd: string;
  additionalClauses: string[];
  status: 'sent' | 'accepted' | 'rejected';
  sentAt: string;
  bookingRequestId?: {
    _id: string;
    status: 'pending' | 'approved' | 'rejected';
    moveInDate: string;
    durationMonths: number;
    bookingType: 'individual' | 'group';
    groupName?: string;
    groupSize?: number;
  };
  studentId?: {
    _id: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    mobileNumber?: string;
  };
  roomId?: {
    _id: string;
    name?: string;
    roomNumber?: string;
    price?: number;
    location?: string;
  };
};

export type RoomListDto = {
  _id: string;
  name: string;
  location: string;
  price: number;
  totalSpots: number;
  occupancy: number;
  roomType?: string;
  images?: string[];
  deposit?: number;
};

function getHeaders() {
  const token = localStorage.getItem('bb_access_token') || '';
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

async function parseResponse<T>(response: Response): Promise<ApiEnvelope<T>> {
  try {
    return (await response.json()) as ApiEnvelope<T>;
  } catch {
    return { success: false, message: 'Invalid server response' };
  }
}

async function ensureSuccess<T>(response: Response): Promise<T> {
  const body = await parseResponse<T>(response);
  if (!response.ok || !body.success || body.data === undefined) {
    throw new Error(body.message || 'Request failed');
  }
  return body.data;
}

export async function getOwnerBookingRequests(status?: 'pending' | 'approved' | 'rejected') {
  const params = new URLSearchParams();
  if (status) {
    params.set('status', status);
  }
  const query = params.toString();
  const response = await fetch(`${API_BASE_URL}/api/owner/booking-requests${query ? `?${query}` : ''}`, {
    headers: getHeaders(),
  });
  return ensureSuccess<BookingRequestDto[]>(response);
}

export async function updateOwnerBookingRequestStatus(
  requestId: string,
  payload: { status: 'approved' | 'rejected'; rejectionReason?: string }
) {
  const response = await fetch(`${API_BASE_URL}/api/owner/booking-requests/${requestId}/status`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return ensureSuccess<BookingRequestDto>(response);
}

export async function createOwnerAgreement(payload: {
  bookingRequestId: string;
  title: string;
  terms: string;
  rentAmount: number;
  depositAmount?: number;
  periodStart: string;
  periodEnd: string;
  additionalClauses?: string[];
}) {
  const response = await fetch(`${API_BASE_URL}/api/owner/agreements`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return ensureSuccess<BookingAgreementDto>(response);
}

export async function getOwnerAgreements(status?: 'sent' | 'accepted' | 'rejected') {
  const params = new URLSearchParams();
  if (status) {
    params.set('status', status);
  }
  const query = params.toString();
  const response = await fetch(`${API_BASE_URL}/api/owner/agreements${query ? `?${query}` : ''}`, {
    headers: getHeaders(),
  });
  return ensureSuccess<BookingAgreementDto[]>(response);
}

export async function getAvailableRooms() {
  const response = await fetch(`${API_BASE_URL}/api/roommates/rooms`, {
    headers: getHeaders(),
  });
  return ensureSuccess<RoomListDto[]>(response);
}

export async function createStudentBookingRequest(payload: {
  roomId: string;
  bookingType: 'individual' | 'group';
  groupName?: string;
  groupSize?: number;
  moveInDate: string;
  durationMonths: number;
  message?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/roommates/booking-request`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return ensureSuccess<BookingRequestDto>(response);
}

export async function getMyBookingRequests() {
  const response = await fetch(`${API_BASE_URL}/api/roommates/booking-requests`, {
    headers: getHeaders(),
  });
  return ensureSuccess<BookingRequestDto[]>(response);
}

export async function getMyAgreements() {
  const response = await fetch(`${API_BASE_URL}/api/roommates/agreements`, {
    headers: getHeaders(),
  });
  return ensureSuccess<BookingAgreementDto[]>(response);
}

export async function respondToMyAgreement(agreementId: string, status: 'accepted' | 'rejected') {
  const response = await fetch(`${API_BASE_URL}/api/roommates/agreements/${agreementId}/respond`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });
  return ensureSuccess<BookingAgreementDto>(response);
}
