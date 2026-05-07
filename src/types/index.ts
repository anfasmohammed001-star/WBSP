export type UserType = 'customer' | 'worker' | 'supervisor';

export interface User {
    id: string;
    email: string;
    fullName: string;
    userType: UserType;
    avatarUrl?: string;
    gender?: string;
    dateOfBirth?: string;
    mobile?: string;
    // Worker specific fields
    skills?: string[];
    average_rating?: number;
    bio?: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface Job {
    id: string;
    title: string;
    description: string;
    budget: number;
    status: string;
    created_at: string;
    customer?: {
        full_name: string;
    };
}

export interface Message {
    id: string;
    content: string;
    sender_id: string;
    created_at: string;
}
