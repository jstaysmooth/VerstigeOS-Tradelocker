"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
    Users, Shield, DollarSign, Briefcase, TrendingUp,
    ChevronDown, ChevronRight, RefreshCw, Search,
    CheckCircle2, XCircle, AlertCircle, Settings2, X,
    Wallet, Activity, User2, Crown, Clock
} from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import '@/styles/pages/Admin.css';

// ─── Types ────────────────────────────────────────────────────────────────────
interface AdminUser {
    id: string;
    email: string;
    fullName: string;
    divisions: string[];
    isAdmin: boolean;
    createdAt: string;
    lastSignIn: string | null;
    tradingAccountConnected: boolean;
    tradingBalance: number;
    tradingProvider?: string | null;
    analyticsData?: {
        winRate: number;
        totalTrades: number;
        totalPnl: number;
        growth: { time: string; balance: number }[];
        recentTrades: any[];
    } | null;
}

type Tab = 'all' | 'trading' | 'business' | 'sales';
type DivisionName = 'trading' | 'business' | 'sales';

const DIVISION_CONFIG: Record<DivisionName, { label: string; color: string; icon: React.ReactNode }> = {
    trading: { label: 'Trading', color: '#10b981', icon: <DollarSign size={14} /> },
    business: { label: 'Business', color: '#6366f1', icon: <Briefcase size={14} /> },
    sales: { label: 'Sales', color: '#ef4444', icon: <TrendingUp size={14} /> },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function DivisionBadge({ division, active }: { division: DivisionName; active: boolean }) {
    const cfg = DIVISION_CONFIG[division];
    return (
        <span
            className="admin-division-badge"
            style={{
                background: active ? `${cfg.color}22` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${active ? cfg.color + '55' : 'rgba(255,255,255,0.08)'}`,
                color: active ? cfg.color : 'rgba(255,255,255,0.25)',
                opacity: active ? 1 : 0.5,
            }}
        >
            {cfg.icon}
            {cfg.label}
        </span>
    );
}

function formatDate(iso: string | null) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Growth Chart Component ──────────────────────────────────────────────────
function GrowthChart({ data }: { data: { time: string; balance: number }[] }) {
    if (!data || data.length < 2) return <div className="admin-no-chart">Insufficient data for chart</div>;

    const balances = data.map(d => d.balance);
    const min = Math.min(...balances);
    const max = Math.max(...balances);
    const range = max - min || 1;

    const width = 400;
    const height = 120;
    const padding = 10;

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
        const y = height - ((d.balance - min) / range) * (height - padding * 2) - padding;
        return `${x},${y}`;
    }).join(' ');

    const trendColor = balances[balances.length - 1] >= balances[0] ? '#10b981' : '#ef4444';

    return (
        <div className="admin-growth-chart-wrap">
            <svg viewBox={`0 0 ${width} ${height}`} className="admin-growth-svg">
                <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={trendColor} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={trendColor} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <polyline
                    fill="none"
                    stroke={trendColor}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                />
                <path
                    d={`M ${padding} ${height} L ${points} L ${width - padding} ${height} Z`}
                    fill="url(#chartGradient)"
                />
            </svg>
            <div className="chart-pnl-label" style={{ color: trendColor }}>
                {balances[balances.length - 1] >= balances[0] ? '+' : ''}
                {((balances[balances.length - 1] - balances[0]) / (balances[0] || 1) * 100).toFixed(1)}%
            </div>
        </div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AdminPage() {
    const { isAdmin, loading: authLoading } = useUser();
    const router = useRouter();

    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<Tab>('all');
    const [expandedUser, setExpandedUser] = useState<string | null>(null);

    // Modal state
    const [modalUser, setModalUser] = useState<AdminUser | null>(null);
    const [pendingDivisions, setPendingDivisions] = useState<Set<DivisionName>>(new Set());
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState<Record<string, boolean>>({});

    // Redirect non-admins
    useEffect(() => {
        if (!authLoading && !isAdmin) {
            router.replace('/dashboard');
        }
    }, [isAdmin, authLoading, router]);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/admin/users');
            if (!res.ok) {
                const d = await res.json();
                throw new Error(d.error || 'Failed to load users');
            }
            const data = await res.json();
            setUsers(data.users ?? []);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    // ── Filtering ────────────────────────────────────────────────────────────
    const filtered = users.filter((u) => {
        const q = search.toLowerCase();
        const matchSearch = !q ||
            u.email.toLowerCase().includes(q) ||
            u.fullName.toLowerCase().includes(q);

        const matchTab =
            activeTab === 'all' ? true :
                u.divisions.map(d => d.toLowerCase()).includes(activeTab);

        return matchSearch && matchTab;
    });

    // ── Stats ────────────────────────────────────────────────────────────────
    const totalUsers = users.length;
    const tradingUsers = users.filter(u => u.divisions.some(d => d.toLowerCase() === 'trading')).length;
    const businessUsers = users.filter(u => u.divisions.some(d => d.toLowerCase() === 'business')).length;
    const salesUsers = users.filter(u => u.divisions.some(d => d.toLowerCase() === 'sales')).length;

    // ── Division Modal ────────────────────────────────────────────────────────
    const openModal = (user: AdminUser) => {
        setModalUser(user);
        setPendingDivisions(new Set(user.divisions.map(d => d.toLowerCase()) as DivisionName[]));
        setSaveMsg(null);
    };

    const closeModal = () => {
        setModalUser(null);
        setSaveMsg(null);
    };

    const toggleDivision = (div: DivisionName) => {
        setPendingDivisions(prev => {
            const next = new Set(prev);
            next.has(div) ? next.delete(div) : next.add(div);
            return next;
        });
    };

    const saveDivisions = async () => {
        if (!modalUser) return;
        setSaving(true);
        setSaveMsg(null);

        const originalDivisions = new Set(modalUser.divisions.map(d => d.toLowerCase()) as DivisionName[]);
        const toGrant = [...pendingDivisions].filter(d => !originalDivisions.has(d));
        const toRevoke = [...originalDivisions].filter(d => !pendingDivisions.has(d));

        try {
            await Promise.all([
                ...toGrant.map(d => fetch('/api/admin/grant-division', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: modalUser.id, division: d }),
                })),
                ...toRevoke.map(d => fetch('/api/admin/revoke-division', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: modalUser.id, division: d }),
                })),
            ]);

            // Update local state to reflect changes immediately
            setUsers(prev => prev.map(u =>
                u.id === modalUser.id
                    ? { ...u, divisions: [...pendingDivisions] }
                    : u
            ));
            setSaveMsg('Access updated successfully!');
            setTimeout(closeModal, 1200);
        } catch (e: any) {
            setSaveMsg(`Error: ${e.message}`);
        } finally {
            setSaving(false);
        }
    };

    const refreshBalance = async (user: AdminUser) => {
        setRefreshing(prev => ({ ...prev, [user.id]: true }));
        try {
            const res = await fetch('/api/admin/refresh-user-balance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, email: user.email, provider: user.tradingProvider }),
            });
            const data = await res.json();
            if (data.status === 'success') {
                setUsers(prev => prev.map(u =>
                    u.id === user.id ? { ...u, tradingBalance: data.balance } : u
                ));
            } else {
                console.error('Refresh failed:', data.error);
            }
        } catch (e) {
            console.error('Refresh error:', e);
        } finally {
            setRefreshing(prev => ({ ...prev, [user.id]: false }));
        }
    };

    const fetchAnalytics = async (user: AdminUser) => {
        if (user.analyticsData || !user.tradingAccountConnected) return;

        try {
            const res = await fetch('/api/admin/user-trading-analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, email: user.email, provider: user.tradingProvider }),
            });
            const data = await res.json();
            console.log('[/api/admin/user-trading-analytics] Response data:', data);
            if (data.status === 'success') {
                setUsers(prev => prev.map(u =>
                    u.id === user.id ? {
                        ...u,
                        analyticsData: {
                            winRate: data.analytics?.win_rate ?? 0,
                            totalTrades: data.analytics?.total_trades ?? 0,
                            totalPnl: data.analytics?.total_pnl ?? 0,
                            growth: data.growth || [],
                            recentTrades: data.history || []
                        }
                    } : u
                ));
            } else {
                console.error('Analytics fetch failed:', data.error);
            }
        } catch (e) {
            console.error('Analytics fetch error:', e);
        }
    };

    const handleExpand = (userId: string) => {
        const isCurrentlyExpanded = expandedUser === userId;
        setExpandedUser(isCurrentlyExpanded ? null : userId);

        if (!isCurrentlyExpanded) {
            const user = users.find(u => u.id === userId);
            if (user) fetchAnalytics(user);
        }
    };

    if (authLoading) return null;
    if (!isAdmin) return null;

    return (
        <div className="admin-page">
            <DashboardHeader
                title="Admin Console"
                subtitle="Manage all platform users, division access, and trading accounts."
                badgeText="ADMIN"
            />

            {/* ── Stats Bar ── */}
            <div className="admin-stats-bar animate-fade-in">
                {[
                    { label: 'Total Users', value: totalUsers, color: '#fff', icon: <Users size={18} /> },
                    { label: 'Trading', value: tradingUsers, color: '#10b981', icon: <DollarSign size={18} /> },
                    { label: 'Business', value: businessUsers, color: '#6366f1', icon: <Briefcase size={18} /> },
                    { label: 'Sales', value: salesUsers, color: '#ef4444', icon: <TrendingUp size={18} /> },
                ].map(s => (
                    <div key={s.label} className="admin-stat-card glass-panel">
                        <div className="admin-stat-icon" style={{ color: s.color }}>{s.icon}</div>
                        <div>
                            <div className="admin-stat-value" style={{ color: s.color }}>{s.value}</div>
                            <div className="admin-stat-label">{s.label}</div>
                        </div>
                    </div>
                ))}

                <button className="admin-refresh-btn" onClick={fetchUsers} disabled={loading} title="Refresh">
                    <RefreshCw size={16} className={loading ? 'spin' : ''} />
                </button>
            </div>

            {/* ── Tabs + Search ── */}
            <div className="admin-toolbar glass-panel animate-fade-in">
                <div className="admin-tabs">
                    {(['all', 'trading', 'business', 'sales'] as Tab[]).map(tab => (
                        <button
                            key={tab}
                            className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === 'all' ? <Users size={14} /> : DIVISION_CONFIG[tab as DivisionName].icon}
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            <span className="admin-tab-count">
                                {tab === 'all' ? totalUsers :
                                    tab === 'trading' ? tradingUsers :
                                        tab === 'business' ? businessUsers : salesUsers}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="admin-search-wrap">
                    <Search size={15} />
                    <input
                        className="admin-search"
                        placeholder="Search by name or email…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* ── Error ── */}
            {error && (
                <div className="admin-error glass-panel animate-fade-in">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                    {error.includes('Service key') || error.includes('service') ? (
                        <span style={{ opacity: 0.6, fontSize: '0.8rem' }}>
                            → Add SUPABASE_SERVICE_KEY to .env.local and restart the dev server.
                        </span>
                    ) : null}
                </div>
            )}

            {/* ── User Table ── */}
            <div className="admin-table-wrap glass-panel animate-fade-in">
                {loading ? (
                    <div className="admin-loading">
                        <RefreshCw size={24} className="spin" />
                        <span>Loading users…</span>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="admin-empty">
                        <User2 size={40} style={{ opacity: 0.3 }} />
                        <p>No users found{search ? ` for "${search}"` : ''}.</p>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Divisions</th>
                                <th>Trading Account</th>
                                <th>Joined</th>
                                <th>Last Active</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(user => {
                                const isExpanded = expandedUser === user.id;
                                const userDivs = user.divisions.map(d => d.toLowerCase());

                                return (
                                    <React.Fragment key={user.id}>
                                        <tr
                                            className={`admin-row ${isExpanded ? 'expanded' : ''}`}
                                            onClick={() => handleExpand(user.id)}
                                        >
                                            {/* User column */}
                                            <td>
                                                <div className="admin-user-cell">
                                                    <div className="admin-avatar">
                                                        {user.fullName.charAt(0).toUpperCase() || '?'}
                                                        {user.isAdmin && (
                                                            <Crown size={10} className="admin-crown" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="admin-user-name">{user.fullName}</div>
                                                        <div className="admin-user-email">{user.email}</div>
                                                    </div>
                                                    <ChevronRight
                                                        size={14}
                                                        className={`admin-row-chevron ${isExpanded ? 'rotated' : ''}`}
                                                    />
                                                </div>
                                            </td>

                                            {/* Divisions column */}
                                            <td>
                                                <div className="admin-divisions-cell">
                                                    <DivisionBadge division="trading" active={userDivs.includes('trading')} />
                                                    <DivisionBadge division="business" active={userDivs.includes('business')} />
                                                    <DivisionBadge division="sales" active={userDivs.includes('sales')} />
                                                </div>
                                            </td>

                                            {/* Trading account */}
                                            <td>
                                                {user.tradingAccountConnected ? (
                                                    <div className="admin-balance-cell">
                                                        <div className="admin-platform-chip">
                                                            {user.tradingProvider?.toUpperCase() || 'LIVE'}
                                                        </div>
                                                        <span className="admin-balance-val">
                                                            ${user.tradingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                        </span>
                                                        <button
                                                            className={`admin-balance-refresh-btn ${refreshing[user.id] ? 'spin' : ''}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                refreshBalance(user);
                                                            }}
                                                            title="Refresh balance"
                                                        >
                                                            <RefreshCw size={12} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="admin-no-account">
                                                        <XCircle size={14} style={{ color: '#6b7280' }} />
                                                        <span>Not connected</span>
                                                    </div>
                                                )}
                                            </td>

                                            {/* Joined */}
                                            <td className="admin-date-cell">
                                                <Clock size={12} style={{ opacity: 0.4 }} />
                                                {formatDate(user.createdAt)}
                                            </td>

                                            {/* Last Sign In */}
                                            <td className="admin-date-cell">
                                                <Activity size={12} style={{ opacity: 0.4 }} />
                                                {formatDate(user.lastSignIn)}
                                            </td>

                                            {/* Actions */}
                                            <td onClick={e => e.stopPropagation()}>
                                                <button
                                                    className="admin-manage-btn"
                                                    onClick={() => openModal(user)}
                                                    title="Manage access"
                                                >
                                                    <Settings2 size={15} />
                                                    Manage
                                                </button>
                                            </td>
                                        </tr>

                                        {/* ── Expandable Analytics Row ── */}
                                        {isExpanded && (
                                            <tr className="admin-expanded-row">
                                                <td colSpan={6}>
                                                    <div className="admin-analytics-panel">
                                                        <h4 className="admin-analytics-title">
                                                            <Activity size={15} /> User Analytics — {user.fullName}
                                                        </h4>

                                                        <div className="admin-analytics-grid">
                                                            {/* User Trading Performance */}
                                                            <div className="admin-analytics-card chart-card">
                                                                <div className="aac-label"><TrendingUp size={13} /> Performance Growth</div>
                                                                {user.analyticsData ? (
                                                                    <div className="admin-chart-area">
                                                                        <GrowthChart data={user.analyticsData.growth} />
                                                                        <div className="chart-stats-row">
                                                                            <div className="cs-item">
                                                                                <span>Win Rate</span>
                                                                                <strong style={{ color: user.analyticsData.winRate >= 50 ? '#10b981' : '#ef4444' }}>
                                                                                    {user.analyticsData.winRate.toFixed(1)}%
                                                                                </strong>
                                                                            </div>
                                                                            <div className="cs-item">
                                                                                <span>Total P&L</span>
                                                                                <strong style={{ color: user.analyticsData.totalPnl >= 0 ? '#10b981' : '#ef4444' }}>
                                                                                    ${user.analyticsData.totalPnl.toLocaleString()}
                                                                                </strong>
                                                                            </div>
                                                                            <div className="cs-item">
                                                                                <span>Trades</span>
                                                                                <strong>{user.analyticsData.totalTrades}</strong>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ) : user.tradingAccountConnected ? (
                                                                    <div className="admin-analytics-loading">
                                                                        <RefreshCw size={18} className="spin" />
                                                                        <span>Fetching deep analytics…</span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="admin-no-data">Account not connected</div>
                                                                )}
                                                            </div>

                                                            {/* Recent Trades List */}
                                                            <div className="admin-analytics-card history-card">
                                                                <div className="aac-label"><Clock size={13} /> Most Recent Trades</div>
                                                                {user.analyticsData?.recentTrades && user.analyticsData.recentTrades.length > 0 ? (
                                                                    <div className="admin-recent-trades">
                                                                        {user.analyticsData.recentTrades.map((t: any, i: number) => (
                                                                            <div key={i} className="trade-item">
                                                                                <div className="trade-info">
                                                                                    <span className="trade-symbol">{t.symbol || 'USDJPY'}</span>
                                                                                    <span className={`trade-type ${t.side?.toLowerCase()}`}>{t.side}</span>
                                                                                </div>
                                                                                <div className={`trade-pnl ${parseFloat(t.pnl || 0) >= 0 ? 'plus' : 'minus'}`}>
                                                                                    {parseFloat(t.pnl || 0) >= 0 ? '+' : ''}${Math.abs(parseFloat(t.pnl || 0)).toFixed(2)}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <div className="admin-no-data">No history available</div>
                                                                )}
                                                            </div>

                                                            {/* User Identity */}
                                                            <div className="admin-analytics-card identity-card">
                                                                <div className="aac-label"><User2 size={13} /> Identity</div>
                                                                <div className="aac-row"><span>Email</span><strong>{user.email}</strong></div>
                                                                <div className="aac-row"><span>User ID</span><code>{user.id.slice(0, 12)}…</code></div>
                                                                <div className="aac-row"><span>Role</span><strong>{user.isAdmin ? '🛡 Admin' : '👤 Member'}</strong></div>
                                                            </div>

                                                            {/* Account Status Card */}
                                                            <div className="admin-analytics-card status-card">
                                                                <div className="aac-label"><Wallet size={13} /> Account Status</div>
                                                                <div className="aac-row">
                                                                    <span>Status</span>
                                                                    <strong style={{ color: user.tradingAccountConnected ? '#10b981' : '#6b7280' }}>
                                                                        {user.tradingAccountConnected ? 'Connected' : 'Disconnected'}
                                                                    </strong>
                                                                </div>
                                                                {user.tradingAccountConnected && (
                                                                    <>
                                                                        <div className="aac-row"><span>Provider</span><strong>{user.tradingProvider}</strong></div>
                                                                        <div className="aac-row"><span>Balance</span><strong>${user.tradingBalance.toLocaleString()}</strong></div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ── Division Management Modal ── */}
            {modalUser && (
                <div className="admin-modal-overlay" onClick={closeModal}>
                    <div className="admin-modal glass-panel" onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className="admin-modal-header">
                            <div>
                                <h3 className="admin-modal-title">Manage Division Access</h3>
                                <p className="admin-modal-subtitle">{modalUser.fullName} · {modalUser.email}</p>
                            </div>
                            <button className="admin-modal-close" onClick={closeModal}>
                                <X size={18} />
                            </button>
                        </div>

                        {/* Division toggles */}
                        <div className="admin-modal-body">
                            {(['trading', 'business', 'sales'] as DivisionName[]).map(div => {
                                const cfg = DIVISION_CONFIG[div];
                                const enabled = pendingDivisions.has(div);

                                return (
                                    <div
                                        key={div}
                                        className={`admin-division-toggle ${enabled ? 'enabled' : ''}`}
                                        style={{ '--div-color': cfg.color } as React.CSSProperties}
                                        onClick={() => toggleDivision(div)}
                                    >
                                        <div className="adt-icon" style={{ color: cfg.color }}>{cfg.icon}</div>
                                        <div className="adt-info">
                                            <strong>{cfg.label} Division</strong>
                                            <span>{enabled ? 'Access granted' : 'No access'}</span>
                                        </div>
                                        <div className={`adt-switch ${enabled ? 'on' : ''}`}>
                                            <div className="adt-thumb" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="admin-modal-footer">
                            {saveMsg && (
                                <span className={`admin-save-msg ${saveMsg.startsWith('Error') ? 'error' : 'success'}`}>
                                    {saveMsg.startsWith('Error') ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                                    {saveMsg}
                                </span>
                            )}
                            <button className="admin-cancel-btn" onClick={closeModal} disabled={saving}>
                                Cancel
                            </button>
                            <button className="admin-save-btn" onClick={saveDivisions} disabled={saving}>
                                {saving ? <RefreshCw size={14} className="spin" /> : <CheckCircle2 size={14} />}
                                {saving ? 'Saving…' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
