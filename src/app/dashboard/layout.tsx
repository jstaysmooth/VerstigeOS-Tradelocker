"use client";
import React from 'react';
import DashboardLauncher from '@/components/DashboardLauncher';
import './dashboard-styles.css';
import { TradingProvider } from '@/context/TradingContext';
import { UserProvider } from '@/context/UserContext';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <UserProvider>
            <TradingProvider>
                <div className="dashboard-container">
                    <main className="dash-main">
                        <div className="dash-content">
                            {children}
                        </div>
                    </main>
                    <DashboardLauncher />
                </div>
            </TradingProvider>
        </UserProvider>
    );
}
