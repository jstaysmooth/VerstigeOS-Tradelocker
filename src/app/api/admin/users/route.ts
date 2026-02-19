export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { createClient } from '@supabase/supabase-js';

import { NextResponse } from 'next/server';
import https from 'https';

function httpsGet(url: string, headers: Record<string, string>): Promise<string> {
    return new Promise((resolve, reject) => {
        const req = https.request(url, { method: 'GET', headers }, (res) => {
            let data = '';
            res.on('data', chunk => (data += chunk));
            res.on('end', () => resolve(data));
        });
        req.on('error', reject);
        req.setTimeout(10000, () => { req.destroy(new Error('Request timed out')); });
        req.end();
    });
}

export async function GET() {
    try {
        const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

        if (!SUPABASE_URL || !SERVICE_KEY) {
            console.error('[/api/admin/users] Missing env vars:', { url: !!SUPABASE_URL, key: !!SERVICE_KEY });
            return NextResponse.json(
                { error: `Backend configuration error: SUPABASE_SERVICE_KEY or NEXT_PUBLIC_SUPABASE_URL is not defined in the environment. URL: ${SUPABASE_URL ? 'ok' : 'MISSING'}, SERVICE_KEY: ${SERVICE_KEY ? 'ok' : 'MISSING'}. Make sure to restart your dev server after updating .env.local.` },
                { status: 500 }
            );
        }

        const raw = await httpsGet(
            `${SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=1000`,
            {
                'apikey': SERVICE_KEY,
                'Authorization': `Bearer ${SERVICE_KEY}`,
                'Content-Type': 'application/json',
            }
        );

        const body = JSON.parse(raw);
        const rawUsers: any[] = Array.isArray(body) ? body : (body.users ?? []);

        // Fetch trading accounts to show connection status and balance
        const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY);
        const { data: accounts, error: accError } = await supabaseAdmin
            .from('trading_accounts')
            .select('user_id, balance, is_active, provider');

        if (accError) {
            console.error('[/api/admin/users] Error fetching trading accounts:', accError);
        }

        const mapped = rawUsers.map((u: any) => {
            const meta = u.user_metadata || {};
            const firstName = meta.first_name || meta.firstName || '';
            const lastName = meta.last_name || meta.lastName || '';
            const fullName =
                `${firstName} ${lastName}`.trim() ||
                meta.full_name || meta.name ||
                (u.email ? u.email.split('@')[0] : 'Unknown');

            const divisions: string[] = Array.isArray(meta.selected_divisions)
                ? meta.selected_divisions
                : [];

            // Find matching trading account
            const userAccount = accounts?.find(a => a.user_id === u.id);

            return {
                id: u.id,
                email: u.email ?? '',
                fullName,
                firstName,
                lastName,
                divisions,
                isAdmin: meta.is_admin === true,
                createdAt: u.created_at,
                lastSignIn: u.last_sign_in_at ?? null,
                tradingAccountConnected: !!userAccount && userAccount.is_active,
                tradingBalance: userAccount?.balance ?? 0,
                tradingProvider: userAccount?.provider ?? null
            };
        });

        mapped.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return NextResponse.json({ users: mapped });
    } catch (err: any) {
        console.error('[/api/admin/users] ERROR:', err?.message);
        return NextResponse.json(
            { error: err?.message ?? 'Unknown error fetching users' },
            { status: 500 }
        );
    }
}
