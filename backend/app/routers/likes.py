from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session  # type: ignore
from app.database import get_db
from app.schemas.likes import LikeCreate, LikeResponse
from app import crud

router = APIRouter(prefix="/likes", tags=["likes"])

@router.get("/", response_model=list[LikeResponse])
def read_likes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_likes(db, skip=skip, limit=limit)

@router.get("/sent/{user_id}", response_model=list[LikeResponse])
def read_sent_likes(user_id: int, db: Session = Depends(get_db)):
    return crud.get_likes_sent_by(db, user_id=user_id)

@router.post("/", response_model=LikeResponse, status_code=201)
def create_like(like: LikeCreate, db: Session = Depends(get_db)):
    return crud.create_like(db, like=like)
