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
