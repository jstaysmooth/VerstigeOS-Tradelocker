"use client";
import React, { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';

const codeSnippets = [
    "const future = await execute(vision);",
    "if (status === 'growth') deploy();",
    "import { success } from '@verstige/core';",
    "while (true) { optimize(); }",
    "system.init({ mode: 'autonomous' });",
    "return new Galaxy();",
    "crypto.encrypt(assets);",
    "AI.model.train(data);",
    "network.connect('secure-node');",
    "width: 100%; height: 100%;",
    "opacity: 0.8; transform: scale(1.1);",
    "<Button onClick={launch} />",
    "function elevate(user) { return user.rank++ }",
    "const revenue = streams.reduce((a, b) => a + b, 0);",
    "database.sync({ realtime: true });"
];

const InteractiveCodeBackground: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring animation for mouse movement
    const springX = useSpring(mouseX, { damping: 50, stiffness: 400 });
    const springY = useSpring(mouseY, { damping: 50, stiffness: 400 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Calculate normalized mouse position (-1 to 1)
            const { innerWidth, innerHeight } = window;
            const x = (e.clientX / innerWidth) * 2 - 1;
            const y = (e.clientY / innerHeight) * 2 - 1;
            mouseX.set(x);
            mouseY.set(y);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div ref={containerRef} className="interactive-code-bg">
            <div className="code-overlay-gradient" />
            {codeSnippets.map((snippet, i) => {
                // Random positioning
                const top = `${Math.random() * 100}%`;
                const left = `${Math.random() * 100}%`;

                // Varying depths for parallax effect (some move opposite, some move with mouse)
                const depth = Math.random() * 40 + 10; // Movement range in pixels
                const direction = i % 2 === 0 ? 1 : -1; // Some move left, some move right

                return (
                    <CodeSnippet
                        key={i}
                        text={snippet}
                        top={top}
                        left={left}
                        x={springX}
                        y={springY}
                        depth={depth}
                        direction={direction}
                    />
                );
            })}
        </div>
    );
};

interface SnippetProps {
    text: string;
    top: string;
    left: string;
    x: any;
    y: any;
    depth: number;
    direction: number;
}

const CodeSnippet: React.FC<SnippetProps> = ({ text, top, left, x, y, depth, direction }) => {
    // Transform input spring values (-1 to 1) to pixel offsets
    const moveX = useTransform(x, (val: number) => val * depth * direction);
    const moveY = useTransform(y, (val: number) => val * depth * direction);

    return (
        <motion.div
            className="code-snippet-item"
            style={{
                top,
                left,
                x: moveX,
                y: moveY,
            }}
        >
            {text}
        </motion.div>
    );
};

export default InteractiveCodeBackground;
