import asyncio
import os
from metaapi_cloud_sdk import MetaApi
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

token = os.getenv("META_API_TOKEN")
account_id = os.getenv("MASTER_ACCOUNT_ID")

async def main():
    if not token or not account_id:
        print("Error: Missing credentials")
        return

    api = MetaApi(token=token, opts={
        'clientApiUrl': 'https://mt-client-api-v1.london.agiliumtrade.ai',
        'provisioningApiUrl': 'https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai'
    })
    
    try:
        account = await api.metatrader_account_api.get_account(account_id)
        print(f"Connected to account: {account.id} ({account.state})")
        
        # history_storage = account.get_history_storage()
        # deals = await history_storage.get_deals_by_time_range(
        #     datetime.now() - timedelta(days=1),
        #     datetime.now()
        # )
        
        # Alternative: use simple API if storage not enabled
        # But for correct deal types we might need the history API or ensuring history is synced
        
        print("Fetching recent deals...")
        # We'll try to get history from the account directly if possible, or force synchronization
        # For simplicity in this script, let's use the historical trades API if available, 
        # or just wait for live events if we were listening.
        # Check if we can get deals via history storage (preferred for 'closed' trades)
        
        # Note: In some MetaApi versions, you need to enable history storage
        # Let's try to access the terminal state directly via RPC to get history
        
        connection = account.get_rpc_connection()
        await connection.connect()
        await connection.wait_synchronized()
        
        history = await connection.get_history_orders_by_time_range(
             datetime.now() - timedelta(hours=24),
             datetime.now()
        )
        print(f"Found {len(history.get('historyOrders', []))} historical orders")
        
        deals_resp = await connection.get_deals_by_time_range(
             datetime.now() - timedelta(hours=24),
             datetime.now()
        )
        deals = deals_resp.get('deals', [])
        print(f"Found {len(deals)} recent deals")
        
        for deal in deals:
            print(f"ID: {deal.get('id')} | Symbol: {deal.get('symbol')} | Type: {deal.get('type')} | Entry: {deal.get('entryType')} | Profit: {deal.get('profit')}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
