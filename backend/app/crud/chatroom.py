from sqlalchemy.orm import Session # type: ignore
from app.models.chatroom import Chatroom
from app.schemas.chatroom import ChatroomCreate

def get_chatrooms(db: Session, skip: int = 0, limit: int = 100):
    """チャットルーム一覧取得"""
    return db.query(Chatroom).offset(skip).limit(limit).all()

def get_chatroom(db: Session, chatroom_id: int):  # ✅ user_id -> chatroom_id
    """チャットルーム1件取得"""
    return db.query(Chatroom).filter(Chatroom.id == chatroom_id).first()

def create_chatroom(db: Session, chatroom: ChatroomCreate):  # ✅ user -> chatroom
    """チャットルーム作成"""
    # ✅ Chatroom.xxx（クラス）ではなく chatroom.xxx（スキーマオブジェクト）から値を取得
    db_chatroom = Chatroom(
        user_id1=chatroom.user_id1,
        user_id2=chatroom.user_id2,
        chatroom_id=chatroom.chatroom_id
    )
    db.add(db_chatroom)
    db.commit()
    db.refresh(db_chatroom)
    return db_chatroom

def delete_chatroom(db: Session, chatroom_id: int):  # ✅ delete_user -> delete_chatroom、user_id -> chatroom_id
    """チャットルーム削除"""
    db_chatroom = db.query(Chatroom).filter(Chatroom.id == chatroom_id).first()
    if db_chatroom:
        db.delete(db_chatroom)
        db.commit()
    return db_chatroom
