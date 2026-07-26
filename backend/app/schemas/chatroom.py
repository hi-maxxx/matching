from pydantic import BaseModel #Email 使用していないので削除
from datetime import datetime

class ChatroomCreate(BaseModel):
    """POST リクエスト時に受け取るデータ"""
    #user_id1/user_id2/chatroom_idを削除し、matching_idのみに
    #user_id1 : int
    #user_id2 : int
    #chatroom_id : int
    matching_id : int



class ChatroomResponse(BaseModel):
    """レスポンスとして返すデータ"""
    id: int
    matching_id : int
    #user_id1 : int
    #user_id2 : int
    #chatroom_id : int
    created_at : datetime


    class Config:
        from_attributes = True  # SQLAlchemy モデルからの変換を許可
