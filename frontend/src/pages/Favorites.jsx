import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Lock } from "lucide-react";

import MovieRow from "../components/MovieRow";
import { getFavorites } from "../utils/favorites";
import { getAuthUser } from "../utils/authStorage";

function Favorites() {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const user = getAuthUser();
    setAuthUser(user);

    if (!user) {
      return;
    }

    setFavorites(getFavorites());
  }, []);

  if (!authUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-4 text-white">
        <div className="max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <Lock size={30} />
          </div>

          <h1 className="mt-6 text-3xl font-black">Login Required</h1>

          <p className="mt-3 text-sm leading-7 text-zinc-400">
            Favorites are linked to your MovieMuse account. Please login first
            to view and manage your saved movies.
          </p>

          <div className="mt-7 flex justify-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
            >
              Login
            </button>

            <Link
              to="/"
              className="rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20"
            >
              Back Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

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

          <div className="mt-14 max-w-3xl pb-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-red-400">
              <Heart size={15} fill="currentColor" />
              Personal Collection
            </div>

            <h1 className="text-4xl font-black sm:text-6xl">
              My Favorites
            </h1>

            <p className="mt-5 text-sm leading-7 text-zinc-300 sm:text-base">
              Welcome back, {authUser.name}. These are the movies you saved
              while exploring MovieMuse.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-4 py-10 sm:px-8 lg:px-12">
        {favorites.length > 0 ? (
          <MovieRow title="Saved Movies" movies={favorites} loading={false} />
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
            <Heart className="mx-auto text-red-500" size={42} />
            <h2 className="mt-4 text-2xl font-black">
              No favorites yet
            </h2>
            <p className="mt-2 text-zinc-400">
              Open a movie details page and click Add to Favorites.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Favorites;