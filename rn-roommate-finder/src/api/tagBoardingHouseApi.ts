// API functions for Tag Boarding House
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Change to your backend URL

export const fetchBoardingHouses = async () => {
  const response = await axios.get(`${API_BASE_URL}/boarding-houses`);
  return response.data;
};
