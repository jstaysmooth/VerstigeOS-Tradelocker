from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime


class UserResponse(BaseModel):
    id: str
    username: str
    rank: str
    avatar_url: Optional[str]
    
    class Config:
        orm_mode = True

class PostResponse(BaseModel):
    id: str
    user_id: str
    type: str
    
    # Nested user details
    user: UserResponse
    
    content: Optional[str]
    meta_data: Optional[str] # JSON string
    created_at: datetime
    
    likes_count: int = 0
    comments_count: int = 0
    
    class Config:
        orm_mode = True # Allow Pydantic to read from SQLAlchemy object

class CreateUserRequest(BaseModel):
    username: str
    rank: str = "Associate"

class RankUpdateRequest(BaseModel):
    user_id: str
    new_rank: str

class LeaderboardUserResponse(UserResponse):
    sales_revenue: float
    trading_yield: float
    roles: str # JSON string
    trend: str

class UpdateStatsRequest(BaseModel):
    username: str
    sales: Optional[float] = None
    trading: Optional[float] = None
    trend: Optional[str] = None
