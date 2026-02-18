"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import {
    Home,
    DollarSign,
    Briefcase,
    TrendingUp,
    Users,
    Shield,
    Trophy,
    CheckCircle,
    ArrowRight,
    Zap,
    Layout,
    Target,
    Heart,
    MessageCircle,
    Share2,
    MoreHorizontal,
    TrendingUp as TrendingUpIcon,
    Image as ImageIcon,
    Send,
    Smile,
    Wallet
} from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import '@/styles/pages/Dashboard.css';
import '@/styles/pages/CommunityNewsfeed.css';
import '@/styles/pages/CommunityNewsfeed.css';
import { api, ApiPost, ApiUser } from '@/services/api';
import { useEffect } from 'react';
const QUICK_NAV = [
    { label: 'Trading', icon: <DollarSign size={20} />, path: '/dashboard/trading', color: 'var(--fintech-green)' },
    { label: 'Business', icon: <Briefcase size={20} />, path: '/dashboard/business', color: 'var(--accent)' },
    { label: 'Sales', icon: <TrendingUp size={20} />, path: '/dashboard/sales', color: '#ff3b30' },
    { label: 'Account', icon: <Wallet size={20} />, path: '/dashboard/account', color: '#ec5b13' }
];

const ONBOARDING_STEPS = [
    { id: '01', title: 'Initialization', desc: 'Secure Free Initial Access.', status: 'completed' },
    { id: '02', title: 'Formation', desc: 'LLC & EIN Setup Blueprints.', status: 'active' },
    { id: '03', title: 'Protection', desc: 'Secure $99/mo Business Insurance.', status: 'pending' },
    { id: '04', title: 'Growth', desc: 'Deploy Finance or Sales Division.', status: 'pending' }
];

// MOCK_LEADERBOARD removed


// Mock data removed in favor of API


import { useUser } from '@/context/UserContext';

