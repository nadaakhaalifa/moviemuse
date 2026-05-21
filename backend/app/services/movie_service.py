import ast
import pandas as pd
from pathlib import Path


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


def movie_to_dict(movie):
    return {
        "id": int(movie["id"]),
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
        "revenue": int(movie["revenue"])
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