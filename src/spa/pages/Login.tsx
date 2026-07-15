import { useEffect, useState, useRef, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { useAuth } from "@/spa/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { useToast } from "@/spa/components/Toast";
import { writeAuditLog } from "@/lib/auditLog";
import { BarChart3, Loader2, Lock, Mail, ShieldCheck, Activity, ArrowRight, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/spa/ThemeContext";
import DataSyncBackground from "@/spa/components/DataSyncBackground";

/* ---------- decorative helpers (styling only) ---------- */

function FontsAndMotion() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
      @keyframes sdl-scan { 0% { transform: translateY(-15%); opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } 100% { transform: translateY(115%); opacity: 0; } }
      @keyframes sdl-fade-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes sdl-pulse-ring { 0% { transform: scale(0.9); opacity: 0.7; } 100% { transform: scale(2.2); opacity: 0; } }
      .sdl-fade-up { animation: sdl-fade-up 0.6s cubic-bezier(.16,1,.3,1) both; }
    `}</style>
  );
}


export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const toast = useToast();
  const { user, loading, isAdmin } = useAuth();
  const isLoggingInRef = useRef(false);

  useEffect(() => {
    // If the login page mounts/updates while a user session is active (and we are not actively logging in),
    // redirect them to the appropriate dashboard/admin page.
    if (!loading && user && !isLoggingInRef.current) {
      const dest = isAdmin ? "/admin" : "/dashboard";
      navigate(dest, { replace: true });
    }
  }, [loading, user, isAdmin, navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr("Please enter a valid email address.");
      return;
    }
    if (!pw) {
      setErr("Password is required.");
      return;
    }
    setSubmitting(true);
    isLoggingInRef.current = true;
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pw);
      toast("success", "Signed in successfully");

      // Fetch role to navigate immediately
      const userDoc = await getDoc(doc(db, "users", cred.user.uid));
      const role = userDoc.exists() ? userDoc.data()?.role : "user";
      console.log("the role---->", role);

      // Audit log: user signed in
      await writeAuditLog(
        "user_signed_in",
        { uid: cred.user.uid, email: cred.user.email ?? email.trim() },
        { email: cred.user.email ?? email.trim(), uid: cred.user.uid },
        { method: "password", role: String(role) }
      );

      const dest = role === "admin" || role === "superadmin" ? "/admin" : "/dashboard";
      navigate(dest);
    } catch (e: unknown) {
      isLoggingInRef.current = false;
      const msg =
        (e as { code?: string })?.code === "auth/invalid-credential"
          ? "Invalid email or password."
          : (e as { message?: string })?.message || "Sign-in failed.";
      setErr(msg);
      toast("error", msg);
    } finally {
      setSubmitting(false);
    }
  };

  const onGoogleSignIn = async () => {
    setErr("");
    setSubmitting(true);
    isLoggingInRef.current = true;
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const cred = await signInWithPopup(auth, provider);
      toast("success", "Signed in with Google successfully");

      // Fetch role to navigate immediately
      const userDoc = await getDoc(doc(db, "users", cred.user.uid));
      const role = userDoc.exists() ? userDoc.data()?.role : "user";
      console.log("the role---->", role);

      const dest = role === "admin" || role === "superadmin" ? "/admin" : "/dashboard";
      navigate(dest);
    } catch (e: unknown) {
      isLoggingInRef.current = false;
      const errObj = e as { code?: string; message?: string };
      if (errObj.code !== "auth/popup-closed-by-user") {
        const msg = errObj.message || "Google sign-in failed.";
        setErr(msg);
        toast("error", msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="font-['Inter'] min-h-screen bg-[#F6F7FA] dark:bg-[#080B12] text-slate-900 dark:text-slate-100 relative">
      <FontsAndMotion />
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>

      <div className="min-h-screen grid lg:grid-cols-2">
        {/* Decorative left panel */}
        <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border-r border-slate-200 dark:border-white/[0.06] px-14 py-12">
          <DataSyncBackground />
          <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-blue-500/10 dark:bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-amber-400/5 dark:bg-amber-400/10 blur-3xl" />

          <Link to="/" className="relative z-10 flex items-center justify-center">
            <img src="/bas-logo.png" alt="Business Analytical Solutions" className="h-16 w-auto object-contain" />
          </Link>

          <div className="relative z-10 flex flex-col items-center text-center my-auto -translate-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 dark:border-blue-400/30 bg-blue-500/10 px-3 py-1 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300">
              <span className="relative flex h-1.5 w-1.5">
                <span
                  className="absolute inline-flex h-full w-full rounded-full bg-current"
                  style={{ animation: "sdl-pulse-ring 1.8s cubic-bezier(0,0,0.2,1) infinite" }}
                />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
              </span>
              Secure Channel
            </span>
            <h1 className="mt-6 font-['Space_Grotesk'] text-4xl font-semibold leading-tight tracking-tight text-slate-800 dark:text-white">
              Your dashboards,
              <br />
              exactly where you left them.
            </h1>
            <p className="mt-4 max-w-sm text-sm text-slate-500 dark:text-slate-400 leading-relaxed mx-auto">
              One login, every client portal you're authorized to see — kept in sync in real time.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-3 max-w-sm mx-auto">
              <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 flex flex-col items-center text-center">
                <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                <div className="mt-2 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                  Isolation
                </div>
                <div className="text-sm font-medium text-slate-800 dark:text-white">Per-client access</div>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 flex flex-col items-center text-center">
                <Activity className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                <div className="mt-2 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                  Freshness
                </div>
                <div className="text-sm font-medium text-slate-800 dark:text-white">Live-synced data</div>
              </div>
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div className="flex items-center justify-center px-4 py-16">
          <div className="sdl-fade-up w-full max-w-md">
            <Link to="/" className="flex lg:hidden items-center justify-center mb-8">
              <img src="/bas-logo.png" alt="Business Analytical Solutions" className="h-14 w-auto object-contain" />
            </Link>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors mb-4 group"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              Back to Home
            </Link>

            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] backdrop-blur-2xl p-8 shadow-2xl shadow-slate-900/5 dark:shadow-black/40">
              <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
                Client Portal
              </div>
              <h1 className="mt-2 font-['Space_Grotesk'] text-2xl font-semibold tracking-tight">
                Welcome back
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Sign in to access your dashboard.
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
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 pl-10 pr-3 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 outline-none transition"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="font-['JetBrains_Mono'] text-[11px] font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs font-medium text-blue-600 dark:text-blue-300 hover:text-amber-500 dark:hover:text-amber-300 transition"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="mt-1.5 relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-blue-500" />
                    <input
                      type={showPw ? "text" : "password"}
                      autoComplete="current-password"
                      value={pw}
                      onChange={(e) => setPw(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 pl-10 pr-10 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 outline-none transition"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none flex items-center justify-center"
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {err && (
                  <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 font-['JetBrains_Mono'] text-xs text-red-600 dark:text-red-300">
                    {err}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="group w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold bg-slate-900 dark:bg-blue-500 text-white dark:text-slate-950 shadow-lg shadow-slate-900/10 dark:shadow-blue-500/30 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 transition-all"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  )}
                  {submitting ? "Signing in..." : "Sign in"}
                </button>
              </form>

              <div className="mt-5 flex items-center justify-center">
                <span className="text-[10px] uppercase font-['JetBrains_Mono'] tracking-wider text-slate-400 dark:text-slate-500">
                  — Or continue with —
                </span>
              </div>

              <button
                type="button"
                onClick={onGoogleSignIn}
                disabled={submitting}
                className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-white shadow-sm hover:bg-slate-50 dark:hover:bg-white/10 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 transition-all"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </button>

              <div className="mt-6 text-center border-t border-slate-100 dark:border-white/5 pt-4">
                <a
                  href="https://wa.me/919288021551?text=Hi%2C%20can%20I%20know%20more%20about%20your%20dashboard%20service%3F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-amber-500 dark:hover:text-amber-300 transition-colors inline-flex items-center gap-1.5"
                >
                  Book Your Free Data Audit
                  <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
