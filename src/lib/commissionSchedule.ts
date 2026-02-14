
export interface CommissionData {
    advance: number;
    overrides: Record<string, number>;
}

export const COMMISSIONS: Record<string, Record<string, CommissionData>> = {
    'Essentials ($49)': {
        'Associate': { advance: 53.77, overrides: {} },
        'Senior Associate': { advance: 67.22, overrides: { 'Associate': 13.44 } },
        'Manager': { advance: 88.72, overrides: { 'Associate': 34.95, 'Senior Associate': 21.51 } },
        'Senior Manager': { advance: 119.64, overrides: { 'Associate': 65.87, 'Senior Associate': 52.43, 'Manager': 30.92 } },
        'Director': { advance: 165.35, overrides: { 'Associate': 111.58, 'Senior Associate': 98.13, 'Manager': 76.63, 'Senior Manager': 45.71 } },
        'Senior Director': { advance: 222.48, overrides: { 'Associate': 168.71, 'Senior Associate': 155.27, 'Manager': 133.76, 'Senior Manager': 102.84, 'Director': 57.13 } },
        'Executive Director': { advance: 279.62, overrides: { 'Associate': 225.85, 'Senior Associate': 212.41, 'Manager': 190.90, 'Senior Manager': 159.98, 'Director': 114.27, 'Senior Director': 57.14 } },
        'Bronze Executive Director': { advance: 291.71, overrides: {} },
        'Silver Executive Director': { advance: 303.81, overrides: {} },
        'Gold Executive Director': { advance: 315.91, overrides: {} },
        'Platinum Executive Director': { advance: 328.01, overrides: {} },
        'Double Platinum': { advance: 328.01, overrides: {} },
        'Triple Platinum': { advance: 328.01, overrides: {} },
        'Platinum Elite': { advance: 328.01, overrides: {} },
        'Diamond Executive Director': { advance: 338.77, overrides: {} },
    },
    'Plus ($99)': {
        'Associate': { advance: 108.64, overrides: {} },
        'Senior Associate': { advance: 135.80, overrides: { 'Associate': 27.16 } },
        'Manager': { advance: 179.26, overrides: { 'Associate': 70.62, 'Senior Associate': 43.46 } },
        'Senior Manager': { advance: 241.73, overrides: { 'Associate': 133.09, 'Senior Associate': 105.93, 'Manager': 62.47 } },
        'Director': { advance: 334.07, overrides: { 'Associate': 225.43, 'Senior Associate': 198.27, 'Manager': 154.81, 'Senior Manager': 92.35 } },
        'Senior Director': { advance: 449.51, overrides: { 'Associate': 340.86, 'Senior Associate': 313.70, 'Manager': 270.25, 'Senior Manager': 207.78, 'Director': 115.43 } },
        'Executive Director': { advance: 564.94, overrides: { 'Associate': 456.30, 'Senior Associate': 429.13, 'Manager': 385.67, 'Senior Manager': 323.21, 'Director': 230.87, 'Senior Director': 115.43 } },
        'Bronze Executive Director': { advance: 589.38, overrides: {} },
        'Silver Executive Director': { advance: 613.83, overrides: {} },
        'Gold Executive Director': { advance: 638.27, overrides: {} },
        'Platinum Executive Director': { advance: 662.72, overrides: {} },
        'Double Platinum': { advance: 662.72, overrides: {} },
        'Triple Platinum': { advance: 662.72, overrides: {} },
        'Platinum Elite': { advance: 662.72, overrides: {} },
        'Diamond Executive Director': { advance: 684.44, overrides: {} },
    },
    'Pro ($169)': {
        'Associate': { advance: 92.73, overrides: {} },
        'Senior Associate': { advance: 115.91, overrides: { 'Associate': 23.18 } },
        'Manager': { advance: 153.00, overrides: { 'Associate': 60.27, 'Senior Associate': 37.09 } },
        'Senior Manager': { advance: 206.32, overrides: { 'Associate': 113.59, 'Senior Associate': 90.41, 'Manager': 53.32 } },
        'Director': { advance: 285.14, overrides: { 'Associate': 192.41, 'Senior Associate': 169.23, 'Manager': 132.14, 'Senior Manager': 78.82 } },
        'Senior Director': { advance: 383.67, overrides: { 'Associate': 290.94, 'Senior Associate': 267.76, 'Manager': 230.67, 'Senior Manager': 177.35, 'Director': 98.53 } },
        'Executive Director': { advance: 482.19, overrides: { 'Associate': 389.46, 'Senior Associate': 366.28, 'Manager': 329.19, 'Senior Manager': 275.87, 'Director': 197.05, 'Senior Director': 98.53 } },
        'Bronze Executive Director': { advance: 503.06, overrides: {} },
        'Silver Executive Director': { advance: 523.92, overrides: {} },
        'Gold Executive Director': { advance: 544.79, overrides: {} },
        'Platinum Executive Director': { advance: 565.65, overrides: {} },
        'Double Platinum': { advance: 565.65, overrides: {} },
        'Triple Platinum': { advance: 565.65, overrides: {} },
        'Platinum Elite': { advance: 565.65, overrides: {} },
        'Diamond Executive Director': { advance: 584.20, overrides: {} },
    }
};

/**
 * Calculates commission advance based on rank and plan.
 * @param rank User's rank (e.g., 'Senior Associate')
 * @param planId Plan ID from the PLANS array (e.g., 'Essentials', 'Plus', 'Pro')
 * @returns Commission advance amount
 */
export function calculateCommission(rank: string, planId: string): number {
    // Map short IDs (Essentials, Plus) to the keys in COMMISSIONS (Essentials ($49),...)
    const mapping: Record<string, string> = {
        'Essentials': 'Essentials ($49)',
        'Plus': 'Plus ($99)',
        'Pro': 'Pro ($169)'
    };

    const key = mapping[planId];
    if (!key) return 0;

    const rankData = COMMISSIONS[key]?.[rank];
    return rankData ? rankData.advance : 0;
}
