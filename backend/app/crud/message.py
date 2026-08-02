from sqlalchemy.orm import Session  # type: ignore
from sqlalchemy import or_, and_  # type: ignore
from app.models.message import Message
from app.schemas.message import MessageCreate

def get_messages(db: Session, skip: int = 0, limit: int = 100):
    """メッセージ一覧取得"""
    return db.query(Message).order_by(Message.created_at).offset(skip).limit(limit).all()

def get_conversation(db: Session, user_id: int, other_user_id: int):
    """2人のユーザー間のやり取りを時系列で取得（送信・受信どちらも含む）"""
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

def create_message(db: Session, message: MessageCreate, sender_id: int):
    """メッセージ作成（sender_idはJWTから取得した値を渡す）"""
    db_message = Message(
        sender_id=sender_id,
        receiver_id=message.receiver_id,
        content=message.content,
    )
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

#ここが今回の一番重要な部分です。教材のスライド13枚目「会話は双方向で取り出す」の通り、sender_id/receiver_idの両方向をORで拾うクエリに戻します。また、sender_idをJWTから受け取る形に対応するため、create_messageの引数を変更します。変更点

#sqlalchemyからor_, and_を再度import・get_messages_by_chatroomを削除し、get_conversation（user_id/other_user_idの双方向取得）を復活・create_messageの引数にsender_id: intを追加。MessageCreateスキーマからはsender_idを除いたので、代わりに関数の引数として別に受け取る形にしています。これは次に直すrouters/message.pyで、JWTから取り出したcurrent_user.idをここに渡す形になります
