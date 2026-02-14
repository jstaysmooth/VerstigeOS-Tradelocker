
from sqlalchemy.orm import Session
from backend.models.db_models import TradingPlatform, TradingAccount
import uuid
import json

def seed_platforms(db: Session):
    platforms = [
        # Existing from schema
        {"name": "cTrader", "code": "ctrader", "api_endpoint": "https://api.ctrader.com", "supports_copy_trading": True},
        {"name": "MetaTrader 4", "code": "mt4", "api_endpoint": None, "supports_copy_trading": True},
        {"name": "MetaTrader 5", "code": "mt5", "api_endpoint": None, "supports_copy_trading": True},
        {"name": "TradingView", "code": "tradingview", "api_endpoint": "https://api.tradingview.com", "supports_copy_trading": False},
        {"name": "Interactive Brokers", "code": "ib", "api_endpoint": "https://api.interactivebrokers.com", "supports_copy_trading": True},
        
        # New Integrations
        {"name": "DxTrade", "code": "dxtrade", "api_endpoint": "https://dxtrade.com/api", "supports_copy_trading": True},
        {"name": "Match-Trader", "code": "matchtrader", "api_endpoint": "https://match-trader.com/api", "supports_copy_trading": True},
        {"name": "TradeLocker", "code": "tradelocker", "api_endpoint": "https://tradelocker.com/api", "supports_copy_trading": True},
    ]

    for p_data in platforms:
        existing = db.query(TradingPlatform).filter(TradingPlatform.code == p_data["code"]).first()
        if not existing:
            platform = TradingPlatform(
                id=str(uuid.uuid4()),
                name=p_data["name"],
                code=p_data["code"],
                api_endpoint=p_data["api_endpoint"],
                supports_copy_trading=p_data["supports_copy_trading"]
            )
            db.add(platform)
            print(f"Added platform: {p_data['name']}")
    
    db.commit()

if __name__ == "__main__":
    from backend.database import SessionLocal, init_db
    init_db()
    db = SessionLocal()
    try:
        seed_platforms(db)
        print("Database seeding completed.")
    finally:
        db.close()
