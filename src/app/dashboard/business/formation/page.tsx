"use client";
import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    FileCheck,
    CheckCircle2,
    ChevronRight,
    FileText,
    ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '@/styles/pages/Business.css';

const formationSteps = [
    {
        id: 'step1',
        title: 'Entity Selection & Name Search',
        desc: "Determine if an LLC is the right structure and verify your business name availability with your state's Secretary of State database.",
        tasks: [
            "Decide on LLC vs. Corp (LLC recommended for most Builders)",
            "Perform name search on Secretary of State website",
            "Verify URL/Domain availability for the name"
        ]
    },
    {
        id: 'step2',
        title: 'File Articles of Organization',
        desc: "This is the birth certificate of your business. Filing this document officially creates your legal entity.",
        tasks: [
            "Locate specific filing portal for your State",
            "Pay the state filing fee (usually $50 - $200)",
            "Receive potential immediate digital confirmation or wait for mail"
        ]
    },
    {
        id: 'step3',
        title: 'Obtain EIN (Tax ID)',
        desc: "Your Employer Identification Number is required for banking. Do NOT use third-party services that charge for this; it is free from the IRS.",
        tasks: [
            "Visit IRS.gov EIN Assistant during business hours",
            "Select 'Limited Liability Company'",
            "Download and save the CP-575 confirmation letter immediately"
        ]
    },
    {
        id: 'step4',
        title: 'Operating Agreement & BOI',
        desc: "Internal governance documents and mandatory federal transparency reporting to FinCEN.",
        tasks: [
            "Draft Operating Agreement (defines ownership %)",
            "File Beneficial Ownership Information (BOI) report at fincen.gov",
            "Store all documents in a secure digital vault"
        ]
    }
];

export default function FormationPage() {
    const router = useRouter();
    const [completedTasks, setCompletedTasks] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('formation_progress');
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

            localStorage.setItem('formation_progress', JSON.stringify(newSet));
            return newSet;
        });
    };

    const isStepComplete = (stepTasks: string[]) => {
        return stepTasks.every(t => completedTasks.includes(t));
    };

    const progressPercentage = Math.round((completedTasks.length / formationSteps.flatMap(s => s.tasks).length) * 100);

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
                        <FileCheck size={48} className="text-blue-400" />
                    </div>
                    <h1>Formation Protocol</h1>
                    <p className="hero-desc">
                        Constructing the legal shell for your enterprise. This process separates you from your business, creating the "Corporate Veil" that protects personal assets.
                    </p>

                    <div className="protocol-meta">
                        <div className="meta-item">
                            <ShieldCheck size={20} className="text-secondary" />
                            <span>Liability Protection</span>
                        </div>
                        <div className="meta-item">
                            <FileText size={20} className="text-secondary" />
                            <span>Tax Independence</span>
                        </div>
                    </div>

                    <div className="pro-tip-box mt-8">
                        <h5>Strategy Advice</h5>
                        <p>
                            Filing in your home state is usually best to avoid dual-filing fees. Only consider Delaware or Wyoming if you plan to raise venture capital or need extreme privacy.
                        </p>
                    </div>
                </div>

                {/* Steps Timeline */}
                <div className="steps-container">
                    {formationSteps.map((step, index) => {
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
