// API service for payment-related endpoints
const BASE_URL = 'http://localhost:5000/api';

export interface PaymentSlip {
  id: string;
  tenantId?: string;
  tenantName: string;
  roomId?: string;
  roomNumber: string;
  boardingHouseId?: string;
  placeId: string;
  boardingHouseName?: string;
  placeName: string;
  amount: number;
  originalRent: number;
  date: string;
  slipUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  trustScore?: 'high' | 'medium' | 'low';
  uploadedAt?: string;
}

export interface PaymentData {
  id: string;
  tenantId: string;
  tenantName: string;
  roomId: string;
  roomNumber: string;
  boardingHouseId: string;
  boardingHouseName: string;
  monthlyRent: number;
  outstandingBalance: number;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  lastPaidDate?: string;
  trustScore?: 'high' | 'medium' | 'low';
  checkInDate: string;
}

export interface FinancialOverview {
  totalExpected: number;
  totalCollected: number;
  totalDeficit: number;
  collectionPercentage: number;
  overdueCount: number;
}

/**
 * REAL API: Fetch all boarding places for the authenticated owner
 * This calls the payment module backend endpoint
 * Returns real data from MongoDB - NO MOCK DATA
 */
export const getOwnerBoardingPlaces = async (): Promise<any[]> => {
  try {
    const token = localStorage.getItem('bb_access_token');
    
    // DEBUG: Log token info
    console.log('🔑 PaymentAPI Debug:');
    console.log('   Token exists:', !!token);
    console.log('   Token length:', token?.length);
    console.log('   Token preview:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
    console.log('   Full URL:', `${BASE_URL}/payment/boarding-places`);
    console.log('   Headers:', {
      'Authorization': `Bearer ${token ? `${token.substring(0, 20)}...` : 'NO TOKEN'}`,
    });
    
    const response = await fetch(`${BASE_URL}/payment/boarding-places`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('   Response Status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('   Error Response:', errorData);
      throw new Error(errorData.message || 'Failed to fetch boarding places');
    }
    
    const data = await response.json();
    console.log('   Success Response:', data);
    
    // ✅ SUCCESS - Return the data array
    if (data.success && Array.isArray(data.data)) {
      console.log('   Data is array, returning:', data.data.length, 'houses');
      return data.data;
    }
    
    // ✅ SUCCESS but data might be wrapped differently
    if (data.success && data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
      console.log('   Data is object (not array), checking structure:', Object.keys(data.data));
      // If it's an object but not an array, extract the houses array if present
      if (data.data.houses && Array.isArray(data.data.houses)) {
        return data.data.houses;
      }
      if (data.data.boardingPlaces && Array.isArray(data.data.boardingPlaces)) {
        return data.data.boardingPlaces;
      }
      // If it's a single object, wrap it in an array
      return [data.data];
    }
    
    // If no data but success, return empty array (triggers "No boarding places" message)
    if (data.success && !data.data) {
      console.log('   No data in response');
      return [];
    }
    
    throw new Error(data.message || 'Failed to fetch boarding places');
  } catch (error) {
    console.error('Error fetching boarding places:', error);
    throw error;
  }
};

// Fetch all boarding houses for the logged-in owner (LEGACY - DO NOT USE)
export const getBoardingHouses = async (ownerId: string): Promise<any[]> => {
  try {
    const response = await fetch(`${BASE_URL}/owner/houses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('bb_access_token')}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch boarding houses');
    return response.json();
  } catch (error) {
    console.error('Error fetching boarding houses:', error);
    throw error;
  }
};

// Fetch all rooms for a boarding house
export const getRoomsForHouse = async (houseId: string): Promise<any[]> => {
  try {
    const response = await fetch(`${BASE_URL}/owner/rooms?houseId=${houseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('bb_access_token')}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch rooms');
    return response.json();
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
};

// Fetch pending payment slips (new slips to review)
export const getPendingPaymentSlips = async (): Promise<PaymentSlip[]> => {
  try {
    const response = await fetch(`${BASE_URL}/owner/payment-slips?status=pending`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('bb_access_token')}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch payment slips');
    return response.json();
  } catch (error) {
    console.error('Error fetching payment slips:', error);
    throw error;
  }
};

// Fetch all payment history with optional filtering
export const getPaymentHistory = async (filters?: {
  boardingHouseId?: string;
  status?: string;
  daysOverdue?: number;
}): Promise<PaymentData[]> => {
  try {
    const params = new URLSearchParams();
    if (filters?.boardingHouseId) params.append('houseId', filters.boardingHouseId);
    if (filters?.status) params.append('status', filters.status);

    const response = await fetch(`${BASE_URL}/owner/payment-history?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('bb_access_token')}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch payment history');
    return response.json();
  } catch (error) {
    console.error('Error fetching payment history:', error);
    throw error;
  }
};

// Get financial overview metrics
export const getFinancialOverview = async (): Promise<FinancialOverview> => {
  try {
    const response = await fetch(`${BASE_URL}/owner/financial-overview`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('bb_access_token')}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch financial overview');
    return response.json();
  } catch (error) {
    console.error('Error fetching financial overview:', error);
    throw error;
  }
};

// Approve a payment slip
export const approvePaymentSlip = async (slipId: string): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/owner/payment-slips/${slipId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('bb_access_token')}`,
      },
    });

    if (!response.ok) throw new Error('Failed to approve payment slip');
    return response.json();
  } catch (error) {
    console.error('Error approving payment slip:', error);
    throw error;
  }
};

// Reject a payment slip
export const rejectPaymentSlip = async (slipId: string, reason: string): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/owner/payment-slips/${slipId}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('bb_access_token')}`,
      },
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) throw new Error('Failed to reject payment slip');
    return response.json();
  } catch (error) {
    console.error('Error rejecting payment slip:', error);
    throw error;
  }
};

// Download payment slip (gets the file URL)
export const downloadPaymentSlip = async (slipId: string): Promise<string> => {
  try {
    const response = await fetch(`${BASE_URL}/owner/payment-slips/${slipId}/download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('bb_access_token')}`,
      },
    });

    if (!response.ok) throw new Error('Failed to download payment slip');
    
    // Get blob and create download link
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    return url;
  } catch (error) {
    console.error('Error downloading payment slip:', error);
    throw error;
  }
};
