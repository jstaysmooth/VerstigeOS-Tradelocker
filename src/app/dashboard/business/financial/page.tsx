"use client";
import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    CreditCard,
    CheckCircle2,
    ChevronRight,
    Landmark,
    TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '@/styles/pages/Business.css';

const financialSteps = [
    {
        id: 'step1',
        title: 'Open Business Checking',
        desc: "Co-mingling funds destroys your corporate protection. You must have a dedicated institutional account.",
        tasks: [
            "Research banks (Chase, Mercury, Relay)",
            "Submit Articles of Org & EIN Letter",
            "Make an initial deposit to activate the account"
        ]
    },
    {
        id: 'step2',
        title: 'D-U-N-S Registry',
        desc: "Your Dun & Bradstreet number is the social security number for your business credit profile.",
        tasks: [
            "Search D&B database for your entity",
            "Submit company profile if not found",
            "Verify business phone and address"
        ]
    },
    {
        id: 'step3',
        title: 'Net-30 Vendor Accounts',
        desc: "Establish trade lines that report to credit bureaus to generate your Paydex score.",
        tasks: [
            "Open account with Uline or Quill",
            "Open account with Granger",
            "Purchase $50+ of supplies and pay invoice early"
        ]
    },
    {
        id: 'step4',
        title: 'Merchant Processing',
        desc: "Setup the infrastructure to accept payments globally via credit cards.",
        tasks: [
            "Create Stripe or Square account",
            "Link business checking for payouts",
            "Configure earnings payout schedule to 'Daily'"
        ]
    }
];

export default function FinancialPage() {
    const router = useRouter();
    const [completedTasks, setCompletedTasks] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('financial_progress');
        if (saved) {
            try {
                setCompletedTasks(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load progress", e);
            }
        }
    }, []);

    const toggleTask = (task: string) => {
        setCompletedTasks(prev => {
            const newSet = prev.includes(task)
                ? prev.filter(t => t !== task)
                : [...prev, task];

            localStorage.setItem('financial_progress', JSON.stringify(newSet));
            return newSet;
        });
    };

    const isStepComplete = (stepTasks: string[]) => {
        return stepTasks.every(t => completedTasks.includes(t));
    };

    const progressPercentage = Math.round((completedTasks.length / financialSteps.flatMap(s => s.tasks).length) * 100);

    return (
        <div className="business-detail-page animate-fade-in">
            {/* Header / Nav */}
            <div className="detail-header">
                <Link href="/dashboard/business" className="back-link">
                    <ArrowLeft size={20} />
                    <span>Back to Division</span>
                </Link>

                {/* Circular Progress & Status */}
                <div className="progress-indicator">
                    <span className="label">Protocol Progress</span>
                    <div className="progress-track">
                        <div className={`progress-fill ${progressPercentage === 100 ? 'complete' : ''}`} style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <span className={`val ${progressPercentage === 100 ? 'text-green-400' : ''}`}>{progressPercentage}%</span>
                </div>
            </div>

            {/* Content with Sidebar */}
            <div className="detail-content">
                {/* Hero Side */}
                <div className="detail-hero">
                    <div className="hero-icon">
                        <CreditCard size={48} className="text-emerald-400" />
                    </div>
                    <h1>Financial Protocol</h1>
                    <p className="hero-desc">
                        Constructing the fiscal railways for revenue collection and credit scaling. Separation of funds is non-negotiable for liability protection.
                    </p>

                    <div className="protocol-meta">
                        <div className="meta-item">
                            <Landmark size={20} className="text-secondary" />
                            <span>Institutional Banking</span>
                        </div>
                        <div className="meta-item">
                            <TrendingUp size={20} className="text-secondary" />
                            <span>Credit Scaling</span>
                        </div>
                    </div>

                    <div className="pro-tip-box mt-8">
                        <h5>Strategy Advice</h5>
                        <p>
                            Never personally guarantee your first vendor accounts. Stick to 'Net-30' terms to build your company's independent credit score (Paydex) without risking your personal SSN.
                        </p>
                    </div>
                </div>

                {/* Steps Timeline */}
                <div className="steps-container">
                    {financialSteps.map((step, index) => {
                        const allComplete = isStepComplete(step.tasks);

                        return (
                            <div key={step.id} className={`detail-step-card glass-panel ${allComplete ? 'completed' : ''}`}>
                                <div className="step-header">
                                    <div className="step-number">{index + 1 < 10 ? `0${index + 1}` : index + 1}</div>
                                    <div className="step-titles">
                                        <h3>{step.title}</h3>
                                        <p>{step.desc}</p>
                                    </div>
                                    {allComplete && <CheckCircle2 className="text-green-500" size={24} />}
                                </div>

                                <div className="step-checklist">
                                    {step.tasks.map((task, i) => (
                                        <div
                                            key={i}
                                            className={`checklist-row ${completedTasks.includes(task) ? 'checked' : ''}`}
                                            onClick={() => toggleTask(task)}
                                        >
                                            <div className="checkbox-custom">
                                                {completedTasks.includes(task) && <div className="check-dot"></div>}
                                            </div>
                                            <span>{task}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    <div className="completion-action">
                        <button
                            className={`btn-complete-protocol ${progressPercentage === 100 ? 'active' : ''}`}
                            disabled={progressPercentage < 100}
                            onClick={() => router.push('/dashboard/business')}
                        >
                            {progressPercentage === 100 ? 'Protocol Complete - Return to Hub' : 'Complete All Tasks to Proceed'}
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
