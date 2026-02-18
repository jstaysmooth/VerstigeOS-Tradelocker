"use client";
import React, { useState } from 'react';
import HeroBackground from './HeroBackground';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, Shield, Zap, TrendingUp, Activity, Users, Cpu } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import './Hero.css';

const Hero: React.FC = () => {
    const { user } = useUser();
    const router = useRouter();
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, -100]);
    const y2 = useTransform(scrollY, [0, 500], [0, -200]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    // Background interaction state
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <section
            className="hero-section"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <HeroBackground mousePos={mousePos} isHovering={isHovering} />
            <motion.div style={{ opacity }} className="hero-content">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="hero-badge"
                >
                    <span className="dot" /> SYSTEM ONLINE
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-hero gradient-text"
                >
                    Verstige OS
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-subtitle"
                >
                    An operating system for visionaries.<br />
                    One membership. Multiple divisions. Unlimited execution.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="hero-actions"
                >
                    <button
                        className="btn-primary"
                        onClick={() => router.push(user ? '/dashboard' : '/get-started')}
                    >
                        Enter the Ecosystem <ChevronRight size={18} />
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={() => {
                            const divisionsSection = document.querySelector('.divisions-section');
                            divisionsSection?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        View Divisions
                    </button>
                </motion.div>
            </motion.div>

            {/* Parallax Floating Dashboard Modules */}
            <motion.div style={{ y: y1 }} className="floating-elements">
                <div className="module-card fintech-card glass-panel animate-float" style={{ top: '20%', left: '10%' }}>
                    <div className="card-header">
                        <Activity size={20} className="icon-green" />
                        <span>SIGNAL NETWORK</span>
                    </div>
                    <div className="card-body">
                        <div className="value" style={{ fontSize: '1.2rem' }}>AUD/USD Long</div>
                        <div className="trend" style={{ fontSize: '1rem' }}>+45 Pips (Active)</div>
                    </div>
                </div>

                <div className="module-card system-card glass-panel animate-float" style={{ top: '15%', right: '12%', animationDelay: '2s' }}>
                    <div className="card-header">
                        <Users size={20} className="icon-blue" />
                        <span>AGENCY CLOUD</span>
                    </div>
                    <div className="card-body">
                        <div className="value" style={{ fontSize: '1.2rem' }}>New Agent</div>
                        <div className="trend" style={{ color: 'var(--accent)' }}>+$1,250 Comm.</div>
                    </div>
                </div>
            </motion.div>

            <motion.div style={{ y: y2 }} className="floating-elements-back">
                <div className="module-card development-card glass-panel animate-float" style={{ bottom: '25%', right: '15%', animationDelay: '4s' }}>
                    <div className="card-header">
                        <Cpu size={20} className="icon-yellow" />
                        <span>VERSTIGE AI</span>
                    </div>
                    <div className="mini-chart">
                        {[40, 70, 45, 90, 65].map((h, i) => (
                            <div key={i} className="bar" style={{ height: `${h}%`, background: i === 3 ? '#ffcc00' : 'rgba(255, 204, 0, 0.3)' }} />
                        ))}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#ffcc00', marginTop: '4px', textAlign: 'right' }}>NEURAL SCAN</div>
                </div>
            </motion.div>

            <div className="hero-orbit" />
        </section>
    );
};

export default Hero;
