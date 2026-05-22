from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.favorite import Favorite
from app.models.user import User
from app.schemas.favorite_schema import FavoriteCreateRequest, FavoriteResponse
from app.utils.auth_dependency import get_current_user


router = APIRouter(
    prefix="/favorites",
    tags=["Favorites"]
)


def format_favorite(favorite: Favorite):
    return {
        "id": favorite.movie_id,
        "favorite_id": favorite.id,
        "title": favorite.title,
        "poster_url": favorite.poster_url,
        "backdrop_url": favorite.backdrop_url,
        "release_date": favorite.release_date,
        "vote_average": float(favorite.vote_average) if favorite.vote_average else 0,
        "overview": favorite.overview,
    }


@router.get("/me")
def get_my_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    favorites = (
        db.query(Favorite)
        .filter(Favorite.user_id == current_user.id)
        .order_by(Favorite.created_at.desc())
        .all()
    )

    return {
        "count": len(favorites),
        "results": [format_favorite(favorite) for favorite in favorites]
    }


@router.post("")
def add_favorite(
    request: FavoriteCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing_favorite = (
        db.query(Favorite)
        .filter(
            Favorite.user_id == current_user.id,
            Favorite.movie_id == request.movie_id
        )
        .first()
    )

    if existing_favorite:
        return {
            "message": "Movie already exists in favorites",
            "favorite": format_favorite(existing_favorite)
        }

    favorite = Favorite(
        user_id=current_user.id,
        movie_id=request.movie_id,
        title=request.title,
        poster_url=request.poster_url,
        backdrop_url=request.backdrop_url,
        release_date=request.release_date,
        vote_average=str(request.vote_average) if request.vote_average is not None else None,
        overview=request.overview,
    )

    db.add(favorite)
    db.commit()
    db.refresh(favorite)

    return {
        "message": "Movie added to favorites",
        "favorite": format_favorite(favorite)
    }


@router.delete("/{movie_id}")
def remove_favorite(
    movie_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    favorite = (
        db.query(Favorite)
        .filter(
            Favorite.user_id == current_user.id,
            Favorite.movie_id == movie_id
        )
        .first()
    )

    if not favorite:
        raise HTTPException(
            status_code=404,
            detail="Favorite movie not found"
        )

    db.delete(favorite)
    db.commit()

    return {
        "message": "Movie removed from favorites",
        "movie_id": movie_id
    }


@router.get("/check/{movie_id}")
def check_favorite(
    movie_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    favorite = (
        db.query(Favorite)
        .filter(
            Favorite.user_id == current_user.id,
            Favorite.movie_id == movie_id
        )
        .first()
    )

    return {
        "movie_id": movie_id,
        "is_favorite": favorite is not None
    }