
import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import './SwipeToApprove.css';

interface SwipeToApproveProps {
    onApprove: () => Promise<void>;
    label?: string;
}

export default function SwipeToApprove({ onApprove, label = "Swipe to Execute" }: SwipeToApproveProps) {
    const [isApproved, setIsApproved] = useState(false);
    const x = useMotionValue(0);
    const backgroundOpacity = useTransform(x, [0, 200], [0.5, 1]);
    const xInput = [0, 200];
    const colorOutput = ['#374151', '#10b981']; // gray-700 to emerald-500
    const backgroundColor = useTransform(x, xInput, colorOutput);

    const handleDragEnd = async () => {
        if (x.get() > 150) {
            setIsApproved(true);
            await onApprove();
        } else {
            // Reset
            x.set(0);
        }
    };

    return (
        <div className={`swipe-container ${isApproved ? 'approved' : ''}`} style={{ background: isApproved ? '#10b981' : undefined }}>
            {!isApproved && (
                <motion.div
                    className="swipe-track"
                    style={{ backgroundColor }}
                >
                    <span className="swipe-label">{label}</span>
                </motion.div>
            )}

            <motion.div
                className="swipe-thumb"
                drag={!isApproved ? "x" : false}
                dragConstraints={{ left: 0, right: 200 }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
                style={{ x }}
                animate={isApproved ? { x: 200 } : {}}
            >
                {isApproved ? <Check size={20} color="#10b981" /> : <ChevronRight size={20} />}
            </motion.div>

            {isApproved && (
                <div className="approved-label">
                    <Check size={16} /> Trade Executed
                </div>
            )}
        </div>
    );
}
