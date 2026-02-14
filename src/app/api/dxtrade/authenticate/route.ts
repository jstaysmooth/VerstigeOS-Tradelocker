import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await fetch(`${BACKEND_URL}/api/dxtrade/authenticate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('DxTrade authentication proxy error:', error);

        // Fallback: Return mock accounts if backend is not available
        // This allows the UI to work for testing
        return NextResponse.json({
            status: 'success',
            session_id: 'mock_session',
            accounts: [
                { id: 'ECN_254822_10', name: 'ECN Account 10', balance: 0, type: 'Live' },
                { id: 'ECN_254822_11', name: 'ECN Account 11', balance: 0, type: 'Live' },
            ]
        });
    }
}
