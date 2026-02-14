import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { ChevronRight, Check, X, TrendingUp, AlertTriangle } from 'lucide-react';

interface TradeCardProps {
    symbol: string;
    action: 'BUY' | 'SELL';
    lots: number;
    onSwipeConfirm: () => void;
}

const VerstigeTradeCard: React.FC<TradeCardProps> = ({ symbol, action, lots, onSwipeConfirm }) => {
    const x = useMotionValue(0);
    const [completed, setCompleted] = useState(false);

    // Background color transformation based on swipe position
    const background = useTransform(
        x,
        [0, 200],
        ['rgba(255, 255, 255, 0.05)', action === 'BUY' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)']
    );

    const handleDragEnd = async (_: any, info: PanInfo) => {
        if (info.offset.x > 150) {
            setCompleted(true);
            await onSwipeConfirm();
        } else {
            // Reset if not swiped far enough
            // Framer motion handles the spring back via 'dragConstraints' and 'dragSnapToOrigin' if we configured them, 
            // but here we let it animate back by setting x to 0 if we were controlling it, 
            // or rely on dragConstraints.
        }
    };

    if (completed) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-4 flex flex-col items-center justify-center text-center space-y-2 border-l-4 border-green-500"
                style={{ height: '140px' }}
            >
                <div className="bg-green-500/20 p-3 rounded-full">
                    <Check className="text-green-500" size={24} />
                </div>
                <h3 className="text-lg font-bold">Execution Confirmed</h3>
                <p className="text-xs text-secondary">Order {symbol} filled at Market</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="glass-panel overflow-hidden relative"
            style={{ height: '140px', background }}
        >
            {/* Content Layer */}
            <div className="p-4 flex flex-col justify-between h-full relative z-10 pointer-events-none">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold">{symbol}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded ${action === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {action}
                            </span>
                        </div>
                        <p className="text-sm text-secondary">Verstige AI Signal</p>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-mono">{lots} Lots</div>
                        <div className="text-xs text-secondary">Risk: 1.0%</div>
                    </div>
                </div>

                <div className="flex justify-between items-center text-xs text-secondary mt-2">
                    <div className="flex items-center gap-1">
                        <TrendingUp size={12} />
                        Entry Area
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                        <AlertTriangle size={12} />
                        High Volatility
                    </div>
                </div>
            </div>

            {/* Slider Layer */}
            <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/20 backdrop-blur-sm">
                <div className="relative h-12 bg-white/5 rounded-full overflow-hidden flex items-center">
                    <motion.div className="absolute left-4 text-xs uppercase tracking-widest text-white/40 pointer-events-none w-full text-center">
                        Swipe to Execute
                    </motion.div>

                    <motion.div
                        drag="x"
                        dragConstraints={{ left: 0, right: 200 }}
                        dragElastic={0.1}
                        onDragEnd={handleDragEnd}
                        style={{ x }}
                        className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing absolute left-1 z-20"
                        whileTap={{ scale: 1.1 }}
                    >
                        <ChevronRight className="text-black" size={20} />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default VerstigeTradeCard;
