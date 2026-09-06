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
