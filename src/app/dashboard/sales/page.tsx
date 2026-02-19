"use client";
import React, { useState } from 'react';
import { DollarSign, Shield, ArrowUpRight, Zap, HelpCircle, ChevronDown } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import BonusStructure from '@/components/BonusStructure';
import RankTracker from '@/components/RankTracker';
import '@/styles/pages/Sales.css';
import DivisionGuard from '@/components/DivisionGuard';

import { COMMISSIONS, CommissionData } from '@/lib/commissionSchedule';

const commissionSchedule = COMMISSIONS;


const products = [
    {
        name: 'Business Essentials',
        id: 'Essentials ($49)',
        price: '$49',
        period: '/mo',
        target: 'Small Teams (1-2 Users)',
        features: [
            'Unlimited System Consultation',
            '10 Executive Calls per year',
            '10 Contract Reviews per year',
            'Debt Collection Protocols',
        ],
        highlight: false,
        colorClass: 'text-blue'
    },
    {
        name: 'Business Plus',
        id: 'Plus ($99)',
        price: '$99',
        period: '/mo',
        target: 'Growing Ventures (1-3 Users)',
        features: [
            'Multi-region Infrastructure Support',
            '20 Executive Letters/Calls per year',
            '20 Advanced System Reviews per year',
            'Tax & Audit Defense (25 hrs)',
        ],
        highlight: true,
        colorClass: 'text-gradient'
    },
    {
        name: 'Business Pro',
        id: 'Pro ($169)',
        price: '$169',
        period: '/mo',
        target: 'Elite Enterprises (1-5 Users)',
        features: [
            'Institutional System Access',
            '40 Executive Operations per year',
            '40 Deep System Reviews per year',
            'Tax & Audit Defense (50 hrs)',
        ],
        highlight: false,
        colorClass: 'text-purple'
    }
];

