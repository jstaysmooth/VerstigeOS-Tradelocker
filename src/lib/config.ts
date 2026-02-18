export const getApiUrl = () => {
    // Check if we are in a browser environment
    if (typeof window !== 'undefined') {
        // If we're on localhost, always favor the local backend
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:8000';
        }
    }

    // Fallback to environment variable or production default
    return process.env.NEXT_PUBLIC_API_URL || 'https://verstige.io';
};

export const API_URL = getApiUrl();
export const API_BASE = `${API_URL}/api`;
