from sqlalchemy import Column, Integer, String, ForeignKey, DateTime # type: ignore
from sqlalchemy.sql import func # type: ignore
from app.database import Base

class Post(Base):
    __tablename__ = "posts"

    id         = Column(Integer, primary_key=True, index=True)
    title      = Column(String, nullable=False)
    content    = Column(String, nullable=True)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
