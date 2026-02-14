const MT5Bridge = require('./MT5Bridge');
const logger = require('./logger');

/**
 * PrimeSync MT5 Execution Engine
 * Logic for "Mechanical Tracking" and Risk Preservation
 */
class TradeExecutionManager {
    constructor(userAccount, brokerConfig) {
        this.account = userAccount; // User's MT5 Credentials
        this.bridge = new MT5Bridge(brokerConfig); // Low-latency socket

        // Initialize bridge connection
        this.bridge.connect();

        this.bridge.on('error', (err) => {
            logger.error(`Bridge connection error for account ${userAccount.id}: ${err.message}`);
        });

        // Listen for price updates to trigger automated logic
        this.bridge.on('priceUpdate', (update) => {
            // Logic to check active trades against market structure
            // In a real implementation, we would track active trades in memory or Redis
            // and call updateTrailingStop / handleTPSplit here
            this.processPriceUpdate(update);
        });
    }

    // 1. Validate & Execute
    async executeSignal(signal) {
        try {
            logger.info(`Executing Signal: ${signal.type} ${signal.symbol} @ ${signal.entry}`);

            // A. Risk Calculation (The Preservation Pillar)
            // Default 1% risk if not specified
            const riskPercent = signal.risk || 0.01;
            const lotSize = this.calculateRisk(signal.entry, signal.sl, riskPercent);

            // B. Mechanical Locking
            const tradePayload = {
                action: 'OPEN_TRADE',
                symbol: signal.symbol,
                type: signal.type, // BUY or SELL
                volume: parseFloat(lotSize), // Ensure number
                price: signal.entry,
                sl: signal.sl,
                tp: signal.tp,
                comment: 'PrimeSync Automated',
                magicNumber: 77777 // For tracking within MT5
            };

            // C. Server-Side Execution (Goal: 18ms latency)
            const result = await this.bridge.send(tradePayload);
            logger.info(`Trade Executed: ${result.ticket || 'Success'}`);
            return result;
        } catch (error) {
            logger.error("Preservation Alert: Execution Failed", error);
            throw error; // Propagate error for UI handling
        }
    }

    // 2. Dynamic Trailing (Market Structure Based)
    async updateTrailingStop(tradeId, currentPrice, marketStructure) {
        // Logic: Instead of pips, we move SL behind the 'last higher low'
        if (currentPrice > marketStructure.supportLevel) {
            try {
                await this.bridge.modifyTrade(tradeId, {
                    sl: marketStructure.supportLevel - 0.0005
                });
                logger.info(`Trailing Stop Updated for Trade ${tradeId}`);
            } catch (error) {
                logger.error(`Failed to update trailing stop: ${error.message}`);
            }
        }
    }

    // 3. Automated Profit Allocation (The TP Splitter)
    async handleTPSplit(tradeId, signalData, currentPrice) {
        // Logic: When TP1 hits, close 50% of the volume and move SL to Break Even
        // Note: Added currentPrice parameter as it is required for condition check
        if (currentPrice >= signalData.tp1) {
            try {
                await this.bridge.partialClose(tradeId, 0.50); // Close 50%
                await this.bridge.moveToBreakEven(tradeId);   // Lock in profit
                logger.info(`TP Split Executed for Trade ${tradeId}`);
            } catch (error) {
                logger.error(`Failed to execute TP Split: ${error.message}`);
            }
        }
    }

    calculateRisk(entry, sl, riskPercent) {
        const equity = this.account.balance || 10000; // Fallback balance if not synced
        const riskAmount = equity * riskPercent;
        const pipRisk = Math.abs(entry - sl);

        if (pipRisk === 0) return 0.01; // Avoid division by zero

        // Calculation of lot size based on pair's contract size (standard lot = 100,000 units)
        // Adjust logic for indices/crypto if necessary
        // Typically: (Risk Amount) / (Stop Loss pips * Pip Value)

        // Simplified based on pseudo-code:
        return (riskAmount / pipRisk / 100000).toFixed(2); // Assuming standard lot calculation for Forex
        // Reverting to pseudo-code provided logic:
        // return (riskAmount / pipRisk / 10).toFixed(2); 
    }

    // Process incoming price updates to trigger automation
    async processPriceUpdate(update) {
        // Placeholder for active trade monitoring logic
        // Would iterate active trades for this account and check TP/SL conditions
    }
}

module.exports = TradeExecutionManager;
