from app.ml.collaborative import recommend_collaborative
from app.services.movie_service import get_movie_by_id


def normalize_score(value, max_value):
    if max_value == 0:
        return 0

    return value / max_value


def recommend_hybrid(user_id, top_n=10):
    collaborative_results = recommend_collaborative(
        user_id=user_id,
        top_n=50
    )

    if collaborative_results.get("error"):
        return collaborative_results

    collaborative_movies = collaborative_results["recommendations"]

    if not collaborative_movies:
        return {
            "user_id": user_id,
            "model": "hybrid_recommendation",
            "recommendations": []
        }

    max_collaborative_score = max(
        movie["score"] for movie in collaborative_movies
    )

    hybrid_recommendations = []

    for movie in collaborative_movies:
        tmdb_id = movie.get("tmdbId")

        if tmdb_id is None:
            continue

        tmdb_movie = get_movie_by_id(tmdb_id)

        if tmdb_movie is None:
            continue

        collaborative_score = normalize_score(
            movie["score"],
            max_collaborative_score
        )

        rating_score = tmdb_movie["vote_average"] / 10

        popularity_score = normalize_score(
            tmdb_movie["popularity"],
            100
        )

        popularity_score = min(popularity_score, 1)

        final_score = (
            0.60 * collaborative_score +
            0.25 * rating_score +
            0.15 * popularity_score
        )

        hybrid_recommendations.append({
            "id": tmdb_movie["id"],
            "movieLensId": movie["movieLensId"],
            "title": tmdb_movie["title"],
            "overview": tmdb_movie["overview"],
            "genres": tmdb_movie["genres"],
            "director": tmdb_movie["director"],
            "release_date": tmdb_movie["release_date"],
            "runtime": tmdb_movie["runtime"],
            "vote_average": tmdb_movie["vote_average"],
            "popularity": tmdb_movie["popularity"],
            "collaborative_score": round(float(collaborative_score), 4),
            "rating_score": round(float(rating_score), 4),
            "popularity_score": round(float(popularity_score), 4),
            "final_score": round(float(final_score), 4)
        })

    hybrid_recommendations = sorted(
        hybrid_recommendations,
        key=lambda x: x["final_score"],
        reverse=True
    )[:top_n]

    return {
        "user_id": user_id,
        "model": "hybrid_recommendation",
        "formula": "0.60 collaborative + 0.25 rating + 0.15 popularity",
        "recommendations": hybrid_recommendations
    }


if __name__ == "__main__":
    results = recommend_hybrid(user_id=1, top_n=10)

    print("\nHybrid Recommendations for User 1:\n")

    for movie in results["recommendations"]:
        print(movie)