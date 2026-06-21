from sqlalchemy.orm import Session # type: ignore
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate

def get_users(db: Session, skip: int = 0, limit: int = 100):
    """ユーザー一覧取得"""
    return db.query(User).offset(skip).limit(limit).all()

def get_user(db: Session, user_id: int):
    """ユーザー1件取得"""
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user: UserCreate):
    """ユーザー作成"""
    db_user = User(name=user.name, email=user.email,phone="テスト",password="テスト",penname="テスト",introduction="テスト",personality="テスト",work="テスト")
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user: UserUpdate):
    """ユーザー更新（PUT: 全項目を一括更新）"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        return None
    db_user.name = user.name
    db_user.email = user.email
    db_user.birth_date = user.birth_date
    db_user.bio = user.bio
    db_user.avatar_url = user.avatar_url
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    """ユーザー削除"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user
