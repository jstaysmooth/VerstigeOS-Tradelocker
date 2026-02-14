"use client";
import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Shield,
    CheckCircle2,
    ChevronRight,
    Lock,
    Award
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '@/styles/pages/Business.css';

const ipSteps = [
    {
        id: 'step1',
        title: 'Trademark Search & Filing',
        desc: "Secure the exclusive rights to your brand name and logo usage nationwide.",
        tasks: [
            "Perform TESS search on USPTO.gov",
            "Identify appropriate International Class for goods/services",
            "File TEAS Standard application"
        ]
    },
    {
        id: 'step2',
        title: 'Copyright Registration',
        desc: "Protect your original works of authorship (code, content, design) from unauthorized reproduction.",
        tasks: [
            "Identify core assessable assets",
            "Register via eco.copyright.gov",
            "Add copyright notices to all footers (© 2024)"
        ]
    },
    {
        id: 'step3',
        title: 'Non-Disclosure Agreements (NDAs)',
        desc: "Legal gag orders that prevent employees and partners from stealing your proprietary info.",
        tasks: [
            "Draft standard Mutual NDA template",
            "Require signature before revealing sensitive IP",
            "Store signed copies in secure vault"
        ]
    },
    {
        id: 'step4',
        title: 'Business Insurance',
        desc: "The final shield. Protects against lawsuits, errors, and unforeseen liabilities.",
        tasks: [
            "Quote General Liability Insurance",
            "Quote Errors & Omissions (E&O) Insurance",
            "Bind policy and download Certificate of Insurance (COI)"
        ]
    },
];

export default function IPPage() {
    const router = useRouter();
    const [completedTasks, setCompletedTasks] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('ip_progress');
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

            localStorage.setItem('ip_progress', JSON.stringify(newSet));
            return newSet;
        });
    };

    const isStepComplete = (stepTasks: string[]) => {
        return stepTasks.every(t => completedTasks.includes(t));
    };

    const progressPercentage = Math.round((completedTasks.length / ipSteps.flatMap(s => s.tasks).length) * 100);

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
                        <Shield size={48} className="text-amber-400" />
                    </div>
                    <h1>IP Protocol</h1>
                    <p className="hero-desc">
                        Fortifying your castle. Intellectual Property protection ensures your brand equity and valuation cannot be diluted by competitors.
                    </p>

                    <div className="protocol-meta">
                        <div className="meta-item">
                            <Lock size={20} className="text-secondary" />
                            <span>Asset Defense</span>
                        </div>
                        <div className="meta-item">
                            <Award size={20} className="text-secondary" />
                            <span>Brand Value</span>
                        </div>
                    </div>

                    <div className="pro-tip-box mt-8">
                        <h5>Strategy Advice</h5>
                        <p>
                            Always trademark your brand name *before* aggressive scaling. Defending your identity against a 'Cease & Desist' later can cost 10x more than a proactive filing today.
                        </p>
                    </div>
                </div>

                {/* Steps Timeline */}
                <div className="steps-container">
                    {ipSteps.map((step, index) => {
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
                            {progressPercentage === 100 ? 'Protocol Complete - Finish Series' : 'Complete All Tasks to Proceed'}
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
