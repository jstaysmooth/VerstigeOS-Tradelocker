const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const TradeExecutionManager = require('./TradeExecutionManager');
const logger = require('./logger');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Mock Configuration
const USER_ACCOUNT = {
    id: 'mt5_user_123',
    balance: 10000, // Initial mock balance
    leverage: 100
};

const BROKER_CONFIG = {
    host: process.env.MT5_HOST || '127.0.0.1',
    port: process.env.MT5_PORT || 3000
};

const executionManager = new TradeExecutionManager(USER_ACCOUNT, BROKER_CONFIG);

// Middleware
app.use(express.json());

// API Endpoints
app.post('/api/execute-signal', async (req, res) => {
    try {
        const signal = req.body;
        if (!signal || !signal.symbol || !signal.entry || !signal.sl) {
            return res.status(400).json({ error: 'Invalid signal data' });
        }

        const result = await executionManager.executeSignal(signal);

        // Broadcast trade execution to UI via Socket.IO
        io.emit('tradeExecuted', { ...signal, result });

        res.json({ success: true, result });
    } catch (error) {
        logger.error('API Execution Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Socket.IO Communication
io.on('connection', (socket) => {
    logger.info(`UI Client Connected: ${socket.id}`);

    // Send initial state
    socket.emit('accountUpdate', USER_ACCOUNT);

    // Listen for manual actions from UI
    socket.on('closeTrade', async (tradeId) => {
        // Implement manual close
    });

    socket.on('disconnect', () => {
        logger.info(`UI Client Disconnected: ${socket.id}`);
    });
});

// Listen for updates from the Bridge (ExecutionManager) to broadcast to UI
executionManager.bridge.on('activeProfits', (profits) => {
    // Sync "Active Profits" to UI in real-time
    io.emit('activeProfitsUpdate', profits);
});

executionManager.bridge.on('priceUpdate', (update) => {
    // Optionally stream price updates
    io.emit('priceUpdate', update);
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    logger.info(`PrimeSync Execution Service running on port ${PORT}`);
});
