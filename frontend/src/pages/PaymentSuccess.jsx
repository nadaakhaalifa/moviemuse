import { Link } from "react-router-dom";
import { CheckCircle, Crown } from "lucide-react";

function PaymentSuccess() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-4 text-white">
      <div className="max-w-md rounded-[2rem] border border-green-500/20 bg-green-500/10 p-8 text-center shadow-2xl">
        <Crown className="mx-auto text-yellow-400" size={46} />
        <CheckCircle className="mx-auto mt-4 text-green-400" size={42} />

        <h1 className="mt-6 text-3xl font-black">
          Payment Successful
        </h1>

        <p className="mt-3 text-sm leading-7 text-green-100/80">
          Your premium checkout was completed. If webhooks are configured, your
          subscription status will update automatically.
        </p>

        <Link
          to="/"
          className="mt-7 inline-block rounded-xl bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-zinc-200"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}

export default PaymentSuccess;