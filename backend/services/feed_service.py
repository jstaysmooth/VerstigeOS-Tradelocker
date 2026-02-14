from sqlalchemy.orm import Session, joinedload
from backend.models.db_models import Post, User, PostLike, PostComment
from typing import Optional, List
import json
from datetime import datetime

class FeedService:
    @staticmethod
    def create_post(db: Session, user_id: str, type: str, content: str = None, meta_data: dict = None) -> Post:
        meta_json = json.dumps(meta_data) if meta_data else None
        
        # Verify user exists? Or rely on FK constraint.
        # Ideally we should verify, but for MVP let's trust caller or DB error.
        
        new_post = Post(
            user_id=user_id,
            type=type,
            content=content,
            meta_data=meta_json,
            created_at=datetime.now()
        )
        db.add(new_post)
        db.commit()
        db.refresh(new_post)
        return new_post

    @staticmethod
    def get_posts(db: Session, skip: int = 0, limit: int = 50) -> List[Post]:
        return db.query(Post).options(joinedload(Post.user)).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def toggle_like(db: Session, user_id: str, post_id: str) -> dict:
        existing = db.query(PostLike).filter(PostLike.user_id == user_id, PostLike.post_id == post_id).first()
        post = db.query(Post).filter(Post.id == post_id).first()
        if not post:
            return {"status": "error", "message": "Post not found"}
            
        if existing:
            db.delete(existing)
            post.likes_count = max(0, (post.likes_count or 0) - 1)
            liked = False
        else:
            new_like = PostLike(user_id=user_id, post_id=post_id)
            db.add(new_like)
            post.likes_count = (post.likes_count or 0) + 1
            liked = True
            
        db.commit()
        db.refresh(post)
        return {"status": "success", "liked": liked, "likes_count": post.likes_count}

    @staticmethod
    def add_comment(db: Session, user_id: str, post_id: str, content: str) -> dict:
        post = db.query(Post).filter(Post.id == post_id).first()
        if not post:
            return {"status": "error", "message": "Post not found"}
            
        new_comment = PostComment(user_id=user_id, post_id=post_id, content=content)
        db.add(new_comment)
        post.comments_count = (post.comments_count or 0) + 1
        
        db.commit()
        db.refresh(post)
        return {
            "status": "success", 
            "comments_count": post.comments_count,
            "comment": {
                "id": new_comment.id,
                "user_id": user_id,
                "content": content,
                "created_at": new_comment.created_at
            }
        }
