"use client";
import React, { useState, useEffect } from 'react';
import TradingViewWidget from '@/components/TradingViewWidget';
import {
    TrendingUp,
    PieChart,
    Activity,
    Globe,
    Layout,
    Calendar,
    Cpu,
    BookOpen,
    PlusCircle,
    ArrowRight,
    ExternalLink,
    Wallet,
    Target,
    Zap,
    History,
    ChevronRight,
    Lock,
    Settings,
    Shield,
    Users,
    BarChart3
} from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import Link from 'next/link';
import '@/styles/pages/Trading.css';


import TradingDashboardView from '@/components/trading/TradingDashboardView';
import ResultsView from '@/components/trading/ResultsView';
import TradeJournalView from '@/components/trading/TradeJournalView';
import RiskCalculatorView from '@/components/trading/RiskCalculatorView';
import IndicatorView from '@/components/trading/IndicatorView';
import { TradingProvider } from '@/context/TradingContext';

export default function TradingPage() {
    return (
        <TradingProvider>
            <TradingPageContent />
        </TradingProvider>
    );
}

function TradingPageContent() {
    const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'RESULTS' | 'OVERVIEW' | 'JOURNAL' | 'CALCULATOR' | 'INDICATOR' | 'AUTOTRADER'>('DASHBOARD');
    const [isConnected, setIsConnected] = useState(false);

    // ... existing state ...
    const [autoTraderRisk, setAutoTraderRisk] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');
    const [accountSize, setAccountSize] = useState('');
    const [broker, setBroker] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAutoTraderRunning, setIsAutoTraderRunning] = useState(false);

    // Journal State
    const [journalEntries, setJournalEntries] = useState([
        { id: 1, date: 3, amount: 420, type: 'win', symbol: 'XAUUSD' },
        { id: 2, date: 7, amount: 315, type: 'win', symbol: 'EURUSD' },
        { id: 3, date: 12, amount: 150, type: 'win', symbol: 'NAS100' },
        { id: 4, date: 14, amount: 180, type: 'loss', symbol: 'XAUUSD' },
        { id: 5, date: 18, amount: 240, type: 'win', symbol: 'XAUUSD' },
        { id: 6, date: 21, amount: 90, type: 'loss', symbol: 'BTCUSD' },
        { id: 7, date: 24, amount: 560, type: 'win', symbol: 'XAUUSD' }
    ]);
    const [showModal, setShowModal] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const [entryDate, setEntryDate] = useState(new Date().getDate());
    const [entryAmount, setEntryAmount] = useState('');
    const [entrySymbol, setEntrySymbol] = useState('XAUUSD');
    const [entryType, setEntryType] = useState<'win' | 'loss'>('win');

    const handleAddEntry = () => {
        if (!entryAmount) return;
        const newEntry = {
            id: Date.now(),
            date: entryDate,
            amount: parseFloat(entryAmount),
            type: entryType,
            symbol: entrySymbol
        };
        setJournalEntries([...journalEntries, newEntry]);
        setShowModal(false);
        setEntryAmount('');
    };

    const calculateMonthlyPL = () => {
        return journalEntries.reduce((acc, curr) => {
            return curr.type === 'win' ? acc + curr.amount : acc - curr.amount;
        }, 0);
    };

    const calculateWinRate = () => {
        const wins = journalEntries.filter(e => e.type === 'win').length;
        return Math.round((wins / journalEntries.length) * 100) || 0;
    };

    return (
        <div className="trading-page">
            <DashboardHeader
                title="Trading Division"
                subtitle="Institutional-grade liquidity bridge and asset tracking."
            />

            {/* Sub-Navigation Tabs */}
            <div className="trading-tabs glass-panel">
                <button
                    className={`tab-item ${activeTab === 'DASHBOARD' ? 'active' : ''}`}
                    onClick={() => setActiveTab('DASHBOARD')}
                >
                    <Layout size={18} /> Dashboard
                </button>

                <button
                    className={`tab-item ${activeTab === 'RESULTS' ? 'active' : ''}`}
                    onClick={() => setActiveTab('RESULTS')}
                >
                    <PieChart size={18} /> Results
                </button>
                <button
                    className={`tab-item ${activeTab === 'CHART' ? 'active' : ''}`}
                    onClick={() => setActiveTab('CHART')}
                >
                    <BarChart3 size={18} /> Chart
                </button>
                <button
                    className={`tab-item ${activeTab === 'JOURNAL' ? 'active' : ''}`}
                    onClick={() => setActiveTab('JOURNAL')}
                >
                    <Calendar size={18} /> Trade Journal
                </button>
                <button
                    className={`tab-item ${activeTab === 'CALCULATOR' ? 'active' : ''}`}
                    onClick={() => setActiveTab('CALCULATOR')}
                >
                    <Target size={18} /> Risk Calculator
                </button>
                <button
                    className={`tab-item ${activeTab === 'INDICATOR' ? 'active' : ''}`}
                    onClick={() => setActiveTab('INDICATOR')}
                >
                    <Zap size={18} /> Indicators
                </button>
                <button
                    className={`tab-item ${activeTab === 'AUTOTRADER' ? 'active' : ''}`}
                    onClick={() => setActiveTab('AUTOTRADER')}
                >
                    <History size={18} /> Auto Trader
                </button>
                <Link href="/dashboard/trading/education" className="tab-item">
                    <BookOpen size={18} /> Education
                </Link>
            </div>

            {activeTab === 'DASHBOARD' && (
                <TradingDashboardView />
            )}



            {activeTab === 'RESULTS' && (
                <ResultsView />
            )}

            {activeTab === 'CHART' && (
                <div className="tab-content chart-tab-view animate-fade-in">
                    {/* Chart Hero Banner */}
                    <div className="chart-hero">
                        <div className="chart-hero-content">
                            <div className="chart-hero-badge">LIVE MARKETS</div>
                            <h2 className="chart-hero-title">Market Analysis</h2>
                            <p className="chart-hero-subtitle">Real-time charting powered by TradingView</p>
                        </div>
                        <div className="chart-hero-actions">
                            <a href="https://www.tradingview.com/script/xSRlmPkH-The-Verstige-Strategy/" target="_blank" className="chart-indicator-link">
                                <Zap size={16} />
                                <span>Verstige Indicator</span>
                                <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>

                    {/* Full-Height Chart */}
                    <div className="chart-fullscreen-container">
                        <TradingViewWidget />
                    </div>
                </div>
            )}


            {activeTab === 'JOURNAL' && (
                <div className="tab-content animate-fade-in">
                    <TradeJournalView />
                </div>
            )}

            {activeTab === 'CALCULATOR' && (
                <div className="tab-content animate-fade-in">
                    <RiskCalculatorView />
                </div>
            )}
            {activeTab === 'INDICATOR' && (
                <div className="tab-content animate-fade-in">
                    <IndicatorView />
                </div>
            )}

            {activeTab === 'AUTOTRADER' && (
                <div className="tab-content autotrader-view animate-fade-in">
                    {/* Immersive Command Hero */}
                    <div className="at-command-hero glass-panel">
                        <div className="hero-status-bar">
                            <div className="connection-mesh">
                                <span className="status-dot pulse-blue"></span>
                                <span className="text-xs font-mono tracking-widest text-secondary uppercase">Secure Encryption Mesh Active</span>
                            </div>
                            <div className="latency-info">
                                <Activity size={12} className="text-accent" />
                                <span className="text-xs font-mono text-secondary">Latency: 12ms</span>
                            </div>
                        </div>

                        <div className="hero-main-content">
                            <div className="hero-text-block">
                                <div className="badge-premium-gold mb-4">Institutional Protocol v4.0</div>
                                <h1 className="text-5xl font-black mb-6 tracking-tight">Auto Trader <span className="text-accent">Engine</span></h1>
                                <p className="text-lg text-secondary leading-relaxed max-w-2xl mb-8">
                                    A multi-asset execution framework designed for high-net-worth deployment.
                                    Synchronize your capital with professional signals in real-time with surgical precision.
                                </p>

                                <div className="yield-strip">
                                    <div className="yield-item">
                                        <span className="label">Monthly Target</span>
                                        <span className="value">8-12%</span>
                                    </div>
                                    <div className="yield-item">
                                        <span className="label">Drawdown Threshold</span>
                                        <span className="value text-red-500">3.5%</span>
                                    </div>
                                    <div className="yield-item">
                                        <span className="label">Execution Speed</span>
                                        <span className="value text-green-400"><Zap size={14} /> Instant</span>
                                    </div>
                                </div>
                            </div>

                            <div className="hero-visual-mesh">
                                <div className="glitch-element">
                                    <Cpu size={180} />
                                </div>
                                <div className="orbit-rings">
                                    <div className="ring"></div>
                                    <div className="ring"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Command Logic */}
                    <div className="at-interface-grid mt-12">
                        {/* Configuration Mesh */}
                        <div className="at-config-mesh glass-panel">
                            <div className="mesh-header mb-8">
                                <Settings size={20} className="text-accent" />
                                <h3>Account Deployment</h3>
                            </div>

                            <div className="at-input-sections">
                                {/* Risk Tier Selection */}
                                <div className="config-section mb-10">
                                    <label className="section-label text-xs font-bold text-secondary uppercase tracking-widest block mb-4">Risk Management Protocol</label>
                                    <div className="risk-dial-grid">
                                        {[
                                            { id: 'LOW', val: '1.0%', label: 'Stability', desc: 'Preservation focus' },
                                            { id: 'MEDIUM', val: '1.5%', label: 'Balanced', desc: 'Optimal RR mesh' },
                                            { id: 'HIGH', val: '2.0%', label: 'Aggressive', desc: 'High-yield growth' }
                                        ].map((r) => (
                                            <div
                                                key={r.id}
                                                className={`risk-dial-card ${autoTraderRisk === r.id ? 'active' : ''}`}
                                                onClick={() => setAutoTraderRisk(r.id as any)}
                                            >
                                                <div className="card-selection-dot"></div>
                                                <span className="val">{r.val}</span>
                                                <span className="label">{r.label}</span>
                                                <span className="desc">{r.desc}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Security Credentials */}
                                <div className="config-section">
                                    <label className="section-label text-xs font-bold text-secondary uppercase tracking-widest block mb-4">Institutional Bridge Credentials</label>
                                    <div className="credential-mesh">
                                        <div className="mesh-field">
                                            <label>Broker Terminal</label>
                                            <div className="input-wrapper">
                                                <Globe size={16} />
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Liquid Brokers"
                                                    value={broker}
                                                    onChange={(e) => setBroker(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="mesh-field">
                                            <label>Account Equity ($)</label>
                                            <div className="input-wrapper">
                                                <Wallet size={16} />
                                                <input
                                                    type="number"
                                                    placeholder="e.g. 100,000"
                                                    value={accountSize}
                                                    onChange={(e) => setAccountSize(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="mesh-field">
                                            <label>Terminal Login</label>
                                            <div className="input-wrapper">
                                                <Users size={16} />
                                                <input
                                                    type="text"
                                                    placeholder="MT5 ID / Email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="mesh-field">
                                            <label>Secure Key</label>
                                            <div className="input-wrapper">
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

                            <div className="deployment-actions mt-12">
                                <button
                                    className={`btn-at-deploy ${isAutoTraderRunning ? 'active' : ''}`}
                                    onClick={() => setIsAutoTraderRunning(!isAutoTraderRunning)}
                                >
                                    <div className="btn-glow"></div>
                                    <div className="btn-content">
                                        {isAutoTraderRunning ? (
                                            <>
                                                <div className="spinner-mini"></div>
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
                        <div className="at-intelligence-column flex flex-col gap-6">
                            <div className="intel-card glass-panel signal-mesh">
                                <div className="intel-header">
                                    <div className="flex items-center gap-2">
                                        <div className="online-pulse"></div>
                                        <h3>Live Telegram Signal Sync</h3>
                                    </div>
                                    <span className="text-[10px] font-mono opacity-50">SYNC_ID: LB-492</span>
                                </div>
                                <div className="signal-visualizer">
                                    <div className="signal-wave"></div>
                                    <div className="signal-wave delay-1"></div>
                                    <div className="signal-content">
                                        <p className="text-secondary text-sm">Listening for high-probability sequences across institutional liquidity pools...</p>
                                    </div>
                                </div>
                            </div>

                            <div className="intel-card glass-panel protocol-lock">
                                <div className="intel-header mb-6">
                                    <Shield size={18} className="text-accent" />
                                    <h3>Advanced Risk Mesh</h3>
                                </div>
                                <div className="protocol-checklist">
                                    <div className="check-item">
                                        <div className="item-icon"><Layout size={14} /></div>
                                        <div className="item-text">
                                            <h4>Triple Position Entry</h4>
                                            <p>Diversified exit strategy: 30% at TP1, 40% at TP2, 30% at TP3.</p>
                                        </div>
                                    </div>
                                    <div className="check-item">
                                        <div className="item-icon"><Target size={14} /></div>
                                        <div className="item-text">
                                            <h4>Break-Even Logic</h4>
                                            <p>Automatic SL migration to entry point once first target is secured.</p>
                                        </div>
                                    </div>
                                    <div className="check-item">
                                        <div className="item-icon"><History size={14} /></div>
                                        <div className="item-text">
                                            <h4>Trailing Protection</h4>
                                            <p>SL shifts to TP1 once price action confirms TP2 liquidity grab.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="at-promo-card glass-panel">
                                <div className="promo-inner">
                                    <div className="earn-badge">Passive Growth</div>
                                    <h3>Earn While You Learn</h3>
                                    <p>While you master the Verstige Strategy, our automated engine handles the precision execution. No emotional bias, just mathematical certainty.</p>
                                    <div className="progress-bar-subtle">
                                        <div className="progress-fill" style={{ width: '65%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
