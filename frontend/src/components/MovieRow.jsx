import MovieCard from "./MovieCard";

function MovieRow({ title, movies, loading }) {
  return (
    <section className="mt-10 sm:mt-12">
      <div className="mb-4 flex items-center justify-between sm:mb-5">
        <div>
          <h2 className="text-lg font-black text-white sm:text-2xl">
            {title}
          </h2>
          <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
            Curated movie collection
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex gap-3 overflow-hidden sm:gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-[210px] w-[132px] shrink-0 animate-pulse rounded-2xl bg-zinc-900 sm:h-[250px] sm:w-[160px] md:h-[280px] md:w-[180px]"
            />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-400">
          No movies found.
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-5 scrollbar-hide sm:gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
}

export default MovieRow;