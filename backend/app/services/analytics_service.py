from app.services.movie_service import MOVIES_DF


def get_overview_stats():
    total_movies = len(MOVIES_DF)

    average_rating = MOVIES_DF["vote_average"].mean()
    average_popularity = MOVIES_DF["popularity"].mean()
    total_votes = MOVIES_DF["vote_count"].sum()

    movies_with_revenue = MOVIES_DF[MOVIES_DF["revenue"] > 0]
    total_revenue = movies_with_revenue["revenue"].sum()

    return {
        "total_movies": int(total_movies),
        "average_rating": round(float(average_rating), 2),
        "average_popularity": round(float(average_popularity), 2),
        "total_votes": int(total_votes),
        "movies_with_revenue": int(len(movies_with_revenue)),
        "total_revenue": int(total_revenue)
    }


def get_genre_distribution():
    genre_counts = {}

    for genres in MOVIES_DF["genres_list"]:
        for genre in genres:
            genre_counts[genre] = genre_counts.get(genre, 0) + 1

    sorted_genres = sorted(
        genre_counts.items(),
        key=lambda x: x[1],
        reverse=True
    )

    return [
        {
            "genre": genre,
            "count": count
        }
        for genre, count in sorted_genres
    ]


def get_top_popular_movies(limit=10):
    results = MOVIES_DF.sort_values(
        by="popularity",
        ascending=False
    ).head(limit)

    movies = []

    for _, movie in results.iterrows():
        movies.append({
            "id": int(movie["id"]),
            "title": movie["title_x"],
            "popularity": round(float(movie["popularity"]), 2),
            "vote_average": float(movie["vote_average"]),
            "vote_count": int(movie["vote_count"])
        })

    return movies


def get_top_revenue_movies(limit=10):
    results = MOVIES_DF[MOVIES_DF["revenue"] > 0].sort_values(
        by="revenue",
        ascending=False
    ).head(limit)

    movies = []

    for _, movie in results.iterrows():
        movies.append({
            "id": int(movie["id"]),
            "title": movie["title_x"],
            "revenue": int(movie["revenue"]),
            "budget": int(movie["budget"]),
            "profit": int(movie["revenue"] - movie["budget"]),
            "vote_average": float(movie["vote_average"])
        })

    return movies


def get_movies_by_year():
    df = MOVIES_DF.copy()

    df = df[df["release_date"].notna()]
    df = df[df["release_date"] != ""]

    df["year"] = df["release_date"].str[:4]

    year_counts = (
        df.groupby("year")
        .size()
        .reset_index(name="count")
        .sort_values(by="year")
    )

    return [
        {
            "year": str(row["year"]),
            "count": int(row["count"])
        }
        for _, row in year_counts.iterrows()
    ]


def get_rating_distribution():
    df = MOVIES_DF.copy()

    bins = {
        "0-2": len(df[(df["vote_average"] >= 0) & (df["vote_average"] < 2)]),
        "2-4": len(df[(df["vote_average"] >= 2) & (df["vote_average"] < 4)]),
        "4-6": len(df[(df["vote_average"] >= 4) & (df["vote_average"] < 6)]),
        "6-8": len(df[(df["vote_average"] >= 6) & (df["vote_average"] < 8)]),
        "8-10": len(df[(df["vote_average"] >= 8) & (df["vote_average"] <= 10)]),
    }

    return [
        {
            "rating_range": rating_range,
            "count": count
        }
        for rating_range, count in bins.items()
    ]