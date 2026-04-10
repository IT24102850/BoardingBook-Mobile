// src/lib/adminApi.ts   ← Recommended file name/location

// ================================================
//  PRODUCTION + DEVELOPMENT READY API CONFIG
// ================================================

// Priority: VITE_API_URL (Vite) > REACT_APP_... (for compatibility) > localhost fallback
const getApiBaseUrl = (): string => {
  // Vite (recommended)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  }

  // Create React App style (for backward compatibility)
  if (typeof process !== 'undefined' && process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL.replace(/\/$/, '');
  }
  if (typeof process !== 'undefined' && process.env.REACT_APP_API_BASE) {
    return process.env.REACT_APP_API_BASE.replace(/\/$/, '');
  }

  // Development fallback
  return 'http://localhost:5001';
};

const API_BASE_URL = getApiBaseUrl();
const BASE = `${API_BASE_URL}/api/admin`;

console.log('🔗 Admin API Base URL:', BASE); // Helpful for debugging

// Token helper
const getToken = () => localStorage.getItem('adminToken') ?? '';

// Auth headers
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

// Generic request function with better error handling
async function req<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...authHeaders(),
        ...options.headers,
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(
        data.message || 
        data.error || 
        `Request failed with status ${res.status}`
      );
    }

    return data;
  } catch (error: any) {
    console.error(`❌ API Error [${url}]`, error);
    throw new Error(error.message || 'Network error. Please check your connection.');
  }
}

// ──────────────────────────────────────────────
//  AUTH
// ──────────────────────────────────────────────
export const loginAdmin = (email: string, password: string) =>
  req<{ success: boolean; data: { token: string; admin: { id: string; name: string; email: string } } }>(
    `${BASE}/login`,
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }
  );

export const getMe = () =>
  req<{ success: boolean; data: { id: string; name: string; email: string; lastLogin: string } }>(
    `${BASE}/me`
  );

// ──────────────────────────────────────────────
//  STATS
// ──────────────────────────────────────────────
export const getStats = () =>
  req<{ success: boolean; data: { totalStudents: number; totalOwners: number; pendingKyc: number; bannedUsers: number } }>(
    `${BASE}/stats`
  );

export const getSignupChart = (days: number) =>
  req<{ success: boolean; data: { date: string; students: number; owners: number }[] }>(
    `${BASE}/signup-chart?days=${days}`
  );

export const getTicketStats = () =>
  req<{ success: boolean; data: { open: number; in_progress: number; resolved: number; closed: number } }>(
    `${BASE}/tickets/stats`
  );

export const getReviewStats = () =>
  req<{ success: boolean; data: { total: number; flagged: number; hidden: number } }>(
    `${BASE}/reviews/stats`
  );

// ──────────────────────────────────────────────
//  USERS
// ──────────────────────────────────────────────
export const getUsers = (params: { role?: string; search?: string; page?: number } = {}) => {
  const query = new URLSearchParams();
  if (params.role) query.set('role', params.role);
  if (params.search) query.set('search', params.search);
  if (params.page) query.set('page', String(params.page));

  return req<{ success: boolean; data: { users: User[]; total: number } }>(
    `${BASE}/users?${query.toString()}`
  );
};

export const banUser = (id: string) =>
  req(`${BASE}/users/${id}/ban`, { method: 'PATCH' });

export const unbanUser = (id: string) =>
  req(`${BASE}/users/${id}/unban`, { method: 'PATCH' });

export const getUserActivity = (id: string) =>
  req<{ success: boolean; data: { lastLogin: string | null; loginHistory: { loginAt: string }[] } }>(
    `${BASE}/users/${id}/activity`
  );

// ──────────────────────────────────────────────
//  KYC
// ──────────────────────────────────────────────
export const getKyc = (status: string) =>
  req<{ success: boolean; data: User[] }>(`${BASE}/kyc?status=${status}`);

export const approveKyc = (id: string) =>
  req(`${BASE}/kyc/${id}/approve`, { method: 'PATCH' });

export const rejectKyc = (id: string, reason?: string) =>
  req(`${BASE}/kyc/${id}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  });

// ──────────────────────────────────────────────
//  TICKETS
// ──────────────────────────────────────────────
export const getTickets = (status?: string) => {
  const query = status && status !== 'All' 
    ? `?status=${status.toLowerCase().replace(' ', '_')}` 
    : '';
  return req<{ success: boolean; data: { tickets: Ticket[] } }>(`${BASE}/tickets${query}`);
};

export const getTicketById = (id: string) =>
  req<{ success: boolean; data: Ticket }>(`${BASE}/tickets/${id}`);

export const updateTicketStatus = (id: string, status: string) =>
  req<{ success: boolean; data: Ticket }>(`${BASE}/tickets/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

export const replyToTicket = (id: string, content: string) =>
  req<{ success: boolean; data: Ticket }>(`${BASE}/tickets/${id}/reply`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });

// ──────────────────────────────────────────────
//  REVIEWS
// ──────────────────────────────────────────────
export const getReviews = (isFlagged?: boolean) => {
  const query = isFlagged !== undefined ? `?isFlagged=${isFlagged}` : '';
  return req<{ success: boolean; data: { reviews: Review[] } }>(`${BASE}/reviews${query}`);
};

export const flagReview = (id: string, reason?: string) =>
  req(`${BASE}/reviews/${id}/flag`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  });

export const unflagReview = (id: string) =>
  req(`${BASE}/reviews/${id}/unflag`, { method: 'PATCH' });

export const deleteReview = (id: string) =>
  req(`${BASE}/reviews/${id}`, { method: 'DELETE' });

// ================================================
//  TYPES
// ================================================
export interface User {
  _id: string;
  email: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  role: 'student' | 'owner';
  isBanned: boolean;
  isVerified: boolean;
  kycStatus?: 'not_submitted' | 'pending' | 'approved' | 'rejected';
  lastLogin?: string;
  createdAt: string;
}

export interface Ticket {
  _id: string;
  userId: { _id: string; email: string; fullName?: string; role: string };
  subject: string;
  description: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  messages: TicketMessage[];
  createdAt: string;
}

export interface TicketMessage {
  _id: string;
  sender: 'user' | 'admin';
  content: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  userId: { _id: string; email: string; fullName?: string; role: string };
  rating: number;
  comment: string;
  isFlagged: boolean;
  isVisible: boolean;
  createdAt: string;
}

// ================================================
//  HELPERS
// ================================================
export const displayName = (u: Partial<User>) =>
  u.fullName || [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email?.split('@')[0] || 'User';

export const initials = (name: string) =>
  name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

export const statusLabel: Record<string, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};