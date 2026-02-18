export const getApiUrl = () => {
    // Check if we are in a browser environment
    if (typeof window !== 'undefined') {
        // If we're on localhost, always favor the local backend
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:8000';
        }

        // If we are on HTTPS, ensure API is HTTPS
        if (window.location.protocol === 'https:') {
            return 'https://verstige.io';
        }
    }

    // Fallback to environment variable or production default
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    if (envUrl && envUrl.includes('verstige.io')) {
        return envUrl.replace('http:', 'https:');
    }

    return 'https://verstige.io';
};

export const API_URL = getApiUrl();
export const API_BASE = `${API_URL}/api`;
