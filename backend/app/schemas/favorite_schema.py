from typing import Optional
from pydantic import BaseModel


class FavoriteCreateRequest(BaseModel):
    movie_id: int
    title: str
    poster_url: Optional[str] = None
    backdrop_url: Optional[str] = None
    release_date: Optional[str] = None
    vote_average: Optional[float] = None
    overview: Optional[str] = None


class FavoriteResponse(BaseModel):
    id: int
    movie_id: int
    title: str
    poster_url: Optional[str] = None
    backdrop_url: Optional[str] = None
    release_date: Optional[str] = None
    vote_average: Optional[str] = None
    overview: Optional[str] = None

    class Config:
        from_attributes = True