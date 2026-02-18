"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface Signal {
    id: string;
    symbol: string;
    direction: 'BUY' | 'SELL';
    entry: number;
    stop_loss: number;
    take_profit: number;
    risk_percent: number;
    rr_ratio?: number;
    timeframe?: string;
    notes?: string;
    status: 'pending' | 'approved' | 'rejected' | 'executed';
    created_at: string;
}

export function useSignals(limit = 20) {
    const [signals, setSignals] = useState<Signal[]>([]);
    const [loading, setLoading] = useState(true);

    // Initial fetch
    useEffect(() => {
        const fetchSignals = async () => {
            try {
                const { data, error } = await supabase
                    .from("signals")
                    .select("*")
                    .order("created_at", { ascending: false })
                    .limit(limit);

                if (error) throw error;
                if (data) setSignals(data);
            } catch (err) {
                console.error("Error fetching signals:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSignals();
    }, [limit]);

    // Realtime subscription
    useEffect(() => {
        const channel = supabase
            .channel("signals-feed")
            .on("postgres_changes",
                { event: "INSERT", schema: "public", table: "signals" },
                (payload) => {
                    setSignals((prev) => [payload.new as Signal, ...prev]);
                }
            )
            .on("postgres_changes",
                { event: "UPDATE", schema: "public", table: "signals" },
                (payload) => {
                    setSignals((prev) =>
                        prev.map((s) => s.id === payload.new.id ? { ...s, ...(payload.new as Signal) } : s)
                    );
                }
            ).subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const updateStatus = useCallback(async (signalId: string, status: string) => {
        try {
            const { error } = await supabase
                .from("signals")
                .update({ status })
                .eq("id", signalId);

            if (error) throw error;
        } catch (err) {
            console.error(`Error updating signal ${signalId} to ${status}:`, err);
        }
    }, []);

    return {
        signals,
        loading,
        approveSignal: (id: string) => updateStatus(id, "approved"),
        rejectSignal: (id: string) => updateStatus(id, "rejected"),
    };
}
