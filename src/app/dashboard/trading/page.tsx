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
import SignalsView from '@/components/trading/SignalsView';
import TradeJournalView from '@/components/trading/TradeJournalView';
import RiskCalculatorView from '@/components/trading/RiskCalculatorView';
import IndicatorView from '@/components/trading/IndicatorView';
import AutoTraderView from '@/components/trading/AutoTraderView';
import { TradingProvider } from '@/context/TradingContext';

export default function TradingPage() {
    return (
        <TradingProvider>
            <TradingPageContent />
        </TradingProvider>
    );
}

function TradingPageContent() {
    const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'RESULTS' | 'OVERVIEW' | 'JOURNAL' | 'CALCULATOR' | 'INDICATOR' | 'AUTOTRADER' | 'SIGNALS'>('DASHBOARD');
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
                    className={`tab-item ${activeTab === 'SIGNALS' ? 'active' : ''}`}
                    onClick={() => setActiveTab('SIGNALS')}
                >
                    <Activity size={18} /> Signals
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

            {activeTab === 'SIGNALS' && (
                <SignalsView />
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
                <div className="tab-content animate-fade-in">
                    <AutoTraderView
                        autoTraderRisk={autoTraderRisk}
                        setAutoTraderRisk={setAutoTraderRisk}
                        accountSize={accountSize}
                        setAccountSize={setAccountSize}
                        broker={broker}
                        setBroker={setBroker}
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        isAutoTraderRunning={isAutoTraderRunning}
                        setIsAutoTraderRunning={setIsAutoTraderRunning}
                    />
                </div>
            )}
        </div>
    );
}
