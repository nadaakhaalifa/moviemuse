from fastapi import APIRouter, Query, HTTPException
from app.services.movie_service import (
    search_movies,
    get_movie_by_id,
    get_popular_movies,
    get_top_rated_movies
)


router = APIRouter(
    prefix="/movies",
    tags=["Movies"]
)


@router.get("/search")
def search(
    query: str = Query(..., min_length=1),
    limit: int = Query(default=20, ge=1, le=50)
):
    return {
        "query": query,
        "results": search_movies(query, limit)
    }


@router.get("/popular")
def popular_movies(
    limit: int = Query(default=20, ge=1, le=50)
):
    return {
        "category": "popular",
        "results": get_popular_movies(limit)
    }


@router.get("/top-rated")
def top_rated_movies(
    limit: int = Query(default=20, ge=1, le=50)
):
    return {
        "category": "top_rated",
        "results": get_top_rated_movies(limit)
    }


@router.get("/{movie_id}")
def movie_details(movie_id: int):
    movie = get_movie_by_id(movie_id)

    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")

    return movie