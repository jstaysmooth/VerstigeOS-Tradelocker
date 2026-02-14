"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const logs = [
    "Initializing secure handshake protocol...",
    "Verifying institutional bridge connection...",
    "Loading liquidity provider gateways...",
    "Syncing with Verstige OS Master Node...",
    "Optimizing latency routing tables...",
    "System ready. Waiting for user authorization."
];

export const SystemLog = ({ active }: { active: boolean }) => {
    const [lines, setLines] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex < logs.length) {
                setLines(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${logs[currentIndex]}`]);
                currentIndex++;
            }
        }, 800);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (active) {
            setLines(prev => [...prev, `[${new Date().toLocaleTimeString()}] >> CONNECTION ESTABLISHED. COPYING ACTIVE.`]);
        }
    }, [active]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [lines]);

    return (
        <div className="font-mono text-xs text-green-500/80 p-4 bg-black/40 rounded-xl border border-green-500/20 h-48 overflow-y-auto shadow-inner" ref={scrollRef}>
            <div className="space-y-1">
                {lines.map((line, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        {line}
                    </motion.div>
                ))}
                <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-2 h-4 bg-green-500 inline-block align-middle ml-1"
                />
            </div>
        </div>
    );
};
