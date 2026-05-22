import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, User, Lock, Sparkles } from "lucide-react";

import { registerUser } from "../api/authApi";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      setLoading(true);

      await registerUser(form);

      navigate(`/verify-email?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-zinc-950 to-red-950/30 px-4 py-10">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-zinc-200 backdrop-blur transition hover:bg-white/10"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-red-400">
              <Sparkles size={14} />
              Join MovieMuse
            </div>

            <h1 className="text-3xl font-black sm:text-4xl">
              Create account
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Register with your email. We will send a 6-digit verification
              code before allowing login.
            </p>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-zinc-300">
                  Name
                </span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                  <User size={18} className="text-zinc-500" />
                  <input
                    name="name"
                    value={form.name}
                    onChange={updateField}
                    required
                    minLength={2}
                    placeholder="Your name"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-zinc-300">
                  Email
                </span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                  <Mail size={18} className="text-zinc-500" />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={updateField}
                    required
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-zinc-300">
                  Password
                </span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                  <Lock size={18} className="text-zinc-500" />
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={updateField}
                    required
                    minLength={6}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600"
                  />
                </div>
              </label>

              <button
                disabled={loading}
                className="w-full rounded-2xl bg-red-600 px-5 py-3 font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-400">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-red-400">
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Register;