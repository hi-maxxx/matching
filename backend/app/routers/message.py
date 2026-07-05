from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session  # type: ignore
from app.database import get_db
from app.schemas.message import MessageCreate, MessageResponse
from app import crud

router = APIRouter(prefix="/messages", tags=["messages"])

@router.get("/", response_model=list[MessageResponse])
def read_messages(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_messages(db, skip=skip, limit=limit)

@router.get("/{user_id}/{other_user_id}", response_model=list[MessageResponse])
def read_conversation(user_id: int, other_user_id: int, db: Session = Depends(get_db)):
    return crud.get_conversation(db, user_id=user_id, other_user_id=other_user_id)

@router.post("/", response_model=MessageResponse, status_code=201)
def create_message(message: MessageCreate, db: Session = Depends(get_db)):
    return crud.create_message(db, message=message)
