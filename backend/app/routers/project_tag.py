from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session  # type: ignore
from app.database import get_db
from app.schemas.project_tag import ProjectTagCreate, ProjectTagResponse
from app import crud

router = APIRouter(prefix="/project-tags", tags=["project-tags"])


@router.get("/{project_id}", response_model=list[ProjectTagResponse])
def read_tags(project_id: int, db: Session = Depends(get_db)):
    """指定したプロジェクトのタグ一覧を取得"""
    return crud.get_tags_by_project(db, project_id=project_id)


@router.post("/", response_model=ProjectTagResponse, status_code=201)
def create_tag(tag: ProjectTagCreate, db: Session = Depends(get_db)):
    """タグを新規作成"""
    return crud.create_tag(db, tag=tag)


@router.delete("/{tag_id}", response_model=ProjectTagResponse)
def delete_tag(tag_id: int, db: Session = Depends(get_db)):
    """タグを削除"""
    tag = crud.delete_tag(db, tag_id=tag_id)
    if tag is None:
        raise HTTPException(status_code=404, detail="Tag not found")
    return tag
