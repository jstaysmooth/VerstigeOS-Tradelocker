from sqlalchemy.orm import Session
from backend.models.db_models import User
from decimal import Decimal
import json

class LeaderboardService:
    @staticmethod
    def get_leaderboard(db: Session, category: str = "ALL", limit: int = 10):
        users = db.query(User).all()
        
        filtered = []
        for u in users:
            try:
                u_roles = json.loads(u.roles) if u.roles else []
            except:
                u_roles = []
                
            if category == "ALL":
                filtered.append(u)
            elif category == "SALES" and "Sales" in u_roles:
                filtered.append(u)
            elif category == "TRADING" and "Trading" in u_roles:
                filtered.append(u)
            elif category == "DUAL" and "Sales" in u_roles and "Trading" in u_roles:
                filtered.append(u)
                
        # Sort by total impact
        def get_total(u):
            return (u.sales_revenue or 0) + (u.trading_yield or 0)
            
        filtered.sort(key=get_total, reverse=True)
        
        return filtered[:limit]

    @staticmethod
    def update_stats(db: Session, username: str, sales: float = None, trading: float = None, trend: str = None):
        user = db.query(User).filter(User.username == username).first()
        if not user:
            return None
            
        if sales is not None:
            user.sales_revenue = Decimal(str(sales))
        if trading is not None:
            user.trading_yield = Decimal(str(trading))
        if trend:
            user.trend = trend
            
        # Update roles based on stats logic (simple auto-tagging)
        try:
            current_roles = json.loads(user.roles) if user.roles else []
        except:
            current_roles = []
            
        new_roles = set(current_roles)
        # Ensure 'Member' is always there? Or cleaner roles.
        
        if (user.sales_revenue or 0) > 0:
            new_roles.add("Sales")
        if (user.trading_yield or 0) > 0:
            new_roles.add("Trading")
            
        user.roles = json.dumps(list(new_roles))
        
        # Check for rank promotion
        from backend.services.rank_service import RankService
        RankService.check_rank_update(db, user)
            
        db.commit()
        db.refresh(user)
        return user
