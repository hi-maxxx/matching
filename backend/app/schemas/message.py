from pydantic import BaseModel
from datetime import datetime

class MessageCreate(BaseModel):
    """POST リクエスト時に受け取るデータ"""
    sender_id: int
    receiver_id: int
    content: str

class MessageResponse(BaseModel):
    """レスポンスとして返すデータ"""
    id: int
    sender_id: int
    receiver_id: int
    content: str
    created_at: datetime

    class Config:
        from_attributes = True
