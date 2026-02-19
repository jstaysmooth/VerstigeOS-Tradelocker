"use client";

import React from 'react';
import Link from 'next/link';
import { Lock, ArrowRight, TrendingUp, Briefcase, DollarSign } from 'lucide-react';

interface DivisionAccessDeniedProps {
    division: 'trading' | 'business' | 'sales';
}

const DIVISION_CONFIG = {
    trading: {
        label: 'Trading Division',
        icon: <DollarSign size={48} />,
        color: 'var(--fintech-green, #10b981)',
        glow: 'rgba(16, 185, 129, 0.15)',
        border: 'rgba(16, 185, 129, 0.25)',
        description: 'Access live signals, execute trades, manage your portfolio and view real-time analytics.',
        price: '$97/mo',
    },
    business: {
        label: 'Business Division',
        icon: <Briefcase size={48} />,
        color: '#6366f1',
        glow: 'rgba(99, 102, 241, 0.15)',
        border: 'rgba(99, 102, 241, 0.25)',
        description: 'LLC formation, IP protection, tax strategies, and full business infrastructure blueprints.',
        price: '$49/mo',
    },
    sales: {
        label: 'Sales Division',
        icon: <TrendingUp size={48} />,
        color: '#ef4444',
        glow: 'rgba(239, 68, 68, 0.15)',
        border: 'rgba(239, 68, 68, 0.25)',
        description: 'Unlock the full commission structure, rank tracker and monetization systems.',
        price: '$97/mo',
    },
};

export default function DivisionAccessDenied({ division }: DivisionAccessDeniedProps) {
    const config = DIVISION_CONFIG[division];

    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
        }}>
            <div style={{
                maxWidth: 520,
                width: '100%',
                background: 'rgba(12, 14, 20, 0.75)',
                backdropFilter: 'blur(24px)',
                border: `1px solid ${config.border}`,
                borderRadius: '1.75rem',
                padding: '3rem 2.5rem',
                textAlign: 'center',
                boxShadow: `0 0 80px ${config.glow}, 0 4px 40px rgba(0,0,0,0.5)`,
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Background glow orb */}
                <div style={{
                    position: 'absolute',
                    top: '-60px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: config.glow,
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                }} />

                {/* Lock badge */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: `${config.glow}`,
                    border: `1.5px solid ${config.border}`,
                    marginBottom: '1.5rem',
                    position: 'relative',
                }}>
                    <Lock size={32} style={{ color: config.color }} />
                </div>

                {/* Division icon */}
                <div style={{ color: config.color, marginBottom: '1rem', opacity: 0.7 }}>
                    {config.icon}
                </div>

                <h1 style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: '#fff',
                    marginBottom: '0.5rem',
                    letterSpacing: '-0.02em',
                }}>
                    Access Restricted
                </h1>

                <p style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: config.color,
                    marginBottom: '1rem',
                }}>
                    {config.label}
                </p>

                <p style={{
                    color: 'rgba(255,255,255,0.55)',
                    lineHeight: 1.65,
                    marginBottom: '0.75rem',
                    fontSize: '0.95rem',
                }}>
                    You don't have access to the <strong style={{ color: '#fff' }}>{config.label}</strong> yet.
                </p>

                <p style={{
                    color: 'rgba(255,255,255,0.4)',
                    lineHeight: 1.6,
                    marginBottom: '2rem',
                    fontSize: '0.875rem',
                }}>
                    {config.description}
                </p>

                {/* Error code badge */}
                <div style={{
                    display: 'inline-block',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '100px',
                    padding: '0.3rem 1rem',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    color: 'rgba(255,255,255,0.35)',
                    marginBottom: '2rem',
                    letterSpacing: '0.05em',
                }}>
                    ERROR 403 — DIVISION_ACCESS_DENIED
                </div>

                {/* CTA Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <Link
                        href="/dashboard/account"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            padding: '0.875rem 1.5rem',
                            borderRadius: '0.875rem',
                            background: `linear-gradient(135deg, ${config.color}, ${config.color}cc)`,
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            textDecoration: 'none',
                            boxShadow: `0 4px 24px ${config.glow}`,
                            transition: 'opacity 0.2s',
                        }}
                    >
                        Upgrade Account — {config.price}
                        <ArrowRight size={18} />
                    </Link>

                    <Link
                        href="/dashboard"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0.75rem',
                            borderRadius: '0.875rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: 'rgba(255,255,255,0.5)',
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            textDecoration: 'none',
                        }}
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
