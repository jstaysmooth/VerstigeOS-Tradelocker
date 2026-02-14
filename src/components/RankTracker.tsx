import React from 'react';
import { ArrowUp } from 'lucide-react';
import '@/styles/components/RankTracker.css';

interface RankTrackerProps {
    simulationRank?: string;
}

const ranks = [
    {
        name: 'Associate',
        pct: '9%',
        qualifier: '5 Sales or 3 Sales + 1 Assoc',
        requirement: '5 personal sales OR (3 personal sales + 1 Associate)'
    },
    {
        name: 'Senior Associate',
        pct: '11%',
        qualifier: '$500 Sales or 3 Assoc + $300 Team',
        requirement: '$500 personal sales OR (3 Associates + $300 team sales)'
    },
    {
        name: 'Manager',
        pct: '15%',
        qualifier: '$1500 Premium or 3 Sr Assoc + $1500 Team',
        requirement: '$1500 personal premium sales OR (3 Senior Associates + $1500 team sales)'
    },
    {
        name: 'Director',
        pct: '20%',
        qualifier: '$3000 Personal or 3 Mgrs + $3000 Team',
        requirement: '$3000 personal sales OR (3 Managers + $3000 team sales)'
    },
    {
        name: 'Senior Director',
        pct: '37.5%',
        qualifier: '$700 Personal Prem or Team Split',
        requirement: '$700 personal premium OR ($700 total team premium with max $350 from one leg)'
    },
    {
        name: 'Executive Director',
        pct: '47.5%',
        qualifier: '$1400 Personal Prem or Team Split',
        requirement: '$1400 personal premium OR ($1400 total team premium with max $700 from one leg)'
    },
    {
        name: 'Bronze Executive Director',
        pct: '49%',
        qualifier: '1 ED + $2k Team',
        requirement: '1 Executive Director in downline + $2,000 team premium'
    },
    {
        name: 'Silver Executive Director',
        pct: '51%',
        qualifier: '2 EDs + $4k Team',
        requirement: '2 Executive Directors in downline + $4,000 team premium'
    },
    {
        name: 'Gold Executive Director',
        pct: '53%',
        qualifier: '3 EDs + $8k Team',
        requirement: '3 Executive Directors in downline + $8,000 team premium'
    },
    {
        name: 'Platinum Executive Director',
        pct: '55%',
        qualifier: '5 EDs + $15k Team',
        requirement: '5 Executive Directors in downline + $15,000 team premium'
    },
    {
        name: 'Diamond Executive Director',
        pct: '60%',
        qualifier: '10 EDs + $50k Team',
        requirement: '10 Executive Directors in downline + $50,000 team premium'
    },
];

const RankTracker: React.FC<RankTrackerProps> = ({ simulationRank = 'Senior Associate' }) => {
    // Find index of the simulated rank, defaulting to Associate if not found or if "Associate"
    const currentRankIndex = ranks.findIndex(r => r.name === simulationRank);
    const validRankIndex = currentRankIndex >= 0 ? currentRankIndex : 0;

    // Logic to determine "next rank" based on simulation
    // If simulation is ED, next is null or "Maxed"
    // For simulation, we might want to show "How to get HERE" vs "What is NEXT"
    // User requested: "act as a simulation, module and explanation of all commissions and how to grow"

    // Let's assume if I select "Director", I want to see the Director card active/highlighted.

    const nextRank = ranks[validRankIndex + 1] || ranks[validRankIndex];
    const currentRankObj = ranks[validRankIndex] || ranks[0];

    return (
        <div className="rank-progression-v2 glass-panel animate-fade-in-up" style={{ marginTop: 'var(--spacing-xl)' }}>
            <div className="flex-between header">
                <h3>Rank Simulation & Achievement</h3>
                <span className="current-status badge green">Simulating: {simulationRank}</span>
            </div>

            <div className="current-rank-card glass-card">
                <div className="rank-info-main">
                    <span className="label">Simulated Rank</span>
                    <h2 className="rank-title">{currentRankObj.name}</h2>
                    <p className="qual-logic">Earn {currentRankObj.pct} commission on personal production.</p>
                </div>
                <div className="rank-progress-circle">
                    <div className="circle-inner">100%</div>
                </div>
            </div>

            {validRankIndex < ranks.length - 1 && (
                <div className="next-rank-path">
                    <div className="flex-between">
                        <span className="label">Next Milestone: {nextRank.name}</span>
                        <span className="label">Commission Bump: {nextRank.pct}</span>
                    </div>
                    <div className="progress-bar-v2">
                        <div className="progress-fill" style={{ width: '0%' }} />
                    </div>
                    <div className="rank-requirements">
                        <p>To reach <b>{nextRank.name}</b> from here, achieve:</p>
                        <div className="glass-panel" style={{ padding: '1rem', marginTop: '1rem' }}>
                            {nextRank.requirement}
                        </div>
                    </div>
                </div>
            )}

            <div className="rank-scroller">
                {ranks.map((r, i) => (
                    <div
                        key={i}
                        className={`rank-card-v2 ${r.name === simulationRank ? 'active' : ''} ${i < validRankIndex ? 'completed' : ''}`}
                    >
                        <div className="rank-badge-v2">
                            {r.name === simulationRank ? '★' : (i < validRankIndex ? '✓' : i + 1)}
                        </div>
                        <div className="rank-meta">
                            <h4>{r.name}</h4>
                            <span className="commission">{r.pct} Commission</span>
                            <p className="qual-desc">{r.requirement}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RankTracker;
