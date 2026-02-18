"use client";
import React from 'react';
import DashboardLauncher from '@/components/DashboardLauncher';
import './dashboard-styles.css';

import { TradingProvider } from '@/context/TradingContext';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
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
    );
}
