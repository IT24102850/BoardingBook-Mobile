// API functions for Roommate Profile
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Change to your backend URL

export const fetchProfile = async (userId: string) => {
  const response = await axios.get(`${API_BASE_URL}/roommates/${userId}`);
  return response.data;
};
