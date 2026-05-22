import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Crown,
  Film,
  Heart,
  Mail,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";

import { getAuthUser } from "../utils/authStorage";
import { getFavorites } from "../utils/favorites";
import { getMySubscription } from "../api/paymentApi";

function ProfileStat({ icon: Icon, title, value, subtitle, compact = false }) {
  return (
    <div className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
        <Icon size={24} />
      </div>

      <p className="text-sm text-zinc-400">{title}</p>

      <h3
        className={`mt-2 min-w-0 font-black text-white ${
          compact
            ? "break-all text-base leading-6 sm:text-lg xl:text-xl"
            : "truncate text-2xl"
        }`}
        title={String(value)}
      >
        {value}
      </h3>

      <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>
    </div>
  );
}

function Profile() {
  const [user, setUser] = useState(getAuthUser());
  const [subscription, setSubscription] = useState(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loadingSubscription, setLoadingSubscription] = useState(true);

  useEffect(() => {
    async function loadProfileData() {
      setUser(getAuthUser());
      setFavoritesCount(getFavorites().length);

      try {
        setLoadingSubscription(true);

        const data = await getMySubscription();

        setSubscription(data);
      } catch (error) {
        console.error("Failed to load subscription:", error);

        setSubscription({
          is_premium: false,
          status: "inactive",
        });
      } finally {
        setLoadingSubscription(false);
      }
    }

    loadProfileData();
  }, []);

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-4 text-white">
        <div className="max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl">
          <User className="mx-auto text-red-500" size={46} />

          <h1 className="mt-6 text-3xl font-black">Login Required</h1>

          <p className="mt-3 text-sm leading-7 text-zinc-400">
            Please login to view your MovieMuse profile and subscription status.
          </p>

          <Link
            to="/login"
            className="mt-7 inline-block rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  const isPremium = subscription?.is_premium;
  const subscriptionStatus = subscription?.status || "inactive";

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <section className="border-b border-white/10 bg-gradient-to-br from-black via-zinc-950 to-red-950/30">
        <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-8 lg:px-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-zinc-200 backdrop-blur transition hover:bg-white/10"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="mt-14 grid gap-8 pb-12 lg:grid-cols-[1fr_360px] lg:items-end">
            <div className="min-w-0">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-red-400">
                <ShieldCheck size={15} />
                Account Center
              </div>

              <h1 className="break-words text-4xl font-black sm:text-6xl">
                Welcome, {user.name}
              </h1>

              <p className="mt-5 max-w-3xl text-sm leading-7 text-zinc-300 sm:text-base">
                Manage your MovieMuse account, subscription status, favorites,
                and premium access from one clean profile dashboard.
              </p>
            </div>

            <div
              className={`rounded-[2rem] border p-6 shadow-2xl backdrop-blur-xl ${
                isPremium
                  ? "border-yellow-500/30 bg-yellow-500/10"
                  : "border-white/10 bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                    isPremium
                      ? "bg-yellow-500/20 text-yellow-300"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  <Crown size={30} />
                </div>

                <div>
                  <p className="text-sm text-zinc-400">Subscription</p>
                  <h2
                    className={`text-2xl font-black ${
                      isPremium ? "text-yellow-300" : "text-white"
                    }`}
                  >
                    {loadingSubscription
                      ? "Checking..."
                      : isPremium
                      ? "Premium"
                      : "Free Plan"}
                  </h2>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-zinc-300">
                Status:{" "}
                <span className="font-bold text-white">
                  {subscriptionStatus}
                </span>
              </p>

              {!isPremium && (
                <Link
                  to="/pricing"
                  className="mt-5 inline-block w-full rounded-xl bg-red-600 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-red-700"
                >
                  Upgrade to Premium
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-4 py-10 sm:px-8 lg:px-12">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <ProfileStat
            icon={User}
            title="Account Name"
            value={user.name}
            subtitle="Registered MovieMuse user"
          />

          <ProfileStat
            icon={Mail}
            title="Email"
            value={user.email}
            subtitle="Used for login and verification"
            compact
          />

          <ProfileStat
            icon={Heart}
            title="Favorites"
            value={favoritesCount}
            subtitle="Movies saved in your collection"
          />

          <ProfileStat
            icon={Film}
            title="Plan"
            value={isPremium ? "Premium" : "Free"}
            subtitle="Current access level"
          />
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              {user.is_verified ? (
                <CheckCircle className="shrink-0 text-green-400" size={28} />
              ) : (
                <XCircle className="shrink-0 text-red-400" size={28} />
              )}

              <div className="min-w-0">
                <h2 className="text-xl font-black">Email Verification</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  {user.is_verified
                    ? "Your email is verified and your account is active."
                    : "Your email is not verified yet."}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <Crown
                className={`shrink-0 ${
                  isPremium ? "text-yellow-300" : "text-zinc-500"
                }`}
                size={28}
              />

              <div className="min-w-0">
                <h2 className="text-xl font-black">Premium Access</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  {isPremium
                    ? "Premium is active. You have access to premium-ready features."
                    : "Upgrade to unlock premium discovery and advanced features."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Profile;