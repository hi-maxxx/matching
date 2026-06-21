from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session # pyright: ignore[reportMissingImports]
from app.database import get_db
from app.schemas.chatroom import ChatroomCreate, ChatroomResponse
from app import crud

router = APIRouter(prefix="/chatrooms", tags=["chatrooms"])

@router.get("/", response_model=list[ChatroomResponse])
def read_chatrooms(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """ユーザー一覧取得"""
    return crud.get_chatrooms(db, skip=skip, limit=limit)

@router.get("/{chatroom_id}", response_model=ChatroomResponse)
def read_chatroom(chatroom_id: int, db: Session = Depends(get_db)):  # ✅ user_id -> chatroom_id
    """ユーザー1件取得"""
    chatroom = crud.get_chatroom(db, chatroom_id=chatroom_id)  # ✅ user -> chatroom
    if chatroom is None:
        raise HTTPException(status_code=404, detail="Chatroom not found")
    return chatroom  # ✅ user -> chatroom

@router.post("/", response_model=ChatroomResponse, status_code=201)
def create_chatroom(chatroom: ChatroomCreate, db: Session = Depends(get_db)):  # ✅ user -> chatroom
    """ユーザー作成"""
    return crud.create_chatroom(db, chatroom=chatroom)  # ✅ 変数名が統一され解決

@router.delete("/{chatroom_id}", response_model=ChatroomResponse)
def delete_chatroom(chatroom_id: int, db: Session = Depends(get_db)):  # ✅ user_id -> chatroom_id
    """ユーザー削除"""
    chatroom = crud.delete_chatroom(db, chatroom_id=chatroom_id)  # ✅ user -> chatroom、タイポ修正
    if chatroom is None:
        raise HTTPException(status_code=404, detail="chatroom not found")
    return chatroom  # ✅ 変数名が統一され解決
