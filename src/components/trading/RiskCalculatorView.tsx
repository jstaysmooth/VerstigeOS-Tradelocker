"use client";
import React, { useState, useMemo } from 'react';
import {
    Target,
    Shield,
    TrendingUp,
    AlertTriangle,
    DollarSign,
    BarChart3,
    Percent,
    ArrowUpRight,
    Info
} from 'lucide-react';
import './RiskCalculatorView.css';

interface AssetConfig {
    label: string;
    pipValue: number;     // $ per pip per standard lot
    pipSize: number;      // pip decimal size
    marginPer: number;    // margin per standard lot at 1:100
    contractSize: number;
}

const ASSETS: Record<string, AssetConfig> = {
    XAUUSD: { label: 'XAUUSD (Gold)', pipValue: 10, pipSize: 0.1, marginPer: 2000, contractSize: 100 },
    BTCUSD: { label: 'BTCUSD (Bitcoin)', pipValue: 1, pipSize: 1, marginPer: 3500, contractSize: 1 },
    NAS100: { label: 'NAS100 (Nasdaq)', pipValue: 1, pipSize: 1, marginPer: 1500, contractSize: 1 },
    EURUSD: { label: 'EURUSD (Euro)', pipValue: 10, pipSize: 0.0001, marginPer: 1300, contractSize: 100000 },
    GBPUSD: { label: 'GBPUSD (Pound)', pipValue: 10, pipSize: 0.0001, marginPer: 1500, contractSize: 100000 },
    US30: { label: 'US30 (Dow Jones)', pipValue: 1, pipSize: 1, marginPer: 1200, contractSize: 1 },
    USDJPY: { label: 'USDJPY (Yen)', pipValue: 6.50, pipSize: 0.01, marginPer: 1300, contractSize: 100000 },
};

