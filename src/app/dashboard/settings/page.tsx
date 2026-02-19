"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
    User, Camera, Mail, Calendar, LogOut, Save,
    RefreshCw, CheckCircle2, AlertCircle, X, ChevronRight,
    LucideIcon, Settings as SettingsIcon, Shield
} from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import '@/styles/pages/Settings.css';

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface SettingsSectionProps {
    title: string;
    icon: LucideIcon;
    children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, icon: Icon, children }) => (
    <div className="settings-section glass-panel animate-fade-in">
        <div className="settings-section-header">
            <Icon size={18} />
            <h2>{title}</h2>
        </div>
        <div className="settings-section-content">
            {children}
        </div>
    </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

export default function SettingsPage() {
    const { user, profile, refreshProfile, signOut } = useUser();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (profile) {
            setFirstName(profile.firstName || '');
            setLastName(profile.lastName || '');
        }
    }, [profile]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMsg(null);

        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    full_name: `${firstName} ${lastName}`.trim(),
                }
            });

            if (error) throw error;

            await refreshProfile();
            setMsg({ text: 'Profile updated successfully!', type: 'success' });
            setTimeout(() => setMsg(null), 3000);
        } catch (err: any) {
            setMsg({ text: err.message || 'Failed to update profile.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setUploading(true);
        setMsg(null);

        try {
            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}-${Math.random()}.${fileExt}`;

            // Upload the file to "avatars" bucket
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get the URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // Update user metadata
            const { error: updateError } = await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            });

            if (updateError) throw updateError;

            await refreshProfile();
            setMsg({ text: 'Profile picture updated!', type: 'success' });
        } catch (err: any) {
            console.error("Upload error:", err);
            setMsg({ text: err.message || 'Failed to upload image.', type: 'error' });
        } finally {
            setUploading(false);
        }
    };

    const handleLogout = async () => {
        await signOut();
        router.push('/login');
    };

    return (
        <div className="settings-page">
            <DashboardHeader
                title="Account Settings"
                subtitle="Manage your profile information and account preferences."
                badgeText="PREMIUM"
            />

            <div className="settings-grid">
                {/* ── Profile Section ── */}
                <SettingsSection title="Profile Information" icon={User}>
                    <div className="avatar-upload-row">
                        <div className="avatar-preview-container">
                            {profile?.avatarUrl ? (
                                <img src={profile.avatarUrl} alt="Avatar" className="avatar-preview-img" />
                            ) : (
                                <div className="avatar-preview-placeholder">
                                    {(firstName[0] || '?').toUpperCase()}
                                </div>
                            )}
                            <button
                                className="avatar-edit-btn"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                            >
                                {uploading ? <RefreshCw className="spin" size={14} /> : <Camera size={14} />}
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleUploadAvatar}
                                hidden
                                accept="image/*"
                            />
                        </div>
                        <div className="avatar-info">
                            <h3>Profile Picture</h3>
                            <p>PNG, JPG or GIF. Max 2MB.</p>
                        </div>
                    </div>

                    <form className="settings-form" onSubmit={handleUpdateProfile}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="Enter your first name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Enter your last name"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <div className="static-input">
                                <Mail size={14} />
                                {profile?.email}
                            </div>
                            <span className="input-hint">Email cannot be changed manually.</span>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="save-settings-btn" disabled={saving}>
                                {saving ? <RefreshCw className="spin" size={16} /> : <Save size={16} />}
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </SettingsSection>

                {/* ── Account Details Section ── */}
                <SettingsSection title="Account Details" icon={Shield}>
                    <div className="account-details-list">
                        <div className="detail-item">
                            <div className="detail-label">
                                <Calendar size={14} />
                                <span>Member Since</span>
                            </div>
                            <div className="detail-value">{profile?.joinDate || 'N/A'}</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-label">
                                <Shield size={14} />
                                <span>Account Status</span>
                            </div>
                            <div className="detail-value status-active">Active</div>
                        </div>
                    </div>

                    <div className="danger-zone">
                        <h3>Danger Zone</h3>
                        <p>Once you log out, you will need to sign in again to access the dashboard.</p>
                        <button className="logout-btn" onClick={handleLogout}>
                            <LogOut size={16} />
                            Log Out
                        </button>
                    </div>
                </SettingsSection>
            </div>

            {/* ── Feedback Message ── */}
            {msg && (
                <div className={`settings-msg animate-slide-up ${msg.type}`}>
                    {msg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <span>{msg.text}</span>
                    <button onClick={() => setMsg(null)}><X size={14} /></button>
                </div>
            )}
        </div>
    );
}
