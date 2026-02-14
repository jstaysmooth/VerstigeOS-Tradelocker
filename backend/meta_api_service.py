import os
import asyncio
import logging
from metaapi_cloud_sdk import MetaApi
from dotenv import load_dotenv
from typing import Dict, Optional

# Resolve .env path relative to this file
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=env_path)

token = os.getenv("META_API_TOKEN")
logger = logging.getLogger("MetaApiService")

if not token:
    logger.error("META_API_TOKEN not found in .env")

class SynchronizationListener:
    def __init__(self, sio_callback):
        self.sio_callback = sio_callback

    async def on_order_executed(self, instance_index: str, order: dict):
        # This triggers when an order is executed on the master account
        logger.info(f"Master Order Executed: {order}")
        await self.process_order(order)

    async def on_order_completed(self, instance_index: str, order_id: str):
        logger.info(f"Master Order Completed: {order_id}")

    async def on_position_updated(self, instance_index: str, position: dict):
        logger.info(f"Master Position Updated: {position}")

    async def process_order(self, order: dict):
        if self.sio_callback:
            try:
                # Map MT5 types to BUY/SELL
                # POSITION_TYPE_BUY = 0, POSITION_TYPE_SELL = 1 (often in MetaApi)
                # Or it might be a string like 'ORDER_TYPE_BUY'
                order_type = str(order.get('type', ''))
                action = 'BUY' if 'BUY' in order_type.upper() else 'SELL'
                
                signal_data = {
                    "id": order.get('id'),
                    "pair": order.get('symbol'),
                    "action": action,
                    "price": str(order.get('openPrice') or order.get('price', 0)),
                    "sl": str(order.get('stopLoss', 0)),
                    "tp1": str(order.get('takeProfit', 0)),
                    "provider": "Verstige Master",
                    "timestamp": "Just now",
                    "category": "FOREX",
                    "lotSize": order.get('volume', 0.01)
                }
                logger.info(f"Broadcasting Signal: {signal_data}")
                await self.sio_callback("new_signal", signal_data)
            except Exception as e:
                logger.error(f"Error processing master order: {e}")

class MetaApiService:
    def __init__(self):
        self.api = MetaApi(token=token, opts={
            'clientApiUrl': 'https://mt-client-api-v1.london.agiliumtrade.ai',
            'provisioningApiUrl': 'https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai'
        })
        self.master_account_id = os.getenv("MASTER_ACCOUNT_ID", "031aaffb-f6be-4cad-814b-6dcbabdf1334")
        self.master_connection = None
        self.sio = None

    def set_socketio(self, sio):
        self.sio = sio

    async def start_master_listener(self):
        logger.info(f"Starting Master Polling Listener for: {self.master_account_id}")
        if not self.master_account_id:
            logger.warning("No Master Account ID configured.")
            return

        # Start polling loop as a background task
        asyncio.create_task(self.poll_master_account())

    async def poll_master_account(self):
        last_order_ids = set()
        first_run = True

        while True:
            try:
                # Use SDK method which internally handles the correct REST URL
                account = await self.api.metatrader_account_api.get_account(self.master_account_id)
                raise Exception(f"Account Methods: {dir(account)}")
                positions = await account.get_positions()
                
                current_position_ids = {p['id'] for p in positions}
                
                if first_run:
                    last_order_ids = current_position_ids
                    first_run = False
                    logger.info(f"Initial SDK positions captured: {len(last_order_ids)}")
                else:
                    new_positions = [p for p in positions if p['id'] not in last_order_ids]
                    for pos in new_positions:
                        logger.info(f"New Master Position Detected: {pos}")
                        await self.process_order(pos)
                    
                    last_order_ids = current_position_ids

            except Exception as e:
                # print(f"SDK Polling error details: {e}")
                logger.error(f"Error polling master account: {e}")
            
            await asyncio.sleep(5) 

    async def broadcast_signal(self, event, data):
        if self.sio:
            await self.sio.emit(event, data)

    async def verify_connection(self):
        try:
            accounts = await self.api.metatrader_account_api.get_accounts()
            return {"status": "connected", "accounts_count": len(accounts)}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    async def execute_trade(self, account_id: str, signal_data: dict):
        try:
            account = await self.api.metatrader_account_api.get_account(account_id)
            connection = account.get_rpc_connection()
            await connection.connect()
            await connection.wait_synchronized()

            symbol = signal_data.get('pair')
            action = signal_data.get('action')
            volume = signal_data.get('volume', 0.01)
            stop_loss = signal_data.get('sl')
            take_profit = signal_data.get('tp')

            if action == 'BUY':
                result = await connection.create_market_buy_order(symbol, volume, stop_loss, take_profit)
            elif action == 'SELL':
                result = await connection.create_market_sell_order(symbol, volume, stop_loss, take_profit)
            else:
                return {"status": "error", "message": "Invalid action"}

            return {"status": "success", "order": result}
        except Exception as e:
            return {"status": "error", "message": str(e)}



    async def provision_account(self, login, password, server, name):
        try:
            account = await self.api.metatrader_account_api.create_account(
                name=name,
                type='cloud',
                login=login,
                password=password,
                server=server,
                magic=1000,
                keywords=['Verstige']
            )
            return {"status": "success", "account_id": account.id, "state": account.state}
        except Exception as e:
            return {"status": "error", "message": str(e)}

meta_api_service = MetaApiService()
