"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime # type: ignore
from sqlalchemy.sql import func # type: ignore
from app.database import Base

class Chatroom(Base):
    __tablename__ = "chatrooms"

    id = Column(Integer, primary_key=True, index=True)
    user_id1 = Column(Integer)
    user_id2 = Column(Integer)
    chatroom_id	= Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    ↓に変更
    user_id1/user_id2/chatroom_idを削除し、matching_idを追加
    ForeignKey("matchings.id")で、Matchingテーブルとの関連を明示（前回の修正リストの🟡項目7「FK制約がない」も一緒に解消）
    unique=Trueを追加。これにより「1つのMatchingに対してChatroomは1つまで」という1対1の関係をデータベースレベルで保証します（同じmatching_idで2つ目のChatroomを作ろうとするとDBがエラーを出してくれる）
    import文から使わなくなったString, Booleanを削除
"""

from sqlalchemy import Column, Integer, DateTime, ForeignKey  # type: ignore
from sqlalchemy.sql import func  # type: ignore
from app.database import Base

class Chatroom(Base):
    __tablename__ = "chatrooms"

    id = Column(Integer, primary_key=True, index=True)
    matching_id = Column(Integer, ForeignKey("matchings.id"), nullable=False, unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
