export interface RoommateProfile {
    id: string;
    name: string;
    age: number;
    interests: string[];
    preferences: string[];
}

export interface Group {
    id: string;
    name: string;
    memberCount: number;
}

export interface Notification {
    id: string;
    type: 'roommateRequest' | 'groupInvitation';
    message: string;
    timestamp: Date;
}

export interface User {
    id: string;
    name: string;
    age: number;
    profilePictureUrl?: string;
}