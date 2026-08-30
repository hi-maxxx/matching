from sqlalchemy.orm import Session  # type: ignore
from sqlalchemy import or_, and_  # type: ignore
from app.models.project import Project
from app.schemas.project import ProjectCreate


def get_projects_between(db: Session, user_id: int, other_user_id: int):
    """2人のユーザー間のプロジェクト一覧を作成日時順で取得"""
    return (
        db.query(Project)
        .filter(
            or_(
                and_(Project.user_id1 == user_id, Project.user_id2 == other_user_id),
                and_(Project.user_id1 == other_user_id, Project.user_id2 == user_id),
            )
        )
        .order_by(Project.created_at)
        .all()
    )


def create_project(db: Session, project: ProjectCreate, user_id: int):
    """プロジェクト作成（user_id1はJWTから取得した値を渡す）"""
    db_project = Project(
        title=project.title,
        comment=project.comment,
        genre=project.genre,
        deadline=project.deadline,
        user_id1=user_id,
        user_id2=project.other_user_id,
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


def delete_project(db: Session, project_id: int):
    """プロジェクト削除"""
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if db_project:
        db.delete(db_project)
        db.commit()
    return db_project
