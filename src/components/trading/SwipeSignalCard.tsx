"use client";
import { useState, useRef, useEffect } from "react";
import { Signal } from "@/hooks/useSignals";
import {
    Check,
    ChevronRight,
    TrendingUp,
    TrendingDown,
    Timer,
    X,
    AlertTriangle,
    Target,
    Zap,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://verstige.io";

interface SwipeSignalCardProps {
    signal: Signal;
    onSettled?: (id: string, action: string) => void;
}

export function SwipeSignalCard({ signal, onSettled }: SwipeSignalCardProps) {
    const [cardState, setCardState] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [sliderX, setSliderX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const dragStartX = useRef<number | null>(null);
    const [maxDist, setMaxDist] = useState(250);

    const isBuy = signal.direction === "BUY";
    const accentColor = isBuy ? "#10b981" : "#ef4444";
    const accentColorSoft = isBuy ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)";
    const accentColorBorder = isBuy ? "rgba(16,185,129,0.35)" : "rgba(239,68,68,0.35)";

    useEffect(() => {
        if (containerRef.current) {
            setMaxDist(containerRef.current.clientWidth - 58);
        }
    }, []);

    async function executeApprove() {
        setCardState("loading");
        try {
            const userId = typeof window !== "undefined" ? localStorage.getItem("v2_user_id") : null;
            const email = typeof window !== "undefined" ? localStorage.getItem("v2_user_email") : null;

            console.log("DEBUG: SwipeSignalCard executing for user:", userId, "email:", email);
            console.log("DEBUG: Signal data:", { id: signal.id, symbol: signal.symbol, direction: signal.direction });

            const resp = await fetch(`${API_BASE}/api/tradelocker/execute`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    signal_id: signal.id,
                    symbol: signal.symbol,
                    action: signal.direction,
                    sl: signal.stop_loss,
                    tp: signal.take_profit,
                    email,
                }),
            });

            console.log("DEBUG: Response status:", resp.status);

            if (!resp.ok) {
                const data = await resp.json();
                console.error("DEBUG: Response Error Body:", data);
                throw new Error(data.detail || "Execution failed");
            }

            const result = await resp.json();
            console.log("DEBUG: Trade executed:", result);

            setCardState("success");
            setTimeout(() => { onSettled?.(signal.id, "approved"); }, 2000);
        } catch (err: any) {
            setCardState("error");
            console.error(err);
            setTimeout(() => { setSliderX(0); setCardState("idle"); }, 2500);
        }
    }

    function handlePointerDown(e: React.PointerEvent) {
        if (cardState !== "idle") return;
        dragStartX.current = e.clientX - sliderX;
        setIsDragging(true);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }

    function handlePointerMove(e: React.PointerEvent) {
        if (!isDragging || cardState !== "idle") return;
        const containerWidth = containerRef.current?.clientWidth || 300;
        const handleWidth = 52;
        const maxDrag = containerWidth - handleWidth - 16;
        let newX = e.clientX - (dragStartX.current || 0);
        newX = Math.max(0, Math.min(newX, maxDrag));
        setSliderX(newX);
    }

    function handlePointerUp() {
        if (!isDragging) return;
        setIsDragging(false);
        const containerWidth = containerRef.current?.clientWidth || 300;
        const handleWidth = 52;
        const maxDrag = containerWidth - handleWidth - 16;
        if (sliderX > maxDrag * 0.88) {
            setSliderX(maxDrag);
            executeApprove();
        } else {
            setSliderX(0);
        }
    }

    const sliderProgress = maxDist > 0 ? sliderX / maxDist : 0;

    return (
        <div
            className={`signal-card-v2 ${isBuy ? "signal-buy" : "signal-sell"} ${cardState === "success" ? "signal-executed" : ""}`}
            style={{ "--accent": accentColor, "--accent-soft": accentColorSoft, "--accent-border": accentColorBorder } as React.CSSProperties}
        >
            {/* Ambient Glow Layer */}
            <div className="signal-glow-layer" />

            {/* Animated top border shimmer */}
            <div className="signal-top-shimmer" />

            {/* === HEADER === */}
            <div className="signal-header">
                {/* Left: Author info */}
                <div className="signal-author">
                    <div className="signal-avatar">
                        <span>VS</span>
                        <div className="avatar-ring" />
                    </div>
                    <div className="signal-author-info">
                        <div className="signal-author-name">
                            <span>Verstige AI</span>
                            <span className="pro-badge">PRO</span>
                        </div>
                        <div className="signal-meta">
                            <span className={`signal-direction-badge ${isBuy ? "buy-badge" : "sell-badge"}`}>
                                {isBuy ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                                {signal.direction}
                            </span>
                            <span className="signal-meta-divider">·</span>
                            <span className="signal-timeframe">
                                <Timer size={11} />
                                {signal.timeframe || "1H"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Symbol + status */}
                <div className="signal-symbol-block">
                    <div className="signal-symbol">{signal.symbol}</div>
                    {cardState === "success" ? (
                        <div className="signal-status-badge executed-badge">
                            <Check size={10} />
                            Executed
                        </div>
                    ) : cardState === "error" ? (
                        <div className="signal-status-badge error-badge">
                            <AlertTriangle size={10} />
                            Failed
                        </div>
                    ) : (
                        <div className="signal-status-badge live-badge">
                            <span className="pulse-ring" />
                            Live Signal
                        </div>
                    )}
                </div>
            </div>

            {/* === PRICE GRID === */}
            <div className="signal-price-grid">
                {/* Entry */}
                <div className="price-cell">
                    <div className="price-cell-label">
                        <Zap size={10} />
                        Entry
                    </div>
                    <div className="price-cell-value neutral">{signal.entry}</div>
                </div>

                {/* Stop Loss */}
                <div className="price-cell">
                    <div className="price-cell-label">
                        <AlertTriangle size={10} />
                        Stop Loss
                    </div>
                    <div className="price-cell-value red">{signal.stop_loss}</div>
                </div>

                {/* Take Profit */}
                <div className="price-cell tp-cell">
                    <div className="rr-badge">1:{signal.rr_ratio || "2"}</div>
                    <div className="price-cell-label">
                        <Target size={10} />
                        Take Profit
                    </div>
                    <div className="price-cell-value green">{signal.take_profit}</div>
                </div>
            </div>

            {/* === PENDING STATUS BAR === */}
            {cardState !== "success" && (
                <div className="signal-pending-bar">
                    <div className="pending-dot" />
                    <span>Pending — Waiting for Your Approval</span>
                </div>
            )}

            {/* === SWIPE SLIDER === */}
            <div
                ref={containerRef}
                className={`swipe-track ${cardState === "success" ? "track-success" : cardState === "error" ? "track-error" : ""}`}
            >
                {/* Fill progress */}
                <div
                    className="swipe-fill"
                    style={{ width: `${sliderProgress * 100}%` }}
                />

                {/* Label */}
                <div
                    className="swipe-label"
                    style={{ opacity: Math.max(0, 1 - sliderProgress * 2) }}
                >
                    {cardState === "loading" ? (
                        <><span className="swipe-spinner" /> Executing...</>
                    ) : cardState === "success" ? (
                        <><Check size={14} /> Trade Executed</>
                    ) : cardState === "error" ? (
                        <><X size={14} /> Failed — Retry</>
                    ) : (
                        <><ChevronRight size={14} className="chevron-bounce" /> Swipe to Approve</>
                    )}
                </div>

                {/* Drag handle */}
                <div
                    className={`swipe-handle ${cardState === "success" ? "handle-success" : cardState === "error" ? "handle-error" : ""}`}
                    style={{ transform: `translateX(${sliderX}px)` }}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                >
                    {cardState === "success" ? (
                        <Check size={22} />
                    ) : cardState === "error" ? (
                        <X size={22} />
                    ) : cardState === "loading" ? (
                        <span className="handle-spinner" />
                    ) : (
                        <ChevronRight size={22} />
                    )}
                </div>
            </div>
        </div>
    );
}
