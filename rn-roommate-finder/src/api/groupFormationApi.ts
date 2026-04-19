// API functions for Group Formation
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Change to your backend URL

export const fetchGroups = async () => {
  const response = await axios.get(`${API_BASE_URL}/groups`);
  return response.data;
};

export const createGroup = async (groupData: any) => {
  const response = await axios.post(`${API_BASE_URL}/groups`, groupData);
  return response.data;
};
