# PrimeSync MT5 Execution Engine

This is the low-latency Node.js service responsible for executing trades on the MT5 terminal and managing risk.

## Architecture

- **Service Type**: Node.js Standalone Service
- **Communication**: Socket.IO (for UI), TCP (for MT5 Bridge)
- **Deployment**: Design for AWS execution near broker data center (e.g., London LD4).

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configuration:
   Set environment variables in `.env` (or mock config in `src/server.js`):
   - `MT5_HOST`: Host of the MT5 terminal or bridge
   - `MT5_PORT`: Port of the MT5 terminal

3. Run:
   ```bash
   npm start
   ```

## API

### Execute Trade Signal
`POST /api/execute-signal`
Body:
```json
{
  "symbol": "EURUSD",
  "type": "BUY",
  "entry": 1.0500,
  "sl": 1.0450,
  "tp": 1.0600,
  "risk": 0.01
}
```

## Socket.IO Events

- `tradeExecuted`: Emitted when a trade is successfully executed.
- `activeProfitsUpdate`: Emitted periodically with open trade status and profit.
- `accountUpdate`: Emitted on connection/balance change.

## Implementation Details

- **TradeExecutionManager**: Core logic for risk calculation and trade lifecycle.
- **MT5Bridge**: Handles low-level communication (TCP/Socket).
- **State Management**: Syncs implementation details with frontend via `useTradeStore`.
