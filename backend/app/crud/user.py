from sqlalchemy.orm import Session # type: ignore
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import hash_password

def get_users(db: Session, skip: int = 0, limit: int = 100):
    """ユーザー一覧取得"""
    return db.query(User).filter(User.is_active == True).offset(skip).limit(limit).all()

def get_user(db: Session, user_id: int):
    """ユーザー1件取得"""
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    """メールアドレスでユーザーを検索（ログイン時に使用）"""
    return db.query(User).filter(User.email == email).first()

#ここAI修正
def create_user(db: Session, user: UserCreate):
    """ユーザー作成"""
    db_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hash_password(user.password),
    )
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
    db_user.personality = user.personality   # ← 追加
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

#delete_userを使わず、is_activeを切り替える関数を追加します。
def deactivate_user(db: Session, user_id: int):
    """ユーザーを無効化（論理削除）"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        db_user.is_active = False
        db.commit()
        db.refresh(db_user)
    return db_user

def activate_user(db: Session, user_id: int):
    """ユーザーを有効化"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        db_user.is_active = True
        db.commit()
        db.refresh(db_user)
    return db_user
