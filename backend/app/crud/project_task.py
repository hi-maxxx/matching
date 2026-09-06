from sqlalchemy.orm import Session  # type: ignore
from app.models.project_task import ProjectTask
from app.schemas.project_task import ProjectTaskCreate, ProjectTaskUpdate


def get_tasks_by_project(db: Session, project_id: int):
    """指定したプロジェクトに紐づく作業項目一覧を取得"""
    return db.query(ProjectTask).filter(ProjectTask.project_id == project_id).order_by(ProjectTask.id).all()


def create_task(db: Session, task: ProjectTaskCreate):
    """作業項目を新規作成"""
    db_task = ProjectTask(project_id=task.project_id, content=task.content)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def update_task(db: Session, task_id: int, task: ProjectTaskUpdate):
    """作業項目の完了/未完了を切り替え"""
    db_task = db.query(ProjectTask).filter(ProjectTask.id == task_id).first()
    if db_task:
        db_task.is_done = task.is_done
        db.commit()
        db.refresh(db_task)
    return db_task


def delete_task(db: Session, task_id: int):
    """作業項目を削除"""
    db_task = db.query(ProjectTask).filter(ProjectTask.id == task_id).first()
    if db_task:
        db.delete(db_task)
        db.commit()
    return db_task
