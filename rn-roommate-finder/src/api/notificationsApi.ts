// API functions for Notifications
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Change to your backend URL

export const fetchNotifications = async () => {
  const response = await axios.get(`${API_BASE_URL}/notifications`);
  return response.data;
};
