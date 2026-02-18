"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle, Command } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import '@/styles/pages/Login.css';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isRegistered = searchParams.get('registered') === 'true';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                // Handle "Email not confirmed" specifically if possible, 
                // but Supabase usually gives generic "Invalid login credentials" 
                // unless you check the message.
                if (authError.message.toLowerCase().includes('confirm')) {
                    throw new Error("Please verify your email address before logging in.");
                }
                throw authError;
            }

            if (data.session) {
                router.push('/dashboard');
            }
        } catch (err: any) {
            console.error("Login failed:", err);
            setError(err.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container animate-fade-in">

                <div className="flex justify-center mb-8">
                    <Link href="/" className="flex items-center gap-2 text-white font-black tracking-widest">
                        <Command size={24} />
                        <span>VERSTIGE</span>
                    </Link>
                </div>

                <div className="login-card">
                    <div className="login-header">
                        <h1>Terminal Access</h1>
                        <p>Sign in to your private operating system.</p>
                    </div>

                    {isRegistered && (
                        <div className="success-message animate-fade-in-up">
                            <CheckCircle size={20} className="mx-auto" />
                            <div>
                                <strong>Account Created Successfully!</strong>
                                <p>A verification link has been sent to your email. Please confirm your account before logging in.</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="error-message mb-6 animate-shake">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form className="auth-form" onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Designation (Email)</label>
                            <div className="input-wrapper">
                                <Mail size={18} />
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Passcode</label>
                            <div className="input-wrapper">
                                <Lock size={18} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button className="btn-login" type="submit" disabled={loading}>
                            {loading ? <div className="spinner"></div> : (
                                <>
                                    Access Terminal <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="auth-footer">
                        New visionary?
                        <Link href="/get-started">Initialize Account</Link>
                    </p>

                    <div className="verification-note">
                        <p>Identity verification required for all accounts. If you haven't received your confirmation email, please check your spam folder.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
