const net = require('net');
const EventEmitter = require('events');
const logger = require('./logger'); // Simple logger utility

/**
 * PrimeSync MT5 Bridge
 * Handles low-latency communication with the MT5 Terminal via TCP/Socket.
 */
class MT5Bridge extends EventEmitter {
    constructor(config) {
        super();
        this.config = config;
        this.socket = new net.Socket();
        this.isConnected = false;

        // Setup socket event listeners
        this.socket.on('connect', () => {
            this.isConnected = true;
            logger.info('Connected to MT5 Bridge');
            this.emit('connected');
        });

        this.socket.on('data', (data) => {
            this.handleData(data);
        });

        this.socket.on('close', () => {
            this.isConnected = false;
            logger.warn('MT5 Bridge Disconnected');
            this.emit('disconnected');
            // Implement reconnection logic here for robustness
            this.reconnect();
        });

        this.socket.on('error', (err) => {
            logger.error('MT5 Bridge Error:', err);
            this.emit('error', err);
        });
    }

    connect() {
        logger.info(`Connecting to MT5 Bridge at ${this.config.host}:${this.config.port}...`);
        this.socket.connect(this.config.port, this.config.host);
    }

    reconnect() {
        setTimeout(() => {
            if (!this.isConnected) {
                logger.info('Attempting strict reconnection...');
                this.connect();
            }
        }, 1000); // Fast reconnection attempt
    }

    /**
     * Send command to MT5
     * @param {Object} payload 
     * @returns {Promise<Object>}
     */
    async send(payload) {
        return new Promise((resolve, reject) => {
            if (!this.isConnected) {
                return reject(new Error('MT5 Bridge not connected'));
            }

            // Create a unique request ID to match with response
            const requestId = Date.now().toString(36) + Math.random().toString(36).substr(2);
            payload.requestId = requestId;

            const data = JSON.stringify(payload) + '\n'; // Newline delimiter for stream

            // Setup a one-time listener for the response
            const responseHandler = (cleanData) => {
                try {
                    const response = JSON.parse(cleanData);
                    if (response.requestId === requestId) {
                        this.removeListener('message', responseHandler);
                        resolve(response);
                    }
                } catch (e) {
                    // Ignore parsing errors for other messages
                }
            };

            // Timeout safety
            setTimeout(() => {
                this.removeListener('message', responseHandler);
                reject(new Error('Request timed out'));
            }, 5000); // 5s timeout, critical for trading but allows network jitter

            this.on('message', responseHandler);
            this.socket.write(data);
        });
    }

    handleData(data) {
        // Handle stream data, could be fragmented
        const chunks = data.toString().split('\n');
        chunks.forEach(chunk => {
            if (chunk.trim()) {
                this.emit('message', chunk);
                // Also parse and emit specific events like price updates
                try {
                    const msg = JSON.parse(chunk);
                    if (msg.type === 'PRICE_UPDATE') {
                        this.emit('priceUpdate', msg);
                    }
                } catch (e) {
                    // logger.debug('Non-JSON message received', chunk);
                }
            }
        });
    }

    // specific command abstractions

    async modifyTrade(tradeId, updates) {
        return this.send({
            action: 'MODIFY_TRADE',
            tradeId,
            ...updates
        });
    }

    async partialClose(tradeId, volumePercent) {
        return this.send({
            action: 'PARTIAL_CLOSE',
            tradeId,
            volumePercent
        });
    }

    async moveToBreakEven(tradeId) {
        return this.send({
            action: 'MOVE_TO_BE',
            tradeId
        });
    }
}

module.exports = MT5Bridge;
