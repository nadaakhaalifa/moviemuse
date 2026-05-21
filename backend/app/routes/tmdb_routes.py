from fastapi import APIRouter, HTTPException
from app.services.tmdb_service import get_tmdb_movie_details

router = APIRouter(
    prefix="/tmdb",
    tags=["TMDB"]
)


@router.get("/movie/{tmdb_id}")
def tmdb_movie_details(tmdb_id: int):
    result = get_tmdb_movie_details(tmdb_id)

    if result.get("error"):
        raise HTTPException(status_code=400, detail=result)

    return result