"use client";
import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import {
    Settings2,
    Zap,
    Radio,
    Shield,
    TrendingUp,
    Target,
    Lock,
    Layers,
    ChevronRight,
    Check,
    Wallet,
    Building2
} from 'lucide-react';
import './PrimeSyncUI.css';

const PrimeSyncUI = () => {
    const [selectedRisk, setSelectedRisk] = useState<'stability' | 'balanced' | 'aggressive'>('balanced');
    const [brokerTerminal, setBrokerTerminal] = useState('');
    const [accountEquity, setAccountEquity] = useState('');
    const [terminalLogin, setTerminalLogin] = useState('');
    const [secureKey, setSecureKey] = useState('');
    const [isApproved, setIsApproved] = useState(false);
    const [isApproving, setIsApproving] = useState(false);

    const constraintsRef = useRef(null);
    const x = useMotionValue(0);
    const background = useTransform(
        x,
        [0, 280],
        ['rgba(16, 185, 129, 0.1)', 'rgba(16, 185, 129, 0.3)']
    );

    const handleDragEnd = () => {
        if (x.get() > 200) {
            animate(x, 280, { type: 'spring', stiffness: 400, damping: 30 });
            setIsApproving(true);
            setTimeout(() => {
                setIsApproved(true);
                setIsApproving(false);
            }, 1500);
        } else {
            animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 });
        }
    };

    const riskOptions = [
        {
            key: 'stability',
            value: '1.0%',
            label: 'STABILITY',
            sublabel: 'PRESERVATION FOCUS',
            color: 'var(--cyan-400)'
        },
        {
            key: 'balanced',
            value: '1.5%',
            label: 'BALANCED',
            sublabel: 'OPTIMAL RI MESH',
            color: 'var(--text-secondary)'
        },
        {
            key: 'aggressive',
            value: '2.0%',
            label: 'AGGRESSIVE',
            sublabel: 'HIGH-YIELD GROWTH',
            color: 'var(--emerald-400)'
        }
    ];

    return (
        <div className="prime-sync-container">
            <div className="prime-sync-grid">
                {/* Left Column */}
                <div className="prime-column">
                    {/* Account Deployment Widget */}
                    <motion.div
                        className="prime-widget"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="widget-header">
                            <div className="header-icon">
                                <Settings2 size={20} />
                            </div>
                            <div className="header-text">
                                <h3>Account Deployment</h3>
                                <span className="header-subtitle">RISK MANAGEMENT PROTOCOL</span>
                            </div>
                        </div>

                        {/* Risk Selection */}
                        <div className="risk-selection">
                            {riskOptions.map((option) => (
                                <button
                                    key={option.key}
                                    className={`risk-option ${selectedRisk === option.key ? 'active' : ''} ${option.key}`}
                                    onClick={() => setSelectedRisk(option.key as typeof selectedRisk)}
                                >
                                    {selectedRisk === option.key && (
                                        <div className="active-indicator" />
                                    )}
                                    <span className="risk-value">{option.value}</span>
                                    <span className="risk-label">{option.label}</span>
                                    <span className="risk-sublabel" style={{ color: option.color }}>
                                        {option.sublabel}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Credentials Section */}
                        <div className="credentials-section">
                            <span className="section-label">INSTITUTIONAL BRIDGE CREDENTIALS</span>

                            <div className="input-row">
                                <div className="input-group">
                                    <label>BROKER TERMINAL</label>
                                    <div className="input-wrapper">
                                        <Building2 size={16} className="input-icon" />
                                        <input
                                            type="text"
                                            placeholder="e.g. Liquid Brokers"
                                            value={brokerTerminal}
                                            onChange={(e) => setBrokerTerminal(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label>ACCOUNT EQUITY ($)</label>
                                    <div className="input-wrapper">
                                        <Wallet size={16} className="input-icon" />
                                        <input
                                            type="text"
                                            placeholder="e.g. 100,000"
                                            value={accountEquity}
                                            onChange={(e) => setAccountEquity(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="input-row">
                                <div className="input-group">
                                    <label>TERMINAL LOGIN</label>
                                    <div className="input-wrapper">
                                        <Layers size={16} className="input-icon" />
                                        <input
                                            type="text"
                                            placeholder="MT5 ID / Email"
                                            value={terminalLogin}
                                            onChange={(e) => setTerminalLogin(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label>SECURE KEY</label>
                                    <div className="input-wrapper">
                                        <Lock size={16} className="input-icon" />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={secureKey}
                                            onChange={(e) => setSecureKey(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Swipe to Approve Button */}
                        <div className="swipe-container" ref={constraintsRef}>
                            {!isApproved ? (
                                <motion.div
                                    className="swipe-track"
                                    style={{ background }}
                                >
                                    <motion.div
                                        className="swipe-thumb"
                                        drag="x"
                                        dragConstraints={constraintsRef}
                                        dragElastic={0}
                                        style={{ x }}
                                        onDragEnd={handleDragEnd}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Zap size={20} />
                                    </motion.div>
                                    <span className="swipe-text">
                                        {isApproving ? 'INITIALIZING...' : 'INITIALIZE AUTO TRADER MESH'}
                                    </span>
                                    <ChevronRight className="swipe-arrow" size={20} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    className="swipe-track approved"
                                    initial={{ scale: 0.95 }}
                                    animate={{ scale: 1 }}
                                >
                                    <Check size={24} className="approved-icon" />
                                    <span className="swipe-text">MESH DEPLOYED SUCCESSFULLY</span>
                                </motion.div>
                            )}
                        </div>

                        <p className="deployment-note">
                            Deployment triggers a manual verification from the Verstige Admin Mesh
                        </p>
                    </motion.div>
                </div>

                {/* Right Column */}
                <div className="prime-column">
                    {/* Live Signal Sync Widget */}
                    <motion.div
                        className="prime-widget signal-widget"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        <div className="widget-header">
                            <div className="header-left">
                                <div className="signal-indicator">
                                    <Radio size={16} />
                                </div>
                                <h3>Live Telegram Signal Sync</h3>
                            </div>
                            <span className="sync-id">SYNC_ID: LB-492</span>
                        </div>

                        <div className="signal-status-box">
                            <p>Listening for high-probability sequences across institutional liquidity pools...</p>
                            <div className="listening-animation">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Advanced Risk Mesh Widget */}
                    <motion.div
                        className="prime-widget risk-mesh-widget"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <h3 className="mesh-title">Advanced Risk Mesh</h3>

                        <div className="mesh-features">
                            <div className="mesh-feature">
                                <div className="feature-icon">
                                    <Target size={16} />
                                </div>
                                <div className="feature-content">
                                    <h4>Triple Position Entry</h4>
                                    <p>Diversified exit strategy: 30% at TP1, 40% at TP2, 30% at TP3.</p>
                                </div>
                            </div>

                            <div className="mesh-feature">
                                <div className="feature-icon">
                                    <Shield size={16} />
                                </div>
                                <div className="feature-content">
                                    <h4>Break-Even Logic</h4>
                                    <p>Automatic SL migration to entry point once first target is secured.</p>
                                </div>
                            </div>

                            <div className="mesh-feature">
                                <div className="feature-icon">
                                    <TrendingUp size={16} />
                                </div>
                                <div className="feature-content">
                                    <h4>Trailing Protection</h4>
                                    <p>SL shifts to TP1 once price action confirms TP2 liquidity grab.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Passive Growth Widget */}
                    <motion.div
                        className="prime-widget growth-widget"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                    >
                        <span className="widget-badge">PASSIVE GROWTH</span>
                        <h3 className="growth-title">Earn While You Learn</h3>
                        <p className="growth-desc">
                            With access to the Verstige System, every trade executed by the mesh
                            contributes to your portfolio growth—automatically.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default PrimeSyncUI;
