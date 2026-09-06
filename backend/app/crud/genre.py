from sqlalchemy.orm import Session  # type: ignore
from app.models.genre import Genre
from app.schemas.genre import GenreCreate


def get_genres(db: Session):
    """ジャンル一覧を取得（登録順）"""
    return db.query(Genre).order_by(Genre.id).all()


def create_genre(db: Session, genre: GenreCreate):
    """ジャンルを新規作成"""
    db_genre = Genre(name=genre.name)
    db.add(db_genre)
    db.commit()
    db.refresh(db_genre)
    return db_genre


def delete_genre(db: Session, genre_id: int):
    """ジャンルを削除"""
    db_genre = db.query(Genre).filter(Genre.id == genre_id).first()
    if db_genre:
        db.delete(db_genre)
        db.commit()
    return db_genre
