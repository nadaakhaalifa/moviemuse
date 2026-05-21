import pandas as pd
from pathlib import Path
from sklearn.metrics.pairwise import cosine_similarity


BASE_DIR = Path(__file__).resolve().parents[3]

RATINGS_PATH = BASE_DIR / "data" / "movielens" / "ratings.csv"
MOVIELENS_MOVIES_PATH = BASE_DIR / "data" / "movielens" / "movies.csv"
LINKS_PATH = BASE_DIR / "data" / "movielens" / "links.csv"


def load_movielens_data():
    ratings = pd.read_csv(RATINGS_PATH)
    movies = pd.read_csv(MOVIELENS_MOVIES_PATH)
    links = pd.read_csv(LINKS_PATH)

    links["tmdbId"] = links["tmdbId"].fillna(0).astype(int)

    return ratings, movies, links


def build_user_item_matrix(ratings):
    user_item_matrix = ratings.pivot_table(
        index="userId",
        columns="movieId",
        values="rating"
    )

    return user_item_matrix


def build_item_similarity_matrix(user_item_matrix):
    movie_user_matrix = user_item_matrix.T.fillna(0)

    similarity_matrix = cosine_similarity(movie_user_matrix)

    similarity_df = pd.DataFrame(
        similarity_matrix,
        index=movie_user_matrix.index,
        columns=movie_user_matrix.index
    )

    return similarity_df


def get_user_high_rated_movies(ratings, user_id, min_rating=4.0):
    user_ratings = ratings[ratings["userId"] == user_id]

    high_rated = user_ratings[user_ratings["rating"] >= min_rating]

    return high_rated.sort_values(
        by="rating",
        ascending=False
    )


def recommend_collaborative(user_id, top_n=10):
    ratings, movies, links = load_movielens_data()

    if user_id not in ratings["userId"].unique():
        return {
            "error": "User not found",
            "user_id": user_id,
            "recommendations": []
        }

    user_item_matrix = build_user_item_matrix(ratings)
    similarity_df = build_item_similarity_matrix(user_item_matrix)

    high_rated_movies = get_user_high_rated_movies(ratings, user_id)

    if high_rated_movies.empty:
        return {
            "error": "User has no high-rated movies",
            "user_id": user_id,
            "recommendations": []
        }

    watched_movie_ids = set(
        ratings[ratings["userId"] == user_id]["movieId"].tolist()
    )

    recommendation_scores = {}

    for _, row in high_rated_movies.iterrows():
        movie_id = row["movieId"]
        user_rating = row["rating"]

        if movie_id not in similarity_df.index:
            continue

        similar_movies = similarity_df[movie_id].sort_values(
            ascending=False
        ).iloc[1:50]

        for similar_movie_id, similarity_score in similar_movies.items():
            if similar_movie_id in watched_movie_ids:
                continue

            weighted_score = similarity_score * user_rating

            if similar_movie_id not in recommendation_scores:
                recommendation_scores[similar_movie_id] = 0

            recommendation_scores[similar_movie_id] += weighted_score

    sorted_recommendations = sorted(
        recommendation_scores.items(),
        key=lambda x: x[1],
        reverse=True
    )[:top_n]

    recommendations = []

    for movie_id, score in sorted_recommendations:
        movie_info = movies[movies["movieId"] == movie_id]
        link_info = links[links["movieId"] == movie_id]

        if movie_info.empty:
            continue

        movie_row = movie_info.iloc[0]

        tmdb_id = None
        imdb_id = None

        if not link_info.empty:
            tmdb_value = link_info.iloc[0]["tmdbId"]
            imdb_value = link_info.iloc[0]["imdbId"]

            if tmdb_value != 0:
                tmdb_id = int(tmdb_value)

            imdb_id = int(imdb_value)

        recommendations.append({
            "movieLensId": int(movie_id),
            "tmdbId": tmdb_id,
            "imdbId": imdb_id,
            "title": movie_row["title"],
            "genres": movie_row["genres"].split("|"),
            "score": round(float(score), 4)
        })

    return {
        "user_id": user_id,
        "model": "collaborative_filtering_item_based",
        "recommendations": recommendations
    }


if __name__ == "__main__":
    results = recommend_collaborative(user_id=1, top_n=10)

    print("\nCollaborative Recommendations for User 1:\n")

    for movie in results["recommendations"]:
        print(movie)