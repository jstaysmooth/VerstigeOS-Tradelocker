import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { API_URL } from '@/lib/config';
type Socket = any;

interface MetaStats {
    balance: number;
    equity: number;
    margin: number;
    freeMargin: number;
    isConnected: boolean;
}

export const useMetaStats = (accountId: string | null) => {
    const [stats, setStats] = useState<MetaStats>({
        balance: 0,
        equity: 0,
        margin: 0,
        freeMargin: 0,
        isConnected: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const socket: Socket = io(API_URL, {
            transports: ['websocket'],
            autoConnect: true,
        });

        setLoading(true);

        socket.on('connect', () => {
            console.log('Connected to Verstige Backend');
            setStats(prev => ({ ...prev, isConnected: true }));
            setLoading(false);
            setError(null);

            // Subscribe to account updates if needed
            // socket.emit('subscribe', { accountId });
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from Verstige Backend');
            setStats(prev => ({ ...prev, isConnected: false }));
        });

        socket.on('connect_error', (err: Error) => {
            console.error('Connection Error:', err);
            setError('Failed to connect to trading engine');
            setLoading(false);
        });

        // Listen for 'account_update' or similar events from backend
        // The backend emits 'Account' event with AccountInfoResponse
        socket.on('Account', (data: any) => {
            if (data) {
                // Parse the backend response model
                // Assuming backend sends: { balance: ..., equity: ..., margin: ..., free_margin: ... }
                // or specific fields. AccountHandler sends AccountInfoResponse.

                // Note: The AccountInfoResponse has fields: balance, equity, margin, free_margin
                // But the backend `account_info` dictionary uses keys like 'balance', 'equity', 'margin', 'free_margin'
                // Let's map them.

                setStats(prev => ({
                    ...prev,
                    balance: data.balance || prev.balance,
                    equity: data.equity || prev.equity,
                    margin: data.margin || prev.margin,
                    freeMargin: data.free_margin || prev.freeMargin,
                }));
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [accountId]);

    return { stats, loading, error };
};
