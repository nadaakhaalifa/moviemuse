import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Crown } from "lucide-react";

import { confirmCheckoutSession } from "../api/paymentApi";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState("confirming");
  const [message, setMessage] = useState("Confirming your subscription...");

  useEffect(() => {
    async function confirmPayment() {
      const sessionId = searchParams.get("session_id");

      if (!sessionId) {
        setStatus("error");
        setMessage("Missing Stripe session ID.");
        return;
      }

      try {
        await confirmCheckoutSession(sessionId);

        setStatus("success");
        setMessage("Your premium subscription is now active.");
      } catch (error) {
        console.error("Failed to confirm payment:", error);

        setStatus("error");
        setMessage(
          error.response?.data?.detail ||
            "Payment completed, but subscription confirmation failed."
        );
      }
    }

    confirmPayment();
  }, [searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-4 text-white">
      <div className="max-w-md rounded-[2rem] border border-green-500/20 bg-green-500/10 p-8 text-center shadow-2xl">
        <Crown className="mx-auto text-yellow-400" size={46} />
        <CheckCircle className="mx-auto mt-4 text-green-400" size={42} />

        <h1 className="mt-6 text-3xl font-black">
          {status === "confirming"
            ? "Confirming Payment..."
            : status === "success"
            ? "Premium Activated"
            : "Payment Needs Review"}
        </h1>

        <p className="mt-3 text-sm leading-7 text-green-100/80">
          {message}
        </p>

        <div className="mt-7 flex justify-center gap-3">
          <Link
            to="/profile"
            className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-zinc-200"
          >
            View Profile
          </Link>

          <Link
            to="/"
            className="rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default PaymentSuccess;