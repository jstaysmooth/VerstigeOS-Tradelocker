import React from 'react';
import Link from 'next/link';
import Hero from '@/components/Hero';
import Divisions from '@/components/Divisions';
import { Rocket, TrendingUp, TrendingDown, DollarSign, Shield, Globe, Users, BarChart3, Layout, FileText, CheckCircle, Zap, Bitcoin, ArrowUpDown } from 'lucide-react';
import StarField from '@/components/StarField';
import Spline from '@splinetool/react-spline/next';
import '@/styles/pages/LandingPage.css';
import '@/styles/pages/PlatformOS.css';
import '@/styles/pages/SalesDivision.css';
import '@/styles/pages/AgencyModel.css';

export default function LandingPage() {
    return (
        <div className="landing-page">
            <Hero />
            <Divisions />

            {/* Trading Division Showcase */}
            <section className="trading-showcase-section">
                <StarField />
                <div className="trading-showcase-container">
                    <div className="section-header text-center mb-16">
                        <div className="goal-badge mx-auto mb-4">
                            <TrendingUp size={16} />
                            <span>TRADING DIVISION</span>
                        </div>
                        <h2 className="text-5xl font-bold mb-4">
                            Trade with <span className="text-gradient">Precision</span>
                        </h2>
                        <p className="text-secondary max-w-3xl mx-auto text-lg">
                            Experience institutional-grade trading infrastructure designed for the modern trader.
                            From signal execution to portfolio analytics, every feature is engineered for speed and clarity.
                        </p>
                    </div>

                    {/* Video with Flanking Features */}
                    <div className="trading-content-layout">
                        {/* Left Features */}
                        <div className="trading-features-left">
                            <div className="trading-feature-card glass-panel animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                                <div className="feature-icon-wrapper swipe-gradient">
                                    <CheckCircle size={32} />
                                </div>
                                <h3>Swipe to Approve</h3>
                                <p>
                                    Revolutionary gesture-based trade execution. Review signal parameters,
                                    risk metrics, and provider analytics—then swipe to approve with confidence.
                                </p>
                                <div className="feature-tags">
                                    <span className="tag">Instant Execution</span>
                                    <span className="tag">Risk Analysis</span>
                                </div>
                            </div>

                            <div className="trading-feature-card glass-panel animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                <div className="feature-icon-wrapper journal-gradient">
                                    <FileText size={32} />
                                </div>
                                <h3>Trade Journal</h3>
                                <p>
                                    Comprehensive performance tracking and analytics. Every trade is logged with
                                    entry/exit data, P&L metrics, and provider attribution.
                                </p>
                                <div className="feature-tags">
                                    <span className="tag">Performance Metrics</span>
                                    <span className="tag">Win Rate Analysis</span>
                                </div>
                            </div>
                        </div>

                        {/* Center Video */}
                        <div className="trading-video-hero">
                            <div className="video-hero-wrapper">
                                <video
                                    className="hero-video"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                >
                                    <source src="/trading planet.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </div>

                        {/* Right Features */}
                        <div className="trading-features-right">
                            <div className="trading-feature-card glass-panel animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                                <div className="feature-icon-wrapper mesh-gradient">
                                    <BarChart3 size={32} />
                                </div>
                                <h3>Signal Network</h3>
                                <p>
                                    Connect to elite signal providers across multiple platforms. Real-time
                                    filtering by asset class, win rate, and risk profile.
                                </p>
                                <div className="feature-tags">
                                    <span className="tag">Multi-Platform</span>
                                    <span className="tag">Elite Providers</span>
                                </div>
                            </div>

                            <div className="trading-feature-card glass-panel animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                                <div className="feature-icon-wrapper analytics-gradient">
                                    <DollarSign size={32} />
                                </div>
                                <h3>Live Capital Tracking</h3>
                                <p>
                                    Real-time portfolio monitoring with WebSocket-powered updates. Track balance,
                                    equity, margin usage, and unrealized P&L across all connected accounts.
                                </p>
                                <div className="feature-tags">
                                    <span className="tag">Real-Time Updates</span>
                                    <span className="tag">Multi-Account</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="trading-stats-bar glass-panel">
                        <div className="stat-item">
                            <div className="stat-value">4+</div>
                            <div className="stat-label">Trading Platforms</div>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <div className="stat-value">Real-Time</div>
                            <div className="stat-label">Signal Execution</div>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <div className="stat-value">24/7</div>
                            <div className="stat-label">Market Monitoring</div>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <div className="stat-value">Elite</div>
                            <div className="stat-label">Provider Network</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Crypto Division Section */}
            <section className="crypto-section">
                {/* Spline 3D Scene as Background */}
                <div className="crypto-spline-bg">
                    <Spline scene="https://prod.spline.design/yDuSQAYgwzxKjokz/scene.splinecode" />
                </div>

                {/* Dark overlay so text stays readable */}
                <div className="crypto-overlay" />

                <div className="crypto-container">
                    {/* Badge */}
                    <div className="section-header text-center mb-16" style={{ position: 'relative', zIndex: 2 }}>
                        <div className="goal-badge mx-auto mb-4">
                            <Bitcoin size={16} />
                            <span>CRYPTO DIVISION</span>
                        </div>
                        <h2 className="text-5xl font-bold mb-6">
                            The Future of <span className="text-gradient">Crypto</span> is <span className="crypto-active-word">Active</span>
                        </h2>
                        <p className="text-secondary max-w-3xl mx-auto text-lg">
                            HODL is a strategy of hope. Real wealth in crypto is built by those who
                            <strong> buy low and sell high</strong> — capitalising on both bullish rallies
                            and bearish corrections through disciplined, signal-driven execution.
                        </p>
                    </div>

                    {/* HODL vs Active Trading Contrast */}
                    <div className="crypto-contrast-grid">
                        {/* HODL Card */}
                        <div className="crypto-contrast-card hodl-card glass-panel">
                            <div className="contrast-header">
                                <div className="contrast-icon hodl-icon">
                                    <span style={{ fontSize: '28px' }}>💤</span>
                                </div>
                                <h3>The HODL Myth</h3>
                                <span className="contrast-badge hodl-badge">Passive &amp; Unprofitable Long-Term</span>
                            </div>
                            <ul className="contrast-list">
                                <li className="contrast-item negative">
                                    <span className="contrast-x">✗</span>
                                    Wait years for potential gains
                                </li>
                                <li className="contrast-item negative">
                                    <span className="contrast-x">✗</span>
                                    Lose 70–90% in bear markets
                                </li>
                                <li className="contrast-item negative">
                                    <span className="contrast-x">✗</span>
                                    No income during downturns
                                </li>
                                <li className="contrast-item negative">
                                    <span className="contrast-x">✗</span>
                                    Emotionally driven decisions
                                </li>
                                <li className="contrast-item negative">
                                    <span className="contrast-x">✗</span>
                                    Zero edge in sideways markets
                                </li>
                            </ul>
                        </div>

                        {/* VS Divider */}
                        <div className="crypto-vs-divider">
                            <div className="vs-line" />
                            <div className="vs-badge">VS</div>
                            <div className="vs-line" />
                        </div>

                        {/* Active Trading Card */}
                        <div className="crypto-contrast-card active-card glass-panel featured">
                            <div className="contrast-header">
                                <div className="contrast-icon active-icon">
                                    <ArrowUpDown size={28} />
                                </div>
                                <h3>Active Signal Trading</h3>
                                <span className="contrast-badge active-badge">Bullish &amp; Bearish Profits</span>
                            </div>
                            <ul className="contrast-list">
                                <li className="contrast-item positive">
                                    <CheckCircle size={16} />
                                    Profit when markets rise
                                </li>
                                <li className="contrast-item positive">
                                    <CheckCircle size={16} />
                                    Profit when markets fall
                                </li>
                                <li className="contrast-item positive">
                                    <CheckCircle size={16} />
                                    Entry at key dip levels
                                </li>
                                <li className="contrast-item positive">
                                    <CheckCircle size={16} />
                                    Exit at defined profit targets
                                </li>
                                <li className="contrast-item positive">
                                    <CheckCircle size={16} />
                                    Signal-driven, emotion-free execution
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Market Direction Cards */}
                    <div className="crypto-markets-grid">
                        <div className="market-card glass-panel animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <div className="market-icon bull-icon">
                                <TrendingUp size={32} />
                            </div>
                            <h3>Bull Markets</h3>
                            <p>
                                When prices are climbing, our signals identify optimal entry points so you ride the move with precision — not panic-buy at the top.
                            </p>
                            <div className="market-tag bull-tag">Buy Low → Sell High</div>
                        </div>

                        <div className="market-card glass-panel animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="market-icon bear-icon">
                                <TrendingDown size={32} />
                            </div>
                            <h3>Bear Markets</h3>
                            <p>
                                Don't wait for a recovery. Short positions and well-timed sells mean bear markets aren't a threat — they're an opportunity to profit on the way down.
                            </p>
                            <div className="market-tag bear-tag">Short the Drop → Profit</div>
                        </div>

                        <div className="market-card glass-panel animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <div className="market-icon twenty-four-icon">
                                <Zap size={32} />
                            </div>
                            <h3>24/7 Markets</h3>
                            <p>
                                Crypto never sleeps — our signal network monitors the market around the clock, surfacing opportunities the moment they form.
                            </p>
                            <div className="market-tag active-tag">Always-On Intelligence</div>
                        </div>
                    </div>

                    {/* Bottom Stats */}
                    <div className="crypto-stats-bar glass-panel">
                        <div className="stat-item">
                            <div className="stat-value crypto-stat">Buy Low</div>
                            <div className="stat-label">Entry Strategy</div>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat-item">
                            <div className="stat-value crypto-stat">Sell High</div>
                            <div className="stat-label">Exit Strategy</div>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat-item">
                            <div className="stat-value">Both</div>
                            <div className="stat-label">Bull &amp; Bear Markets</div>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat-item">
                            <div className="stat-value">24/7</div>
                            <div className="stat-label">Market Coverage</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Path Sections */}
            <div className="goals-container">
                {/* START */}
                <section className="goal-section animate-fade-in">
                    <div className="goal-text">
                        <div className="goal-badge">
                            <Rocket size={16} />
                            <span>PHASE 01</span>
                        </div>
                        <h2>Start for<br /><span className="text-gradient">Free.</span></h2>
                        <p>
                            Eliminate the friction of entry. Get immediate access to the Business Division
                            and learn the essential blueprints for starting your LLC and establishing
                            your foundation with our thorough education and directions.
                        </p>
                        <div className="goal-features">
                            <div className="goal-feature"><span></span> Instant Dashboard Access</div>
                            <div className="goal-feature"><span></span> Business Formation Blueprint</div>
                            <div className="goal-feature"><span></span> Visionary Community Mesh</div>
                        </div>
                    </div>
                    <div className="goal-visual glass-panel">
                        <div className="visual-glow"></div>
                        <Rocket size={120} className="text-white opacity-20" />
                    </div>
                </section>

                {/* GROW */}
                <section className="goal-section reverse animate-fade-in">
                    <div className="goal-text">
                        <div className="goal-badge">
                            <Shield size={16} />
                            <span>PHASE 02</span>
                        </div>
                        <h2>Protect your<br /><span className="text-gradient">Ventures.</span></h2>
                        <p>
                            Once your business is established, secure a business account and purchase
                            comprehensive business insurance for just $99/mo. This essential first expense
                            grants you full institutional legal protection.
                        </p>
                        <div className="goal-features">
                            <div className="goal-feature"><span></span> $99/mo Business Insurance</div>
                            <div className="goal-feature"><span></span> Institutional Account Access</div>
                            <div className="goal-feature"><span></span> Asset Protection Protocols</div>
                        </div>
                    </div>
                    <div className="goal-visual glass-panel">
                        <div className="visual-glow" style={{ background: 'var(--apple-blue)' }}></div>
                        <Shield size={120} className="text-white opacity-20" />
                    </div>
                </section>

                {/* FUND */}
                <section className="goal-section animate-fade-in">
                    <div className="goal-text">
                        <div className="goal-badge">
                            <TrendingUp size={16} />
                            <span>PHASE 03</span>
                        </div>
                        <h2>Scale your<br /><span className="text-gradient">Vision.</span></h2>
                        <p>
                            Choose your path to expansion. Leverage the Trading Division to grow
                            your portfolio and income, or the Sales Division to monetize the
                            referral engine and achieve elite executive ranks.
                        </p>
                        <div className="goal-features">
                            <div className="goal-feature"><span></span> Trading Division Portfolio Growth</div>
                            <div className="goal-feature"><span></span> Sales Division Rank System</div>
                            <div className="goal-feature"><span></span> High-Frequency Overrides</div>
                        </div>
                    </div>
                    <div className="goal-visual glass-panel">
                        <div className="visual-glow" style={{ background: 'var(--fintech-green)' }}></div>
                        <TrendingUp size={120} className="text-white opacity-20" />
                    </div>
                </section>
            </div>

            {/* Ecosystem Workflow Section */}
            <section className="ecosystem-section">
                <div className="ecosystem-container">
                    <div className="section-header text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Complete Business <span className="text-gradient">Ecosystem</span></h2>
                        <p className="text-secondary max-w-2xl mx-auto">
                            We don't just give you a dashboard; we provide a fully automated environment
                            designed to launch, protect, and monetize your vision from Day 1.
                        </p>
                    </div>

                    <div className="ecosystem-grid">
                        <div className="step-item animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <div className="step-icon"><Globe size={24} /></div>
                            <div className="step-content">
                                <h3>Digital Infrastructure</h3>
                                <p>Instant deployment of your personalized website, CRM system, and marketing tools. No coding required—just immediate professional presence.</p>
                            </div>
                        </div>

                        <div className="step-item animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="step-icon"><FileText size={24} /></div>
                            <div className="step-content">
                                <h3>Free Business Education</h3>
                                <p>Gain immediate access to blueprints for establishing your LLC and EIN. We provide the thorough directions and education required to build your foundation at no cost.</p>
                            </div>
                        </div>

                        <div className="step-item animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <div className="step-icon"><Shield size={24} /></div>
                            <div className="step-content">
                                <h3>$99/mo Protection Protocol</h3>
                                <p>Secure professional business insurance as your first essential expense. Shield your assets while unlocking the ability to monetize these same services for others.</p>
                            </div>
                        </div>

                        <div className="step-item animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                            <div className="step-icon"><Users size={24} /></div>
                            <div className="step-content">
                                <h3>Duplication System</h3>
                                <p>A simple, proven framework to show others how to replicate your success. Build a self-sustaining organization of protected business owners.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Inside the OS - Platform Breakdown */}
            <section className="platform-os-section">
                <div className="os-container">
                    <div className="section-header text-center mb-20">
                        <div className="goal-badge mx-auto mb-4">
                            <Layout size={16} />
                            <span>PLATFORM ACCESS</span>
                        </div>
                        <h2 className="text-5xl font-bold mb-4">
                            Inside the <span className="text-gradient">OS</span>
                        </h2>
                        <p className="text-secondary max-w-3xl mx-auto text-lg">
                            A comprehensive breakdown of every tool, division, and system you gain access to.
                            This isn't just software—it's your complete business operating system.
                        </p>
                    </div>

                    {/* Main Platform Grid */}
                    <div className="os-main-grid">
                        {/* Business Division */}
                        <div className="os-division-card glass-panel animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <div className="division-header">
                                <div className="division-icon business-gradient">
                                    <Shield size={32} />
                                </div>
                                <div>
                                    <h3>Business Division</h3>
                                    <p className="division-subtitle">Foundation & Protection</p>
                                </div>
                            </div>
                            <div className="division-features">
                                <div className="feature-item">
                                    <CheckCircle size={16} />
                                    <span>LLC Formation Blueprints</span>
                                </div>
                                <div className="feature-item">
                                    <CheckCircle size={16} />
                                    <span>EIN Application Guidance</span>
                                </div>
                                <div className="feature-item">
                                    <CheckCircle size={16} />
                                    <span>Business Insurance ($99/mo)</span>
                                </div>
                                <div className="feature-item">
                                    <CheckCircle size={16} />
                                    <span>Legal Compliance Protocols</span>
                                </div>
                                <div className="feature-item">
                                    <CheckCircle size={16} />
                                    <span>Asset Protection Strategies</span>
                                </div>
                            </div>
                        </div>

                        {/* Trading Division */}
                        <div className="os-division-card glass-panel animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="division-header">
                                <div className="division-icon trading-gradient">
                                    <TrendingUp size={32} />
                                </div>
                                <div>
                                    <h3>Trading Division</h3>
                                    <p className="division-subtitle">Signal Execution & Analytics</p>
                                </div>
                            </div>
                            <div className="division-features">
                                <div className="feature-item">
                                    <CheckCircle size={16} />
                                    <span>Signal Network</span>
                                </div>
                                <div className="feature-item">
                                    <CheckCircle size={16} />
                                    <span>Swipe-to-Approve Execution</span>
                                </div>
                                <div className="feature-item">
                                    <CheckCircle size={16} />
                                    <span>Live Capital Tracking</span>
                                </div>
                                <div className="feature-item">
                                    <CheckCircle size={16} />
                                    <span>Trade Journal & Analytics</span>
                                </div>
                                <div className="feature-item">
                                    <CheckCircle size={16} />
                                    <span>Multi-Platform Integration</span>
                                </div>
                            </div>
                        </div>

                        {/* Sales Division */}
                        <div className="os-division-card glass-panel animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <div className="division-header">
                                <div className="division-icon sales-gradient">
                                    <Users size={32} />
                                </div>
                                <div>
                                    <h3>Sales Division</h3>
                                    <p className="division-subtitle">Team Building & Commissions</p>
                                </div>
                            </div>
                            <div className="division-features">
                                <div className="feature-item">
                                    <CheckCircle size={16} />
                                    <span>Organization Genealogy System</span>
                                </div>
                                <div className="feature-item">
                                    <CheckCircle size={16} />
                                    <span>Career Rank Simulator</span>
                                </div>
                                <div className="feature-item">
                                    <CheckCircle size={16} />
                                    <span>Commission Intelligence</span>
                                </div>
                                <div className="feature-item">
                                    <CheckCircle size={16} />
                                    <span>Pipeline Management CRM</span>
                                </div>
                                <div className="feature-item">
                                    <CheckCircle size={16} />
                                    <span>Drag-and-Drop Placement</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Core Platform Tools */}
                    <div className="os-tools-section">
                        <h3 className="tools-title">Core Platform Tools</h3>
                        <div className="os-tools-grid">
                            <div className="tool-card glass-panel animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                                <BarChart3 size={24} className="tool-icon" />
                                <h4>Central Dashboard</h4>
                                <p>Real-time analytics and production tracking</p>
                            </div>
                            <div className="tool-card glass-panel animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                                <Globe size={24} className="tool-icon" />
                                <h4>Personal Website</h4>
                                <p>Instant deployment with custom branding</p>
                            </div>
                            <div className="tool-card glass-panel animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                                <FileText size={24} className="tool-icon" />
                                <h4>Document Vault</h4>
                                <p>Secure storage for all business documents</p>
                            </div>
                            <div className="tool-card glass-panel animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                                <Users size={24} className="tool-icon" />
                                <h4>Team Messenger</h4>
                                <p>Direct communication with your organization</p>
                            </div>
                            <div className="tool-card glass-panel animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                                <Shield size={24} className="tool-icon" />
                                <h4>Compliance Center</h4>
                                <p>Legal protocols and provider access</p>
                            </div>
                            <div className="tool-card glass-panel animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
                                <DollarSign size={24} className="tool-icon" />
                                <h4>Payment Processing</h4>
                                <p>Integrated financial transaction system</p>
                            </div>
                        </div>
                    </div>

                    {/* Platform Stats */}
                    <div className="os-stats-bar glass-panel">
                        <div className="stat-item">
                            <div className="stat-value">3</div>
                            <div className="stat-label">Core Divisions</div>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <div className="stat-value">15+</div>
                            <div className="stat-label">Platform Tools</div>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <div className="stat-value">24/7</div>
                            <div className="stat-label">System Access</div>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <div className="stat-value">∞</div>
                            <div className="stat-label">Lifetime Updates</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sales Division Showcase */}
            <section className="sales-division-section">
                <div className="sales-container">
                    <div className="section-header text-center mb-20">
                        <div className="goal-badge mx-auto mb-4">
                            <Users size={16} />
                            <span>SALES DIVISION</span>
                        </div>
                        <h2 className="text-5xl font-bold mb-4">
                            Build Your <span className="text-gradient">Empire</span>
                        </h2>
                        <p className="text-secondary max-w-3xl mx-auto text-lg">
                            Earn high commissions through personal production and team building.
                            Advance through elite ranks with unlimited earning potential.
                        </p>
                    </div>

                    {/* Dual Path System */}
                    <div className="earning-paths-grid">
                        <div className="path-card glass-panel animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <div className="path-header">
                                <div className="path-icon personal-gradient">
                                    <DollarSign size={32} />
                                </div>
                                <h3>Personal Production</h3>
                            </div>
                            <p className="path-description">
                                Earn direct commissions on every sale you make. No team required—just you and your hustle.
                            </p>
                            <div className="commission-breakdown">
                                <div className="commission-item">
                                    <div className="commission-label">Business Plus ($99/mo)</div>
                                    <div className="commission-value">$108.64</div>
                                </div>
                                <div className="commission-item">
                                    <div className="commission-label">Associate Rank</div>
                                    <div className="commission-value">Per Sale</div>
                                </div>
                                <div className="commission-highlight">
                                    <span className="highlight-label">10 Sales =</span>
                                    <span className="highlight-value">$1,086/mo</span>
                                </div>
                            </div>
                        </div>

                        <div className="path-card glass-panel animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="path-header">
                                <div className="path-icon team-gradient">
                                    <Users size={32} />
                                </div>
                                <h3>Team Production</h3>
                            </div>
                            <p className="path-description">
                                Build your organization and earn overrides on your team's sales. Exponential growth potential.
                            </p>
                            <div className="commission-breakdown">
                                <div className="commission-item">
                                    <div className="commission-label">Organization Override</div>
                                    <div className="commission-value">$27.16</div>
                                </div>
                                <div className="commission-item">
                                    <div className="commission-label">Per Associate Sale</div>
                                    <div className="commission-value">Sr. Associate</div>
                                </div>
                                <div className="commission-highlight">
                                    <span className="highlight-label">100 Team Sales =</span>
                                    <span className="highlight-value">$2,716/mo</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rank-progression-section">
                        <h3 className="progression-title">Rank Progression System</h3>
                        <p className="progression-subtitle">
                            Advance through elite ranks based on personal or team production. Each rank unlocks higher commissions and bonuses.
                        </p>

                        <div className="ranks-grid">
                            <div className="rank-card glass-panel animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                                <div className="rank-badge associate">Associate</div>
                                <div className="rank-requirements">
                                    <div className="req-item">
                                        <CheckCircle size={16} />
                                        <span>5 Personal Sales</span>
                                    </div>
                                    <div className="rank-or-divider">OR</div>
                                    <div className="req-item">
                                        <CheckCircle size={16} />
                                        <span>3 Sales + 1 Associate</span>
                                    </div>
                                </div>
                                <div className="rank-earnings">
                                    <div className="earnings-label">Commission Rate</div>
                                    <div className="earnings-value">9%</div>
                                </div>
                            </div>

                            <div className="rank-card glass-panel animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                                <div className="rank-badge manager">Senior Associate</div>
                                <div className="rank-requirements">
                                    <div className="req-item">
                                        <CheckCircle size={16} />
                                        <span>$500 Personal Sales</span>
                                    </div>
                                    <div className="rank-or-divider">OR</div>
                                    <div className="req-item">
                                        <CheckCircle size={16} />
                                        <span>3 Assoc + $300 Team</span>
                                    </div>
                                </div>
                                <div className="rank-earnings">
                                    <div className="earnings-label">Commission Rate</div>
                                    <div className="earnings-value">11%</div>
                                </div>
                            </div>

                            <div className="rank-card glass-panel animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                                <div className="rank-badge director">Manager</div>
                                <div className="rank-requirements">
                                    <div className="req-item">
                                        <CheckCircle size={16} />
                                        <span>$1,500 Personal Premium</span>
                                    </div>
                                    <div className="rank-or-divider">OR</div>
                                    <div className="req-item">
                                        <CheckCircle size={16} />
                                        <span>3 Sr Assoc + $1.5K Team</span>
                                    </div>
                                </div>
                                <div className="rank-earnings">
                                    <div className="earnings-label">Commission Rate</div>
                                    <div className="earnings-value">15%</div>
                                </div>
                            </div>

                            <div className="rank-card glass-panel animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                                <div className="rank-badge executive">Director</div>
                                <div className="rank-requirements">
                                    <div className="req-item">
                                        <CheckCircle size={16} />
                                        <span>$3,000 Personal Sales</span>
                                    </div>
                                    <div className="rank-or-divider">OR</div>
                                    <div className="req-item">
                                        <CheckCircle size={16} />
                                        <span>3 Mgrs + $3K Team</span>
                                    </div>
                                </div>
                                <div className="rank-earnings">
                                    <div className="earnings-label">Commission Rate</div>
                                    <div className="earnings-value">20%</div>
                                </div>
                            </div>

                            <div className="rank-card glass-panel featured animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                                <div className="rank-badge elite">Senior Director</div>
                                <div className="rank-requirements">
                                    <div className="req-item">
                                        <CheckCircle size={16} />
                                        <span>$700 Personal Premium</span>
                                    </div>
                                    <div className="rank-or-divider">OR</div>
                                    <div className="req-item">
                                        <CheckCircle size={16} />
                                        <span>$700 Team Split</span>
                                    </div>
                                </div>
                                <div className="rank-earnings">
                                    <div className="earnings-label">Commission Rate</div>
                                    <div className="earnings-value">37.5%</div>
                                </div>
                                <div className="elite-badge">TOP TIER</div>
                            </div>
                        </div>
                    </div>

                    {/* Sales Tools */}
                    <div className="sales-tools-section">
                        <h3 className="tools-section-title">Sales Division Tools</h3>
                        <div className="sales-tools-grid">
                            <div className="sales-tool-card glass-panel animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                                <BarChart3 size={28} className="tool-icon-sales" />
                                <h4>Career Simulator</h4>
                                <p>Visualize your path to each rank with real-time projections</p>
                            </div>
                            <div className="sales-tool-card glass-panel animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
                                <Layout size={28} className="tool-icon-sales" />
                                <h4>Organization Genealogy</h4>
                                <p>Drag-and-drop team placement with visual tree management</p>
                            </div>
                            <div className="sales-tool-card glass-panel animate-fade-in-up" style={{ animationDelay: '1s' }}>
                                <FileText size={28} className="tool-icon-sales" />
                                <h4>Pipeline CRM</h4>
                                <p>Track leads, manage follow-ups, and close more deals</p>
                            </div>
                            <div className="sales-tool-card glass-panel animate-fade-in-up" style={{ animationDelay: '1.1s' }}>
                                <DollarSign size={28} className="tool-icon-sales" />
                                <h4>Commission Dashboard</h4>
                                <p>Real-time earnings tracking and payout management</p>
                            </div>
                        </div>
                    </div>

                    {/* NEW: Agency Model Section */}
                    <div className="agency-model-section animate-fade-in-up" style={{ marginTop: '160px', marginBottom: '160px' }}>
                        <div className="agency-header" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '80px' }}>
                            <h3 className="agency-title" style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>The Institutional Agency Model</h3>
                            <p className="agency-subtitle" style={{ maxWidth: '800px', fontSize: '1.2rem', lineHeight: '1.6', textAlign: 'center' }}>
                                This is not Multi-Level Marketing. This is the <strong>Insurance Agency Standard</strong>.
                                See how our performance-based override system matches the world's largest financial institutions.
                            </p>
                        </div>

                        <div className="agency-logic-grid">
                            {/* Card 1: The 12-Month Advance */}
                            <div className="model-card glass-panel animate-fade-in-up">
                                <div className="flex items-center gap-3 mb-4">
                                    <Zap size={24} className="text-accent" />
                                    <h4 className="text-xl font-bold" style={{ color: '#fff' }}>12-Month Advance Commission</h4>
                                </div>
                                <p className="text-secondary text-sm mb-6">
                                    Why wait for monthly residuals? We pay out the entire first year's commission <strong>upfront</strong> immediately upon policy approval.
                                </p>

                                <div className="cashflow-visual">
                                    <div className="node-group text-center">
                                        <div className="node-icon bg-blue-500/10 border-blue-500/30 text-blue-500">
                                            <FileText size={20} />
                                        </div>
                                        <span className="text-xs mt-2 text-secondary">Policy Sold</span>
                                    </div>
                                    <div className="flow-line">
                                        <div className="flow-particle"></div>
                                        <div className="flow-particle" style={{ animationDelay: '0.5s' }}></div>
                                        <div className="flow-particle" style={{ animationDelay: '1s' }}></div>
                                    </div>
                                    <div className="node-group text-center">
                                        <div className="node-icon">
                                            <DollarSign size={24} />
                                        </div>
                                        <div className="advance-badge">12 Months Paid Now</div>
                                    </div>
                                </div>

                                <div className="bg-white/5 p-4 rounded-lg mt-4 border border-white/10" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '16px' }}>
                                    <div className="flex justify-between text-sm mb-2" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span className="text-secondary" style={{ color: 'rgba(255,255,255,0.6)' }}>Monthly Premium</span>
                                        <span className="font-mono text-white" style={{ fontFamily: 'monospace', color: '#fff' }}>$99.00</span>
                                    </div>
                                    <div className="flex justify-between text-sm mb-2" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span className="text-secondary" style={{ color: 'rgba(255,255,255,0.6)' }}>Annual Value</span>
                                        <span className="font-mono text-white" style={{ fontFamily: 'monospace', color: '#fff' }}>$1,188.00</span>
                                    </div>
                                    <div className="h-px bg-white/10 my-2" style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '8px 0' }}></div>
                                    <div className="flex justify-between font-bold text-accent" style={{ display: 'flex', justifyContent: 'space-between', color: '#fbbf24', fontWeight: 'bold' }}>
                                        <span>Your Advance Check</span>
                                        <span>$1,086.00</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: The Override Distribution */}
                            <div className="model-card glass-panel animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                <div className="flex items-center gap-3 mb-4">
                                    <Users size={24} className="text-green-400" style={{ color: '#10b981' }} />
                                    <h4 className="text-xl font-bold" style={{ color: '#fff' }}>Equitable Override Distribution</h4>
                                </div>
                                <p className="text-secondary text-sm mb-6">
                                    When you build a team, <strong>we don't keep the margins</strong>. The difference between your rank and your agent's rank flows directly to you as a leadership override.
                                </p>

                                <div className="distribution-visual">
                                    {/* Agent Row */}
                                    <div className="bg-black/40 p-3 rounded-lg flex items-center gap-4" style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>AG</div>
                                        <div className="flex-1" style={{ flex: 1 }}>
                                            <div className="flex justify-between text-xs mb-1" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                                                <span className="text-gray-400" style={{ color: '#9ca3af' }}>Junior Agent (Associate)</span>
                                                <span className="text-white">9% Commission</span>
                                            </div>
                                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden" style={{ height: '8px', background: '#1f2937', borderRadius: '999px', overflow: 'hidden' }}>
                                                <div className="h-full bg-blue-500 w-[45%]" style={{ height: '100%', background: '#3b82f6', width: '45%' }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* The Spread Visualization */}
                                    <div className="relative pl-8 border-l-2 border-dashed border-green-500/30 py-4 ml-4" style={{ position: 'relative', paddingLeft: '32px', borderLeft: '2px dashed rgba(16,185,129,0.3)', paddingTop: '16px', paddingBottom: '16px', marginLeft: '16px' }}>
                                        <div className="absolute -left-[9px] top-1/2 -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full border-4 border-black" style={{ position: 'absolute', left: '-9px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', background: '#10b981', borderRadius: '50%', border: '4px solid #000' }}></div>

                                        <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', padding: '16px', borderRadius: '8px' }}>
                                            <div className="flex justify-between items-center mb-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <h5 className="font-bold text-green-400 text-sm" style={{ fontWeight: 'bold', color: '#4ade80', fontSize: '14px', margin: 0 }}>THE SPREAD (6%)</h5>
                                                <span className="text-xs text-green-300/70" style={{ fontSize: '12px', color: 'rgba(134,239,172,0.7)' }}>Difference between 15% & 9%</span>
                                            </div>
                                            <p className="text-xs text-secondary leading-relaxed" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
                                                The company does <strong>NOT</strong> keep this. This 6% margin is instantly paid to the Manager who trained the agent.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Leader Row */}
                                    <div className="bg-black/40 p-3 rounded-lg flex items-center gap-4 border border-green-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]" style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid rgba(16,185,129,0.3)', boxShadow: '0 0 15px rgba(16,185,129,0.1)' }}>
                                        <div className="w-8 h-8 rounded-full bg-green-900 flex items-center justify-center text-xs font-bold text-green-400" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#064e3b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', color: '#4ade80' }}>YOU</div>
                                        <div className="flex-1" style={{ flex: 1 }}>
                                            <div className="flex justify-between text-xs mb-1" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                                                <span className="text-green-400 font-bold" style={{ color: '#4ade80', fontWeight: 'bold' }}>Manager (You)</span>
                                                <span className="text-white">15% Total Cap</span>
                                            </div>
                                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden flex" style={{ height: '8px', background: '#1f2937', borderRadius: '999px', overflow: 'hidden', display: 'flex' }}>
                                                <div className="h-full bg-blue-500/30 w-[45%]" style={{ height: '100%', background: 'rgba(59,130,246,0.3)', width: '45%' }}></div>
                                                <div className="h-full bg-green-500 w-[30%] animate-pulse" style={{ height: '100%', background: '#10b981', width: '30%' }}></div>
                                            </div>
                                            <div className="flex justify-end mt-1" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                                                <span className="text-[10px] text-green-400 font-mono" style={{ fontSize: '10px', color: '#4ade80', fontFamily: 'monospace' }}>+$27.16 OVERRIDE PAID TO YOU</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="sales-cta glass-panel">
                        <h3>Ready to Build Your Income Stream?</h3>
                        <p>Start earning commissions today. No experience required—just ambition.</p>
                        <Link href="/get-started" className="btn-primary">
                            Start Earning Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* Membership Section */}
            <section className="membership-section">
                <div className="glass-panel membership-card">
                    <div className="card-tag">LIFETIME ACCESS</div>
                    <h2 className="text-title">START FOR FREE</h2>
                    <p className="description">
                        The journey begins here with zero friction. Gain immediate access to the
                        business blueprints, central dashboard, and community.
                    </p>
                    <div className="features-grid">
                        <div className="feature-item">
                            <h4>Personal CRM</h4>
                            <p>Build and track your sales pipelines.</p>
                        </div>
                        <div className="feature-item">
                            <h4>Private Software</h4>
                            <p>Proprietary vision-scaling tools.</p>
                        </div>
                        <div className="feature-item">
                            <h4>Direct Consultations</h4>
                            <p>High-level strategic support.</p>
                        </div>
                        <div className="feature-item">
                            <h4>System Updates</h4>
                            <p>Continuously engineered protocols.</p>
                        </div>
                    </div>
                    <Link href="/get-started" className="btn-primary full-width text-center block" style={{ textDecoration: 'none' }}>
                        Initialize Access
                    </Link>
                </div>
            </section>

            {/* Footer / Vision Section */}
            <footer className="vision-section">
                <div className="vision-content">
                    <div className="logo-fade">VERSTIGE</div>
                    <p>ENGINEERED FOR THE 1%. ACCESS GRANTED ONLY TO THE PERSISTENT.</p>
                </div>
            </footer>
        </div>
    );
}
