"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey  # type: ignore
from sqlalchemy.sql import func  # type: ignore
from app.database import Base

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    ↓に変更
"""

from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey  # type: ignore
from sqlalchemy.sql import func  # type: ignore
from app.database import Base

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    #receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)→receiver_idを削除（「どのチャットルームか」が分かれば、受信者は自動的にもう片方のユーザーだと分かるため不要）
    chatroom_id = Column(Integer, ForeignKey("chatrooms.id"), nullable=False)#chatroom_idを追加し、Chatroomとの関連を明示
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
