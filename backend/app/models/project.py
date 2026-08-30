from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey  # type: ignore
from sqlalchemy.sql import func  # type: ignore
from app.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    comment = Column(Text, nullable=True)
    genre = Column(String(50), nullable=False)
    deadline = Column(Date, nullable=True)
    user_id1 = Column(Integer, ForeignKey("users.id"), nullable=False)
    user_id2 = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
