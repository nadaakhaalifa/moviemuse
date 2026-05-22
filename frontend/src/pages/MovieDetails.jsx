import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Play, Star } from "lucide-react";

import MovieRow from "../components/MovieRow";
import {
  getMovieDetails,
  getContentRecommendations,
} from "../api/movieApi";

function MovieDetails() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMovie() {
      try {
        setLoading(true);

        const movieData = await getMovieDetails(id);
        setMovie(movieData);

        const recommendations = await getContentRecommendations(movieData.title);
        setSimilarMovies(recommendations);
      } catch (error) {
        console.error("Failed to load movie details:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMovie();
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
          <p className="text-zinc-400">Loading movie details...</p>
        </div>
      </main>
    );
  }

  if (!movie) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="text-center">
          <h1 className="text-3xl font-black">Movie not found</h1>
          <Link to="/" className="mt-4 inline-block text-red-500">
            Back home
          </Link>
        </div>
      </main>
    );
  }

  const trailer = movie.trailers?.[0];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <section
        className="relative bg-cover bg-center"
        style={{
          backgroundImage: movie.backdrop_url
            ? `linear-gradient(to right, rgba(5,5,5,0.98), rgba(5,5,5,0.86), rgba(5,5,5,0.65)), linear-gradient(to top, #050505 0%, rgba(5,5,5,0.2) 65%), url(${movie.backdrop_url})`
            : "linear-gradient(to top, #050505, #18181b)",
        }}
      >
        <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-8 lg:px-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-sm text-zinc-200 backdrop-blur transition hover:bg-white/10"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="grid min-h-[calc(100vh-80px)] items-center gap-8 py-10 lg:grid-cols-[340px_1fr] xl:grid-cols-[400px_1fr]">
            <div className="mx-auto w-[230px] overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/10 p-2 shadow-2xl backdrop-blur-xl sm:w-[300px] lg:mx-0 xl:w-[350px]">
              {movie.poster_url ? (
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="aspect-[2/3] w-full rounded-[1.3rem] object-cover"
                />
              ) : (
                <div className="aspect-[2/3] rounded-[1.3rem] bg-zinc-900" />
              )}
            </div>

            <div className="w-full max-w-4xl">
              <div className="mb-4 flex flex-wrap gap-2">
                {movie.genres?.slice(0, 5).map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-300"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <h1 className="break-words text-4xl font-black leading-tight sm:text-5xl xl:text-7xl">
                {movie.title}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-zinc-300">
                <span className="flex items-center gap-1 rounded-full bg-yellow-500/10 px-3 py-1 text-yellow-400">
                  <Star size={15} fill="currentColor" />
                  {Number(movie.vote_average || 0).toFixed(1)}
                </span>

                <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
                  <Calendar size={15} />
                  {movie.release_date?.slice(0, 4) || "N/A"}
                </span>

                <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
                  <Clock size={15} />
                  {movie.runtime || "N/A"} min
                </span>
              </div>

              <p className="mt-6 max-w-3xl text-sm leading-7 text-zinc-200 sm:text-base xl:text-lg">
                {movie.overview}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-widest text-zinc-500">
                    Director
                  </p>
                  <p className="mt-1 font-bold text-white">
                    {movie.director || "Unknown"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-widest text-zinc-500">
                    Popularity
                  </p>
                  <p className="mt-1 font-bold text-white">
                    {Number(movie.popularity || 0).toFixed(1)}
                  </p>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                {trailer && (
                  <a
                    href={trailer.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-black transition hover:scale-105 hover:bg-zinc-200"
                  >
                    <Play size={18} fill="black" />
                    Watch Trailer
                  </a>
                )}

                <button className="rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:scale-105 hover:bg-white/20">
                  Add to Watchlist
                </button>
              </div>

              {movie.cast?.length > 0 && (
                <div className="mt-9">
                  <h2 className="mb-4 text-xl font-black">Top Cast</h2>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                    {movie.cast.slice(0, 10).map((person) => (
                      <div
                        key={`${person.name}-${person.character}`}
                        className="rounded-2xl border border-white/10 bg-black/35 p-3 backdrop-blur"
                      >
                        <div className="aspect-square overflow-hidden rounded-xl bg-zinc-900">
                          {person.profile_url ? (
                            <img
                              src={person.profile_url}
                              alt={person.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-zinc-900" />
                          )}
                        </div>

                        <p className="mt-2 line-clamp-1 text-xs font-bold">
                          {person.name}
                        </p>
                        <p className="line-clamp-1 text-xs text-zinc-500">
                          {person.character}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-4 pb-20 sm:px-8 lg:px-12">
        <MovieRow
          title="Similar Movies"
          movies={similarMovies}
          loading={false}
        />
      </section>
    </main>
  );
}

export default MovieDetails;