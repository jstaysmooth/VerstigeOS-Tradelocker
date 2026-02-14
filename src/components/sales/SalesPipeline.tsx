
import React, { useState, useEffect } from 'react';
import { UserPlus, MoreHorizontal, DollarSign, Calendar, TrendingUp, X, Users, ArrowRight, Filter, ChevronDown, Award } from 'lucide-react';
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Lead, LeadStage, Rank, PLANS, COMMISSION_RATES } from './types';
import { calculateCommission } from '@/lib/commissionSchedule';
import LeadProfileModal from './LeadProfileModal';
import CloseDealModal from './CloseDealModal';
import CustomerList from './CustomerList';
import '@/styles/components/SalesPipeline.css';

const MOCK_LEADS: Lead[] = [
    { id: '1', name: 'Alex Thompson', company: 'Vertex Solutions', email: 'alex@vertex.com', phone: '555-0101', stage: 'new', interestedPlan: 'Essentials', value: 49, createdAt: 'Feb 1', notes: 'Initial inquiry via web.' },
    { id: '2', name: 'Sarah Miller', company: 'Design Co', email: 'sarah@design.co', phone: '555-0102', stage: 'proposal', interestedPlan: 'Plus', value: 99, createdAt: 'Jan 28', notes: 'Sent proposal for tax defense.' },
    { id: '3', name: 'Jordan Lee', company: 'TechFlow', email: 'jordan@techflow.io', phone: '555-0103', stage: 'closed-won', interestedPlan: 'Pro', value: 169, createdAt: 'Jan 15', notes: 'Fully onboarded.', dealClosedAt: '2024-01-15T10:00:00Z' }
];

// --- Draggable Card Component ---
function SortableLeadCard({ lead, commission, onClick, onClose }: { lead: Lead; commission: number; onClick: () => void; onClose: (e: React.MouseEvent) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: lead.id,
        data: {
            type: 'Lead',
            lead,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`lead-card`}
            onClick={onClick}
        >
            <div className="lead-card-header">
                <span className="lead-name">{lead.name}</span>
                <span className="lead-value">${lead.value}/mo</span>
            </div>
            <div className="lead-details">
                <span className="plan-interest">{lead.interestedPlan}</span>
                <div className="text-xs text-secondary mt-1">{lead.company}</div>
                {/* Commission Display */}
                <div className="text-xs text-green-400 mt-1 flex items-center gap-1 font-mono">
                    <TrendingUp size={10} /> Comm: ${commission.toFixed(2)}
                </div>
            </div>
            <div className="lead-footer">
                <span className="lead-date flex items-center gap-1">
                    <Calendar size={10} /> {lead.createdAt}
                </span>

                <button
                    className="btn-close-mini"
                    onClick={onClose}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    Close Deal
                </button>
            </div>
        </div>
    );
}

