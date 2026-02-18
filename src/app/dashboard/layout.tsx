"use client";
import React from 'react';
import DashboardLauncher from '@/components/DashboardLauncher';
import './dashboard-styles.css';
import { TradingProvider } from '@/context/TradingContext';
import { UserProvider } from '@/context/UserContext';
import { DashboardGuard } from '@/components/DashboardGuard';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <UserProvider>
            <DashboardGuard>
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
            </DashboardGuard>
        </UserProvider>
    );
}
