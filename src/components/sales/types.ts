
export type LeadStage = 'new' | 'contacted' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';

export interface Lead {
    id: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    stage: LeadStage;
    interestedPlan: 'Essentials' | 'Plus' | 'Pro';
    value: number; // Monthly plan value
    commission?: number; // Calculated commission
    createdAt: string;
    dealClosedAt?: string;
    notes: string;
}

export const PLANS = [
    { id: 'Essentials', name: 'Business Essentials', price: 49 },
    { id: 'Plus', name: 'Business Plus', price: 99 },
    { id: 'Pro', name: 'Business Pro', price: 169 }
] as const;

export const COMMISSION_RATES = {
    'Associate': 0.09,
    'Senior Associate': 0.11,
    'Manager': 0.15,
    'Director': 0.20,
    'Senior Director': 0.375,
    'Executive Director': 0.475,
    'Bronze ED': 0.49,
    'Silver ED': 0.51,
    'Gold ED': 0.53,
    'Platinum ED': 0.55,
    'Diamond ED': 0.60,
};

export type Rank = keyof typeof COMMISSION_RATES;
