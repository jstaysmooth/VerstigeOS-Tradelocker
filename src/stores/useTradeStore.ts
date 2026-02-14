import { create } from 'zustand';
import io from 'socket.io-client';
type Socket = any;

interface TradeSignal {
    symbol: string;
    type: 'BUY' | 'SELL';
    entry: number;
    sl: number;
    tp: number;
    tp1?: number; // For partial close logic
    risk?: number;
}

interface Trade {
    id: string; // Ticket ID
    symbol: string;
    type: 'BUY' | 'SELL';
    volume: number;
    openPrice: number;
    currentPrice: number;
    profit: number; // Active profit
    sl: number;
    tp: number;
    status: 'ACTIVE' | 'CLOSED';
}

interface TradeState {
    activeTrades: Trade[];
    balance: number;
    equity: number;
    dailyProfit: number;
    signals: TradeSignal[];
    isConnected: boolean;
    socket: Socket | null;

    // Actions
    connect: (url?: string) => void;
    disconnect: () => void;
    executeSignal: (signal: TradeSignal) => Promise<void>;
    closeTrade: (tradeId: string) => void;
}

export const useTradeStore = create<TradeState>((set, get) => ({
    activeTrades: [],
    balance: 0,
    equity: 0,
    dailyProfit: 0,
    signals: [],
    isConnected: false,
    socket: null,

    connect: (url = 'http://localhost:4000') => {
        if (get().socket) return; // Prevent multiple connections

        const socket = io(url, {
            transports: ['websocket'],
            reconnectionAttempts: 5
        });

        socket.on('connect', () => {
            console.log('Connected to PrimeSync Execution Engine');
            set({ isConnected: true });
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from PrimeSync Execution Engine');
            set({ isConnected: false });
        });

        socket.on('activeProfitsUpdate', (data: { trades: Trade[], totalProfit: number, equity: number }) => {
            // Real-time sync of Active Profits without page refresh
            set({
                activeTrades: data.trades,
                dailyProfit: data.totalProfit,
                equity: data.equity
            });
        });

        socket.on('tradeExecuted', (payload: { result: Trade }) => {
            // Optimistically update or wait for next activeProfitsUpdate?
            // Usually execution returns the new trade.
            const newTrade = payload.result;
            set((state) => ({
                activeTrades: [...state.activeTrades, newTrade]
            }));
        });

        socket.on('accountUpdate', (account: { balance: number }) => {
            set({ balance: account.balance });
        });

        set({ socket });
    },

    disconnect: () => {
        const { socket } = get();
        if (socket) {
            socket.disconnect();
            set({ socket: null, isConnected: false });
        }
    },

    executeSignal: async (signal) => {
        try {
            // If socket is connected, we might emit directly or use HTTP API
            // Using HTTP API as per conventional hybrid approach for critical actions
            const response = await fetch('http://localhost:4000/api/execute-signal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signal)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Execution Failed');
            }

            // Success logic handled by socket event 'tradeExecuted' or similar
        } catch (error) {
            console.error('Trade Execution Failed:', error);
            throw error;
        }
    },

    closeTrade: (tradeId) => {
        const { socket } = get();
        if (socket && socket.connected) {
            socket.emit('closeTrade', tradeId);
        }
    }
}));
