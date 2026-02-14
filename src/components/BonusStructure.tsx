"use client";
import React from 'react';
import { Shield, Star, Award, TrendingUp } from 'lucide-react';
import { EXECUTIVE_BONUS_TIERS } from '@/lib/compensation';
import { motion } from 'framer-motion';

const BonusStructure = () => {
    return (
        <div className="bonus-structure-container glass-panel animate-fade-in" style={{ marginTop: 'var(--spacing-xl)', padding: 'var(--spacing-lg)' }}>
            <div className="flex-between" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div>
                    <h3 className="text-title" style={{ fontSize: '1.75rem' }}>Executive Bonus Levels</h3>
                    <p className="text-subtitle">Unlock monthly performance bonuses by scaling your personal premium or organization structure.</p>
                </div>
                <Award size={32} className="icon-yellow" />
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table className="payout-table" style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left' }}>Bonus Level</th>
                            <th style={{ textAlign: 'left' }}>Personal Premium Requirement</th>
                            <th style={{ textAlign: 'left' }}>Organizational Alternative</th>
                        </tr>
                    </thead>
                    <tbody>
                        {EXECUTIVE_BONUS_TIERS.map((tier, i) => (
                            <motion.tr
                                key={tier.level}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <td style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Star size={14} className={i > 3 ? "icon-yellow" : "icon-secondary"} />
                                    <span style={{ fontWeight: 700, color: i > 3 ? '#fff' : 'var(--secondary)' }}>{tier.level}</span>
                                </td>
                                <td>
                                    <span className="text-green" style={{ fontWeight: 600 }}>${tier.personalPremium.toLocaleString()}</span>
                                </td>
                                <td style={{ color: 'var(--accent)' }}>{tier.structure}</td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: 'var(--spacing-md)', fontSize: '0.875rem', color: 'var(--secondary)', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
                <p><strong>Note:</strong> To qualify for Silver ED and above via the organizational route, you must maintain the rank of Executive Director yourself.</p>
            </div>
        </div>
    );
};

export default BonusStructure;
