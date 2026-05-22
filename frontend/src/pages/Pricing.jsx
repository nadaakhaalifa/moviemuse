import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Crown, Sparkles } from "lucide-react";

import { createCheckoutSession } from "../api/paymentApi";
import { getAuthUser } from "../utils/authStorage";

function Pricing() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubscribe() {
    const user = getAuthUser();

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await createCheckoutSession();

      window.location.href = data.checkout_url;
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Could not start checkout. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-red-950/30 px-4 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1300px]">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-zinc-200 backdrop-blur transition hover:bg-white/10"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="mx-auto mt-16 max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-red-400">
              <Sparkles size={15} />
              MovieMuse Premium
            </div>

            <h1 className="text-4xl font-black sm:text-6xl">
              Upgrade your movie discovery
            </h1>

            <p className="mt-5 text-sm leading-7 text-zinc-300 sm:text-base">
              Unlock premium features for advanced discovery, future personalized
              recommendations, and extended analytics.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-md rounded-[2rem] border border-red-500/30 bg-white/[0.04] p-6 shadow-2xl shadow-red-950/30 backdrop-blur-xl sm:p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
              <Crown size={30} />
            </div>

            <h2 className="mt-6 text-3xl font-black">Premium Plan</h2>

            <div className="mt-4 flex items-end gap-2">
              <span className="text-5xl font-black">$9.99</span>
              <span className="pb-2 text-zinc-400">/ month</span>
            </div>

            <div className="mt-7 space-y-4">
              {[
                "Premium movie discovery experience",
                "Advanced analytics access",
                "Future personalized recommendations",
                "Premium badge and subscription status",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                    <Check size={16} />
                  </span>
                  <span className="text-sm text-zinc-300">{feature}</span>
                </div>
              ))}
            </div>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="mt-8 w-full rounded-2xl bg-red-600 px-5 py-4 font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Starting checkout..." : "Start Premium Checkout"}
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-zinc-500">
              Stripe test mode. Use a Stripe test card during development.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Pricing;