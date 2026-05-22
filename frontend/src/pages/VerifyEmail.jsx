import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, MailCheck, RefreshCcw, ShieldCheck } from "lucide-react";

import { resendVerificationCode, verifyEmail } from "../api/authApi";
import { saveAuthSession } from "../utils/authStorage";

function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState(
    "Check your email or backend terminal for the verification code."
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleVerify(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    try {
      setLoading(true);

      const data = await verifyEmail({
        email,
        code,
      });

      saveAuthSession(data.access_token, data.user);

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Verification failed. Please check your code."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setMessage("");

    try {
      setResending(true);
      await resendVerificationCode(email);
      setMessage("A new verification code was sent.");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Could not resend code. Please try again."
      );
    } finally {
      setResending(false);
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
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
              <MailCheck size={28} />
            </div>

            <h1 className="text-3xl font-black sm:text-4xl">
              Verify email
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Enter the 6-digit code sent to your email. During development,
              the code also appears in your FastAPI terminal.
            </p>

            {message && (
              <div className="mt-5 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-200">
                {message}
              </div>
            )}

            {error && (
              <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleVerify} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-zinc-300">
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-zinc-600"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-zinc-300">
                  Verification Code
                </span>
                <input
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  required
                  maxLength={6}
                  minLength={6}
                  placeholder="123456"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-center text-2xl font-black tracking-[0.4em] outline-none placeholder:text-zinc-700"
                />
              </label>

              <button
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShieldCheck size={18} />
                {loading ? "Verifying..." : "Verify Email"}
              </button>
            </form>

            <button
              onClick={handleResend}
              disabled={resending || !email}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCcw size={16} />
              {resending ? "Sending..." : "Resend Code"}
            </button>

            <p className="mt-6 text-center text-sm text-zinc-400">
              Already verified?{" "}
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

export default VerifyEmail;