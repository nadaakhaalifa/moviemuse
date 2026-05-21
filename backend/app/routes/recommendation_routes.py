from fastapi import APIRouter, Query

from app.ml.content_based import recommend_movies
from app.ml.collaborative import recommend_collaborative
from app.ml.hybrid import recommend_hybrid


router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendations"]
)


@router.get("/content/{movie_title}")
def get_content_recommendations(
    movie_title: str,
    top_n: int = Query(default=10, ge=1, le=20)
):
    recommendations = recommend_movies(movie_title, top_n)

    if not recommendations:
        return {
            "message": "Movie not found",
            "movie_title": movie_title,
            "recommendations": []
        }

    return {
        "movie_title": movie_title,
        "model": "content_based_filtering",
        "recommendations": recommendations
    }


@router.get("/collaborative/{user_id}")
def get_collaborative_recommendations(
    user_id: int,
    top_n: int = Query(default=10, ge=1, le=20)
):
    return recommend_collaborative(user_id=user_id, top_n=top_n)


@router.get("/hybrid/{user_id}")
def get_hybrid_recommendations(
    user_id: int,
    top_n: int = Query(default=10, ge=1, le=20)
):
    return recommend_hybrid(user_id=user_id, top_n=top_n)