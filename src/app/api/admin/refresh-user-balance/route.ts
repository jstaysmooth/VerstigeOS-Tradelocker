import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { userId, email, provider } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Use internal API URL if available, otherwise fallback to localhost
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

        // Proxy the request to the FastAPI backend
        // TradeLocker uses /api/tradelocker/account-data?email=...
        let endpoint = `${API_URL}/api/tradelocker/account-data?email=${encodeURIComponent(email)}`;

        // Note: For DxTrade or MatchTrader, we'd adjust the endpoint accordingly.
        // For now, we focus on TradeLocker as it's the primary integrated platform.

        const res = await fetch(endpoint, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.detail || 'Failed to refresh balance from trading platform');
        }

        const data = await res.json();

        // Return the fresh balance and analytics
        return NextResponse.json({
            status: 'success',
            balance: data.balance?.balance ?? 0,
            equity: data.balance?.equity ?? 0,
            analytics: data.analytics
        });

    } catch (err: any) {
        console.error('[/api/admin/refresh-user-balance] Error:', err.message);
        return NextResponse.json(
            { error: err.message || 'Unknown error refreshing balance' },
            { status: 500 }
        );
    }
}