const RiskCalculatorView: React.FC = () => {
    const [balance, setBalance] = useState(10000);
    const [riskPercent, setRiskPercent] = useState(1);
    const [stopLoss, setStopLoss] = useState(25);
    const [asset, setAsset] = useState('XAUUSD');
    const [leverage, setLeverage] = useState(100);

    const results = useMemo(() => {
        const config = ASSETS[asset];
        if (!config || stopLoss <= 0 || balance <= 0 || riskPercent <= 0) {
            return { lotSize: 0, capitalAtRisk: 0, pipValue: 0, margin: 0, riskReward: '—', leverageStatus: 'SAFE' as const };
        }

        const capitalAtRisk = (balance * riskPercent) / 100;
        const pipValuePerLot = config.pipValue;
        const lotSize = capitalAtRisk / (stopLoss * pipValuePerLot);
        const actualPipValue = lotSize * pipValuePerLot;
        const margin = (lotSize * config.marginPer) / (leverage / 100);
        const marginPercent = (margin / balance) * 100;

        let leverageStatus: 'SAFE' | 'MODERATE' | 'HIGH' = 'SAFE';
        if (marginPercent > 50) leverageStatus = 'HIGH';
        else if (marginPercent > 25) leverageStatus = 'MODERATE';

        return {
            lotSize: Math.round(lotSize * 100) / 100,
            capitalAtRisk: Math.round(capitalAtRisk * 100) / 100,
            pipValue: Math.round(actualPipValue * 100) / 100,
            margin: Math.round(margin * 100) / 100,
            riskReward: `1:${Math.max(1, Math.round(3 * (riskPercent / 1)))}`,
            leverageStatus
        };
    }, [balance, riskPercent, stopLoss, asset, leverage]);

    return (
        <div className="rc-view">
            {/* Hero */}
            <div className="rc-hero">
                <div className="rc-hero-left">
                    <div className="rc-hero-badge">RISK MANAGEMENT</div>
                    <h2 className="rc-hero-title">Position Calculator</h2>
                    <p className="rc-hero-sub">Calculate optimal lot size and margin requirements</p>
                </div>
                <div className="rc-hero-icon">
                    <Shield size={32} />
                </div>
            </div>

            {/* Main Layout */}
            <div className="rc-layout">
                {/* Left: Inputs */}
                <div className="rc-inputs-panel">
                    <h3 className="rc-panel-title">
                        <Target size={16} /> Parameters
                    </h3>

                    <div className="rc-field">
                        <label>
                            <DollarSign size={13} />
                            Account Balance
                        </label>
                        <div className="rc-input-wrap">
                            <span className="rc-prefix">$</span>
                            <input
                                type="number"
                                value={balance}
                                onChange={e => setBalance(parseFloat(e.target.value) || 0)}
                            />
                        </div>
                        <div className="rc-presets">
                            {[1000, 5000, 10000, 25000, 50000, 100000].map(v => (
                                <button
                                    key={v}
                                    className={`rc-preset ${balance === v ? 'active' : ''}`}
                                    onClick={() => setBalance(v)}
                                >
                                    {v >= 1000 ? `${v / 1000}k` : v}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rc-field">
                        <label>
                            <Percent size={13} />
                            Risk Per Trade
                        </label>
                        <div className="rc-input-wrap">
                            <input
                                type="number"
                                value={riskPercent}
                                onChange={e => setRiskPercent(parseFloat(e.target.value) || 0)}
                                step={0.5}
                                min={0.1}
                                max={20}
                            />
                            <span className="rc-suffix">%</span>
                        </div>
                        <div className="rc-presets">
                            {[0.5, 1, 1.5, 2, 3, 5].map(v => (
                                <button
                                    key={v}
                                    className={`rc-preset ${riskPercent === v ? 'active' : ''}`}
                                    onClick={() => setRiskPercent(v)}
                                >
                                    {v}%
                                </button>
                            ))}
                        </div>
                        <div className={`rc-risk-indicator ${riskPercent <= 1 ? 'safe' : riskPercent <= 2 ? 'moderate' : 'high'}`}>
                            {riskPercent <= 1 ? <><Shield size={12} /> Conservative</> :
                                riskPercent <= 2 ? <><Info size={12} /> Moderate</> :
                                    <><AlertTriangle size={12} /> Aggressive</>}
                        </div>
                    </div>

                    <div className="rc-field">
                        <label>
                            <AlertTriangle size={13} />
                            Stop Loss (Pips)
                        </label>
                        <div className="rc-input-wrap">
                            <input
                                type="number"
                                value={stopLoss}
                                onChange={e => setStopLoss(parseFloat(e.target.value) || 0)}
                                min={1}
                            />
                            <span className="rc-suffix">pips</span>
                        </div>
                    </div>

                    <div className="rc-field">
                        <label>
                            <BarChart3 size={13} />
                            Asset Class
                        </label>
                        <select
                            value={asset}
                            onChange={e => setAsset(e.target.value)}
                            className="rc-select"
                        >
                            {Object.entries(ASSETS).map(([key, conf]) => (
                                <option key={key} value={key}>{conf.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="rc-field">
                        <label>
                            <TrendingUp size={13} />
                            Leverage
                        </label>
                        <select
                            value={leverage}
                            onChange={e => setLeverage(parseInt(e.target.value))}
                            className="rc-select"
                        >
                            {[30, 50, 100, 200, 500].map(v => (
                                <option key={v} value={v}>1:{v}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Right: Results */}
                <div className="rc-results-panel">
                    {/* Primary Result */}
                    <div className="rc-primary-result">
                        <span className="rc-result-label">Recommended Position Size</span>
                        <div className="rc-lot-display">
                            <span className="rc-lot-value">{results.lotSize.toFixed(2)}</span>
                            <span className="rc-lot-unit">LOTS</span>
                        </div>
                    </div>

                    {/* Results Grid */}
                    <div className="rc-results-grid">
                        <div className="rc-result-card">
                            <div className="rc-result-icon red">
                                <AlertTriangle size={16} />
                            </div>
                            <div className="rc-result-info">
                                <span className="rc-result-lbl">Capital at Risk</span>
                                <span className="rc-result-val val-red">${results.capitalAtRisk.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="rc-result-card">
                            <div className="rc-result-icon blue">
                                <DollarSign size={16} />
                            </div>
                            <div className="rc-result-info">
                                <span className="rc-result-lbl">Pip Value</span>
                                <span className="rc-result-val">${results.pipValue.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="rc-result-card">
                            <div className="rc-result-icon purple">
                                <Shield size={16} />
                            </div>
                            <div className="rc-result-info">
                                <span className="rc-result-lbl">Required Margin</span>
                                <span className="rc-result-val">${results.margin.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="rc-result-card">
                            <div className={`rc-result-icon ${results.leverageStatus === 'SAFE' ? 'green' : results.leverageStatus === 'MODERATE' ? 'yellow' : 'red'}`}>
                                <ArrowUpRight size={16} />
                            </div>
                            <div className="rc-result-info">
                                <span className="rc-result-lbl">1:{leverage} Leverage</span>
                                <span className={`rc-result-val ${results.leverageStatus === 'SAFE' ? 'val-green' : results.leverageStatus === 'MODERATE' ? 'val-yellow' : 'val-red'}`}>
                                    {results.leverageStatus}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Breakdown */}
                    <div className="rc-breakdown">
                        <h4 className="rc-breakdown-title">Risk Breakdown</h4>
                        <div className="rc-breakdown-rows">
                            <div className="rc-bk-row">
                                <span>Account Balance</span>
                                <span>${balance.toLocaleString()}</span>
                            </div>
                            <div className="rc-bk-row">
                                <span>Risk Amount ({riskPercent}%)</span>
                                <span className="val-red">${results.capitalAtRisk.toFixed(2)}</span>
                            </div>
                            <div className="rc-bk-row">
                                <span>Stop Loss</span>
                                <span>{stopLoss} pips</span>
                            </div>
                            <div className="rc-bk-row">
                                <span>Asset</span>
                                <span>{ASSETS[asset].label.split(' ')[0]}</span>
                            </div>
                            <div className="rc-bk-row highlight">
                                <span>Position Size</span>
                                <span className="val-blue">{results.lotSize.toFixed(2)} lots</span>
                            </div>
                        </div>
                    </div>

                    <p className="rc-disclaimer">
                        Calculations based on standard lot sizes. Verify with your broker for exact pip values and margin requirements.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RiskCalculatorView;