export default function DashboardPage() {
    const { profile, loading: authLoading } = useUser();
    const [activeTab, setActiveTab] = useState('ALL');
    const [newPostContent, setNewPostContent] = useState('');
    const [showPostComposer, setShowPostComposer] = useState(false);
    const [showTradeComposer, setShowTradeComposer] = useState(false);
    const [posts, setPosts] = useState<any[]>([]);

    // Fetch posts from API
    useEffect(() => {
        const fetchPosts = async () => {
            const apiPosts = await api.getFeedPosts();
            const mappedPosts = apiPosts.map((post: ApiPost) => {
                const meta = post.meta_data ? JSON.parse(post.meta_data) : {};
                return {
                    id: post.id,
                    type: post.type,
                    user: {
                        name: post.user.username,
                        avatar: post.user.avatar_url || '👤',
                        occupation: 'Member',
                        rank: post.user.rank
                    },
                    timestamp: new Date(post.created_at).toLocaleString(),
                    content: post.content,
                    achievement: post.type === 'rank_achievement' ? meta : undefined,
                    likes: post.likes_count || 0,
                    comments: post.comments_count || 0,
                    shares: 0,
                    // Map other types if needed (tradeDetails etc) - for now just rank supported by backend
                    tradeDetails: meta.tradeDetails,
                    milestone: meta.milestone,
                    image: meta.image
                };
            });
            setPosts(mappedPosts);
        };

        fetchPosts();

        // Polling every 10 seconds
        const interval = setInterval(fetchPosts, 10000);
        return () => clearInterval(interval);
    }, []);

    const [tradeData, setTradeData] = useState({
        pair: '',
        profit: '',
        riskReward: '',
        direction: 'LONG'
    });

    const userDisplayName = profile ? `${profile.firstName} ${profile.lastName}` : "Your Name";

    const handleShareTrade = () => {
        // Create new trade post
        const newPost = {
            id: posts.length + 1,
            type: 'trade_win' as const,
            user: {
                name: userDisplayName,
                avatar: '👤',
                occupation: 'Professional Trader',
                rank: 'Manager'
            },
            timestamp: 'Just now',
            content: newPostContent || `Closed a ${tradeData.direction} trade on ${tradeData.pair}! ${tradeData.profit ? `+$${tradeData.profit} profit` : ''} ${tradeData.riskReward ? `with ${tradeData.riskReward} R:R` : ''} using the Verstige System. 📊`,
            tradeDetails: {
                pair: tradeData.pair,
                profit: `$${tradeData.profit}`,
                winRate: tradeData.riskReward
            },
            image: null,
            likes: 0,
            comments: 0,
            shares: 0
        };

        // Add to beginning of posts array
        setPosts([newPost, ...posts]);

        // Close modal and reset form
        setShowTradeComposer(false);
        setTradeData({ pair: '', profit: '', riskReward: '', direction: 'LONG' });
        setNewPostContent('');
    };

    const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
    const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const data = await api.getLeaderboard(activeTab);
            const mapped = data.map((u: ApiUser, idx: number) => {
                const sales = u.sales_revenue || 0;
                const trading = u.trading_yield || 0;
                const total = sales + trading;

                let roles = [];
                try {
                    roles = JSON.parse(u.roles || "[]");
                } catch (e) {
                    roles = ["Member"];
                }

                return {
                    rank: idx + 1,
                    name: u.username,
                    sales: `$${sales.toLocaleString()}`,
                    trading: `$${trading.toLocaleString()}`,
                    total: `$${total.toLocaleString()}`,
                    roles: roles,
                    trend: u.trend || "+0%"
                };
            });
            setLeaderboardData(mapped);
        };
        fetchLeaderboard();

        // Poll leaderboard every 30 seconds
        const interval = setInterval(fetchLeaderboard, 30000);
        return () => clearInterval(interval);
    }, [activeTab]);

    const handleLike = async (post: any) => {
        const uid = localStorage.getItem('v2_user_id');
        if (!uid) return;
        try {
            const res = await api.likePost(post.id, uid);
            if (res.status === 'success') {
                setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes: res.likes_count } : p));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleCommentSubmit = async (postId: string) => {
        const uid = localStorage.getItem('v2_user_id');
        if (!uid || !commentText.trim()) return;
        try {
            const res = await api.commentPost(postId, uid, commentText);
            if (res.status === 'success') {
                setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: res.comments_count } : p));
                setActiveCommentPostId(null);
                setCommentText('');
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const data = await api.getLeaderboard(activeTab);
            const mapped = data.map((u: ApiUser, idx: number) => {
                const sales = u.sales_revenue || 0;
                const trading = u.trading_yield || 0;
                const total = sales + trading;

                let roles = [];
                try {
                    roles = JSON.parse(u.roles || "[]");
                } catch (e) {
                    roles = ["Member"];
                }

                return {
                    rank: idx + 1,
                    name: u.username,
                    sales: `$${sales.toLocaleString()}`,
                    trading: `$${trading.toLocaleString()}`,
                    total: `$${total.toLocaleString()}`,
                    roles: roles,
                    trend: u.trend || "+0%"
                };
            });
            setLeaderboardData(mapped);
        };
        fetchLeaderboard();

        // Poll leaderboard every 30 seconds
        const interval = setInterval(fetchLeaderboard, 30000);
        return () => clearInterval(interval);
    }, [activeTab]);


    return (
        <div className="dash-overview animate-fade-in">
            <DashboardHeader
                title="Community"
                subtitle="Connect • Share • Grow Together"
            />

            {/* Quick Navigation Buttons */}
            <div className="quick-nav-grid">
                {QUICK_NAV.map(nav => (
                    <Link key={nav.path} href={nav.path} className="nav-btn">
                        <div className="icon-box" style={{ color: nav.color, backgroundColor: `${nav.color}15` }}>
                            {nav.icon}
                        </div>
                        <span>{nav.label}</span>
                    </Link>
                ))}
                <Link href="/dashboard/profile" className="nav-btn">
                    <div className="icon-box" style={{ color: 'var(--secondary)', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                        <Layout size={20} />
                    </div>
                    <span>Profile</span>
                </Link>
            </div>

            {/* Onboarding Process Tracker */}
            <section className="onboarding-tracker">
                <div className="tracker-header">
                    <div className="tracker-title">
                        <h3>Onboarding Protocol</h3>
                        <p className="text-secondary text-sm">Deployment Progress: Phase 02 Initializing</p>
                    </div>
                    <div className="progress-pct font-mono text-accent">25%</div>
                </div>

                <div className="onboarding-steps">
                    {ONBOARDING_STEPS.map(step => (
                        <div key={step.id} className={`ob-step ${step.status}`}>
                            <span className="step-indicator">STEP {step.id}</span>
                            <h4>
                                {step.status === 'completed' && <CheckCircle size={14} className="text-green-500 inline mr-1" />}
                                {step.title}
                            </h4>
                            <p>{step.desc}</p>
                            {step.status === 'active' && <div className="active-pulse"></div>}
                        </div>
                    ))}
                </div>
            </section>

            {/* Social Newsfeed */}
            <section className="community-newsfeed">
                <div className="newsfeed-layout">
                    {/* Main Feed */}
                    <div className="feed-main">
                        {/* Post Composer */}
                        <div className="post-composer glass-panel">
                            <div className="composer-header">
                                <div className="user-avatar">👤</div>
                                <input
                                    type="text"
                                    placeholder="Share your wins, trades, or success stories..."
                                    className="composer-input"
                                    onClick={() => setShowPostComposer(true)}
                                    readOnly
                                />
                            </div>
                            {showPostComposer && (
                                <div className="composer-expanded">
                                    <textarea
                                        className="composer-textarea"
                                        placeholder="What's on your mind?"
                                        value={newPostContent}
                                        onChange={(e) => setNewPostContent(e.target.value)}
                                        rows={4}
                                    />
                                    <div className="composer-actions">
                                        <div className="composer-tools">
                                            <button className="tool-btn"><ImageIcon size={20} /> Photo</button>
                                            <button className="tool-btn" onClick={() => {
                                                setShowPostComposer(false);
                                                setShowTradeComposer(true);
                                            }}>
                                                <TrendingUpIcon size={20} /> Trade
                                            </button>
                                        </div>
                                        <div className="composer-buttons">
                                            <button className="btn-cancel" onClick={() => setShowPostComposer(false)}>Cancel</button>
                                            <button className="btn-post"><Send size={16} /> Post</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Feed Items */}
                        <div className="feed-items">
                            {posts.map(post => (
                                <div key={post.id} className="feed-post glass-panel">
                                    {/* Post Header */}
                                    <div className="post-header">
                                        <div className="post-user-info">
                                            <div className="user-avatar-large">{post.user.avatar}</div>
                                            <div className="user-details">
                                                <div className="user-name-row">
                                                    <span className="user-name">{post.user.name}</span>
                                                    <span className="user-rank-badge">{post.user.rank}</span>
                                                </div>
                                                <div className="user-meta">
                                                    <span className="user-occupation">{post.user.occupation}</span>
                                                    <span className="post-timestamp">• {post.timestamp}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="post-menu-btn"><MoreHorizontal size={20} /></button>
                                    </div>

                                    {/* Post Content */}
                                    <div className="post-content">
                                        <p className="post-text">{post.content}</p>

                                        {/* Rank Achievement Card */}
                                        {post.type === 'rank_achievement' && post.achievement && (
                                            <div className="achievement-card">
                                                <div className="achievement-icon">
                                                    <Trophy size={32} style={{ color: post.achievement.color }} />
                                                </div>
                                                <div className="achievement-details">
                                                    <span className="achievement-label">Rank Advancement</span>
                                                    <div className="achievement-progression">
                                                        <span className="rank-from">{post.achievement.from}</span>
                                                        <ArrowRight size={16} className="rank-arrow" />
                                                        <span className="rank-to" style={{ color: post.achievement.color }}>{post.achievement.to}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Trade Win Card */}
                                        {post.type === 'trade_win' && post.tradeDetails && (
                                            <div className="trade-card">
                                                <div className="trade-stats">
                                                    <div className="trade-stat">
                                                        <span className="stat-label">Pair</span>
                                                        <span className="stat-value">{post.tradeDetails.pair}</span>
                                                    </div>
                                                    <div className="trade-stat">
                                                        <span className="stat-label">Profit</span>
                                                        <span className="stat-value profit">{post.tradeDetails.profit}</span>
                                                    </div>
                                                    <div className="trade-stat">
                                                        <span className="stat-label">Win Rate</span>
                                                        <span className="stat-value">{post.tradeDetails.winRate}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Sales Milestone Card */}
                                        {post.type === 'sales_milestone' && post.milestone && (
                                            <div className="milestone-card">
                                                <div className="milestone-progress">
                                                    <div className="progress-header">
                                                        <span className="progress-label">Monthly Target</span>
                                                        <span className="progress-percentage">{post.milestone.percentage}%</span>
                                                    </div>
                                                    <div className="progress-bar">
                                                        <div className="progress-fill" style={{ width: `${Math.min(post.milestone.percentage, 100)}%` }}></div>
                                                    </div>
                                                    <div className="progress-values">
                                                        <span className="value-current">{post.milestone.amount}</span>
                                                        <span className="value-target">of {post.milestone.target}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Success Story Image */}
                                        {post.type === 'success_story' && post.image && (
                                            <div className="post-image">
                                                <div className="image-placeholder">{post.image}</div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Post Engagement Stats */}
                                    <div className="post-stats">
                                        <span className="stat-item">{post.likes} likes</span>
                                        <span className="stat-item">{post.comments} comments</span>
                                        <span className="stat-item">{post.shares} shares</span>
                                    </div>

                                    {/* Post Actions */}
                                    <div className="post-actions">
                                        <button className="action-btn" onClick={() => handleLike(post)}>
                                            <Heart size={20} className={post.likes > 0 ? "text-red-500 fill-current" : ""} />
                                            <span>{post.likes > 0 ? post.likes : 'Like'}</span>
                                        </button>
                                        <button className="action-btn" onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}>
                                            <MessageCircle size={20} />
                                            <span>{post.comments > 0 ? post.comments : 'Comment'}</span>
                                        </button>
                                        <button className="action-btn">
                                            <Share2 size={20} />
                                            <span>Share</span>
                                        </button>
                                    </div>

                                    {/* Comment Input */}
                                    {activeCommentPostId === post.id && (
                                        <div className="comment-input-area p-4 border-t border-white/5">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    className="composer-input flex-1"
                                                    placeholder="Write a comment..."
                                                    value={commentText}
                                                    onChange={(e) => setCommentText(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                                                    autoFocus
                                                />
                                                <button className="btn-post p-2" onClick={() => handleCommentSubmit(post.id)}>
                                                    <Send size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="feed-sidebar">
                        {/* Quick Stats */}
                        <div className="sidebar-widget glass-panel">
                            <h4 className="widget-title">Your Impact</h4>
                            <div className="impact-stats">
                                <div className="impact-item">
                                    <span className="impact-label">Total Posts</span>
                                    <span className="impact-value">24</span>
                                </div>
                                <div className="impact-item">
                                    <span className="impact-label">Engagement</span>
                                    <span className="impact-value">1.2K</span>
                                </div>
                                <div className="impact-item">
                                    <span className="impact-label">Followers</span>
                                    <span className="impact-value">342</span>
                                </div>
                            </div>
                        </div>

                        {/* Trending Topics */}
                        <div className="sidebar-widget glass-panel">
                            <h4 className="widget-title">Trending Now</h4>
                            <div className="trending-list">
                                <div className="trending-item">
                                    <span className="trending-tag">#TradingWins</span>
                                    <span className="trending-count">156 posts</span>
                                </div>
                                <div className="trending-item">
                                    <span className="trending-tag">#RankAdvancement</span>
                                    <span className="trending-count">89 posts</span>
                                </div>
                                <div className="trending-item">
                                    <span className="trending-tag">#SalesSuccess</span>
                                    <span className="trending-count">124 posts</span>
                                </div>
                                <div className="trending-item">
                                    <span className="trending-tag">#SuccessStories</span>
                                    <span className="trending-count">67 posts</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Analytical Leaderboard */}
            <section className="advanced-leaderboard glass-panel p-8">
                <div className="leaderboard-header mb-6">
                    <div className="header-content">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="trophy-icon-wrapper">
                                <Trophy size={28} className="text-accent" />
                            </div>
                            <div>
                                <h2 className="leaderboard-title">Visionary Leaderboard</h2>
                                <p className="leaderboard-subtitle">Real-time performance metrics across all active divisions</p>
                            </div>
                        </div>
                    </div>
                    <div className="leaderboard-tabs">
                        {['ALL', 'SALES', 'TRADING', 'DUAL'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="analytical-table-wrapper">
                    <table className="analytical-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Visionary</th>
                                <th>Sales Revenue</th>
                                <th>Trading Yield</th>
                                <th>Total Impact</th>
                                <th>Trend</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboardData.map(user => (
                                <tr key={user.name}>
                                    <td>
                                        <div className={`rank-badge rank-top-${user.rank}`}>
                                            {user.rank}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="user-cell">
                                            <span className="font-bold">{user.name}</span>
                                            <div className="flex gap-2">
                                                {user.roles.includes('Sales') && <span className="division-tag sales">SALES</span>}
                                                {user.roles.includes('Trading') && <span className="division-tag trading">TRADING</span>}
                                                {user.roles.length > 1 && <span className="division-tag dual">DOUBLE</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="amount-text">{user.sales}</span></td>
                                    <td><span className="amount-text">{user.trading}</span></td>
                                    <td><span className="amount-text text-accent font-bold">{user.total}</span></td>
                                    <td><span className="pos font-bold">{user.trend}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* System Insights - Full Width */}
            <div className="mt-6">
                <div className="glass-panel p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="log-icon-wrapper">
                            <Zap size={24} className="text-yellow-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Live Ecosystem Logs</h3>
                            <p className="text-secondary text-sm">Real-time activity across the Verstige network</p>
                        </div>
                    </div>
                    <div className="ecosystem-logs">
                        <div className="log-entry">
                            <div className="log-content">
                                <span className="log-icon">💰</span>
                                <span className="log-text">Julylan J. generated $420 commission</span>
                            </div>
                            <span className="log-time">2s ago</span>
                        </div>
                        <div className="log-entry">
                            <div className="log-content">
                                <span className="log-icon">🛡️</span>
                                <span className="log-text">Risk protocol scanned Sales Division</span>
                            </div>
                            <span className="log-time">1m ago</span>
                        </div>
                        <div className="log-entry">
                            <div className="log-content">
                                <span className="log-icon">👤</span>
                                <span className="log-text">New visionary entered Phase 01</span>
                            </div>
                            <span className="log-time">3m ago</span>
                        </div>
                        <div className="log-entry">
                            <div className="log-content">
                                <span className="log-icon">📊</span>
                                <span className="log-text">Trading algorithm executed 12 positions</span>
                            </div>
                            <span className="log-time">5m ago</span>
                        </div>
                        <div className="log-entry">
                            <div className="log-content">
                                <span className="log-icon">🎯</span>
                                <span className="log-text">Business formation completed for Marcus G.</span>
                            </div>
                            <span className="log-time">8m ago</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trade Composer Modal */}
            {showTradeComposer && (
                <div className="trade-composer-modal">
                    <div className="modal-overlay" onClick={() => setShowTradeComposer(false)}></div>
                    <div className="modal-content trade-modal">
                        <div className="modal-header">
                            <div className="header-icon">
                                <TrendingUpIcon size={28} className="text-green-400" />
                            </div>
                            <div>
                                <h2 className="modal-title">Share Your Trade Win</h2>
                                <p className="modal-subtitle">Showcase your trading success with the community</p>
                            </div>
                            <button className="modal-close" onClick={() => setShowTradeComposer(false)}>✕</button>
                        </div>

                        <div className="modal-body">
                            {/* Trade Form */}
                            <div className="trade-form">
                                <div className="form-section">
                                    <label className="form-label">Trading Pair</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g., XAUUSD, EURUSD, BTCUSD"
                                        value={tradeData.pair}
                                        onChange={(e) => setTradeData({ ...tradeData, pair: e.target.value.toUpperCase() })}
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-section">
                                        <label className="form-label">Direction</label>
                                        <div className="direction-toggle">
                                            <button
                                                className={`direction-btn ${tradeData.direction === 'LONG' ? 'active long' : ''}`}
                                                onClick={() => setTradeData({ ...tradeData, direction: 'LONG' })}
                                            >
                                                LONG
                                            </button>
                                            <button
                                                className={`direction-btn ${tradeData.direction === 'SHORT' ? 'active short' : ''}`}
                                                onClick={() => setTradeData({ ...tradeData, direction: 'SHORT' })}
                                            >
                                                SHORT
                                            </button>
                                        </div>
                                    </div>

                                    <div className="form-section">
                                        <label className="form-label">Profit</label>
                                        <div className="input-with-prefix">
                                            <span className="input-prefix">$</span>
                                            <input
                                                type="text"
                                                className="form-input with-prefix"
                                                placeholder="2,840"
                                                value={tradeData.profit}
                                                onChange={(e) => setTradeData({ ...tradeData, profit: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <label className="form-label">Risk:Reward Ratio</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g., 1:3, 1:5"
                                        value={tradeData.riskReward}
                                        onChange={(e) => setTradeData({ ...tradeData, riskReward: e.target.value })}
                                    />
                                </div>

                                <div className="form-section">
                                    <label className="form-label">Share Your Story (Optional)</label>
                                    <textarea
                                        className="form-textarea"
                                        placeholder="Tell the community about your trade setup, strategy, or what you learned..."
                                        value={newPostContent}
                                        onChange={(e) => setNewPostContent(e.target.value)}
                                        rows={3}
                                    />
                                </div>
                            </div>

                            {/* Live Preview */}
                            {(tradeData.pair || tradeData.profit || tradeData.riskReward) && (
                                <div className="trade-preview">
                                    <h4 className="preview-title">Preview</h4>
                                    <div className="preview-card">
                                        <div className="preview-header">
                                            <div className="preview-user">
                                                <div className="user-avatar-large">👤</div>
                                                <div>
                                                    <div className="user-name">Your Name</div>
                                                    <div className="user-meta">
                                                        <span className="user-occupation">Professional Trader</span>
                                                        <span className="post-timestamp">• Just now</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {newPostContent && (
                                            <p className="preview-text">{newPostContent}</p>
                                        )}

                                        <div className="trade-card">
                                            <div className="trade-card-header">
                                                <div className={`trade-direction-badge ${tradeData.direction.toLowerCase()}`}>
                                                    {tradeData.direction}
                                                </div>
                                                <div className="trade-pair-display">
                                                    {tradeData.pair || 'PAIR'}
                                                </div>
                                            </div>
                                            <div className="trade-stats">
                                                <div className="trade-stat">
                                                    <span className="stat-label">Profit</span>
                                                    <span className="stat-value profit">
                                                        ${tradeData.profit || '0.00'}
                                                    </span>
                                                </div>
                                                <div className="trade-stat">
                                                    <span className="stat-label">Risk:Reward</span>
                                                    <span className="stat-value">
                                                        {tradeData.riskReward || 'N/A'}
                                                    </span>
                                                </div>
                                                <div className="trade-stat">
                                                    <span className="stat-label">Strategy</span>
                                                    <span className="stat-value accent">
                                                        Verstige System
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => {
                                setShowTradeComposer(false);
                                setTradeData({ pair: '', profit: '', riskReward: '', direction: 'LONG' });
                                setNewPostContent('');
                            }}>
                                Cancel
                            </button>
                            <button className="btn-post" onClick={handleShareTrade}>
                                <Send size={16} /> Share Trade
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
