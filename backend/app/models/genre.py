from sqlalchemy import Column, Integer, String, DateTime  # type: ignore
from sqlalchemy.sql import func  # type: ignore
from app.database import Base

class Genre(Base):
    __tablename__ = "genres"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
