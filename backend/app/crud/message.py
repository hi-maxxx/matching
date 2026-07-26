"""
from sqlalchemy.orm import Session  # type: ignore
from sqlalchemy import or_, and_  # type: ignore
from app.models.message import Message
from app.schemas.message import MessageCreate

def get_messages(db: Session, skip: int = 0, limit: int = 100):
    #メッセージ一覧取得
    return db.query(Message).order_by(Message.created_at).offset(skip).limit(limit).all()

    #get_conversation（user_id/other_user_idで2人の会話を探す関数）を削除し、代わりにget_messages_by_chatroom（chatroom_idだけで会話を探す関数）に置き換え。新しい設計だと「どのチャットルームか」さえ分かればメッセージが特定できるので、以前のようにor_/and_を組み合わせた複雑な条件分岐が不要になり、コードがシンプルになりました
def get_conversation(db: Session, user_id: int, other_user_id: int):
    #2人のユーザー間のやり取りを時系列で取得(送信・受信どちらも含む)
    return (
        db.query(Message)
        .filter(
            or_(
                and_(Message.sender_id == user_id, Message.receiver_id == other_user_id),
                and_(Message.sender_id == other_user_id, Message.receiver_id == user_id),
            )
        )
        .order_by(Message.created_at)
        .all()
    )

def create_message(db: Session, message: MessageCreate):
    db_message = Message(**message.model_dump())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def delete_message(db: Session, message_id: int):
    #メッセージ削除
    db_message = db.query(Message).filter(Message.id == message_id).first()
    if db_message:
        db.delete(db_message)
        db.commit()
    return db_message
    ↓に変更
"""
from sqlalchemy.orm import Session  # type: ignore
from app.models.message import Message
from app.schemas.message import MessageCreate
#from sqlalchemy import or_, and_  # type: ignore sqlalchemyからor_, and_のimportも不要になったので削除

def get_messages(db: Session, skip: int = 0, limit: int = 100):
    """メッセージ一覧取得"""
    return db.query(Message).order_by(Message.created_at).offset(skip).limit(limit).all()

#get_conversation（user_id/other_user_idで2人の会話を探す関数）を削除し、代わりにget_messages_by_chatroom（chatroom_idだけで会話を探す関数）に置き換え。新しい設計だと「どのチャットルームか」さえ分かればメッセージが特定できるので、以前のようにor_/and_を組み合わせた複雑な条件分岐が不要になり、コードがシンプルになりました
def get_messages_by_chatroom(db: Session, chatroom_id: int):
    """指定したチャットルームのメッセージを時系列で取得"""
    return (
        db.query(Message)
        .filter(Message.chatroom_id == chatroom_id)
        .order_by(Message.created_at)
        .all()
    )

def create_message(db: Session, message: MessageCreate):
    db_message = Message(**message.model_dump())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def delete_message(db: Session, message_id: int):
    """メッセージ削除"""
    db_message = db.query(Message).filter(Message.id == message_id).first()
    if db_message:
        db.delete(db_message)
        db.commit()
    return db_message
