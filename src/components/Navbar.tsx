"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Command } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import './Navbar.css';

const Navbar: React.FC = () => {
    const { user } = useUser();
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="nav-container">
                <Link href="/" className="nav-logo">
                    <Command size={24} />
                    <span>VERSTIGE</span>
                </Link>

                <div className={`nav-links ${isOpen ? 'open' : ''}`}>
                    <Link href="/" onClick={() => setIsOpen(false)}>Ecosystem</Link>
                    <Link href="/" onClick={() => setIsOpen(false)}>Divisions</Link>
                    <Link href="/" onClick={() => setIsOpen(false)}>Updates</Link>
                    {user ? (
                        <Link href="/dashboard" className="btn-nav" onClick={() => setIsOpen(false)}>Dashboard</Link>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href="/login" className="text-sm font-bold text-secondary hover:text-white transition-colors" onClick={() => setIsOpen(false)}>Login</Link>
                            <Link href="/get-started" className="btn-nav" onClick={() => setIsOpen(false)}>Get Started</Link>
                        </div>
                    )}
                </div>

                <button className="nav-mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
