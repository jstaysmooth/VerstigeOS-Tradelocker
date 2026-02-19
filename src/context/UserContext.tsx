"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

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
    isAdmin: boolean;
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

// Comma-separated list of admin emails from env (e.g. "admin@example.com,boss@corp.com")
const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);

const computeIsAdmin = (user: User | null): boolean => {
    if (!user) return false;
    if (user.user_metadata?.is_admin === true) return true;
    if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) return true;
    return false;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    const refreshProfile = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const currentUser = session?.user || null;
            setUser(currentUser);
            setIsAdmin(computeIsAdmin(currentUser));

            if (session?.user) {
                const meta = session.user.user_metadata || {};

                // Try many possible name fields — different signup flows use different keys
                let firstName = meta.first_name || meta.firstName || "";
                let lastName = meta.last_name || meta.lastName || "";

                // Try full_name / name as a combined fallback
                if (!firstName) {
                    const full = meta.full_name || meta.name || "";
                    if (full.includes(" ")) {
                        const parts = full.trim().split(" ");
                        firstName = parts[0];
                        lastName = parts.slice(1).join(" ");
                    } else if (full) {
                        firstName = full;
                    }
                }

                // Last resort: persist name to/from localStorage across page loads
                if (firstName) {
                    localStorage.setItem('cached_first_name', firstName);
                    localStorage.setItem('cached_last_name', lastName);
                } else {
                    // Read from cache set on a previous session
                    firstName = localStorage.getItem('cached_first_name') || "";
                    lastName = localStorage.getItem('cached_last_name') || "";
                }

                setProfile({
                    firstName: firstName || "Trader",
                    lastName: lastName,
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
            const currentUser = session?.user || null;
            setUser(currentUser);
            setIsAdmin(computeIsAdmin(currentUser));
            if (session?.user) {
                const meta = session.user.user_metadata || {};

                let firstName = meta.first_name || meta.firstName || "";
                let lastName = meta.last_name || meta.lastName || "";

                if (!firstName) {
                    const full = meta.full_name || meta.name || "";
                    if (full.includes(" ")) {
                        const parts = full.trim().split(" ");
                        firstName = parts[0];
                        lastName = parts.slice(1).join(" ");
                    } else if (full) {
                        firstName = full;
                    }
                }

                if (firstName) {
                    localStorage.setItem('cached_first_name', firstName);
                    localStorage.setItem('cached_last_name', lastName);
                } else {
                    firstName = localStorage.getItem('cached_first_name') || "";
                    lastName = localStorage.getItem('cached_last_name') || "";
                }

                setProfile({
                    firstName: firstName || "Trader",
                    lastName: lastName,
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
        <UserContext.Provider value={{ user, profile, loading, isAdmin, refreshProfile, signOut }}>
            {children}
        </UserContext.Provider>
    );
};
