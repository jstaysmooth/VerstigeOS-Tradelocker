import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Target, BarChart3, Clock, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useTrading } from '@/context/TradingContext';
import './ResultsView.css';

export default function ResultsView() {
    const { results } = useTrading();
    const [timeFrame, setTimeFrame] = useState<'All' | 'Weekly' | 'Monthly'>('All');

    // Calculate stats from real results
    const totalTrades = results.length;
    const wins = results.filter(r => r.netProfit > 0).length;
    const losses = results.filter(r => r.netProfit <= 0).length;
    const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(1) : 0;
    const totalProfit = results.reduce((acc, curr) => acc + curr.netProfit, 0);

    const winningTrades = results.filter(r => r.netProfit > 0);
    const losingTrades = results.filter(r => r.netProfit <= 0);

    const avgWin = winningTrades.length > 0
        ? winningTrades.reduce((acc, curr) => acc + curr.netProfit, 0) / winningTrades.length
        : 0;

    const avgLoss = losingTrades.length > 0
        ? losingTrades.reduce((acc, curr) => acc + Math.abs(curr.netProfit), 0) / losingTrades.length
        : 0;

    return (
        <div className="results-view">
            {/* Header / Timeframe Selection */}
            <div className="results-header">
                <div className="timeframe-selector">
                    {['All', 'Weekly', 'Monthly'].map((tf) => (
                        <button
                            key={tf}
                            className={`tf-btn ${timeFrame === tf ? 'active' : ''}`}
                            onClick={() => setTimeFrame(tf as any)}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            {/* Analytics Dashboard */}
            <section className="analytics-dashboard">
                <div className="main-stats-card">
                    <div className="stats-header">
                        <div className="stats-title-row">
                            <p className="stats-label">Net Profit</p>
                            <span className="profit-growth">+0.0%</span>
                        </div>
                        <h2 className="net-profit-amount">${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                    </div>
                    <div className="mini-chart-placeholder">
                        <div className="mock-chart-line"></div>
                    </div>
                </div>

                <div className="grid-stats">
                    <div className="grid-stat-card win-rate">
                        <div className="circular-progress">
                            <svg viewBox="0 0 36 36" className="circular-chart blue">
                                <path className="circle-bg"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <path className="circle"
                                    strokeDasharray={`${winRate}, 100`}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                            </svg>
                            <div className="percentage">{winRate}%</div>
                        </div>
                        <p className="grid-stat-label">Win Rate</p>
                    </div>

                    <div className="grid-stat-card">
                        <div className="stat-value">{totalTrades}</div>
                        <p className="grid-stat-label">Total Trades</p>
                    </div>

                    <div className="grid-stat-card">
                        <div className="stat-value wins">{wins}</div>
                        <p className="grid-stat-label">Wins</p>
                    </div>

                    <div className="grid-stat-card">
                        <div className="stat-value losses">{losses}</div>
                        <p className="grid-stat-label">Losses</p>
                    </div>
                </div>
            </section>

            {/* Secondary Stats */}
            <div className="secondary-stats">
                <div className="simple-stat-card">
                    <div className="icon win"><ArrowUpRight size={16} /></div>
                    <div className="details">
                        <p className="label">Avg. Win</p>
                        <p className="value">${avgWin.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                </div>
                <div className="simple-stat-card">
                    <div className="icon loss"><ArrowDownRight size={16} /></div>
                    <div className="details">
                        <p className="label">Avg. Loss</p>
                        <p className="value">${avgLoss.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                </div>
            </div>

            {/* Trade History */}
            <section className="history-section">
                <h3 className="section-title">Trade History</h3>
                <div className="history-list">
                    {results.length === 0 ? (
                        <div className="no-history-message">No completed trades yet.</div>
                    ) : (
                        results.map((trade) => (
                            <div key={trade.id} className="history-item">
                                <div className="history-left">
                                    <div className={`status-indicator ${trade.netProfit > 0 ? 'win' : 'loss'}`}></div>
                                    <div className="symbol-info">
                                        <p className="symbol-name">{trade.pair}</p>
                                        <p className="provider-name">{trade.provider}</p>
                                    </div>
                                </div>
                                <div className="history-right">
                                    <div className="pnl-info">
                                        <p className={`pnl-amount ${trade.netProfit > 0 ? 'win' : 'loss'}`}>
                                            {trade.netProfit > 0 ? '+' : ''}${Math.abs(trade.netProfit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </p>
                                        {/* Pips or % could go here */}
                                        <p className="pnl-percent">{trade.pips} pips</p>
                                    </div>
                                    <div className="time-info">
                                        <Clock size={12} />
                                        {/* Format timestamp if needed */}
                                        <span>{new Date(trade.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}
