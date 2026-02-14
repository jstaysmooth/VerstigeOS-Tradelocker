import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Forward the execution request to the Python backend
        const response = await fetch(`${BACKEND_URL}/api/dxtrade/execute`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (response.ok) {
            return NextResponse.json(data);
        } else {
            return NextResponse.json(
                { error: data.detail || 'Execution failed' },
                { status: response.status }
            );
        }
    } catch (error) {
        console.error('DxTrade execution proxy error:', error);
        return NextResponse.json(
            { error: 'Internal server error during execution proxy' },
            { status: 500 }
        );
    }
}
