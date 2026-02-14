"use client";
import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    PanelsTopLeft,
    CheckCircle2,
    ChevronRight,
    Globe,
    Cpu
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '@/styles/pages/Business.css';

const digitalSteps = [
    {
        id: 'step1',
        title: 'Domain Acquisition',
        desc: "Secure your digital real estate. A premium .com or .io domain builds instant authority with partners and clients.",
        tasks: [
            "Search for short, memorable domain names",
            "Purchase via Namecheap or GoDaddy",
            "Setup professional email (you@company.com)"
        ]
    },
    {
        id: 'step2',
        title: 'Web Architecture',
        desc: "Your website is your 24/7 storefront. It must be optimized for conversion and mobile responsiveness.",
        tasks: [
            "Select a high-performance framework (Next.js/React)",
            "Draft core landing page copy",
            "Deploy live version (Vercel/Netlify)"
        ]
    },
    {
        id: 'step3',
        title: 'CRM Integration',
        desc: "The brain of your operation. Automatically track leads, sales, and customer interactions.",
        tasks: [
            "Choose CRM (Salesforce, HubSpot, or Custom)",
            "Connect lead forms to CRM database",
            "Setup automated welcome email sequence"
        ]
    },
    {
        id: 'step4',
        title: 'Analytics & Tracking',
        desc: "Data is the new oil. Tracking user behavior allows you to optimize ad spend and user experience.",
        tasks: [
            "Install Google Analytics 4",
            "Install Meta Pixel for retargeting",
            "Verify data flow in dashboard"
        ]
    }
];

export default function DigitalPage() {
    const router = useRouter();
    const [completedTasks, setCompletedTasks] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('digital_progress');
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

            localStorage.setItem('digital_progress', JSON.stringify(newSet));
            return newSet;
        });
    };

    const isStepComplete = (stepTasks: string[]) => {
        return stepTasks.every(t => completedTasks.includes(t));
    };

    const progressPercentage = Math.round((completedTasks.length / digitalSteps.flatMap(s => s.tasks).length) * 100);

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
                        <PanelsTopLeft size={48} className="text-indigo-400" />
                    </div>
                    <h1>Digital Protocol</h1>
                    <p className="hero-desc">
                        Deploying your operating system. Your digital footprint must be automated, tracked, and scalable to handle global traffic.
                    </p>

                    <div className="protocol-meta">
                        <div className="meta-item">
                            <Globe size={20} className="text-secondary" />
                            <span>Global Access</span>
                        </div>
                        <div className="meta-item">
                            <Cpu size={20} className="text-secondary" />
                            <span>Automation</span>
                        </div>
                    </div>

                    <div className="pro-tip-box mt-8">
                        <h5>Strategy Advice</h5>
                        <p>
                            Focus on speed and clarity over flashy design. A 1-second delay in page load can drop conversions by 7%. Keep your sales funnel lightweight and mobile-first.
                        </p>
                    </div>
                </div>

                {/* Steps Timeline */}
                <div className="steps-container">
                    {digitalSteps.map((step, index) => {
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
