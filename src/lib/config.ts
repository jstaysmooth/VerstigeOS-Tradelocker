export const getApiUrl = () => {
    // 1. Environment Variable has highest precedence
    // This allows Netlify settings to properly point to Railway backend
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    if (envUrl) {
        return envUrl;
    }

    // 2. Localhost fallback (if env var missing in dev)
    if (typeof window !== 'undefined') {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:8000';
        }
    }

    // 3. Production default fallback
    return 'https://verstige.io';
};

export const API_URL = getApiUrl();
export const API_BASE = `${API_URL}/api`;
