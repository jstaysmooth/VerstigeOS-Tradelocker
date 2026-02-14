"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    User, Target, TrendingUp, Users, Award,
    ArrowUpRight, Building, CheckCircle, Clock, Lock, DollarSign, Globe, Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import CareerPath from '@/components/CareerPath';
import { GenealogySection } from '@/components/Genealogy';
import SalesPipeline from '@/components/sales/SalesPipeline';
import VerstigeTradeCard from '@/components/VerstigeTradeCard';
import { useMetaStats } from '@/hooks/useMetaStats';
import '@/styles/pages/Profile.css';


const ProfilePage = () => {
    const router = useRouter();
    const [closedDeals, setClosedDeals] = useState(0);
    const [totalCommissions, setTotalCommissions] = useState(0);
    const { stats } = useMetaStats('demo-account-id');

    const handleSwipeConfirm = async () => {
        try {
            // Call the backend API (ensure backend is running on port 8000)
            const response = await fetch('http://localhost:8000/execute-swipe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    account_id: 'demo-account-id',
                    pair: 'XAUUSD',
                    action: 'BUY',
                    volume: 0.1,
                    sl: 2020.0,
                    tp: 2050.0
                })
            });
            const data = await response.json();
            console.log("Trade Executed:", data);
        } catch (error) {
            console.error("Trade Failed:", error);
        }
    };

    // Calculate commissions from closed deals
    useEffect(() => {
        const calculateStats = () => {
            const leads = localStorage.getItem('sales_leads');
            if (leads) {
                const parsedLeads = JSON.parse(leads);
                const closedWon = parsedLeads.filter((l: any) => l.stage === 'closed-won');
                setClosedDeals(closedWon.length);

                // Calculate total commissions (assuming 50% commission rate for simplicity)
                const totalValue = closedWon.reduce((acc: number, curr: any) => acc + (curr.value || 0), 0);
                setTotalCommissions(totalValue * 0.5); // 50% commission
            }
        };

        calculateStats();

        // Listen for deal closed events to update stats in real-time
        window.addEventListener('dealClosed', calculateStats);

        return () => {
            window.removeEventListener('dealClosed', calculateStats);
        };
    }, []);

    // Mock Data
    const user = {
        name: "Slade Wilson",
        rank: "Executive Director",
        joinDate: "Jan 2024",
        totalSales: 842000
    };

    const goals = [
        { title: "Monthly Sales Target", current: 42000, target: 50000, color: "var(--accent)" },
        { title: "New Associates", current: 8, target: 12, color: "var(--fintech-green)" },
        { title: "Team Volume", current: 150000, target: 200000, color: "#a259ff" }
    ];

    const associates = [
        { name: "Sarah Connor", role: "Senior Associate", status: "Active", volume: "$12,400" },
        { name: "John Wick", role: "Associate", status: "Active", volume: "$9,200" },
        { name: "Ellen Ripley", role: "Manager", status: "On Leave", volume: "$15,800" },
        { name: "Tony Stark", role: "Director", status: "Active", volume: "$45,000" },
    ];

    return (
        <div className="profile-container">
            {/* Header */}
            <motion.div
                className="profile-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="user-info">
                    <h1>{user.name}</h1>
                    <div className="user-rank">
                        <Award size={16} />
                        <span className="rank-badge">{user.rank}</span>
                        <span style={{ color: 'var(--secondary)', marginLeft: '12px' }}>Since {user.joinDate}</span>
                    </div>
                </div>
                {/* Global Stats */}
                <div className="metric-row" style={{ gap: '40px' }}>
                    <div className="metric-item">
                        <span className="metric-label">TOTAL VOLUME</span>
                        <span className="metric-value" style={{ color: 'var(--fintech-green)' }}>${user.totalSales.toLocaleString()}</span>
                    </div>
                    <div className="metric-item">
                        <span className="metric-label">CLOSED DEALS</span>
                        <span className="metric-value" style={{ color: 'var(--accent)' }}>{closedDeals}</span>
                    </div>
                    <div className="metric-item">
                        <span className="metric-label">COMMISSION EARNED</span>
                        <span className="metric-value" style={{ color: 'var(--fintech-green)' }}>${totalCommissions.toFixed(2)}</span>
                    </div>
                </div>
            </motion.div>

            <div className="profile-grid">

                {/* Goals Section */}
                <motion.div
                    className="glass-panel profile-card grid-col-8"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="card-title">
                        Performance Goals <Target size={18} />
                    </div>
                    {goals.map((goal, i) => (
                        <div key={i} className="goal-progress">
                            <div className="progress-header">
                                <span>{goal.title}</span>
                                <span>{Math.round((goal.current / goal.target) * 100)}% ({goal.current.toLocaleString()} / {goal.target.toLocaleString()})</span>
                            </div>
                            <div className="progress-track">
                                <motion.div
                                    className="progress-fill"
                                    style={{ backgroundColor: goal.color }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Commissions Summary */}
                <motion.div
                    className="glass-panel profile-card grid-col-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="card-title">
                        Current Commissions <TrendingUp size={18} />
                    </div>
                    <div className="metric-large">
                        $12,450<span style={{ fontSize: '1rem', color: 'var(--secondary)' }}>.00</span>
                    </div>
                    <span className="associate-status" style={{ alignSelf: 'flex-start', marginBottom: 'auto' }}>
                        +18% vs Last Month
                    </span>
                    <div className="metric-row">
                        <div className="metric-item">
                            <span className="metric-label">PENDING</span>
                            <span className="metric-value">$4,200</span>
                        </div>
                        <div className="metric-item">
                            <span className="metric-label">PAID</span>
                            <span className="metric-value">$8,250</span>
                        </div>
                    </div>
                </motion.div>

                {/* Onboarding Progress Dashboard */}
                <motion.div
                    className="glass-panel profile-card grid-col-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    style={{ marginBottom: 'var(--spacing-lg)' }}
                >
                    <div className="card-title justify-between">
                        <span>Foundation Deployment Status</span>
                        <span className="text-secondary text-xs">25% Overall Progress</span>
                    </div>
                    <div className="onboarding-summary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '10px' }}>
                        {[
                            { label: 'Formation', status: 'In Progress', progress: 40, icon: <Building size={16} /> },
                            { label: 'Financial', status: 'Pending', progress: 0, icon: <DollarSign size={16} /> },
                            { label: 'Digital', status: 'Pending', progress: 0, icon: <Globe size={16} /> },
                            { label: 'Protocols', status: 'Locked', progress: 0, icon: <Lock size={16} /> }
                        ].map((item, i) => (
                            <div key={i} className="progress-mini-card p-4 glass-panel" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                <div className="flex-between mb-2">
                                    <div className="flex items-center gap-2">
                                        {item.icon}
                                        <span className="font-bold text-sm">{item.label}</span>
                                    </div>
                                    <span className="text-[10px] text-secondary">{item.progress}%</span>
                                </div>
                                <div className="progress-track" style={{ height: '4px' }}>
                                    <div className="progress-fill" style={{ width: `${item.progress}%`, height: '100%', backgroundColor: item.progress > 0 ? 'var(--accent)' : 'var(--glass-border)' }} />
                                </div>
                                <p className="text-[10px] mt-2 text-secondary">{item.status}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Trading Engine Integrated Section */}
                <motion.div
                    className="glass-panel profile-card grid-col-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28 }}
                >
                    <div className="card-title justify-between">
                        <div className="flex items-center gap-2">
                            Trading Engine <Zap size={18} className="text-accent" />
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${stats.isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {stats.isConnected ? 'SYSTEM ACTIVE' : 'DISCONNECTED'}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4 mb-2">
                            <div className="glass-panel p-3 bg-white/5">
                                <div className="text-secondary text-xs mb-1">Live Balance</div>
                                <div className="font-mono text-lg">${stats.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                            </div>
                            <div className="glass-panel p-3 bg-white/5">
                                <div className="text-secondary text-xs mb-1">Equity</div>
                                <div className="font-mono text-lg text-accent">${stats.equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                            </div>
                        </div>

                        <VerstigeTradeCard
                            symbol="XAUUSD"
                            action="BUY"
                            lots={0.5}
                            onSwipeConfirm={handleSwipeConfirm}
                        />
                    </div>
                </motion.div>

                {/* Organization / Associates */}
                <motion.div
                    className="glass-panel profile-card grid-col-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="card-title">
                        Organization Structure <Users size={18} />
                    </div>
                    <div className="associate-list">
                        {associates.map((assoc, i) => (
                            <div key={i} className="associate-item">
                                <div className="associate-info">
                                    <div className="associate-avatar">
                                        {assoc.name.charAt(0)}
                                    </div>
                                    <div>
                                        <span className="associate-name">{assoc.name}</span>
                                        <span className="associate-role">{assoc.role}</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: '600' }}>{assoc.volume}</div>
                                    <div className="associate-status">{assoc.status}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Pipeline */}
                {/* Sales Pipeline - Full Component */}
                <motion.div
                    className="glass-panel profile-card grid-col-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <SalesPipeline />
                </motion.div>

                {/* Career Path Section */}
                <motion.div
                    className="glass-panel profile-card grid-col-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <CareerPath />
                </motion.div>

                {/* Genealogy Section */}
                <motion.div
                    className="grid-col-12"
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
