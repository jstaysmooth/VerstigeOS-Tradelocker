
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Mail, FileText, ArrowRight } from 'lucide-react';
import { Lead, PLANS } from './types';
import '@/styles/components/SalesPipeline.css';

interface LeadProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    lead: Lead | null;
    onUpdate: (updatedLead: Lead) => void;
    onCloseDeal: (lead: Lead) => void;
}

export default function LeadProfileModal({ isOpen, onClose, lead, onUpdate, onCloseDeal }: LeadProfileModalProps) {
    const [formData, setFormData] = useState<Lead | null>(null);

    useEffect(() => {
        if (lead) {
            setFormData({ ...lead });
        }
    }, [lead]);

    if (!isOpen || !formData) return null;

    const handleChange = (field: keyof Lead, value: any) => {
        let updated = { ...formData, [field]: value };

        if (field === 'interestedPlan') {
            const plan = PLANS.find(p => p.id === value);
            if (plan) {
                updated.value = plan.price;
            }
        }

        setFormData(updated);
        onUpdate(updated);
    };

    return (
        <AnimatePresence>
            <div className="modal-overlay" onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}>
                <motion.div
                    className="modal-content"
                    initial={{ x: '100%', opacity: 0.5 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '100%', opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    style={{ marginLeft: 'auto', height: '100vh', borderRadius: '16px 0 0 16px', maxWidth: '500px' }}
                >
                    <div className="modal-header">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                <User size={20} />
                            </div>
                            <div>
                                <h2>{formData.name}</h2>
                                <p className="text-sm text-secondary">{formData.company}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X size={20} className="text-secondary" />
                        </button>
                    </div>

                    <div className="modal-body overflow-y-auto" style={{ maxHeight: 'calc(100vh - 80px)' }}>
                        <div className="space-y-6">



                            {/* Details Form */}
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-secondary mb-4">Lead Details</h3>

                                <div className="form-group">
                                    <label>Stage</label>
                                    <select
                                        className="form-select"
                                        value={formData.stage}
                                        onChange={(e) => handleChange('stage', e.target.value)}
                                        disabled={formData.stage === 'closed-won'}
                                    >
                                        <option value="new">New Lead</option>
                                        <option value="contacted">Contacted</option>
                                        <option value="proposal">Proposal Sent</option>
                                        <option value="negotiation">Negotiation</option>
                                        <option value="closed-won">Closed Won (Paid)</option>
                                        <option value="closed-lost">Closed Lost</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Interested Plan</label>
                                    <select
                                        className="form-select"
                                        value={formData.interestedPlan}
                                        onChange={(e) => handleChange('interestedPlan', e.target.value)}
                                    >
                                        {PLANS.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-secondary mb-4">Contact Info</h3>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="form-group">
                                        <label className="flex items-center gap-2"><Mail size={14} /> Email</label>
                                        <input
                                            type="email"
                                            className="form-input"
                                            value={formData.email}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="flex items-center gap-2"><Phone size={14} /> Phone</label>
                                        <input
                                            type="tel"
                                            className="form-input"
                                            value={formData.phone}
                                            onChange={(e) => handleChange('phone', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-secondary mb-4">Notes</h3>
                                <textarea
                                    className="form-input min-h-[100px]"
                                    value={formData.notes}
                                    onChange={(e) => handleChange('notes', e.target.value)}
                                    placeholder="Add notes about requirements, conversations, etc..."
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
