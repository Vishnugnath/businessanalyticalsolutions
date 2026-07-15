import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useAuth } from "@/spa/AuthContext";
import { Spinner } from "@/spa/components/Spinner";
import { BarChart3, LogOut, LineChart, MailQuestion, Radio, FileSpreadsheet, ExternalLink } from "lucide-react";
import { ThemeToggle } from "@/spa/ThemeContext";

function FontsAndMotion() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
      @keyframes sdl-fade-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes sdl-pulse-ring { 0% { transform: scale(0.9); opacity: 0.7; } 100% { transform: scale(2.2); opacity: 0; } }
      .sdl-fade-up { animation: sdl-fade-up 0.5s cubic-bezier(.16,1,.3,1) both; }
    `}</style>
  );
}

export default function Dashboard() {
  const { user, iframeUrl, googleSheetEnabled, googleSheetUrl, loading } = useAuth();
  const navigate = useNavigate();

  console.log("Dashboard configuration load:", { googleSheetEnabled, googleSheetUrl });

  const onSignOut = async () => {
    await signOut(auth);
    navigate("/", { replace: true });
  };


  return (
    <div className="font-['Inter'] min-h-screen bg-[#F6F7FA] dark:bg-[#080B12] text-slate-900 dark:text-slate-100">
      <FontsAndMotion />

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-[#080B12]/70 border-b border-slate-200/70 dark:border-white/[0.06]">
        <div className="mx-auto max-w-[1400px] px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg border border-blue-500/30 bg-blue-500/10 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <div className="font-['Space_Grotesk'] font-semibold text-sm tracking-tight">
                Client Portal
              </div>
              <div className="font-['JetBrains_Mono'] text-[10px] text-slate-400 dark:text-slate-500">
                {user?.email}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {iframeUrl && (
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">
                <span className="relative flex h-1.5 w-1.5">
                  <span
                    className="absolute inline-flex h-full w-full rounded-full bg-current"
                    style={{ animation: "sdl-pulse-ring 1.8s cubic-bezier(0,0,0.2,1) infinite" }}
                  />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
                </span>
                Live Feed
              </span>
            )}
            <ThemeToggle />
            <button
              onClick={onSignOut}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-white/10 hover:border-red-400/40 hover:text-red-600 dark:hover:text-red-300 transition"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 sm:px-6 py-6">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-16">
            <Spinner label="Loading your analytics portal..." />
          </div>
        ) : iframeUrl ? (
          <div className="sdl-fade-up w-full rounded-2xl border border-slate-200 dark:border-blue-400/15 bg-white dark:bg-[#0B0F19]/70 backdrop-blur-xl shadow-2xl shadow-slate-900/5 dark:shadow-blue-900/20 overflow-hidden">
            {/* window chrome */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-blue-400/70" />
              </div>
              <div className="flex items-center gap-1.5 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
                <Radio className="h-3 w-3 text-blue-500" />
                Streaming live
              </div>
            </div>

            {/* Google Sheet Button Section */}
            {googleSheetEnabled && googleSheetUrl && (
              <div className="px-4 py-3 bg-slate-50 dark:bg-white/[0.01] border-b border-slate-200 dark:border-white/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <FileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Google Sheet Linked</span>
                </div>
                <a
                  href={googleSheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 px-3.5 py-1.5 text-xs font-semibold transition-all shadow-md shadow-emerald-500/10 dark:shadow-emerald-500/20"
                >
                  Open Google Sheet <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
            <div className="w-full overflow-x-auto p-3 sm:p-4">
              <div className="rounded-lg overflow-hidden">
                <iframe
                  title="Client Dashboard"
                  src={iframeUrl}
                  className="w-full h-[85vh] border-0 block"
                  style={{ minWidth: "1024px" }}
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        ) : (
          <EmptyPortal />
        )}
      </main>
    </div>
  );
}

function EmptyPortal() {
  return (
    <div className="sdl-fade-up rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] backdrop-blur-xl p-12 text-center">
      <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-amber-400/10 border border-blue-400/30 flex items-center justify-center">
        <LineChart className="h-10 w-10 text-blue-600 dark:text-blue-300" />
      </div>
      {/* skeleton graphic */}
      <div className="mx-auto mt-8 max-w-md space-y-3">
        <div className="flex items-end gap-2 h-24 justify-center">
          {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
            <div
              key={i}
              className="w-8 rounded-t-md bg-gradient-to-t from-blue-500/30 to-amber-400/20 animate-pulse"
              style={{ height: `${h}%`, animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
      </div>
      <div className="mt-8 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-amber-600 dark:text-amber-300">
        Sync Pending
      </div>
      <h2 className="mt-2 font-['Space_Grotesk'] text-xl font-semibold">Your portal is being generated</h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
        We're wiring up your live feed. Contact your Samagra manager to link your spreadsheet and
        we'll have your dashboard streaming shortly.
      </p>
      <a
        href="mailto:hello@samagradatalabs.com"
        className="mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-blue-400/40 hover:bg-blue-500/5 transition"
      >
        <MailQuestion className="h-4 w-4" /> Contact your manager
      </a>
    </div>
  );
}
