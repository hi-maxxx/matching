from sqlalchemy.orm import Session # type: ignore
from app.models.matching import Matching
from app.schemas.matching import MatchingCreate

def get_matchings(db: Session, skip: int = 0, limit: int = 100):
    """ユーザー一覧取得"""
    return db.query(Matching).offset(skip).limit(limit).all()

def get_matching(db: Session, matching_id: int):#ここが間違っていた引数ちがい（user_id)になっていた
    """ユーザー1件取得"""
    return db.query(Matching).filter(Matching.id == matching_id).first()#ここがわからん→引数違い

def create_matching(db: Session, matching: MatchingCreate):
    db_matching = Matching(**matching.model_dump())
    db.add(db_matching)
    db.commit()
    db.refresh(db_matching)  # ← created_atをDBから再取得
    return db_matching

def delete_matching(db: Session, matching_id: int):
    """ユーザー削除"""
    db_matching = db.query(Matching).filter(Matching.id == matching_id).first()
    if db_matching:
        db.delete(db_matching)
        db.commit()
    return db_matching
