"use client";
import React, { useState } from 'react';
import { DollarSign, Megaphone, Shield, Rocket, Check, ArrowRight, User, Mail, Lock, Phone, CreditCard, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import '@/styles/pages/GetStarted.css';

interface PricingTier {
    id: string;
    title: string;
    description: string;
    priceOneTime: number;
    priceMonthly: number;
    features: string[];
    icon: React.ReactNode;
}

const DIVISIONS: PricingTier[] = [
    {
        id: 'trading',
        title: 'Trading Division',
        description: 'Institutional-grade signal execution, copy trading, and live capital tracking.',
        priceOneTime: 149.00,
        priceMonthly: 99.00,
        features: ['Copy Trading Engine', 'Live Capital Tracking', 'Trade Journal', 'Signal Network Access'],
        icon: <DollarSign size={24} />
    },
    {
        id: 'sales',
        title: 'Sales Division',
        description: 'Monetize the referral engine. Build your organization and access the rank simulator.',
        priceOneTime: 149.99,
        priceMonthly: 75.00,
        features: ['Commission System', 'Genealogy Dashboard', 'CRM Pipeline', 'Rank Simulator'],
        icon: <Megaphone size={24} />
    }
];

const MENTORSHIP_ADDON = {
    id: 'mentorship',
    title: 'Mentorship & Guidance',
    description: 'Direct access to expert mentorship for your business foundation.',
    priceOneTime: 249.99,
    priceMonthly: 0,
    icon: <Shield size={24} />
};

import { supabase } from '@/lib/supabase';

export default function GetStartedPage() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Selection State
    const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
    const [addMentorship, setAddMentorship] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const toggleDivision = (id: string) => {
        if (selectedDivisions.includes(id)) {
            setSelectedDivisions(selectedDivisions.filter(d => d !== id));
        } else {
            setSelectedDivisions([...selectedDivisions, id]);
        }
    };

    // Calculations
    let oneTimeTotal = 0;
    let monthlyTotal = 0;

    // Business Division (Base) is technically FREE but always included in the logic
    // Add Mentorship if selected
    if (addMentorship) {
        oneTimeTotal += MENTORSHIP_ADDON.priceOneTime;
    }

    // Add Selected Divisions
    selectedDivisions.forEach(divId => {
        const div = DIVISIONS.find(d => d.id === divId);
        if (div) {
            oneTimeTotal += div.priceOneTime;
            monthlyTotal += div.priceMonthly;
        }
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const [signupSuccess, setSignupSuccess] = useState(false);

    const handleCreateAccount = async () => {
        setError(null);
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        phone: formData.phone,
                        selected_divisions: selectedDivisions,
                        add_mentorship: addMentorship
                    }
                }
            });

            if (error) throw error;

            setSignupSuccess(true);

            // Redirect to login page after a short delay to show success
            setTimeout(() => {
                router.push('/login?registered=true');
            }, 3000);

        } catch (err: any) {
            console.error("Signup failed:", err);
            setError(err.message || "Failed to create account");
            setLoading(false);
        }
    };

    if (signupSuccess) {
        return (
            <div className="get-started-page flex items-center justify-center p-8">
                <div className="glass-panel p-12 max-w-md w-full text-center animate-fade-in-up">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check size={40} className="text-green-500" />
                    </div>
                    <h1 className="text-3xl font-black mb-4">Account Created!</h1>
                    <p className="text-secondary mb-8 leading-relaxed">
                        Initializing your ecosystem protocols.
                        {!supabase.auth.getSession() && " Please check your email inbox to verify your account before accessing the full terminal."}
                    </p>
                    <div className="loading-bar-mini mb-4">
                        <div className="loading-fill-animated"></div>
                    </div>
                    <p className="text-[10px] uppercase tracking-widest font-bold opacity-50">Redirecting to Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="get-started-page animate-fade-in">
            <div className="gs-container">

                {/* LEFT COLUMN: Main Content */}
                <div className="selection-area">
                    {step === 1 ? (
                        <>
                            <div className="gs-header">
                                <h1>Build Your Ecosystem</h1>
                                <p>Select the divisions and tools you need to launch your vision.</p>
                            </div>

                            {/* Base Business Division (Always Active/Free) */}
                            <div className="division-card base-card selected mb-6">
                                <div className="div-header">
                                    <div className="div-icon base-gradient"><Rocket size={24} /></div>
                                    <div className="div-info">
                                        <h4>Business Division</h4>
                                        <p>Your foundation. LLC blueprints, community access, and education.</p>
                                    </div>
                                    <div className="div-price">
                                        <span className="price-tag free">INCLUDED</span>
                                    </div>
                                </div>

                                {/* Mentorship Upsell */}
                                <div
                                    className={`upsell-row ${addMentorship ? 'active' : ''}`}
                                    onClick={() => setAddMentorship(!addMentorship)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`checkbox ${addMentorship ? 'checked' : ''}`}>
                                            {addMentorship && <Check size={12} />}
                                        </div>
                                        <div className="flex-1">
                                            <span className="upsell-title">Add Professional Mentorship & Guidance</span>
                                            <span className="upsell-desc">One-time expert consultation session.</span>
                                        </div>
                                        <span className="upsell-price">+$249.99</span>
                                    </div>
                                </div>
                            </div>

                            <h3 className="section-title">Specialized Divisions</h3>
                            <div className="divisions-grid">
                                {DIVISIONS.map(div => (
                                    <div
                                        key={div.id}
                                        className={`division-card selectable ${selectedDivisions.includes(div.id) ? 'selected' : ''}`}
                                        onClick={() => toggleDivision(div.id)}
                                    >
                                        <div className="div-header">
                                            <div className="div-icon">{div.icon}</div>
                                            <div className="div-info">
                                                <h4>{div.title}</h4>
                                                <p>{div.description}</p>
                                            </div>
                                            <div className="div-select-indicator">
                                                {selectedDivisions.includes(div.id) && <Check size={16} />}
                                            </div>
                                        </div>
                                        <div className="div-pricing-row">
                                            <div className="price-item">
                                                <span className="label">One-Time</span>
                                                <span className="value">${div.priceOneTime.toFixed(0)}</span>
                                            </div>
                                            <div className="price-divider"></div>
                                            <div className="price-item">
                                                <span className="label">Monthly</span>
                                                <span className="value">${div.priceMonthly.toFixed(0)}/mo</span>
                                            </div>
                                        </div>
                                        <ul className="div-features">
                                            {div.features.map((feat, idx) => (
                                                <li key={idx}><Check size={12} /> {feat}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        // STEP 2: ACCOUNT CREATION
                        <div className="account-form-section animate-fade-in-up">
                            <button className="back-btn" onClick={() => setStep(1)}>
                                <ChevronLeft size={16} /> Back to Selection
                            </button>

                            <div className="gs-header">
                                <h1>Create Your Account</h1>
                                <p>Secure your identity and finalize your ecosystem configuration.</p>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <div className="input-wrapper">
                                        <User size={18} />
                                        <input
                                            type="text"
                                            name="firstName"
                                            placeholder="Enter first name"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <div className="input-wrapper">
                                        <User size={18} />
                                        <input
                                            type="text"
                                            name="lastName"
                                            placeholder="Enter last name"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-group full">
                                    <label>Email Address</label>
                                    <div className="input-wrapper">
                                        <Mail size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="name@example.com"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-group full">
                                    <label>Phone Number</label>
                                    <div className="input-wrapper">
                                        <Phone size={18} />
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="(555) 000-0000"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <div className="input-wrapper">
                                        <Lock size={18} />
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Create a password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Confirm Password</label>
                                    <div className="input-wrapper">
                                        <Lock size={18} />
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Confirm password"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN: Summary & Action */}
                <div className="order-summary">
                    <div className="summary-header">
                        <h3>Your Configuration</h3>
                        <div className="step-indicator">Step {step} of 2</div>
                    </div>

                    <div className="summary-section">
                        {/* BASE */}
                        <div className="summary-row">
                            <span>Business Division (Base)</span>
                            <span className="text-green-400">FREE</span>
                        </div>
                        {addMentorship && (
                            <div className="summary-row animate-fade-in">
                                <span>Mentorship Addon</span>
                                <span>${MENTORSHIP_ADDON.priceOneTime.toFixed(2)}</span>
                            </div>
                        )}

                        {/* SELECTED DIVISIONS */}
                        {selectedDivisions.map(divId => {
                            const div = DIVISIONS.find(d => d.id === divId);
                            if (!div) return null;
                            return (
                                <React.Fragment key={div.id}>
                                    <div className="summary-row animate-fade-in sub-header">
                                        <span className="font-bold text-white">{div.title}</span>
                                    </div>
                                    <div className="summary-row sub-item">
                                        <span>One-Time Setup</span>
                                        <span>${div.priceOneTime.toFixed(2)}</span>
                                    </div>
                                    <div className="summary-row sub-item">
                                        <span>Monthly Subscription</span>
                                        <span>${div.priceMonthly.toFixed(2)}/mo</span>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>

                    <div className="summary-footer">
                        <div className="total-group today">
                            <div className="total-row">
                                <span className="label">Total Due Today</span>
                                <span className="value grand">${oneTimeTotal.toFixed(2)}</span>
                            </div>
                            <p className="footer-note">Includes all one-time setup fees.</p>
                        </div>

                        <div className="total-group recurrent">
                            <div className="total-row">
                                <span className="label">Monthly Recurring</span>
                                <span className="value">${monthlyTotal.toFixed(2)}</span>
                            </div>
                            <p className="footer-note">Unbilled today. Starts in 30 days.</p>
                        </div>
                    </div>

                    {step === 1 ? (
                        <button className="btn-checkout" onClick={() => setStep(2)}>
                            Continue <ArrowRight size={18} />
                        </button>
                    ) : (
                        <button className="btn-checkout" onClick={handleCreateAccount}>
                            Create Account & Pay <CreditCard size={18} />
                        </button>
                    )}

                    <div className="trust-footer">
                        <Shield size={14} />
                        <span>Secured by Verstige Encryption Mesh</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
