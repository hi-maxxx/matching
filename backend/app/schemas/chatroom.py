from pydantic import BaseModel, EmailStr
from datetime import datetime

class ChatroomCreate(BaseModel):
    """POST リクエスト時に受け取るデータ"""

    user_id1 : int
    user_id2 : int
    chatroom_id : int


class ChatroomResponse(BaseModel):
    """レスポンスとして返すデータ"""
    id: int
    user_id1 : int
    user_id2 : int
    chatroom_id : int
    created_at : datetime


    class Config:
        from_attributes = True  # SQLAlchemy モデルからの変換を許可
