import { API_BASE } from '@/lib/config';

export interface ApiUser {
    id: string;
    username: string;
    rank: string;
    avatar_url: string | null;
    sales_revenue?: number;
    trading_yield?: number;
    roles?: string; // JSON string
    trend?: string;
}

export interface ApiPost {
    id: string;
    user: ApiUser;
    type: string;
    content: string | null;
    meta_data: string | null; // JSON string
    created_at: string;
    likes_count: number;
    comments_count: number;
}

export const api = {
    getFeedPosts: async (): Promise<ApiPost[]> => {
        try {
            const res = await fetch(`${API_BASE}/feed`);
            if (!res.ok) throw new Error('Failed to fetch feed');
            return await res.json();
        } catch (error) {
            console.error("API Error:", error);
            return [];
        }
    },
    getLeaderboard: async (category: string = "ALL"): Promise<ApiUser[]> => {
        try {
            const res = await fetch(`${API_BASE}/leaderboard?category=${category}`);
            if (!res.ok) throw new Error('Failed to fetch leaderboard');
            return await res.json();
        } catch (error) {
            console.error("API Error:", error);
            // Return empty list on error to prevent crash
            return [];
        }
    },
    likePost: async (postId: string, userId: string): Promise<any> => {
        const res = await fetch(`${API_BASE}/feed/${postId}/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId })
        });
        return res.json();
    },
    commentPost: async (postId: string, userId: string, content: string): Promise<any> => {
        const res = await fetch(`${API_BASE}/feed/${postId}/comment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, content })
        });
        return res.json();
    },
    createTestUser: async (username: string): Promise<string> => {
        try {
            const res = await fetch(`${API_BASE}/test/create-user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, rank: 'Associate' })
            });
            const data = await res.json();
            return data.user_id;
        } catch (e) {
            console.error("Failed to create test user", e);
            return "test_user_id"; // Fallback
        }
    }
};
