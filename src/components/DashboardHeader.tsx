import React, { useState, useEffect } from 'react';
import './DashboardHeader.css';

interface DashboardHeaderProps {
    title: string;
    subtitle: string;
    badgeText?: string;
    showStatus?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    title,
    subtitle,
    badgeText = "Welcome back, Slade Johnson",
    showStatus = true
}) => {
    const [time, setTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Split title to apply gradient to the last word if it's more than one word
    const titleParts = title.split(' ');
    const lastWord = titleParts.length > 1 ? titleParts.pop() : '';
    const firstPart = titleParts.join(' ');

    return (
        <header className="command-header animate-fade-in">
            <div className="header-bg-glow" />
            <div className="header-content-centered">
                <div className="user-badge glass-panel">
                    <div className="avatar">SJ</div>
                    <span>{badgeText === "Welcome back, Slade Johnson" ? (
                        <>Welcome back, <strong>Slade Johnson</strong></>
                    ) : badgeText}</span>
                </div>
                <h1 className="hero-display centered-title">
                    {firstPart} {lastWord && <span className="gradient-text-blue">{lastWord}</span>}
                </h1>
                <div className="system-status-indicator">
                    {showStatus && <span className="status-dot green" />}
                    <span className="text-subtitle">{showStatus ? `System Time: ${time} | ` : ''}{subtitle}</span>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
