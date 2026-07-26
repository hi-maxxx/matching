"""
from sqlalchemy.orm import Session # type: ignore
from app.models.chatroom import Chatroom
from app.schemas.chatroom import ChatroomCreate

def get_chatrooms(db: Session, skip: int = 0, limit: int = 100):
    #チャットルーム一覧取得
    return db.query(Chatroom).offset(skip).limit(limit).all()

def get_chatroom(db: Session, chatroom_id: int):  # ✅ user_id -> chatroom_id
    #チャットルーム1件取得
    return db.query(Chatroom).filter(Chatroom.id == chatroom_id).first()

def create_chatroom(db: Session, chatroom: ChatroomCreate):  # ✅ user -> chatroom
    #チャットルーム作成
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
    #チャットルーム削除
    db_chatroom = db.query(Chatroom).filter(Chatroom.id == chatroom_id).first()
    if db_chatroom:
        db.delete(db_chatroom)
        db.commit()
    return db_chatroom

"""

from sqlalchemy.orm import Session # type: ignore
from app.models.chatroom import Chatroom
from app.schemas.chatroom import ChatroomCreate

def get_chatrooms(db: Session, skip: int = 0, limit: int = 100):
    """チャットルーム一覧取得"""
    return db.query(Chatroom).offset(skip).limit(limit).all()

def get_chatroom(db: Session, chatroom_id: int):
    """チャットルーム1件取得"""
    return db.query(Chatroom).filter(Chatroom.id == chatroom_id).first()

#新しくget_chatroom_by_matching_idを追加。これは「あるマッチングに対応するチャットルームを探す」ための関数で、次に作るフロントエンドのチャット画面（/matching/{matching_id}→チャットルームを開く、という流れ）で必要になります
def get_chatroom_by_matching_id(db: Session, matching_id: int):
    """マッチングIDに紐づくチャットルームを1件取得"""
    return db.query(Chatroom).filter(Chatroom.matching_id == matching_id).first()

def create_chatroom(db: Session, chatroom: ChatroomCreate):
    """チャットルーム作成"""
    db_chatroom = Chatroom(matching_id=chatroom.matching_id)#create_chatroomをmatching_idだけを使う形に単純化
    db.add(db_chatroom)
    db.commit()
    db.refresh(db_chatroom)
    return db_chatroom

def delete_chatroom(db: Session, chatroom_id: int):
    """チャットルーム削除"""
    db_chatroom = db.query(Chatroom).filter(Chatroom.id == chatroom_id).first()
    if db_chatroom:
        db.delete(db_chatroom)
        db.commit()
    return db_chatroom
