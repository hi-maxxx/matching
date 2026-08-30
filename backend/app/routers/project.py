from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session  # type: ignore
from app.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.project import ProjectCreate, ProjectResponse
from app import crud

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("/{user_id}/{other_user_id}", response_model=list[ProjectResponse])
def read_projects(user_id: int, other_user_id: int, db: Session = Depends(get_db)):
    """2人のユーザー間のプロジェクト一覧を取得"""
    return crud.get_projects_between(db, user_id=user_id, other_user_id=other_user_id)


@router.post("/", response_model=ProjectResponse, status_code=201)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """プロジェクト作成（user_id1はJWTから自動取得）"""
    return crud.create_project(db, project=project, user_id=current_user.id)


@router.delete("/{project_id}", response_model=ProjectResponse)
def delete_project(project_id: int, db: Session = Depends(get_db)):
    """プロジェクト削除"""
    project = crud.delete_project(db, project_id=project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project
