
import React, { useState } from 'react';
import {
    RefreshCw,
    TrendingUp,
    TrendingDown,
    CreditCard,
    BarChart3,
    Clock,
    ChevronRight,
    Activity,
    Shield,
    Target,
    Layers,
    ArrowUpRight,
    ArrowDownRight,
    Copy,
    Check,
    Wallet,
    PieChart,
    Zap
} from 'lucide-react';
import { useTrading } from '@/context/TradingContext';
import './TradingDashboardView.css';

import AccountConnectionModal from './AccountConnectionModal';

export default function TradingDashboardView() {
    const {
        signals,
        results,
        prices,
        accountBalance,
        accountEquity,
        margin,
        freeMargin,
        marginLevel,
        totalPnL,
        dailyPnL,
        winRate,
        totalTrades,
        openPositions,
        isConnected,
        tradeLockerConnected,
        tradeLockerData,
        dxConnected,
        dxData,
        approveSignal,
        disconnectTradeLocker
    } = useTrading();

    console.log('DEBUG DASHBOARD ANALYTICS:', {
        totalTrades,
        winRate,
        totalPnL,
        accountBalance,
        accountEquity,
        dxConnected,
        tradeLockerConnected,
        tradeLockerAnalytics: tradeLockerData?.analytics
    });

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [copiedSignals, setCopiedSignals] = useState<Set<number>>(new Set());
    const [activeSection, setActiveSection] = useState<'positions' | 'history'>('positions');
    const [showConnectionModal, setShowConnectionModal] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const handleCopyTrade = async (signalId: number) => {
        await approveSignal(signalId);
        setCopiedSignals(prev => new Set(prev).add(signalId));
    };

    // Get live P&L — MetaAPI sends server-calculated profit via position_update events
    const getLivePnL = (signal: typeof signals[0]) => {
        // Primary: use MetaAPI's profit (updated live via position_update socket events)
        if (signal.profit !== undefined && signal.profit !== 0) {
            return signal.profit;
        }

        // Fallback: calculate from price stream if no MetaAPI profit yet
        const currentPrice = prices[signal.pair];
        if (!currentPrice) return 0;

        const entryPrice = parseFloat(signal.price);
        if (isNaN(entryPrice) || entryPrice === 0) return 0;

        let pipMultiplier = 10000;
        const pairUpper = signal.pair.toUpperCase();
        if (pairUpper.includes('JPY')) pipMultiplier = 100;
        if (pairUpper === 'XAUUSD' || pairUpper.includes('GOLD')) pipMultiplier = 10;
        if (pairUpper === 'US30' || pairUpper.includes('NAS') || pairUpper.includes('SPX')) pipMultiplier = 1;

        const diff = signal.action === 'BUY'
            ? (currentPrice - entryPrice)
            : (entryPrice - currentPrice);

        return diff * pipMultiplier * signal.lotSize;
    };

    const unrealizedPnL = signals.reduce((acc, s) => acc + getLivePnL(s), 0);

    // Daily change percentage
    const dailyChangePercent = accountBalance > 0
        ? ((dailyPnL / accountBalance) * 100)
        : 0;

    return (
        <div className="trading-dashboard-view">
            {showConnectionModal && (
                <AccountConnectionModal onClose={() => setShowConnectionModal(false)} />
            )}

            {/* ─── Account Overview Card ─── */}
            <section className="account-card">
                <div className="account-card-glow"></div>
                {!isConnected && !tradeLockerConnected && (
                    <button
                        className="btn-connect-account"
                        onClick={() => setShowConnectionModal(true)}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            zIndex: 10,
                            padding: '10px 20px',
                            background: 'var(--accent)',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                        }}
                    >
                        Connect Account
                    </button>
                )}

                <div className="account-header">
                    <div className="connection-status">
                        <div className={`conn-dot ${isConnected ? 'live' : ''}`}></div>
                        <span className="conn-label">
                            {tradeLockerConnected ? 'TradeLocker Active' : (dxConnected ? 'DXTrade Active' : (isConnected ? 'MT5 Connected' : 'Waiting for Connection'))}
                        </span>
                        {(isConnected || tradeLockerConnected || dxConnected) && (
                            <button
                                className="disconnect-text-btn"
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    if (tradeLockerConnected) {
                                        await disconnectTradeLocker();
                                    } else if (dxConnected) {
                                        // TODO: implement disconnectDxTrade if needed, 
                                        // or just clear local storage and refresh
                                        localStorage.removeItem('dx_session');
                                        window.location.reload();
                                    }
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#ef4444',
                                    fontSize: '0.7rem',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    padding: '2px 0 0 0',
                                    marginTop: '4px',
                                    opacity: 0.8,
                                    lineHeight: 1,
                                    display: 'block'
                                }}
                            >
                                Disconnect
                            </button>
                        )}
                    </div>
                    <button
                        className={`refresh-btn ${isRefreshing ? 'spinning' : ''}`}
                        onClick={handleRefresh}
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>

                <div className="account-balance-main">
                    <p className="balance-label">Account Equity</p>
                    <h1 className="balance-amount">
                        <span className="currency-sign">$</span>
                        {accountEquity > 0
                            ? accountEquity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : '0.00'
                        }
                    </h1>
                    <div className="daily-change">
                        <div className={`change-pill ${dailyPnL >= 0 ? 'positive' : 'negative'}`}>
                            {dailyPnL >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            <span>{dailyChangePercent >= 0 ? '+' : ''}{dailyChangePercent.toFixed(2)}%</span>
                        </div>
                        <span className={`change-dollar ${dailyPnL >= 0 ? 'positive' : 'negative'}`}>
                            {dailyPnL >= 0 ? '+' : ''}${Math.abs(dailyPnL).toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="account-metrics">
                    <div className="metric-tile">
                        <div className="metric-icon-wrap">
                            <Wallet size={14} />
                        </div>
                        <div className="metric-text">
                            <span className="metric-label">Balance</span>
                            <span className="metric-value">
                                ${accountBalance > 0 ? accountBalance.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
                            </span>
                        </div>
                    </div>
                    <div className="metric-tile">
                        <div className="metric-icon-wrap">
                            <Shield size={14} />
                        </div>
                        <div className="metric-text">
                            <span className="metric-label">Free Margin</span>
                            <span className="metric-value">
                                ${freeMargin > 0 ? freeMargin.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
                            </span>
                        </div>
                    </div>
                    <div className="metric-tile">
                        <div className="metric-icon-wrap">
                            <Layers size={14} />
                        </div>
                        <div className="metric-text">
                            <span className="metric-label">Margin Used</span>
                            <span className="metric-value">
                                ${margin > 0 ? margin.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
                            </span>
                        </div>
                    </div>
                    <div className="metric-tile">
                        <div className="metric-icon-wrap">
                            <BarChart3 size={14} />
                        </div>
                        <div className="metric-text">
                            <span className="metric-label">Margin Level</span>
                            <span className="metric-value">
                                {marginLevel > 0 ? `${marginLevel.toFixed(0)}%` : '—'}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Analytics Strip ─── */}
            <section className="analytics-strip">
                <div className="analytics-card">
                    <div className="analytics-icon blue">
                        <Activity size={16} />
                    </div>
                    <div className="analytics-info">
                        <span className="analytics-number">{totalTrades}</span>
                        <span className="analytics-label">Total Trades</span>
                    </div>
                </div>
                <div className="analytics-card">
                    <div className="analytics-icon green">
                        <Target size={16} />
                    </div>
                    <div className="analytics-info">
                        <span className="analytics-number">{winRate}%</span>
                        <span className="analytics-label">Win Rate</span>
                    </div>
                </div>
                <div className="analytics-card">
                    <div className="analytics-icon purple">
                        <Zap size={16} />
                    </div>
                    <div className="analytics-info">
                        <span className="analytics-number">{openPositions}</span>
                        <span className="analytics-label">Open Trades</span>
                    </div>
                </div>
                <div className="analytics-card">
                    <div className={`analytics-icon ${tradeLockerData?.analytics?.total_pnl >= 0 || totalPnL >= 0 ? 'green' : 'red'}`}>
                        <PieChart size={16} />
                    </div>
                    <div className="analytics-info">
                        <span className={`analytics-number ${(tradeLockerData?.analytics?.total_pnl ?? totalPnL) >= 0 ? 'positive' : 'negative'}`}>
                            {(tradeLockerData?.analytics?.total_pnl ?? totalPnL) >= 0 ? '+' : ''}${Math.abs(tradeLockerData?.analytics?.total_pnl ?? totalPnL).toFixed(2)}
                        </span>
                        <span className="analytics-label">Total P&L</span>
                    </div>
                </div>
            </section>

            {/* ─── Section Toggle ─── */}
            <div className="section-toggle">
                <button
                    className={`toggle-btn ${activeSection === 'positions' ? 'active' : ''}`}
                    onClick={() => setActiveSection('positions')}
                >
                    <Activity size={14} />
                    Live Positions ({signals.length})
                </button>
                <button
                    className={`toggle-btn ${activeSection === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveSection('history')}
                >
                    <Clock size={14} />
                    Trade History ({results.length})
                </button>
            </div>

            {/* ─── Live Positions ─── */}
            {activeSection === 'positions' && (
                <section className="positions-section">
                    {signals.length === 0 ? (
                        <div className="empty-state">
                            <Activity size={32} className="empty-icon" />
                            <p className="empty-title">No Open Positions</p>
                            <p className="empty-desc">
                                {isConnected
                                    ? 'Trades executed on your MT5 account will appear here in real time.'
                                    : 'Connect your MT5 account to see live positions.'}
                            </p>
                        </div>
                    ) : (
                        <div className="positions-grid">
                            {signals.map((signal) => {
                                const livePnL = getLivePnL(signal);
                                const isProfitable = livePnL >= 0;
                                const isCopied = copiedSignals.has(signal.id);

                                return (
                                    <article key={signal.id} className="position-card">
                                        <div className="position-top">
                                            <div className="position-symbol-row">
                                                <h3 className="position-pair">{signal.pair}</h3>
                                                <span className={`direction-tag ${signal.action.toLowerCase()}`}>
                                                    {signal.action === 'BUY'
                                                        ? <ArrowUpRight size={12} />
                                                        : <ArrowDownRight size={12} />
                                                    }
                                                    {signal.action}
                                                </span>
                                            </div>
                                            <div className={`live-pnl ${isProfitable ? 'positive' : 'negative'}`}>
                                                <span className="pnl-value">
                                                    {isProfitable ? '+' : ''}${livePnL.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="position-details">
                                            <div className="pos-detail">
                                                <span className="pos-label">Entry</span>
                                                <span className="pos-value">{signal.price}</span>
                                            </div>
                                            <div className="pos-detail">
                                                <span className="pos-label">Lot Size</span>
                                                <span className="pos-value">{signal.lotSize}</span>
                                            </div>
                                            <div className="pos-detail">
                                                <span className="pos-label">SL</span>
                                                <span className="pos-value sl">{signal.sl || '—'}</span>
                                            </div>
                                            <div className="pos-detail">
                                                <span className="pos-label">TP</span>
                                                <span className="pos-value tp">{signal.tp1 || '—'}</span>
                                            </div>
                                        </div>

                                        <div className="position-footer">
                                            <div className="position-meta">
                                                <span className="position-provider">{signal.provider}</span>
                                                <span className="position-time">
                                                    <Clock size={10} />
                                                    {signal.timestamp}
                                                </span>
                                            </div>
                                            <button
                                                className={`copy-btn ${isCopied ? 'copied' : ''}`}
                                                onClick={() => handleCopyTrade(signal.id)}
                                                disabled={isCopied}
                                            >
                                                {isCopied
                                                    ? <><Check size={14} /> Copied</>
                                                    : <><Copy size={14} /> Copy Trade</>
                                                }
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}

                    {/* Unrealized P&L Banner */}
                    {signals.length > 0 && (
                        <div className={`unrealized-banner ${unrealizedPnL >= 0 ? 'positive' : 'negative'}`}>
                            <span className="unrealized-label">Unrealized P&L</span>
                            <span className="unrealized-value">
                                {unrealizedPnL >= 0 ? '+' : ''}${Math.abs(unrealizedPnL).toFixed(2)}
                            </span>
                        </div>
                    )}
                </section>
            )}

            {/* ─── Trade History ─── */}
            {activeSection === 'history' && (
                <section className="history-section">
                    {results.length === 0 ? (
                        <div className="empty-state">
                            <Clock size={32} className="empty-icon" />
                            <p className="empty-title">No Trade History</p>
                            <p className="empty-desc">
                                Closed trades from your MT5 account will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="history-list">
                            {results.map((result, index) => {
                                const isProfit = result.netProfit >= 0;
                                return (
                                    <div key={`${result.id}-${index}`} className="history-row">
                                        <div className="history-left">
                                            <div className={`history-direction ${result.type?.toLowerCase().includes('buy') ? 'buy' : 'sell'}`}>
                                                {result.type?.toLowerCase().includes('buy')
                                                    ? <ArrowUpRight size={14} />
                                                    : <ArrowDownRight size={14} />
                                                }
                                            </div>
                                            <div className="history-info">
                                                <span className="history-pair">{result.pair}</span>
                                                <span className="history-meta">
                                                    {result.entryPrice} → {result.closePrice} · {result.lotSize} lots
                                                </span>
                                            </div>
                                        </div>
                                        <div className="history-right">
                                            <span className={`history-profit ${isProfit ? 'positive' : 'negative'}`}>
                                                {isProfit ? '+' : ''}${result.netProfit.toFixed(2)}
                                            </span>
                                            <span className="history-time">
                                                {(() => {
                                                    try {
                                                        const d = new Date(result.timestamp);
                                                        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                                    } catch {
                                                        return result.timestamp;
                                                    }
                                                })()}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}
