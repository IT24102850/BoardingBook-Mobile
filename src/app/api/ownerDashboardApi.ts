const API_BASE_URL = (((import.meta as any).env?.VITE_API_URL as string) || '').replace(/\/$/, '');


type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

export type OwnerHouseDto = {
  _id: string;
  name: string;
  address: string;
  totalRooms: number;
  monthlyPrice?: number;
  roomType?: string;
  availableFrom?: string;
  deposit?: number;
  roommateCount?: string;
  description?: string;
  features?: string[];
  occupiedRooms: number;
  rating: number;
  totalReviews: number;
  image: string;
  images?: string[];
  status: 'active' | 'inactive';
  genderPreference?: 'any' | 'girls' | 'boys';
};

export type OwnerRoomDto = {
  _id: string;
  houseId?: string;
  roomNumber?: string;
  floor?: number;
  bedCount?: number;
  totalSpots?: number;
  occupancy?: number;
  price: number;
  facilities?: string[];
  images?: string[];
  location: string;
  roomType?: string;
  genderPreference?: string;
  availableFrom?: string;
  deposit?: number;
  roommateCount?: string;
  description?: string;
};

function getAuthHeaders() {
  const token = localStorage.getItem('bb_access_token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token || ''}`,
  };
}

async function parse<T>(response: Response): Promise<ApiEnvelope<T>> {
  try {
    return (await response.json()) as ApiEnvelope<T>;
  } catch {
    return { success: false, message: 'Invalid server response' };
  }
}

async function ensureSuccess<T>(response: Response): Promise<T> {
  const data = await parse<T>(response);
  if (!response.ok || !data.success || data.data === undefined) {
    throw new Error(data.message || 'Request failed');
  }
  return data.data;
}

async function getHouses(): Promise<OwnerHouseDto[]> {
  const response = await fetch(`${API_BASE_URL}/api/owner/houses`, {
    headers: getAuthHeaders(),
  });
  return ensureSuccess<OwnerHouseDto[]>(response);
}

async function createHouse(payload: {
  name: string;
  address: string;
  totalRooms: number;
  monthlyPrice?: number;
  roomType?: string;
  availableFrom?: string;
  deposit?: number;
  roommateCount?: string;
  description?: string;
  features?: string[];
  image?: string;
  images?: string[];
  status?: 'active' | 'inactive';
  genderPreference?: 'any' | 'girls' | 'boys';
}): Promise<OwnerHouseDto> {
  const response = await fetch(`${API_BASE_URL}/api/owner/houses`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return ensureSuccess<OwnerHouseDto>(response);
}

async function updateHouse(houseId: string, payload: Partial<OwnerHouseDto>): Promise<OwnerHouseDto> {
  const response = await fetch(`${API_BASE_URL}/api/owner/houses/${houseId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return ensureSuccess<OwnerHouseDto>(response);
}

async function deleteHouse(houseId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/owner/houses/${houseId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  const body = await parse<unknown>(response);
  if (!response.ok || !body.success) {
    throw new Error(body.message || 'Failed to delete house');
  }
}

async function getRooms(): Promise<OwnerRoomDto[]> {
  const response = await fetch(`${API_BASE_URL}/api/owner/rooms`, {
    headers: getAuthHeaders(),
  });
  return ensureSuccess<OwnerRoomDto[]>(response);
}

async function createRoom(payload: {
  name?: string;
  houseId: string;
  roomNumber: string;
  floor: number;
  bedCount: number;
  price: number;
  facilities: string[];
  images: string[];
  location: string;
  roomType: string;
  genderPreference: string;
  availableFrom: string;
  deposit: number;
  roommateCount: string;
  description: string;
  owner?: string;
  ownerPhone?: string;
  ownerEmail?: string;
}): Promise<OwnerRoomDto> {
  const response = await fetch(`${API_BASE_URL}/api/owner/rooms`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return ensureSuccess<OwnerRoomDto>(response);
}

async function updateRoom(roomId: string, payload: Partial<OwnerRoomDto>): Promise<OwnerRoomDto> {
  const response = await fetch(`${API_BASE_URL}/api/owner/rooms/${roomId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return ensureSuccess<OwnerRoomDto>(response);
}

async function deleteRoom(roomId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/owner/rooms/${roomId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  const body = await parse<unknown>(response);
  if (!response.ok || !body.success) {
    throw new Error(body.message || 'Failed to delete room');
  }
}


// Booking Requests API
export type BookingRequestDto = {
  _id: string;
  studentId: string;
  ownerId: string;
  roomId: string;
  bookingType: 'individual' | 'group';
  groupName?: string;
  groupSize?: number;
  moveInDate: string;
  durationMonths: number;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  agreementId?: string;
  processedAt?: string;
  processedBy?: string;
  createdAt: string;
  updatedAt: string;
  room?: any;
  student?: any;
};

async function getBookingRequests(status?: string): Promise<BookingRequestDto[]> {
  const url = status
    ? `${API_BASE_URL}/api/owner/booking-requests?status=${status}`
    : `${API_BASE_URL}/api/owner/booking-requests`;
  const response = await fetch(url, { headers: getAuthHeaders() });
  return ensureSuccess<BookingRequestDto[]>(response);
}

async function updateBookingRequestStatus(requestId: string, status: 'approved' | 'rejected', rejectionReason?: string): Promise<BookingRequestDto> {
  const response = await fetch(`${API_BASE_URL}/api/owner/booking-requests/${requestId}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status, rejectionReason }),
  });
  return ensureSuccess<BookingRequestDto>(response);
}

export const ownerDashboardApi = {
  getHouses,
  createHouse,
  updateHouse,
  deleteHouse,
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  getBookingRequests,
  updateBookingRequestStatus,
};
