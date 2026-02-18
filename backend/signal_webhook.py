
import os, re, hmac, hashlib, uuid
from datetime import datetime, timezone
from typing import Optional
import httpx
from fastapi import FastAPI, Request, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv


load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
app = FastAPI(title="Verstige Signal Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "*")],
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_KEY"), # Handling both possible names
)

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_WEBHOOK_SECRET = os.getenv("TELEGRAM_WEBHOOK_SECRET")
API_SECRET_KEY = os.getenv("VERSTIGE_API_SECRET")

# ── Models ──────────────────────────────────────────────
class SignalPayload(BaseModel):
    symbol: str
    direction: str                  # "BUY" or "SELL"
    entry: float
    stop_loss: float
    take_profit: float
    risk_percent: float = 1.0
    timeframe: Optional[str] = "H1"
    notes: Optional[str] = None
    source: Optional[str] = "api"

class SignalResponse(BaseModel):
    success: bool
    signal_id: str
    message: str

# ── Auth Dependency ──────────────────────────────────────
def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != API_SECRET_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return x_api_key

# ── Signal Publisher ─────────────────────────────────────
async def publish_signal(signal: SignalPayload) -> str:
    signal_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    if signal.direction.upper() == "BUY":
        risk = signal.entry - signal.stop_loss
        reward = signal.take_profit - signal.entry
    else:
        risk = signal.stop_loss - signal.entry
        reward = signal.entry - signal.take_profit
    
    rr_ratio = round(reward / risk, 2) if risk > 0 else 0
    
    record = {
        "id": signal_id, 
        "symbol": signal.symbol.upper(),
        "direction": signal.direction.upper(), 
        "entry": signal.entry,
        "stop_loss": signal.stop_loss, 
        "take_profit": signal.take_profit,
        "risk_percent": signal.risk_percent, 
        "rr_ratio": rr_ratio,
        "timeframe": signal.timeframe, 
        "notes": signal.notes,
        "source": signal.source, 
        "status": "pending", 
        "created_at": now,
    }
    
    result = supabase.table("signals").insert(record).execute()
    if result.data:
        return signal_id
    raise HTTPException(status_code=500, detail="Failed to write signal")

# ── Telegram Parser ──────────────────────────────────────
def parse_telegram_signal(text: str) -> Optional[SignalPayload]:
    """
    Accepts messages in this format:
      BUY XAUUSD
      Entry: 2345.50
      SL: 2330.00
      TP: 2375.00
      Risk: 1%
      TF: H1
      Notes: Optional note
    """
    text = text.strip()
    direction = "BUY" if re.search(r"\bBUY\b", text, re.I) else None
    if not direction:
        direction = "SELL" if re.search(r"\bSELL\b", text, re.I) else None
    if not direction: return None
    
    fallback = re.search(r"(?:BUY|SELL)\s+(\S+)", text, re.I)
    symbol = fallback.group(1).upper() if fallback else None
    if not symbol: return None
    
    def extract(pat): 
        m = re.search(pat, text, re.I)
        return float(m.group(1)) if m else None
        
    entry = extract(r"entry[:\s]+([0-9]+(?:\.[0-9]+)?)")
    sl    = extract(r"sl[:\s]+([0-9]+(?:\.[0-9]+)?)")
    tp    = extract(r"tp[:\s]+([0-9]+(?:\.[0-9]+)?)")
    risk  = extract(r"risk[:\s]+([0-9]+(?:\.[0-9]+)?)%?") or 1.0
    tf_m  = re.search(r"tf[:\s]+(M\d+|H\d+|D\d?|W\d?)", text, re.I)
    notes_m = re.search(r"notes?[:\s]+(.+)", text, re.I)
    
    if not all([entry, sl, tp]): return None
    
    return SignalPayload(
        symbol=symbol, direction=direction, entry=entry,
        stop_loss=sl, take_profit=tp, risk_percent=risk,
        timeframe=tf_m.group(1).upper() if tf_m else None,
        notes=notes_m.group(1).strip() if notes_m else None,
        source="telegram",
    )

# ── Routes ───────────────────────────────────────────────
@app.get("/health")
def health(): return {"status": "ok"}

@app.post("/api/signals", response_model=SignalResponse)
async def post_signal_direct(
    payload: SignalPayload,
    _: str = Depends(verify_api_key),
):
    signal_id = await publish_signal(payload)
    return SignalResponse(success=True, signal_id=signal_id,
        message=f"Signal published: {payload.direction} {payload.symbol}")

@app.post("/api/telegram/webhook")
async def telegram_webhook(request: Request):
    if TELEGRAM_WEBHOOK_SECRET:
        hdr = request.headers.get("X-Telegram-Bot-Api-Secret-Token")
        if hdr != TELEGRAM_WEBHOOK_SECRET:
            raise HTTPException(status_code=403, detail="Invalid secret")
    
    body = await request.json()
    message = body.get("message") or body.get("channel_post")
    if not message: return {"ok": True}
    
    text = message.get("text", "")
    chat = message.get("chat")
    if not chat: return {"ok": True}
    chat_id = chat.get("id")
    
    signal = parse_telegram_signal(text)
    if signal:
        signal_id = await publish_signal(signal)
        await send_telegram_message(chat_id,
            f"Signal received!\n{signal.direction} {signal.symbol}\n"
            f"Entry: {signal.entry} | SL: {signal.stop_loss} | TP: {signal.take_profit}")
    return {"ok": True}

async def send_telegram_message(chat_id: int, text: str):
    if not TELEGRAM_BOT_TOKEN:
        print("TELEGRAM_BOT_TOKEN not set, skipping message send")
        return
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    async with httpx.AsyncClient() as client:
        await client.post(url, json={"chat_id": chat_id, "text": text})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("signal_webhook:app", host="0.0.0.0", port=8001, reload=True)
