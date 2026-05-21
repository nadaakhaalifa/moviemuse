import os
import requests
from dotenv import load_dotenv


load_dotenv()

TMDB_ACCESS_TOKEN = os.getenv("TMDB_ACCESS_TOKEN")
TMDB_BASE_URL = os.getenv("TMDB_BASE_URL", "https://api.themoviedb.org/3")
TMDB_IMAGE_BASE_URL = os.getenv("TMDB_IMAGE_BASE_URL", "https://image.tmdb.org/t/p/w500")
TMDB_BACKDROP_BASE_URL = os.getenv("TMDB_BACKDROP_BASE_URL", "https://image.tmdb.org/t/p/original")


def get_headers():
    return {
        "Authorization": f"Bearer {TMDB_ACCESS_TOKEN}",
        "Content-Type": "application/json;charset=utf-8"
    }


def build_poster_url(poster_path):
    if not poster_path:
        return None
    return f"{TMDB_IMAGE_BASE_URL}{poster_path}"


def build_backdrop_url(backdrop_path):
    if not backdrop_path:
        return None
    return f"{TMDB_BACKDROP_BASE_URL}{backdrop_path}"


def get_tmdb_movie_details(tmdb_id):
    if not TMDB_ACCESS_TOKEN:
        return {"error": "TMDB_ACCESS_TOKEN is missing. Add it to backend/.env"}

    url = f"{TMDB_BASE_URL}/movie/{tmdb_id}"

    params = {
        "append_to_response": "videos,credits,keywords"
    }

    response = requests.get(
        url,
        headers=get_headers(),
        params=params,
        timeout=10
    )

    if response.status_code != 200:
        return {
            "error": "Failed to fetch TMDB movie details",
            "status_code": response.status_code,
            "details": response.text
        }

    data = response.json()

    trailers = []
    for video in data.get("videos", {}).get("results", []):
        if video.get("site") == "YouTube" and video.get("type") == "Trailer":
            trailers.append({
                "name": video.get("name"),
                "key": video.get("key"),
                "url": f"https://www.youtube.com/watch?v={video.get('key')}"
            })

    cast = []
    for person in data.get("credits", {}).get("cast", [])[:10]:
        cast.append({
            "name": person.get("name"),
            "character": person.get("character"),
            "profile_path": person.get("profile_path"),
            "profile_url": build_poster_url(person.get("profile_path"))
        })

    director = None
    for person in data.get("credits", {}).get("crew", []):
        if person.get("job") == "Director":
            director = person.get("name")
            break

    keywords = []
    for keyword in data.get("keywords", {}).get("keywords", []):
        keywords.append(keyword.get("name"))

    return {
        "id": data.get("id"),
        "title": data.get("title"),
        "overview": data.get("overview"),
        "poster_path": data.get("poster_path"),
        "poster_url": build_poster_url(data.get("poster_path")),
        "backdrop_path": data.get("backdrop_path"),
        "backdrop_url": build_backdrop_url(data.get("backdrop_path")),
        "release_date": data.get("release_date"),
        "runtime": data.get("runtime"),
        "vote_average": data.get("vote_average"),
        "vote_count": data.get("vote_count"),
        "popularity": data.get("popularity"),
        "genres": [genre["name"] for genre in data.get("genres", [])],
        "director": director,
        "cast": cast,
        "keywords": keywords,
        "trailers": trailers
    }


if __name__ == "__main__":
    movie = get_tmdb_movie_details(19995)
    print(movie)