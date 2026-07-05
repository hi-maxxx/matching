from sqlalchemy import Column, Integer, String, Boolean, DateTime ,ForeignKey# type: ignore
from sqlalchemy.sql import func # type: ignore
from app.database import Base

class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, index=True)
    from_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    to_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
