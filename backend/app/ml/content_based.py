import ast
import pandas as pd
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.services.movie_service import get_movie_by_id


BASE_DIR = Path(__file__).resolve().parents[3]

TMDB_MOVIES_PATH = BASE_DIR / "data" / "tmdb" / "tmdb_5000_movies.csv"
TMDB_CREDITS_PATH = BASE_DIR / "data" / "tmdb" / "tmdb_5000_credits.csv"


def load_data():
    movies = pd.read_csv(TMDB_MOVIES_PATH)
    credits = pd.read_csv(TMDB_CREDITS_PATH)

    movies = movies.merge(
        credits,
        left_on="id",
        right_on="movie_id",
        how="inner"
    )

    return movies


def parse_names(value):
    try:
        items = ast.literal_eval(value)
        return [item["name"] for item in items]
    except Exception:
        return []


def get_top_cast(value, limit=3):
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
                return [item["name"]]
        return []
    except Exception:
        return []


def clean_words(words):
    cleaned = []

    for word in words:
        cleaned.append(word.lower().replace(" ", ""))

    return cleaned


def prepare_content_data():
    movies = load_data()

    selected_columns = [
        "id",
        "title_x",
        "overview",
        "genres",
        "keywords",
        "cast",
        "crew",
        "vote_average",
        "vote_count",
        "popularity",
        "release_date"
    ]

    movies = movies[selected_columns].copy()

    movies.rename(columns={"title_x": "title"}, inplace=True)

    movies["overview"] = movies["overview"].fillna("")

    movies["genres"] = movies["genres"].apply(parse_names)
    movies["keywords"] = movies["keywords"].apply(parse_names)
    movies["cast"] = movies["cast"].apply(get_top_cast)
    movies["director"] = movies["crew"].apply(get_director)

    movies["genres"] = movies["genres"].apply(clean_words)
    movies["keywords"] = movies["keywords"].apply(clean_words)
    movies["cast"] = movies["cast"].apply(clean_words)
    movies["director"] = movies["director"].apply(clean_words)

    movies["combined_features"] = (
        movies["overview"].apply(lambda x: x.lower()) + " " +
        movies["genres"].apply(lambda x: " ".join(x)) + " " +
        movies["keywords"].apply(lambda x: " ".join(x)) + " " +
        movies["cast"].apply(lambda x: " ".join(x)) + " " +
        movies["director"].apply(lambda x: " ".join(x))
    )

    return movies


def build_similarity_matrix(movies):
    vectorizer = TfidfVectorizer(
        stop_words="english",
        max_features=5000
    )

    feature_matrix = vectorizer.fit_transform(movies["combined_features"])
    similarity_matrix = cosine_similarity(feature_matrix)

    return similarity_matrix


def recommend_movies(movie_title, top_n=10):
    movies = prepare_content_data()
    similarity_matrix = build_similarity_matrix(movies)

    movie_title = movie_title.lower()

    matches = movies[movies["title"].str.lower() == movie_title]

    if matches.empty:
        return []

    movie_index = matches.index[0]

    similarity_scores = list(enumerate(similarity_matrix[movie_index]))

    similarity_scores = sorted(
        similarity_scores,
        key=lambda x: x[1],
        reverse=True
    )

    similar_movies = similarity_scores[1:top_n + 1]

    recommendations = []

    for index, score in similar_movies:
        movie = movies.iloc[index]
        movie_id = int(movie["id"])

        movie_details = get_movie_by_id(movie_id)

        if movie_details:
            recommendations.append({
                **movie_details,
                "content_similarity_score": round(float(score), 4),
                "recommendation_type": "content_based"
            })
        else:
            recommendations.append({
                "id": movie_id,
                "title": movie["title"],
                "overview": movie["overview"],
                "score": round(float(score), 4),
                "content_similarity_score": round(float(score), 4),
                "vote_average": float(movie["vote_average"]),
                "popularity": float(movie["popularity"]),
                "release_date": movie["release_date"],
                "poster_url": None,
                "backdrop_url": None,
                "recommendation_type": "content_based"
            })

    return recommendations


if __name__ == "__main__":
    results = recommend_movies("Avatar", top_n=10)

    print("\nContent-Based Recommendations for Avatar:\n")

    for movie in results:
        print(movie)