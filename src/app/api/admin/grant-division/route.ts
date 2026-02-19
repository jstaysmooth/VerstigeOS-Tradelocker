export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import https from 'https';

function httpsRequest(url: string, method: string, headers: Record<string, string>, body?: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const req = https.request(url, { method, headers }, (res) => {
            let data = '';
            res.on('data', chunk => (data += chunk));
            res.on('end', () => resolve(data));
        });
        req.on('error', reject);
        req.setTimeout(10000, () => req.destroy(new Error('Timed out')));
        if (body) req.write(body);
        req.end();
    });
}

export async function POST(req: NextRequest) {
    try {
        const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

        if (!SUPABASE_URL || !SERVICE_KEY) {
            return NextResponse.json({ error: 'Missing env vars' }, { status: 500 });
        }

        const { userId, division } = await req.json();
        if (!userId || !division) {
            return NextResponse.json({ error: 'userId and division are required' }, { status: 400 });
        }

        // 1. Get current user metadata
        const getRaw = await httpsRequest(
            `${SUPABASE_URL}/auth/v1/admin/users/${userId}`,
            'GET',
            { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` }
        );
        const user = JSON.parse(getRaw);
        if (!user?.id) throw new Error('User not found');

        const current: string[] = user.user_metadata?.selected_divisions ?? [];
        const normalized = division.toLowerCase();
        const updated = current.includes(normalized) ? current : [...current, normalized];

        // 2. Update
        const bodyStr = JSON.stringify({
            user_metadata: { ...user.user_metadata, selected_divisions: updated },
        });
        await httpsRequest(
            `${SUPABASE_URL}/auth/v1/admin/users/${userId}`,
            'PUT',
            {
                'apikey': SERVICE_KEY,
                'Authorization': `Bearer ${SERVICE_KEY}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(bodyStr).toString(),
            },
            bodyStr
        );

        return NextResponse.json({ success: true, divisions: updated });
    } catch (err: any) {
        console.error('[/api/admin/grant-division]', err);
        return NextResponse.json({ error: err?.message }, { status: 500 });
    }
}
