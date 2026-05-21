from fastapi import APIRouter, Query

from app.services.analytics_service import (
    get_overview_stats,
    get_genre_distribution,
    get_top_popular_movies,
    get_top_revenue_movies,
    get_movies_by_year,
    get_rating_distribution
)


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/overview")
def overview():
    return get_overview_stats()


@router.get("/genres")
def genres():
    return {
        "results": get_genre_distribution()
    }


@router.get("/popular-movies")
def popular_movies(
    limit: int = Query(default=10, ge=1, le=50)
):
    return {
        "results": get_top_popular_movies(limit)
    }


@router.get("/revenue")
def revenue_movies(
    limit: int = Query(default=10, ge=1, le=50)
):
    return {
        "results": get_top_revenue_movies(limit)
    }


@router.get("/movies-by-year")
def movies_by_year():
    return {
        "results": get_movies_by_year()
    }


@router.get("/rating-distribution")
def rating_distribution():
    return {
        "results": get_rating_distribution()
    }