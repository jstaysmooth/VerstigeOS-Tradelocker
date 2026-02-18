import React, { useState, useEffect } from 'react';
import { useTrading } from '@/context/TradingContext';
import { Eye, EyeOff, Lock, ChevronDown, X } from 'lucide-react';
import { API_URL } from '@/lib/config';
import '@/styles/pages/Account.css'; // Reuse existing styles for now, might need adjustment for modal

type Platform = 'mt5' | 'dxtrade' | 'tradovate' | 'tradelocker';

interface AccountConnectionModalProps {
    onClose: () => void;
}

export default function AccountConnectionModal({ onClose }: AccountConnectionModalProps) {
    const {
        setTradeLockerConnected,
        setTradeLockerData,
        setAccountBalance,
        setAccountEquity,
        setSignals,
        setResults,
        tradeLockerConnected
    } = useTrading();

    const [selectedPlatform, setSelectedPlatform] = useState<Platform>('tradelocker');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [accountId, setAccountId] = useState('');
    const [password, setPassword] = useState('');
    const [server, setServer] = useState('');

    // Account Selection State
    const [accounts, setAccounts] = useState<any[]>([]);
    const [isSelectingAccount, setIsSelectingAccount] = useState(false);

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
        tradelocker: ['GATESFX', 'TradeLocker-Live', 'TradeLocker-Demo']
    };

    // Close modal if connected successfully from elsewhere (e.g. sync)
    useEffect(() => {
        if (tradeLockerConnected) {
            onClose();
        }
    }, [tradeLockerConnected, onClose]);

    const handleSelectAccount = async (selectedAccountId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            // Persistence: Ensure we have a valid user ID
            const userId = localStorage.getItem('v2_user_id');
            if (!userId) {
                setError("User ID not found. Please log in again.");
                setIsLoading(false);
                return;
            }

            console.log("Selecting Account:", { accountId, selectedAccountId, userId });

            const response = await fetch(`${API_URL}/api/tradelocker/select-account`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: accountId,
                    account_id: selectedAccountId,
                    user_id: userId
                })
            });

            const data = await response.json();

            if (data.status === 'success') {
                setTradeLockerConnected(true);
                setTradeLockerData(data);

                if (data.balance) {
                    setAccountBalance(data.balance.balance || 0);
                    setAccountEquity(data.balance.equity || 0);
                }

                if (data.positions) {
                    const mappedPositions = data.positions.map((pos: any) => ({
                        id: pos.id,
                        provider: "TradeLocker",
                        providerRank: "Live",
                        pair: pos.tradableInstrumentId || `ID: ${pos.instrumentId}`,
                        action: pos.side.toUpperCase() as 'BUY' | 'SELL',
                        pips: 0,
                        price: pos.price.toString(),
                        sl: pos.stopLoss?.toString() || "",
                        tp1: pos.takeProfit?.toString() || "",
                        tp2: "",
                        tp3: "",
                        category: "FOREX",
                        timestamp: "Just now",
                        winRate: 0,
                        lotSize: pos.quantity,
                        profit: pos.unrealizedPnL
                    }));
                    setSignals(mappedPositions);
                }

                if (data.history) {
                    const mappedHistory = data.history.map((trade: any) => ({
                        id: trade.id,
                        pair: trade.tradableInstrumentId,
                        type: trade.side,
                        entryPrice: trade.avgPrice || "0",
                        closePrice: trade.avgPrice || "0",
                        netProfit: parseFloat(trade.realizedPnL || 0),
                        pips: 0,
                        lotSize: parseFloat(trade.qty || 0),
                        timestamp: trade.date,
                        provider: "TradeLocker"
                    }));
                    setResults(mappedHistory);
                }

                onClose(); // Close modal on success
            } else {
                setError(data.detail || 'Failed to select account');
            }
        } catch (err) {
            console.error('Account selection error:', err);
            setError('Failed to select account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConnect = async () => {
        setIsLoading(true);
        setError(null);

        try {
            if (selectedPlatform === 'tradelocker') {
                const response = await fetch(`${API_URL}/api/tradelocker/authenticate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: accountId,
                        password: password,
                        server: server,
                        broker_url: server.includes('Demo')
                            ? "https://demo.tradelocker.com/backend-api"
                            : "https://live.tradelocker.com/backend-api"
                    })
                });

                const data = await response.json();

                if (data.status === 'requires_account_selection') {
                    setAccounts(data.accounts);
                    setIsSelectingAccount(true);
                    setIsLoading(false);
                    return;
                } else if (data.status === 'success') {
                    // Direct success fallback
                    setTradeLockerConnected(true);
                    setTradeLockerData(data);
                    if (data.balance) {
                        setAccountBalance(data.balance.balance || 0);
                        setAccountEquity(data.balance.equity || 0);
                    }
                    onClose();
                } else {
                    setError(data.detail || 'Failed to connect to TradeLocker');
                }
            } else {
                // Mock connection for others
                setTimeout(() => {
                    setAccountBalance(250270.00);
                    setAccountEquity(250270.00);
                    onClose();
                }, 1000);
            }
        } catch (err) {
            console.error('Connection error:', err);
            setError('Failed to connect. Please check your credentials and try again.');
        } finally {
            if (!isSelectingAccount) {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000, backdropFilter: 'blur(5px)'
        }}>
            <div className="modal-content glass-card" style={{
                width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto',
                padding: '2rem', position: 'relative', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer'
                }}>
                    <X size={24} />
                </button>

                <div className="title-section" style={{ marginBottom: '2rem' }}>
                    <h2 className="main-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Connect Account</h2>
                    <p className="main-subtitle" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        {isSelectingAccount ? 'Select your trading account.' : 'Link your trading account to Verstige OS.'}
                    </p>
                </div>

                {isSelectingAccount ? (
                    <div className="account-selection-view">
                        <div className="account-list-container" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                            {accounts.length > 0 ? (
                                accounts.map((acc: any) => (
                                    <div key={acc.id} className="account-item glass-card" onClick={() => handleSelectAccount(acc.id)}
                                        style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                        <div className="account-details">
                                            <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{acc.id}</div>
                                            <div style={{ fontSize: '0.9em', color: 'rgba(255,255,255,0.6)' }}>{acc.currency || 'USD'} • {acc.accountType || 'Standard'}</div>
                                        </div>
                                        <div>→</div>
                                    </div>
                                ))
                            ) : (
                                <p>No accounts found.</p>
                            )}
                        </div>
                        <button className="back-link-btn" onClick={() => setIsSelectingAccount(false)}
                            style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: '0' }}>
                            Back to Login
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="platform-selector" style={{ marginBottom: '1.5rem' }}>
                            <label className="section-label" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>Select Platform</label>
                            <div className="platform-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                {platforms.map((platform) => (
                                    <div
                                        key={platform.id}
                                        onClick={() => setSelectedPlatform(platform.id)}
                                        className={`platform-card glass-card ${selectedPlatform === platform.id ? 'selected' : ''}`}
                                        style={{
                                            padding: '12px', cursor: 'pointer',
                                            border: selectedPlatform === platform.id ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.1)',
                                            background: selectedPlatform === platform.id ? 'rgba(79, 70, 229, 0.1)' : 'rgba(255,255,255,0.05)',
                                            borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px'
                                        }}
                                    >
                                        <span>{platform.icon}</span>
                                        <span>{platform.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="connection-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Account ID</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter ID"
                                    value={accountId}
                                    onChange={(e) => setAccountId(e.target.value)}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white' }}
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="form-input"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white' }}
                                    />
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Server</label>
                                <div style={{ position: 'relative' }}>
                                    <select
                                        className="form-select"
                                        value={server}
                                        onChange={(e) => setServer(e.target.value)}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', appearance: 'none' }}
                                    >
                                        <option value="">Select Server</option>
                                        {servers[selectedPlatform].map((srv) => (
                                            <option key={srv} value={srv}>{srv}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={18} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'rgba(255,255,255,0.5)' }} />
                                </div>
                            </div>
                        </div>

                        <div className="form-footer" style={{ marginTop: '2rem' }}>
                            {error && (
                                <div className="error-message" style={{ color: '#ef4444', marginBottom: '10px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <span>⚠️</span> {error}
                                </div>
                            )}
                            <button
                                className="btn-connect glow-accent"
                                onClick={handleConnect}
                                disabled={isLoading || !accountId || !password || !server}
                                style={{
                                    width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
                                    background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)',
                                    color: 'white', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1
                                }}
                            >
                                {isLoading ? 'Connecting...' : 'Authorize Connection'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
