import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  Crown,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { getAuthUser } from "../utils/authStorage";
import { getMySubscription } from "../api/paymentApi";

function PremiumGate({ children }) {
  const [user, setUser] = useState(getAuthUser());
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkPremiumAccess() {
      const currentUser = getAuthUser();
      setUser(currentUser);

      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const data = await getMySubscription();

        setSubscription(data);
      } catch (error) {
        console.error("Failed to check premium access:", error);

        setSubscription({
          is_premium: false,
          status: "inactive",
        });
      } finally {
        setLoading(false);
      }
    }

    checkPremiumAccess();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-4 text-white">
        <div className="text-center">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent" />
          <h1 className="text-2xl font-black">Checking premium access...</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Verifying your MovieMuse subscription status.
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-zinc-950 to-red-950/30 px-4 py-10">
          <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
              <Lock size={34} />
            </div>

            <h1 className="mt-6 text-3xl font-black">
              Login Required
            </h1>

            <p className="mt-3 text-sm leading-7 text-zinc-400">
              Analytics is a premium MovieMuse feature. Please login first to
              check your subscription access.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/login"
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Login
              </Link>

              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20"
              >
                <ArrowLeft size={16} />
                Back Home
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!subscription?.is_premium) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-zinc-950 to-yellow-950/30 px-4 py-10">
          <div className="w-full max-w-2xl rounded-[2rem] border border-yellow-500/20 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-zinc-200 backdrop-blur transition hover:bg-white/10"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-500/10 text-yellow-300">
              <Crown size={36} />
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-yellow-300">
              <Sparkles size={14} />
              Premium Feature
            </div>

            <h1 className="mt-5 text-4xl font-black sm:text-5xl">
              Unlock Analytics Dashboard
            </h1>

            <p className="mt-5 text-sm leading-7 text-zinc-300 sm:text-base">
              Analytics gives you access to dataset insights, genre
              distributions, rating patterns, popularity behavior, and movie
              data intelligence. Upgrade to Premium to access this dashboard.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <BarChart3 className="text-red-400" size={24} />
                <h3 className="mt-3 font-black">Movie Insights</h3>
                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Explore trends from the movie dataset.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <ShieldCheck className="text-yellow-300" size={24} />
                <h3 className="mt-3 font-black">Premium Access</h3>
                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Subscription-based feature control.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <Sparkles className="text-red-400" size={24} />
                <h3 className="mt-3 font-black">Data Product</h3>
                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  SaaS-style premium experience.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/pricing"
                className="rounded-xl bg-yellow-500 px-6 py-3 text-center text-sm font-black text-black transition hover:bg-yellow-400"
              >
                Upgrade to Premium
              </Link>

              <Link
                to="/profile"
                className="rounded-xl border border-white/10 bg-white/10 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-white/20"
              >
                View Profile
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return children;
}

export default PremiumGate;