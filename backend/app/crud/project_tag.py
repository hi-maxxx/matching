from sqlalchemy.orm import Session  # type: ignore
from app.models.project_tag import ProjectTag
from app.schemas.project_tag import ProjectTagCreate


def get_tags_by_project(db: Session, project_id: int):
    """指定したプロジェクトに紐づくタグ一覧を取得"""
    return db.query(ProjectTag).filter(ProjectTag.project_id == project_id).order_by(ProjectTag.id).all()


def create_tag(db: Session, tag: ProjectTagCreate):
    """タグを新規作成"""
    db_tag = ProjectTag(project_id=tag.project_id, name=tag.name)
    db.add(db_tag)
    db.commit()
    db.refresh(db_tag)
    return db_tag


def delete_tag(db: Session, tag_id: int):
    """タグを削除"""
    db_tag = db.query(ProjectTag).filter(ProjectTag.id == tag_id).first()
    if db_tag:
        db.delete(db_tag)
        db.commit()
    return db_tag
