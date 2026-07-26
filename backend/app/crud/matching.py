"""

from sqlalchemy.orm import Session # type: ignore
from app.models.matching import Matching
from app.schemas.matching import MatchingCreate

def get_matchings(db: Session, skip: int = 0, limit: int = 100):
    #ユーザー一覧取得
    return db.query(Matching).offset(skip).limit(limit).all()

def get_matching(db: Session, matching_id: int):#ここが間違っていた引数ちがい（user_id)になっていた
    #ユーザー1件取得
    return db.query(Matching).filter(Matching.id == matching_id).first()#ここがわからん→引数違い

def create_matching(db: Session, matching: MatchingCreate):
    db_matching = Matching(**matching.model_dump())
    db.add(db_matching)
    db.commit()
    db.refresh(db_matching)  # ← created_atをDBから再取得
    return db_matching

def delete_matching(db: Session, matching_id: int):
    #ユーザー削除
    db_matching = db.query(Matching).filter(Matching.id == matching_id).first()
    if db_matching:
        db.delete(db_matching)
        db.commit()
    return db_matching
    ↓に変更
"""

from sqlalchemy.orm import Session # type: ignore
from app.models.matching import Matching
from app.models.chatroom import Chatroom #from app.models.chatroom import Chatroomを追加（Chatroomモデルを使うために必要）
from app.schemas.matching import MatchingCreate

def get_matchings(db: Session, skip: int = 0, limit: int = 100):
    """マッチング一覧取得"""
    return db.query(Matching).offset(skip).limit(limit).all()

def get_matching(db: Session, matching_id: int):
    """マッチング1件取得"""
    return db.query(Matching).filter(Matching.id == matching_id).first()

def create_matching(db: Session, matching: MatchingCreate):
    """マッチングを作成し、同時にチャットルームも自動作成する"""
    db_matching = Matching(**matching.model_dump())
    db.add(db_matching)
    db.commit()
    db.refresh(db_matching)

    # マッチング成立と同時にチャットルームを自動作成
    #create_matchingの中で、Matchingを保存した直後にChatroomを1件作成
    db_chatroom = Chatroom(matching_id=db_matching.id)
    db.add(db_chatroom)
    db.commit()

    return db_matching

def delete_matching(db: Session, matching_id: int):
    """マッチング削除"""
    db_matching = db.query(Matching).filter(Matching.id == matching_id).first()
    if db_matching:
        db.delete(db_matching)
        db.commit()
    return db_matching

#動作の流れ: db_matchingを先にdb.commit()してdb.refresh()することで、db_matching.idが確定します（DBが自動採番するIDは、保存されるまで分かりません）。そのIDを使ってChatroomを作る、という順番が重要です。
