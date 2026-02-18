"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import io from "socket.io-client";
import { API_URL } from '@/lib/config';
type Socket = any;

// Types for live MT5 data
export interface SignalData {
    id: number;
    provider: string;
    providerRank: string;
    pair: string;
    action: 'BUY' | 'SELL';
    pips: number;
    price: string;
    sl: string;
    tp1: string;
    tp2: string;
    tp3: string;
    category: string;
    timestamp: string;
    winRate: number;
    lotSize: number;
    profit?: number;
}

export interface SignalResult {
    id: string | number;
    pair: string;
    type: string;
    entryPrice: string;
    closePrice: string;
    netProfit: number;
    pips: number;
    lotSize: number;
    timestamp: string;
    provider: string;
}

interface TradingContextType {
    socket: Socket | null;
    signals: SignalData[];
    results: SignalResult[];
    prices: Record<string, number>;

    // Account State
    isConnected: boolean;
    accountBalance: number;
    accountEquity: number;
    margin: number;
    freeMargin: number;
    marginLevel: number;

    // Computed Analytics
    totalPnL: number;
    dailyPnL: number;
    winRate: number;
    totalTrades: number;
    openPositions: number;

    // Platform Connection States
    mt5Connected: boolean;
    dxConnected: boolean;
    matchTraderConnected: boolean;
    tradeLockerConnected: boolean;

    // TradeLocker Data
    tradeLockerData: {
        balance: number;
        equity: number;
        positions: any[];
        analytics: any;
    } | null;

    // Actions
    setMt5Connected: (connected: boolean) => void;
    setDxConnected: (connected: boolean) => void;
    setMatchTraderConnected: (connected: boolean) => void;
    setTradeLockerConnected: (connected: boolean) => void;
    setAccountBalance: (balance: number) => void;
    setAccountEquity: (equity: number) => void;
    setTradeLockerData: (data: any) => void;
    setSignals: (signals: SignalData[]) => void;
    setResults: React.Dispatch<React.SetStateAction<any[]>>;
    refreshTradeLockerData: (email: string) => Promise<void>;
    approveSignal: (signalId: number, signalData?: any) => Promise<void>;
    disconnectTradeLocker: () => Promise<void>;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const useTrading = () => {
    const context = useContext(TradingContext);
    if (!context) {
        throw new Error("useTrading must be used within a TradingProvider");
    }
    return context;
};

export const TradingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [signals, setSignals] = useState<SignalData[]>([]);
    const [results, setResults] = useState<SignalResult[]>([]);
    const [prices, setPrices] = useState<Record<string, number>>({});

    // Account State
    const [accountBalance, setAccountBalance] = useState(0);
    const [accountEquity, setAccountEquity] = useState(0);
    const [margin, setMargin] = useState(0);
    const [freeMargin, setFreeMargin] = useState(0);
    const [marginLevel, setMarginLevel] = useState(0);

    // Platform Connection States
    const [mt5Connected, setMt5Connected] = useState(false);
    const [dxConnected, setDxConnected] = useState(false);
    const [matchTraderConnected, setMatchTraderConnected] = useState(false);
    const [tradeLockerConnected, setTradeLockerConnected] = useState(false);
    const [tradeLockerData, setTradeLockerData] = useState<any>(null);

    const isConnected = mt5Connected || dxConnected || matchTraderConnected || tradeLockerConnected;

    const totalTrades = useMemo(() => {
        if (tradeLockerConnected && tradeLockerData?.analytics?.total_trades !== undefined) {
            return tradeLockerData.analytics.total_trades;
        }
        return results.length;
    }, [results.length, tradeLockerConnected, tradeLockerData?.analytics]);

    const openPositions = useMemo(() => {
        if (tradeLockerConnected && tradeLockerData?.analytics?.open_positions !== undefined) {
            return tradeLockerData.analytics.open_positions;
        }
        return signals.length;
    }, [signals.length, tradeLockerConnected, tradeLockerData?.analytics]);

    const overrideWinRate = useMemo(() => {
        if (tradeLockerConnected && tradeLockerData?.analytics?.win_rate !== undefined) {
            return Math.round(tradeLockerData.analytics.win_rate);
        }
        if (results.length === 0) return 0;
        const wins = results.filter(r => r.netProfit > 0).length;
        return Math.round((wins / results.length) * 100);
    }, [results, tradeLockerConnected, tradeLockerData?.analytics]);

    const overrideTotalPnL = useMemo(() => {
        if (tradeLockerConnected && tradeLockerData?.analytics?.total_pnl !== undefined) {
            return tradeLockerData.analytics.total_pnl;
        }
        return results.reduce((acc, r) => acc + r.netProfit, 0);
    }, [results, tradeLockerConnected, tradeLockerData?.analytics]);

    const dailyPnL = useMemo(() => {
        const today = new Date().toDateString();
        return results
            .filter(r => {
                try { return new Date(r.timestamp).toDateString() === today; }
                catch { return false; }
            })
            .reduce((acc, r) => acc + r.netProfit, 0);
    }, [results]);

