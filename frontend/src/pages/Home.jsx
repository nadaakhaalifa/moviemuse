import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Play,
  BarChart3,
  Sparkles,
  Star,
  LogOut,
  Heart,
  Crown,
  UserCircle,
} from "lucide-react";

import MovieRow from "../components/MovieRow";
import {
  getPopularMovies,
  getTopRatedMovies,
} from "../api/movieApi";
import { getMySubscription } from "../api/paymentApi";
import { getAuthUser, logoutUser } from "../utils/authStorage";

function Home() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [heroMovie, setHeroMovie] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState(getAuthUser());
  const [isPremium, setIsPremium] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(false);

  const navigate = useNavigate();

  function handleLogout() {
    logoutUser();
    setAuthUser(null);
    setIsPremium(false);
  }

  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true);

        const [popular, topRated] = await Promise.all([
          getPopularMovies(),
          getTopRatedMovies(),
        ]);

        setPopularMovies(popular);
        setTopRatedMovies(topRated);

        if (popular.length > 0) {
          const randomIndex = Math.floor(Math.random() * popular.length);
          setHeroMovie(popular[randomIndex]);
        }
      } catch (error) {
        console.error("Failed to load movies:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, []);

  useEffect(() => {
    async function loadSubscription() {
      if (!authUser) {
        setIsPremium(false);
        return;
      }

      try {
        setCheckingSubscription(true);

        const subscription = await getMySubscription();

        setIsPremium(Boolean(subscription.is_premium));
      } catch (error) {
        console.error("Failed to load subscription:", error);
        setIsPremium(false);
      } finally {
        setCheckingSubscription(false);
      }
    }

    loadSubscription();
  }, [authUser]);

  function handleSearch(event) {
    event.preventDefault();

    if (!query.trim()) {
      return;
    }

    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="text-xl font-black tracking-wide text-red-600 sm:text-2xl"
            >
              MovieMuse
            </Link>

            <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-red-400 lg:hidden">
              AI Movies
            </span>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex w-full items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2.5 shadow-lg shadow-black/20 lg:max-w-[520px]"
          >
            <Search size={17} className="shrink-0 text-zinc-400" />

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search movies..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
            />
          </form>

          <div className="flex flex-wrap items-center gap-2">
            {authUser && isPremium ? (
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-sm font-black text-yellow-200 transition hover:bg-yellow-500/20"
              >
                <Crown size={15} fill="currentColor" />
                Premium
              </Link>
            ) : (
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-sm font-bold text-yellow-200 transition hover:bg-yellow-500/20"
              >
                <Crown size={15} />
                {checkingSubscription ? "Checking..." : "Upgrade"}
              </Link>
            )}

            <Link
              to="/favorites"
              className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-200 transition hover:bg-red-500/20"
            >
              <Heart size={15} fill="currentColor" />
              Favorites
            </Link>

            {authUser ? (
              <>
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/20"
                >
                  <UserCircle size={15} />
                  {authUser.name}
                </Link>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/20"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/20"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <section
        className="relative min-h-[820px] bg-cover bg-center pt-44 lg:pt-28"
        style={{
          backgroundImage: heroMovie?.backdrop_url
            ? `linear-gradient(to right, rgba(5,5,5,1) 0%, rgba(5,5,5,0.88) 32%, rgba(5,5,5,0.35) 100%), linear-gradient(to top, #050505 0%, rgba(5,5,5,0.05) 45%), url(${heroMovie.backdrop_url})`
            : "linear-gradient(to top, #050505, #18181b)",
        }}
      >
        <div className="mx-auto grid min-h-[650px] max-w-[1600px] items-center gap-10 px-4 pb-16 sm:px-8 md:grid-cols-[1.1fr_0.9fr] lg:px-12">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-red-400 sm:text-xs">
              <Sparkles size={14} />
              Data-driven discovery
            </div>

            <h1 className="max-w-4xl text-4xl font-black leading-[0.95] sm:text-6xl lg:text-8xl">
              {heroMovie?.title || "MovieMuse"}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-zinc-300">
              <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
                <Star size={14} className="text-yellow-400" fill="currentColor" />
                {Number(heroMovie?.vote_average || 0).toFixed(1)}
              </span>

              <span>{heroMovie?.release_date?.slice(0, 4) || "2026"}</span>
              <span className="hidden h-1 w-1 rounded-full bg-zinc-500 sm:block" />
              <span>Personalized Movie Platform</span>
            </div>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-200 sm:text-base lg:text-lg">
              {heroMovie?.overview ||
                "A Netflix-style movie recommendation platform powered by data mining, content-based filtering, collaborative filtering, and modern web engineering."}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#movies"
                className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-black transition hover:scale-105 hover:bg-zinc-200 sm:px-6"
              >
                <Play size={18} fill="black" />
                Explore Movies
              </a>

              <Link
                to="/analytics"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:scale-105 hover:bg-white/20 sm:px-6"
              >
                <BarChart3 size={18} />
                View Analytics
              </Link>
            </div>
          </div>

          <div className="hidden justify-center md:flex">
            <div className="relative">
              <div className="absolute -inset-6 rounded-[2rem] bg-red-600/20 blur-3xl" />

              <div className="relative w-[280px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur-xl lg:w-[340px]">
                <div className="overflow-hidden rounded-[1.5rem]">
                  {heroMovie?.poster_url ? (
                    <img
                      src={heroMovie.poster_url}
                      alt={heroMovie.title}
                      className="aspect-[2/3] w-full object-cover"
                    />
                  ) : (
                    <div className="aspect-[2/3] w-full bg-zinc-900" />
                  )}
                </div>

                <div className="p-4">
                  <h3 className="line-clamp-1 text-lg font-black">
                    {heroMovie?.title || "Featured Movie"}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
                    {heroMovie?.overview}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        id="movies"
        className="mx-auto max-w-[1600px] px-4 pb-20 sm:px-8 lg:px-12"
      >
        <MovieRow
          title="Popular Movies"
          movies={popularMovies}
          loading={loading}
        />

        <MovieRow
          title="Top Rated Movies"
          movies={topRatedMovies}
          loading={loading}
        />
      </div>
    </main>
  );
}

export default Home;