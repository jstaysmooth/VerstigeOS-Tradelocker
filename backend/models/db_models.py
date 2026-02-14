
from sqlalchemy import create_engine, Column, String, Boolean, DateTime, DECIMAL, ForeignKey, Text, UniqueConstraint, Integer 
from sqlalchemy.types import TypeDecorator, CHAR
import uuid

# Fallback for UUID in SQLite
class GUID(TypeDecorator):
    impl = CHAR
    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            from sqlalchemy.dialects.postgresql import UUID
            return dialect.type_descriptor(UUID(as_uuid=True))
        else:
            return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        elif dialect.name == 'postgresql':
            return str(value)
        else:
            if not isinstance(value, uuid.UUID):
                return str(uuid.UUID(value))
            return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        else:
            if not isinstance(value, uuid.UUID):
                return uuid.UUID(value)
            return value
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime

Base = declarative_base()

class TradingPlatform(Base):
    __tablename__ = 'trading_platforms'
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(Text, nullable=False)
    code = Column(Text, unique=True, nullable=False)
    api_endpoint = Column(Text)
    logo_url = Column(Text)
    supports_copy_trading = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=datetime.now)

class TradingAccount(Base):
    __tablename__ = 'trading_accounts'
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    # user_id should be foreign key to users table, explicitly defined if User model exists
    # user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    user_id = Column(Text, nullable=False) # Simplified for MVP, assuming auth.users ID is string/uuid
    platform_id = Column(String(36), ForeignKey('trading_platforms.id', ondelete='RESTRICT'), nullable=False)
    account_name = Column(Text, nullable=False)
    account_number = Column(Text, nullable=False)
    account_type = Column(Text, nullable=False) # 'master' or 'slave'
    is_active = Column(Boolean, default=True)
    encrypted_credentials = Column(Text)
    balance = Column(DECIMAL(15, 2))
    equity = Column(DECIMAL(15, 2))
    margin = Column(DECIMAL(15, 2))
    free_margin = Column(DECIMAL(15, 2))
    currency = Column(Text, default='USD')
    server = Column(Text)
    last_sync_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    updated_at = Column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)
    
    platform = relationship("TradingPlatform")
    
    __table_args__ = (
        UniqueConstraint('user_id', 'platform_id', 'account_number', name='unique_account_per_user_platform'),
    )

class User(Base):
    __tablename__ = 'users'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(Text, unique=True, nullable=False)
    email = Column(Text, unique=True, nullable=True) # Optional for now
    rank = Column(Text, default="Associate")
    avatar_url = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.now)

    # Leaderboard Metrics
    sales_revenue = Column(DECIMAL(18, 2), default=0)
    trading_yield = Column(DECIMAL(18, 2), default=0)
    roles = Column(Text, default='["Member"]') # JSON string
    trend = Column(Text, default="+0%")

    posts = relationship("Post", back_populates="user", cascade="all, delete-orphan")


class Post(Base):
    __tablename__ = 'posts'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    type = Column(Text, nullable=False) # 'rank_achievement', 'trade', etc.
    content = Column(Text, nullable=True)
    meta_data = Column(Text, nullable=True) # JSON string
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    
    likes_count = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)

    user = relationship("User", back_populates="posts")
    likes = relationship("PostLike", back_populates="post", cascade="all, delete-orphan")
    comments = relationship("PostComment", back_populates="post", cascade="all, delete-orphan")

class PostLike(Base):
    __tablename__ = 'post_likes'
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    post_id = Column(String(36), ForeignKey('posts.id', ondelete='CASCADE'), nullable=False)
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    
    post = relationship("Post", back_populates="likes")
    user = relationship("User")

class PostComment(Base):
    __tablename__ = 'post_comments'
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    post_id = Column(String(36), ForeignKey('posts.id', ondelete='CASCADE'), nullable=False)
    user_id = Column(String(36), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    
    post = relationship("Post", back_populates="comments")
    user = relationship("User")
