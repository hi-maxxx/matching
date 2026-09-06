from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session  # type: ignore
from app.database import get_db
from app.schemas.project_task import ProjectTaskCreate, ProjectTaskUpdate, ProjectTaskResponse
from app import crud

router = APIRouter(prefix="/project-tasks", tags=["project-tasks"])


@router.get("/{project_id}", response_model=list[ProjectTaskResponse])
def read_tasks(project_id: int, db: Session = Depends(get_db)):
    """指定したプロジェクトの作業項目一覧を取得"""
    return crud.get_tasks_by_project(db, project_id=project_id)


@router.post("/", response_model=ProjectTaskResponse, status_code=201)
def create_task(task: ProjectTaskCreate, db: Session = Depends(get_db)):
    """作業項目を新規作成"""
    return crud.create_task(db, task=task)


@router.patch("/{task_id}", response_model=ProjectTaskResponse)
def update_task(task_id: int, task: ProjectTaskUpdate, db: Session = Depends(get_db)):
    """作業項目の完了/未完了を切り替え"""
    updated = crud.update_task(db, task_id=task_id, task=task)
    if updated is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated


@router.delete("/{task_id}", response_model=ProjectTaskResponse)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    """作業項目を削除"""
    task = crud.delete_task(db, task_id=task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task
