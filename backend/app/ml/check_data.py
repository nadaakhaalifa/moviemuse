import pandas as pd
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[3]

TMDB_MOVIES_PATH = BASE_DIR / "data" / "tmdb" / "tmdb_5000_movies.csv"
TMDB_CREDITS_PATH = BASE_DIR / "data" / "tmdb" / "tmdb_5000_credits.csv"

MOVIELENS_MOVIES_PATH = BASE_DIR / "data" / "movielens" / "movies.csv"
MOVIELENS_RATINGS_PATH = BASE_DIR / "data" / "movielens" / "ratings.csv"
MOVIELENS_LINKS_PATH = BASE_DIR / "data" / "movielens" / "links.csv"
MOVIELENS_TAGS_PATH = BASE_DIR / "data" / "movielens" / "tags.csv"


def check_file(path, name):
    if not path.exists():
        print(f"❌ Missing: {name}")
        print(f"Expected path: {path}")
        return None

    df = pd.read_csv(path)
    print(f"✅ {name}")
    print(f"Shape: {df.shape}")
    print(f"Columns: {list(df.columns)}")
    print("-" * 70)
    return df


def main():
    print("\nChecking MovieMuse datasets...\n")

    check_file(TMDB_MOVIES_PATH, "TMDB Movies")
    check_file(TMDB_CREDITS_PATH, "TMDB Credits")
    check_file(MOVIELENS_MOVIES_PATH, "MovieLens Movies")
    check_file(MOVIELENS_RATINGS_PATH, "MovieLens Ratings")
    check_file(MOVIELENS_LINKS_PATH, "MovieLens Links")
    check_file(MOVIELENS_TAGS_PATH, "MovieLens Tags")


if __name__ == "__main__":
    main()