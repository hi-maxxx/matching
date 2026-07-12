from sqlalchemy import Column, Integer, String, Boolean, DateTime ,Date,Text# type: ignore
from sqlalchemy.sql import func # type: ignore
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False, default="a")   # ← 追加
    is_active = Column(Boolean, default=True)
    birth_date = Column(Date,nullable= True)
    bio = Column(Text, nullable=True)
    avatar_url = Column(String, nullable=True)
    phone = Column(String, nullable=True)# type: ignore
    penname = Column(String(255), nullable=True)#オリジナル
    introduction = Column(String(1000))#オリジナル
    personality = Column(String(255))#オリジナル
    work = Column(String)#オリジナル
    created_at = Column(DateTime(timezone=True), server_default=func.now())
