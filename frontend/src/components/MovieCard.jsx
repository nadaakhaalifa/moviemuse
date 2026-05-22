import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group w-[132px] shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-red-500/50 sm:w-[160px] md:w-[180px] lg:w-[200px]"
    >
      <div className="aspect-[2/3] w-full overflow-hidden bg-zinc-900">
        {movie.poster_url ? (
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-3 text-center text-xs text-zinc-500">
            No Poster
          </div>
        )}
      </div>

      <div className="space-y-2 p-3">
        <h3 className="line-clamp-1 text-xs font-bold text-white sm:text-sm">
          {movie.title}
        </h3>

        <div className="flex items-center justify-between gap-2 text-[11px] text-zinc-400 sm:text-xs">
          <span className="rounded-full bg-yellow-500/10 px-2 py-1 text-yellow-400">
            ⭐ {Number(movie.vote_average || 0).toFixed(1)}
          </span>

          <span>{movie.release_date?.slice(0, 4) || "N/A"}</span>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;