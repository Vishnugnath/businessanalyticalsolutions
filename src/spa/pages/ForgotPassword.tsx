import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/config";
import { ArrowLeft, BarChart3, CheckCircle2, Loader2, Mail, KeyRound } from "lucide-react";
import { ThemeToggle } from "@/spa/ThemeContext";
import { useToast } from "@/spa/components/Toast";

function FontsAndMotion() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
      @keyframes sdl-fade-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes sdl-float-slow { 0%, 100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(0,-18px,0); } }
      @keyframes sdl-check-pop { 0% { transform: scale(0.6); opacity: 0; } 70% { transform: scale(1.08); } 100% { transform: scale(1); opacity: 1; } }
      .sdl-fade-up { animation: sdl-fade-up 0.6s cubic-bezier(.16,1,.3,1) both; }
    `}</style>
  );
}

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr("");
    const cleanEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErr("Please enter a valid email address.");
      return;
    }
    setBusy(true);
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      setSent(true);
      toast("success", "Recovery link sent to " + cleanEmail);
    } catch (e: unknown) {
      const code = (e as { code?: string })?.code;
      let msg = (e as { message?: string })?.message || "Could not send reset email.";
      
      if (code === "auth/user-not-found") {
        msg = "No registered user found with this email address.";
      } else if (code === "auth/invalid-email") {
        msg = "The email address is invalid.";
      } else if (code === "auth/too-many-requests") {
        msg = "Too many password recovery requests. Please wait before trying againnnnn.";
      }
      
      setErr(msg);
      toast("error", msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="font-['Inter'] min-h-screen bg-[#F6F7FA] dark:bg-[#080B12] text-slate-900 dark:text-slate-100 flex items-center justify-center px-4 relative overflow-hidden">
      <FontsAndMotion />
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-1/3 left-1/3 h-96 w-96 rounded-full bg-blue-400/10 blur-[130px]"
          style={{ animation: "sdl-float-slow 15s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-amber-400/10 blur-[130px]"
          style={{ animation: "sdl-float-slow 18s ease-in-out infinite reverse" }}
        />
      </div>

      <div className="sdl-fade-up relative w-full max-w-md">
        <Link to="/" className="flex items-center justify-center mb-6">
          <img src="/bas-logo.png" alt="Business Analytical Solutions" className="h-14 w-auto object-contain" />
        </Link>

        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] backdrop-blur-2xl p-8 shadow-2xl shadow-slate-900/5 dark:shadow-black/40">
          {sent ? (
            <div className="text-center py-4">
              <div
                className="mx-auto h-14 w-14 rounded-full bg-blue-500/15 border border-blue-400/40 flex items-center justify-center"
                style={{ animation: "sdl-check-pop 0.5s cubic-bezier(.16,1,.3,1) both" }}
              >
                <CheckCircle2 className="h-7 w-7 text-blue-500 dark:text-blue-300" />
              </div>
              <div className="mt-4 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
                Link Dispatched
              </div>
              <h1 className="mt-2 font-['Space_Grotesk'] text-xl font-bold">Check your inbox</h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                A secure password reset link has been dispatched to your email inbox.
              </p>
              <Link
                to="/login"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-300 hover:text-amber-500 dark:hover:text-amber-300 transition"
              >
                <ArrowLeft className="h-4 w-4" /> Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <KeyRound className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <h1 className="mt-4 font-['Space_Grotesk'] text-2xl font-bold tracking-tight">
                Reset your password
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Enter your email and we'll send a recovery link.
              </p>

              <form onSubmit={onSubmit} className="mt-7 space-y-4">
                <div>
                  <label className="font-['JetBrains_Mono'] text-[11px] font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Email
                  </label>
                  <div className="mt-1.5 relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-blue-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 pl-10 pr-3 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 outline-none transition"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                {err && (
                  <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 font-['JetBrains_Mono'] text-xs text-red-600 dark:text-red-300">
                    {err}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold bg-slate-900 dark:bg-blue-500 text-white dark:text-slate-950 shadow-lg shadow-slate-900/10 dark:shadow-blue-500/30 hover:-translate-y-0.5 disabled:opacity-60 transition-all"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {busy ? "Sending..." : "Send reset link"}
                </button>

                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition pt-2"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
                </Link>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
