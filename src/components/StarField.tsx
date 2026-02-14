'use client';

import { useEffect, useRef } from 'react';

export default function StarField() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Define exclusion zones for feature boxes (approximate positions)
        const isInExclusionZone = (x: number, y: number) => {
            const width = canvas.width;
            const height = canvas.height;

            // Left feature boxes zone (left side, vertically centered)
            const leftBoxX = 0;
            const leftBoxWidth = 350;
            const leftBoxY = height * 0.3;
            const leftBoxHeight = height * 0.4;

            // Right feature boxes zone (right side, vertically centered)
            const rightBoxX = width - 350;
            const rightBoxWidth = 350;
            const rightBoxY = height * 0.3;
            const rightBoxHeight = height * 0.4;

            // Check if point is in left or right exclusion zones
            const inLeftZone = x >= leftBoxX && x <= leftBoxX + leftBoxWidth &&
                y >= leftBoxY && y <= leftBoxY + leftBoxHeight;
            const inRightZone = x >= rightBoxX && x <= rightBoxX + rightBoxWidth &&
                y >= rightBoxY && y <= rightBoxY + rightBoxHeight;

            return inLeftZone || inRightZone;
        };

        // Generate 2000 stars, avoiding exclusion zones
        const stars: { x: number; y: number; size: number; opacity: number; twinkleSpeed: number }[] = [];
        let attempts = 0;
        while (stars.length < 2000 && attempts < 5000) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;

            if (!isInExclusionZone(x, y)) {
                stars.push({
                    x,
                    y,
                    size: Math.random() * 0.5 + 0.3, // Much smaller: 0.3px to 0.8px
                    opacity: Math.random(),
                    twinkleSpeed: Math.random() * 0.01 + 0.003
                });
            }
            attempts++;
        }

        // Animation loop
        let animationId: number;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            stars.forEach(star => {
                // Twinkle effect
                star.opacity += star.twinkleSpeed;
                if (star.opacity >= 1 || star.opacity <= 0.2) {
                    star.twinkleSpeed *= -1;
                }

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
                ctx.fill();
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0
            }}
        />
    );
}
