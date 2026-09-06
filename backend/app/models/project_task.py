from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey  # type: ignore
from sqlalchemy.sql import func  # type: ignore
from app.database import Base

class ProjectTask(Base):
    __tablename__ = "project_tasks"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    content = Column(String(255), nullable=False)
    is_done = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
