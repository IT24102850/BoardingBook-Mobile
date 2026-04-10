import { api } from './api';
import { RoommateProfile } from '../types';

export const fetchRoommateProfiles = async (): Promise<RoommateProfile[]> => {
    try {
        const response = await api.get('/roommates');
        return response.data;
    } catch (error) {
        throw new Error('Error fetching roommate profiles');
    }
};

export const sendRoommateRequest = async (requestData: { roommateId: string; userId: string }): Promise<void> => {
    try {
        await api.post('/roommate-requests', requestData);
    } catch (error) {
        throw new Error('Error sending roommate request');
    }
};