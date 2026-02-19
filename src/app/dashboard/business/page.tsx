"use client";
import React, { useState, useEffect } from 'react';
import {
    FileCheck,
    CreditCard as BankIcon,
    PanelsTopLeft,
    Shield,
    ArrowRight,
    CheckCircle2
} from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '@/styles/pages/Business.css';
import DivisionGuard from '@/components/DivisionGuard';

const businessSections = [
    {
        id: 'formation',
        title: 'Formation & Legal',
        subtitle: 'The Corporate Veil',
        icon: <FileCheck className="text-blue-400" size={40} />,
        description: "Establish your legal entity, secure your EIN, and draft operating agreements to protect personal assets.",
        path: '/dashboard/business/formation',
        storageKey: 'formation_progress',
        totalTasks: 12 // 4 steps * 3 tasks approx
    },
    {
        id: 'financial',
        title: 'Financial Foundation',
        subtitle: 'Institutional Banking',
        icon: <BankIcon className="text-emerald-400" size={40} />,
        description: "Setup business banking, build Paydex score, and integrate payment gateways for global revenue.",
        path: '/dashboard/business/financial',
        storageKey: 'financial_progress',
        totalTasks: 12
    },
    {
        id: 'digital',
        title: 'Digital Infrastructure',
        subtitle: 'Operating System',
        icon: <PanelsTopLeft className="text-indigo-400" size={40} />,
        description: "Launch your domain, CRM, and tracking pixels to create an automated growth machine.",
        path: '/dashboard/business/digital',
        storageKey: 'digital_progress',
        totalTasks: 12
    },
    {
        id: 'ip',
        title: 'Intellectual Property',
        subtitle: 'Asset Protection',
        icon: <Shield className="text-amber-400" size={40} />,
        description: "Secure trademarks, copyrights, and NDAs to defend your brand equity and valuation.",
        path: '/dashboard/business/ip',
        storageKey: 'ip_progress',
        totalTasks: 12
    }
];

export default function BusinessPage() {
    const router = useRouter();
    const [progress, setProgress] = useState<Record<string, number>>({});
    const [showInsuranceModal, setShowInsuranceModal] = useState(false);

    useEffect(() => {
        const currentProgress: Record<string, number> = {};
        businessSections.forEach(section => {
            const saved = localStorage.getItem(section.storageKey);
            if (saved) {
                const tasks = JSON.parse(saved);
                currentProgress[section.id] = Math.round((tasks.length / section.totalTasks) * 100);
            } else {
                currentProgress[section.id] = 0;
            }
        });
        setProgress(currentProgress);
    }, []);

    const handleProtocolClick = (e: React.MouseEvent, sectionId: string, path: string) => {
        // Special logic for IP Protocol
        if (sectionId === 'ip') {
            const formationComplete = (progress['formation'] || 0) === 100;
            const financialComplete = (progress['financial'] || 0) === 100;
            const digitalComplete = (progress['digital'] || 0) === 100;
            const isVerified = localStorage.getItem('business_insurance_verified') === 'true';

            if (formationComplete && financialComplete && digitalComplete && !isVerified) {
                e.preventDefault();
                setShowInsuranceModal(true);
                return;
            }
        }
        // Otherwise let the Link behave normally
    };

    const handleInsuranceResponse = (hasPurchased: boolean) => {
        setShowInsuranceModal(false);
        if (hasPurchased) {
            router.push('/dashboard/business/ip');
        } else {
            router.push('/payment/insurance');
        }
    };

    return (
        <DivisionGuard division="business">
            <div className="business-page">
                <DashboardHeader
                    title="Business Division"
                    subtitle="Select a protocol to begin your institutional deployment."
                />

                <div className="business-content-width">
                    <div className="onboarding-hero animate-fade-in-up glass-panel mb-12 p-8 border-l-4 border-l-accent">
                        <h2 className="text-xl font-bold mb-2">Master Onboarding</h2>
                        <p className="text-secondary leading-relaxed max-w-3xl">
                            Follow the sequential roadmap below. Completing each protocol unlocks the next stage of your business evolution.
                            Your progress is saved locally.
                        </p>
                    </div>

                    {/* Hub Grid */}
                    <div className="business-hub-grid">
                        {businessSections.map((section) => {
                            const isComplete = progress[section.id] === 100;
                            const hasStarted = (progress[section.id] || 0) > 0;

                            return (
                                <Link
                                    href={section.path}
                                    key={section.id}
                                    className={`hub-card glass-panel ${isComplete ? 'complete' : ''} ${hasStarted ? 'active' : ''}`}
                                    onClick={(e) => handleProtocolClick(e, section.id, section.path)}
                                >
                                    <div className="hub-card-content">
                                        <div className="hub-icon-wrapper">
                                            {section.icon}
                                        </div>

                                        <div className="hub-info">
                                            <div className="hub-subtitle">{section.subtitle}</div>
                                            <h3 className="hub-title">{section.title}</h3>
                                            <p className="hub-desc">{section.description}</p>
                                        </div>

                                        <div className="hub-action">
                                            <div className="btn-explore">
                                                <ArrowRight size={24} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hub-bg-glow"></div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Insurance Verification Modal */}
                {showInsuranceModal && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
                        <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-amber-500/30 rounded-3xl p-10 max-w-lg w-full shadow-2xl shadow-amber-500/10 relative animate-fade-in-up">
                            {/* Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center border-2 border-amber-500/30 shadow-lg shadow-amber-500/20">
                                    <Shield className="text-amber-400" size={40} />
                                </div>
                            </div>

                            {/* Title */}
                            <h2 className="text-3xl font-bold text-center mb-4 text-white">
                                Verification Required
                            </h2>

                            {/* Description */}
                            <p className="text-gray-300 text-center mb-3 text-base leading-relaxed">
                                To unlock <span className="text-amber-400 font-semibold">Intellectual Property Protection</span>, you must have business liability coverage in place.
                            </p>

                            {/* Question */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-center">
                                <p className="text-lg font-bold text-white mb-2">
                                    Have you purchased your Business Insurance Plan?
                                </p>
                                <p className="text-2xl font-bold text-green-400">
                                    $99.00 <span className="text-sm text-gray-400 font-normal">/year</span>
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => handleInsuranceResponse(true)}
                                    className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-900/30 text-lg flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 size={22} />
                                    Yes, I have coverage
                                </button>
                                <button
                                    onClick={() => handleInsuranceResponse(false)}
                                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-amber-500/30 text-lg flex items-center justify-center gap-2"
                                >
                                    <Shield size={22} />
                                    No, purchase now
                                </button>
                            </div>

                            {/* Footer Note */}
                            <p className="text-center text-xs text-gray-500 mt-6">
                                This verification ensures compliance with asset protection protocols.
                            </p>

                            {/* Close Button */}
                            <button
                                onClick={() => setShowInsuranceModal(false)}
                                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </DivisionGuard>
    );
}
