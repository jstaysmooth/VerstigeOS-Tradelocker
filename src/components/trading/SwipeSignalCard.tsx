"use client";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Signal } from "@/hooks/useSignals";
import { Check, ChevronRight, Share2, Timer, TrendingUp, User, X } from "lucide-react";

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

    const isBuy = signal.direction === "BUY";

    async function executeApprove() {
        setCardState("loading");
        try {
            const { data: { session } } = await supabase.auth.getSession();

            console.log("DEBUG: SwipeSignalCard session:", session ? "Found" : "Null", session?.user?.id);
            console.log("DEBUG: Token being sent:", session?.access_token ? session.access_token.substring(0, 10) + "..." : "None");

            const headers: HeadersInit = { "Content-Type": "application/json" };
            if (session?.access_token) headers["Authorization"] = `Bearer ${session.access_token}`;

            console.log("DEBUG: Headers:", headers);

            const resp = await fetch(`${API_BASE}/api/signals/${signal.id}/approve`, {
                method: "POST",
                headers,
            });

            console.log("DEBUG: Response status:", resp.status);

            if (!resp.ok) {
                const data = await resp.json();
                console.error("DEBUG: Response Error Body:", data);
                throw new Error(data.detail || "Execution failed");
            }

            setCardState("success");
            setTimeout(() => {
                onSettled?.(signal.id, "approved");
            }, 2000);

        } catch (err: any) {
            setCardState("error");
            console.error(err);
            setSliderX(0); // Reset
            // Optionally set error message state if you want to show it
        }
    }

    // Slider Logic
    function handlePointerDown(e: React.PointerEvent) {
        if (cardState !== "idle") return;
        dragStartX.current = e.clientX - sliderX;
        setIsDragging(true);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }

    function handlePointerMove(e: React.PointerEvent) {
        if (!isDragging || cardState !== "idle") return;

        const containerWidth = containerRef.current?.clientWidth || 300;
        const handleWidth = 48; // w-12 = 48px
        const maxDrag = containerWidth - handleWidth - 16; // 16px padding

        let newX = e.clientX - (dragStartX.current || 0);
        newX = Math.max(0, Math.min(newX, maxDrag));

        setSliderX(newX);
    }

    function handlePointerUp() {
        if (!isDragging) return;
        setIsDragging(false);

        const containerWidth = containerRef.current?.clientWidth || 300;
        const handleWidth = 48;
        const maxDrag = containerWidth - handleWidth - 16;

        if (sliderX > maxDrag * 0.9) {
            // Snap to end and execute
            setSliderX(maxDrag);
            executeApprove();
        } else {
            // Snap back
            setSliderX(0);
        }
    }

    // Dynamic width calculation
    const [maxDist, setMaxDist] = useState(250);
    useEffect(() => {
        if (containerRef.current) {
            setMaxDist(containerRef.current.clientWidth - 58);
        }
    }, []);


    return (
        <div className="signal-card p-6 mb-6 rounded-[2.5rem] relative overflow-hidden">

            {/* --- TOP SECTION --- */}
            <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-3">
                    {/* Avatar Placeholder */}
                    <div className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center bg-gray-900 text-white font-bold text-lg">
                        VS
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg text-white">Verstige AI</h3>
                            <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded uppercase tracking-wider">
                                Pro
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-[11px] mt-0.5">
                            <span className={`flex items-center gap-1 font-bold ${isBuy ? 'text-emerald-400' : 'text-red-400'}`}>
                                {isBuy ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
                                {signal.direction}
                            </span>
                            <span className="opacity-30">•</span>
                            <span className="flex items-center gap-1">
                                <Timer size={12} />
                                {signal.timeframe || '1H'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <h2 className="text-2xl font-bold text-white mb-1">{signal.symbol}</h2>
                    {cardState === "success" ? (
                        <div className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 uppercase tracking-wider animate-pulse">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            Executed
                        </div>
                    ) : (
                        <div className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 uppercase tracking-wider">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" style={{ animationDuration: '3s' }}></div>
                            Active Signal
                        </div>
                    )}
                </div>
            </div>

            {/* --- DETAILS GRID --- */}
            <div className="grid grid-cols-3 gap-3 relative mt-4 mb-8">
                {/* Entry */}
                <div className="glass-effect-cell rounded-2xl py-3 px-2 text-center">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Entry</p>
                    <p className="text-lg font-bold text-white">{signal.entry}</p>
                </div>

                {/* Stop Loss */}
                <div className="glass-effect-cell rounded-2xl py-3 px-2 text-center">
                    <p className="text-[9px] text-slate-400 font-bold uppercase mb-1 whitespace-nowrap">Stop Loss</p>
                    <p className="text-lg font-bold text-red-400">{signal.stop_loss}</p>
                </div>

                {/* Take Profit */}
                <div className="glass-effect-cell rounded-2xl py-3 px-2 text-center relative overflow-visible">
                    <div className="absolute -top-2 -right-1 bg-blue-600 text-[9px] text-white font-bold px-1.5 py-0.5 rounded-lg flex items-center gap-0.5 shadow-lg">
                        1:{signal.rr_ratio || '2'}
                    </div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Take Profit</p>
                    <p className="text-lg font-bold text-emerald-400">{signal.take_profit}</p>
                </div>
            </div>

            {/* --- STATUS BAR --- */}
            <div className="bg-blue-900/20 rounded-full py-3 flex justify-center items-center gap-2 border border-blue-800/20 mb-8">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.1em]">
                    Pending - Waiting for Approval
                </span>
            </div>


            {/* --- SWIPE SLIDER --- */}
            <div
                ref={containerRef}
                className={`swipe-slider-container rounded-full p-2 h-16 relative flex items-center ${cardState === 'success' ? 'border-emerald-500/30 bg-emerald-900/10' : ''}`}
            >
                {/* Track Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none pr-4">
                    <span className={`slider-text text-sm font-medium flex items-center justify-center gap-2 ${cardState === 'success' ? 'text-emerald-400' : 'text-slate-400'}`}
                        style={{ opacity: Math.max(0, 1 - (sliderX / (maxDist * 0.5))) }}>
                        {cardState === 'loading' ? 'Executing...' :
                            cardState === 'success' ? 'Trade Executed' :
                                cardState === 'error' ? 'Failed - Try Again' : (
                                    <>
                                        Swipe to Approve
                                        <ChevronRight size={14} className="opacity-40 animate-pulse" />
                                    </>
                                )}
                    </span>
                </div>

                {/* Handle */}
                <div
                    className={`slider-handle w-12 h-12 rounded-full flex items-center justify-center cursor-grab relative z-10 ${cardState === 'success' ? 'success cursor-default' : ''}`}
                    style={{ transform: `translateX(${sliderX}px)` }}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                >
                    {cardState === 'success' ? (
                        <Check size={20} className="text-white" />
                    ) : cardState === 'error' ? (
                        <X size={20} className="text-white" />
                    ) : (
                        <ChevronRight size={20} className="text-white" />
                    )}
                </div>
            </div>
        </div>
    );
}
