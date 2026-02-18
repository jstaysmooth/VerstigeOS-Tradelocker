"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    User, Target, TrendingUp, Users, Award,
    ArrowUpRight, Building, CheckCircle, Clock, Lock, DollarSign, Globe, Zap,
    Wallet, Shield, Activity, BarChart3, ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import CareerPath from '@/components/CareerPath';
import { GenealogySection } from '@/components/Genealogy';
import SalesPipeline from '@/components/sales/SalesPipeline';
import { useMetaStats } from '@/hooks/useMetaStats';
import '@/styles/pages/Profile.css';

import { useUser } from '@/context/UserContext';
import './DashboardHeader.css';

const ProfilePage = () => {
    const router = useRouter();
    const { user, profile, loading: userLoading } = useUser();
    const [closedDeals, setClosedDeals] = useState(0);
    const [totalCommissions, setTotalCommissions] = useState(0);
    const [pendingCommissions, setPendingCommissions] = useState(0);
    const { stats } = useMetaStats('demo-account-id');

    // Calculate commissions from sales leads
    useEffect(() => {
        const calculateStats = () => {
            const savedLeads = localStorage.getItem('sales_leads');
            if (savedLeads) {
                const leads = JSON.parse(savedLeads);

                // Closed Won deals
                const closedWon = leads.filter((l: any) => l.stage === 'closed-won');
                setClosedDeals(closedWon.length);

                // Paid commissions (from closed deals) - using 50% mock rate
                const paid = closedWon.reduce((acc: number, curr: any) => acc + (curr.value || 0) * 0.5, 0);
                setTotalCommissions(paid);

                // Pending commissions (from pipeline)
                const pending = leads.filter((l: any) => !['closed-won', 'closed-lost'].includes(l.stage))
                    .reduce((acc: number, curr: any) => acc + (curr.value || 0) * 0.5, 0);
                setPendingCommissions(pending);
            }
        };

        calculateStats();
        window.addEventListener('dealClosed', calculateStats);
        return () => window.removeEventListener('dealClosed', calculateStats);
    }, []);

    const userDisplayName = profile ? `${profile.firstName} ${profile.lastName}` : "Verstige User";
    const displayId = user ? `VS-${user.id.substring(0, 4).toUpperCase()}-ID` : "VS-AUTH-ID";
    const joinDate = profile?.joinDate || "Jan 2024";

    return (
        <div className="profile-container animate-fade-in">
            {/* Premium Identity Hero */}
            <div className="profile-hero">
                <div className="hero-overlay-top">
                    <div className="identity-badge">Institutional Access</div>
                    <div className="identity-badge" style={{ color: 'var(--accent)' }}>Active Protocol</div>
                </div>

                <div className="profile-hero-content">
                    <div className="user-identity-block">
                        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary mb-2 opacity-60">Identity Verified · {displayId}</div>
                        <h1>{userLoading ? "Loading Identity..." : userDisplayName}</h1>
                        <div className="user-rank-strip">
                            <span className="rank-text">{profile?.divisions?.includes('sales') ? 'Executive Director' : 'Active Trader'}</span>
                            <span className="h-1 w-1 rounded-full bg-white/20"></span>
                            <span className="member-since">Member Since {joinDate}</span>
                        </div>
                    </div>

                    <div className="hero-stats-mesh">
                        <div className="hero-stat-item">
                            <span className="hero-stat-label">Network Volume</span>
                            <span className="hero-stat-value">$842,000</span>
                        </div>
                        <div className="hero-stat-item">
                            <span className="hero-stat-label">Direct Assets</span>
                            <span className="hero-stat-value" style={{ color: 'var(--accent)' }}>{closedDeals}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Integrated Account Grid */}
            <div className="account-grid">
                {/* Trading Account View */}
                <div className="acc-card">
                    <div className="acc-header">
                        <h3><Activity size={18} /> Trading Reserve</h3>
                        <div className={`acc-status-tag ${stats.isConnected ? 'status-online' : 'bg-red-500/10 text-red-500'}`}>
                            {stats.isConnected ? 'LIVE FEED ACTIVE' : 'DATABASE OFFLINE'}
                        </div>
                    </div>

                    <div className="stat-main">
                        <span className="val">${stats.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        <span className="sub">USD</span>
                    </div>

                    <div className="stat-row">
                        <div className="row-item">
                            <span className="row-label">Equity</span>
                            <span className="row-val text-accent">${stats.equity.toLocaleString()}</span>
                        </div>
                        <div className="row-item">
                            <span className="row-label">Margin Avail.</span>
                            <span className="row-val">${(stats.balance * 0.8).toLocaleString()}</span>
                        </div>
                        <div className="row-item">
                            <span className="row-label">Positions</span>
                            <span className="row-val">04 Active</span>
                        </div>
                    </div>
                </div>

                {/* Commission Account View */}
                <div className="acc-card">
                    <div className="acc-header">
                        <h3><DollarSign size={18} /> Commission Estate</h3>
                        <div className="acc-status-tag status-online">PAYOUTS ENABLED</div>
                    </div>

                    <div className="stat-main">
                        <span className="val">${totalCommissions.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        <span className="sub">PAID</span>
                    </div>

                    <div className="stat-row">
                        <div className="row-item">
                            <span className="row-label">Pending</span>
                            <span className="row-val text-green-400">${pendingCommissions.toLocaleString()}</span>
                        </div>
                        <div className="row-item">
                            <span className="row-label">Next Release</span>
                            <span className="row-val">Feb 15</span>
                        </div>
                        <div className="row-item">
                            <span className="row-label">Sales Rate</span>
                            <span className="row-val">50.0%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Foundation Progress (Integrated) */}
            <div className="deployment-dash">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black uppercase tracking-widest text-secondary flex items-center gap-3">
                        Foundation Status <Shield size={20} className="text-secondary opacity-30" />
                    </h3>
                    <span className="text-[10px] font-bold text-accent px-3 py-1 bg-accent/10 rounded-full">25% OPTIMIZED</span>
                </div>
                <div className="onboarding-summary-grid">
                    {[
                        { label: 'Formation', status: 'In Progress', progress: 40, icon: <Building size={16} /> },
                        { label: 'Financial', status: 'Pending', progress: 0, icon: <DollarSign size={16} /> },
                        { label: 'Digital', status: 'Pending', progress: 0, icon: <Globe size={16} /> },
                        { label: 'Protocols', status: 'Locked', progress: 0, icon: <Lock size={16} /> }
                    ].map((item, i) => (
                        <div key={i} className="progress-mini-card">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 bg-white/5 rounded-lg text-secondary">
                                    {item.icon}
                                </div>
                                <span className="text-xs font-black text-white">{item.progress}%</span>
                            </div>
                            <h4 className="text-sm font-bold mb-1">{item.label}</h4>
                            <p className="text-[10px] text-secondary mb-4 uppercase tracking-widest font-black opacity-60">{item.status}</p>
                            <div className="progress-track" style={{ height: '2px' }}>
                                <div className="progress-fill" style={{ width: `${item.progress}%`, height: '100%', backgroundColor: item.progress > 0 ? 'var(--accent)' : 'var(--glass-border)' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Operations Grid */}
            <div className="ops-grid">
                {/* Career Progression (Integrated with Goals) */}
                <div className="ops-span-12 mb-10">
                    <CareerPath />
                </div>

                {/* Sales Pipeline - Full Flow */}
                <div className="ops-span-12 mb-10">
                    <SalesPipeline />
                </div>

                {/* Genealogy Section (Restored Experience) */}
                <motion.div
                    className="ops-span-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <GenealogySection />
                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;
