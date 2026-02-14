"use client";
import React, { useState } from 'react';
import { DollarSign, Briefcase, Megaphone, Check, Shield, Globe, Target, Zap, Rocket, Cpu } from 'lucide-react';
import '@/styles/pages/GetStarted.css';

interface PricingTier {
    id: string;
    name: string;
    description: string;
    monthlyPrice: number;
    oneTimePrice: number;
    icon: React.ReactNode;
}

const INSURANCE_ADDON: PricingTier = {
    id: 'insurance',
    name: 'Business Legal Insurance',
    description: 'Protect your venture with professional legal support and insurance protocols.',
    monthlyPrice: 99.00,
    oneTimePrice: 0,
    icon: <Shield size={32} />
};

const TRADING_ADDON: PricingTier = {
    id: 'trading',
    name: 'Trading Division',
    description: 'Advanced fintech tools, liquid terminals, and institutional risk protocols.',
    monthlyPrice: 149.00,
    oneTimePrice: 0,
    icon: <DollarSign size={32} />
};

const SALES_ADDON: PricingTier = {
    id: 'sales',
    name: 'Sales Division',
    description: 'Access to the Rank Simulator, Genealogy Visualizer, and Earning Logic.',
    monthlyPrice: 75.00,
    oneTimePrice: 149.99,
    icon: <Megaphone size={32} />
};

const AUTO_TRADER_ADDON: PricingTier = {
    id: 'autotrader',
    name: 'Auto Trader Protocol',
    description: 'Hands-free execution of Telegram signals with automated TPs and risk mesh.',
    monthlyPrice: 100.00,
    oneTimePrice: 0,
    icon: <Cpu size={32} />
};

