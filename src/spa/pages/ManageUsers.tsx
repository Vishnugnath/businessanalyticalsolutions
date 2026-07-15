import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { useAuth } from "@/spa/AuthContext";
import { useToast } from "@/spa/components/Toast";
import { Spinner } from "@/spa/components/Spinner";
import { writeAuditLog, type AuditAction } from "@/lib/auditLog";
import {
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  History,
  Users,
  LogOut,
  Loader2,
  Clock,
  Search,
  UserPlus,
  UserMinus,
  Link2,
  RefreshCw,
  LogIn,
  FileSpreadsheet,
} from "lucide-react";
import { ThemeToggle } from "@/spa/ThemeContext";

interface UserDoc {
  id: string;
  email: string;
  role: "user" | "admin" | "superadmin";
  createdAt?: { seconds: number } | null;
  updatedAt?: { seconds: number } | null;
}

interface AuditLogDoc {
  id: string;
  action: AuditAction;
  operatorUid: string;
  operatorEmail: string;
  targetEmail: string;
  targetUid?: string;
  details: Record<string, string>;
  timestamp?: { seconds: number } | null;
}

const ACTION_META: Record<AuditAction, { label: string; color: string; icon: React.ReactNode }> = {
  user_created: {
    label: "User Created",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
    icon: <UserPlus className="h-3.5 w-3.5" />,
  },
  user_updated: {
    label: "User Updated",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20",
    icon: <RefreshCw className="h-3.5 w-3.5" />,
  },
  user_deleted: {
    label: "User Deleted",
    color: "bg-red-500/10 text-red-600 dark:text-red-300 border-red-500/20",
    icon: <UserMinus className="h-3.5 w-3.5" />,
  },
  iframe_changed: {
    label: "iFrame Changed",
    color: "bg-violet-500/10 text-violet-600 dark:text-violet-300 border-violet-500/20",
    icon: <Link2 className="h-3.5 w-3.5" />,
  },
  role_changed: {
    label: "Role Changed",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20",
    icon: <ShieldCheck className="h-3.5 w-3.5" />,
  },
  user_signed_in: {
    label: "Signed In",
    color: "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20",
    icon: <LogIn className="h-3.5 w-3.5" />,
  },
  google_sheet_changed: {
    label: "Google Sheet",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
    icon: <FileSpreadsheet className="h-3.5 w-3.5" />,
  },
};

function truncateUrl(url?: string, max = 40): string {
  if (!url) return "—";
  return url.length > max ? url.slice(0, max) + "..." : url;
}

function humaniseLog(log: AuditLogDoc): string {
  const t = log.targetEmail || log.targetUid || "unknown";
  switch (log.action) {
    case "user_created":
      return `Created user ${t} with role '${log.details.role ?? "user"}'.`;
    case "user_updated":
      return `Updated user ${t} — role: '${log.details.role ?? "—"}', iFrame: '${truncateUrl(log.details.iframeUrl)}'.`;
    case "user_deleted":
      return `Removed mapping for ${t}${log.details.wasPending === "true" ? " (pending)" : ""}.`;
    case "iframe_changed":
      return `Changed dashboard URL for ${t}.`;
    case "role_changed":
      return `Changed role of ${t} from '${log.details.oldRole}' to '${log.details.newRole}'.`;
    case "user_signed_in":
      return `Signed in as ${t}.`;
    case "google_sheet_changed":
      return `Changed Google Sheet settings for ${t} — Enabled: ${log.details.newEnabled}, URL: '${truncateUrl(log.details.newUrl)}'.`;
    default:
      return `Action on ${t}.`;
  }
}

