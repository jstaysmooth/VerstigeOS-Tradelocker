"use client";

import React from 'react';
import { useUser } from '@/context/UserContext';
import DivisionAccessDenied from './DivisionAccessDenied';

interface DivisionGuardProps {
    division: 'trading' | 'business' | 'sales';
    children: React.ReactNode;
}

/**
 * Wraps a division page. If the current user doesn't have access to the
 * requested division (not in their selected_divisions metadata), shows the
 * access-denied lock screen instead.
 *
 * Admin users always bypass the guard.
 */
export const DivisionGuard: React.FC<DivisionGuardProps> = ({ division, children }) => {
    const { profile, loading, isAdmin } = useUser();

    // While auth is loading, render nothing (DashboardGuard already shows a spinner)
    if (loading) return null;

    // Admins always have full access
    if (isAdmin) return <>{children}</>;

    // Check if the user's divisions include this one
    const divisions = profile?.divisions ?? [];
    const hasAccess = divisions.some((d) => d.toLowerCase() === division.toLowerCase());

    if (!hasAccess) {
        return <DivisionAccessDenied division={division} />;
    }

    return <>{children}</>;
};

export default DivisionGuard;
