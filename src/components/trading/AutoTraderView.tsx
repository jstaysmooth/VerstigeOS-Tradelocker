"use client";
import React from 'react';
import {
    Zap,
    Cpu,
    Globe,
    Wallet,
    Users,
    Lock,
    Shield,
    Activity,
    Layout,
    Target,
    History,
    Settings
} from 'lucide-react';
import './AutoTraderView.css';

interface AutoTraderViewProps {
    autoTraderRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    setAutoTraderRisk: (risk: 'LOW' | 'MEDIUM' | 'HIGH') => void;
    accountSize: string;
    setAccountSize: (size: string) => void;
    broker: string;
    setBroker: (broker: string) => void;
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (pw: string) => void;
    isAutoTraderRunning: boolean;
    setIsAutoTraderRunning: (running: boolean) => void;
}

const AutoTraderView: React.FC<AutoTraderViewProps> = ({
    autoTraderRisk,
    setAutoTraderRisk,
    accountSize,
    setAccountSize,
    broker,
    setBroker,
    email,
    setEmail,
    password,
    setPassword,
    isAutoTraderRunning,
    setIsAutoTraderRunning
}) => {
    return (
        <div className="at-view animate-fade-in">
            {/* Immersive Command Hero */}
            <div className="at-hero">
                <div className="at-hero-content">
                    <div className="at-hero-badge">Institutional Protocol v4.0</div>
                    <h1 className="at-hero-title">
                        Auto Trader <span className="at-accent">Engine</span>
                    </h1>
                    <p className="at-hero-desc">
                        A multi-asset execution framework designed for high-net-worth deployment.
                        Synchronize your capital with professional signals in real-time with surgical precision.
                    </p>

                    <div className="at-yield-strip">
                        <div className="at-yield-item">
                            <span className="at-yield-label">Monthly Target</span>
                            <span className="at-yield-value">8-12%</span>
                        </div>
                        <div className="at-yield-item">
                            <span className="at-yield-label">Drawdown Threshold</span>
                            <span className="at-yield-value text-red-500">3.5%</span>
                        </div>
                        <div className="at-yield-item">
                            <span className="at-yield-label">Execution Speed</span>
                            <span className="at-yield-value text-green-400">
                                <Zap size={14} /> Instant
                            </span>
                        </div>
                    </div>
                </div>

                <div className="at-visual-mesh">
                    <div className="at-pulse"></div>
                </div>
            </div>

            {/* Main Command Logic */}
            <div className="at-interface-grid mt-4">
                {/* Configuration Mesh */}
                <div className="at-panel">
                    <div className="at-panel-header">
                        <Settings size={20} />
                        <h3>Account Deployment</h3>
                    </div>

                    <div className="at-input-sections">
                        {/* Risk Tier Selection */}
                        <div className="at-config-section">
                            <label className="at-section-label">Risk Management Protocol</label>
                            <div className="at-risk-grid">
                                {[
                                    { id: 'LOW', val: '1.0%', label: 'Stability', desc: 'Preservation focus' },
                                    { id: 'MEDIUM', val: '1.5%', label: 'Balanced', desc: 'Optimal RR mesh' },
                                    { id: 'HIGH', val: '2.0%', label: 'Aggressive', desc: 'High-yield growth' }
                                ].map((r) => (
                                    <div
                                        key={r.id}
                                        className={`at-risk-card ${autoTraderRisk === r.id ? 'active' : ''}`}
                                        onClick={() => setAutoTraderRisk(r.id as any)}
                                    >
                                        <span className="at-risk-val">{r.val}</span>
                                        <span className="at-risk-label">{r.label}</span>
                                        <span className="at-risk-desc">{r.desc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Security Credentials */}
                        <div className="at-config-section">
                            <label className="at-section-label">Institutional Bridge Credentials</label>
                            <div className="at-credential-mesh">
                                <div className="at-field">
                                    <label>Broker Terminal</label>
                                    <div className="at-input-wrapper">
                                        <Globe size={16} />
                                        <input
                                            type="text"
                                            placeholder="e.g. Liquid Brokers"
                                            value={broker}
                                            onChange={(e) => setBroker(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="at-field">
                                    <label>Account Equity ($)</label>
                                    <div className="at-input-wrapper">
                                        <Wallet size={16} />
                                        <input
                                            type="number"
                                            placeholder="e.g. 100,000"
                                            value={accountSize}
                                            onChange={(e) => setAccountSize(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="at-field">
                                    <label>Terminal Login</label>
                                    <div className="at-input-wrapper">
                                        <Users size={16} />
                                        <input
                                            type="text"
                                            placeholder="MT5 ID / Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="at-field">
                                    <label>Secure Key</label>
                                    <div className="at-input-wrapper">
                                        <Lock size={16} />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="at-deployment-actions">
                        <button
                            className={`at-deploy-btn ${isAutoTraderRunning ? 'active' : ''}`}
                            onClick={() => setIsAutoTraderRunning(!isAutoTraderRunning)}
                        >
                            <div className="at-deploy-content">
                                {isAutoTraderRunning ? (
                                    <>
                                        <Activity size={20} className="animate-pulse" />
                                        <span>Protocol Online - Click to Terminate</span>
                                    </>
                                ) : (
                                    <>
                                        <Zap size={20} />
                                        <span>Initialize Auto Trader Mesh</span>
                                    </>
                                )}
                            </div>
                        </button>
                        <p className="text-center text-[11px] text-secondary mt-6 uppercase tracking-widest opacity-60">
                            Deployment triggers a manual verification from the Verstige Admin Mesh
                        </p>
                    </div>
                </div>

                {/* Execution Intelligence */}
                <div className="at-intel-column">
                    <div className="at-intel-card at-panel">
                        <div className="at-intel-header">
                            <div className="flex items-center gap-3">
                                <div className="at-pulse"></div>
                                <h3>Live Signal Sync</h3>
                            </div>
                            <span className="text-[10px] font-mono opacity-50">SYNC_ID: LB-492</span>
                        </div>
                        <p className="text-secondary text-sm leading-relaxed">
                            Listening for high-probability sequences across institutional liquidity pools...
                        </p>
                    </div>

                    <div className="at-intel-card at-panel">
                        <div className="at-panel-header mb-6">
                            <Shield size={18} />
                            <h3>Advanced Risk Mesh</h3>
                        </div>
                        <div className="at-checklist">
                            <div className="at-check-item">
                                <div className="at-item-icon"><Layout size={14} /></div>
                                <div className="at-item-text">
                                    <h4>Triple Position Entry</h4>
                                    <p>Diversified exit strategy: 30% at TP1, 40% at TP2, 30% at TP3.</p>
                                </div>
                            </div>
                            <div className="at-check-item">
                                <div className="at-item-icon"><Target size={14} /></div>
                                <div className="at-item-text">
                                    <h4>Break-Even Logic</h4>
                                    <p>Automatic SL migration to entry point once first target is secured.</p>
                                </div>
                            </div>
                            <div className="at-check-item">
                                <div className="at-item-icon"><History size={14} /></div>
                                <div className="at-item-text">
                                    <h4>Trailing Protection</h4>
                                    <p>SL shifts to TP1 once price action confirms TP2 liquidity grab.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="at-intel-card at-panel">
                        <div className="promo-inner">
                            <h3 className="text-accent text-sm font-bold uppercase tracking-widest mb-2">Passive Growth</h3>
                            <h3 className="text-lg font-bold mb-3">Earn While You Learn</h3>
                            <p className="text-secondary text-xs leading-relaxed">
                                While you master the Verstige Strategy, our automated engine handles the precision execution. No emotional bias, just mathematical certainty.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutoTraderView;