function FontsAndMotion() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
      @keyframes sdl-fade-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes sdl-pulse-ring { 0% { transform: scale(0.9); opacity: 0.7; } 100% { transform: scale(2.2); opacity: 0; } }
      .sdl-row-in { animation: sdl-fade-up 0.35s ease both; }
    `}</style>
  );
}

export default function ManageUsers() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [usersList, setUsersList] = useState<UserDoc[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogDoc[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [updatingUid, setUpdatingUid] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [logFilter, setLogFilter] = useState<AuditAction | "all">("all");

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "users"),
      (snap) => {
        const uList: UserDoc[] = snap.docs.map((d) => {
          const v = d.data();
          return {
            id: d.id,
            email: v.email || "",
            role: (v.role as "user" | "admin" | "superadmin") || "user",
            createdAt: v.createdAt || null,
            updatedAt: v.updatedAt || null,
          };
        });
        uList.sort((a, b) => {
          const roleWeight = { superadmin: 3, admin: 2, user: 1 };
          const weightA = roleWeight[a.role] || 0;
          const weightB = roleWeight[b.role] || 0;
          if (weightB !== weightA) return weightB - weightA;
          return a.email.localeCompare(b.email);
        });
        setUsersList(uList);
        setLoadingUsers(false);
      },
      (err) => {
        console.error("Error listening to users collection:", err);
        toast("error", "Failed to fetch user registry. Verify permissions.");
        setLoadingUsers(false);
      }
    );
    return unsub;
  }, [toast]);

  useEffect(() => {
    const q = query(
      collection(db, "auditLogs"),
      orderBy("timestamp", "desc"),
      limit(100)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const logs: AuditLogDoc[] = snap.docs.map((d) => {
          const v = d.data();
          return {
            id: d.id,
            action: (v.action as AuditAction) || "user_updated",
            operatorUid: v.operatorUid || "",
            operatorEmail: v.operatorEmail || "",
            targetEmail: v.targetEmail || "",
            targetUid: v.targetUid || "",
            details: (v.details as Record<string, string>) || {},
            timestamp: v.timestamp || null,
          };
        });
        setAuditLogs(logs);
        setLoadingLogs(false);
      },
      (err) => {
        console.error("Error listening to auditLogs collection:", err);
        setLoadingLogs(false);
      }
    );
    return unsub;
  }, []);

  const handleRoleChange = async (
    targetUid: string,
    targetEmail: string,
    currentRole: string,
    newRole: "user" | "admin" | "superadmin"
  ) => {
    if (currentRole === newRole) return;
    if (user?.uid === targetUid) {
      toast("error", "Failsafe: You cannot modify your own role.");
      return;
    }
    if (!confirm(`Change role of ${targetEmail || targetUid} from '${currentRole}' to '${newRole}'?`)) return;

    setUpdatingUid(targetUid);
    try {
      await updateDoc(doc(db, "users", targetUid), {
        role: newRole,
        updatedAt: serverTimestamp(),
      });
      await writeAuditLog(
        "role_changed",
        { uid: user?.uid ?? "", email: user?.email ?? "" },
        { email: targetEmail, uid: targetUid },
        { oldRole: currentRole, newRole }
      );
      toast("success", `Role changed from '${currentRole}' to '${newRole}'.`);
    } catch (err: unknown) {
      console.error("Role update error:", err);
      toast("error", (err as { message?: string })?.message || "Failed to update role.");
    } finally {
      setUpdatingUid(null);
    }
  };

  const onSignOut = async () => {
    await signOut(auth);
    navigate("/", { replace: true });
  };

  const filteredUsers = usersList.filter(
    (u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLogs = logFilter === "all" ? auditLogs : auditLogs.filter((l) => l.action === logFilter);

  const allActions: (AuditAction | "all")[] = [
    "all", "user_created", "user_updated", "user_deleted",
    "iframe_changed", "role_changed", "user_signed_in",
  ];

  return (
    <div className="font-['Inter'] min-h-screen bg-[#F6F7FA] dark:bg-[#080B12] text-slate-900 dark:text-slate-100">
      <FontsAndMotion />

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-[#080B12]/70 border-b border-slate-200/70 dark:border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/admin")} className="p-2 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition" title="Back">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="h-9 w-9 rounded-lg border border-blue-400/30 bg-blue-400/10 flex items-center justify-center">
              <ShieldAlert className="h-4 w-4 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <div className="font-['Space_Grotesk'] font-semibold text-sm tracking-tight">User &amp; Access Controls</div>
              <div className="font-['JetBrains_Mono'] text-[10px] text-slate-400 dark:text-slate-500">{user?.email} ({role})</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={onSignOut} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-white/10 hover:border-red-400/40 hover:text-red-600 dark:hover:text-red-300 transition">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 grid gap-8 lg:grid-cols-[1fr,420px]">
        {/* Left: Users Registry */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <h2 className="font-['Space_Grotesk'] font-semibold text-lg">System Registry</h2>
              <span className="rounded-full bg-slate-100 dark:bg-white/10 px-2.5 py-0.5 font-['JetBrains_Mono'] text-xs text-slate-500 dark:text-slate-400">{filteredUsers.length}</span>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search email or UID..."
                className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 outline-none transition"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] backdrop-blur-xl overflow-hidden shadow-sm">
            {loadingUsers ? (
              <div className="p-16"><Spinner label="Loading registry entries..." /></div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{searchQuery ? "No matching users found." : "No registered users."}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="font-['JetBrains_Mono'] text-[10px] uppercase text-slate-500 dark:text-slate-400 tracking-wider bg-slate-50 dark:bg-white/[0.02]">
                    <tr>
                      <th className="text-left px-6 py-3.5 font-medium">User Email</th>
                      <th className="text-left px-6 py-3.5 font-medium">UID</th>
                      <th className="text-left px-6 py-3.5 font-medium">Role</th>
                      <th className="text-right px-6 py-3.5 font-medium">Change Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u, i) => (
                      <tr key={u.id} className={`sdl-row-in border-t border-slate-200/70 dark:border-white/5 ${i % 2 === 1 ? "bg-slate-50 dark:bg-white/[0.015]" : ""} hover:bg-blue-500/5 transition-colors`}>
                        <td className="px-6 py-4 font-medium flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${u.role === "superadmin" ? "bg-amber-400" : u.role === "admin" ? "bg-blue-400" : "bg-slate-400"}`} />
                          {u.email}
                        </td>
                        <td className="px-6 py-4 font-['JetBrains_Mono'] text-xs text-slate-500 dark:text-slate-400 max-w-[120px] truncate">{u.id}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${u.role === "superadmin" ? "bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20" : u.role === "admin" ? "bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20" : "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20"}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {updatingUid === u.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-blue-500 ml-auto" />
                          ) : (
                            <select
                              value={u.role}
                              disabled={user?.uid === u.id}
                              onChange={(e) => handleRoleChange(u.id, u.email, u.role, e.target.value as "user" | "admin" | "superadmin")}
                              className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 px-2 py-1 text-xs outline-none transition disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 dark:text-white"
                            >
                              <option value="user">user</option>
                              <option value="admin">admin</option>
                              <option value="superadmin">superadmin</option>
                            </select>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Right: Comprehensive Audit Ledger */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-blue-500" />
              <h2 className="font-['Space_Grotesk'] font-semibold text-lg">Audit Ledger</h2>
              <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300 flex items-center gap-1">
                <Clock className="h-3 w-3" /> Live
              </span>
            </div>
            <span className="rounded-full bg-slate-100 dark:bg-white/10 px-2.5 py-0.5 font-['JetBrains_Mono'] text-xs text-slate-500 dark:text-slate-400">
              {filteredLogs.length} entries
            </span>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-1.5">
            {allActions.map((a) => {
              const meta = a === "all" ? null : ACTION_META[a];
              const isActive = logFilter === a;
              return (
                <button
                  key={a}
                  onClick={() => setLogFilter(a)}
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider transition cursor-pointer ${
                    isActive
                      ? a === "all"
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent"
                        : `${meta?.color} border-current font-bold`
                      : "border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20"
                  }`}
                >
                  {meta?.icon}
                  {a === "all" ? "All" : meta?.label}
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] backdrop-blur-xl p-5 shadow-sm space-y-3 max-h-[68vh] overflow-y-auto">
            {loadingLogs ? (
              <Spinner label="Reading audit ledger..." />
            ) : filteredLogs.length === 0 ? (
              <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                {logFilter === "all" ? "No audit entries recorded yet." : `No '${ACTION_META[logFilter as AuditAction]?.label}' entries yet.`}
              </div>
            ) : (
              filteredLogs.map((log) => {
                const meta = ACTION_META[log.action] ?? ACTION_META["user_updated"];
                return (
                  <div key={log.id} className="sdl-row-in p-3.5 rounded-xl border border-slate-200/50 dark:border-white/[0.04] bg-slate-50/50 dark:bg-white/[0.02] hover:border-blue-500/20 transition-all text-xs">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-['JetBrains_Mono'] text-[9px] uppercase tracking-wider font-semibold shrink-0 ${meta.color}`}>
                        {meta.icon}
                        {meta.label}
                      </span>
                      <span className="font-['JetBrains_Mono'] text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
                        {log.timestamp?.seconds
                          ? new Date(log.timestamp.seconds * 1000).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                          : "now"}
                      </span>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-2">{humaniseLog(log)}</p>

                    <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                      <UserCheck className="h-3 w-3 shrink-0" />
                      <span className="font-['JetBrains_Mono'] text-[10px] truncate" title={log.operatorEmail}>
                        {log.operatorEmail || log.operatorUid}
                      </span>
                    </div>

                    {log.action === "iframe_changed" && (
                      <div className="mt-2 space-y-1">
                        <div className="rounded-md bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 px-2 py-1 font-['JetBrains_Mono'] text-[9px] text-red-600 dark:text-red-400 truncate">
                          - {truncateUrl(log.details.oldUrl, 55)}
                        </div>
                        <div className="rounded-md bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 px-2 py-1 font-['JetBrains_Mono'] text-[9px] text-emerald-600 dark:text-emerald-400 truncate">
                          + {truncateUrl(log.details.newUrl, 55)}
                        </div>
                      </div>
                    )}

                    {log.action === "role_changed" && (
                      <div className="mt-2 flex items-center gap-1.5 font-['JetBrains_Mono'] text-[10px]">
                        <span className="rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 px-2 py-0.5 text-slate-500 dark:text-slate-400">{log.details.oldRole}</span>
                        <span className="text-slate-400">to</span>
                        <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-blue-600 dark:text-blue-300 font-semibold">{log.details.newRole}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
