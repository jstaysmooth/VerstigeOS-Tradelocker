"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, MoreHorizontal, DollarSign, Calendar, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import '@/styles/pages/Pipeline.css';

interface Deal {
    id: string;
    client: string;
    value: number;
    prob: number;
    tags: string[];
}

interface Column {
    id: string;
    title: string;
    deals: Deal[];
}

const PipelinePage = () => {
    const router = useRouter();

    // Mock Data State
    const [columns, setColumns] = useState<Column[]>([
        {
            id: 'leads', title: 'New Leads', deals: [
                { id: 'd1', client: 'Acme Corp', value: 5000, prob: 20, tags: ['Inbound', 'Tech'] },
                { id: 'd2', client: 'Globex', value: 12000, prob: 15, tags: ['Referral'] }
            ]
        },
        {
            id: 'contact', title: 'Contact Made', deals: [
                { id: 'd3', client: 'Soylent Corp', value: 8500, prob: 40, tags: ['Manufacturing'] }
            ]
        },
        {
            id: 'proposal', title: 'Proposal Sent', deals: [
                { id: 'd4', client: 'Wayne Ent', value: 85000, prob: 60, tags: ['Enterprise'] },
                { id: 'd5', client: 'Stark Ind', value: 150000, prob: 50, tags: ['Defense'] }
            ]
        },
        {
            id: 'negotiation', title: 'Negotiation', deals: [
                { id: 'd6', client: 'Cyberdyne', value: 42000, prob: 80, tags: ['AI', 'High Priority'] }
            ]
        },
        {
            id: 'closing', title: 'Closing', deals: [
                { id: 'd7', client: 'TechCorp', value: 15000, prob: 95, tags: ['SaaS'] }
            ]
        }
    ]);

    return (
        <div className="pipeline-container">
            <div className="pipeline-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={() => router.back()} className="btn-icon">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold">Sales Pipeline</h1>
                        <span className="text-secondary text-sm">Track and manage your deal flow</span>
                    </div>
                </div>

                <div className="pipeline-controls">
                    <button className="btn-secondary">
                        <Filter size={16} /> Filter
                    </button>
                    <button className="btn-primary">
                        <Plus size={16} /> New Deal
                    </button>
                </div>
            </div>

            <div className="pipeline-board">
                {columns.map(col => (
                    <div key={col.id} className="pipeline-column">
                        <div className="column-header">
                            <span className="column-title">{col.title}</span>
                            <span className="column-count">{col.deals.length}</span>
                        </div>
                        <div className="column-content">
                            {col.deals.map(deal => (
                                <motion.div
                                    key={deal.id}
                                    className="deal-card"
                                    whileHover={{ scale: 1.02 }}
                                    layoutId={deal.id}
                                >
                                    <span className="deal-client">{deal.client}</span>
                                    <span className="deal-value">${deal.value.toLocaleString()}</span>

                                    <div className="deal-tags">
                                        {deal.tags.map(tag => (
                                            <span key={tag} className="deal-tag">{tag}</span>
                                        ))}
                                    </div>

                                    <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--secondary)' }}>
                                        <span>Prob: {deal.prob}%</span>
                                        <MoreHorizontal size={14} />
                                    </div>
                                </motion.div>
                            ))}
                            <button className="add-deal-btn">
                                <Plus size={14} /> Add Item
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PipelinePage;
