import os
import sys
import asyncio
import logging
import httpx
from datetime import datetime, timedelta
from metaapi_cloud_sdk import MetaApi
from dotenv import load_dotenv

# Re-resolve lib path if needed for isolated environment
# sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'bridge_lib'))

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'), override=True)

token = os.getenv("META_API_TOKEN")
master_account_id = os.getenv("MASTER_ACCOUNT_ID")
backend_url = "http://localhost:8000/api/internal/signal"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("MetaApiBridge")

class SynchronizationListener:


    async def process_result(self, deal: dict):
        logger.info(f"Processing Result: {deal}")
        try:
             async with httpx.AsyncClient() as client:
                net_profit = float(deal.get('profit', 0)) + float(deal.get('swap', 0)) + float(deal.get('commission', 0))
                
                payload = {
                    "type": "signal_result", # Explicit event type
                    "data": {
                        "id": deal.get('positionId'), # Link back to the opened position ID
                        "pair": deal.get('symbol'),
                        "type": str(deal.get('type', '')), # DEAL_TYPE_BUY/SELL
                        "entryPrice": str(deal.get('price', 0)), # This is actually exit price for entry_out
                        "closePrice": str(deal.get('price', 0)),
                        "netProfit": net_profit,
                        "pips": 0, # Calculate if possible or leave for frontend
                        "lotSize": deal.get('volume', 0.01),
                        "timestamp": str(deal.get('time')),
                        "provider": "Verstige AI"
                    }
                }
                response = await client.post(backend_url, json=payload)
                logger.info(f"Result sent to backend: {response.status_code}")
        except Exception as e:
            logger.error(f"Failed to send result: {e}")

    async def on_order_executed(self, instance_index: str, order: dict):
        # Orders are always potential new signals (pending orders triggering)
        await self.process_signal(order, "Order")

    async def on_deal_added(self, instance_index: str, deal: dict):
        # Check Entry Type
        entry_type = deal.get('entryType', '')
        logger.info(f"Deal Added: {deal.get('id')} - EntryType: {entry_type} - Symbol: {deal.get('symbol')}")
        
        # ENTRY_IN = 0 (New Market Trade)
        if entry_type == 'DEAL_ENTRY_IN':
             await self.process_signal(deal, "Deal")
             
        # ENTRY_OUT = 1, ENTRY_OUT_BY = 2 (Trade Closure)
        elif entry_type in ['DEAL_ENTRY_OUT', 'DEAL_ENTRY_OUT_BY']:
             await self.process_result(deal)

    async def on_order_completed(self, *args, **kwargs): logger.info(f"Order Completed: {args} {kwargs}")
    async def on_position_updated(self, instance_index: str, position: dict):
        """Forward live position P&L updates to the dashboard."""
        try:
            async with httpx.AsyncClient() as client:
                payload = {
                    "type": "position_update",
                    "data": {
                        "id": position.get('id'),
                        "symbol": position.get('symbol'),
                        "profit": position.get('profit', 0),           # Realized component
                        "unrealizedProfit": position.get('unrealizedProfit', position.get('profit', 0)),
                        "currentPrice": position.get('currentPrice', 0),
                        "swap": position.get('swap', 0),
                        "commission": position.get('commission', 0)
                    }
                }
                await client.post(backend_url, json=payload, timeout=0.5)
        except Exception:
            pass  # Don't block the stream on update failures
    async def on_symbol_price_updated(self, instance_index: str, price: dict):
        try:
            symbol = price.get('symbol')
            if symbol:  # Forward all symbol price updates
                async with httpx.AsyncClient() as client:
                    payload = {
                        "type": "price_update",
                        "data": {
                            "symbol": price.get('symbol'),
                            "bid": price.get('bid'),
                            "ask": price.get('ask'),
                            "time": price.get('time')
                        }
                    }
                    # Fire and forget - verify if we need to await this or if it blocks too much.
                    # For a bridge, we might want to batch these or use a background task.
                    # For MVP, we send directly but maybe with a timeout to avoid lagging.
                    await client.post(backend_url, json=payload, timeout=0.5)
        except Exception:
            pass # Ignore price update fail to keep stream alive

    async def on_symbol_prices_updated(self, *args, **kwargs): pass
    async def on_account_information_updated(self, instance_index: str, account: dict):
        logger.info(f"Account Updated: {account}")
        try:
            async with httpx.AsyncClient() as client:
                payload = {
                    "type": "account_update",
                    "data": {
                        "balance": account.get('balance'),
                        "equity": account.get('equity'),
                        "margin": account.get('margin'),
                        "freeMargin": account.get('freeMargin'),
                        "marginLevel": account.get('marginLevel')
                    }
                }
                await client.post(backend_url, json=payload)
        except Exception as e:
            logger.error(f"Failed to broadcast account update: {e}")
    async def on_deals_synchronized(self, *args, **kwargs): logger.info("Deals Synchronized")
    async def on_orders_synchronized(self, *args, **kwargs): logger.info("Orders Synchronized")
    async def on_broker_connection_status_changed(self, *args, **kwargs): logger.info(f"Broker Connection Status Changed: {kwargs}")
    async def on_health_status(self, *args, **kwargs): 
        # logger.debug(f"Health Status: {kwargs}") 
        pass
    
    async def on_connected(self, *args, **kwargs): logger.info("Bridge Connected to MetaApi")
    async def on_disconnected(self, *args, **kwargs): logger.info("Bridge Disconnected from MetaApi")
    async def on_error(self, error: Exception): logger.error(f"Bridge Error: {error}")

    async def process_signal(self, data: dict, signal_type: str):
        logger.info(f"Processing {signal_type}: {data}")
        try:
            async with httpx.AsyncClient() as client:
                # Detect type from Order or Deal
                raw_type = str(data.get('type', ''))
                if 'BUY' in raw_type.upper():
                    action = 'BUY'
                elif 'SELL' in raw_type.upper():
                    action = 'SELL'
                else: 
                     # Fallback for positions where type might be numerical or different
                     if str(data.get('type')) == '0': action = 'BUY' # POSITION_TYPE_BUY
                     elif str(data.get('type')) == '1': action = 'SELL' # POSITION_TYPE_SELL
                     else: action = 'BUY' # Default

                # Price field varies between Order (openPrice) and Deal (price)
                price = str(data.get('openPrice') or data.get('price', 0))
                symbol = data.get('symbol', 'Unknown')
                
                # Determine Category
                category = "FOREX"
                u_symbol = symbol.upper()
                if "XAU" in u_symbol or "GOLD" in u_symbol: category = "GOLD"
                elif "BTC" in u_symbol or "ETH" in u_symbol or "CRYPTO" in u_symbol or "ETHEREUM" in u_symbol: category = "CRYPTO"
                elif "US30" in u_symbol or "SPX" in u_symbol or "NAS" in u_symbol or "INDICE" in u_symbol: category = "INDICES"
                
                # Enhanced payload with potential P&L for open positions if available in update
                payload = {
                    "type": "new_signal", # Explicit event type
                    "data": {
                        "id": data.get('id'),
                        "pair": symbol,
                        "action": action,
                        "price": price,
                        "sl": str(data.get('stopLoss', 0)),
                        "tp1": str(data.get('takeProfit', 0)),
                        "lotSize": data.get('volume', 0.01),
                        "provider": "Verstige Master", # Set provider name
                        "providerRank": "Elite",
                        "category": category,
                        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        "profit": data.get('profit', 0) # Include current profit if available
                    }
                }
                response = await client.post(backend_url, json=payload)
                logger.info(f"Signal sent to backend: {response.status_code}")
        except Exception as e:
            logger.error(f"Failed to send signal to backend: {e}")
    async def on_deal_updated(self, *args, **kwargs): logger.info(f"Deal Updated: {args} {kwargs}")

