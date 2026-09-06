from sqlalchemy import Column, Integer, String, DateTime, ForeignKey  # type: ignore
from sqlalchemy.sql import func  # type: ignore
from app.database import Base

class ProjectTag(Base):
    __tablename__ = "project_tags"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    name = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
