"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient, User } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    divisions?: string[];
    joinDate: string;
}

interface UserContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    refreshProfile: () => Promise<void>;
    signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshProfile = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);

            if (session?.user) {
                // Extract metadata
                const meta = session.user.user_metadata || {};

                setProfile({
                    firstName: meta.first_name || "Trader",
                    lastName: meta.last_name || "",
                    email: session.user.email || "",
                    phone: meta.phone,
                    divisions: meta.selected_divisions || [],
                    joinDate: new Date(session.user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                });

                // Store user ID for other services
                localStorage.setItem('v2_user_id', session.user.id);
                if (session.user.email) localStorage.setItem('v2_user_email', session.user.email);
            } else {
                setProfile(null);
                localStorage.removeItem('v2_user_id');
                localStorage.removeItem('v2_user_email');
            }
        } catch (error) {
            console.error("Error loading user profile:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshProfile();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
            if (session?.user) {
                const meta = session.user.user_metadata || {};
                setProfile({
                    firstName: meta.first_name || "Trader",
                    lastName: meta.last_name || "",
                    email: session.user.email || "",
                    phone: meta.phone,
                    divisions: meta.selected_divisions || [],
                    joinDate: new Date(session.user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                });
                localStorage.setItem('v2_user_id', session.user.id);
                if (session.user.email) localStorage.setItem('v2_user_email', session.user.email);
            } else {
                setProfile(null);
                localStorage.removeItem('v2_user_id');
                localStorage.removeItem('v2_user_email');
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        localStorage.clear();
    };

    return (
        <UserContext.Provider value={{ user, profile, loading, refreshProfile, signOut }}>
            {children}
        </UserContext.Provider>
    );
};
