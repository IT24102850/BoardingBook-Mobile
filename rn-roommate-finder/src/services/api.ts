import axios from 'axios';

const API_BASE_URL = 'https://api.example.com'; // Replace with your actual API base URL

export const fetchRoommateProfiles = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/roommates`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching roommate profiles: ' + error.message);
    }
};

export const createRoommateProfile = async (profileData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/roommates`, profileData);
        return response.data;
    } catch (error) {
        throw new Error('Error creating roommate profile: ' + error.message);
    }
};

export const sendRoommateRequest = async (requestData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/roommate-requests`, requestData);
        return response.data;
    } catch (error) {
        throw new Error('Error sending roommate request: ' + error.message);
    }
};

export const fetchGroups = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/groups`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching groups: ' + error.message);
    }
};

export const createGroup = async (groupData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/groups`, groupData);
        return response.data;
    } catch (error) {
        throw new Error('Error creating group: ' + error.message);
    }
};