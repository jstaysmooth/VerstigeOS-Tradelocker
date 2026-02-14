from fastapi import FastAPI, HTTPException, Body, Depends
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
import os
import sys

from backend.internal import SocketIOServerClient
from backend.handlers import RequestHandler
from backend.models import MTClientParams, CreateOrderRequest, SideType, OrderType
from backend.settings import settings
from backend.dxtrade import DxTradeClient, CopierEngine
from backend.services.matchtrader_client import MatchTraderClient
from backend.services.tradelocker_client import TradeLockerClient
from backend.meta_api_service import meta_api_service

# Initialize Logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("VerstigeBackend")

# Initialize FastAPI
app = FastAPI()

# Add CORS middleware to allow frontend requests
# Custom CORS Middleware to skip /socket.io (handled by engineio)
class SmartCORSMiddleware(CORSMiddleware):
    async def __call__(self, scope, receive, send):
        if scope["type"] == "http" and scope.get("path", "").startswith("/socket.io"):
            await self.app(scope, receive, send)
            return
        await super().__call__(scope, receive, send)

app.add_middleware(
    SmartCORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
sio: Optional[socketio.AsyncServer] = None
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
    sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins=["http://localhost:3000"])
    sio_app = socketio.ASGIApp(sio) # Default socketio_path='socket.io'
    app.mount("/socket.io", sio_app)

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
async def internal_signal(payload: dict):
    """
    Internal endpoint called by the MetaApi Bridge process to broadcast signals or results.
    Payload structure: {"type": "event_name", "data": {...}}
    """
    logger.info(f"Internal Signal Received: {payload}")
    
    # Extract event type and data, with fallback for legacy raw signal data
    event_type = payload.get("type", "new_signal")
    event_data = payload.get("data", payload) 
    
    logger.info(f"Broadcasting event: {event_type} with data: {event_data}")

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

@app.post("/api/tradelocker/authenticate")
async def tradelocker_authenticate(creds: TradeLockerAuthRequest):
    try:
        client = TradeLockerClient(creds.email, creds.password, creds.server, creds.broker_url)
        if client.login():
            session_id = creds.email
            tradelocker_sessions[session_id] = client
            balance = client.get_account_balance()
            return {"status": "success", "session_id": session_id, "balance": balance}
        else:
            raise HTTPException(status_code=401, detail="Authentication failed")
    except Exception as e:
         raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/tradelocker/execute")
async def tradelocker_execute(req: GenericExecuteRequest):
    session_id = req.username
    client = tradelocker_sessions.get(session_id)
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

