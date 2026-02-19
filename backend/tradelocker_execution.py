
"""
Verstige OS — TradeLocker Execution Service
Authenticates, sizes position, and places trades on behalf of users.
"""

import os, json, httpx
from datetime import datetime, timezone
from typing import Optional
from cryptography.fernet import Fernet
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_KEY"),
)

encryption_key = os.getenv("CREDENTIAL_ENCRYPTION_KEY")
if not encryption_key:
    # Use a dummy key if not provided (should be set in .env)
    encryption_key = Fernet.generate_key().decode()
    print(f"WARNING: CREDENTIAL_ENCRYPTION_KEY not set. Generated temporary key: {encryption_key}")

fernet = Fernet(encryption_key.encode())
TRADELOCKER_BASE = "https://demo.tradelocker.com/backend-api"
# For live accounts swap to: https://live.tradelocker.com/backend-api

def decrypt(value: str) -> str:
    try:
        return fernet.decrypt(value.encode()).decode()
    except Exception as e:
        print(f"Decryption failed: {e}")
    return value # Fallback to original if not encrypted/wrong key

async def get_user_credentials(user_id: str) -> dict:
    print(f"DEBUG EXEC: Fetching credentials for user_id={user_id}")
    # Step 1: Get TradeLocker platform ID
    try:
        platform_resp = (
            supabase.table("trading_platforms")
            .select("id")
            .eq("code", "tradelocker")
            .execute()
        )
        if not platform_resp.data:
            raise ValueError("TradeLocker platform not found in database")
        
        platform_id = platform_resp.data[0]["id"]
        print(f"DEBUG EXEC: Found TradeLocker platform_id={platform_id}")

        # Step 2: Get Trading Account using platform_id (No JOIN)
        response = (
            supabase.table("trading_accounts")
            .select("*")
            .eq("user_id", user_id)
            .eq("platform_id", platform_id)
            .eq("is_active", True)
            .execute()
        )
        print(f"DEBUG EXEC: Database response count: {len(response.data) if response.data else 0}")
    except Exception as e:
        print(f"DEBUG EXEC: Database query failed: {e}")
        raise e
    
    if not response.data:
        print(f"DEBUG EXEC: No active TradeLocker account found for {user_id}")
        raise ValueError(f"No active TradeLocker account for user {user_id}")
        
    # Use the first active account found
    row = response.data[0]
    # Add server fallback if needed since we aren't joining anymore
    # The 'server' field should exist on the trading_account row itself based on previous schema work
    print(f"DEBUG EXEC: Found account row: {row.get('id')} - {row.get('account_number')}")
    
    # Parse credentials
    # main.py currently saves them as JSON string in 'encrypted_credentials'
    creds_str = row.get("encrypted_credentials", "{}")
    print(f"DEBUG EXEC: Raw creds string length: {len(creds_str)}")
    
    try:
        # Try JSON load first (current main.py behavior)
        creds = json.loads(creds_str)
        print("DEBUG EXEC: Credentials parsed as JSON successfully")
    except json.JSONDecodeError:
        # If actually encrypted/garbage, try decrypt fallback
        print("DEBUG EXEC: Credentials not JSON, attempting decryption...")
        try:
            decrypted = decrypt(creds_str)
            creds = json.loads(decrypted)
            print("DEBUG EXEC: Decryption successful")
        except Exception as e:
             print(f"DEBUG EXEC: Decryption failed: {e}")
             raise ValueError("Failed to parse account credentials")

    return {
        "email": creds.get("email"),
        "password": creds.get("password"),
        "server": row.get("server") or creds.get("server"),
        "account_id": creds.get("account_id"),
    }

async def get_tradelocker_token(email, password, server) -> dict:
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{TRADELOCKER_BASE}/auth/jwt/token",
            json={"email": email, "password": password, "server": server},
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json()
    if "accessToken" not in data:
        raise ValueError(f"Auth failed: {data}")
    return {"access_token": data["accessToken"], "refresh_token": data.get("refreshToken")}

async def get_account_details(access_token, account_id) -> dict:
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{TRADELOCKER_BASE}/auth/jwt/all-accounts",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        resp.raise_for_status()
        accounts = resp.json().get("accounts", [])
    for acc in accounts:
        if str(acc.get("id")) == str(account_id):
            return acc
    raise ValueError(f"Account {account_id} not found")

