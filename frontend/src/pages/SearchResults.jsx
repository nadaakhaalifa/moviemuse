import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Filter,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
} from "lucide-react";

import MovieCard from "../components/MovieCard";
import {
  searchMovies,
  getContentRecommendations,
  getSimilarMovies,
} from "../api/movieApi";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [matchedMovie, setMatchedMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const [searchMode, setSearchMode] = useState("content_based");
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    async function loadResults() {
      if (!query.trim()) {
        setMovies([]);
        setMatchedMovie(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const searchResults = await searchMovies(query);

        if (searchResults.length === 0) {
          setMovies([]);
          setMatchedMovie(null);
          return;
        }

        const bestMatch = searchResults[0];
        setMatchedMovie(bestMatch);

        let recommendations = [];

        try {
          recommendations = await getContentRecommendations(bestMatch.title);
          setSearchMode("content_based");
        } catch (error) {
          console.error("Content-based recommendations failed:", error);
        }

        if (!recommendations || recommendations.length === 0) {
          recommendations = await getSimilarMovies(bestMatch.id);
          setSearchMode("tmdb_similar");
        }

        setMovies(recommendations.slice(0, 15));
      } catch (error) {
        console.error("Failed to search movies:", error);
        setMovies([]);
        setMatchedMovie(null);
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
      results.sort(
        (a, b) => Number(b.vote_average || 0) - Number(a.vote_average || 0)
      );
    }

    if (sortBy === "popularity") {
      results.sort(
        (a, b) => Number(b.popularity || 0) - Number(a.popularity || 0)
      );
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
      <section
        className="relative min-h-[620px] border-b border-white/10 bg-cover bg-center"
        style={{
          backgroundImage: matchedMovie?.backdrop_url
            ? `linear-gradient(to right, rgba(5,5,5,0.98) 0%, rgba(5,5,5,0.88) 38%, rgba(5,5,5,0.55) 100%), linear-gradient(to top, #050505 0%, rgba(5,5,5,0.1) 65%), url(${matchedMovie.backdrop_url})`
            : "linear-gradient(to-br, #09090b, #000, rgba(127, 29, 29, 0.35))",
        }}
      >
        <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-8 lg:px-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-sm text-zinc-200 backdrop-blur transition hover:bg-white/10"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          {loading ? (
            <div className="grid min-h-[500px] items-center">
              <div>
                <div className="mb-5 h-8 w-48 animate-pulse rounded-full bg-zinc-800" />
                <div className="h-16 max-w-2xl animate-pulse rounded-2xl bg-zinc-800" />
                <div className="mt-4 h-24 max-w-xl animate-pulse rounded-2xl bg-zinc-900" />
              </div>
            </div>
          ) : matchedMovie ? (
            <div className="grid min-h-[520px] items-center gap-10 py-10 lg:grid-cols-[320px_1fr] xl:grid-cols-[380px_1fr]">
              <Link
                to={`/movie/${matchedMovie.id}`}
                className="mx-auto w-[230px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur-xl sm:w-[300px] lg:mx-0 xl:w-[340px]"
              >
                {matchedMovie.poster_url ? (
                  <img
                    src={matchedMovie.poster_url}
                    alt={matchedMovie.title}
                    className="aspect-[2/3] w-full rounded-[1.5rem] object-cover"
                  />
                ) : (
                  <div className="aspect-[2/3] w-full rounded-[1.5rem] bg-zinc-900" />
                )}
              </Link>

              <div className="max-w-4xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-red-400">
                  <Search size={15} />
                  Main matched movie
                </div>

                <h1 className="text-5xl font-black leading-tight sm:text-6xl lg:text-8xl">
                  {matchedMovie.title}
                </h1>

                <p className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
                  Because you searched “{query}”
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-zinc-300">
                  <span className="flex items-center gap-1 rounded-full bg-yellow-500/10 px-3 py-1 font-bold text-yellow-400">
                    <Star size={15} fill="currentColor" />
                    {Number(matchedMovie.vote_average || 0).toFixed(1)}
                  </span>

                  <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
                    <Calendar size={15} />
                    {matchedMovie.release_date?.slice(0, 4) || "N/A"}
                  </span>

                  <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 font-bold text-red-300">
                    {searchMode === "content_based"
                      ? "Content-Based Discovery"
                      : "Similar Movie Discovery"}
                  </span>
                </div>

                <p className="mt-6 max-w-3xl text-sm leading-7 text-zinc-200 sm:text-base lg:text-lg">
                  {matchedMovie.overview}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to={`/movie/${matchedMovie.id}`}
                    className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-black transition hover:scale-105 hover:bg-zinc-200"
                  >
                    View Details
                  </Link>

                  <a
                    href="#recommendations"
                    className="rounded-xl border border-white/10 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:scale-105 hover:bg-white/20"
                  >
                    See Recommendations
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid min-h-[520px] place-items-center text-center">
              <div>
                <Sparkles className="mx-auto text-red-500" size={44} />
                <h1 className="mt-4 text-4xl font-black">
                  No movie match found
                </h1>
                <p className="mt-2 text-zinc-400">
                  Try another movie title.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section
        id="recommendations"
        className="mx-auto max-w-[1600px] px-4 py-10 sm:px-8 lg:px-12"
      >
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-300">
                <SlidersHorizontal size={18} className="text-red-400" />
                Discovery Controls
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                Filter and sort recommended movies.
              </p>
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
                    Sort: Recommendation
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

        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-red-300">
              <Sparkles size={13} />
              Recommended discovery
            </div>

            <h2 className="text-2xl font-black sm:text-3xl">
              Similar movies you may like
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Recommendations generated from the matched movie above.
            </p>
          </div>

          <span className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-400 sm:block">
            {filteredMovies.length} movies
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {Array.from({ length: 15 }).map((_, index) => (
              <div
                key={index}
                className="h-[280px] animate-pulse rounded-2xl bg-zinc-900"
              />
            ))}
          </div>
        ) : filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
            <Sparkles className="mx-auto text-red-500" size={42} />
            <h2 className="mt-4 text-2xl font-black">
              No similar movies found
            </h2>
            <p className="mt-2 text-zinc-400">
              Try another movie title or remove filters.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default SearchResults;