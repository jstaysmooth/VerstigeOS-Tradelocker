import asyncio
import logging
from typing import List, Dict, Optional
from .client import DxTradeClient, OrderSide, OrderType

logger = logging.getLogger(__name__)

class CopierEngine:
    def __init__(self, master_client: DxTradeClient):
        self.master = master_client
        self.slaves: List[DxTradeClient] = []
        self.is_running = False
        self.known_positions = set()

    def add_slave(self, slave_client: DxTradeClient):
        self.slaves.append(slave_client)
        logger.info(f"Added slave account: {slave_client.username}")

    async def start(self):
        """
        Starts the copier engine loop.
        For MVP, this will poll the master account for new positions.
        In production, this should use WebSocket stream.
        """
        self.is_running = True
        logger.info("Copier Engine Started")
        
        # Initial login
        if not self.master.login():
            logger.error("Failed to login to Master account")
            self.is_running = False
            return

        # Snapshot initial positions to avoid copying existing ones
        initial_positions = self.master.get_positions()
        self.known_positions = {p['positionCode'] for p in initial_positions}
        logger.info(f"Initial Master Positions: {len(self.known_positions)}")

        while self.is_running:
            try:
                current_positions = self.master.get_positions()
                current_position_ids = {p['positionCode'] for p in current_positions}
                
                # Check for NEW positions
                new_positions = [p for p in current_positions if p['positionCode'] not in self.known_positions]
                
                for pos in new_positions:
                    logger.info(f"New Master Position Detected: {pos['symbol']} {pos['quantity']}")
                    self.execute_copy_trade(pos)
                    self.known_positions.add(pos['positionCode'])
                
                # Check for CLOSED positions (optional for MVP, strict copier needs this)
                # closed_positions = self.known_positions - current_position_ids
                # if closed_positions:
                #    handle_closed_positions(closed_positions)
                
                # Update known list to handle closures naturally (if we don't track history yet)
                self.known_positions = current_position_ids
                
                await asyncio.sleep(1) # Poll every second
                
            except Exception as e:
                logger.error(f"Copier Loop Exception: {e}")
                await asyncio.sleep(5)

    def execute_copy_trade(self, position: Dict):
        """
        Executes the detected master trade on all slave accounts.
        """
        symbol = position['symbol']
        quantity = position['quantity'] # In a real copier, we'd scale this by equity or lot multiplier
        side = OrderSide.BUY if quantity > 0 else OrderSide.SELL
        abs_quantity = abs(quantity)
        instrument_id = position.get('instrumentId', 1) # Default or extract

        for slave in self.slaves:
            try:
                # Login if needed (simplified)
                # Ideally clients maintain their own session valid state
                if not slave.csrf_token:
                    slave.login()
                    
                logger.info(f"Copying to Slave {slave.username}: {side} {abs_quantity} {symbol}")
                
                result = slave.execute_order(
                    symbol=symbol,
                    side=side,
                    quantity=abs_quantity,
                    instrument_id=instrument_id
                )
                
                if result:
                    logger.info(f"Slave {slave.username} execution success")
                else:
                    logger.error(f"Slave {slave.username} execution failed")
                    
            except Exception as e:
                logger.error(f"Failed to copy to slave {slave.username}: {e}")

    def stop(self):
        self.is_running = False
        logger.info("Copier Engine Stopped")
