"use client";

import { useUser } from '@/context/UserContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * DashboardGuard provides client-side protection for dashboard routes.
 * It checks if the user is authenticated and redirects to signup if not.
 */
export const DashboardGuard = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useUser();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // If loading is finished and there's no user, redirect
        if (!loading && !user) {
            console.log("Unauthorized access attempt to:", pathname, "Redirecting to login.");
            router.push('/login');
        }
    }, [user, loading, router, pathname]);

    // While checking auth, show a clean loading state consistent with the OS aesthetic
    if (loading) {
        return (
            <div className="min-h-screen bg-[#050507] flex flex-col items-center justify-center">
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
                <p className="mt-8 text-secondary font-mono text-sm tracking-[0.2em] animate-pulse">
                    VERIFYING IDENTITY
                </p>
            </div>
        );
    }

    // Only render children if user is present
    return user ? <>{children}</> : null;
};
