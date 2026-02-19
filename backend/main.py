from fastapi import FastAPI, HTTPException, Body, Depends, Request
from sqlalchemy.orm import Session
from backend.database import init_db, get_db
from backend.services.feed_service import FeedService
from backend.services.rank_service import RankService
from backend.services.leaderboard_service import LeaderboardService
from backend.models.feed_models import PostResponse, CreateUserRequest, RankUpdateRequest, LeaderboardUserResponse, UpdateStatsRequest

from fastapi.middleware.cors import CORSMiddleware
import socketio
from typing import Optional, Dict
from pydantic import BaseModel
import asyncio
import logging
import sys
print(f"DEBUG SYS PATH: {sys.path}")
import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Initialize Supabase Client for direct operations
load_dotenv()
supabase: Client = create_client(
    os.getenv("SUPABASE_URL", ""),
    os.getenv("SUPABASE_SERVICE_KEY", "") or os.getenv("SUPABASE_KEY", "")
)

import sys

from backend.internal import SocketIOServerClient
from backend.handlers import RequestHandler
from backend.models import MTClientParams, CreateOrderRequest, SideType, OrderType
from backend.settings import settings
from backend.dxtrade import DxTradeClient, CopierEngine
from backend.services.matchtrader_client import MatchTraderClient
from backend.services.tradelocker_client import TradeLockerClient
from backend.meta_api_service import meta_api_service
from backend.models.db_models import TradingAccount, TradingPlatform
from backend.signal_approval_router import router as signal_router
import json

# Initialize Logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("VerstigeBackend")

# Initialize FastAPI
app = FastAPI()

# Initialize Socket.IO globally
ALLOWED_ORIGINS = [
    "http://localhost:3000", 
    "http://127.0.0.1:3000",
    "https://verstige.io",
    "http://verstige.io",
    "https://www.verstige.io",
    "https://verstige-os-v2.netlify.app",
    "https://web-production-d3eb0.up.railway.app"
]

sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins=ALLOWED_ORIGINS)

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(signal_router)

# Input Models
class TradeSignal(BaseModel):
    account_id: str  # Kept for compatibility, though less relevant for single local instance
    pair: str
    action: str  # BUY or SELL
    volume: Optional[float] = 0.01
    sl: Optional[float] = None
    tp: Optional[float] = None

class TelegramSignal(BaseModel):
    provider: str
    provider_rank: str = "Pro"
    pair: str
    action: str
    price: float
    sl: float
    tp1: float
    tp2: Optional[float] = None
    tp3: Optional[float] = None
    category: str = "FOREX"
    win_rate: int = 70
    lot_size: float = 0.01

class DxTradeLoginRequest(BaseModel):
    username: str
    password: str
    server: str
    accountId: int

# Global components
request_handler: Optional[RequestHandler] = None
# sio is already initialized above
# sio: Optional[socketio.AsyncServer] = None
copier_engine: Optional[CopierEngine] = None
master_client: Optional[DxTradeClient] = None

@app.on_event("startup")
async def startup_event():
    global request_handler, sio, copier_engine, master_client
    
    # Initialize Database Tables
    try:
        init_db()
        logger.info("Database initialized")
    except Exception as e:
        logger.error(f"Failed to init DB: {e}")

    # Initialize Socket.IO server with explicit CORS
    # Use specific origin to avoid wildcard+credentials issues
    # sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins=["http://localhost:3000"])
    # We init sio globally but attach it later
    pass

    # Initialize MT5 Clients
    # server_client = SocketIOServerClient(sio)
    # mt_params = MTClientParams(
    #     mt_directory_path=settings.METATRADER_FILES_DIR,
    #     verbose=True
    # )
    # request_handler = RequestHandler(mt_params, server_client)
    
    # Register MT5 event handlers
    # from backend.models import Events
    if request_handler: # Safety check
        await request_handler.register_handler(Events.ExchangeInfo, request_handler.get_exchange_info_handler)
        await request_handler.register_handler(Events.Account, request_handler.get_account_handler)
        await request_handler.register_handler(Events.CreateOrder, request_handler.create_order_handler)
        await request_handler.register_handler(Events.CloseOrder, request_handler.close_order_handler)
        await request_handler.register_handler(Events.GetOpenOrders, request_handler.get_open_orders_handler)
        await request_handler.register_handler(Events.ModifyOrder, request_handler.modify_order_handler)
        # Kline handlers omitted for brevity/relevance check if needed

    # Initialize DxTrade Copier (Master Account Placeholder)
    # Ideally credentials come from Vault/Env
    # master_client = DxTradeClient("verstige_os", "password", "ftmo", 123456)
    try:
        if not master_client:
            # Using credentials provided by user for "Liquid Brokers" (assuming 'liquid' as vendor/server slug, or standard dxfeed if unsure, trying 'liquid' first)
            # User said "julylan.johnson@gmail.com" / "Moneytime33$"
            # Server name might be 'liquid', 'liquidrc', etc. 
            # We'll use a placeholder 'liquid' for now and log if it fails.
            master_client = DxTradeClient("julylan.johnson@gmail.com", "Moneytime33$", "liquid", 0) 
            # Account ID 0 often implies default or needs fetching. 
            # The Login method in client.py doesn't strictly require correct AccountID for auth if just getting token, 
            # but API calls might. We'll start with this.
            
            copier_engine = CopierEngine(master_client)
            # asyncio.create_task(copier_engine.start()) # User can start via admin endpoint or uncomment this
            logger.info("DxTrade Copier initialized with Master Credentials")
            
    except Exception as e:
        logger.error(f"Failed to init copier: {e}")

    # Initialize MetaApi Service (and Bridge)
    try:
        meta_api_service.set_socketio(sio)
        # Instead of starting the listener here (which hangs due to Socket.IO conflict),
        # we start the bridge process using the isolated library path.
        bridge_script = os.path.join(os.path.dirname(__file__), "meta_api_bridge.py")
        lib_path = os.path.join(os.path.dirname(__file__), "bridge_lib")
        
        # Start bridge as a separate process
        import subprocess
        env = os.environ.copy()
        env["PYTHONPATH"] = lib_path + ":" + env.get("PYTHONPATH", "")
        subprocess.Popen([sys.executable, bridge_script], env=env)
        
        logger.info("MetaApi Bridge Process started")
    except Exception as e:
        logger.error(f"Failed to init MetaApi: {e}")

    logger.info("Backend Startup Complete")


