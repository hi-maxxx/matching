from sqlalchemy import Column, Integer, String, Boolean, DateTime # type: ignore
from sqlalchemy.sql import func # type: ignore
from app.database import Base

class Matching(Base):
    __tablename__ = "matchings"

    id = Column(Integer, primary_key=True, index=True)
    user_id1 = Column(Integer)
    user_id2 = Column(Integer)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)  # ← 追加
