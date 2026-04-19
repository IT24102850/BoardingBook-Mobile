// API functions for Roommate Discovery
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Change to your backend URL

export const fetchRoommates = async () => {
  const response = await axios.get(`${API_BASE_URL}/roommates`);
  return response.data;
};