async def get_instrument_id(access_token, acc_num, symbol) -> str:
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{TRADELOCKER_BASE}/trade/instruments",
            headers={"Authorization": f"Bearer {access_token}", "accNum": str(acc_num)},
        )
        resp.raise_for_status()
        data = resp.json()
    instruments = data.get("d", {}).get("instruments", [])
    for inst in instruments:
        if isinstance(inst, dict):
            if inst.get("name", "").upper() == symbol.upper():
                return str(inst["tradableInstrumentId"])
        elif isinstance(inst, list) and len(inst) > 1:
            if str(inst[1]).upper() == symbol.upper():
                return str(inst[0])
    raise ValueError(f"Instrument {symbol!r} not found")

async def place_order(access_token, acc_num, instrument_id,
                      direction, quantity, entry, stop_loss, take_profit,
                      order_type="market") -> dict:
    payload = {
        "tradableInstrumentId": int(instrument_id),
        "type": order_type,
        "side": direction.lower(),
        "qty": quantity,
        "stopLoss": stop_loss,
        "takeProfit": take_profit,
        "validity": "GTC",
    }
    if order_type == "limit": payload["price"] = entry
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{TRADELOCKER_BASE}/trade/orders",
            headers={"Authorization": f"Bearer {access_token}",
                     "accNum": str(acc_num), "Content-Type": "application/json"},
            json=payload, timeout=15,
        )
        resp.raise_for_status()
        return resp.json()

def calculate_lot_size(balance, risk_percent, entry, stop_loss,
                       lot_step=0.01) -> float:
    risk_amount = balance * (float(risk_percent) / 100)
    stop_distance = abs(float(entry) - float(stop_loss))
    if stop_distance == 0:
        raise ValueError("Entry and SL cannot be the same")
    # Basic pip-value based lot sizing
    raw_lots = risk_amount / (stop_distance * 100)
    lots = round(round(raw_lots / lot_step) * lot_step, 2)
    return max(0.01, min(lots, 100.0))

async def execute_signal_for_user(user_id: str, signal_id: str) -> dict:
    # 1. Fetch signal
    sig_result = supabase.table("signals").select("*").eq("id", signal_id).single().execute()
    sig = sig_result.data
    if not sig: raise ValueError(f"Signal {signal_id} not found")
    
    # 2. Get credentials
    creds = await get_user_credentials(user_id)
    
    # 3. Authenticate
    tokens = await get_tradelocker_token(creds["email"], creds["password"], creds["server"])
    access_token = tokens["access_token"]
    
    # 4. Get account details
    account = await get_account_details(access_token, creds["account_id"])
    acc_num = account.get("accNum") or account.get("id")
    balance = float(account.get("balance", 10000))
    
    # 5. Resolve instrument
    instrument_id = await get_instrument_id(access_token, acc_num, sig["symbol"])
    
    # 6. Size position
    lot_size = calculate_lot_size(
        balance=balance, risk_percent=sig.get("risk_percent", 1.0),
        entry=sig["entry"], stop_loss=sig["stop_loss"],
    )
    
    # 7. Place order
    order_result = await place_order(
        access_token=access_token, acc_num=acc_num,
        instrument_id=instrument_id, direction=sig["direction"],
        quantity=lot_size, entry=sig["entry"],
        stop_loss=sig["stop_loss"], take_profit=sig["take_profit"],
    )
    
    # 8. Log to Supabase
    supabase.table("trade_executions").insert({
        "user_id": user_id, "signal_id": signal_id,
        "broker": "tradelocker", "account_id": str(creds["account_id"]),
        "symbol": sig["symbol"], "direction": sig["direction"],
        "lot_size": lot_size, "entry": sig["entry"],
        "stop_loss": sig["stop_loss"], "take_profit": sig["take_profit"],
        "broker_order_id": str(order_result.get("d", {}).get("orderId", "")),
        "status": "executed",
        "executed_at": datetime.now(timezone.utc).isoformat(),
        "raw_response": order_result,
    }).execute()
    
    # 9. Update signal status
    supabase.table("signals").update({"status": "executed"}).eq("id", signal_id).execute()
    
    return {
        "success": True, 
        "lot_size": lot_size, 
        "order": order_result,
        "message": f"{sig['direction']} {sig['symbol']} executed — {lot_size} lots",
    }
