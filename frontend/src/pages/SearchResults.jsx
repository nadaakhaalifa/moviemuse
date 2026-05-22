import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Filter, Search, SlidersHorizontal } from "lucide-react";

import MovieCard from "../components/MovieCard";
import { searchMovies } from "../api/movieApi";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    async function loadResults() {
      if (!query.trim()) {
        setMovies([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const results = await searchMovies(query);
        setMovies(results);
      } catch (error) {
        console.error("Failed to search movies:", error);
      } finally {
        setLoading(false);
      }
    }

    loadResults();
  }, [query]);

  const genres = useMemo(() => {
    const genreSet = new Set();

    movies.forEach((movie) => {
      movie.genres?.forEach((genre) => genreSet.add(genre));
    });

    return ["All", ...Array.from(genreSet)];
  }, [movies]);

  const filteredMovies = useMemo(() => {
    let results = [...movies];

    if (selectedGenre !== "All") {
      results = results.filter((movie) =>
        movie.genres?.includes(selectedGenre)
      );
    }

    if (sortBy === "rating") {
      results.sort((a, b) => Number(b.vote_average || 0) - Number(a.vote_average || 0));
    }

    if (sortBy === "popularity") {
      results.sort((a, b) => Number(b.popularity || 0) - Number(a.popularity || 0));
    }

    if (sortBy === "newest") {
      results.sort((a, b) =>
        String(b.release_date || "").localeCompare(String(a.release_date || ""))
      );
    }

    return results;
  }, [movies, selectedGenre, sortBy]);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="border-b border-white/10 bg-gradient-to-br from-zinc-950 via-black to-red-950/30">
        <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-8 lg:px-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-zinc-200 backdrop-blur transition hover:bg-white/10"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="mt-14 max-w-4xl pb-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-red-400">
              <Search size={15} />
              Smart Search
            </div>

            <h1 className="text-4xl font-black sm:text-6xl">
              Results for “{query}”
            </h1>

            <p className="mt-5 text-sm leading-7 text-zinc-300 sm:text-base">
              Explore movie results with clean filtering, sorting, posters,
              ratings, genres, and release information.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-4 py-8 sm:px-8 lg:px-12">
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-300">
              <SlidersHorizontal size={18} className="text-red-400" />
              Search Controls
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:flex">
              <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm">
                <Filter size={16} className="text-zinc-500" />
                <select
                  value={selectedGenre}
                  onChange={(event) => setSelectedGenre(event.target.value)}
                  className="bg-transparent text-white outline-none"
                >
                  {genres.map((genre) => (
                    <option key={genre} value={genre} className="bg-zinc-950">
                      {genre}
                    </option>
                  ))}
                </select>
              </label>

              <label className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm">
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="bg-transparent text-white outline-none"
                >
                  <option value="relevance" className="bg-zinc-950">
                    Sort: Relevance
                  </option>
                  <option value="rating" className="bg-zinc-950">
                    Sort: Highest Rating
                  </option>
                  <option value="popularity" className="bg-zinc-950">
                    Sort: Popularity
                  </option>
                  <option value="newest" className="bg-zinc-950">
                    Sort: Newest
                  </option>
                </select>
              </label>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="h-[260px] animate-pulse rounded-2xl bg-zinc-900"
              />
            ))}
          </div>
        ) : filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
            <h2 className="text-2xl font-black">No movies found</h2>
            <p className="mt-2 text-zinc-400">
              Try another keyword or remove filters.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default SearchResults;