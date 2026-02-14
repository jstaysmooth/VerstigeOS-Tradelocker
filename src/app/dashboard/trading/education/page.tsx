"use client";
import React, { useState } from 'react';
import {
    BookOpen,
    Play,
    FileText,
    ChevronRight,
    Globe,
    Bitcoin,
    TrendingUp,
    Package,
    ArrowLeft,
    CheckCircle,
    Clock,
    Lock
} from 'lucide-react';
import Link from 'next/link';
import '@/styles/pages/TradingEducation.css';

const COURSES = [
    {
        id: 'forex',
        title: 'Forex Mastery',
        desc: 'Master the global currency markets with institutional liquidity analysis.',
        icon: <Globe size={24} />,
        modules: 12,
        duration: '8h 45m',
        lessons: [
            { title: 'The Mechanics of Currency Pairs', type: 'video', status: 'completed' },
            { title: 'Central Bank Protocols & Interest Rates', type: 'video', status: 'active' },
            { title: 'Institutional Order Flow analysis', type: 'pdf', status: 'locked' }
        ]
    },
    {
        id: 'crypto',
        title: 'Digital Asset Mesh',
        desc: 'Understanding blockchain ecosystems, DeFi yields, and crypto cycle protocols.',
        icon: <Bitcoin size={24} />,
        modules: 8,
        duration: '6h 20m',
        lessons: [
            { title: 'Bitcoin Architecture', type: 'video', status: 'locked' }
        ]
    },
    {
        id: 'indices',
        title: 'Equity Indices Scaling',
        desc: 'Trading the S&P 500, NAS100, and global equity mesh with precision.',
        icon: <TrendingUp size={24} />,
        modules: 6,
        duration: '4h 15m',
        lessons: []
    },
    {
        id: 'commodities',
        title: 'Commodity Flow',
        desc: 'Gold, Oil, and global resource trading strategies for visionaries.',
        icon: <Package size={24} />,
        modules: 5,
        duration: '3h 50m',
        lessons: []
    }
];

export default function TradingEducationPage() {
    const [selectedCourse, setSelectedCourse] = useState(COURSES[0]);

    return (
        <div className="education-platform animate-fade-in">
            <header className="edu-header">
                <Link href="/dashboard/trading" className="back-link">
                    <ArrowLeft size={18} /> Back to Division
                </Link>
                <div className="header-content mt-6">
                    <h1>Verstige Academy</h1>
                    <p>Institutional education engineered for elite market execution.</p>
                </div>
            </header>

            <div className="edu-container">
                <aside className="edu-sidebar">
                    <div className="glass-panel p-4">
                        <h3>Curriculum Pathways</h3>
                        <div className="course-list mt-4">
                            {COURSES.map(course => (
                                <div
                                    key={course.id}
                                    className={`course-nav-item ${selectedCourse.id === course.id ? 'active' : ''}`}
                                    onClick={() => setSelectedCourse(course)}
                                >
                                    <div className="course-icon">{course.icon}</div>
                                    <div className="course-info">
                                        <h4>{course.title}</h4>
                                        <div className="meta">
                                            <span>{course.modules} Modules</span>
                                            <span>{course.duration}</span>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="arrow" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel p-6 mt-6 upgrade-card">
                        <Lock size={32} className="text-accent mb-4" />
                        <h4>Unlock Visionary Tier</h4>
                        <p className="text-sm text-secondary mb-4">Gain access to the full institutional library and live strategy sessions.</p>
                        <button className="btn-primary btn-sm full-width">Upgrade Membership</button>
                    </div>
                </aside>

                <main className="edu-content">
                    <div className="selected-course-hero glass-panel">
                        <div className="hero-badge">PHASE 01 • BASICS</div>
                        <h2>{selectedCourse.title}</h2>
                        <p>{selectedCourse.desc}</p>

                        <div className="course-progress-bar mt-6">
                            <div className="progress-info mb-2 flex-between">
                                <span className="text-xs font-bold uppercase tracking-widest">Your Completion</span>
                                <span className="text-xs font-mono">15%</span>
                            </div>
                            <div className="progress-track">
                                <div className="progress-fill" style={{ width: '15%' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="lesson-mesh mt-8">
                        <h3>Course Modules</h3>
                        <div className="module-grid mt-4">
                            {selectedCourse.lessons.length > 0 ? (
                                selectedCourse.lessons.map((lesson, idx) => (
                                    <div key={idx} className={`lesson-card glass-panel ${lesson.status}`}>
                                        <div className="lesson-type">
                                            {lesson.type === 'video' ? <Play size={18} /> : <FileText size={18} />}
                                        </div>
                                        <div className="lesson-details">
                                            <h4>{lesson.title}</h4>
                                            <div className="lesson-meta">
                                                <span><Clock size={12} /> 15 min</span>
                                                <span className="dot" />
                                                <span className="status-label">{lesson.status.toUpperCase()}</span>
                                            </div>
                                        </div>
                                        <div className="lesson-action">
                                            {lesson.status === 'completed' && <CheckCircle size={20} className="text-green-500" />}
                                            {lesson.status === 'active' && <button className="btn-tiny">Resume</button>}
                                            {lesson.status === 'locked' && <Lock size={18} className="text-secondary" />}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="glass-panel p-12 text-center opacity-50">
                                    <BookOpen size={48} className="mx-auto mb-4" />
                                    <p>Curriculum under final engineering review.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