export default function GetStartedPage() {
    const [path, setPath] = useState<'BUILD' | 'TRADE' | 'SALES'>('BUILD');
    const [addons, setAddons] = useState<string[]>([]);

    const toggleAddon = (id: string) => {
        if (addons.includes(id)) {
            setAddons(addons.filter(a => a !== id));
        } else {
            setAddons([...addons, id]);
        }
    };

    // Calculations
    const baseCorePrice = 49.99;
    const coreDiscount = (path === 'SALES') ? 25.00 : 0;
    const coreMonthly = path === 'BUILD' ? 0.00 : (baseCorePrice - coreDiscount);

    let totalMonthly = coreMonthly;
    let totaltoday = coreMonthly;

    if (addons.includes('insurance')) {
        totalMonthly += INSURANCE_ADDON.monthlyPrice;
        totaltoday += INSURANCE_ADDON.monthlyPrice;
    }

    if (addons.includes('trading')) {
        totalMonthly += TRADING_ADDON.monthlyPrice;
        totaltoday += TRADING_ADDON.monthlyPrice;
    }

    if (addons.includes('sales')) {
        totalMonthly += SALES_ADDON.monthlyPrice;
        // If they are on the direct SALES path, dont charge the $75 monthly upfront
        const upfrontMonthly = (path === 'SALES') ? 0 : SALES_ADDON.monthlyPrice;
        totaltoday += SALES_ADDON.oneTimePrice + upfrontMonthly;
    }

    if (addons.includes('autotrader')) {
        totalMonthly += AUTO_TRADER_ADDON.monthlyPrice;
        totaltoday += AUTO_TRADER_ADDON.monthlyPrice;
    }

    return (
        <div className="get-started-page animate-fade-in">
            <div className="gs-container">
                {/* Left Column: Selection */}
                <div className="selection-area">
                    <div className="gs-header">
                        <h1>Select Your Direction</h1>
                        <p>How do you plan to interact with the Verstige Operating System?</p>
                    </div>

                    {/* PATH SELECTION */}
                    <div className="path-selection-grid mb-12">
                        <div
                            className={`path-card ${path === 'BUILD' ? 'selected' : ''}`}
                            onClick={() => {
                                setPath('BUILD');
                                setAddons([]); // Reset for free path
                            }}
                        >
                            <div className="path-icon"><Rocket size={24} /></div>
                            <div className="path-info">
                                <h4>Foundation Builder</h4>
                                <p>Start for free. Build your business infrastructure first.</p>
                                <span className="path-price">Free Entry</span>
                            </div>
                        </div>

                        <div
                            className={`path-card ${path === 'TRADE' ? 'selected' : ''}`}
                            onClick={() => {
                                setPath('TRADE');
                                setAddons(['trading']);
                            }}
                        >
                            <div className="path-icon"><Zap size={24} /></div>
                            <div className="path-info">
                                <h4>Trading Specialist</h4>
                                <p>Skip the setup. Immediate access to terminals and elite tools.</p>
                                <span className="path-price">$49.99/mo OS Access</span>
                            </div>
                        </div>

                        <div
                            className={`path-card ${path === 'SALES' ? 'selected' : ''}`}
                            onClick={() => {
                                setPath('SALES');
                                setAddons(['sales']);
                            }}
                        >
                            <div className="path-icon"><Target size={24} /></div>
                            <div className="path-info">
                                <h4>Sales Executive</h4>
                                <p>Skip the setup. Immediate access to referral commissions.</p>
                                <span className="path-price">$24.99/mo <span className="line-through opacity-50">$49.99</span></span>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-lg font-bold mb-4 uppercase text-secondary tracking-wider">Dynamic Configuration</h3>

                    {path === 'BUILD' ? (
                        <div className="core-plan-card mb-8">
                            <div className="core-info">
                                <h3>Initial Access <span className="badge-included" style={{ background: 'var(--fintech-green)', color: '#000' }}>FREE</span></h3>
                                <p className="text-secondary text-sm mb-2">Build your LLC and foundation at zero cost.</p>
                                <ul className="text-sm text-secondary space-y-1">
                                    <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Business Setup Blueprint</li>
                                    <li className="flex items-center gap-2"><Check size={14} className="text-green-500" /> Educational Resource Mesh</li>
                                </ul>
                            </div>
                            <div className="core-price">
                                <span className="price-large">$0.00</span>
                            </div>
                        </div>
                    ) : (
                        <div className="core-plan-card mb-8 active">
                            <div className="core-info">
                                <h3>Core OS Access</h3>
                                <p className="text-secondary text-sm mb-2">Direct access to tools, software, consultations, and custom CRM.</p>
                                <ul className="text-sm text-secondary space-y-1">
                                    <li className="flex items-center gap-2"><Check size={14} className="text-accent" /> Private CRM & Sales Tracker</li>
                                    <li className="flex items-center gap-2"><Check size={14} className="text-accent" /> Expert Consultations & Software</li>
                                    <li className="flex items-center gap-2"><Check size={14} className="text-accent" /> Secure Visionary Network</li>
                                </ul>
                            </div>
                            <div className="core-price">
                                {path === 'SALES' ? (
                                    <>
                                        <span className="price-large">$24.99</span>
                                        <span className="text-xs block text-green-500 font-bold">-$25.00 DISCOUNT</span>
                                    </>
                                ) : (
                                    <span className="price-large">$49.99</span>
                                )}
                                <span className="price-period">/ month</span>
                            </div>
                        </div>
                    )}

                    <div className="addon-grid">
                        {/* INSURANCE ADDON */}
                        <div
                            className={`addon-card ${addons.includes('insurance') ? 'selected' : ''}`}
                            onClick={() => toggleAddon('insurance')}
                        >
                            <div className="selection-indicator"></div>
                            <div className="addon-icon"><Shield size={32} /></div>
                            <div className="addon-content">
                                <h4>Business Legal Insurance</h4>
                                <p className="addon-desc">Essential protection. Unlocks IP modules.</p>
                                <div className="addon-pricing">
                                    <span className="price-tag highlight">+$99.00 / mo</span>
                                </div>
                            </div>
                        </div>

                        {/* TRADING ADDON - Enabled by default for TRADE path */}
                        <div
                            className={`addon-card ${(addons.includes('trading') || path === 'TRADE') ? 'selected' : ''}`}
                            onClick={() => path !== 'TRADE' && toggleAddon('trading')}
                            style={{ opacity: path === 'TRADE' ? 0.8 : 1 }}
                        >
                            <div className="selection-indicator"></div>
                            <div className="addon-icon">{TRADING_ADDON.icon}</div>
                            <div className="addon-content">
                                <h4>{TRADING_ADDON.name}</h4>
                                <p className="addon-desc">{TRADING_ADDON.description}</p>
                                <div className="addon-pricing">
                                    <span className="price-tag highlight">+$149.00 / mo</span>
                                </div>
                            </div>
                        </div>

                        {/* SALES ADDON - Enabled by default for SALES path */}
                        <div
                            className={`addon-card ${(addons.includes('sales') || path === 'SALES') ? 'selected' : ''}`}
                            onClick={() => path !== 'SALES' && toggleAddon('sales')}
                            style={{ opacity: path === 'SALES' ? 0.8 : 1 }}
                        >
                            <div className="selection-indicator"></div>
                            <div className="addon-icon">{SALES_ADDON.icon}</div>
                            <div className="addon-content">
                                <h4>{SALES_ADDON.name}</h4>
                                <p className="addon-desc">{SALES_ADDON.description}</p>
                                <div className="addon-pricing flex-col gap-0">
                                    <span className="price-tag highlight">+$75.00 / mo</span>
                                    {path !== 'SALES' && <span className="text-xs text-secondary">+$149.99 Activation</span>}
                                </div>
                            </div>
                        </div>

                        {/* AUTO TRADER ADDON */}
                        <div
                            className={`addon-card ${addons.includes('autotrader') ? 'selected' : ''}`}
                            onClick={() => toggleAddon('autotrader')}
                        >
                            <div className="selection-indicator"></div>
                            <div className="addon-icon">{AUTO_TRADER_ADDON.icon}</div>
                            <div className="addon-content">
                                <h4>{AUTO_TRADER_ADDON.name}</h4>
                                <p className="addon-desc">{AUTO_TRADER_ADDON.description}</p>
                                <div className="addon-pricing">
                                    <span className="price-tag highlight">+$100.00 / mo</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Summary */}
                <div className="order-summary">
                    <div className="summary-header">
                        <h3>Configuration Summary</h3>
                        <div className="path-badge">{path === 'BUILD' ? 'Foundation' : path === 'TRADE' ? 'Trading Specialist' : 'Sales Executive'}</div>
                    </div>

                    <div className="summary-section">
                        <div className="section-label">Core Protocol</div>
                        <div className="summary-row">
                            <span>{path === 'BUILD' ? 'Builder Access' : 'Core OS Access'}</span>
                            <span className={path === 'BUILD' ? 'text-green' : 'text-white'}>
                                {path === 'BUILD' ? 'FREE' : (path === 'SALES' ? '$24.99' : '$49.99')}
                            </span>
                        </div>
                    </div>

                    {(addons.length > 0 || path !== 'BUILD') && (
                        <div className="summary-section">
                            <div className="section-label">Active Divisions & Protection</div>
                            {addons.includes('insurance') && (
                                <div className="summary-row animate-fade-in">
                                    <span>Business Insurance</span>
                                    <span>$99.00</span>
                                </div>
                            )}

                            {(addons.includes('trading') || path === 'TRADE') && (
                                <div className="summary-row animate-fade-in">
                                    <span>Trading Add-on</span>
                                    <span>$149.00</span>
                                </div>
                            )}

                            {(addons.includes('sales') || path === 'SALES') && (
                                <>
                                    <div className="summary-row animate-fade-in">
                                        <span>Sales Monthly Protocol</span>
                                        <span className={path === 'SALES' ? 'text-xs text-secondary italic' : 'text-white'}>
                                            {path === 'SALES' ? 'Deferred (Month 2)' : '$75.00'}
                                        </span>
                                    </div>
                                    <div className="summary-row sub-item animate-fade-in">
                                        <span>Sales Activation Fee</span>
                                        <span>$149.99</span>
                                    </div>
                                </>
                            )}

                            {addons.includes('autotrader') && (
                                <div className="summary-row animate-fade-in">
                                    <span>Auto Trader Protocol</span>
                                    <span>$100.00</span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="summary-footer">
                        <div className="total-group today">
                            <div className="total-row">
                                <span className="label">Investment Today</span>
                                <span className="value grand">${totaltoday.toFixed(2)}</span>
                            </div>
                            <p className="text-[10px] text-secondary text-right mt-1">One-time setup & initial billing</p>
                        </div>

                        <div className="total-group recurrent">
                            <div className="total-row">
                                <span className="label">Monthly Recurring</span>
                                <span className="value">${totalMonthly.toFixed(2)}</span>
                            </div>
                            <p className="text-[10px] text-secondary text-right mt-1">Due every 30 days</p>
                        </div>
                    </div>

                    <button className="btn-checkout">
                        Finalize Configuration
                    </button>

                    <div className="trust-footer">
                        <p className="text-xs text-center text-secondary">
                            {path === 'BUILD' ? 'No payment method required for initiation.' : 'Secured via Verstige Encryption Mesh.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
