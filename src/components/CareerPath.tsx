"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Lock, Trophy } from 'lucide-react';
import '@/styles/pages/CareerPath.css';

const CareerPath = () => {
    const nextLevel = "Bronze Executive Director";
    const requirements = [
        { label: "Personal Premium", current: 1250, target: 2100, unit: "Prem", completed: false },
        { label: "ED Legs", current: 0, target: 1, unit: "Legs", completed: false },
        { label: "Retention", current: 84, target: 65, unit: "%", completed: true },
    ];

    return (
        <div className="career-path-container">
            <div className="career-header">
                <div>
                    <h3 className="text-title" style={{ fontSize: '1.5rem' }}>Next Career Level</h3>
                    <p className="text-subtitle" style={{ fontSize: '0.9rem' }}>Unlock higher commissions and overrides</p>
                </div>
                <div className="next-level-badge">
                    {nextLevel} <Lock size={20} style={{ display: 'inline', verticalAlign: 'text-bottom', opacity: 0.8 }} />
                </div>
            </div>

            <div className="requirement-grid">
                {requirements.map((req, i) => (
                    <motion.div
                        key={i}
                        className={`req-card ${req.completed ? 'completed' : ''}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + (i * 0.1) }}
                    >
                        {req.completed && <CheckCircle size={16} className="req-status-icon" />}
                        <div className="text-label">{req.label}</div>
                        <div className="req-value">
                            {req.current.toLocaleString()} <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--secondary)' }}> / {req.target.toLocaleString()} {req.unit}</span>
                        </div>
                        <div className="req-progress-bar">
                            <div
                                className="req-progress-fill"
                                style={{
                                    width: `${Math.min((req.current / req.target) * 100, 100)}%`,
                                    background: req.completed ? 'var(--fintech-green)' : 'var(--accent)'
                                }}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <span className="text-label" style={{ color: 'var(--accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Trophy size={16} /> View Full Compensation Plan
                </span>
            </div>
        </div>
    );
};

export default CareerPath;