    // Initialize Socket
    useEffect(() => {
        const newSocket = io(API_URL, {
            transports: ["polling", "websocket"], // Allow polling first for stability
            path: "/socket.io",
            withCredentials: true,
            reconnectionAttempts: 5,
        });

        newSocket.on("connect", () => {
            console.log("TradingContext Socket Connected:", newSocket.id);
        });

        newSocket.on("price_update", (data: any) => {
            setPrices(prev => ({
                ...prev,
                [data.symbol]: (data.bid + data.ask) / 2
            }));
        });

        newSocket.on("new_signal", (newSignal: any) => {
            console.log("Context New Signal:", newSignal);
            const signal: SignalData = {
                id: newSignal.id || Date.now(),
                provider: newSignal.provider || "Unknown",
                providerRank: newSignal.providerRank || "Pro",
                pair: newSignal.pair,
                action: newSignal.action as 'BUY' | 'SELL',
                pips: newSignal.pips || 0,
                price: newSignal.price,
                sl: newSignal.sl,
                tp1: newSignal.tp1,
                tp2: newSignal.tp2 || "0",
                tp3: newSignal.tp3 || "0",
                category: newSignal.category || "FOREX",
                timestamp: newSignal.timestamp || "Just now",
                winRate: newSignal.winRate || 0,
                lotSize: newSignal.lotSize || 0.01,
                profit: newSignal.profit || 0
            };
            // Deduplicate: if position already exists, update its profit; otherwise add it
            setSignals(prev => {
                const idx = prev.findIndex(s => String(s.id) === String(signal.id));
                if (idx >= 0) {
                    // Update the existing signal with latest profit from re-sync
                    const updated = [...prev];
                    updated[idx] = { ...updated[idx], profit: signal.profit };
                    return updated;
                }
                return [signal, ...prev];
            });
        });

        newSocket.on("signal_result", (result: any) => {
            console.log("Context Signal Result:", result);
            const formattedResult: SignalResult = {
                id: result.id || Date.now(),
                pair: result.pair,
                type: result.type,
                entryPrice: result.entryPrice,
                closePrice: result.closePrice,
                netProfit: result.netProfit,
                pips: result.pips || 0,
                lotSize: result.lotSize || 0.01,
                timestamp: result.timestamp || new Date().toISOString(),
                provider: result.provider || "Verstige AI"
            };

            // Deduplicate: don't add if a result with the same ID already exists
            setResults(prev => {
                const exists = prev.some(r =>
                    String(r.id) === String(formattedResult.id)
                );
                if (exists) return prev;
                return [formattedResult, ...prev];
            });
            setSignals(prev => prev.filter(s => s.id !== result.id && s.id !== Number(result.id)));
        });

        newSocket.on("account_update", (data: any) => {
            console.log("Context Account Update:", data);
            const d = data.data || data;
            if (d.balance !== undefined) setAccountBalance(d.balance);
            if (d.equity !== undefined) setAccountEquity(d.equity);
            if (d.margin !== undefined) setMargin(d.margin);
            if (d.freeMargin !== undefined) setFreeMargin(d.freeMargin);
            if (d.marginLevel !== undefined) setMarginLevel(d.marginLevel);
            // Auto-connect when receiving real account data
            setMt5Connected(true);
        });

        // Live P&L updates from MetaAPI position changes
        newSocket.on("position_update", (data: any) => {
            const d = data.data || data;
            const posId = d.id;
            const liveProfit = d.unrealizedProfit ?? d.profit ?? 0;
            const swap = d.swap ?? 0;
            const commission = d.commission ?? 0;
            const totalProfit = liveProfit + swap + commission;

            setSignals(prev => prev.map(s => {
                // Match by string or number ID
                if (s.id === posId || s.id === Number(posId) || String(s.id) === String(posId)) {
                    return { ...s, profit: totalProfit };
                }
                return s;
            }));
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    // Check connection on mount
    useEffect(() => {
        const checkConnection = async () => {
            const userId = localStorage.getItem('v2_user_id');
            if (!userId) return;

            try {
                const res = await fetch(`${API_URL}/api/tradelocker/status?user_id=${userId}`);
                const data = await res.json();
                if (data.connected) {
                    setTradeLockerConnected(true);
                    if (data.email) {
                        refreshTradeLockerData(data.email);
                    }
                }
            } catch (e) {
                console.error("Failed to check TradeLocker status:", e);
            }
        };
        checkConnection();
    }, []);

    const disconnectTradeLocker = async () => {
        try {
            const userId = localStorage.getItem('v2_user_id');
            if (!userId) return;

            await fetch(`${API_URL}/api/tradelocker/disconnect`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId })
            });
            setTradeLockerConnected(false);
            setTradeLockerData(null);
            setAccountBalance(0);
            setAccountEquity(0);
            setSignals([]); // Clear positions
        } catch (error) {
            console.error("Failed to disconnect TradeLocker:", error);
        }
    };

    const refreshTradeLockerData = async (email: string) => {
        try {
            const response = await fetch(`${API_URL}/api/tradelocker/account-data?email=${email}`);
            const data = await response.json();
            console.log("TradingContext: refreshTradeLockerData response:", data);
            if (data.status === 'success') {
                setTradeLockerData(data);
                if (data.balance) {
                    setAccountBalance(data.balance.balance);
                    setAccountEquity(data.balance.equity);
                }

                // Map TradeLocker positions to UI signals format
                if (data.positions) {
                    console.log('RECEIVED TL POSITIONS:', data.positions);
                    const mappedPositions = data.positions.map((pos: any) => ({
                        id: pos.id,
                        provider: "TradeLocker",
                        providerRank: "Live",
                        pair: pos.tradableInstrumentId || pos.symbol || `ID: ${pos.instrumentId}`,
                        action: (pos.side || pos.direction || "BUY").toUpperCase() as 'BUY' | 'SELL',
                        pips: 0,
                        price: (pos.avgPrice || pos.price || pos.entryPrice || "0").toString(),
                        sl: (pos.stopLoss || pos.sl || "").toString(),
                        tp1: (pos.takeProfit || pos.tp || "").toString(),
                        tp2: "",
                        tp3: "",
                        category: "FOREX",
                        timestamp: pos.openTime || pos.created || "Just now",
                        winRate: 0,
                        lotSize: parseFloat(pos.qty || pos.quantity || pos.lots || 0),
                        profit: parseFloat(pos.unrealizedPnL || pos.floatingPnL || pos.profit || 0)
                    }));
                    setSignals(mappedPositions);
                }

                if (data.analytics) {
                    console.log('RECEIVED TL ANALYTICS:', data.analytics);
                    setTradeLockerData((prev: any) => ({
                        ...prev,
                        analytics: data.analytics
                    }));
                }

                if (data.history) {
                    console.log('RECEIVED TL HISTORY:', data.history.length, 'records');
                    const mappedHistory = data.history.map((trade: any) => ({
                        id: trade.id || trade.orderId || trade.ticket,
                        pair: trade.tradableInstrumentId || trade.symbol || trade.instrument || "Unknown",
                        type: trade.side || trade.action || trade.type || "N/A",
                        entryPrice: parseFloat(trade.avgPrice || trade.price || trade.entryPrice || 0),
                        closePrice: parseFloat(trade.closePrice || trade.avgPrice || trade.exitPrice || 0),
                        netProfit: parseFloat(trade.pnl || trade.realizedPnL || trade.profit || 0),
                        pips: parseFloat(trade.pips || 0),
                        lotSize: parseFloat(trade.qty || trade.quantity || trade.volume || trade.lots || 0),
                        timestamp: trade.date || trade.timestamp || trade.openTime || new Date().toISOString(),
                        provider: "TradeLocker"
                    }));
                    setResults((prev: SignalResult[]) => {
                        const newIds = new Set(mappedHistory.map((h: any) => h.id));
                        const filteredPrev = prev.filter(p => !newIds.has(p.id));
                        return [...mappedHistory, ...filteredPrev];
                    });
                }
            }
        } catch (error) {
            console.error("Error refreshing TradeLocker data:", error);
        }
    };

    const approveSignal = async (signalId: number, signalData?: any) => {
        console.log("Approving signal via context:", signalId, signalData);
        const userId = localStorage.getItem('v2_user_id');
        if (!userId) {
            console.error("No user ID found, cannot execute trade");
            return;
        }

        try {
            const payload = {
                user_id: userId,
                signal_id: signalId,
                symbol: signalData?.symbol,
                action: signalData?.action,
                sl: signalData?.sl,
                tp: signalData?.tp1 // Default to TP1
            };

            const response = await fetch(`${API_URL}/api/tradelocker/execute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (response.ok) {
                console.log("Trade executed successfully:", result);
                // Refresh data to show new position
                if (isConnected) refreshTradeLockerData(localStorage.getItem('v2_user_email') || '');
            } else {
                console.error("Trade execution failed:", result);
                throw new Error(result.detail || "Execution failed");
            }
        } catch (error) {
            console.error("Error executing signal:", error);
            throw error;
        }
    };

    return (
        <TradingContext.Provider value={{
            socket,
            signals,
            results,
            prices,
            isConnected,
            accountBalance,
            accountEquity,
            margin,
            freeMargin,
            marginLevel,
            totalPnL: overrideTotalPnL,
            dailyPnL,
            winRate: overrideWinRate,
            totalTrades,
            openPositions,
            mt5Connected,
            dxConnected,
            matchTraderConnected,
            tradeLockerConnected,
            tradeLockerData,
            setMt5Connected,
            setDxConnected,
            setMatchTraderConnected,
            setTradeLockerConnected,
            setAccountBalance,
            setAccountEquity,
            setTradeLockerData,
            setSignals,
            setResults,
            refreshTradeLockerData,
            approveSignal,
            disconnectTradeLocker
        }}>
            {children}
        </TradingContext.Provider>
    );
};
