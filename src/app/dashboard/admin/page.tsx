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
                                            onClick={() => setExpandedUser(isExpanded ? null : user.id)}
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
                                                        <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                                                        <span style={{ color: '#10b981', fontWeight: 600 }}>
                                                            ${user.tradingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                        </span>
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
                                                            {/* Identity */}
                                                            <div className="admin-analytics-card">
                                                                <div className="aac-label"><User2 size={13} /> Identity</div>
                                                                <div className="aac-row"><span>Email</span><strong>{user.email}</strong></div>
                                                                <div className="aac-row"><span>User ID</span><code>{user.id.slice(0, 12)}…</code></div>
                                                                <div className="aac-row"><span>Role</span><strong>{user.isAdmin ? '🛡 Admin' : '👤 Member'}</strong></div>
                                                            </div>

                                                            {/* Division Access */}
                                                            <div className="admin-analytics-card">
                                                                <div className="aac-label"><Shield size={13} /> Division Access</div>
                                                                {(['trading', 'business', 'sales'] as DivisionName[]).map(div => (
                                                                    <div key={div} className="aac-row">
                                                                        <span style={{ textTransform: 'capitalize' }}>{div}</span>
                                                                        {userDivs.includes(div) ? (
                                                                            <strong style={{ color: DIVISION_CONFIG[div].color }}>✓ Granted</strong>
                                                                        ) : (
                                                                            <span style={{ color: '#6b7280' }}>✗ No access</span>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            {/* Trading Account */}
                                                            <div className="admin-analytics-card">
                                                                <div className="aac-label"><Wallet size={13} /> Trading Account</div>
                                                                <div className="aac-row">
                                                                    <span>Status</span>
                                                                    <strong style={{ color: user.tradingAccountConnected ? '#10b981' : '#6b7280' }}>
                                                                        {user.tradingAccountConnected ? 'Connected' : 'Not connected'}
                                                                    </strong>
                                                                </div>
                                                                {user.tradingAccountConnected && (
                                                                    <div className="aac-row">
                                                                        <span>Balance</span>
                                                                        <strong style={{ color: '#10b981' }}>
                                                                            ${user.tradingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                                        </strong>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Activity */}
                                                            <div className="admin-analytics-card">
                                                                <div className="aac-label"><Clock size={13} /> Activity</div>
                                                                <div className="aac-row"><span>Joined</span><strong>{formatDate(user.createdAt)}</strong></div>
                                                                <div className="aac-row"><span>Last sign-in</span><strong>{formatDate(user.lastSignIn)}</strong></div>
                                                                <div className="aac-row">
                                                                    <span>Divisions held</span>
                                                                    <strong>{user.divisions.length} / 3</strong>
                                                                </div>
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
