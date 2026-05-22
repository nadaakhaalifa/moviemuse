import ast
import pandas as pd
from pathlib import Path

from app.services.tmdb_service import get_tmdb_movie_details


BASE_DIR = Path(__file__).resolve().parents[3]

TMDB_MOVIES_PATH = BASE_DIR / "data" / "tmdb" / "tmdb_5000_movies.csv"
TMDB_CREDITS_PATH = BASE_DIR / "data" / "tmdb" / "tmdb_5000_credits.csv"


def parse_names(value):
    try:
        items = ast.literal_eval(value)
        return [item["name"] for item in items]
    except Exception:
        return []


def get_top_cast(value, limit=5):
    try:
        items = ast.literal_eval(value)
        return [item["name"] for item in items[:limit]]
    except Exception:
        return []


def get_director(value):
    try:
        items = ast.literal_eval(value)
        for item in items:
            if item.get("job") == "Director":
                return item["name"]
        return None
    except Exception:
        return None


def load_movies():
    movies = pd.read_csv(TMDB_MOVIES_PATH)
    credits = pd.read_csv(TMDB_CREDITS_PATH)

    movies = movies.merge(
        credits,
        left_on="id",
        right_on="movie_id",
        how="inner"
    )

    movies["overview"] = movies["overview"].fillna("")
    movies["release_date"] = movies["release_date"].fillna("")
    movies["runtime"] = movies["runtime"].fillna(0)

    movies["genres_list"] = movies["genres"].apply(parse_names)
    movies["keywords_list"] = movies["keywords"].apply(parse_names)
    movies["cast_list"] = movies["cast"].apply(get_top_cast)
    movies["director"] = movies["crew"].apply(get_director)

    return movies


MOVIES_DF = load_movies()


def get_tmdb_images(movie_id):
    tmdb_data = get_tmdb_movie_details(movie_id)

    if tmdb_data.get("error"):
        return {
            "poster_path": None,
            "poster_url": None,
            "backdrop_path": None,
            "backdrop_url": None
        }

    return {
        "poster_path": tmdb_data.get("poster_path"),
        "poster_url": tmdb_data.get("poster_url"),
        "backdrop_path": tmdb_data.get("backdrop_path"),
        "backdrop_url": tmdb_data.get("backdrop_url")
    }


def movie_to_dict(movie, include_images=True):
    movie_id = int(movie["id"])

    images = {
        "poster_path": None,
        "poster_url": None,
        "backdrop_path": None,
        "backdrop_url": None
    }

    if include_images:
        images = get_tmdb_images(movie_id)

    return {
        "id": movie_id,
        "title": movie["title_x"],
        "overview": movie["overview"],
        "genres": movie["genres_list"],
        "keywords": movie["keywords_list"],
        "cast": movie["cast_list"],
        "director": movie["director"],
        "release_date": movie["release_date"],
        "runtime": float(movie["runtime"]),
        "vote_average": float(movie["vote_average"]),
        "vote_count": int(movie["vote_count"]),
        "popularity": float(movie["popularity"]),
        "budget": int(movie["budget"]),
        "revenue": int(movie["revenue"]),
        "poster_path": images["poster_path"],
        "poster_url": images["poster_url"],
        "backdrop_path": images["backdrop_path"],
        "backdrop_url": images["backdrop_url"]
    }


def search_movies(query, limit=20):
    query = query.lower()

    results = MOVIES_DF[
        MOVIES_DF["title_x"].str.lower().str.contains(query, na=False)
    ]

    results = results.sort_values(
        by=["popularity", "vote_average"],
        ascending=False
    ).head(limit)

    return [movie_to_dict(row) for _, row in results.iterrows()]


def get_movie_by_id(movie_id):
    results = MOVIES_DF[MOVIES_DF["id"] == movie_id]

    if results.empty:
        return None

    return movie_to_dict(results.iloc[0])


def get_popular_movies(limit=20):
    results = MOVIES_DF.sort_values(
        by="popularity",
        ascending=False
    ).head(limit)

    return [movie_to_dict(row) for _, row in results.iterrows()]


def get_top_rated_movies(limit=20):
    results = MOVIES_DF[
        MOVIES_DF["vote_count"] >= 100
    ].sort_values(
        by="vote_average",
        ascending=False
    ).head(limit)

    return [movie_to_dict(row) for _, row in results.iterrows()]