import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { userId, email, provider } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        let endpoint = `${API_URL}/api/tradelocker/account-data?email=${encodeURIComponent(email)}`;
        if (userId) endpoint += `&user_id=${userId}`;

        let res = await fetch(endpoint, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        // Trigger session re-auth if 401 (expired)
        if (res.status === 401) {
            console.log(`[/api/admin/user-trading-analytics] Session 401 for ${email}, attempting re-auth...`);

            // Call the refresh-user-balance endpoint which has re-auth logic
            const refreshRes = await fetch(`${API_URL}/api/admin/refresh-user-balance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, email, provider }),
            });

            if (refreshRes.ok) {
                console.log(`[/api/admin/user-trading-analytics] Re-auth successful, retrying fetch...`);
                // Retry the original fetch
                res = await fetch(endpoint, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        }

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`[/api/admin/user-trading-analytics] FastAPI error (${res.status}):`, errorText);
            throw new Error(`FastAPI error: ${res.status} ${errorText}`);
        }

        const data = await res.json();

        // Transform history into growth data points
        const rawHistory = data.history || [];

        // Use realizedPnL or pnl field
        const sortedHistory = [...rawHistory].sort((a, b) => {
            const timeA = new Date(a.closedTime || a.openTime || 0).getTime();
            const timeB = new Date(b.closedTime || b.openTime || 0).getTime();
            return timeA - timeB;
        });

        // Reconstruct balance history
        const balanceInfo = data.balance || {};
        let currentBal = parseFloat(balanceInfo.balance || 0);
        const growthData = [];

        // Add current point
        growthData.push({
            time: new Date().toISOString(),
            balance: currentBal
        });

        // Work backwards
        let runningBal = currentBal;
        for (let i = sortedHistory.length - 1; i >= 0; i--) {
            const trade = sortedHistory[i];
            const pnlValue = parseFloat(trade.pnl || trade.realizedPnL || 0);
            runningBal -= pnlValue;
            growthData.unshift({
                time: trade.closedTime || trade.openTime,
                balance: runningBal
            });
        }

        // Limit growth points for performance if history is huge
        const sampledGrowth = growthData.length > 50
            ? growthData.filter((_, idx) => idx % Math.ceil(growthData.length / 50) === 0)
            : growthData;

        // Ensure the last point is always included
        if (sampledGrowth[sampledGrowth.length - 1]?.time !== growthData[growthData.length - 1]?.time) {
            sampledGrowth.push(growthData[growthData.length - 1]);
        }

        return NextResponse.json({
            status: 'success',
            analytics: data.analytics,
            balance: data.balance,
            growth: sampledGrowth,
            history: sortedHistory.slice(-10).reverse() // Latest 10 trades
        });

    } catch (err: any) {
        console.error('[/api/admin/user-trading-analytics] Error:', err.message);
        return NextResponse.json(
            { error: err.message || 'Unknown error fetching analytics' },
            { status: 500 }
        );
    }
}
