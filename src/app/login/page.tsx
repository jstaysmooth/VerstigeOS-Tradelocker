"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle, Command } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import '@/styles/pages/Login.css';

function LoginForm() {
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
                const msg = authError.message.toLowerCase();
                if (msg.includes('confirm') || msg.includes('verified') || msg.includes('not confirmed')) {
                    throw new Error("Please verify your email address before logging in. Check your inbox (and spam folder).");
                }
                if (msg.includes('invalid login') || msg.includes('invalid credentials') || msg.includes('wrong password')) {
                    throw new Error("Incorrect email or password. Please try again.");
                }
                throw authError;
            }

            if (data.session) {
                // Give the session a tick to propagate to UserContext before navigating
                await new Promise(r => setTimeout(r, 100));
                router.replace('/dashboard');
                // Belt-and-suspenders: if router.replace doesn't fire within 1s, force navigate
                setTimeout(() => { window.location.href = '/dashboard'; }, 1000);
            } else if (data.user && !data.session) {
                // User exists but email not confirmed
                throw new Error("Please verify your email address before logging in. Check your inbox (and spam folder).");
            } else {
                throw new Error("Login failed. Please try again.");
            }
        } catch (err: any) {
            console.error("Login failed:", err);
            setError(err.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
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
    );
}

export default function LoginPage() {
    return (
        <div className="login-page">
            <div className="login-container animate-fade-in">
                <div className="flex justify-center mb-8">
                    <Link href="/" className="flex items-center gap-2 text-white font-black tracking-widest">
                        <Command size={24} />
                        <span>VERSTIGE</span>
                    </Link>
                </div>

                <Suspense fallback={
                    <div className="login-card flex flex-col items-center justify-center p-12">
                        <div className="spinner w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
                        <p className="text-secondary opacity-50 text-xs uppercase tracking-widest">Syncing Protocols...</p>
                    </div>
                }>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}