// --- Droppable Column Component ---
function PipelineColumn({ id, title, leads, rank, onLeadClick, onCloseLead }: { id: string; title: string; leads: Lead[]; rank: Rank; onLeadClick: (l: Lead) => void; onCloseLead: (l: Lead, e: React.MouseEvent) => void }) {
    const { setNodeRef } = useSortable({
        id: id,
        data: {
            type: 'Column',
            id,
        },
    });

    return (
        <div ref={setNodeRef} className="pipeline-column">
            <div className="column-header">
                <h4>{title} <span className="count-badge">{leads.length}</span></h4>
                <MoreHorizontal size={16} className="text-secondary opacity-50" />
            </div>
            <div className="column-content">
                <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
                    {leads.map(lead => (
                        <SortableLeadCard
                            key={lead.id}
                            lead={lead}
                            commission={calculateCommission(rank, lead.interestedPlan)}
                            onClick={() => onLeadClick(lead)}
                            onClose={(e) => onCloseLead(lead, e)}
                        />
                    ))}
                </SortableContext>
                {leads.length === 0 && (
                    <div className="text-center text-secondary text-sm py-8 opacity-50">
                        No leads
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SalesPipeline() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [closingLead, setClosingLead] = useState<Lead | null>(null);
    const [userRank, setUserRank] = useState<Rank>('Senior Associate'); // Default to Senior Associate for demo
    const [activeDragId, setActiveDragId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'pipeline' | 'customers'>('pipeline');

    // New Lead Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newLeadName, setNewLeadName] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        const saved = localStorage.getItem('sales_leads');
        if (saved) {
            setLeads(JSON.parse(saved));
        } else {
            setLeads(MOCK_LEADS);
        }
    }, []);

    const saveLeads = (newLeads: Lead[]) => {
        setLeads(newLeads);
        localStorage.setItem('sales_leads', JSON.stringify(newLeads));
    };

    const handleUpdateLead = (updatedLead: Lead) => {
        if (updatedLead.stage === 'closed-lost') {
            // DELETE Logic
            const newLeads = leads.filter(l => l.id !== updatedLead.id);
            saveLeads(newLeads);
            setSelectedLead(null);
        } else {
            const newLeads = leads.map(l => l.id === updatedLead.id ? updatedLead : l);
            saveLeads(newLeads);
            if (selectedLead?.id === updatedLead.id) {
                setSelectedLead(updatedLead);
            }
        }
    };

    const handleCloseDeal = (planId: string) => {
        if (!closingLead) return;

        const updatedLead = {
            ...closingLead,
            stage: 'closed-won' as LeadStage,
            interestedPlan: planId as any,
            value: PLANS.find(p => p.id === planId)?.price || closingLead.value,
            dealClosedAt: new Date().toISOString()
        };

        const newLeads = leads.map(l => l.id === closingLead.id ? updatedLead : l);
        saveLeads(newLeads);
        setClosingLead(null);
        setSelectedLead(null);

        // Switch to customer view to see new customer
        setViewMode('customers');

        window.dispatchEvent(new Event('dealClosed'));
    };

    const initiateClose = (lead: Lead, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setClosingLead(lead);
    };

    const handleAddNewLead = () => {
        if (!newLeadName.trim()) return;

        const newLead: Lead = {
            id: Date.now().toString(),
            name: newLeadName,
            company: 'New Company',
            email: '',
            phone: '',
            stage: 'new',
            interestedPlan: 'Essentials',
            value: 49,
            createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            notes: ''
        };
        const newLeads = [...leads, newLead];
        saveLeads(newLeads);
        setNewLeadName('');
        setIsAddModalOpen(false);
        // Optional: Open profile immediately
        setSelectedLead(newLead);
    };

    // --- DnD Logic ---
    const columns = [
        { id: 'new', title: 'New Leads', stages: ['new'] },
        { id: 'follow-up', title: 'Follow Up', stages: ['contacted'] },
        { id: 'active', title: 'In Progress', stages: ['proposal', 'negotiation'] }
    ];

    const findContainer = (id: string): string | undefined => {
        if (columns.find(c => c.id === id)) return id;
        const lead = leads.find(l => l.id === id);
        if (lead) {
            const col = columns.find(c => c.stages.includes(lead.stage));
            return col?.id;
        }
        return undefined;
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveDragId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;
        const activeContainer = findContainer(activeId as string);
        const overContainer = findContainer(overId as string);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDragId(null);

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const activeLead = leads.find(l => l.id === activeId);
        if (!activeLead) return;

        let targetColumn = columns.find(c => c.id === overId);
        if (!targetColumn) {
            const overLead = leads.find(l => l.id === overId);
            if (overLead) {
                targetColumn = columns.find(c => c.stages.includes(overLead.stage));
            }
        }

        if (targetColumn) {
            const newStage = targetColumn.stages[0] as LeadStage;
            if (activeLead.stage !== newStage) {
                const updatedLead = { ...activeLead, stage: newStage };
                handleUpdateLead(updatedLead);
            }
        }
    };

    const activeLead = activeDragId ? leads.find(l => l.id === activeDragId) : null;

    // Updated Navigation Array with Icons
    const NAV_TABS = [
        { id: 'pipeline', label: 'Deal Pipeline' },
        { id: 'customers', label: 'Current Customers' }
    ];

    return (
        <div className="sales-pipeline animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Sales & Customer Management</h2>
                        <p className="text-secondary text-sm max-w-xl">Track your pipeline efficiency, forecast earnings, and manage active client relationships.</p>
                    </div>
                </div>

                {/* Navigation & Controls Bar - Glassmorphism */}
                <div className="glass-panel p-1.5 flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    {/* Floating Tab Navigation */}
                    <div className="flex p-1 gap-1 bg-black/20 rounded-xl">
                        {NAV_TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setViewMode(tab.id as 'pipeline' | 'customers')}
                                className={`
                                    relative px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300
                                    ${viewMode === tab.id
                                        ? 'text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                                        : 'text-secondary hover:text-white hover:bg-white/5'}
                                `}
                            >
                                {viewMode === tab.id && (
                                    <div className="absolute inset-0 bg-white/10 rounded-lg border border-white/10" />
                                )}
                                <span className="relative z-10">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Right Side Controls */}
                    <div className="flex items-center gap-4 pr-2">
                        {/* Rank Selector - Premium Dropdown Style */}
                        <div className="relative group">
                            <div className="flex items-center gap-3 bg-[#13141b] hover:bg-[#1c1d25] px-4 py-2.5 rounded-xl border border-white/5 hover:border-white/10 transition-all cursor-pointer">
                                <Award size={14} className="text-accent" />
                                <span className="text-[10px] text-secondary uppercase tracking-wider font-bold">Rank</span>
                                <div className="h-4 w-[1px] bg-white/10"></div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-white">{userRank}</span>
                                    <ChevronDown size={14} className="text-secondary" />
                                    {/* Invisible Select Overlay for Native Functionality */}
                                    <select
                                        value={userRank}
                                        onChange={(e) => setUserRank(e.target.value as Rank)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    >
                                        {Object.keys(COMMISSION_RATES).map(r => (
                                            <option key={r} value={r} className="bg-[#1a1b23] text-white">{r}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Commission Estate Display */}
                        <div className="flex items-center gap-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 px-5 py-2.5 rounded-xl border border-green-500/20">
                            <div className="p-1.5 bg-green-500/20 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                                <TrendingUp size={14} className="text-green-400" />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-[10px] text-green-400 font-bold opacity-80 mb-0.5 tracking-wide">EST. COMMISSION</span>
                                <span className="text-base font-bold text-green-400">
                                    ${leads.filter(l => l.stage !== 'closed-won' && l.stage !== 'closed-lost')
                                        .reduce((acc, curr) => acc + calculateCommission(userRank, curr.interestedPlan), 0)
                                        .toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Add Lead Button (Only in Pipeline) */}
                        {viewMode === 'pipeline' && (
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="group relative overflow-hidden rounded-xl bg-white px-5 py-2.5 transition-all hover:bg-white/90"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-center gap-2 text-black font-bold text-sm relative z-10">
                                    <UserPlus size={16} />
                                    <span>Add Lead</span>
                                </div>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {viewMode === 'pipeline' ? (
                <>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="pipeline-board">
                            {columns.map(col => (
                                <PipelineColumn
                                    key={col.id}
                                    id={col.id}
                                    title={col.title}
                                    leads={leads.filter(l => col.stages.includes(l.stage))}
                                    rank={userRank}
                                    onLeadClick={setSelectedLead}
                                    onCloseLead={initiateClose}
                                />
                            ))}
                        </div>
                        <DragOverlay>
                            {activeLead ? (
                                <div className={`lead-card`} style={{ cursor: 'grabbing', transform: 'rotate(2deg)' }}>
                                    <div className="lead-card-header">
                                        <span className="lead-name">{activeLead.name}</span>
                                        <span className="lead-value">${activeLead.value}/mo</span>
                                    </div>
                                    <div className="lead-details">
                                        <span className="plan-interest">{activeLead.interestedPlan}</span>
                                    </div>
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                </>
            ) : (
                <CustomerList
                    customers={leads.filter(l => l.stage === 'closed-won')}
                    onManageCustomer={setSelectedLead}
                />
            )}

            {/* Add Lead Modal */}
            {isAddModalOpen && (
                <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
                    <div className="modal-content p-6 max-w-sm w-full mx-auto mt-20 rounded-xl bg-[#1a1b23] border border-white/10" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Add New Prospect</h3>
                            <button onClick={() => setIsAddModalOpen(false)}><X size={20} className="text-secondary" /></button>
                        </div>
                        <input
                            type="text"
                            autoFocus
                            placeholder="Prospect Name"
                            className="form-input mb-4 w-full"
                            value={newLeadName}
                            onChange={e => setNewLeadName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAddNewLead()}
                        />
                        <button onClick={handleAddNewLead} className="btn-primary w-full">Create Prospect</button>
                    </div>
                </div>
            )}

            <LeadProfileModal
                isOpen={!!selectedLead}
                lead={selectedLead}
                onClose={() => setSelectedLead(null)}
                onUpdate={handleUpdateLead}
                onCloseDeal={(lead) => initiateClose(lead)}
            />

            <CloseDealModal
                isOpen={!!closingLead}
                leadName={closingLead?.name || ''}
                initialPlan={closingLead?.interestedPlan}
                onClose={() => setClosingLead(null)}
                onConfirm={handleCloseDeal}
            />
        </div>
    );
}