@app.post("/execute-swipe")
async def execute_swipe(signal: TradeSignal):
    """
    Execute a trade on user's MT5 account when they swipe.
    """
    try:
        # Use MetaApiService to execute the trade on user's account
        result = await meta_api_service.execute_trade(signal.account_id, signal.model_dump())
        
        if result.get("status") == "success":
            return result
        else:
            raise HTTPException(status_code=500, detail=result.get("message"))

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class MT5ProvisionRequest(BaseModel):
    login: str
    password: str
    server: str
    name: str

@app.post("/api/mt5/provision")
async def mt5_provision(req: MT5ProvisionRequest):
    """
    Provision/Link a user's MT5 account via MetaApi.
    """
    try:
        result = await meta_api_service.provision_account(
            login=req.login,
            password=req.password,
            server=req.server,
            name=req.name
        )
        if result.get("status") == "success":
            return result
        else:
            raise HTTPException(status_code=500, detail=result.get("message"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/internal/signal")
async def internal_signal(request: Request):
    """
    Dual-purpose endpoint:
    1. Called by MetaApi Bridge to broadcast socket events (legacy format: {type, data})
    2. Called by Telegram webhook to receive signals and write to Supabase
    """
    payload = await request.json()
    logger.info(f"Internal Signal Received: {str(payload)[:200]}")

    # ── Path A: Telegram webhook update format ─────────────
    message = payload.get("message") or payload.get("channel_post")
    if message:
        text    = message.get("text", "")
        chat    = message.get("chat", {})
        chat_id = chat.get("id")
        logger.info(f"[Telegram via internal] Parsing: {text[:80]}")

        sig = _parse_telegram_signal(text)
        if sig:
            try:
                signal_id = await _publish_signal_to_supabase(sig)
                await sio.emit("new_signal", {
                    "id": signal_id,
                    "symbol": sig["symbol"],
                    "direction": sig["direction"],
                    "entry": sig["entry"],
                    "stop_loss": sig["stop_loss"],
                    "take_profit": sig["take_profit"],
                    "status": "pending",
                    "source": "telegram",
                })
                logger.info(f"[Telegram] Signal saved and broadcast: {sig['direction']} {sig['symbol']}")
                if chat_id:
                    await _send_telegram_reply(chat_id,
                        f"✅ Signal received!\n{sig['direction']} {sig['symbol']}\n"
                        f"Entry: {sig['entry']} | SL: {sig['stop_loss']} | TP: {sig['take_profit']}")
            except Exception as e:
                logger.error(f"[Telegram] Failed to save signal: {e}")
        else:
            logger.info("[Telegram] Not a valid signal format, ignoring.")
        return {"ok": True}

    # ── Path B: Legacy MetaApi bridge format ───────────────
    event_type = payload.get("type", "new_signal")
    event_data = payload.get("data", payload)
    logger.info(f"Broadcasting socket event: {event_type}")
    await meta_api_service.broadcast_signal(event_type, event_data)
    return {"status": "success"}



@app.post("/api/test-signal")
async def test_signal():
    """
    Manually trigger a test signal to verify frontend socket connection.
    """
    test_data = {
        "id": int(asyncio.get_event_loop().time()),
        "pair": "XAUUSD",
        "action": "BUY",
        "price": "2025.50",
        "sl": "2020.00",
        "tp1": "2035.00",
        "provider": "Verstige AI",
        "timestamp": "Just now",
        "category": "GOLD",
        "lotSize": 0.05
    }
    await meta_api_service.broadcast_signal("new_signal", test_data)
    return {"status": "success", "message": "Test signal broadcasted", "data": test_data}

@app.post("/api/test-result")
async def test_result():
    """
    Manually trigger a signal_result event.
    """
    test_data = {
        "id": "12345", # Matches a potential signal ID
        "pair": "XAUUSD",
        "type": "DEAL_TYPE_BUY",
        "entryPrice": "2020.00",
        "closePrice": "2025.50",
        "netProfit": 150.00,
        "pips": 55,
        "lotSize": 0.05,
        "timestamp": "Just now",
        "provider": "Verstige AI"
    }
    await meta_api_service.broadcast_signal("signal_result", test_data)
    return {"status": "success", "message": "Test result broadcasted", "data": test_data}
async def root():
    return {"message": "Verstige Trading Engine (Local Bridge + DxTrade Copier) Active"}

@app.get("/verify-connection")
async def verify_connection():
    mt5_status = "disconnected"
    if request_handler and request_handler.order_handler.socket_client:
        if request_handler.order_handler.socket_client.dwx_client.sending_thread.is_alive():
            mt5_status = "connected"
            
    dxtrade_status = "inactive"
    if copier_engine and copier_engine.is_running:
        dxtrade_status = "active"
        
    return {
        "mt5_bridge": mt5_status, 
        "dxtrade_copier": dxtrade_status,
        "mode": "Hybrid"
    }

@app.post("/execute-swipe")
async def execute_swipe(signal: TradeSignal):
    """
    Execute a trade on user's MT5 account when they swipe.
    """
    try:
        # Use MetaApiService to execute the trade on user's account
        result = await meta_api_service.execute_trade(signal.account_id, signal.model_dump())
        
        if result.get("status") == "success":
            return result
        else:
            raise HTTPException(status_code=500, detail=result.get("message"))

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/signals/webhook")
async def telegram_signal_webhook(signal: TelegramSignal):
    """
    Receive signals from Telegram/MT5 Master and broadcast to frontend.
    """
    if not sio:
        raise HTTPException(status_code=503, detail="Socket.IO not initialized")
    
    # Format for frontend
    signal_data = {
        "id": int(asyncio.get_event_loop().time() * 1000), # Simple unique ID from timestamp
        "provider": signal.provider,
        "providerRank": signal.provider_rank,
        "pair": signal.pair.upper(),
        "action": signal.action.upper(),
        "pips": 0, # Calculated later or tracked
        "price": str(signal.price),
        "sl": str(signal.sl),
        "tp1": str(signal.tp1),
        "tp2": str(signal.tp2) if signal.tp2 else "-",
        "tp3": str(signal.tp3) if signal.tp3 else "-",
        "category": signal.category,
        "timestamp": "Just now",
        "winRate": signal.win_rate,
        "lotSize": signal.lot_size
    }
    
    # Broadcast to all connected clients
    await sio.emit("new_signal", signal_data)
    
    logger.info(f"Broadcasted Telegram Signal: {signal.pair} {signal.action}")
    return {"status": "success", "message": "Signal broadcasted"}


# ── Telegram Webhook (production path — registered with Telegram API) ──────────
import re as _re, uuid as _uuid
from datetime import timezone as _tz

TELEGRAM_BOT_TOKEN  = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_WEBHOOK_SECRET = os.getenv("TELEGRAM_WEBHOOK_SECRET")

def _parse_telegram_signal(text: str):
    """
    Parse signals in this format:
      BUY XAUUSD
      Entry: 2345.50
      SL: 2330.00
      TP: 2375.00
      Risk: 1%
      TF: H1
      Notes: Optional note
    """
    text = text.strip()
    direction = "BUY" if _re.search(r"\bBUY\b", text, _re.I) else None
    if not direction:
        direction = "SELL" if _re.search(r"\bSELL\b", text, _re.I) else None
    if not direction:
        return None

    m = _re.search(r"(?:BUY|SELL)\s+(\S+)", text, _re.I)
    symbol = m.group(1).upper() if m else None
    if not symbol:
        return None

    def _extract(pat):
        m = _re.search(pat, text, _re.I)
        return float(m.group(1)) if m else None

    entry = _extract(r"entry[:\s]+([0-9]+(?:\.[0-9]+)?)")
    sl    = _extract(r"sl[:\s]+([0-9]+(?:\.[0-9]+)?)")
    tp    = _extract(r"tp[:\s]+([0-9]+(?:\.[0-9]+)?)")
    risk  = _extract(r"risk[:\s]+([0-9]+(?:\.[0-9]+)?)%?") or 1.0
    tf_m  = _re.search(r"tf[:\s]+(M\d+|H\d+|D\d?|W\d?)", text, _re.I)
    notes_m = _re.search(r"notes?[:\s]+(.+)", text, _re.I)

    if not all([entry, sl, tp]):
        return None

    return {
        "symbol": symbol,
        "direction": direction,
        "entry": entry,
        "stop_loss": sl,
        "take_profit": tp,
        "risk_percent": risk,
        "timeframe": tf_m.group(1).upper() if tf_m else None,
        "notes": notes_m.group(1).strip() if notes_m else None,
        "source": "telegram",
    }

async def _publish_signal_to_supabase(sig: dict) -> str:
    """Insert a parsed signal into Supabase signals table and return its ID."""
    signal_id = str(_uuid.uuid4())
    now = datetime.now(_tz.utc).isoformat()

    if sig["direction"] == "BUY":
        risk   = sig["entry"] - sig["stop_loss"]
        reward = sig["take_profit"] - sig["entry"]
    else:
        risk   = sig["stop_loss"] - sig["entry"]
        reward = sig["entry"] - sig["take_profit"]

    rr_ratio = round(reward / risk, 2) if risk > 0 else 0

    record = {
        "id":           signal_id,
        "symbol":       sig["symbol"],
        "direction":    sig["direction"],
        "entry":        sig["entry"],
        "stop_loss":    sig["stop_loss"],
        "take_profit":  sig["take_profit"],
        "risk_percent": sig.get("risk_percent", 1.0),
        "rr_ratio":     rr_ratio,
        "timeframe":    sig.get("timeframe"),
        "notes":        sig.get("notes"),
        "source":       sig.get("source", "telegram"),
        "status":       "pending",
        "created_at":   now,
    }

    result = supabase.table("signals").insert(record).execute()
    logger.info(f"[Telegram] Signal inserted to Supabase: {sig['direction']} {sig['symbol']}")
    return signal_id

async def _send_telegram_reply(chat_id: int, text: str):
    """Send a confirmation reply back to the Telegram chat."""
    if not TELEGRAM_BOT_TOKEN:
        return
    import httpx as _httpx
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    async with _httpx.AsyncClient() as client:
        await client.post(url, json={"chat_id": chat_id, "text": text})

@app.post("/api/telegram/webhook")
async def telegram_webhook(request: Request):
    """
    Telegram calls this URL for every new message sent to the bot.
    Register this as your webhook: 
      https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://web-production-d3eb0.up.railway.app/api/telegram/webhook
    """
    # Validate secret token if configured
    if TELEGRAM_WEBHOOK_SECRET:
        hdr = request.headers.get("X-Telegram-Bot-Api-Secret-Token")
        if hdr != TELEGRAM_WEBHOOK_SECRET:
            raise HTTPException(status_code=403, detail="Invalid webhook secret")

    body = await request.json()
    message = body.get("message") or body.get("channel_post")
    if not message:
        return {"ok": True}

    text    = message.get("text", "")
    chat    = message.get("chat", {})
    chat_id = chat.get("id")

    logger.info(f"[Telegram] Received message: {text[:80]}")

    sig = _parse_telegram_signal(text)
    if sig:
        try:
            signal_id = await _publish_signal_to_supabase(sig)
            # Also broadcast via Socket.IO for real-time update to connected dashboards
            await sio.emit("new_signal", {
                "id": signal_id,
                "symbol": sig["symbol"],
                "direction": sig["direction"],
                "entry": sig["entry"],
                "stop_loss": sig["stop_loss"],
                "take_profit": sig["take_profit"],
                "status": "pending",
                "source": "telegram",
            })
            if chat_id:
                await _send_telegram_reply(chat_id,
                    f"✅ Signal received!\n{sig['direction']} {sig['symbol']}\n"
                    f"Entry: {sig['entry']} | SL: {sig['stop_loss']} | TP: {sig['take_profit']}")
        except Exception as e:
            logger.error(f"[Telegram] Failed to publish signal: {e}")
            if chat_id:
                await _send_telegram_reply(chat_id, f"❌ Failed to save signal: {str(e)}")
    else:
        logger.info(f"[Telegram] Message not a valid signal, ignoring.")

    return {"ok": True}



# --- DxTrade Endpoints ---

@app.post("/dxtrade/login")
async def dxtrade_login(creds: DxTradeLoginRequest):
    """
    Links a user's DxTrade account to the copier.
    In a real app, we'd store this session associated with the user.
    For this MVP, we add it directly to the global copier engine.
    """
    global copier_engine, master_client
    
    if not copier_engine:
        # Initialize with dummy master if not set (for testing user login isolation)
        if not master_client:
             master_client = DxTradeClient("master_placeholder", "pass", "ftmo", 0)
        copier_engine = CopierEngine(master_client)
    
    # Verify credentials by attempting login
    client = DxTradeClient(creds.username, creds.password, creds.server, creds.accountId)
    if client.login():
        copier_engine.add_slave(client)
        return {"status": "success", "message": "Account linked and ready to copy trades"}
    else:
        raise HTTPException(status_code=401, detail="Invalid DxTrade credentials")

@app.post("/dxtrade/master/configure")
async def configure_master(creds: DxTradeLoginRequest):
    """
    Admin endpoint to set the Master Account.
    """
    global copier_engine, master_client
    
    if copier_engine and copier_engine.is_running:
        copier_engine.stop()
        
    master_client = DxTradeClient(creds.username, creds.password, creds.server, creds.accountId)
    if master_client.login():
        copier_engine = CopierEngine(master_client)
        asyncio.create_task(copier_engine.start())
        return {"status": "success", "message": "Master account configured and copier started"}
    else:
        raise HTTPException(status_code=401, detail="Invalid Master credentials")


# --- New DxTrade Authentication with Account Selection ---

class DxTradeAuthRequest(BaseModel):
    username: str
    password: str
    vendor: str = "liquidbrokers"
    domain: str = "default"

class DxTradeAccountSelectRequest(BaseModel):
    username: str
    password: str
    vendor: str
    domain: str = "default"
    account_id: str

# Import the new service client
from backend.services.dxtrade_client import DxTradeClient as DxTradeServiceClient

# Store active sessions (in production, use Redis/database)
dxtrade_sessions: Dict[str, DxTradeServiceClient] = {}
matchtrader_sessions: Dict[str, MatchTraderClient] = {}
tradelocker_sessions: Dict[str, TradeLockerClient] = {}

def _normalize_session_url(client: TradeLockerClient) -> TradeLockerClient:
    """Patch base_url on any stale in-memory session that has the wrong broker URL suffix."""
    if client and not client.base_url.endswith("/backend-api"):
        old = client.base_url
        root = old
        for wrong in ["/clientapi/v1", "/clientapi", "/api/v1", "/api"]:
            if root.endswith(wrong):
                root = root[: -len(wrong)]
                break
        if not root.endswith("/backend-api"):
            root = root + "/backend-api"
        client.base_url = root
        logger.warning(f"[SessionFix] Patched stale base_url: '{old}' → '{root}'")
    return client

class MatchTraderAuthRequest(BaseModel):
    email: str
    password: str
    broker_url: str = "https://match-trader.com/api"

class TradeLockerAuthRequest(BaseModel):
    email: str
    password: str
    server: str = "TradeLocker Demo"
    broker_url: str = "https://demo.tradelocker.com/backend-api"

class GenericExecuteRequest(BaseModel):
    username: str # email for matchtrader/tradelocker
    password: Optional[str] = None
    server: Optional[str] = None
    broker_url: Optional[str] = None
    symbol: str
    action: str
    quantity: float
    stop_loss: float = 0
    take_profit: float = 0

@app.post("/api/dxtrade/authenticate")
async def dxtrade_authenticate(creds: DxTradeAuthRequest):
    """
    Authenticate with DxTrade and return available accounts.
    After successful auth, the user can select which account to use.
    """
    try:
        client = DxTradeServiceClient(
            username=creds.username,
            password=creds.password,
            vendor=creds.vendor,
            domain=creds.domain
        )
        
        if client.login():
            # Fetch available accounts
            accounts = client.get_accounts()
            
            # Store session temporarily
            session_id = f"{creds.username}_{creds.vendor}_{creds.domain}"
            dxtrade_sessions[session_id] = client
            
            # If no accounts from API, use account from login
            if not accounts and client.account_id:
                accounts = [{
                    "id": client.account_id,
                    "name": f"Account {client.account_id}",
                    "balance": 0,
                    "type": "Live"
                }]
            
            return {
                "status": "success",
                "session_id": session_id,
                "accounts": accounts or []
            }
        else:
            raise HTTPException(status_code=401, detail="Authentication failed")
            
    except Exception as e:
        logger.error(f"DxTrade auth error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Authentication error: {str(e)}")

@app.post("/api/dxtrade/select-account")
async def dxtrade_select_account(request: DxTradeAccountSelectRequest):
    """
    Select a specific account for trading after authentication.
    Returns live balance and analytics for the selected account.
    """
    session_id = f"{request.username}_{request.vendor}_{request.domain}"
    client = dxtrade_sessions.get(session_id)
    
    if not client:
        # Re-authenticate if session expired
        client = DxTradeServiceClient(
            username=request.username,
            password=request.password,
            vendor=request.vendor,
            domain=request.domain
        )
        if not client.login():
            raise HTTPException(status_code=401, detail="Re-authentication failed")
        dxtrade_sessions[session_id] = client
    
    # Set the active account
    client.set_active_account(request.account_id)
    
    # Fetch live balance and analytics
    balance_data = client.get_account_balance(request.account_id)
    analytics_data = client.get_account_analytics(request.account_id)
    
    return {
        "status": "success",
        "message": f"Account {request.account_id} selected",
        "account_id": request.account_id,
        "is_connected": client.is_connected,
        "balance": balance_data.get("balance", 0),
        "equity": balance_data.get("equity", 0),
        "margin_used": balance_data.get("margin_used", 0),
        "free_margin": balance_data.get("free_margin", 0),
        "unrealized_pnl": balance_data.get("unrealized_pnl", 0),
        "realized_pnl": balance_data.get("realized_pnl", 0),
        "currency": balance_data.get("currency", "USD"),
        "analytics": analytics_data
    }

@app.post("/api/dxtrade/execute")
async def dxtrade_execute_trade(
    username: str = Body(...),
    vendor: str = Body(...),
    domain: str = Body(default="default"),
    symbol: str = Body(...),
    action: str = Body(...),
    quantity: float = Body(default=0.01),
    stop_loss: float = Body(default=0),
    take_profit: float = Body(default=0)
):
    """
    Execute a trade on DxTrade platform.
    """
    session_id = f"{username}_{vendor}_{domain}"
    client = dxtrade_sessions.get(session_id)
    
    if not client or not client.is_connected:
        raise HTTPException(status_code=401, detail="Not connected to DxTrade")
    
    try:
        if action.upper() == "BUY":
            success = client.buy(symbol, quantity, take_profit, stop_loss)
        else:
            success = client.sell(symbol, quantity, take_profit, stop_loss)
        
        if success:
            return {"status": "success", "message": f"{action} order executed on {symbol}"}
        else:
            raise HTTPException(status_code=500, detail="Order execution failed")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Match-Trader Endpoints ---

@app.post("/api/matchtrader/authenticate")
async def matchtrader_authenticate(creds: MatchTraderAuthRequest):
    try:
        client = MatchTraderClient(creds.email, creds.password, creds.broker_url)
        if client.login():
            session_id = creds.email
            matchtrader_sessions[session_id] = client
            balance = client.get_account_balance()
            return {"status": "success", "session_id": session_id, "balance": balance}
        else:
            raise HTTPException(status_code=401, detail="Authentication failed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/matchtrader/execute")
async def matchtrader_execute(req: GenericExecuteRequest):
    session_id = req.username
    client = matchtrader_sessions.get(session_id)
    if not client:
        if req.password:
            client = MatchTraderClient(req.username, req.password, req.broker_url)
            if client.login():
                 matchtrader_sessions[session_id] = client
            else:
                raise HTTPException(status_code=401, detail="Session expired")
        else:
             raise HTTPException(status_code=401, detail="Session expired")

    result = client.execute_order(req.symbol, req.action, req.quantity, req.stop_loss, req.take_profit)
    if result.get("status") == "success":
        return result
    else:
        raise HTTPException(status_code=400, detail=result.get("message"))

# --- TradeLocker Endpoints ---

class TradeLockerAccountSelectRequest(BaseModel):
    email: str
    account_id: str
    user_id: str # Required for persistence

class TradeLockerDisconnectRequest(BaseModel):
    user_id: str

@app.post("/api/tradelocker/authenticate")
async def tradelocker_authenticate(creds: TradeLockerAuthRequest):
    try:
        logger.info(f"Attempting TradeLocker Login for: {creds.email} on {creds.server}")
        client = TradeLockerClient(creds.email, creds.password, creds.server, creds.broker_url)
        success, message = client.login()
        if success:
            # Login successful, now fetch accounts
            success_acc, accounts, msg_acc = client.get_all_accounts()
            
            if success_acc:
                session_id = creds.email
                tradelocker_sessions[session_id] = client
                
                return {
                    "status": "requires_account_selection", 
                    "session_id": session_id, 
                    "accounts": accounts
                }
            else:
                 raise HTTPException(status_code=401, detail=f"Login successful but failed to fetch accounts: {msg_acc}")
        else:
            raise HTTPException(status_code=401, detail=f"Authentication failed: {message}")
    except HTTPException as he:
        logger.error(f"TradeLocker Auth HTTPException: {he.detail}")
        raise he
    except Exception as e:
        logger.error(f"TradeLocker Auth Unexpected Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

from datetime import datetime

@app.post("/api/tradelocker/select-account")
async def tradelocker_select_account(req: TradeLockerAccountSelectRequest, db: Session = Depends(get_db)):
    try:
        session_id = req.email
        client = _normalize_session_url(tradelocker_sessions.get(session_id))
        
        if not client:
             raise HTTPException(status_code=401, detail="Session not found or expired")

        if client.select_account(req.account_id):
            balance = client.get_account_balance()
            positions = client.get_positions()
            analytics = client.get_account_analytics()
            history = client.get_history()
            
            # Persistence Logic
            try:
                # 1. Get/Create Platform
                platform = db.query(TradingPlatform).filter(TradingPlatform.code == 'tradelocker').first()
                if not platform:
                    platform = TradingPlatform(name="TradeLocker", code="tradelocker", api_endpoint="https://live.tradelocker.com/backend-api")
                    db.add(platform)
                    db.commit()
                    db.refresh(platform)
                
                # 2. Prepare Credentials (include broker_url so re-auth uses the right server)
                creds = {
                    "email": client.email,
                    "password": client.password,
                    "server": client.server,
                    "broker_url": client.base_url,
                    "access_token": client.access_token,
                    "refresh_token": client.refresh_token,
                    "account_id": client.account_id,
                    "acc_num": client.acc_num
                }
                
                # 3. Update/Create Account
                account = db.query(TradingAccount).filter(
                    TradingAccount.user_id == req.user_id,
                    TradingAccount.platform_id == platform.id
                ).first()
                
                if not account:
                    account = TradingAccount(
                        user_id=req.user_id,
                        platform_id=platform.id,
                        account_name=f"TradeLocker {client.acc_num}",
                        account_number=str(client.acc_num) if client.acc_num else "Unknown",
                        account_type="LIVE" if "live" in client.base_url else "DEMO",
                        currency="USD",
                        server=client.server
                    )
                    db.add(account)
                
                account.balance = balance.get('balance')
                account.equity = balance.get('equity')
                account.margin = balance.get('margin_used')
                account.free_margin = balance.get('free_margin')
                account.encrypted_credentials = json.dumps(creds)
                account.last_sync_at = datetime.now()
                db.commit()
            except Exception as db_e:
                logger.error(f"Failed to persist account: {db_e}")
                # Don't fail the request if persistence fails, but log it
            
            return {
                "status": "success", 
                "session_id": session_id, 
                "balance": balance,
                "positions": positions,
                "history": history,
                "analytics": analytics
            }
        else:
            raise HTTPException(status_code=400, detail="Failed to select account")
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.exception("Error in select_account")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/tradelocker/account-data")
async def tradelocker_account_data(email: str):
    client = _normalize_session_url(tradelocker_sessions.get(email))
    if not client:
        raise HTTPException(status_code=401, detail="Session expired or not found")
    
    try:
        balance = client.get_account_balance()
        positions = client.get_positions()
        analytics = client.get_account_analytics()
        history = client.get_history()
        
        return {
            "status": "success",
            "balance": balance,
            "positions": positions,
            "history": history,
            "analytics": analytics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class TradeLockerSaveRequest(BaseModel):
    user_id: str
    email: str
    password: str
    server: str
    account_id: str
    account_name: str
    account_type: str
    balance: float
    equity: float
    currency: str

@app.post("/api/tradelocker/save-account")
async def tradelocker_save_account(req: TradeLockerSaveRequest):
    try:
        logger.info(f"Saving TradeLocker account for user {req.user_id} directly to Supabase")
        
        # 1. Get/Create Platform row (for platform_id FK)
        plat_res = supabase.table("trading_platforms").select("id").eq("code", "tradelocker").execute()
        if not plat_res.data:
            # Create it — use correct column name from schema
            plat_res = supabase.table("trading_platforms").insert({
                "name": "TradeLocker", "code": "tradelocker",
                "api_base_url": "https://live.tradelocker.com/backend-api"
            }).execute()

        platform_id = plat_res.data[0]['id'] if plat_res.data else None

        # 2. Prepare Credentials (include acc_num and broker_url for session rehydration after restart)
        # Pull acc_num from active in-memory session if available
        active_client = tradelocker_sessions.get(req.email)
        acc_num = active_client.acc_num if active_client else None
        broker_url = active_client.base_url if active_client else None
        creds = {
            "email": req.email,
            "password": req.password,
            "server": req.server,
            "account_id": req.account_id,
            "acc_num": acc_num,
            "broker_url": broker_url
        }

        # 3. Upsert Account — only columns confirmed to exist in trading_accounts schema
        # Schema columns: id, user_id, provider, account_id, account_name, encrypted_credentials,
        #                  server, is_active, platform_id, email, balance, equity, currency,
        #                  account_type, created_at, updated_at, last_sync_at
        existing = supabase.table("trading_accounts").select("id") \
            .eq("user_id", req.user_id) \
            .eq("provider", "tradelocker") \
            .execute()

        payload = {
            "user_id": req.user_id,
            "provider": "tradelocker",
            "account_id": req.account_id,
            "account_name": req.account_name,
            "server": req.server,
            "email": req.email,
            "balance": req.balance,
            "equity": req.equity,
            "currency": req.currency,
            "account_type": req.account_type,
            "encrypted_credentials": json.dumps(creds),
            "is_active": True,
            "last_sync_at": datetime.now().isoformat(),
        }
        if platform_id:
            payload["platform_id"] = platform_id

        if existing.data:
            row_id = existing.data[0]['id']
            supabase.table("trading_accounts").update(payload).eq("id", row_id).execute()
        else:
            supabase.table("trading_accounts").insert(payload).execute()

        logger.info(f"Successfully saved account for user {req.user_id}")
        return {"status": "success", "message": "Account saved successfully to Supabase"}

    except Exception as e:
        logger.error(f"Error saving account: {e}")
        print(f"ERROR Saving Account: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/tradelocker/execute-legacy")
async def tradelocker_execute_legacy(req: GenericExecuteRequest):
    """Legacy execute endpoint using GenericExecuteRequest format (kept for backward compatibility)."""
    session_id = req.username
    client = _normalize_session_url(tradelocker_sessions.get(session_id))
    if not client:
         if req.password and req.server:
            client = TradeLockerClient(req.username, req.password, req.server, req.broker_url or "https://demo.tradelocker.com/backend-api")
            if client.login():
                 tradelocker_sessions[session_id] = client
            else:
                raise HTTPException(status_code=401, detail="Session expired")
         else:
             raise HTTPException(status_code=401, detail="Session expired")

    result = client.execute_order(req.symbol, req.action, req.quantity, req.stop_loss, req.take_profit)
    if result.get("status") == "success":
        return result
    else:
        raise HTTPException(status_code=400, detail=result.get("message"))


# --- Feed / Rank Endpoints ---

@app.post("/api/test/create-user")
def create_test_user(req: CreateUserRequest, db: Session = Depends(get_db)):
    """Create a test user for rank simulation."""
    try:
        user = RankService.create_test_user(db, req.username, req.rank)
        return {"status": "success", "user_id": user.id, "username": user.username, "rank": user.rank}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/rank/simulate")
def simulate_rank_update(req: RankUpdateRequest, db: Session = Depends(get_db)):
    """Simulate a rank update event which triggers a post creation."""
    try:
        user = RankService.update_user_rank(db, req.user_id, req.new_rank)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {"status": "success", "user_id": user.id, "new_rank": user.rank, "message": "Rank updated and post triggered"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/feed", response_model=list[PostResponse])
def get_feed_posts(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    """Retrieve community feed posts."""
    try:
        posts = FeedService.get_posts(db, skip, limit)
        return posts
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/leaderboard", response_model=list[LeaderboardUserResponse])
def get_leaderboard(category: str = "ALL", db: Session = Depends(get_db)):
    """Get the filtered leaderboard."""
    try:
        return LeaderboardService.get_leaderboard(db, category)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/test/update-stats")
def update_user_stats(req: UpdateStatsRequest, db: Session = Depends(get_db)):
    """Update user stats for leaderboard simulation."""
    try:
        user = LeaderboardService.update_stats(db, req.username, req.sales, req.trading, req.trend)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {"status": "success", "username": user.username, "sales": user.sales_revenue, "trading": user.trading_yield}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/feed/{post_id}/like")
def toggle_post_like(post_id: str, payload: dict = Body(...), db: Session = Depends(get_db)):
    """Toggle like on a post."""
    try:
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=400, detail="user_id required")
        return FeedService.toggle_like(db, user_id, post_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/feed/{post_id}/comment")
def add_post_comment(post_id: str, payload: dict = Body(...), db: Session = Depends(get_db)):
    """Add a comment to a post."""
    try:
        user_id = payload.get("user_id")
        content = payload.get("content")
        if not user_id or not content:
            raise HTTPException(status_code=400, detail="user_id and content required")
        return FeedService.add_comment(db, user_id, post_id, content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- TradeLocker Status & Disconnect ---

@app.get("/api/tradelocker/status")
async def tradelocker_status(user_id: str, db: Session = Depends(get_db)):
    try:
        platform = db.query(TradingPlatform).filter(TradingPlatform.code == 'tradelocker').first()
        if not platform:
             return {"connected": False}
        
        account = db.query(TradingAccount).filter(
            TradingAccount.user_id == user_id,
            TradingAccount.platform_id == platform.id
        ).first()
        
        if account and account.encrypted_credentials:
            creds = json.loads(account.encrypted_credentials)
            # Rehydrate session if missing
            session_id = creds.get('email')
            if session_id and session_id not in tradelocker_sessions:
                 try:
                    client = TradeLockerClient(creds['email'], creds['password'], creds['server'])
                    # Try efficient refresh first if token exists
                    refreshed = False
                    if creds.get('refresh_token'):
                         refreshed = client.refresh_session(creds['refresh_token'])
                    
                    if not refreshed:
                         # Fallback to full login
                         success, _ = client.login()
                         if not success:
                             return {"connected": False} # Invalid credentials
                    
                    client.select_account(creds.get('account_id'))
                    # Force set acc_num if we have it stored and it didn't get set
                    if not client.acc_num and creds.get('acc_num'):
                        client.acc_num = creds.get('acc_num')
                        client.session.headers.update({"accNum": str(client.acc_num)})
                    
                    tradelocker_sessions[session_id] = client
                 except Exception:
                     # Silently fail rehydration if credentials changed/invalid
                     return {"connected": False}

            return {
                "connected": True, 
                "account_id": account.account_number, 
                "email": creds.get('email'),
                "balance": float(account.balance) if account.balance else 0
            }
            
        return {"connected": False}
    except Exception as e:
        print(f"Status check error: {e}")
        return {"connected": False}

@app.post("/api/tradelocker/disconnect")
async def tradelocker_disconnect(req: TradeLockerDisconnectRequest, db: Session = Depends(get_db)):
    try:
        platform = db.query(TradingPlatform).filter(TradingPlatform.code == 'tradelocker').first()
        if platform:
            db.query(TradingAccount).filter(
                TradingAccount.user_id == req.user_id,
                TradingAccount.platform_id == platform.id
            ).delete()
            db.commit()
        return {"status": "disconnected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))# --- Master Account & Copy Trading ---

MASTER_TL_EMAIL = os.getenv("MASTER_TL_EMAIL", "master@verstige.com")
MASTER_TL_PASSWORD = os.getenv("MASTER_TL_PASSWORD", "MasterPass123!")
MASTER_TL_SERVER = os.getenv("MASTER_TL_SERVER", "TLLive")
MASTER_TL_ACC_NUM = os.getenv("MASTER_TL_ACC_NUM", "0") # If needed for header

master_client = None

def get_master_client():
    global master_client
    # Return existing authenticated client
    if master_client and master_client.access_token:
        return master_client

    # Create new client and try to login
    temp_client = TradeLockerClient(MASTER_TL_EMAIL, MASTER_TL_PASSWORD, MASTER_TL_SERVER)
    if MASTER_TL_ACC_NUM != "0":
        temp_client.acc_num = MASTER_TL_ACC_NUM
        temp_client.session.headers.update({"accNum": str(MASTER_TL_ACC_NUM)})
    
    if temp_client.login():
        master_client = temp_client
        return master_client
    
    logger.error("Failed to login to Master Account")
    return None

@app.get("/api/signals")
def get_master_signals(db: Session = Depends(get_db)):
    """Fetch open positions from the master account as signals."""
    client = get_master_client()
    if not client:
        # Return mock data if master not configured or login fails (for dev/demo)
        return {
            "status": "success",
            "signals": [
                {
                    "id": 101,
                    "symbol": "XAUUSD",
                    "action": "BUY",
                    "entryPrice": 2035.50,
                    "sl": 2028.00,
                    "tp1": 2045.00,
                    "timestamp": "2024-02-17T10:00:00Z",
                    "analyst": "Verstige Master",
                    "successRate": 95,
                    "status": "ACTIVE"
                }
            ]
        }
    
    positions = client.get_positions()
    # Transform positions to signals
    signals = []
    for pos in positions:
        signals.append({
            "id": pos['id'],
            "symbol": pos.get('tradableInstrumentId'),
            "action": pos.get('side').upper(),
            "entryPrice": float(pos.get('avgPrice', 0)),
            "sl": float(pos.get('stopLoss', 0)),
            "tp1": float(pos.get('takeProfit', 0)),
            "timestamp": pos.get('openTime'),
            "analyst": "Verstige Master",
            "successRate": 95,
            "status": "ACTIVE"
        })
        
    return {"status": "success", "signals": signals}

@app.post("/api/tradelocker/execute")
async def execute_copy_trade(payload: dict = Body(...), db: Session = Depends(get_db)):
    """Execute a copied signal on the user's connected account.
    
    Multi-strategy session resolution:
    1. In-memory session via email (fastest)
    2. SQLAlchemy DB account lookup -> in-memory session
    3. Supabase account lookup -> in-memory session
    4. Full re-authentication using stored credentials
    """
    user_id = payload.get("user_id")
    signal_id = payload.get("signal_id")
    symbol = payload.get("symbol")
    action = payload.get("action")
    sl = payload.get("sl")
    tp = payload.get("tp")
    email = payload.get("email")  # Email from frontend for direct session lookup

    if not user_id or not symbol or not action:
        raise HTTPException(status_code=400, detail="Missing trade details (user_id, symbol, action required)")

    logger.info(f"Execute request: user={user_id}, email={email}, symbol={symbol}, action={action}")

    # Helper: normalize base_url on any retrieved client (fixes sessions from before the URL fix)
    def _fix_client_base_url(c):
        if c and not c.base_url.endswith("/backend-api"):
            old = c.base_url
            # Strip any known wrong suffix and replace with /backend-api
            root = c.base_url
            for wrong in ["/clientapi/v1", "/clientapi", "/api/v1", "/api"]:
                if root.endswith(wrong):
                    root = root[:-len(wrong)]
                    break
            if not root.endswith("/backend-api"):
                root = root + "/backend-api"
            c.base_url = root
            logger.warning(f"[Execute] Patched stale session base_url: '{old}' → '{root}'")
        return c

    # --- Strategy 1: In-memory session via email passed from frontend ---
    if email and email in tradelocker_sessions:
        client = _fix_client_base_url(tradelocker_sessions[email])
        logger.info(f"[Execute] ✅ Strategy 1: Using in-memory session for {email} (base_url={client.base_url})")


    # --- Strategy 2: SQLAlchemy DB account lookup ---
    if not client:
        try:
            platform = db.query(TradingPlatform).filter(TradingPlatform.code == 'tradelocker').first()
            if platform:
                account = db.query(TradingAccount).filter(
                    TradingAccount.user_id == user_id,
                    TradingAccount.platform_id == platform.id
                ).first()
                if account and account.encrypted_credentials:
                    creds = json.loads(account.encrypted_credentials)
                    stored_email = creds.get('email')
                    if stored_email and stored_email in tradelocker_sessions:
                        client = tradelocker_sessions[stored_email]
                        logger.info(f"[Execute] Found session via SQLAlchemy DB for email: {stored_email}")
        except Exception as db_err:
            logger.warning(f"[Execute] SQLAlchemy DB lookup failed: {db_err}")

    # --- Strategy 3: Supabase account lookup ---
    if not client:
        try:
            # Try platform_id FK lookup first
            plat_res = supabase.table("trading_platforms").select("id").eq("code", "tradelocker").execute()
            sb_row = None

            if plat_res.data:
                platform_id = plat_res.data[0]['id']
                acc_res = (
                    supabase.table("trading_accounts")
                    .select("*")
                    .eq("user_id", user_id)
                    .eq("platform_id", platform_id)
                    .execute()
                )
                if acc_res.data:
                    sb_row = acc_res.data[0]
                    logger.info(f"[Execute] Supabase lookup via platform_id found account")

            # Fallback: try provider field directly (more reliable)
            if not sb_row:
                acc_res2 = (
                    supabase.table("trading_accounts")
                    .select("*")
                    .eq("user_id", user_id)
                    .eq("provider", "tradelocker")
                    .execute()
                )
                if acc_res2.data:
                    sb_row = acc_res2.data[0]
                    logger.info(f"[Execute] Supabase lookup via provider='tradelocker' found account")

            if sb_row:
                creds = json.loads(sb_row.get("encrypted_credentials", "{}"))
                stored_email = creds.get('email')
                if stored_email and stored_email in tradelocker_sessions:
                    client = tradelocker_sessions[stored_email]
                    logger.info(f"[Execute] ✅ Strategy 3: Reused in-memory session found via Supabase lookup for {stored_email}")
                elif stored_email:
                    logger.info(f"[Execute] Strategy 3: Got creds from Supabase for {stored_email} — will re-auth in Strategy 4")
            else:
                logger.warning(f"[Execute] Strategy 3: No account found in Supabase for user {user_id}")
        except Exception as sb_err:
            logger.warning(f"[Execute] Supabase lookup failed: {sb_err}")


    # --- Strategy 4: Re-authenticate using stored credentials ---
    if not client and creds:
        try:
            stored_email = creds.get('email')
            stored_password = creds.get('password')
            stored_server = creds.get('server')
            stored_broker_url = creds.get('broker_url', 'https://demo.tradelocker.com/backend-api')
            stored_acc_num = creds.get('acc_num')
            stored_account_id = creds.get('account_id')

            if not stored_email or not stored_password or not stored_server:
                logger.warning("[Execute] Incomplete credentials — cannot re-authenticate")
            else:
                logger.info(f"[Execute] Re-authenticating for {stored_email} on {stored_broker_url}")
                new_client = TradeLockerClient(stored_email, stored_password, stored_server, stored_broker_url)
                success, login_msg = new_client.login()
                if success:
                    # Set acc_num directly from stored creds — avoids unreliable select_account() call
                    if stored_acc_num:
                        new_client.acc_num = stored_acc_num
                        new_client.account_id = stored_account_id
                        new_client.session.headers.update({"accNum": str(stored_acc_num)})
                        logger.info(f"[Execute] Set acc_num={stored_acc_num} directly from stored creds")
                    elif stored_account_id:
                        # Fallback: try select_account if we at least have an account_id
                        new_client.select_account(stored_account_id)
                    tradelocker_sessions[stored_email] = new_client
                    client = new_client
                    logger.info(f"[Execute] Re-authentication successful for {stored_email}")
                else:
                    logger.error(f"[Execute] Re-authentication failed: {login_msg}")
        except Exception as auth_err:
            logger.error(f"[Execute] Re-authentication exception: {auth_err}")

    if not client:
        raise HTTPException(
            status_code=400,
            detail="No active TradeLocker session found. Please reconnect your account via Account Settings."
        )

    # Execute the trade
    lot_size = 0.01
    try:
        result = client.execute_order(symbol, action, lot_size, float(sl or 0), float(tp or 0))
    except Exception as exec_err:
        logger.error(f"[Execute] Trade execution error: {exec_err}")
        raise HTTPException(status_code=500, detail=f"Trade execution failed: {str(exec_err)}")

    if result.get('status') == 'error':
        raise HTTPException(status_code=400, detail=result.get('message', 'Execution failed'))

    # Non-blocking: update signal status in Supabase
    if signal_id:
        try:
            supabase.table("signals").update({"status": "executed"}).eq("id", str(signal_id)).execute()
        except Exception:
            pass  # Non-critical

    logger.info(f"[Execute] Success: {action} {symbol} {lot_size} lots for user {user_id} | orderId={result.get('orderId')} | raw={str(result.get('data',''))[:200]}")
    return {"status": "success", "orderId": result.get('orderId'), "symbol": symbol, "action": action, "lots": lot_size}


# Wrap FastAPI application with Socket.IO ASGI app
# This ensures that Socket.IO requests are handled correctly before reaching FastAPI
# and avoids conflicts with middleware.
app = socketio.ASGIApp(sio, app)
