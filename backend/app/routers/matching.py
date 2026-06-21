from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session # type: ignore
from app.database import get_db
from app.schemas.matching import MatchingCreate, MatchingResponse
from app import crud

router = APIRouter(prefix="/matchings", tags=["matchings"])

@router.get("/", response_model=list[MatchingResponse])
def read_matchings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_matchings(db, skip=skip, limit=limit)

@router.get("/{matching_id}", response_model=MatchingResponse)
def read_matching(matching_id: int, db: Session = Depends(get_db)):
    matching = crud.get_matching(db, matching_id=matching_id)
    if matching is None:
        raise HTTPException(status_code=404, detail="Matching not found")
    return matching

@router.post("/", response_model=MatchingResponse, status_code=201)
def create_matching(matching: MatchingCreate, db: Session = Depends(get_db)):
    return crud.create_matching(db, matching=matching)

@router.delete("/{matching_id}", response_model=MatchingResponse)
def delete_matching(matching_id: int, db: Session = Depends(get_db)):
    result = crud.delete_matching(db, matching_id=matching_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Matching not found")
    return result
