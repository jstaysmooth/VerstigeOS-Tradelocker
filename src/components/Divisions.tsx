"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Briefcase, Megaphone, ArrowUpRight } from 'lucide-react';
import './Divisions.css';

const divisions = [
    {
        id: 'trading',
        title: 'Trading',
        icon: <DollarSign size={24} />,
        description: 'Advanced fintech tools, yield optimization, and institutional-grade analytics for the modern day trader.',
        color: 'var(--fintech-green)',
        features: ['Precision Terminal', 'Auto Trader Mesh', 'Risk Mesh']
    },
    {
        id: 'business',
        title: 'Business',
        icon: <Briefcase size={24} />,
        description: 'Scale your operations with automated workflows, resource management, and strategic growth protocols.',
        color: 'var(--accent)',
        features: ['Auto-Operations', 'Team Mesh', 'Scale Metrics']
    },
    {
        id: 'sales',
        title: 'Sales',
        icon: <Megaphone size={24} />,
        description: 'Monetize the platform. Tap into high-frequency referral engines, professional insurance sales, and rank achievement protocols.',
        color: '#ff3b30',
        features: ['Commission Intelligence', 'Genealogy Systems', 'Override Protocols']
    }
];

const Divisions: React.FC = () => {
    return (
        <section className="divisions-section">
            <div className="section-header">
                <h2 className="text-title">Select Your Division</h2>
                <p className="text-subtitle">Unlock specialized tools engineered for elite performance.</p>
            </div>

            <div className="divisions-grid">
                {divisions.map((div, idx) => (
                    <motion.div
                        key={div.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        viewport={{ once: true }}
                        className="division-card glass-panel"
                        whileHover={{ y: -10 }}
                    >
                        <div className="div-icon" style={{ color: div.color, backgroundColor: `${div.color}15` }}>
                            {div.icon}
                        </div>
                        <h3>{div.title}</h3>
                        <p>{div.description}</p>

                        <ul className="div-features">
                            {div.features.map(f => (
                                <li key={f}>
                                    <div className="dot" style={{ background: div.color }} />
                                    {f}
                                </li>
                            ))}
                        </ul>

                        <div className="div-actions">
                            <button className="unlock-btn">
                                Enter Division
                            </button>
                            <button className="enter-btn">
                                <ArrowUpRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Divisions;
