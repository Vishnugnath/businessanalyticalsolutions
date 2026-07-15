import { useEffect, useMemo, useRef, useState, useCallback, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Zap,
  ShieldCheck,
  Gauge,
  Database,
  LineChart,
  ArrowRight,
  ArrowUpRight,
  Radio,
  Workflow,
  GitBranch,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  FileSpreadsheet,
  Building2,
  Users,
  XCircle,
  CheckCircle2,
  Sparkles,
  Sliders,
  Clock,
  Cpu,
  Send,
  ArrowDown,
  ChevronDown,
  X,
  ShoppingCart,
  GripVertical,
  AlertCircle,
} from "lucide-react";
import { ThemeToggle } from "@/spa/ThemeContext";
import ParticleBackground from "@/spa/components/ParticleBackground";

/* ---------- decorative helpers (styling only, no business logic) ---------- */

function FontsAndMotion() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

      @keyframes sdl-scan { 0% { transform: translateY(-15%); opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } 100% { transform: translateY(115%); opacity: 0; } }
      @keyframes sdl-float { 0%, 100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(0,-16px,0); } }
      @keyframes sdl-float-slow { 0%, 100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(0,-24px,0) scale(1.04); } }
      @keyframes sdl-fade-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes sdl-pulse-ring { 0% { transform: scale(0.9); opacity: 0.7; } 100% { transform: scale(2.2); opacity: 0; } }
      @keyframes sdl-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      @keyframes sdl-blink { 0%, 100% { opacity: 0.35; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.1); } }
      @keyframes sdl-flow { to { stroke-dashoffset: -20; } }
      @keyframes sdl-cursor { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      @keyframes sdl-bar-grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
      @keyframes sdl-verb-in { from { opacity: 0; transform: translateY(20px) scale(0.97); filter: blur(4px); } to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
      @keyframes sdl-scale-in { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
      @keyframes sdl-assemble { from { opacity: 0; transform: translateY(12px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }

      .sdl-fade-up { animation: sdl-fade-up 0.7s cubic-bezier(.16,1,.3,1) both; }
      .sdl-blink { animation: sdl-blink 1.4s ease-in-out infinite; }
      .sdl-flow-line { stroke-dasharray: 8 6; animation: sdl-flow 1.2s linear infinite; }
      .sdl-cursor { animation: sdl-cursor 0.8s infinite; }
      .sdl-bar { transform-origin: bottom; animation: sdl-bar-grow 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
      .sdl-verb-in { animation: sdl-verb-in 0.5s cubic-bezier(.16,1,.3,1) both; }
      .sdl-scale-in { animation: sdl-scale-in 0.4s cubic-bezier(.16,1,.3,1) both; }
      .sdl-assemble { animation: sdl-assemble 0.5s cubic-bezier(.16,1,.3,1) both; }

      .sdl-flip-card { perspective: 1000px; cursor: pointer; }
      .sdl-flip-card-inner { transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); transform-style: preserve-3d; position: relative; }
      .sdl-flip-card.flipped .sdl-flip-card-inner { transform: rotateY(180deg); }
      .sdl-flip-card-face { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
      .sdl-flip-card-back { transform: rotateY(180deg); position: absolute; inset: 0; }

      @media (prefers-reduced-motion: reduce) {
        .sdl-flow-line { animation: none !important; }
        .sdl-blink { animation: none !important; }
        .sdl-cursor { animation: none !important; }
        .sdl-bar { animation: none !important; }
        .sdl-pulse-ring { animation: none !important; }
      }
    `}</style>
  );
}

function SignalGrid({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="absolute inset-0 opacity-[0.55] dark:opacity-[0.6]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(56,189,248,0.55) 1px, transparent 1.4px)",
          backgroundSize: "30px 30px",
          maskImage: "radial-gradient(ellipse 65% 55% at 50% 0%, black 35%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 65% 55% at 50% 0%, black 35%, transparent 100%)",
        }}
      />
      <div
        className="absolute left-0 right-0 h-40 bg-gradient-to-b from-transparent via-blue-400/10 to-transparent"
        style={{ animation: "sdl-scan 8s linear infinite" }}
      />
    </div>
  );
}

function StatusPill({ children, tone = "signal" }: { children: ReactNode; tone?: "signal" | "pulse" }) {
  const tones =
    tone === "signal"
      ? "text-blue-700 dark:text-blue-300 border-blue-500/30 bg-blue-500/10"
      : "text-amber-700 dark:text-amber-300 border-amber-500/30 bg-amber-500/10";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-['JetBrains_Mono'] text-[10px] font-medium uppercase tracking-[0.2em] ${tones}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span
          className="absolute inline-flex h-full w-full rounded-full bg-current"
          style={{ animation: "sdl-pulse-ring 1.8s cubic-bezier(0,0,0.2,1) infinite" }}
        />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      {children}
    </span>
  );
}

function useLiveCounter(base: number, step: number, intervalMs: number) {
  const [value, setValue] = useState(base);
  useEffect(() => {
    const id = setInterval(() => setValue((v) => v + step), intervalMs);
    return () => clearInterval(id);
  }, [step, intervalMs]);
  return value;
}

/* ---------- constants ---------- */

const COLOR_MAPS = {
  amber: { text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", dot: "bg-amber-500", glow: "shadow-[0_0_8px_rgba(245,158,11,0.6)]" },
  cyan: { text: "text-cyan-600 dark:text-cyan-400", bg: "bg-blue-500/10", border: "border-blue-500/20", dot: "bg-blue-500", glow: "shadow-[0_0_8px_rgba(59,130,246,0.6)]" },
  indigo: { text: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", dot: "bg-indigo-500", glow: "shadow-[0_0_8px_rgba(99,102,241,0.6)]" },
  blue: { text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", dot: "bg-blue-500", glow: "shadow-[0_0_8px_rgba(59,130,246,0.6)]" },
  emerald: { text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-500", glow: "shadow-[0_0_8px_rgba(16,185,129,0.6)]" },
  sky: { text: "text-sky-600 dark:text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20", dot: "bg-sky-500", glow: "shadow-[0_0_8px_rgba(14,165,233,0.6)]" },
  red: { text: "text-red-600 dark:text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", dot: "bg-red-500", glow: "shadow-[0_0_8px_rgba(239,68,68,0.6)]" },
  pink: { text: "text-pink-600 dark:text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20", dot: "bg-pink-500", glow: "shadow-[0_0_8px_rgba(236,72,153,0.6)]" },
} as const;

type ColorKey = keyof typeof COLOR_MAPS;

interface SourceTool {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: ColorKey;
}

const sourceTools: SourceTool[] = [
  { name: "Tally Prime", icon: Building2, label: "1.2k TX/s", color: "amber" },
  { name: "Zoho Books", icon: FileSpreadsheet, label: "API ONLINE", color: "indigo" },
  { name: "Other Financial tools", icon: Database, label: "SYNC OK", color: "blue" },
  { name: "QuickBooks", icon: Building2, label: "CONNECTED", color: "cyan" },
  { name: "SAP ERP", icon: Building2, label: "SECURE SSL", color: "indigo" },
  { name: "Marg / Xero", icon: Sliders, label: "AUTO-CAPTURED", color: "amber" },
  { name: "All ERPs", icon: Zap, label: "SETTLED", color: "sky" },
  { name: "Task Management Tools", icon: Zap, label: "DIRECT FEED", color: "cyan" },
  { name: "SPREADSHEETS", icon: ShieldCheck, label: "DATA SYNCED", color: "red" },
  { name: "Other Tools", icon: Sliders, label: "API ONLINE", color: "pink" },
];

const STACK_TOOLS = [
  {
    name: "Finance & Accounting",
    icon: Building2,
    color: "amber" as ColorKey,
    preview: { title: "Revenue Ledger", metrics: [{ label: "Today's Revenue", value: "₹4.2L" }, { label: "Pending Invoices", value: "23" }], bars: [40, 65, 55, 80, 70, 90, 85] },
  },
  {
    name: "Sales & CRM",
    icon: FileSpreadsheet,
    color: "indigo" as ColorKey,
    preview: { title: "Invoice Tracker", metrics: [{ label: "Open Invoices", value: "47" }, { label: "Overdue", value: "5" }], bars: [30, 50, 45, 60, 75, 55, 80] },
  },
  {
    name: "Marketing & Ad Spend",
    icon: ShoppingCart,
    color: "emerald" as ColorKey,
    preview: { title: "Order Pipeline", metrics: [{ label: "Orders Today", value: "128" }, { label: "GMV", value: "₹2.8L" }], bars: [55, 70, 45, 85, 60, 75, 90] },
  },
  {
    name: "HR & Operations",
    icon: Gauge,
    color: "cyan" as ColorKey,
    preview: { title: "Cash Flow", metrics: [{ label: "Cash In", value: "₹6.1L" }, { label: "Cash Out", value: "₹3.9L" }], bars: [60, 45, 70, 55, 80, 65, 75] },
  },
];

const HELM_RESPONSES = [
  "Q2 net profit margin is 14.2%, up 2.1% from Q1.",
  "Top 3 revenue sources: Retail (42%), B2B (35%), Online (23%).",
  "Cash flow forecast: ₹12.4L positive for next 30 days.",
  "Employee productivity index: 87/100, above industry avg.",
];

const TOOL_LOGS: Record<string, string[]> = {
  "Tally Prime": ["FETCH: Tally Prime ledger entries...", "SYNC: Tally Prime daybook updated...", "RECONCILE: Tally GST returns matched...", "COMPLETE: Tally Prime sync OK ✓"],
  "Zoho Books": ["FETCH: Zoho Books invoices...", "SYNC: Zoho Books receivables updated...", "VALIDATE: Zoho payment records...", "COMPLETE: Zoho Books sync OK ✓"],
  "Other Financial tools": ["SCAN: Financial tools discovery...", "FETCH: Ledger data streams...", "SYNC: Financial records updated...", "COMPLETE: Financial tools sync OK ✓"],
  "QuickBooks": ["FETCH: QuickBooks P&L report...", "SYNC: QuickBooks bank feeds...", "RECONCILE: QuickBooks transactions...", "COMPLETE: QuickBooks sync OK ✓"],
  "SAP ERP": ["CONNECT: SAP ERP secure tunnel...", "FETCH: SAP production orders...", "SYNC: SAP inventory states...", "COMPLETE: SAP ERP sync OK ✓"],
  "Marg / Xero": ["FETCH: Marg billing records...", "SYNC: Xero expense reports...", "VALIDATE: Cross-platform matching...", "COMPLETE: Marg/Xero sync OK ✓"],
  "All ERPs": ["SCAN: ERP endpoint discovery...", "FETCH: Multi-ERP data streams...", "SYNC: Unified ERP records...", "COMPLETE: All ERPs sync OK ✓"],
  "Task Management Tools": ["FETCH: Task statuses & deadlines...", "SYNC: Team workload metrics...", "VALIDATE: Sprint velocity data...", "COMPLETE: Task tools sync OK ✓"],
  "SPREADSHEETS": ["FETCH: Google Sheets ranges...", "SYNC: Excel workbook data...", "VALIDATE: Spreadsheet formulas...", "COMPLETE: Spreadsheets sync OK ✓"],
  "Other Tools": ["SCAN: API endpoint discovery...", "FETCH: Third-party data feeds...", "SYNC: External tool records...", "COMPLETE: Other tools sync OK ✓"],
};

const FAQ_ITEMS = [
  { q: "How long does it take to set up?", a: "Most integrations go live within 5–7 business days. We handle all the plumbing — you just give us access to your tools." },
  { q: "What tools do you connect?", a: "Tally Prime, Zoho Books, QuickBooks, SAP, any ERP, CRMs, Google Sheets, marketing platforms, HR tools, and more. If it has an API or export, we can sync it." },
  { q: "Is my data secure?", a: "Absolutely. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We never store raw credentials and use OAuth where available." },
  { q: "What does it cost?", a: "Pricing scales with the number of data sources and users. Most SMEs start at ₹15,000/month. The free data audit will give you an exact quote." },
  { q: "Can I try before I commit?", a: "Yes — the free Data Audit includes a working prototype with your actual data. You'll see your dashboard before signing anything." },
];

const SECTION_NAV = [
  { id: "hero", label: "Hero" },
  { id: "pain", label: "Pain" },
  { id: "chaos", label: "Sync Grid" },
  { id: "solution", label: "Solution" },
  { id: "services", label: "Benefits" },
  { id: "calculator", label: "Calculator" },
  { id: "contact", label: "CTA" },
];

/* ---------- magnetic hover helper ---------- */
const handleMagneticMove = (e: React.MouseEvent<HTMLElement>, strength = 4) => {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = ((e.clientX - cx) / (rect.width / 2)) * strength;
  const dy = ((e.clientY - cy) / (rect.height / 2)) * strength;
  el.style.transform = `translate(${dx}px, ${dy}px)`;
};
const handleMagneticLeave = (e: React.MouseEvent<HTMLElement>) => {
  e.currentTarget.style.transform = "";
};

/* ---------------------------------- page ---------------------------------- */

export default function Landing() {
  const rowsSynced = useLiveCounter(482_910, 7, 1400);

  /* ---- App-Hopping Simulator state ---- */
  const [activeAppTab, setActiveAppTab] = useState<"accounting" | "sales" | "hr" | "marketing">("accounting");
  const [appTabClicks, setAppTabClicks] = useState(0);
  const [animateClock, setAnimateClock] = useState(false);
  const [showDelta, setShowDelta] = useState(false);
  const clockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const deltaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAppTabChange = (tab: "accounting" | "sales" | "hr" | "marketing") => {
    if (tab === activeAppTab) return;
    setActiveAppTab(tab);
    setAppTabClicks((c) => c + 1);
    setAnimateClock(true);
    setShowDelta(true);

    if (clockTimerRef.current) clearTimeout(clockTimerRef.current);
    if (deltaTimerRef.current) clearTimeout(deltaTimerRef.current);

    clockTimerRef.current = setTimeout(() => setAnimateClock(false), 650);
    deltaTimerRef.current = setTimeout(() => setShowDelta(false), 950);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (clockTimerRef.current) clearTimeout(clockTimerRef.current);
      if (deltaTimerRef.current) clearTimeout(deltaTimerRef.current);
    };
  }, []);

  /* ---- Central Hub Console rotating logs ---- */
  const [logs, setLogs] = useState<string[]>([
    "INIT: Connecting to data feeds...",
    "FETCH: Tally Prime ledger entries...",
    "SYNC: employee record sync...",
    "RECONCILE: GSTIN GSTR-2B matching...",
  ]);

  useEffect(() => {
    const consoleLogs = [
      "FETCH: Tally Prime ledger entries...",
      "SYNC: employee record sync...",
      "RECONCILE: GSTIN GSTR-2B matching...",
      "SYNC: Zoho Books receivables updated...",
      "FETCH: Busy ERP inventory states...",
      "SYNC: Google Sheets metrics updated...",
      "POST: Razorpay payout settlements...",
      "SYNC: Shopify sales orders updated...",
    ];
    let logPtr = 0;
    const interval = setInterval(() => {
      setLogs((prev) => {
        const next = [...prev.slice(1), consoleLogs[logPtr]];
        logPtr = (logPtr + 1) % consoleLogs.length;
        return next;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  /* ---- Calculator state ---- */
  const [teamSize, setTeamSize] = useState(6);
  const [hoursPerWeek, setHoursPerWeek] = useState(5);
  const monthlyHoursLost = useMemo(() => Math.round(teamSize * hoursPerWeek * 4.33), [teamSize, hoursPerWeek]);
  const workDaysLost = useMemo(() => Math.round(monthlyHoursLost / 8), [monthlyHoursLost]);
  const monthlyCostLost = useMemo(() => monthlyHoursLost * 1000, [monthlyHoursLost]);

  /* ---- Stack picker ---- */
  const [selectedStack, setSelectedStack] = useState<number | null>(null);

  /* ---- Sync Grid interactivity ---- */
  const [hoveredToolIdx, setHoveredToolIdx] = useState<number | null>(null);
  const [filteredToolName, setFilteredToolName] = useState<string | null>(null);
  const [filteredLogs, setFilteredLogs] = useState<string[]>([]);
  const filterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleToolClick = useCallback((toolName: string) => {
    const toolLogs = TOOL_LOGS[toolName] || [
      `FETCH: ${toolName} data stream...`,
      `SYNC: ${toolName} records updated...`,
      `VALIDATE: ${toolName} entries verified...`,
      `COMPLETE: ${toolName} sync successful.`,
    ];
    setFilteredToolName(toolName);
    setFilteredLogs(toolLogs);
    if (filterTimerRef.current) clearTimeout(filterTimerRef.current);
    filterTimerRef.current = setTimeout(() => setFilteredToolName(null), 4000);
  }, []);

  useEffect(() => {
    return () => { if (filterTimerRef.current) clearTimeout(filterTimerRef.current); };
  }, []);

  const displayedLogs = filteredToolName ? filteredLogs : logs;

  /* ---- Expanded card modal ---- */
  const [expandedCard, setExpandedCard] = useState<"telemetry" | "helm" | null>(null);

  /* ---- BA Helm chat ---- */
  const [helmInput, setHelmInput] = useState("");
  const [helmResponse, setHelmResponse] = useState<string | null>(null);
  const [helmDisplayText, setHelmDisplayText] = useState("");
  const [helmTyping, setHelmTyping] = useState(false);
  const helmResponseIdx = useRef(0);

  const handleHelmSubmit = useCallback(() => {
    if (!helmInput.trim() && !helmTyping) return;
    setHelmInput("");
    setHelmTyping(true);
    setHelmResponse(null);
    setHelmDisplayText("");
    setTimeout(() => {
      setHelmTyping(false);
      setHelmResponse(HELM_RESPONSES[helmResponseIdx.current % HELM_RESPONSES.length]);
      helmResponseIdx.current += 1;
    }, 1000);
  }, [helmInput, helmTyping]);

  useEffect(() => {
    if (!helmResponse) return;
    setHelmDisplayText("");
    let i = 0;
    const text = helmResponse;
    const interval = setInterval(() => {
      i++;
      setHelmDisplayText(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 22);
    return () => clearInterval(interval);
  }, [helmResponse]);

  /* ---- Flip cards ---- */
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const toggleFlip = useCallback((idx: number) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }, []);

  /* ---- FAQ ---- */
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  /* ---- Before/After slider ---- */
  const [sliderPos, setSliderPos] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updateSlider = useCallback((clientX: number) => {
    const container = sliderRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(5, Math.min(95, pos)));
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (isDragging.current) updateSlider(e.clientX); };
    const onUp = () => { isDragging.current = false; };
    const onTouchMove = (e: TouchEvent) => { if (isDragging.current && e.touches[0]) updateSlider(e.touches[0].clientX); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [updateSlider]);

  /* ---- Scroll-triggered section reveals ---- */
  const [revealedSections, setRevealedSections] = useState<Set<string>>(new Set(["hero"]));

  useEffect(() => {
    const ids = ["pain", "before-after", "chaos", "solution", "services", "calculator", "faq", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealedSections((prev) => new Set(prev).add(entry.target.id));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    requestAnimationFrame(() => {
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    });
    return () => observer.disconnect();
  }, []);

  const revealClass = (id: string) =>
    revealedSections.has(id)
      ? "transition-all duration-700 ease-out opacity-100 translate-y-0"
      : "transition-all duration-700 ease-out opacity-0 translate-y-8";

  /* ---- Progress rail active section ---- */
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const ids = SECTION_NAV.map((s) => s.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const top = visible.reduce((a, b) => (a.intersectionRatio > b.intersectionRatio ? a : b));
          setActiveSection(top.target.id);
        }
      },
      { rootMargin: "-30% 0px -30% 0px", threshold: [0, 0.25, 0.5] }
    );
    requestAnimationFrame(() => {
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    });
    return () => observer.disconnect();
  }, []);

  /* ---- SVG line colors for sync grid ---- */
  const lineColors = ["#f59e0b", "#6366f1", "#3b82f6", "#14b8a6", "#6366f1", "#f59e0b", "#0ea5e9", "#14b8a6", "#ef4444", "#ec4899"];
  const lineYs = [30, 90, 150, 210, 270, 330, 390, 450, 510, 570];

  return (
    <div className="font-['Inter'] min-h-screen bg-[#F6F7FA] dark:bg-[#080B12] text-slate-900 dark:text-slate-100 overflow-x-hidden selection:bg-blue-400/30">
      <FontsAndMotion />

      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute top-[-12%] left-[6%] h-[520px] w-[520px] rounded-full bg-blue-500/10 dark:bg-blue-400/10 blur-[130px]"
          style={{ animation: "sdl-float-slow 14s ease-in-out infinite" }}
        />
        <div
          className="absolute top-[22%] right-[-8%] h-[480px] w-[480px] rounded-full bg-amber-400/10 blur-[130px]"
          style={{ animation: "sdl-float-slow 16s ease-in-out infinite reverse" }}
        />
        <div className="absolute bottom-[-14%] left-[28%] h-[420px] w-[420px] rounded-full bg-indigo-500/5 dark:bg-indigo-400/10 blur-[130px]" />
      </div>

      {/* Sticky Progress Rail */}
      <nav className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3">
        {SECTION_NAV.map((s) => (
          <button
            key={s.id}
            onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })}
            className="group relative flex items-center"
            title={s.label}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full border-2 transition-all duration-300 ${activeSection === s.id
                ? "border-blue-400 bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.6)] scale-125"
                : "border-slate-300 dark:border-slate-600 bg-transparent hover:border-blue-400/60"
                }`}
            />
            <span
              className={`absolute left-6 whitespace-nowrap font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.15em] px-2 py-1 rounded-md transition-all duration-200 pointer-events-none ${activeSection === s.id
                ? "opacity-100 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                : "opacity-0 group-hover:opacity-100 bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-700"
                }`}
            >
              {s.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-[#080B12]/70 border-b border-slate-200/70 dark:border-white/[0.06]">
        <nav className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/bas-logo.png" alt="Business Analytical Solutions" className="h-10 w-auto object-contain" />
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <StatusPill>Systems Operational</StatusPill>
            </div>
            <ThemeToggle />
            <Link
              to="/login"
              className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-lg px-4 py-2 text-sm font-semibold text-white bg-slate-900 dark:bg-blue-500 dark:text-slate-950 shadow-lg shadow-slate-900/10 dark:shadow-blue-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              <span className="relative">Client Login</span>
              <ArrowRight className="relative h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </nav>
      </header>

      {/* ========================== HERO ========================== */}
      <section id="hero" className="relative pt-40 pb-24 px-6">
        <ParticleBackground />
        <SignalGrid className="h-[720px]" />
        <div className="relative mx-auto max-w-6xl text-center">
          <div className="sdl-fade-up inline-flex">
            <StatusPill tone="pulse">FOR BUSINESSES TIRED OF DISCONNECTED DATA</StatusPill>
          </div>
          <h1
            className="sdl-fade-up mt-7 font-['Space_Grotesk'] text-4xl sm:text-6xl lg:text-[5.2rem] font-semibold tracking-tight leading-[1.04]"
            style={{ animationDelay: "0.06s" }}
          >
            Your Entire Business
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 dark:from-blue-400 dark:via-blue-300 dark:to-sky-300 bg-clip-text text-transparent">
              Just One Click Away.
            </span>
          </h1>
          <p
            className="sdl-fade-up mt-6 max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
            style={{ animationDelay: "0.12s" }}
          >
            Real-time monitoring for every department, accessible anywhere without any outside help.
            We wire your sales, marketing, HR, operations, and finance tools into one centralized
            console.
          </p>
          <div
            className="sdl-fade-up mt-10 flex flex-wrap items-center justify-center gap-4"
            style={{ animationDelay: "0.18s" }}
          >
            <a
              href="https://wa.me/919288021551?text=Hi%2C%20can%20I%20know%20more%20about%20your%20dashboard%20service%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold bg-slate-900 text-white dark:bg-blue-500 dark:text-slate-950 shadow-xl shadow-slate-900/10 dark:shadow-blue-500/30 transition-all duration-200"
              onMouseMove={(e) => handleMagneticMove(e)}
              onMouseLeave={handleMagneticLeave}
            >
              Book Your Free Data Audit
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#chaos"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold border border-slate-300 dark:border-white/15 bg-white/70 dark:bg-white/5 text-slate-900 dark:text-slate-100 backdrop-blur transition-all duration-200"
              onMouseMove={(e) => handleMagneticMove(e, 3)}
              onMouseLeave={handleMagneticLeave}
            >
              See the Transformation
            </a>
          </div>

          {/* Interactive Stack Picker */}
          <div className="sdl-fade-up mt-12" style={{ animationDelay: "0.21s" }}>
            <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4">
              Click a tool to preview its dashboard
            </div>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {STACK_TOOLS.map((tool, idx) => {
                const colors = COLOR_MAPS[tool.color];
                const isActive = selectedStack === idx;
                return (
                  <button
                    key={tool.name}
                    onClick={() => setSelectedStack(isActive ? null : idx)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all duration-300 ${isActive
                      ? `${colors.border} ${colors.bg} shadow-lg scale-105`
                      : "border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] hover:border-blue-400/40"
                      }`}
                  >
                    <div className={`h-7 w-7 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                      <tool.icon className={`h-3.5 w-3.5 ${colors.text}`} />
                    </div>
                    <span className="font-['Space_Grotesk'] text-xs font-semibold">{tool.name}</span>
                  </button>
                );
              })}
            </div>
            {/* Assembled dashboard preview */}
            {selectedStack !== null && (
              <div key={selectedStack} className="sdl-assemble mt-5 mx-auto max-w-md rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.03] backdrop-blur p-5 shadow-xl">
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="ml-2 font-['JetBrains_Mono'] text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {STACK_TOOLS[selectedStack].preview.title}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {STACK_TOOLS[selectedStack].preview.metrics.map((m) => (
                    <div key={m.label} className="rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-2.5">
                      <span className="text-[7.5px] uppercase tracking-wider text-slate-500 font-['JetBrains_Mono']">{m.label}</span>
                      <div className="font-['Space_Grotesk'] text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5">{m.value}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-end justify-between h-14 px-1">
                  {STACK_TOOLS[selectedStack].preview.bars.map((h, i) => (
                    <div key={i} className="flex flex-col items-center w-6">
                      <div
                        className={`w-full rounded-t-sm sdl-bar ${i === 6 ? "bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "bg-blue-500/40"}`}
                        style={{ height: `${h}%`, animationDelay: `${i * 60}ms` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Live metrics strip */}
          <div
            className="sdl-fade-up mt-10 mx-auto grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3"
            style={{ animationDelay: "0.28s" }}
          >
            {[
              { label: "Rows Synced Today", value: rowsSynced.toLocaleString(), live: true },
              { label: "Median Time to Insight", value: "1 click", live: false },
              { label: "Integrated Departments", value: "100% Live", live: false },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur px-5 py-4 text-left"
              >
                <div className="flex items-center gap-1.5 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                  {m.live && <Radio className="h-3 w-3 text-blue-500" />}
                  {m.label}
                </div>
                <div className="mt-1.5 font-['Space_Grotesk'] text-2xl font-semibold tabular-nums">
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================== PAIN ========================== */}
      <section id="pain" className="relative py-24 px-6 overflow-hidden">
        <div className={`mx-auto max-w-7xl ${revealClass("pain")}`}>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.25em] text-amber-600 dark:text-amber-300">
              THE HIDDEN COST
            </div>
            <h2 className="mt-3 font-['Space_Grotesk'] text-3xl sm:text-5xl font-semibold tracking-tight leading-tight">
              You’re not managing a business. You’re managing a mess of tools.
            </h2>
            <p className="mt-6 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Your financial revenue, team numbers, marketing metrics, and sales pipelines are trapped in completely separate, disconnected software applications. Stop hopping between tabs to run your business.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* App-Hopping Simulator Panel */}
            <div className="lg:col-span-7 flex flex-col rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur shadow-2xl overflow-hidden min-h-[460px] transition-all duration-300">
              {/* Simulator Action Banner */}
              <div className="bg-amber-500/10 dark:bg-amber-500/[0.06] border-b border-slate-200 dark:border-white/5 px-4 py-2 text-[10px] sm:text-xs text-amber-800 dark:text-amber-300 font-semibold flex items-center justify-between shrink-0">
                <span className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                  </span>
                  👉 CLICK THE TABS to experience the app-hopping chaos:
                </span>
                <span className="hidden sm:inline font-['JetBrains_Mono'] text-[9.5px] uppercase opacity-75 font-normal">Active Tab = Disconnected App</span>
              </div>

              {/* Browser Header */}
              <div className="bg-slate-100 dark:bg-[#0c1220]/60 border-b border-slate-200 dark:border-white/5 p-3 flex flex-col gap-2 shrink-0">
                <div className="flex items-center justify-between">
                  {/* Browser Dots */}
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-400/85" />
                    <span className="h-3 w-3 rounded-full bg-amber-400/85" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400/85" />
                  </div>

                  {/* Browser URL Bar */}
                  <div className="mx-4 flex-1 max-w-md rounded-md bg-white dark:bg-[#070b12] border border-slate-200 dark:border-white/5 px-3 py-1 text-[10px] text-slate-400 dark:text-slate-500 font-['JetBrains_Mono'] flex items-center gap-1.5 truncate">
                    <span className="text-blue-500 select-none">https://</span>
                    <span className="truncate">
                      {activeAppTab === "accounting" && "books.zoho.com/app/ledger"}
                      {activeAppTab === "sales" && "crm.zoho.com/deals/pipeline"}
                      {activeAppTab === "hr" && "darwinbox.internal/payroll"}
                      {activeAppTab === "marketing" && "analytics.google.com/ad-spend"}
                    </span>
                  </div>

                  <div className="w-12" /> {/* Spacer */}
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-1.5 mt-1 overflow-x-auto no-scrollbar">
                  {[
                    { id: "accounting", label: "Accounting Platform", icon: Building2 },
                    { id: "sales", label: "Sales CRM", icon: FileSpreadsheet },
                    { id: "hr", label: "HR Software", icon: Users },
                    { id: "marketing", label: "Marketing Analytics", icon: ShoppingCart },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeAppTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleAppTabChange(tab.id as any)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-300 shrink-0 ${isActive
                            ? "bg-white dark:bg-[#080B12] text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-white/10 shadow-sm font-bold scale-105"
                            : "text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/[0.02]"
                          }`}
                      >
                        <Icon className="h-3 w-3" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Browser Content (Active Dashboard) */}
              <div className="flex-1 p-5 sm:p-6 bg-slate-50 dark:bg-[#080B12]/40 relative overflow-hidden flex flex-col justify-between">
                {/* ACCOUNTING DASHBOARD */}
                {activeAppTab === "accounting" && (
                  <div className="sdl-scale-in flex-1 flex flex-col justify-between gap-5">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-['JetBrains_Mono'] uppercase tracking-wider text-slate-400 font-semibold">General Ledger & Revenue</span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">Synced 5d ago</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0c1220] p-3 shadow-sm relative overflow-hidden">
                          <span className="text-[8px] uppercase tracking-wider text-slate-400 font-['JetBrains_Mono']">Monthly Rev</span>
                          <div className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">₹12,40,000</div>
                        </div>
                        {/* Highlighted Warning Card */}
                        <div className="rounded-xl border border-red-500 bg-red-500/5 dark:bg-red-500/[0.03] p-3 shadow-sm relative overflow-hidden ring-1 ring-red-500/15 animate-[pulse_3s_infinite]">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] uppercase tracking-wider text-red-600 dark:text-red-400 font-['JetBrains_Mono'] font-bold">Receivables</span>
                            <span className="text-[7.5px] px-1 bg-red-500/25 text-red-700 dark:text-red-300 rounded font-bold uppercase">Unsynced</span>
                          </div>
                          <div className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-red-600 dark:text-red-400 mt-1">₹3,80,000</div>
                        </div>
                        <div className="rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0c1220] p-3 shadow-sm relative overflow-hidden">
                          <span className="text-[8px] uppercase tracking-wider text-slate-500 font-['JetBrains_Mono']">Cash In Hand</span>
                          <div className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">₹4,20,000</div>
                        </div>
                      </div>
                    </div>

                    {/* Chart & Tooltip Container */}
                    <div className="relative flex-1 flex flex-col justify-end min-h-[140px] mt-4">
                      {/* Placeholder Chart */}
                      <div className="w-full h-24 flex items-end justify-between px-2 pb-1 relative">
                        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                          <path
                            d="M 0 60 Q 50 30, 100 80 T 200 40 T 300 70 T 400 90 T 500 50"
                            fill="none"
                            stroke="rgba(59, 130, 246, 0.25)"
                            strokeWidth="2"
                          />
                          <path
                            d="M 0 80 L 100 65 L 200 75 L 300 50 L 400 90 L 500 85"
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                          />
                        </svg>
                        <div className="w-full flex justify-between text-[7px] font-['JetBrains_Mono'] text-slate-400 mt-2">
                          <span>WK 1</span>
                          <span>WK 2</span>
                          <span>WK 3</span>
                          <span>WK 4</span>
                        </div>
                      </div>

                      {/* Warnings Tooltip */}
                      <div className="sdl-assemble absolute inset-x-0 top-2 mx-auto max-w-sm rounded-xl border border-red-500/20 dark:border-red-500/30 bg-red-50/90 dark:bg-red-500/[0.08] backdrop-blur-md p-3.5 shadow-lg flex items-start gap-2.5 z-10">
                        <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-['Space_Grotesk'] font-bold text-[11px] text-red-750 dark:text-red-400 leading-tight">Billing Reconciliation Blocked</div>
                          <p className="mt-0.5 text-[10px] text-red-600 dark:text-red-300 leading-relaxed font-medium">
                            14 invoices are waiting for bank reconciliation. Because accounting isn't connected to the payment gateway or CRM, invoice statuses must be typed in manually.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SALES CRM DASHBOARD */}
                {activeAppTab === "sales" && (
                  <div className="sdl-scale-in flex-1 flex flex-col justify-between gap-5">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-['JetBrains_Mono'] uppercase tracking-wider text-slate-400 font-semibold">Sales Pipelines & Funnels</span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">Active Leads</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0c1220] p-3 shadow-sm relative overflow-hidden">
                          <span className="text-[8px] uppercase tracking-wider text-slate-500 font-['JetBrains_Mono']">Total Leads</span>
                          <div className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">1,280</div>
                        </div>
                        <div className="rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0c1220] p-3 shadow-sm relative overflow-hidden">
                          <span className="text-[8px] uppercase tracking-wider text-slate-500 font-['JetBrains_Mono']">Pipeline Value</span>
                          <div className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">₹18,40,000</div>
                        </div>
                        {/* Highlighted Warning Card */}
                        <div className="rounded-xl border border-amber-500 bg-amber-500/5 dark:bg-amber-500/[0.03] p-3 shadow-sm relative overflow-hidden ring-1 ring-amber-500/15 animate-[pulse_3s_infinite]">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-['JetBrains_Mono'] font-bold">CAC (Leads)</span>
                            <span className="text-[7.5px] px-1 bg-amber-500/25 text-amber-700 dark:text-amber-300 rounded font-bold uppercase text-amber-600">Unavailable</span>
                          </div>
                          <div className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400 mt-1">₹ ?,???</div>
                        </div>
                      </div>
                    </div>

                    {/* Funnel & Tooltip Container */}
                    <div className="relative flex-1 flex flex-col justify-end min-h-[140px] mt-4">
                      {/* Funnel representation */}
                      <div className="w-full flex flex-col gap-1.5 px-6 pb-2">
                        <div className="h-3.5 bg-indigo-500/20 dark:bg-indigo-500/10 rounded border border-indigo-500/30 flex items-center justify-between px-2 text-[8px] font-['JetBrains_Mono'] text-indigo-400">
                          <span>LEADS GENERATED</span>
                          <span className="font-bold">100%</span>
                        </div>
                        <div className="h-3.5 w-[75%] mx-auto bg-indigo-500/30 dark:bg-indigo-500/15 rounded border border-indigo-500/40 flex items-center justify-between px-2 text-[8px] font-['JetBrains_Mono'] text-indigo-300">
                          <span>PROPOSALS SENT</span>
                          <span className="font-bold">45%</span>
                        </div>
                        <div className="h-3.5 w-[45%] mx-auto bg-blue-500/30 dark:bg-blue-500/15 rounded border border-blue-500/40 flex items-center justify-between px-2 text-[8px] font-['JetBrains_Mono'] text-blue-300">
                          <span>NEGOTIATIONS</span>
                          <span className="font-bold">18%</span>
                        </div>
                        <div className="h-3.5 w-[15%] mx-auto bg-emerald-500/40 dark:bg-emerald-500/20 rounded border border-emerald-500/50 flex items-center justify-between px-1 text-[8px] font-['JetBrains_Mono'] text-emerald-300">
                          <span>WINS</span>
                          <span className="font-bold">2.8%</span>
                        </div>
                      </div>

                      {/* Warnings Tooltip */}
                      <div className="sdl-assemble absolute inset-x-0 top-0 mx-auto max-w-sm rounded-xl border border-amber-500/20 dark:border-amber-500/30 bg-amber-50/90 dark:bg-amber-500/[0.08] backdrop-blur-md p-3.5 shadow-lg flex items-start gap-2.5 z-10">
                        <AlertCircle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-['Space_Grotesk'] font-bold text-[11px] text-amber-750 dark:text-amber-400 leading-tight">Ad Spend Data Missing</div>
                          <p className="mt-0.5 text-[10px] text-amber-600 dark:text-amber-300 leading-relaxed font-medium">
                            Unable to calculate Customer Acquisition Cost (CAC) for active leads because CRM is isolated from marketing metrics.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* HR SOFTWARE DASHBOARD */}
                {activeAppTab === "hr" && (
                  <div className="sdl-scale-in flex-1 flex flex-col justify-between gap-5">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-['JetBrains_Mono'] uppercase tracking-wider text-slate-400 font-semibold">Darwinbox Staff & Operations</span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">Staff Ledger</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0c1220] p-3 shadow-sm relative overflow-hidden">
                          <span className="text-[8px] uppercase tracking-wider text-slate-500 font-['JetBrains_Mono']">Total Staff</span>
                          <div className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">42 Headcount</div>
                        </div>
                        {/* Highlighted Warning Card */}
                        <div className="rounded-xl border border-red-500 bg-red-500/5 dark:bg-red-500/[0.03] p-3 shadow-sm relative overflow-hidden ring-1 ring-red-500/15 animate-[pulse_3s_infinite]">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] uppercase tracking-wider text-red-600 dark:text-red-400 font-['JetBrains_Mono'] font-bold">Payroll Sync</span>
                            <span className="text-[7.5px] px-1 bg-red-500/25 text-red-700 dark:text-red-300 rounded font-bold uppercase">Manual</span>
                          </div>
                          <div className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-red-600 dark:text-red-400 mt-1">₹8,50,000</div>
                        </div>
                        <div className="rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0c1220] p-3 shadow-sm relative overflow-hidden">
                          <span className="text-[8px] uppercase tracking-wider text-slate-500 font-['JetBrains_Mono']">Expenses Pending</span>
                          <div className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400 mt-1">12 Items</div>
                        </div>
                      </div>
                    </div>

                    {/* Stats rings & Tooltip Container */}
                    <div className="relative flex-1 flex flex-col justify-end min-h-[140px] mt-4">
                      {/* Simple departmental breakdown bar */}
                      <div className="px-6 pb-4">
                        <div className="text-[9px] font-['JetBrains_Mono'] text-slate-400 mb-2 flex justify-between">
                          <span>Department allocation</span>
                          <span>ENG (45%) • SALES (35%) • OPS (20%)</span>
                        </div>
                        <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                          <div className="h-full bg-blue-500" style={{ width: "45%" }} />
                          <div className="h-full bg-indigo-500" style={{ width: "35%" }} />
                          <div className="h-full bg-amber-500" style={{ width: "20%" }} />
                        </div>
                      </div>

                      {/* Warnings Tooltip */}
                      <div className="sdl-assemble absolute inset-x-0 top-0 mx-auto max-w-sm rounded-xl border border-red-500/20 dark:border-red-500/30 bg-red-50/90 dark:bg-red-500/[0.08] backdrop-blur-md p-3.5 shadow-lg flex items-start gap-2.5 z-10">
                        <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-['Space_Grotesk'] font-bold text-[11px] text-red-750 dark:text-red-400 leading-tight">Payroll Out of Sync</div>
                          <p className="mt-0.5 text-[10px] text-red-600 dark:text-red-300 leading-relaxed font-medium">
                            Salaries run in isolation. Your finance team must manually copy bank payout logs to accounting ledgers to reconcile staff costs.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* MARKETING ANALYTICS DASHBOARD */}
                {activeAppTab === "marketing" && (
                  <div className="sdl-scale-in flex-1 flex flex-col justify-between gap-5">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-['JetBrains_Mono'] uppercase tracking-wider text-slate-400 font-semibold">Ad Spend & Campaigns</span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-medium">Tracking Error</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0c1220] p-3 shadow-sm relative overflow-hidden">
                          <span className="text-[8px] uppercase tracking-wider text-slate-500 font-['JetBrains_Mono']">Ad Budget Spent</span>
                          <div className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">₹1,80,000</div>
                        </div>
                        <div className="rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0c1220] p-3 shadow-sm relative overflow-hidden">
                          <span className="text-[8px] uppercase tracking-wider text-slate-500 font-['JetBrains_Mono']">Avg CPC</span>
                          <div className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">₹14.20</div>
                        </div>
                        {/* Highlighted Warning Card */}
                        <div className="rounded-xl border border-red-500 bg-red-500/5 dark:bg-red-500/[0.03] p-3 shadow-sm relative overflow-hidden ring-1 ring-red-500/15 animate-[pulse_3s_infinite]">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] uppercase tracking-wider text-red-500 font-['JetBrains_Mono'] font-bold">ROI Purchases</span>
                            <span className="text-[7.5px] px-1 bg-red-500/25 text-red-700 dark:text-red-300 rounded font-bold uppercase">No CRM Feed</span>
                          </div>
                          <div className="font-['Space_Grotesk'] text-base sm:text-lg font-bold text-red-500 mt-1">₹0.00</div>
                        </div>
                      </div>
                    </div>

                    {/* Chart & Tooltip Container */}
                    <div className="relative flex-1 flex flex-col justify-end min-h-[140px] mt-4">
                      {/* Spend Chart */}
                      <div className="w-full h-20 flex items-end gap-1.5 px-4 pb-2">
                        {[40, 50, 45, 65, 75, 80, 95].map((h, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center">
                            <div className="w-full bg-rose-500/35 dark:bg-rose-500/20 border border-rose-500/40 rounded-t-sm" style={{ height: `${h}%` }} />
                          </div>
                        ))}
                      </div>

                      {/* Warnings Tooltip */}
                      <div className="sdl-assemble absolute inset-x-0 top-0 mx-auto max-w-sm rounded-xl border border-red-500/20 dark:border-red-500/30 bg-red-50/90 dark:bg-red-500/[0.08] backdrop-blur-md p-3.5 shadow-lg flex items-start gap-2.5 z-10">
                        <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-['Space_Grotesk'] font-bold text-[11px] text-red-750 dark:text-red-400 leading-tight">Ad Tracking Broken</div>
                          <p className="mt-0.5 text-[10px] text-red-600 dark:text-red-300 leading-relaxed font-medium">
                            Conversion attribution is offline because Facebook & Google Ads can't read purchase data locked in the Sales CRM. You are advertising half-blind.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Friction Impact Tracker Panel */}
            <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur p-6 sm:p-7 shadow-2xl relative">
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="font-['Space_Grotesk'] text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                    Friction Impact Tracker
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-['JetBrains_Mono']">
                    LIVE SIMULATION OF OPERATIONAL FRICTION
                  </p>
                </div>

                {/* Metric 1: Time Lost to Exporting Data */}
                <div className="rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] p-4 flex items-center gap-4 relative overflow-hidden">
                  <div className="relative">
                    <div className={`h-11 w-11 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 dark:text-amber-400 ${animateClock ? "animate-[spin_0.8s_cubic-bezier(0.16,1,0.3,1)]" : ""}`}>
                      <Clock className="h-5.5 w-5.5" />
                    </div>
                    {showDelta && (
                      <span className="absolute -top-3.5 -right-3 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded animate-[sdl-assemble_0.4s_both]">
                        +4.5h CSV Export
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-['JetBrains_Mono'] uppercase tracking-wider text-slate-400 font-semibold block">Time Lost to Exporting Data</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="font-['Space_Grotesk'] text-2xl font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                        {Math.round(12 + appTabClicks * 4.5)}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">hours / month</span>
                    </div>
                    <span className="text-[9.5px] text-slate-500 dark:text-slate-400 block leading-tight mt-1 font-medium">
                      Based on copy-pasting CSVs and running manual reports. Every tab hop triggers new friction.
                    </span>
                  </div>
                </div>

                {/* Vertical Stack: Overall Connections Status */}
                <div className="rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] p-4 flex flex-col gap-2">
                  <span className="text-[10px] font-['JetBrains_Mono'] uppercase tracking-wider text-slate-400 font-semibold block">Data Connection Audit</span>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold">
                    <div className={`p-2 rounded border flex items-center justify-between transition-all duration-300 ${activeAppTab === 'accounting' ? 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 font-bold shadow-sm' : 'border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-500 font-normal opacity-60'}`}>
                      <span>Accounting</span>
                      <span>{activeAppTab === 'accounting' ? '⚠️ UNSYNCED' : '🔌 DISCONNECTED'}</span>
                    </div>
                    <div className={`p-2 rounded border flex items-center justify-between transition-all duration-300 ${activeAppTab === 'sales' ? 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold shadow-sm' : 'border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-500 font-normal opacity-60'}`}>
                      <span>Sales CRM</span>
                      <span>{activeAppTab === 'sales' ? '⚠️ BLIND' : '🔌 DISCONNECTED'}</span>
                    </div>
                    <div className={`p-2 rounded border flex items-center justify-between transition-all duration-300 ${activeAppTab === 'hr' ? 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 font-bold shadow-sm' : 'border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-500 font-normal opacity-60'}`}>
                      <span>HR Software</span>
                      <span>{activeAppTab === 'hr' ? '⚠️ ISOLATED' : '🔌 DISCONNECTED'}</span>
                    </div>
                    <div className={`p-2 rounded border flex items-center justify-between transition-all duration-300 ${activeAppTab === 'marketing' ? 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 font-bold shadow-sm' : 'border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-500 font-normal opacity-60'}`}>
                      <span>Marketing</span>
                      <span>{activeAppTab === 'marketing' ? '⚠️ UNLINKED' : '🔌 DISCONNECTED'}</span>
                    </div>
                  </div>
                </div>

                {/* Metric 3: Operational Blindspots Details */}
                <div className="rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] p-4 flex flex-col gap-2">
                  <span className="text-[10px] font-['JetBrains_Mono'] uppercase tracking-wider text-slate-400 font-semibold block">Active Friction Blindspot Detail</span>

                  {activeAppTab === "accounting" && (
                    <div className="sdl-scale-in">
                      <span className="font-['Space_Grotesk'] text-[13px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                        <AlertCircle className="h-4 w-4 shrink-0" /> Financials Out of Sync (Manual Reconciliation)
                      </span>
                      <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                        Sales billing records aren't linked to bank deposits. To check if an invoice is paid, your accounting team must manually download banking CSV logs and match rows in Excel.
                      </p>
                    </div>
                  )}

                  {activeAppTab === "sales" && (
                    <div className="sdl-scale-in">
                      <span className="font-['Space_Grotesk'] text-[13px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                        <AlertCircle className="h-4 w-4 shrink-0" /> CAC & Margin Blindness (No Spend Sync)
                      </span>
                      <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                        Sales reps close deals without knowing how much was spent on advertising to acquire that customer. You could be selling high-value packages at a net loss.
                      </p>
                    </div>
                  )}

                  {activeAppTab === "hr" && (
                    <div className="sdl-scale-in">
                      <span className="font-['Space_Grotesk'] text-[13px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                        <AlertCircle className="h-4 w-4 shrink-0" /> Salaries Detached from Ledger (Double Work)
                      </span>
                      <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium font-medium">
                        Payroll and claims run inside the HR platform with no cash flow checks. Finance must manually re-type payroll sheets into ledger entries, causing delays and errors.
                      </p>
                    </div>
                  )}

                  {activeAppTab === "marketing" && (
                    <div className="sdl-scale-in">
                      <span className="font-['Space_Grotesk'] text-[13px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                        <AlertCircle className="h-4 w-4 shrink-0" /> Marketing Budget Burned Blindly (No Conversion Feed)
                      </span>
                      <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium font-medium">
                        Ad platforms optimize campaigns based on form sign-ups, not actual paid sales, because CRM purchases aren't sent back. You are paying for clicks that don't convert to cash.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================== BEFORE / AFTER SLIDER ========================== */}
      <section id="before-after" className="relative py-16 px-6">
        <div className={`mx-auto max-w-5xl ${revealClass("before-after")}`}>
          <div className="text-center mb-8">
            <div className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
              DRAG TO COMPARE
            </div>
            <h2 className="mt-2 font-['Space_Grotesk'] text-2xl sm:text-3xl font-semibold tracking-tight">
              From chaos to clarity
            </h2>
          </div>
          <div
            ref={sliderRef}
            className="relative mx-auto max-w-4xl rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-xl select-none"
            style={{ height: "380px" }}
          >
            {/* BEFORE — Chaos (full background) */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 p-6 sm:p-10 flex flex-col items-center justify-center gap-4">
              <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-red-500 dark:text-red-400 font-bold mb-2">⚠ Without Samagra</div>
              <div className="relative w-full max-w-md h-56">
                {[
                  { name: "Tally", x: "5%", y: "10%", rot: -6, color: "border-amber-400/40 bg-amber-500/10" },
                  { name: "CRM", x: "55%", y: "5%", rot: 4, color: "border-blue-400/40 bg-blue-500/10" },
                  { name: "HR Sheet", x: "15%", y: "55%", rot: -3, color: "border-pink-400/40 bg-pink-500/10" },
                  { name: "Ad Platform", x: "60%", y: "50%", rot: 7, color: "border-indigo-400/40 bg-indigo-500/10" },
                  { name: "Bank CSV", x: "35%", y: "30%", rot: -2, color: "border-red-400/40 bg-red-500/10" },
                ].map((tab) => (
                  <div
                    key={tab.name}
                    className={`absolute border ${tab.color} rounded-xl px-4 py-3 shadow-md backdrop-blur-sm`}
                    style={{ left: tab.x, top: tab.y, transform: `rotate(${tab.rot}deg)` }}
                  >
                    <div className="font-['Space_Grotesk'] text-xs font-bold text-slate-700 dark:text-slate-300">{tab.name}</div>
                    <div className="font-['JetBrains_Mono'] text-[8px] text-red-400 uppercase mt-1">Disconnected</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AFTER — Unified (clipped overlay) */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-[#0B1324] to-[#071018] p-6 sm:p-10 flex flex-col items-center justify-center gap-3"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <div className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold mb-2">✓ With Samagra</div>
              <div className="w-full max-w-sm rounded-2xl border border-blue-500/20 bg-[#0D1526]/90 p-5 shadow-2xl">
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="h-2 w-2 rounded-full bg-blue-400 sdl-blink" />
                  <span className="font-['JetBrains_Mono'] text-[9px] text-blue-400 uppercase tracking-wider font-bold">Unified Dashboard</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[{ l: "Revenue", v: "₹4.2L" }, { l: "Orders", v: "128" }, { l: "Team", v: "94%" }].map((s) => (
                    <div key={s.l} className="rounded-lg bg-slate-900 border border-slate-800 p-2 text-center">
                      <div className="text-[7px] text-slate-500 font-['JetBrains_Mono'] uppercase">{s.l}</div>
                      <div className="font-['Space_Grotesk'] text-sm font-bold text-blue-400 mt-0.5">{s.v}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-end justify-between h-12 px-1">
                  {[35, 50, 45, 70, 55, 80, 75].map((h, i) => (
                    <div key={i} className="w-4">
                      <div className={`w-full rounded-t-sm ${i === 6 ? "bg-blue-400" : "bg-blue-500/40"}`} style={{ height: `${h}%` }} />
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-center gap-3">
                  {["Tally", "CRM", "HR", "Ads", "Bank"].map((t) => (
                    <span key={t} className="text-[7px] font-['JetBrains_Mono'] text-blue-600 dark:text-blue-500 uppercase flex items-center gap-1">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Slider handle */}
            <div
              className="absolute top-0 bottom-0 z-20 flex items-center cursor-ew-resize"
              style={{ left: `calc(${sliderPos}% - 20px)`, width: "40px" }}
              onMouseDown={() => { isDragging.current = true; }}
              onTouchStart={() => { isDragging.current = true; }}
            >
              <div className="mx-auto w-1 h-full bg-white/80 dark:bg-white/60 shadow-lg" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-slate-800 border-2 border-blue-400 flex items-center justify-center shadow-xl">
                <GripVertical className="h-4 w-4 text-blue-500" />
              </div>
            </div>
          </div>
          <div className="text-center mt-6 font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Slide to compare
          </div>
          <div className="text-center mt-10 max-w-2xl mx-auto px-4">
            <h3 className="font-['Space_Grotesk'] text-lg sm:text-xl font-semibold text-slate-900 dark:text-white leading-snug">
              Transform disconnected data into actionable business intelligence.
            </h3>
            <p className="mt-3 text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              Connect your CRM, accounting software, marketing platforms, and other business tools into one unified dashboard for real-time insights, smarter decisions, and sustainable growth.
            </p>
          </div>
        </div>
      </section>

      {/* ========================== SYNC GRID ========================== */}
      <section id="chaos" className="relative py-20 px-6 overflow-hidden bg-[#F8FAFC] dark:bg-[#030712]">
        {/* Dot grid background */}
        <div
          className="absolute inset-0 opacity-40 dark:opacity-[0.25] pointer-events-none text-slate-900/15 dark:text-white/10"
          style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-blue-500/[0.02] dark:bg-blue-500/[0.03] blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/[0.02] dark:bg-blue-500/[0.03] blur-[100px] pointer-events-none" />

        <div className={`mx-auto max-w-7xl relative z-10 ${revealClass("chaos")}`}>
          {/* Main Card Container */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#080B16]/60 backdrop-blur-md p-6 sm:p-10 shadow-2xl relative overflow-hidden">

            {/* ========= DESKTOP LAYOUT ========= */}
            <div
              className="hidden lg:flex items-stretch relative justify-between w-full h-[600px]"
            >
              {/* SVG Overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1000 600" preserveAspectRatio="none" fill="none">
                {/* 10 Left lines converging from left column to center hub */}
                {lineYs.map((y, idx) => {
                  const color = lineColors[idx];
                  const isHovered = hoveredToolIdx === idx;
                  const hasSomeHover = hoveredToolIdx !== null;
                  const baseOpacity = hasSomeHover ? (isHovered ? 0.8 : 0.04) : 0.1;
                  const flowOpacity = hasSomeHover ? (isHovered ? 0.9 : 0.06) : 0.45;
                  const sw = isHovered ? 2.5 : 1.5;
                  return (
                    <g key={idx}>
                      <path
                        d={`M 250,${y} C 290,${y} 290,300 330,300`}
                        stroke={color}
                        strokeWidth={sw}
                        strokeOpacity={baseOpacity}
                        strokeLinecap="round"
                        style={{ transition: "stroke-opacity 0.3s, stroke-width 0.3s" }}
                      />
                      <path
                        d={`M 250,${y} C 290,${y} 290,300 330,300`}
                        stroke={color}
                        strokeWidth={sw}
                        strokeOpacity={flowOpacity}
                        strokeLinecap="round"
                        className="sdl-flow-line"
                        style={{ transition: "stroke-opacity 0.3s, stroke-width 0.3s" }}
                      />
                    </g>
                  );
                })}
                {/* Traveling dots */}
                <circle r="4" fill="#14b8a6">
                  <animateMotion dur="3.2s" repeatCount="indefinite" path="M 250,90 C 290,90 290,300 330,300" />
                </circle>
                <circle r="4" fill="#f59e0b">
                  <animateMotion dur="2.8s" repeatCount="indefinite" path="M 250,330 C 290,330 290,300 330,300" />
                </circle>
                <circle r="4" fill="#ef4444">
                  <animateMotion dur="3.6s" repeatCount="indefinite" path="M 250,510 C 290,510 290,300 330,300" />
                </circle>
                {/* Right output lines */}
                <g>
                  <path d="M 670,300 C 710,300 710,300 750,300" stroke="#14b8a6" strokeWidth="2" strokeOpacity="0.1" strokeLinecap="round" />
                  <path d="M 670,300 C 710,300 710,300 750,300" stroke="#14b8a6" strokeWidth="2" strokeOpacity="0.55" strokeLinecap="round" className="sdl-flow-line" />
                  <circle r="4.5" fill="#14b8a6"><animateMotion dur="3.8s" repeatCount="indefinite" path="M 670,300 C 710,300 710,300 750,300" /></circle>
                </g>

              </svg>

              {/* Left Column: Source Tools */}
              <div className="flex flex-col justify-between h-full py-1 relative z-20" style={{ width: "25%" }}>
                {sourceTools.map((tool, idx) => {
                  const colors = COLOR_MAPS[tool.color];
                  return (
                    <div
                      key={tool.name}
                      style={{ height: "46px" }}
                      className={`w-full flex items-center justify-between px-3.5 rounded-xl border bg-white/90 dark:bg-[#0B1324]/90 shadow-sm relative group transition-all duration-200 cursor-pointer ${hoveredToolIdx === idx
                        ? `border-blue-400 dark:border-blue-500 shadow-md ring-1 ring-teal-400/20`
                        : filteredToolName === tool.name
                          ? `border-blue-400/60 dark:border-blue-500/60 bg-blue-500/5`
                          : "border-slate-200 dark:border-slate-800/80 hover:border-slate-350 dark:hover:border-slate-700"
                        }`}
                      onMouseEnter={() => setHoveredToolIdx(idx)}
                      onMouseLeave={() => setHoveredToolIdx(null)}
                      onClick={() => handleToolClick(tool.name)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-7 w-7 rounded-md ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                          <tool.icon className={`h-3.5 w-3.5 ${colors.text}`} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-['Space_Grotesk'] text-[11px] font-bold text-slate-800 dark:text-white tracking-wide">
                            {tool.name}
                          </span>
                          <span className="font-['JetBrains_Mono'] text-[7.5px] uppercase tracking-wider text-slate-500 font-semibold mt-0.5">
                            {tool.label}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${colors.dot} ${colors.glow} sdl-blink`} />
                      </div>
                      <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-inner">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Center Column: Sync Hub */}
              <div className="flex flex-col justify-center items-center px-8 relative z-20" style={{ width: "50%" }}>
                <div
                  className="rounded-3xl border border-blue-500/20 bg-white/95 dark:bg-[#070D1A]/95 p-6 shadow-2xl relative overflow-hidden flex flex-col items-center"
                  style={{ width: "68%" }}
                >
                  <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-slate-50 dark:bg-slate-950 border border-blue-500 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  </span>
                  <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-slate-50 dark:bg-slate-950 border border-blue-500 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  </span>
                  <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
                  <div className="h-16 w-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shadow-lg relative group">
                    <div className="absolute inset-0 rounded-2xl bg-blue-500/10 scale-110 opacity-75" style={{ animation: "sdl-pulse-ring 1.8s cubic-bezier(0,0,0.2,1) infinite" }} />
                    <Cpu className="h-7 w-7 text-blue-500 dark:text-blue-400" />
                  </div>
                  <h3 className="mt-4 font-['Space_Grotesk'] text-sm font-bold tracking-[0.2em] text-slate-800 dark:text-white uppercase">
                    QUANTUM SYNC
                  </h3>
                  <div className="mt-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-0.5 font-['JetBrains_Mono'] text-[9px] font-semibold uppercase tracking-[0.15em] text-blue-600 dark:text-blue-300">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-current opacity-75" style={{ animation: "sdl-pulse-ring 1.8s cubic-bezier(0,0,0.2,1) infinite" }} />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
                      </span>
                      AI Processor Active
                    </span>
                  </div>
                  {/* Console feed */}
                  <div className="mt-6 w-full rounded-2xl bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 shadow-inner text-left font-['JetBrains_Mono'] min-h-[145px] flex flex-col justify-between">
                    <div className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-slate-900 pb-2 mb-2 font-bold flex justify-between items-center">
                      <span>{filteredToolName ? `Filtering: ${filteredToolName}` : "Console Feed"}</span>
                      <span className={`h-1.5 w-1.5 rounded-full ${filteredToolName ? "bg-amber-500" : "bg-blue-500"} sdl-blink`} />
                    </div>
                    <div className="space-y-2 overflow-hidden flex-1 flex flex-col justify-end">
                      {displayedLogs.map((log, index) => {
                        const isLatest = index === displayedLogs.length - 1;
                        return (
                          <div
                            key={`${log}-${index}`}
                            className={`text-[10px] leading-relaxed truncate font-medium transition-all duration-500 ${isLatest
                              ? "text-blue-600 dark:text-blue-400 font-bold"
                              : "text-slate-400 dark:text-slate-500 opacity-80"
                              }`}
                          >
                            <span className="text-blue-500 dark:text-blue-700 mr-2">&gt;</span>
                            {log}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Preview Cards */}
              <div className="flex flex-col justify-center h-full py-1 relative z-20" style={{ width: "25%" }}>
                {/* Centralised Dashboards */}
                <div
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#0B1324]/80 p-3.5 shadow-xl relative overflow-hidden flex flex-col gap-2 cursor-pointer transition-all hover:shadow-2xl hover:border-blue-400/30"
                  style={{ minHeight: "290px" }}
                  onClick={() => setExpandedCard("telemetry")}
                >
                  <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-inner z-30">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  </span>

                  {/* Title bar */}
                  <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="ml-2 font-['JetBrains_Mono'] text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      Centralised Dashboards
                    </span>
                  </div>

                  {/* KPI row */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-lg p-1.5">
                      <span className="text-[7px] uppercase tracking-wider text-slate-500 font-['JetBrains_Mono']">Revenue</span>
                      <div className="font-['Space_Grotesk'] text-[11px] font-bold text-emerald-600 dark:text-emerald-400">₹12.6L</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-lg p-1.5">
                      <span className="text-[7px] uppercase tracking-wider text-slate-500 font-['JetBrains_Mono']">Expenses</span>
                      <div className="font-['Space_Grotesk'] text-[11px] font-bold text-pink-600 dark:text-pink-400">₹4.2L</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-lg p-1.5">
                      <span className="text-[7px] uppercase tracking-wider text-slate-500 font-['JetBrains_Mono']">Net Profit</span>
                      <div className="font-['Space_Grotesk'] text-[11px] font-bold text-blue-600 dark:text-blue-400">₹8.4L</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-lg p-1.5">
                      <span className="text-[7px] uppercase tracking-wider text-slate-500 font-['JetBrains_Mono']">Growth</span>
                      <div className="font-['Space_Grotesk'] text-[11px] font-bold text-cyan-600 dark:text-cyan-400">+23%</div>
                    </div>
                  </div>

                  {/* Mini bar chart */}
                  <div className="flex items-end justify-between h-14 px-0.5 pt-1">
                    {[40, 55, 38, 72, 60, 78, 65, 88, 74, 95].map((h, i) => (
                      <div key={i} className="flex-1 mx-px">
                        <div
                          className={`w-full rounded-t-[2px] sdl-bar ${
                            i === 9
                              ? "bg-cyan-500 dark:bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.7)] animate-pulse"
                              : i >= 7
                              ? "bg-blue-500/70"
                              : "bg-blue-500/35"
                          }`}
                          style={{ height: `${h}%`, animationDelay: `${i * 60}ms` }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Sparkline trend row */}
                  <div className="flex items-center gap-1.5 px-0.5">
                    <svg viewBox="0 0 80 18" className="flex-1" preserveAspectRatio="none" style={{ height: 18 }}>
                      <polyline
                        points="0,16 10,12 20,14 30,8 40,10 50,5 60,7 70,3 80,1"
                        fill="none"
                        stroke="#22d3ee"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.8"
                      />
                      <polyline
                        points="0,16 10,12 20,14 30,8 40,10 50,5 60,7 70,3 80,1"
                        fill="url(#sparkGrad)"
                        stroke="none"
                        opacity="0.15"
                      />
                      <defs>
                        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22d3ee" />
                          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="font-['JetBrains_Mono'] text-[7px] text-cyan-500 font-bold shrink-0">▲ +23%</span>
                  </div>

                  <span className="font-['JetBrains_Mono'] text-[7px] text-slate-500 text-center uppercase tracking-wider">
                    Click to expand · 10 sources live
                  </span>
                </div>

              </div>
            </div>

            {/* ========= MOBILE LAYOUT ========= */}
            <div className="flex lg:hidden flex-col gap-6 items-center w-full">
              {/* Grid of source tools */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 w-full">
                {sourceTools.map((tool) => {
                  const colors = COLOR_MAPS[tool.color];
                  return (
                    <div
                      key={tool.name}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border shadow-sm cursor-pointer transition-all ${filteredToolName === tool.name
                        ? "border-blue-400 bg-blue-500/10 dark:bg-blue-500/5"
                        : "border-slate-800 bg-[#0B1324]/90"
                        }`}
                      onClick={() => handleToolClick(tool.name)}
                    >
                      <div className={`h-7 w-7 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center shrink-0`}>
                        <tool.icon className={`h-3.5 w-3.5 ${colors.text}`} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-['Space_Grotesk'] text-[10px] font-bold text-white truncate leading-tight">
                          {tool.name}
                        </span>
                        <span className="font-['JetBrains_Mono'] text-[7.5px] text-slate-500 uppercase tracking-wider truncate">
                          {tool.label}
                        </span>
                      </div>
                      <span className={`h-1.5 w-1.5 rounded-full ml-auto ${colors.dot} sdl-blink shrink-0`} />
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-center py-1">
                <ArrowDown className="h-5 w-5 text-blue-400 animate-bounce" />
              </div>

              {/* Sync Hub (mobile) */}
              <div className="w-full max-w-md rounded-3xl border border-blue-500/20 bg-[#070D1A] p-6 shadow-xl flex flex-col items-center">
                <div className="h-14 w-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shadow-lg relative">
                  <div className="absolute inset-0 rounded-2xl bg-blue-500/10 scale-110 opacity-75 sdl-pulse-ring animate-ping" />
                  <Cpu className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="mt-3 font-['Space_Grotesk'] text-sm font-bold tracking-[0.2em] text-white uppercase">
                  QUANTUM SYNC
                </h3>
                <div className="mt-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-blue-500/30 bg-blue-500/10 font-['JetBrains_Mono'] text-[8.5px] text-blue-300 font-semibold uppercase">
                    AI Processor Active
                  </span>
                </div>
                {/* Console (mobile) */}
                <div className="mt-4 w-full rounded-xl bg-slate-950 p-4 border border-slate-900 text-left font-['JetBrains_Mono'] min-h-[120px] flex flex-col justify-end">
                  <div className="text-[8px] text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-1.5 mb-2 font-bold">
                    {filteredToolName ? `Filtering: ${filteredToolName}` : "Console Feed"}
                  </div>
                  <div className="space-y-1.5 overflow-hidden">
                    {displayedLogs.map((log, index) => {
                      const isLatest = index === displayedLogs.length - 1;
                      return (
                        <div
                          key={`${log}-${index}`}
                          className={`text-[9.5px] leading-relaxed truncate transition-all duration-300 ${isLatest ? "text-blue-400 font-bold" : "text-slate-500"}`}
                        >
                          &gt; {log}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-center py-1">
                <ArrowDown className="h-5 w-5 text-blue-400 animate-bounce" />
              </div>

              {/* Preview cards (mobile) */}
              <div className="w-full max-w-md flex flex-col gap-6">
                {/* Centralised Dashboards (mobile) */}
                <div
                  className="rounded-2xl border border-slate-800 bg-[#0B1324]/80 p-4 shadow-lg relative overflow-hidden flex flex-col gap-3 cursor-pointer"
                  onClick={() => setExpandedCard("telemetry")}
                >
                  <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="ml-2 font-['JetBrains_Mono'] text-[9px] font-bold text-blue-400 uppercase tracking-wider">
                      Centralised Dashboards
                    </span>
                  </div>
                  {/* KPI grid */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { label: "Revenue", val: "₹12.6L", color: "text-emerald-400" },
                      { label: "Expenses", val: "₹4.2L", color: "text-pink-400" },
                      { label: "Net", val: "₹8.4L", color: "text-blue-400" },
                      { label: "Growth", val: "+23%", color: "text-cyan-400" },
                    ].map((k) => (
                      <div key={k.label} className="bg-slate-950 border border-slate-900 rounded-lg p-1.5 text-center">
                        <span className="text-[6.5px] uppercase tracking-wider text-slate-500 font-['JetBrains_Mono']">{k.label}</span>
                        <div className={`font-['Space_Grotesk'] text-[10px] font-bold ${k.color}`}>{k.val}</div>
                      </div>
                    ))}
                  </div>
                  {/* Bar chart */}
                  <div className="flex items-end justify-between h-16 px-1">
                    {[40, 55, 38, 72, 60, 78, 65, 88, 74, 95].map((h, i) => (
                      <div key={i} className="flex-1 mx-px">
                        <div
                          className={`w-full rounded-t-[2px] ${
                            i === 9 ? "bg-cyan-400" : i >= 7 ? "bg-blue-500/70" : "bg-blue-500/35"
                          }`}
                          style={{ height: `${h}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  {/* Sparkline */}
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 80 18" className="flex-1" preserveAspectRatio="none" style={{ height: 16 }}>
                      <polyline points="0,16 10,12 20,14 30,8 40,10 50,5 60,7 70,3 80,1" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
                    </svg>
                    <span className="font-['JetBrains_Mono'] text-[8px] text-cyan-400 font-bold">▲ +23% MoM</span>
                  </div>
                </div>


              </div>
            </div>

            {/* Caption */}
            <div className="mt-8 border-t border-slate-800/60 pt-6 text-center">
              <p className="font-['JetBrains_Mono'] text-[9px] sm:text-[10px] font-semibold tracking-[0.18em] text-blue-400 uppercase flex items-center justify-center gap-2">
                <span>⚡</span>
                <span>SAMAGRA SYNC GRID — AUTO-CAPTURING LEDGER TELEMETRY FROM ERPS, BANKS & BILLING NETWORKS INTO AI PROCESSOR</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================== EXPANDED CARD MODAL ========================== */}
      {expandedCard && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setExpandedCard(null)}
        >
          <div
            className="sdl-scale-in relative max-w-lg w-full rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1324] p-8 shadow-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setExpandedCard(null)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="h-4 w-4 text-slate-500" />
            </button>

            {expandedCard === "telemetry" && (
              <>
                {/* Header */}
                <div className="flex items-center gap-1.5 mb-5">
                  <span className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="h-3 w-3 rounded-full bg-amber-500" />
                  <span className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="ml-3 font-['JetBrains_Mono'] text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Centralised Dashboards — Expanded
                  </span>
                </div>

                {/* KPI cards — 4 wide */}
                <div className="grid grid-cols-4 gap-2 mb-5">
                  {[
                    { label: "Revenue", value: "₹12.6L", color: "text-emerald-600 dark:text-emerald-400", trend: "+18%" },
                    { label: "Expenses", value: "₹4.2L", color: "text-pink-600 dark:text-pink-400", trend: "-5%" },
                    { label: "Net Profit", value: "₹8.4L", color: "text-blue-600 dark:text-blue-400", trend: "+23%" },
                    { label: "Cash Flow", value: "₹6.1L", color: "text-cyan-600 dark:text-cyan-400", trend: "+11%" },
                  ].map((m) => (
                    <div key={m.label} className="rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 text-center">
                      <span className="text-[8px] uppercase tracking-wider text-slate-500 font-['JetBrains_Mono']">{m.label}</span>
                      <div className={`font-['Space_Grotesk'] text-base font-bold mt-0.5 ${m.color}`}>{m.value}</div>
                      <div className="font-['JetBrains_Mono'] text-[8px] text-slate-400 mt-0.5">{m.trend}</div>
                    </div>
                  ))}
                </div>

                {/* Bar chart — monthly revenue */}
                <div className="mb-1">
                  <div className="font-['JetBrains_Mono'] text-[8.5px] uppercase tracking-wider text-slate-500 font-bold mb-2">📊 Monthly Revenue (₹L)</div>
                  <div className="flex items-end justify-between h-24 px-1 gap-1">
                    {[
                      { h: 40, label: "Jan" }, { h: 55, label: "Feb" }, { h: 48, label: "Mar" },
                      { h: 70, label: "Apr" }, { h: 62, label: "May" }, { h: 78, label: "Jun" },
                      { h: 68, label: "Jul" }, { h: 85, label: "Aug" }, { h: 74, label: "Sep" },
                      { h: 90, label: "Oct" }, { h: 82, label: "Nov" }, { h: 95, label: "Dec" },
                    ].map(({ h, label }, i) => (
                      <div key={i} className="flex flex-col items-center flex-1">
                        <div
                          className={`w-full rounded-t sdl-bar ${
                            i === 11
                              ? "bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.6)]"
                              : i >= 9
                              ? "bg-blue-500/80"
                              : "bg-blue-500/45"
                          }`}
                          style={{ height: `${h}%`, animationDelay: `${i * 50}ms` }}
                        />
                        <span className="font-['JetBrains_Mono'] text-[6px] text-slate-500 mt-1">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sparkline trend */}
                <div className="mb-4">
                  <div className="font-['JetBrains_Mono'] text-[8.5px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">📈 Profit Trend</div>
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
                    <svg viewBox="0 0 200 40" className="flex-1" preserveAspectRatio="none" style={{ height: 36 }}>
                      <defs>
                        <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <polygon points="0,40 0,32 20,28 40,30 60,22 80,24 100,16 120,18 140,10 160,12 180,6 200,2 200,40" fill="url(#profGrad)" />
                      <polyline points="0,32 20,28 40,30 60,22 80,24 100,16 120,18 140,10 160,12 180,6 200,2" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="200" cy="2" r="3" fill="#22d3ee" />
                    </svg>
                    <div className="shrink-0 text-right">
                      <div className="font-['Space_Grotesk'] text-sm font-bold text-cyan-600 dark:text-cyan-400">+23%</div>
                      <div className="font-['JetBrains_Mono'] text-[8px] text-slate-500">MoM Growth</div>
                    </div>
                  </div>
                </div>

                {/* Progress bars — source breakdown */}
                <div>
                  <div className="font-['JetBrains_Mono'] text-[8.5px] uppercase tracking-wider text-slate-500 font-bold mb-2">🔗 Revenue by Source</div>
                  <div className="space-y-1.5">
                    {[
                      { src: "Tally / ERP", pct: 42, color: "from-blue-600 to-blue-400" },
                      { src: "E-Commerce", pct: 28, color: "from-emerald-600 to-emerald-400" },
                      { src: "Services", pct: 20, color: "from-amber-600 to-amber-400" },
                      { src: "Other", pct: 10, color: "from-pink-600 to-pink-400" },
                    ].map((row) => (
                      <div key={row.src} className="flex items-center gap-2 text-[9px]">
                        <span className="font-['JetBrains_Mono'] text-slate-400 w-20 shrink-0">{row.src}</span>
                        <div className="flex-1 bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                          <div className={`bg-gradient-to-r ${row.color} h-full rounded-full`} style={{ width: `${row.pct}%` }} />
                        </div>
                        <span className="font-['Space_Grotesk'] text-slate-600 dark:text-slate-300 font-bold w-8 text-right">{row.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 font-['JetBrains_Mono'] text-[8px] text-slate-500 text-center uppercase tracking-wider">
                  Live sync — 10 data sources connected
                </div>
              </>
            )}


          </div>
        </div>
      )}

      {/* ========================== SOLUTION ========================== */}
      <section id="solution" className="relative py-20 px-6">
        <div className={`mx-auto max-w-6xl ${revealClass("solution")}`}>
          <div className="text-center mb-14">
            <div className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.25em] text-blue-600 dark:text-blue-300">
              The Solution
            </div>
            <h2 className="mt-3 font-['Space_Grotesk'] text-3xl sm:text-4xl font-semibold tracking-tight">
              One Centralized Dashboard. Your Single Source of Truth.
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-slate-500 dark:text-slate-400">
              We connect Tally, your CRMs, marketing platforms, HR tools, and scattered spreadsheets into a single, live,
              automated hub. Your departmental data reconciles itself. Your reports build themselves. Your
              decisions get faster.{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                Stop chasing updates across multiple tools. Start running your business.
              </span>
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 md:grid-cols-3 bg-slate-200 dark:bg-white/10">
            {[
              { icon: Database, step: "STEP · 01", title: "Connect", desc: "Point us at Tally, Zoho Books, CRMs, ad accounts, spreadsheets, or any database — we handle the plumbing." },
              { icon: Workflow, step: "STEP · 02", title: "Unify", desc: "Sales, marketing, finance, HR, and operations sync automatically, on a schedule you set." },
              { icon: LineChart, step: "STEP · 03", title: "Decide", desc: "One dashboard. Every metric. One click, from anywhere in the world." },
            ].map((s) => (
              <div
                key={s.title}
                className="group relative bg-white dark:bg-[#0B0F19] p-8 transition-colors hover:bg-blue-50/60 dark:hover:bg-blue-500/[0.04]"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-sky-400 scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
                <div className="font-['JetBrains_Mono'] text-[10px] tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  {s.step}
                </div>
                <div className="mt-5 h-11 w-11 rounded-xl bg-gradient-to-br from-blue-500/15 to-amber-400/10 border border-blue-400/25 flex items-center justify-center">
                  <s.icon className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
                <h3 className="mt-5 font-['Space_Grotesk'] text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================== CORE BENEFITS (FLIP CARDS) ========================== */}
      <section id="services" className="relative py-20 px-6">
        <div className={`mx-auto max-w-6xl ${revealClass("services")}`}>
          <div className="text-center mb-14">
            <div className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.25em] text-amber-600 dark:text-amber-300">
              Core Benefits
            </div>
            <h2 className="mt-3 font-['Space_Grotesk'] text-3xl sm:text-4xl font-semibold tracking-tight">
              What clarity actually gets you
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Tap a card to reveal the metric behind the benefit.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: BarChart3, title: "Total Visibility", desc: "Real-time metrics at your fingertips, 24/7.", metric: "0 minutes", metricSub: "waiting for a report", stat: "100%" },
              { icon: Zap, title: "Zero Dependencies", desc: "Stop waiting for manual team updates. Access real-time insights instantly on your own.", metric: "1 click", metricSub: "replaces 5 phone calls", stat: "5×" },
              { icon: Gauge, title: "Growth Optimization", desc: "Spot profit leaks, marketing ROI drops, and team performance trends instantly.", metric: "Real-time", metricSub: "trend detection, not month-end", stat: "↑24%" },
              { icon: ShieldCheck, title: "Unified Intelligence", desc: "Seamless integration across Finance, HR, Operations, and Sales.", metric: "1 dashboard", metricSub: "every department", stat: "∞" },
            ].map((f, idx) => {
              const isFlipped = flippedCards.has(idx);
              return (
                <div
                  key={f.title}
                  className={`sdl-flip-card group ${isFlipped ? "flipped" : ""}`}
                  onClick={() => toggleFlip(idx)}
                  onMouseEnter={() => { if (typeof window !== "undefined" && window.innerWidth >= 1024) setFlippedCards((prev) => new Set(prev).add(idx)); }}
                  onMouseLeave={() => { if (typeof window !== "undefined" && window.innerWidth >= 1024) setFlippedCards((prev) => { const n = new Set(prev); n.delete(idx); return n; }); }}
                  style={{ minHeight: "220px" }}
                >
                  <div className="sdl-flip-card-inner h-full">
                    {/* Front */}
                    <div className="sdl-flip-card-face rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-5 h-full flex flex-col">
                      <div className="h-10 w-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <f.icon className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                      </div>
                      <h3 className="mt-4 font-['Space_Grotesk'] text-base font-semibold">{f.title}</h3>
                      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">{f.desc}</p>
                      <div className="mt-3 font-['JetBrains_Mono'] text-[9px] uppercase tracking-wider text-blue-600/50 dark:text-blue-400/50">
                        Tap to reveal →
                      </div>
                    </div>
                    {/* Back */}
                    <div className="sdl-flip-card-face sdl-flip-card-back rounded-2xl border border-blue-400/30 bg-gradient-to-br from-blue-500/10 to-amber-400/5 dark:from-blue-500/15 dark:to-amber-400/10 p-5 h-full flex flex-col items-center justify-center text-center">
                      <div className="font-['Space_Grotesk'] text-3xl font-bold text-blue-600 dark:text-blue-300">{f.stat}</div>
                      <div className="mt-2 font-['Space_Grotesk'] text-lg font-semibold text-slate-800 dark:text-white">{f.metric}</div>
                      <div className="mt-1 font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {f.metricSub}
                      </div>
                      <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-sky-400" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================== COST CALCULATOR ========================== */}
      <section id="calculator" className="relative py-20 px-6">
        <div className={`mx-auto max-w-4xl rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-8 sm:p-12 ${revealClass("calculator")}`}>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.25em] text-blue-600 dark:text-blue-300">
              <Sliders className="h-3.5 w-3.5" />
              What's Chaos Costing You?
            </div>
            <h2 className="mt-3 font-['Space_Grotesk'] text-2xl sm:text-3xl font-semibold tracking-tight">
              Estimate your team's hidden hours
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <label className="flex items-center justify-between font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Team members compiling reports
                <span className="text-slate-900 dark:text-slate-100 font-semibold">{teamSize}</span>
              </label>
              <input type="range" min={1} max={30} value={teamSize} onChange={(e) => setTeamSize(Number(e.target.value))} className="mt-3 w-full accent-blue-600" />
            </div>
            <div>
              <label className="flex items-center justify-between font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Hours per week, per person
                <span className="text-slate-900 dark:text-slate-100 font-semibold">{hoursPerWeek}</span>
              </label>
              <input type="range" min={1} max={20} value={hoursPerWeek} onChange={(e) => setHoursPerWeek(Number(e.target.value))} className="mt-3 w-full accent-blue-600" />
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {/* Hours Lost */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.01] p-6 text-center">
              <div className="flex items-center justify-center gap-1.5 font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                <Clock className="h-3.5 w-3.5" />
                Hours Lost Monthly
              </div>
              <div className="mt-2.5 font-['Space_Grotesk'] text-4xl font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                {monthlyHoursLost}
              </div>
              {/* Comparison bar */}
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-['JetBrains_Mono'] text-red-500 dark:text-red-400 w-12 shrink-0">Now</span>
                  <div className="flex-1 h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 dark:bg-red-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (monthlyHoursLost / 300) * 100)}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-['JetBrains_Mono'] text-blue-600 dark:text-blue-400 w-12 shrink-0">Samagra</span>
                  <div className="flex-1 h-2 bg-blue-200/50 dark:bg-blue-900/30 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "3%" }} />
                  </div>
                  <span className="text-[8px] font-bold text-blue-600 dark:text-blue-400">0 hrs</span>
                </div>
              </div>
            </div>

            {/* Work Days Lost */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.01] p-6 text-center">
              <div className="flex items-center justify-center gap-1.5 font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                <XCircle className="h-3.5 w-3.5" />
                Work Days Lost
              </div>
              <div className="mt-2.5 font-['Space_Grotesk'] text-4xl font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                {workDaysLost}
              </div>
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-['JetBrains_Mono'] text-red-500 dark:text-red-400 w-12 shrink-0">Now</span>
                  <div className="flex-1 h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 dark:bg-red-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (workDaysLost / 40) * 100)}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-['JetBrains_Mono'] text-blue-600 dark:text-blue-400 w-12 shrink-0">Samagra</span>
                  <div className="flex-1 h-2 bg-blue-200/50 dark:bg-blue-900/30 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "3%" }} />
                  </div>
                  <span className="text-[8px] font-bold text-blue-600 dark:text-blue-400">0 days</span>
                </div>
              </div>
            </div>

            {/* ₹ Cost */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.01] p-6 text-center">
              <div className="flex items-center justify-center gap-1.5 font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                <span className="text-sm">₹</span>
                Cost of Lost Hours
              </div>
              <div className="mt-2.5 font-['Space_Grotesk'] text-4xl font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                ₹{monthlyCostLost.toLocaleString("en-IN")}
              </div>
              <div className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 font-medium">per month @ ₹1000/hr</div>
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-['JetBrains_Mono'] text-red-500 dark:text-red-400 w-12 shrink-0">Now</span>
                  <div className="flex-1 h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 dark:bg-red-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (monthlyCostLost / 300000) * 100)}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-['JetBrains_Mono'] text-blue-600 dark:text-blue-400 w-12 shrink-0">Samagra</span>
                  <div className="flex-1 h-2 bg-blue-200/50 dark:bg-blue-900/30 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "3%" }} />
                  </div>
                  <span className="text-[8px] font-bold text-blue-600 dark:text-blue-400">₹0</span>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            That's <span className="font-bold text-red-500 dark:text-red-400">₹{monthlyCostLost.toLocaleString("en-IN")}</span> and{" "}
            <span className="font-bold text-red-500 dark:text-red-400">{workDaysLost} full working days</span> a month your team could spend growing revenue
            instead of reconciling spreadsheets.
          </p>
        </div>
      </section>

      {/* ========================== FAQ ACCORDION ========================== */}
      <section id="faq" className="relative py-20 px-6">
        <div className={`mx-auto max-w-3xl ${revealClass("faq")}`}>
          <div className="text-center mb-12">
            <div className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
              Common Questions
            </div>
            <h2 className="mt-3 font-['Space_Grotesk'] text-2xl sm:text-3xl font-semibold tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-300 ${isOpen
                    ? "border-blue-400/30 bg-blue-500/5 dark:bg-blue-500/[0.03] shadow-md"
                    : "border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02]"
                    }`}
                >
                  <button
                    className="w-full flex items-center justify-between p-5 text-left gap-4"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                  >
                    <span className="font-['Space_Grotesk'] font-semibold text-sm sm:text-base">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-500" : ""}`}
                    />
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{ maxHeight: isOpen ? "200px" : "0px", opacity: isOpen ? 1 : 0 }}
                  >
                    <p className="px-5 pb-5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================== CTA ========================== */}
      <section id="contact" className="relative py-24 px-6">
        <div className={`mx-auto max-w-4xl relative rounded-3xl border border-slate-200 dark:border-white/[0.06] bg-gradient-to-br from-white to-slate-50/50 dark:from-[#0e1324] dark:to-[#080b12] p-10 sm:p-16 overflow-hidden text-slate-800 dark:text-white shadow-2xl shadow-slate-200/50 dark:shadow-black/60 ${revealClass("contact")}`}>
          {/* Ambient Glows */}
          <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-blue-500/10 dark:bg-blue-500/15 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-amber-400/5 dark:bg-amber-400/10 blur-3xl" />

          {/* Subtle grid pattern inside */}
          <div className="absolute inset-0 opacity-[0.12] dark:opacity-[0.06] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(59,130,246,0.3) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

          <div className="relative text-center flex flex-col items-center">
            {/* Live indicator badge instead of GitBranch */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 dark:border-blue-400/30 bg-blue-500/10 dark:bg-blue-500/[0.05] px-3.5 py-1.5 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300 mb-6">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500" />
              </span>
              Free Consultation
            </div>

            <h2 className="font-['Space_Grotesk'] text-3xl sm:text-5xl font-semibold tracking-tight leading-tight text-slate-900 dark:text-white max-w-2xl">
              Get total clarity,{" "}
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 dark:from-blue-400 dark:via-blue-300 dark:to-sky-400 bg-clip-text text-transparent">
                completely free.
              </span>
            </h2>

            <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed text-sm sm:text-base">
              Stop guessing what's possible. Give us your tool stack, and we'll map out your centralized
              operations console during a free Data Audit. Zero commitment required.
            </p>

            <a
              href="https://wa.me/919288021551?text=Hi%2C%20can%20I%20know%20more%20about%20your%20dashboard%20service%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold bg-slate-900 text-white dark:bg-blue-500 dark:text-slate-950 shadow-lg shadow-slate-900/20 dark:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-200"
              onMouseMove={(e) => handleMagneticMove(e)}
              onMouseLeave={handleMagneticLeave}
            >
              Claim Your Free Data Audit
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </section>

      {/* ========================== FOOTER ========================== */}
      <footer className="relative border-t border-slate-200/70 dark:border-white/[0.06] py-12 px-6">
        <div className="mx-auto max-w-7xl grid gap-8 md:grid-cols-3 text-sm text-slate-500 dark:text-slate-400">
          <div>
            <div className="font-['Space_Grotesk'] font-bold text-slate-900 dark:text-white text-lg tracking-tight leading-tight">
              <span className="text-[#00A5DF]">Business</span> <span className="text-blue-600 dark:text-blue-400">Analytical Solutions</span>
            </div>
            <p className="mt-3 text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs text-xs sm:text-sm">
              We turn scattered Tally, HR, and spreadsheet data into one live dashboard — so you
              manage your business, not your spreadsheets.
            </p>
          </div>

          <div>
            <div className="text-slate-900 dark:text-slate-100 font-semibold mb-3 font-['Space_Grotesk']">Contact Info</div>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                <span>
                  <strong className="text-slate-700 dark:text-slate-300 font-normal">Corporate Head Office:</strong> Kochi, Kerala, India.
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-blue-500 shrink-0" />
                <span>
                  <strong className="text-slate-700 dark:text-slate-300 font-normal">Phone:</strong>{" "}
                  <a href="tel:+919288021551" className="hover:text-blue-500 transition-colors">+91 9288021551</a>
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageSquare className="h-4 w-4 text-blue-500 shrink-0" />
                <span>
                  <strong className="text-slate-700 dark:text-slate-300 font-normal">WhatsApp:</strong>{" "}
                  <a href="https://wa.me/919288021552" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">+91 9288021552</a>
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-blue-500 shrink-0" />
                <span>
                  <strong className="text-slate-700 dark:text-slate-300 font-normal">Email:</strong>{" "}
                  <a href="mailto:info@samagralearning.com" className="hover:text-blue-500 transition-colors">info@samagralearning.com</a>
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col justify-between md:items-end">
            <div>
              <div className="text-slate-900 dark:text-slate-100 font-semibold mb-3 font-['Space_Grotesk'] md:text-right">Links</div>
              <div className="flex gap-4 font-['JetBrains_Mono'] text-xs tracking-wide md:justify-end">
                <span className="hover:text-blue-500 cursor-pointer transition-colors">Privacy</span>
                <span>·</span>
                <span className="hover:text-blue-500 cursor-pointer transition-colors">Terms</span>
                <span>·</span>
                <span className="hover:text-blue-500 cursor-pointer transition-colors">Security</span>
              </div>
            </div>
            <div className="mt-8 md:mt-0 md:text-right font-['JetBrains_Mono'] text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
              © {new Date().getFullYear()} Samagra Progressive Learning Solutions Pvt Ltd. All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
