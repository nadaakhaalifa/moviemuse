from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, UniqueConstraint

from app.database import Base


class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    movie_id = Column(Integer, nullable=False, index=True)
    title = Column(String, nullable=False)
    poster_url = Column(String, nullable=True)
    backdrop_url = Column(String, nullable=True)
    release_date = Column(String, nullable=True)
    vote_average = Column(String, nullable=True)
    overview = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint("user_id", "movie_id", name="unique_user_movie_favorite"),
    )