async def main():
    if not token or not master_account_id:
        logger.error("Missing META_API_TOKEN or MASTER_ACCOUNT_ID")
        return

    api = MetaApi(token=token, opts={
        'clientApiUrl': 'https://mt-client-api-v1.london.agiliumtrade.ai',
        'provisioningApiUrl': 'https://mt-provisioning-api-v1.agiliumtrade.ai'
    })
    try:
        # Check if master_account_id looks like a UUID or a login
        account_id = master_account_id
        # UUID is 36 chars. Login or Name is usually shorter. 
        if len(master_account_id) < 36:
             # Assume it's a login number or name, try to find it
             logger.info(f"Looking up account by login/name: {master_account_id}")
             try:
                 accounts = await api.metatrader_account_api.get_accounts_with_infinite_scroll_pagination()
                 logger.info(f"Retrieved {len(accounts)} accounts from MetaApi.")
             except Exception as lookup_err:
                 logger.error(f"Error retrieving accounts: {lookup_err}")
                 return

             # precise match or match within name/login string
             found = next((a for a in accounts if str(a.login) in master_account_id or master_account_id in a.name or a.name == master_account_id), None)
             if found:
                 account_id = found.id
                 logger.info(f"Foun account ID {account_id} for {master_account_id}")
             else:
                 logger.error(f"Account with identifier {master_account_id} not found in MetaApi account list.")
                 return

        account = await api.metatrader_account_api.get_account(account_id)
        if account.state != 'DEPLOYED' and account.state != 'CONNECTED':
            await account.deploy()
        
        await account.wait_connected()
        connection = account.get_streaming_connection()
        await connection.connect()
        await connection.wait_synchronized()
        
        listener = SynchronizationListener()
        connection.add_synchronization_listener(listener)
        
        # Sync recent history and OPEN POSITIONS
        try:
            logger.info("Syncing recent history and open positions via RPC...")
            rpc = account.get_rpc_connection()
            await rpc.connect()
            await rpc.wait_synchronized()
            
            # 1. Sync Open Positions (Active Trades)
            positions = await rpc.get_positions()
            logger.info(f"Found {len(positions)} open positions.")
            for position in positions:
                # Treat open positions as "Signals" so they show up in the dashboard
                await listener.process_signal(position, "Existing Position")

            # 2. Sync Recent History (Missed Closures)
            deals_resp = await rpc.get_deals_by_time_range(
                datetime.now() - timedelta(hours=24),
                datetime.now()
            )
            await rpc.close()
            
            deals = deals_resp.get('deals', [])
            logger.info(f"Checking {len(deals)} recent deals for missed closures.")
            for deal in deals:
                entry_type = deal.get('entryType')
                if entry_type in ['DEAL_ENTRY_OUT', 'DEAL_ENTRY_OUT_BY']:
                    await listener.process_result(deal)
        except Exception as e:
            logger.error(f"History/Position sync failed: {e}")

        logger.info(f"Bridge connected and listening for master: {master_account_id}")
        
        while True:
            await asyncio.sleep(60) # Keep process alive
            
    except Exception as e:
        logger.error(f"Bridge Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
