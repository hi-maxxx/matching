from pydantic import BaseModel
from datetime import datetime

class MessageCreate(BaseModel):
    """POST リクエスト時に受け取るデータ"""
    chatroom_id: int
    sender_id: int
    #receiver_id: int receiver_idを削除し、chatroom_idを追加（MessageCreate・MessageResponse両方）
    content: str

class MessageResponse(BaseModel):
    """レスポンスとして返すデータ"""
    id: int
    chatroom_id: int
    sender_id: int
    #receiver_id: int receiver_idを削除し、chatroom_idを追加（MessageCreate・MessageResponse両方）
    content: str
    created_at: datetime

    class Config:
        from_attributes = True
