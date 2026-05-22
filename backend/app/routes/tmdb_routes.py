from fastapi import APIRouter, HTTPException, Query

from app.services.tmdb_service import (
    get_tmdb_movie_details,
    get_tmdb_popular_movies,
    get_tmdb_top_rated_movies,
    get_tmdb_similar_movies
)


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


@router.get("/popular")
def tmdb_popular_movies(
    limit: int = Query(default=12, ge=1, le=20)
):
    result = get_tmdb_popular_movies(limit)

    if isinstance(result, dict) and result.get("error"):
        raise HTTPException(status_code=400, detail=result)

    return {
        "category": "popular",
        "results": result
    }


@router.get("/top-rated")
def tmdb_top_rated_movies(
    limit: int = Query(default=12, ge=1, le=20)
):
    result = get_tmdb_top_rated_movies(limit)

    if isinstance(result, dict) and result.get("error"):
        raise HTTPException(status_code=400, detail=result)

    return {
        "category": "top_rated",
        "results": result
    }


@router.get("/movie/{tmdb_id}/similar")
def tmdb_similar_movies(
    tmdb_id: int,
    limit: int = Query(default=12, ge=1, le=20)
):
    result = get_tmdb_similar_movies(tmdb_id, limit)

    if isinstance(result, dict) and result.get("error"):
        raise HTTPException(status_code=400, detail=result)

    return {
        "movie_id": tmdb_id,
        "model": "tmdb_similar_movies_for_ui",
        "results": result
    }