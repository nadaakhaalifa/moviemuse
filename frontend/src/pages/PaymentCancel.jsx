import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

function PaymentCancel() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-4 text-white">
      <div className="max-w-md rounded-[2rem] border border-red-500/20 bg-red-500/10 p-8 text-center shadow-2xl">
        <XCircle className="mx-auto text-red-400" size={46} />

        <h1 className="mt-6 text-3xl font-black">
          Payment Cancelled
        </h1>

        <p className="mt-3 text-sm leading-7 text-red-100/80">
          Checkout was cancelled. You can return to pricing and try again
          whenever you are ready.
        </p>

        <div className="mt-7 flex justify-center gap-3">
          <Link
            to="/pricing"
            className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
          >
            Try Again
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

export default PaymentCancel;