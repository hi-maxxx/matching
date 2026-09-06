from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session  # type: ignore
from app.database import get_db
from app.schemas.genre import GenreCreate, GenreResponse
from app import crud

router = APIRouter(prefix="/genres", tags=["genres"])


@router.get("/", response_model=list[GenreResponse])
def read_genres(db: Session = Depends(get_db)):
    """ジャンル一覧を取得"""
    return crud.get_genres(db)


@router.post("/", response_model=GenreResponse, status_code=201)
def create_genre(genre: GenreCreate, db: Session = Depends(get_db)):
    """ジャンルを新規作成"""
    return crud.create_genre(db, genre=genre)


@router.delete("/{genre_id}", response_model=GenreResponse)
def delete_genre(genre_id: int, db: Session = Depends(get_db)):
    """ジャンルを削除"""
    genre = crud.delete_genre(db, genre_id=genre_id)
    if genre is None:
        raise HTTPException(status_code=404, detail="Genre not found")
    return genre
