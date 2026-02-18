

import React from 'react';
import { useSignals } from '@/hooks/useSignals';
import { SwipeSignalCard } from './SwipeSignalCard';
import './SignalsView.css';

export default function SignalsView() {
    const { signals, loading } = useSignals();

    if (loading) {
        return (
            <div className="signals-loading-container">
                <div className="loader"></div>
                <p>Establishing Real-time Connection...</p>
            </div>
        );
    }

    return (
        <div className="signals-view animate-fade-in">
            <div className="signals-header">
                <div className="header-badge">REAL-TIME ENGINE</div>
                <h2>Live Signal Feed</h2>
                <p>Swipe right to instantly execute institutional-grade setups on our liquidity bridge.</p>
            </div>

            <div className="signals-container">
                {signals.length === 0 ? (
                    <div className="empty-signals glass-panel">
                        <div className="empty-icon">📡</div>
                        <h3>Waiting for Signals...</h3>
                        <p>As soon as a master analyst drops a setup in Telegram, it will appear here instantly.</p>
                    </div>
                ) : (
                    <div className="signals-stack">
                        {signals.map(signal => (
                            <SwipeSignalCard
                                key={signal.id}
                                signal={signal}
                                onSettled={(id, action) => console.log(`Signal ${id} settled with action: ${action}`)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="signals-footer-hint">
                <p>All trades are sized based on your current account equity and 1% risk-per-trade protocol.</p>
            </div>
        </div>
    );
}
