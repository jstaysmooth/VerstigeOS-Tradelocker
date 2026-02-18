"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/dashboard/trading');
    }, [router]);

    return (
        <div style={{ padding: '2rem', color: 'white', textAlign: 'center' }}>
            <h1>Redirecting to Trading Dashboard...</h1>
            <p>Account verification is now available directly in the Trading Dashboard.</p>
        </div>
    );
}
