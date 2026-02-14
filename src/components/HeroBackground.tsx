"use client";
import React, { useEffect, useRef } from 'react';

interface HeroBackgroundProps {
    mousePos: { x: number; y: number };
    isHovering: boolean;
}

const HeroBackground: React.FC<HeroBackgroundProps> = ({ mousePos, isHovering }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const hoverStrengthRef = useRef(0);

    // Store latest props in refs to avoid re-initializing animation loop
    const mousePosRef = useRef(mousePos);
    const isHoveringRef = useRef(isHovering);

    useEffect(() => {
        mousePosRef.current = mousePos;
        isHoveringRef.current = isHovering;
    }, [mousePos, isHovering]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        // --- Init State ---

        // 1. Code Lines
        const codeColumns = Math.floor(width / 20);
        const codeDrops: number[] = [];
        for (let i = 0; i < codeColumns; i++) codeDrops[i] = Math.random() * height;
        const codeChars = "01010101 VERSTIGE SYSTEM O.S. TRADING SIGNAL BUY SELL HOLD LINK NETWORK PROTOCOL";
        const codeCharArr = codeChars.split('');

        // 2. Candlesticks
        const candles: { x: number; y: number; w: number; h: number; wickH: number; isGreen: boolean }[] = [];
        const candleSpacing = 15;
        const candleWidth = 8;
        const totalCandles = Math.ceil(width / candleSpacing) + 5;
        let lastClose = height / 2;

        for (let i = 0; i < totalCandles; i++) {
            const isGreen = Math.random() > 0.48;
            const move = (Math.random() - 0.5) * 50;
            const open = lastClose;
            const close = open + (isGreen ? Math.abs(move) : -Math.abs(move));
            const y = isGreen ? open : close;
            const h = Math.abs(close - open);

            candles.push({
                x: i * candleSpacing,
                y: y,
                w: candleWidth,
                h: Math.max(h, 1),
                wickH: h + Math.random() * 20,
                isGreen: isGreen
            });
            lastClose = close;
            if (lastClose < height * 0.35 || lastClose > height * 0.65) lastClose = height / 2;
        }

        // --- Render Loop ---
        const render = () => {
            ctx.clearRect(0, 0, width, height);

            // Read refs
            const currentHover = isHoveringRef.current;
            const currentMouse = mousePosRef.current;

            // Smooth Interpolation
            const targetStrength = currentHover ? 1 : 0;
            hoverStrengthRef.current += (targetStrength - hoverStrengthRef.current) * 0.05;

            // Helper for brightness based on mouse distance
            const getDistFactor = (x: number, y: number) => {
                if (hoverStrengthRef.current < 0.01) return 0;
                const dx = x - currentMouse.x;
                const dy = y - currentMouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const radius = 500;
                if (dist > radius) return 0;
                return (1 - dist / radius) * hoverStrengthRef.current;
            };

            // 1. Draw Candlesticks (Middle Only)
            for (let i = 0; i < candles.length; i++) {
                const candle = candles[i];
                candle.x -= 0.5;
                if (candle.x < -candleSpacing) {
                    candle.x = width + candleSpacing;
                    const isGreen = Math.random() > 0.5;
                    const move = (Math.random() - 0.5) * 40;
                    let basePrice = candles[(i - 1 + candles.length) % candles.length].y;

                    // Reset Logic (Keep in middle)
                    if (basePrice < height * 0.35) basePrice = height / 2;
                    if (basePrice > height * 0.65) basePrice = height / 2;

                    candle.y = basePrice + move;
                    candle.h = Math.abs(move);
                    candle.wickH = candle.h + Math.random() * 15;
                    candle.isGreen = isGreen;
                }

                const baseAlpha = 0.05;
                const brightnesBoost = getDistFactor(candle.x, candle.y);
                const alpha = Math.min(baseAlpha + brightnesBoost, 1);

                if (alpha > 0.01) {
                    ctx.globalAlpha = alpha * 0.6;
                    ctx.fillStyle = candle.isGreen ? '#34d399' : '#f87171';
                    ctx.strokeStyle = ctx.fillStyle;

                    ctx.beginPath();
                    ctx.moveTo(candle.x + candle.w / 2, candle.y - (candle.wickH - candle.h) / 2);
                    ctx.lineTo(candle.x + candle.w / 2, candle.y + candle.h + (candle.wickH - candle.h) / 2);
                    ctx.stroke();
                    ctx.fillRect(candle.x, candle.y, candle.w, candle.h);
                }
            }

            // 2. Draw Code (Top & Bottom Only)
            ctx.font = 'bold 14px "JetBrains Mono", monospace';
            const topBoundary = height * 0.25;
            const bottomBoundary = height * 0.75;

            for (let i = 0; i < codeDrops.length; i++) {
                const x = i * 20;
                const y = codeDrops[i];
                const isTop = y < topBoundary;
                const isBottom = y > bottomBoundary;

                if (isTop || isBottom) {
                    const char = codeCharArr[Math.floor(Math.random() * codeCharArr.length)];
                    const alpha = getDistFactor(x, y); // Only visible on hover

                    if (alpha > 0.01) {
                        ctx.globalAlpha = alpha;
                        const v = Math.floor(alpha * 255);
                        ctx.fillStyle = `rgb(0, ${v}, ${v / 1.5})`;
                        ctx.fillText(char, x, y);
                    }
                }

                if (Math.random() > 0.95) codeDrops[i] += 20;
                if (codeDrops[i] * Math.random() > height && Math.random() > 0.95) codeDrops[i] = 0;
            }

            ctx.globalAlpha = 1;
            requestAnimationFrame(render);
        };

        const animationId = requestAnimationFrame(render);
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
            style={{ position: 'absolute', opacity: 0.9, mixBlendMode: 'plus-lighter' }}
        />
    );
};

export default HeroBackground;
