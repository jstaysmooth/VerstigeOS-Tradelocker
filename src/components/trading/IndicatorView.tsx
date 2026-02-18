"use client";
import React from 'react';
import {
    Zap,
    TrendingUp,
    Layout,
    Target,
    Lock,
    ExternalLink,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Lightbulb,
    CheckCircle,
    Shield,
    Eye,
    BarChart3
} from 'lucide-react';
import './IndicatorView.css';

const CORE_COMPONENTS = [
    {
        icon: TrendingUp,
        title: '200 EMA Foundation',
        desc: 'Directional trend filter. Long above, short below. EMA rejections confirm trend strength.',
        tag: 'TREND',
        color: 'blue'
    },
    {
        icon: Layout,
        title: 'Order Block Detection',
        desc: 'Auto-identifies institutional zones based on valid structure and candle sequences.',
        tag: 'STRUCTURE',
        color: 'purple'
    },
    {
        icon: Target,
        title: 'Fibonacci Reaction',
        desc: 'Auto-plots 0.618 (Prime) and 0.786 (Apex) zones for high-precision entry protocols.',
        tag: 'ENTRY',
        color: 'green'
    },
    {
        icon: Lock,
        title: 'Retest Lock Logic',
        desc: 'Prevents recalculation. Once Prime/Apex is hit, zones lock for clean historical backtesting.',
        tag: 'LOGIC',
        color: 'orange'
    }
];

const LONG_STEPS = [
    'Price above 200 EMA',
    'Bullish Order Block forms',
    'Retest of Prime (0.618) or Apex (0.786)',
    'Buy Arrow confirmation → Execution'
];

const SHORT_STEPS = [
    'Price below 200 EMA',
    'Bearish Order Block forms',
    'Retest of Prime / Apex zones',
    'Sell Arrow confirmation → Execution'
];

const PRO_TIPS = [
    'Only trade when 200 EMA and OB align perfectly.',
    'Use Prime & Apex zones for surgical re-entries.',
    'Always wait for rejection before acting on arrows.',
    'Combine with RSI or Volume for maximum confluence.'
];

const IndicatorView: React.FC = () => {
    return (
        <div className="ind-view">
            {/* Hero */}
            <div className="ind-hero">
                <div className="ind-hero-content">
                    <div className="ind-hero-badge">PROPRIETARY SYSTEM</div>
                    <h1 className="ind-hero-title">
                        The Verstige <span className="ind-accent">Strategy</span>
                    </h1>
                    <p className="ind-hero-desc">
                        Precision-Powered. Structure-Aligned. Momentum-Confirmed.
                        The ultimate proprietary indicator engineered for institutional-level execution.
                    </p>

                    <div className="ind-hero-stats">
                        <div className="ind-stat-pill">
                            <span className="ind-stat-label">200 EMA</span>
                            <span className="ind-stat-value">Trend Filter</span>
                        </div>
                        <div className="ind-stat-pill">
                            <span className="ind-stat-label">Order Blocks</span>
                            <span className="ind-stat-value val-blue">Auto-Detect</span>
                        </div>
                        <div className="ind-stat-pill">
                            <span className="ind-stat-label">Fibonacci</span>
                            <span className="ind-stat-value val-green">
                                <Target size={13} /> Prime & Apex
                            </span>
                        </div>
                    </div>

                    <a
                        href="https://www.tradingview.com/script/xSRlmPkH-The-Verstige-Strategy/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ind-cta-btn"
                    >
                        <ExternalLink size={16} />
                        Access on TradingView
                        <ArrowUpRight size={14} />
                    </a>
                </div>
            </div>

            {/* Core Components */}
            <div className="ind-section">
                <h3 className="ind-section-title">
                    <BarChart3 size={16} /> Core System Components
                </h3>
                <div className="ind-components-grid">
                    {CORE_COMPONENTS.map((comp) => (
                        <div key={comp.title} className={`ind-comp-card`}>
                            <div className={`ind-comp-icon icon-${comp.color}`}>
                                <comp.icon size={20} />
                            </div>
                            <div className="ind-comp-body">
                                <div className="ind-comp-top">
                                    <h4>{comp.title}</h4>
                                    <span className={`ind-comp-tag tag-${comp.color}`}>{comp.tag}</span>
                                </div>
                                <p>{comp.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Strategy Flow + Tips */}
            <div className="ind-split-layout">
                {/* Strategy Flow */}
                <div className="ind-strategy-panel">
                    <h3 className="ind-panel-title">
                        <Shield size={16} /> Strategy Flow
                    </h3>

                    <div className="ind-flow-columns">
                        {/* Long Setup */}
                        <div className="ind-flow-block">
                            <div className="ind-flow-label long">
                                <ArrowUpRight size={14} /> LONG SETUP
                            </div>
                            <div className="ind-flow-steps">
                                {LONG_STEPS.map((step, i) => (
                                    <div key={i} className="ind-step">
                                        <div className="ind-step-num">{i + 1}</div>
                                        <span>{step}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Short Setup */}
                        <div className="ind-flow-block">
                            <div className="ind-flow-label short">
                                <ArrowDownRight size={14} /> SHORT SETUP
                            </div>
                            <div className="ind-flow-steps">
                                {SHORT_STEPS.map((step, i) => (
                                    <div key={i} className="ind-step">
                                        <div className="ind-step-num">{i + 1}</div>
                                        <span>{step}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="ind-tips-column">
                    {/* Breakout Confirmation */}
                    <div className="ind-alert-card">
                        <div className="ind-alert-header">
                            <Activity size={18} />
                            <h4>Breakout Confirmation</h4>
                        </div>
                        <p>
                            Buy/Sell Arrows use ATR-session zones. Arrows are for <strong>momentum confirmation</strong>,
                            not standalone signals. Always align with structure first.
                        </p>
                    </div>

                    {/* Pro Tips */}
                    <div className="ind-tips-card">
                        <h4 className="ind-tips-title">
                            <Lightbulb size={15} /> Pro Execution Tips
                        </h4>
                        <div className="ind-tips-list">
                            {PRO_TIPS.map((tip, i) => (
                                <div key={i} className="ind-tip-item">
                                    <CheckCircle size={14} className="ind-tip-check" />
                                    <span>{tip}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IndicatorView;
