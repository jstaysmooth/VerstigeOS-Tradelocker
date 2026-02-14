from sqlalchemy.orm import Session
from backend.models.db_models import User
from backend.services.feed_service import FeedService
from typing import Optional

class RankService:
    @staticmethod
    def update_user_rank(db: Session, user_id: str, new_rank: str) -> Optional[User]:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return None
        
        old_rank = user.rank
        if old_rank != new_rank:
            user.rank = new_rank
            db.commit()
            db.refresh(user)
            
            # Trigger Post
            # Meta data for frontend "from -> to" visual
            meta = {
                "from": old_rank,
                "to": new_rank,
                "color": "#ffd700" # Default gold color, logic can be enhanced later
            }
            
            FeedService.create_post(
                db=db,
                user_id=user_id,
                type="rank_achievement",
                content=f"Just achieved {new_rank} rank! \N{PARTY POPPER}",
                meta_data=meta
            )
            
        return user

    @staticmethod
    def create_test_user(db: Session, username: str, rank: str = "Associate") -> User:
        # Check if exists
        state_user = db.query(User).filter(User.username == username).first()
        if state_user:
            return state_user
            
        new_user = User(username=username, rank=rank)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user

    @staticmethod
    def check_rank_update(db: Session, user: User) -> Optional[User]:
        # Defined Thresholds (Sales, Trading)
        ranks = [
            ("Executive", 100000.0, 50000.0),
            ("Director", 50000.0, 25000.0),
            ("Manager", 10000.0, 5000.0),
            ("Associate", 0.0, 0.0)
        ]
        
        current_sales = float(user.sales_revenue or 0)
        current_trading = float(user.trading_yield or 0)
        
        new_rank = "Associate"
        for r_name, s_thresh, t_thresh in ranks:
            if current_sales >= s_thresh or current_trading >= t_thresh:
                new_rank = r_name
                break
        
        if new_rank != user.rank:
            # Re-use update_user_rank which handles the post creation
            return RankService.update_user_rank(db, user.id, new_rank)
            
        return user
