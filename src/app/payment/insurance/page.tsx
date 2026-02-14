"use client";
'use strict';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, CheckCircle2, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import '@/styles/pages/Business.css'; // Re-use business styles for consistency

export default function InsurancePaymentPage() {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePurchase = () => {
        setIsProcessing(true);
        // Simulate payment processing
        setTimeout(() => {
            localStorage.setItem('business_insurance_verified', 'true');
            router.push('/dashboard/business/ip');
        }, 2000);
    };

    return (
        <div className="business-page pt-20">
            <div className="business-content-width max-w-2xl mx-auto">
                <Link href="/dashboard/business" className="back-link mb-8">
                    <ArrowLeft size={20} />
                    <span>Back to Business Hub</span>
                </Link>

                <div className="glass-panel p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

                    <div className="flex justify-center mb-8">
                        <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
                            <ShieldCheck size={48} className="text-blue-400" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-center mb-4 text-white">Business Liability Insurance</h1>
                    <p className="text-secondary text-center mb-8 text-lg">
                        Protect your assets with our comprehensive coverage plan.
                        Required for Intellectual Property validation.
                    </p>

                    <div className="bg-white/5 rounded-xl p-6 mb-8 border border-white/10">
                        <div className="flex justify-between items-end mb-4 border-b border-white/10 pb-4">
                            <span className="font-bold text-white">Premium Plan</span>
                            <span className="text-3xl font-bold text-green-400">$99.00<span className="text-sm text-secondary font-normal">/year</span></span>
                        </div>
                        <ul className="space-y-3">
                            {['General Liability Coverage', 'IP Infringement Protection', 'Legal Defense Costs', 'Instant Policy Generation'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-secondary">
                                    <CheckCircle2 size={16} className="text-green-400" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button
                        onClick={handlePurchase}
                        disabled={isProcessing}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Processing Payment...
                            </>
                        ) : (
                            <>
                                Purchase Protection Plan <ArrowRight size={20} />
                            </>
                        )}
                    </button>

                    <p className="text-center text-xs text-secondary mt-6">
                        Secure 256-bit encrypted transaction. By purchasing, you agree to our Terms of Service.
                    </p>
                </div>
            </div>
        </div>
    );
}
