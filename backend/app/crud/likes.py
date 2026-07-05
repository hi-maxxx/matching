from sqlalchemy.orm import Session  # type: ignore
from app.models.likes import Like
from app.schemas.likes import LikeCreate

def get_likes(db: Session, skip: int = 0, limit: int = 100):
    """いいね一覧取得"""
    return db.query(Like).offset(skip).limit(limit).all()

def get_likes_sent_by(db: Session, user_id: int):
    """指定したユーザーが送ったいいね一覧を取得"""
    return db.query(Like).filter(Like.from_user_id == user_id).all()

def create_like(db: Session, like: LikeCreate):
    db_like = Like(**like.model_dump())
    db.add(db_like)
    db.commit()
    db.refresh(db_like)
    return db_like

def delete_like(db: Session, like_id: int):
    """いいね削除"""
    db_like = db.query(Like).filter(Like.id == like_id).first()
    if db_like:
        db.delete(db_like)
        db.commit()
    return db_like
