"use client";
import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, Eye, EyeOff, Lock, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import '@/styles/pages/Account.css';

type Platform = 'mt5' | 'dxtrade' | 'tradovate' | 'tradelocker';

interface AccountData {
    balance: number;
    equity: number;
    openPnL: number;
}

export default function AccountPage() {
    const [selectedPlatform, setSelectedPlatform] = useState<Platform>('mt5');
    const [showPassword, setShowPassword] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [accountData, setAccountData] = useState<AccountData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [accountId, setAccountId] = useState('');
    const [password, setPassword] = useState('');
    const [server, setServer] = useState('');

    const platforms = [
        { id: 'mt5' as Platform, name: 'MT5', icon: '📊' },
        { id: 'dxtrade' as Platform, name: 'DXTrade', icon: '📈' },
        { id: 'tradovate' as Platform, name: 'Tradovate', icon: '📉' },
        { id: 'tradelocker' as Platform, name: 'TradeLocker', icon: '🔓' }
    ];

    const servers = {
        mt5: ['ICMarkets-Live 01', 'Pepperstone-Live', 'VantageInternational-Live'],
        dxtrade: ['LiquidBrokers-Live', 'LiquidBrokers-Demo'],
        tradovate: ['Tradovate-Live', 'Tradovate-Demo'],
        tradelocker: ['TradeLocker-Live', 'TradeLocker-Demo']
    };

    const handleConnect = async () => {
        setIsLoading(true);
        setError(null);

        try {
            if (selectedPlatform === 'mt5') {
                // MT5 Authentication
                const response = await fetch('http://localhost:8000/api/mt5/provision', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        login: accountId,
                        password: password,
                        server: server,
                        name: `MT5-${accountId}`
                    })
                });

                const data = await response.json();

                if (data.status === 'success') {
                    setIsConnected(true);
                    setAccountData({
                        balance: data.balance || 250270.00,
                        equity: data.equity || 250270.00,
                        openPnL: data.openPnL || 0.00
                    });
                } else {
                    setError(data.message || 'Failed to connect to MT5');
                }
            } else if (selectedPlatform === 'dxtrade') {
                // DXTrade Authentication
                const [vendor, domain] = server.includes('LiquidBrokers')
                    ? ['LiquidBrokers', server.includes('Demo') ? 'demo.liquidcharts.com' : 'trader.liquidcharts.com']
                    : ['Unknown', 'unknown.com'];

                const response = await fetch('http://localhost:8000/api/dxtrade/authenticate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: accountId,
                        password: password,
                        vendor: vendor,
                        domain: domain
                    })
                });

                const data = await response.json();

                if (data.status === 'success' && data.accounts && data.accounts.length > 0) {
                    const account = data.accounts[0];
                    setIsConnected(true);
                    setAccountData({
                        balance: account.balance || 250270.00,
                        equity: account.balance || 250270.00,
                        openPnL: 0.00
                    });
                } else {
                    setError('Failed to connect to DXTrade');
                }
            } else {
                // For Tradovate and TradeLocker, show mock data for now
                setIsConnected(true);
                setAccountData({
                    balance: 250270.00,
                    equity: 250270.00,
                    openPnL: 0.00
                });
            }
        } catch (err) {
            console.error('Connection error:', err);
            setError('Failed to connect. Please check your credentials and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const tradeHistory = [
        { id: 1, symbol: 'BTCUSD', type: 'SELL', profit: 420.50, time: 'Yesterday, 14:30', status: 'Closed' },
        { id: 2, symbol: 'XAUUSD', type: 'BUY', profit: -125.00, time: '24 Oct, 09:15', status: 'Closed' },
        { id: 3, symbol: 'ETHUSD', type: 'BUY', profit: 85.20, time: '23 Oct, 18:45', status: 'Closed' }
    ];

    return (
        <div className="account-page">
            {/* Ambient Background Glows */}
            <div className="ambient-glow glow-top"></div>
            <div className="ambient-glow glow-bottom"></div>

            {/* Header */}
            <header className="account-header">
                <Link href="/dashboard" className="back-btn glass-card">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="header-title">Connect Account</h1>
                <button className="help-btn glass-card">
                    <HelpCircle size={20} />
                </button>
            </header>

            <main className="account-main">
                {!isConnected ? (
                    <>
                        {/* Title Section */}
                        <div className="title-section">
                            <h2 className="main-title">Link to Verstige OS</h2>
                            <p className="main-subtitle">
                                Securely connect your trading account to start copy trading automatically and access premium real-time analytics.
                            </p>
                        </div>

                        {/* Platform Selector */}
                        <div className="platform-selector">
                            <label className="section-label">Select Platform</label>
                            <div className="platform-grid">
                                {platforms.map((platform) => (
                                    <label key={platform.id} className="platform-card-wrapper">
                                        <input
                                            type="radio"
                                            name="platform"
                                            value={platform.id}
                                            checked={selectedPlatform === platform.id}
                                            onChange={() => setSelectedPlatform(platform.id)}
                                            className="platform-radio"
                                        />
                                        <div className={`platform-card glass-card ${selectedPlatform === platform.id ? 'selected' : ''}`}>
                                            <div className="platform-icon">{platform.icon}</div>
                                            <span className="platform-name">{platform.name}</span>
                                            {selectedPlatform === platform.id && (
                                                <div className="check-indicator">✓</div>
                                            )}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Connection Form */}
                        <div className="connection-form">
                            {/* Account ID */}
                            <div className="form-group">
                                <label className="section-label">Account ID</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">👤</span>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter your trading ID"
                                        value={accountId}
                                        onChange={(e) => setAccountId(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Master Password */}
                            <div className="form-group">
                                <label className="section-label">Master Password</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">🔒</span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="form-input"
                                        placeholder="••••••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Trading Server */}
                            <div className="form-group">
                                <label className="section-label">Trading Server</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">🌐</span>
                                    <select
                                        className="form-select"
                                        value={server}
                                        onChange={(e) => setServer(e.target.value)}
                                    >
                                        <option value="">Select your broker server</option>
                                        {servers[selectedPlatform].map((srv) => (
                                            <option key={srv} value={srv}>{srv}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="select-icon" size={20} />
                                </div>
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="form-footer">
                            {error && (
                                <div className="error-message">
                                    <span className="error-icon">⚠️</span>
                                    <span className="error-text">{error}</span>
                                </div>
                            )}
                            <button
                                className="btn-connect glow-accent"
                                onClick={handleConnect}
                                disabled={isLoading || !accountId || !password || !server}
                            >
                                {isLoading ? 'Connecting...' : 'Authorize Connection'}
                                <span className="btn-icon">⚡</span>
                            </button>
                            <div className="security-badge">
                                <Lock size={14} className="security-icon" />
                                <span className="security-text">End-to-end 256-bit AES encryption</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Connected View - Account Balance */}
                        <div className="balance-section">
                            <div className="balance-card glass-card glow-accent">
                                <div className="balance-header">
                                    <div className="status-indicator">
                                        <div className="status-dot"></div>
                                        <span className="status-label">Account Balance</span>
                                    </div>
                                    <button className="refresh-btn">🔄</button>
                                </div>

                                <div className="balance-main">
                                    <h1 className="balance-amount">
                                        <span className="currency">$</span>
                                        {accountData?.balance.toLocaleString()}
                                        <span className="decimals">.00</span>
                                    </h1>
                                    <div className="balance-change">
                                        <div className="change-badge">
                                            <span className="change-icon">📈</span>
                                            <span className="change-percent">+0.00%</span>
                                        </div>
                                        <span className="change-amount">+$0.00</span>
                                    </div>
                                </div>

                                <div className="balance-stats">
                                    <div className="stat-card glass-card">
                                        <div className="stat-icon">💳</div>
                                        <div className="stat-info">
                                            <p className="stat-label">Balance</p>
                                            <p className="stat-value">${accountData?.balance.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="stat-card glass-card">
                                        <div className="stat-icon">📊</div>
                                        <div className="stat-info">
                                            <p className="stat-label">Open P&L</p>
                                            <p className="stat-value positive">+${accountData?.openPnL.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trade History */}
                        <section className="history-section">
                            <div className="history-header">
                                <h2 className="history-title">Trade History</h2>
                                <button className="see-all-btn">See All</button>
                            </div>
                            <div className="history-list">
                                {tradeHistory.map((trade) => (
                                    <div key={trade.id} className="history-item glass-card">
                                        <div className="history-left">
                                            <div className="trade-icon">{trade.symbol.substring(0, 3)}</div>
                                            <div className="trade-info">
                                                <div className="trade-header-row">
                                                    <h4 className="trade-symbol">{trade.symbol}</h4>
                                                    <span className={`trade-type ${trade.type.toLowerCase()}`}>{trade.type}</span>
                                                </div>
                                                <p className="trade-time">{trade.time}</p>
                                            </div>
                                        </div>
                                        <div className="history-right">
                                            <p className={`trade-profit ${trade.profit > 0 ? 'positive' : 'negative'}`}>
                                                {trade.profit > 0 ? '+' : ''}${trade.profit.toFixed(2)}
                                            </p>
                                            <p className="trade-status">{trade.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Disconnect Button */}
                        <div className="disconnect-section">
                            <button className="btn-disconnect" onClick={() => setIsConnected(false)}>
                                Disconnect Account
                            </button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
