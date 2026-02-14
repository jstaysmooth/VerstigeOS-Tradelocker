"use client";
import { useEffect, useRef, useState } from 'react';
import './CodeDripBackground.css';

interface MouseDrip {
    id: number;
    x: number;
    y: number;
    text: string;
}

const CodeDripBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mouseDrips, setMouseDrips] = useState<MouseDrip[]>([]);
    const nextId = useRef(0);

    const codeSnippets = ['exec_verstige', '0x7FF', 'core_init', 'neural_link', 'bypass_env', 'os_vision'];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        const columns = Math.floor(canvas.width / 40);
        const drops: number[] = new Array(columns).fill(1).map(() => Math.random() * -100);

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = '8px monospace';
            ctx.fillStyle = 'rgba(41, 151, 255, 0.1)';

            for (let i = 0; i < drops.length; i++) {
                const text = Math.random() > 0.5 ? '0' : '1';
                ctx.fillText(text, i * 40, drops[i] * 40);

                if (drops[i] * 40 > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (Math.random() > 0.9) {
            const id = nextId.current++;
            const newDrip: MouseDrip = {
                id,
                x: e.clientX,
                y: e.clientY,
                text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)]
            };
            setMouseDrips(prev => [...prev.slice(-15), newDrip]);

            setTimeout(() => {
                setMouseDrips(prev => prev.filter(d => d.id !== id));
            }, 1000);
        }
    };

    return (
        <div className="code-drip-container" onMouseMove={handleMouseMove}>
            <canvas ref={canvasRef} className="code-drip-canvas" />
            {mouseDrips.map(drip => (
                <div
                    key={drip.id}
                    className="interactive-drip"
                    style={{ left: drip.x, top: drip.y }}
                >
                    {drip.text}
                </div>
            ))}
            <div className="bg-gradient-overlay" />
        </div>
    );
};

export default CodeDripBackground;
