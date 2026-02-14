"use client";
import React, { useState, useMemo } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    PlusCircle,
    TrendingUp,
    TrendingDown,
    BarChart3,
    Target,
    Calendar,
    X,
    ArrowUpRight,
    ArrowDownRight,
    Flame,
    Award
} from 'lucide-react';
import './TradeJournalView.css';

interface JournalEntry {
    id: number;
    date: number;
    month: number;
    year: number;
    amount: number;
    type: 'win' | 'loss';
    symbol: string;
    action?: 'BUY' | 'SELL';
    lots?: number;
    notes?: string;
}

const TradeJournalView: React.FC = () => {
    const now = new Date();
    const [currentMonth, setCurrentMonth] = useState(now.getMonth());
    const [currentYear, setCurrentYear] = useState(now.getFullYear());
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Entry form state
    const [entryDate, setEntryDate] = useState(now.getDate());
    const [entryAmount, setEntryAmount] = useState('');
    const [entrySymbol, setEntrySymbol] = useState('XAUUSD');
    const [entryType, setEntryType] = useState<'win' | 'loss'>('win');
    const [entryAction, setEntryAction] = useState<'BUY' | 'SELL'>('BUY');
    const [entryLots, setEntryLots] = useState('0.01');
    const [entryNotes, setEntryNotes] = useState('');

    // Demo data
    const [entries, setEntries] = useState<JournalEntry[]>([
        { id: 1, date: 3, month: 1, year: 2026, amount: 420, type: 'win', symbol: 'XAUUSD', action: 'BUY', lots: 0.50, notes: 'Clean breakout, followed plan' },
        { id: 2, date: 3, month: 1, year: 2026, amount: 85, type: 'win', symbol: 'EURUSD', action: 'SELL', lots: 0.20, notes: 'Reversal at key level' },
        { id: 3, date: 7, month: 1, year: 2026, amount: 315, type: 'win', symbol: 'EURUSD', action: 'BUY', lots: 1.00, notes: 'NFP trade, scaled in' },
        { id: 4, date: 7, month: 1, year: 2026, amount: 60, type: 'loss', symbol: 'GBPUSD', action: 'SELL', lots: 0.30 },
        { id: 5, date: 12, month: 1, year: 2026, amount: 150, type: 'win', symbol: 'NAS100', action: 'BUY', lots: 0.10, notes: 'Tech earnings play' },
        { id: 6, date: 14, month: 1, year: 2026, amount: 180, type: 'loss', symbol: 'XAUUSD', action: 'SELL', lots: 0.40, notes: 'Stopped out — overextended' },
        { id: 7, date: 14, month: 1, year: 2026, amount: 95, type: 'win', symbol: 'US30', action: 'BUY', lots: 0.05 },
        { id: 8, date: 18, month: 1, year: 2026, amount: 240, type: 'win', symbol: 'XAUUSD', action: 'BUY', lots: 0.60, notes: 'Trend continuation' },
        { id: 9, date: 21, month: 1, year: 2026, amount: 90, type: 'loss', symbol: 'BTCUSD', action: 'SELL', lots: 0.02, notes: 'Wrong direction, cut quick' },
        { id: 10, date: 24, month: 1, year: 2026, amount: 560, type: 'win', symbol: 'XAUUSD', action: 'BUY', lots: 1.00, notes: 'Best trade of the month' },
    ]);

    // Calendar helpers
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

    const monthEntries = useMemo(() =>
        entries.filter(e => e.month === currentMonth && e.year === currentYear),
        [entries, currentMonth, currentYear]
    );

    const getEntriesForDay = (day: number) =>
        monthEntries.filter(e => e.date === day);

    const getDayPL = (day: number) => {
        const dayEntries = getEntriesForDay(day);
        return dayEntries.reduce((acc, e) =>
            e.type === 'win' ? acc + e.amount : acc - e.amount, 0);
    };

    // Monthly analytics
    const analytics = useMemo(() => {
        const wins = monthEntries.filter(e => e.type === 'win');
        const losses = monthEntries.filter(e => e.type === 'loss');
        const totalPL = monthEntries.reduce((acc, e) =>
            e.type === 'win' ? acc + e.amount : acc - e.amount, 0);
        const winRate = monthEntries.length > 0
            ? Math.round((wins.length / monthEntries.length) * 100) : 0;
        const avgWin = wins.length > 0
            ? wins.reduce((a, e) => a + e.amount, 0) / wins.length : 0;
        const avgLoss = losses.length > 0
            ? losses.reduce((a, e) => a + e.amount, 0) / losses.length : 0;
        const tradingDays = new Set(monthEntries.map(e => e.date)).size;
        const bestDay = Math.max(...[...new Set(monthEntries.map(e => e.date))].map(d => getDayPL(d)), 0);
        const streak = calculateStreak();

        return { totalPL, winRate, wins: wins.length, losses: losses.length, avgWin, avgLoss, tradingDays, bestDay, streak, totalTrades: monthEntries.length };
    }, [monthEntries]);

    function calculateStreak() {
        const sortedDays = [...new Set(monthEntries.map(e => e.date))].sort((a, b) => b - a);
        let streak = 0;
        for (const day of sortedDays) {
            if (getDayPL(day) > 0) streak++;
            else break;
        }
        return streak;
    }

    const handlePrevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
        else setCurrentMonth(m => m - 1);
        setSelectedDay(null);
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
        else setCurrentMonth(m => m + 1);
        setSelectedDay(null);
    };

    const handleAddEntry = () => {
        if (!entryAmount) return;
        const newEntry: JournalEntry = {
            id: Date.now(),
            date: entryDate,
            month: currentMonth,
            year: currentYear,
            amount: parseFloat(entryAmount),
            type: entryType,
            symbol: entrySymbol,
            action: entryAction,
            lots: parseFloat(entryLots) || 0.01,
            notes: entryNotes
        };
        setEntries(prev => [...prev, newEntry]);
        setShowModal(false);
        setEntryAmount('');
        setEntryNotes('');
    };

    const selectedDayEntries = selectedDay !== null ? getEntriesForDay(selectedDay) : [];
    const selectedDayPL = selectedDay !== null ? getDayPL(selectedDay) : 0;

    return (
        <div className="journal-v2">
            {/* Hero */}
            <div className="journal-hero">
                <div className="journal-hero-left">
                    <div className="journal-hero-badge">TRADE JOURNAL</div>
                    <h2 className="journal-hero-title">Performance Tracker</h2>
                    <p className="journal-hero-sub">Click any day to review trades and execution quality</p>
                </div>
                <button className="journal-add-btn" onClick={() => setShowModal(true)}>
                    <PlusCircle size={16} />
                    <span>Log Trade</span>
                </button>
            </div>

            {/* Analytics Strip */}
            <div className="journal-analytics">
                <div className="j-analytic-card">
                    <div className="j-analytic-icon"><BarChart3 size={18} /></div>
                    <div className="j-analytic-data">
                        <span className="j-analytic-label">Total Trades</span>
                        <span className="j-analytic-value">{analytics.totalTrades}</span>
                    </div>
                </div>
                <div className="j-analytic-card">
                    <div className="j-analytic-icon"><Target size={18} /></div>
                    <div className="j-analytic-data">
                        <span className="j-analytic-label">Win Rate</span>
                        <span className="j-analytic-value">{analytics.winRate}%</span>
                    </div>
                </div>
                <div className="j-analytic-card">
                    <div className="j-analytic-icon"><Flame size={18} /></div>
                    <div className="j-analytic-data">
                        <span className="j-analytic-label">Win Streak</span>
                        <span className="j-analytic-value">{analytics.streak}</span>
                    </div>
                </div>
                <div className="j-analytic-card">
                    <div className={`j-analytic-icon ${analytics.totalPL >= 0 ? 'icon-green' : 'icon-red'}`}>
                        {analytics.totalPL >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                    </div>
                    <div className="j-analytic-data">
                        <span className="j-analytic-label">Monthly P&L</span>
                        <span className={`j-analytic-value ${analytics.totalPL >= 0 ? 'val-green' : 'val-red'}`}>
                            {analytics.totalPL >= 0 ? '+' : '-'}${Math.abs(analytics.totalPL).toFixed(0)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Layout */}
            <div className="journal-main-layout">
                {/* Calendar */}
                <div className="journal-calendar-panel">
                    <div className="journal-cal-header">
                        <button className="j-nav-btn" onClick={handlePrevMonth}>
                            <ChevronLeft size={18} />
                        </button>
                        <h3 className="j-month-title">
                            {monthNames[currentMonth]} {currentYear}
                        </h3>
                        <button className="j-nav-btn" onClick={handleNextMonth}>
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    <div className="journal-cal-weekdays">
                        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                            <span key={d}>{d}</span>
                        ))}
                    </div>

                    <div className="journal-cal-grid">
                        {/* Empty cells for alignment */}
                        {[...Array(firstDayOfWeek)].map((_, i) => (
                            <div key={`empty-${i}`} className="j-cal-cell empty" />
                        ))}

                        {/* Day cells */}
                        {[...Array(daysInMonth)].map((_, i) => {
                            const day = i + 1;
                            const dayEntries = getEntriesForDay(day);
                            const dayPL = getDayPL(day);
                            const hasData = dayEntries.length > 0;
                            const isSelected = selectedDay === day;
                            const isToday = day === now.getDate() && currentMonth === now.getMonth() && currentYear === now.getFullYear();

                            return (
                                <div
                                    key={day}
                                    className={`j-cal-cell ${hasData ? 'has-data' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${hasData ? (dayPL >= 0 ? 'day-win' : 'day-loss') : ''}`}
                                    onClick={() => hasData ? setSelectedDay(isSelected ? null : day) : null}
                                    style={{ cursor: hasData ? 'pointer' : 'default' }}
                                >
                                    <span className="j-day-num">{day}</span>
                                    {hasData && (
                                        <div className="j-day-info">
                                            <span className={`j-day-pl ${dayPL >= 0 ? 'pl-win' : 'pl-loss'}`}>
                                                {dayPL >= 0 ? '+' : ''}{dayPL.toFixed(0)}
                                            </span>
                                            <span className="j-day-count">{dayEntries.length}t</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="journal-cal-legend">
                        <div className="legend-item"><span className="legend-dot win"></span> Profitable</div>
                        <div className="legend-item"><span className="legend-dot loss"></span> Loss</div>
                        <div className="legend-item"><span className="legend-dot today-dot"></span> Today</div>
                    </div>
                </div>

                {/* Right Panel: Day Detail or Stats */}
                <div className="journal-detail-panel">
                    {selectedDay !== null ? (
                        <div className="j-day-detail">
                            <div className="j-detail-header">
                                <div>
                                    <span className="j-detail-date">
                                        {monthNames[currentMonth]} {selectedDay}, {currentYear}
                                    </span>
                                    <span className={`j-detail-pl ${selectedDayPL >= 0 ? 'pl-win' : 'pl-loss'}`}>
                                        {selectedDayPL >= 0 ? '+' : '-'}${Math.abs(selectedDayPL).toFixed(2)}
                                    </span>
                                </div>
                                <button className="j-close-btn" onClick={() => setSelectedDay(null)}>
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="j-detail-summary">
                                <div className="j-sum-item">
                                    <span className="j-sum-label">Trades</span>
                                    <span className="j-sum-val">{selectedDayEntries.length}</span>
                                </div>
                                <div className="j-sum-item">
                                    <span className="j-sum-label">Wins</span>
                                    <span className="j-sum-val val-green">{selectedDayEntries.filter(e => e.type === 'win').length}</span>
                                </div>
                                <div className="j-sum-item">
                                    <span className="j-sum-label">Losses</span>
                                    <span className="j-sum-val val-red">{selectedDayEntries.filter(e => e.type === 'loss').length}</span>
                                </div>
                            </div>

                            <div className="j-trades-list">
                                {selectedDayEntries.map(entry => (
                                    <div key={entry.id} className={`j-trade-card ${entry.type}`}>
                                        <div className="j-trade-top">
                                            <div className="j-trade-symbol-row">
                                                <span className="j-trade-symbol">{entry.symbol}</span>
                                                <span className={`j-trade-action ${entry.action}`}>
                                                    {entry.action === 'BUY'
                                                        ? <><ArrowUpRight size={12} /> BUY</>
                                                        : <><ArrowDownRight size={12} /> SELL</>
                                                    }
                                                </span>
                                            </div>
                                            <span className={`j-trade-result ${entry.type}`}>
                                                {entry.type === 'win' ? '+' : '-'}${entry.amount.toFixed(2)}
                                            </span>
                                        </div>
                                        {entry.lots && (
                                            <div className="j-trade-meta">
                                                <span>{entry.lots} lots</span>
                                            </div>
                                        )}
                                        {entry.notes && (
                                            <p className="j-trade-notes">{entry.notes}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="j-stats-panel">
                            <h3 className="j-stats-title">
                                <Award size={18} />
                                Monthly Breakdown
                            </h3>
                            <div className="j-stats-grid">
                                <div className="j-stat-row">
                                    <span className="j-stat-label">Trading Days</span>
                                    <span className="j-stat-val">{analytics.tradingDays}</span>
                                </div>
                                <div className="j-stat-row">
                                    <span className="j-stat-label">Wins / Losses</span>
                                    <span className="j-stat-val">
                                        <span className="val-green">{analytics.wins}</span>
                                        <span className="j-stat-divider">/</span>
                                        <span className="val-red">{analytics.losses}</span>
                                    </span>
                                </div>
                                <div className="j-stat-row">
                                    <span className="j-stat-label">Avg Win</span>
                                    <span className="j-stat-val val-green">+${analytics.avgWin.toFixed(0)}</span>
                                </div>
                                <div className="j-stat-row">
                                    <span className="j-stat-label">Avg Loss</span>
                                    <span className="j-stat-val val-red">-${analytics.avgLoss.toFixed(0)}</span>
                                </div>
                                <div className="j-stat-row">
                                    <span className="j-stat-label">Best Day</span>
                                    <span className="j-stat-val val-green">+${analytics.bestDay.toFixed(0)}</span>
                                </div>
                                <div className="j-stat-row highlight">
                                    <span className="j-stat-label">Net P&L</span>
                                    <span className={`j-stat-val ${analytics.totalPL >= 0 ? 'val-green' : 'val-red'}`}>
                                        {analytics.totalPL >= 0 ? '+' : '-'}${Math.abs(analytics.totalPL).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Recent trades */}
                            <h4 className="j-recent-title">Recent Trades</h4>
                            <div className="j-recent-list">
                                {monthEntries.slice(-5).reverse().map(entry => (
                                    <div key={entry.id} className="j-recent-item">
                                        <div className={`j-recent-badge ${entry.type}`}>
                                            {entry.type === 'win' ? 'W' : 'L'}
                                        </div>
                                        <div className="j-recent-info">
                                            <span className="j-recent-sym">{entry.symbol}</span>
                                            <span className="j-recent-date">
                                                {monthNames[currentMonth].slice(0, 3)} {entry.date}
                                            </span>
                                        </div>
                                        <span className={`j-recent-pl ${entry.type === 'win' ? 'val-green' : 'val-red'}`}>
                                            {entry.type === 'win' ? '+' : '-'}${entry.amount}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Entry Modal */}
            {showModal && (
                <div className="j-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
                    <div className="j-modal">
                        <div className="j-modal-header">
                            <h3>Log Trade</h3>
                            <button className="j-close-btn" onClick={() => setShowModal(false)}>
                                <X size={18} />
                            </button>
                        </div>
                        <div className="j-modal-body">
                            <div className="j-form-row">
                                <div className="j-form-group">
                                    <label>Date</label>
                                    <select value={entryDate} onChange={e => setEntryDate(parseInt(e.target.value))}>
                                        {[...Array(daysInMonth)].map((_, i) => (
                                            <option key={i} value={i + 1}>
                                                {monthNames[currentMonth]} {i + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="j-form-group">
                                    <label>Symbol</label>
                                    <input
                                        type="text"
                                        value={entrySymbol}
                                        onChange={e => setEntrySymbol(e.target.value.toUpperCase())}
                                        placeholder="XAUUSD"
                                    />
                                </div>
                            </div>
                            <div className="j-form-row">
                                <div className="j-form-group">
                                    <label>Amount ($)</label>
                                    <input
                                        type="number"
                                        value={entryAmount}
                                        onChange={e => setEntryAmount(e.target.value)}
                                        placeholder="420.00"
                                    />
                                </div>
                                <div className="j-form-group">
                                    <label>Lot Size</label>
                                    <input
                                        type="number"
                                        value={entryLots}
                                        onChange={e => setEntryLots(e.target.value)}
                                        placeholder="0.01"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                            <div className="j-form-row">
                                <div className="j-form-group">
                                    <label>Direction</label>
                                    <div className="j-toggle-row">
                                        <button className={`j-toggle buy ${entryAction === 'BUY' ? 'active' : ''}`} onClick={() => setEntryAction('BUY')}>BUY</button>
                                        <button className={`j-toggle sell ${entryAction === 'SELL' ? 'active' : ''}`} onClick={() => setEntryAction('SELL')}>SELL</button>
                                    </div>
                                </div>
                                <div className="j-form-group">
                                    <label>Result</label>
                                    <div className="j-toggle-row">
                                        <button className={`j-toggle win ${entryType === 'win' ? 'active' : ''}`} onClick={() => setEntryType('win')}>PROFIT</button>
                                        <button className={`j-toggle loss ${entryType === 'loss' ? 'active' : ''}`} onClick={() => setEntryType('loss')}>LOSS</button>
                                    </div>
                                </div>
                            </div>
                            <div className="j-form-group full">
                                <label>Notes (optional)</label>
                                <textarea
                                    value={entryNotes}
                                    onChange={e => setEntryNotes(e.target.value)}
                                    placeholder="What did you learn from this trade?"
                                    rows={2}
                                />
                            </div>
                            <button className="j-submit-btn" onClick={handleAddEntry}>
                                Commit to Journal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TradeJournalView;
