
import React, { useState } from 'react';
import { Search, Users, TrendingUp, Calendar, ArrowRight, FileText } from 'lucide-react';
import { Lead } from './types';

interface CustomerListProps {
    customers: Lead[];
    onManageCustomer: (customer: Lead) => void;
}

export default function CustomerList({ customers, onManageCustomer }: CustomerListProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalRevenue = customers.reduce((acc, curr) => acc + (curr.value || 0), 0);

    return (
        <div className="customer-list-container animate-fade-in">
            {/* Analytics Header */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="glass-panel p-4 flex items-center justify-between">
                    <div>
                        <p className="text-secondary text-xs uppercase tracking-wider mb-1">Active Accounts</p>
                        <h3 className="text-2xl font-bold text-white">{customers.length}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Users size={20} className="text-blue-400" />
                    </div>
                </div>
                <div className="glass-panel p-4 flex items-center justify-between">
                    <div>
                        <p className="text-secondary text-xs uppercase tracking-wider mb-1">Monthly Revenue</p>
                        <h3 className="text-2xl font-bold text-green-400">${totalRevenue.toFixed(2)}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                        <TrendingUp size={20} className="text-green-400" />
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                <input
                    type="text"
                    placeholder="Search customers by name, company, or email..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-accent transition-colors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Customer List */}
            <div className="space-y-3">
                {filteredCustomers.length > 0 ? (
                    filteredCustomers.map(customer => (
                        <div key={customer.id} className="glass-panel p-4 flex items-center justify-between hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => onManageCustomer(customer)}>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                                    {customer.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">{customer.name}</h4>
                                    <p className="text-sm text-secondary">{customer.company} • <span className="text-accent">{customer.interestedPlan}</span></p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs text-secondary mb-1">Subscribed Since</p>
                                    <div className="flex items-center gap-1 text-sm text-gray-300">
                                        <Calendar size={12} />
                                        {customer.dealClosedAt ? new Date(customer.dealClosedAt).toLocaleDateString() : 'N/A'}
                                    </div>
                                </div>
                                <div className="text-right mr-4">
                                    <p className="text-xs text-secondary mb-1">Monthly Value</p>
                                    <p className="font-mono font-bold text-green-400">${customer.value}/mo</p>
                                </div>
                                <button className="p-2 rounded-full hover:bg-white/10 text-secondary group-hover:text-white transition-colors">
                                    <FileText size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-secondary">
                        <Users size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No active customers found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
