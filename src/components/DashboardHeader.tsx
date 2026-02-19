import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
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
    badgeText,
    showStatus = true
}) => {
    const { profile, loading } = useUser();
    const [time, setTime] = useState<string>("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setTime(new Date().toLocaleTimeString());
        const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    const userFullName = profile ? `${profile.firstName} ${profile.lastName}` : "Trader";
    const initials = profile ? `${profile.firstName[0]}${profile.lastName[0] || ""}` : "TR";

    // Split title to apply gradient to the last word if it's more than one word
    const titleParts = title.split(' ');
    const lastWord = titleParts.length > 1 ? titleParts.pop() : '';
    const firstPart = titleParts.join(' ');

    return (
        <header className="command-header animate-fade-in">
            <div className="header-bg-glow" />
            <div className="header-content-centered">
                <div className="user-badge glass-panel">
                    <div className="avatar">
                        {profile?.avatarUrl ? (
                            <img src={profile.avatarUrl} alt="Avatar" className="avatar-img-header" />
                        ) : (
                            initials
                        )}
                    </div>
                    <span>
                        {loading ? "Aligning systems..." : (
                            badgeText || <>Welcome back, <strong>{userFullName}</strong></>
                        )}
                    </span>
                </div>
                <h1 className="hero-display centered-title">
                    {firstPart} {lastWord && <span className="gradient-text-blue">{lastWord}</span>}
                </h1>
                <div className="system-status-indicator">
                    {showStatus && <span className="status-dot green" />}
                    <span className="text-subtitle">{showStatus && mounted ? `System Time: ${time} | ` : ''}{subtitle}</span>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