export default function SalesPage() {
    const [selectedRank, setSelectedRank] = useState('Senior Associate');
    const [showPayoutTable, setShowPayoutTable] = useState(false);

    const ranks = [
        'Associate', 'Senior Associate', 'Manager', 'Senior Manager', 'Director', 'Senior Director', 'Executive Director',
        'Bronze Executive Director', 'Silver Executive Director', 'Gold Executive Director', 'Platinum Executive Director', 'Diamond Executive Director'
    ];

    return (
        <DivisionGuard division="sales">
            <div className="sales-page">
                <DashboardHeader
                    title="Sales Division"
                    subtitle="Monetize the ecosystem and track your rank achievement progress."
                />

                {/* Sales Division Hero - Monetize Business Infrastructure */}
                <div className="sales-hero glass-panel animate-fade-in">
                    <div className="hero-grid">
                        <div className="hero-main-content">
                            <div className="badge-wrapper">
                                <span className="badge-new">PROFIT LOGIC</span>
                            </div>
                            <h1 className="hero-display">Monetize Business <span className="gradient-text-blue">Infrastructure</span></h1>
                            <p className="hero-description">
                                We leverage an exclusive partnership with <strong>LegalShield</strong> to provide high-level business insurance
                                and legal protection protocols. By deploying these solutions to businesses and aspiring entrepreneurs,
                                you tap into a high-performance wealth engine.
                            </p>
                            <div className="value-props">
                                <div className="v-item">
                                    <Zap size={20} className="icon-yellow" />
                                    <span><strong>Daily Payouts:</strong> Get paid work-units straight to your bank account every 24 hours.</span>
                                </div>
                                <div className="v-item">
                                    <Shield size={20} className="icon-blue" />
                                    <span><strong>Full Coverage:</strong> Protect businesses from liability while building your legacy.</span>
                                </div>
                            </div>
                        </div>
                        <div className="hero-stats-card glass-card">
                            <div className="card-inner">
                                <DollarSign size={32} className="icon-green" />
                                <h4>The Wealth Protocol</h4>
                                <p>Deploy protection, scale your network, and receive daily deposits from the platform's execution.</p>
                                <div className="mini-payout-log">
                                    <div className="log-line"><span>Deposit Received</span> <span className="text-green">+$564.94</span></div>
                                    <div className="log-line"><span>Deposit Received</span> <span className="text-green">+$482.19</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Simulation Controls - Upgraded UI */}
                <div className="simulation-controls-v2 glass-panel animate-fade-in">
                    <div className="control-header">
                        <div className="flex-between">
                            <div className="title-group">
                                <Zap size={16} className="text-accent" />
                                <label>Simulation Intelligence Mode</label>
                            </div>
                            <button
                                className={`payout-toggle ${showPayoutTable ? 'active' : ''}`}
                                onClick={() => setShowPayoutTable(!showPayoutTable)}
                            >
                                {showPayoutTable ? 'Collapse Intelligence' : 'Expand Matrix'}
                            </button>
                        </div>
                    </div>

                    <div className="sales-chips-container">
                        {ranks.map(r => (
                            <button
                                key={r}
                                className={`sales-chip ${selectedRank === r ? 'active' : ''}`}
                                onClick={() => setSelectedRank(r)}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>



                {/* Rank Achievement Simulation */}
                <RankTracker simulationRank={selectedRank} />

                <div className="section-divider">
                    <h3>Product Commission Protocols</h3>
                    <p>Select a rank above to see specific earning potential per unit.</p>
                </div>

                <div className="commission-overview glass-panel animate-fade-in">
                    <div className="meta">
                        <Zap size={24} className="icon-yellow" />
                        <div>
                            <h3>Commission Intelligence</h3>
                            <p>Calculate your potential earnings and overrides based on the current {selectedRank} level.</p>
                        </div>
                    </div>
                    <button
                        className="btn-secondary"
                        onClick={() => setShowPayoutTable(!showPayoutTable)}
                    >
                        {showPayoutTable ? 'Hide Payout Schedule' : 'View Full Schedule'}
                    </button>
                </div>

                <div className="plans-grid">
                    {products.map((product) => {
                        // Fallback to ED if exact rank data missing in future (though we just added it)
                        const comm = commissionSchedule[product.id][selectedRank] || commissionSchedule[product.id]['Executive Director'];
                        return (
                            <div key={product.id} className={`legal-card glass-panel ${product.highlight ? 'highlighted' : ''}`}>
                                <div className="plan-header">
                                    <h3>{product.name}</h3>
                                    <div className="plan-price">
                                        <span className={`amount ${product.colorClass ? product.colorClass : ''}`}>{product.price}</span>
                                        <span className="period">{product.period}</span>
                                    </div>
                                </div>

                                <div className="payout-box glass-card">
                                    <div className="payout-row">
                                        <span className="label">Direct Sale Advance</span>
                                        <span className="value text-green">${comm.advance.toFixed(2)}</span>
                                    </div>
                                    {Object.keys(comm.overrides).length > 0 && (
                                        <div className="override-teaser">
                                            <ArrowUpRight size={14} />
                                            <span>Earn up to <b>${Math.max(...Object.values(comm.overrides)).toFixed(2)}</b> in overrides</span>
                                        </div>
                                    )}
                                </div>

                                <ul className="plan-features">
                                    {product.features.map((f, i) => (
                                        <li key={i}>
                                            <Shield size={14} className="icon-blue" />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button className="btn-primary full-width">Copy Referral Link</button>
                            </div>
                        );
                    })}
                </div>

                {showPayoutTable && (
                    <div className="payout-schedule glass-panel animate-fade-in-up">
                        <div className="payout-table-wrapper">
                            <h3>Override Matrix: {selectedRank}</h3>
                            <p className="description-text mb-4">
                                Your spread income from team production relative to your rank.
                                <br /><span className="text-secondary text-sm">Calculated as: (Your Advance) - (Downline Rank Advance)</span>
                            </p>

                            <table className="payout-table">
                                <thead>
                                    <tr>
                                        <th>Downline Rank Source</th>
                                        {products.map(p => <th key={p.id}>{p.name}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Personal Production Row */}
                                    <tr className="highlight-row">
                                        <td><strong>Personal Production</strong></td>
                                        {products.map(p => {
                                            const myComm = commissionSchedule[p.id][selectedRank]?.advance || 0;
                                            return <td key={p.id} className="text-green font-bold">${myComm.toFixed(2)}</td>
                                        })}
                                    </tr>

                                    {/* Overrides on Lower Ranks */}
                                    {ranks.slice(0, ranks.indexOf(selectedRank)).reverse().map(downlineRank => (
                                        <tr key={downlineRank}>
                                            <td>Override on <strong>{downlineRank}</strong></td>
                                            {products.map(p => {
                                                const myComm = commissionSchedule[p.id][selectedRank]?.advance || 0;
                                                const theirComm = commissionSchedule[p.id][downlineRank]?.advance || 0;
                                                const spread = Math.max(0, myComm - theirComm);
                                                return (
                                                    <td key={p.id}>
                                                        {spread > 0 ? (
                                                            <span className="text-blue">+${spread.toFixed(2)}</span>
                                                        ) : (
                                                            <span className="text-secondary">-</span>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="table-footer">* Commission values are based on the Elite (Performance Club) advance schedule.</p>
                    </div>
                )}

                <div className="legal-tools-grid" style={{ marginTop: showPayoutTable ? 'var(--spacing-xl)' : '0' }}>
                    <div className="glass-panel tool-box">
                        <DollarSign size={20} className="icon-blue" />
                        <h4>Override Logic</h4>
                        <p>Earn the difference between your rank advance and your downline's rank advance.</p>
                    </div>
                    <div className="glass-panel tool-box">
                        <Zap size={20} className="icon-blue" />
                        <h4>Performance Club</h4>
                        <p>Maintain 65%+ retention to unlock Elite commission levels across all protocols.</p>
                    </div>
                    <div className="glass-panel tool-box">
                        <ArrowUpRight size={20} className="icon-blue" />
                        <h4>Advance System</h4>
                        <p>Receive up to 12 months of commission upfront on every deployed protocol.</p>
                    </div>
                </div>

                <BonusStructure />
            </div>
        </DivisionGuard>
    );
}
