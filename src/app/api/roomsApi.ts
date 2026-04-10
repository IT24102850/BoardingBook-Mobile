/**
 * Rooms API Client
 * Handles all room-related API calls to the backend
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface RoomFilters {
  search?: string;
  maxPrice?: number;
  minPrice?: number;
  roomType?: string;
  campus?: string;
  facilities?: string[];
  rating?: number;
  minRating?: number;
  minVacancy?: number;
  sort?: 'price' | 'price-desc' | 'rating' | 'distance' | 'newest';
}

export interface Room {
  _id: string;
  name: string;
  location: string;
  price: number;
  totalSpots: number;
  occupancy: number;
  roomType: string;
  facilities: string[];
  rating: number;
  reviewCount: number;
  campus: string;
  distKm: number;
  description: string;
  images?: string[];
  owner?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  availableFrom?: string;
  deposit?: number;
  amenities?: string[];
  rules?: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SavedSearch {
  _id: string;
  name: string;
  filters: RoomFilters;
  createdAt: string;
  lastUsed: string;
  updatedAt: string;
}

export class RoomsApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'RoomsApiError';
  }
}

/**
 * Fetch rooms with filters
 */
export async function fetchRooms(filters: RoomFilters): Promise<Room[]> {
  try {
    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);
    if (filters.maxPrice) params.append('maxPrice', String(filters.maxPrice));
    if (filters.minPrice) params.append('minPrice', String(filters.minPrice));
    if (filters.roomType && filters.roomType !== 'All') params.append('roomType', filters.roomType);
    if (filters.campus) params.append('campus', filters.campus);
    if (filters.facilities && filters.facilities.length > 0) {
      params.append('facilities', filters.facilities.join(','));
    }
    if (filters.minRating) params.append('minRating', String(filters.minRating));
    if (filters.rating) params.append('minRating', String(filters.rating));
    if (filters.minVacancy) params.append('minVacancy', String(filters.minVacancy));
    if (filters.sort) params.append('sort', filters.sort);

    const response = await fetch(`${API_BASE_URL}/roommates/rooms?${params.toString()}`);

    if (!response.ok) {
      throw new RoomsApiError(`Failed to fetch rooms: ${response.statusText}`, response.status);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw error instanceof RoomsApiError ? error : new RoomsApiError('Failed to fetch rooms');
  }
}

/**
 * Get nearby rooms using geospatial search
 */
export async function getNearestRooms(
  lat: number,
  lng: number,
  maxDistance: number = 5000
): Promise<Room[]> {
  try {
    const params = new URLSearchParams({
      lat: String(lat),
      lng: String(lng),
      maxDistance: String(maxDistance),
    });

    const response = await fetch(`${API_BASE_URL}/roommates/rooms/nearby?${params.toString()}`);

    if (!response.ok) {
      throw new RoomsApiError(`Failed to fetch nearby rooms: ${response.statusText}`, response.status);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching nearby rooms:', error);
    throw error instanceof RoomsApiError ? error : new RoomsApiError('Failed to fetch nearby rooms');
  }
}

/**
 * Get single room details
 */
export async function getRoomById(roomId: string): Promise<Room> {
  try {
    const response = await fetch(`${API_BASE_URL}/roommates/room/${roomId}`);

    if (!response.ok) {
      throw new RoomsApiError(`Failed to fetch room: ${response.statusText}`, response.status);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching room:', error);
    throw error instanceof RoomsApiError ? error : new RoomsApiError('Failed to fetch room');
  }
}

/**
 * Save a search for later
 */
export async function saveSearch(
  name: string,
  filters: RoomFilters,
  token: string
): Promise<SavedSearch> {
  try {
    const response = await fetch(`${API_BASE_URL}/roommates/search/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, filters }),
    });

    if (!response.ok) {
      throw new RoomsApiError(`Failed to save search: ${response.statusText}`, response.status);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error saving search:', error);
    throw error instanceof RoomsApiError ? error : new RoomsApiError('Failed to save search');
  }
}

/**
 * Get all saved searches for authenticated user
 */
export async function getSavedSearches(token: string): Promise<SavedSearch[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/roommates/search/saved`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new RoomsApiError(`Failed to fetch saved searches: ${response.statusText}`, response.status);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching saved searches:', error);
    throw error instanceof RoomsApiError ? error : new RoomsApiError('Failed to fetch saved searches');
  }
}

/**
 * Get specific saved search
 */
export async function getSavedSearch(searchId: string, token: string): Promise<SavedSearch> {
  try {
    const response = await fetch(`${API_BASE_URL}/roommates/search/saved/${searchId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new RoomsApiError(`Failed to fetch saved search: ${response.statusText}`, response.status);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching saved search:', error);
    throw error instanceof RoomsApiError ? error : new RoomsApiError('Failed to fetch saved search');
  }
}

/**
 * Update saved search
 */
export async function updateSavedSearch(
  searchId: string,
  updates: { name?: string; filters?: RoomFilters },
  token: string
): Promise<SavedSearch> {
  try {
    const response = await fetch(`${API_BASE_URL}/roommates/search/saved/${searchId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new RoomsApiError(`Failed to update saved search: ${response.statusText}`, response.status);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error updating saved search:', error);
    throw error instanceof RoomsApiError ? error : new RoomsApiError('Failed to update saved search');
  }
}

/**
 * Delete saved search
 */
export async function deleteSavedSearch(searchId: string, token: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/roommates/search/saved/${searchId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new RoomsApiError(`Failed to delete saved search: ${response.statusText}`, response.status);
    }
  } catch (error) {
    console.error('Error deleting saved search:', error);
    throw error instanceof RoomsApiError ? error : new RoomsApiError('Failed to delete saved search');
  }
}
