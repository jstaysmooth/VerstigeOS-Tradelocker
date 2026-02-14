export interface QualificationRule {
    level: string;
    personalPremium: number;
    structure?: string;
    description: string;
}

export const EXECUTIVE_BONUS_TIERS: QualificationRule[] = [
    {
        level: "Bronze ED",
        personalPremium: 2100,
        structure: "1 Executive Director Leg",
        description: "Achieve $2,100 in Personal Premium OR have 1 Executive Director leg."
    },
    {
        level: "Silver ED",
        personalPremium: 2800,
        structure: "2 Executive Director Legs",
        description: "Achieve $2,800 in Personal Premium OR have 2 Executive Director legs (Must be ED)."
    },
    {
        level: "Gold ED",
        personalPremium: 3500,
        structure: "3 Executive Director Legs",
        description: "Achieve $3,500 in Personal Premium OR have 3 Executive Director legs."
    },
    {
        level: "Platinum ED",
        personalPremium: 4200,
        structure: "4 Executive Director Legs",
        description: "Achieve $4,200 in Personal Premium OR have 4 Executive Director legs."
    },
    {
        level: "Double Platinum",
        personalPremium: 5600,
        structure: "1 Platinum Leg OR 6 ED Legs",
        description: "Achieve $5,600 in Personal Premium OR 1 Platinum Leg OR 6 ED Legs."
    },
    {
        level: "Triple Platinum",
        personalPremium: 7000,
        structure: "2 Platinum Legs OR 8 ED Legs",
        description: "Achieve $7,000 in Personal Premium OR 2 Platinum Legs OR 8 ED Legs."
    },
    {
        level: "Platinum Elite",
        personalPremium: 8400,
        structure: "3 Platinum Legs OR 10 ED Legs",
        description: "Achieve $8,400 in Personal Premium OR 3 Platinum Legs OR 10 ED Legs."
    },
    {
        level: "Diamond ED",
        personalPremium: 9800,
        structure: "4 Platinum Legs OR 12 ED Legs",
        description: "Achieve $9,800 in Personal Premium OR 4 Platinum Legs OR 12 ED Legs."
    },
];
