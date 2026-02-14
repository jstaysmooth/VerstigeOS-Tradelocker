
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, CreditCard, Sparkles } from 'lucide-react';
import { PLANS } from './types';
import '@/styles/components/SalesPipeline.css';

interface CloseDealModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (planId: string) => void;
    leadName: string;
    initialPlan?: string;
}

export default function CloseDealModal({ isOpen, onClose, onConfirm, leadName, initialPlan }: CloseDealModalProps) {
    const [selectedPlan, setSelectedPlan] = useState(initialPlan || 'Plus');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConfirm = async () => {
        setIsSubmitting(true);
        // Simulate animation delay for the "button experience"
        setTimeout(() => {
            onConfirm(selectedPlan);
            setIsSubmitting(false);
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-overlay">
                    <motion.div
                        className="modal-content"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    >
                        <div className="modal-header">
                            <h2>Complete Sale</h2>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={20} className="text-secondary" />
                            </button>
                        </div>

                        <div className="modal-body">
                            <p className="text-secondary mb-6">
                                Confirming sale for <strong className="text-white">{leadName}</strong>. Select the final subscribed plan to process commissions.
                            </p>

                            <div className="form-group">
                                <label>Subscription Plan</label>
                                <div className="plan-selection-grid">
                                    {PLANS.map(plan => (
                                        <div
                                            key={plan.id}
                                            className={`plan-option ${selectedPlan === plan.id ? 'selected' : ''}`}
                                            onClick={() => setSelectedPlan(plan.id)}
                                        >
                                            <span className="plan-name">{plan.name.replace('Business ', '')}</span>
                                            <span className="plan-cost">${plan.price}/mo</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <motion.button
                                className={`btn-primary full-width mt-4 relative overflow-hidden`}
                                onClick={handleConfirm}
                                disabled={isSubmitting}
                                whileTap={{ scale: 0.98 }}
                            >
                                <AnimatePresence mode="wait">
                                    {isSubmitting ? (
                                        <motion.div
                                            key="success"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            className="flex items-center justify-center gap-2"
                                        >
                                            <Check size={20} />
                                            <span>Processing Close...</span>
                                            <Sparkles size={16} className="animate-pulse" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="label"
                                            initial={{ y: -20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            className="flex items-center justify-center gap-2"
                                        >
                                            <CreditCard size={18} />
                                            <span>Finalize Deal</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {isSubmitting && (
                                    <motion.div
                                        className="absolute inset-0 bg-accent/20"
                                        initial={{ x: '-100%' }}
                                        animate={{ x: '100%' }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
