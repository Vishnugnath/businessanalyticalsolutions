import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { useAuth } from "@/spa/AuthContext";
import { useToast } from "@/spa/components/Toast";
import { Spinner } from "@/spa/components/Spinner";
import { writeAuditLog } from "@/lib/auditLog";
import {
  BarChart3,
  LogOut,
  Pencil,
  Trash2,
  Save,
  Loader2,
  UserPlus,
  Database,
  Radio,
  ShieldCheck,
  Users,
  FileSpreadsheet,
} from "lucide-react";
import { ThemeToggle } from "@/spa/ThemeContext";

interface Row {
  id: string;
  email: string;
  role: "user" | "admin";
  iframeUrl: string;
  updatedAt?: { seconds: number } | null;
  pendingSignup?: boolean;
  googleSheetEnabled?: boolean;
  googleSheetUrl?: string;
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

export default function Admin() {
  const { user, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [iframeUrl, setIframeUrl] = useState("");
  const [googleSheetEnabled, setGoogleSheetEnabled] = useState(false);
  const [googleSheetUrl, setGoogleSheetUrl] = useState("");
  const [formRole, setFormRole] = useState<"user" | "admin">("user");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Fetch users: superadmin gets user + admin, standard admin gets user only
    const q = isSuperAdmin
      ? query(collection(db, "users"), where("role", "in", ["user", "admin"]))
      : query(collection(db, "users"), where("role", "==", "user"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data: Row[] = snap.docs.map((d) => {
          const v = d.data() as {
            email?: string;
            role?: string;
            iframeUrl?: string;
            updatedAt?: { seconds: number };
            pendingSignup?: boolean;
            googleSheetEnabled?: boolean;
            googleSheetUrl?: string;
          };
          return {
            id: d.id,
            email: v.email || d.id,
            role: (v.role as "user" | "admin") || "user",
            iframeUrl: v.iframeUrl || "",
            updatedAt: v.updatedAt || null,
            pendingSignup: v.pendingSignup || false,
            googleSheetEnabled: v.googleSheetEnabled || false,
            googleSheetUrl: v.googleSheetUrl || "",
          };
        });
        data.sort((a, b) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0));
        setRows(data);
        setLoading(false);
      },
      (err) => {
        console.error("Error loading users registry:", err);
        setLoading(false);
      }
    );
    return unsub;
  }, [isSuperAdmin]);

  const resetForm = () => {
    setEmail("");
    setIframeUrl("");
    setGoogleSheetEnabled(false);
    setGoogleSheetUrl("");
    setFormRole("user");
    setEditingId(null);
  };

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      toast("error", "Enter a valid email address.");
      return;
    }
    if (formRole === "user" && !iframeUrl.trim()) {
      toast("error", "Provide a dashboard iframe URL.");
      return;
    }
    if (formRole === "user" && googleSheetEnabled && !googleSheetUrl.trim()) {
      toast("error", "Provide a Google Sheet URL.");
      return;
    }
    setSaving(true);
    const operator = { uid: user?.uid ?? "", email: user?.email ?? "" };
    try {
      const dbIframeUrl = formRole === "user" ? iframeUrl.trim() : "";
      const dbGoogleSheetEnabled = formRole === "user" ? googleSheetEnabled : false;
      const dbGoogleSheetUrl = (formRole === "user" && googleSheetEnabled) ? googleSheetUrl.trim() : "";

      if (editingId) {
        // Fetch existing row to detect iframe URL change
        const existingRow = rows.find((r) => r.id === editingId);
        const oldIframeUrl = existingRow?.iframeUrl ?? "";
        const oldGoogleSheetEnabled = existingRow?.googleSheetEnabled ?? false;
        const oldGoogleSheetUrl = existingRow?.googleSheetUrl ?? "";

        // Direct update if we are editing an existing registry row
        await setDoc(
          doc(db, "users", editingId),
          {
            role: formRole,
            iframeUrl: dbIframeUrl,
            googleSheetEnabled: dbGoogleSheetEnabled,
            googleSheetUrl: dbGoogleSheetUrl,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );

        // Audit: iframe_changed (only when URL actually changed)
        if (oldIframeUrl !== dbIframeUrl) {
          await writeAuditLog(
            "iframe_changed",
            operator,
            { email: existingRow?.email ?? cleanEmail, uid: editingId },
            { oldUrl: oldIframeUrl, newUrl: dbIframeUrl }
          );
        }

        // Audit: google_sheet_changed (only when settings changed)
        if (oldGoogleSheetEnabled !== dbGoogleSheetEnabled || oldGoogleSheetUrl !== dbGoogleSheetUrl) {
          await writeAuditLog(
            "google_sheet_changed",
            operator,
            { email: existingRow?.email ?? cleanEmail, uid: editingId },
            {
              oldEnabled: String(oldGoogleSheetEnabled),
              newEnabled: String(dbGoogleSheetEnabled),
              oldUrl: oldGoogleSheetUrl,
              newUrl: dbGoogleSheetUrl
            }
          );
        }

        // Audit: user_updated (general save)
        await writeAuditLog(
          "user_updated",
          operator,
          { email: existingRow?.email ?? cleanEmail, uid: editingId },
          { 
            role: formRole, 
            iframeUrl: dbIframeUrl, 
            googleSheetEnabled: String(dbGoogleSheetEnabled), 
            googleSheetUrl: dbGoogleSheetUrl 
          }
        );
      } else {
        // Query to see if a user document with that email already exists
        const q = query(collection(db, "users"), where("email", "==", cleanEmail));
        const snap = await getDocs(q);

        if (!snap.empty) {
          // Document exists, update iframeUrl and role in-place
          const userDoc = snap.docs[0];
          const oldIframeUrl = (userDoc.data().iframeUrl as string) ?? "";
          const oldGoogleSheetEnabled = !!userDoc.data().googleSheetEnabled;
          const oldGoogleSheetUrl = (userDoc.data().googleSheetUrl as string) ?? "";

          await setDoc(
            doc(db, "users", userDoc.id),
            {
              role: formRole,
              iframeUrl: dbIframeUrl,
              googleSheetEnabled: dbGoogleSheetEnabled,
              googleSheetUrl: dbGoogleSheetUrl,
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );

          // Audit: iframe_changed
          if (oldIframeUrl !== dbIframeUrl) {
            await writeAuditLog(
              "iframe_changed",
              operator,
              { email: cleanEmail, uid: userDoc.id },
              { oldUrl: oldIframeUrl, newUrl: dbIframeUrl }
            );
          }

          // Audit: google_sheet_changed
          if (oldGoogleSheetEnabled !== dbGoogleSheetEnabled || oldGoogleSheetUrl !== dbGoogleSheetUrl) {
            await writeAuditLog(
              "google_sheet_changed",
              operator,
              { email: cleanEmail, uid: userDoc.id },
              {
                oldEnabled: String(oldGoogleSheetEnabled),
                newEnabled: String(dbGoogleSheetEnabled),
                oldUrl: oldGoogleSheetUrl,
                newUrl: dbGoogleSheetUrl
              }
            );
          }

          // Audit: user_updated
          await writeAuditLog(
            "user_updated",
            operator,
            { email: cleanEmail, uid: userDoc.id },
            { 
              role: formRole, 
              iframeUrl: dbIframeUrl, 
              googleSheetEnabled: String(dbGoogleSheetEnabled), 
              googleSheetUrl: dbGoogleSheetUrl 
            }
          );
        } else {
          // Create pending users doc keyed by lowercased email
          await setDoc(
            doc(db, "users", cleanEmail),
            {
              email: cleanEmail,
              role: formRole,
              iframeUrl: dbIframeUrl,
              googleSheetEnabled: dbGoogleSheetEnabled,
              googleSheetUrl: dbGoogleSheetUrl,
              pendingSignup: true,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            }
          );

          // Audit: user_created
          await writeAuditLog(
            "user_created",
            operator,
            { email: cleanEmail },
            { 
              role: formRole, 
              iframeUrl: dbIframeUrl, 
              googleSheetEnabled: String(dbGoogleSheetEnabled), 
              googleSheetUrl: dbGoogleSheetUrl 
            }
          );
        }
      }
      toast("success", editingId ? "Assignment updated" : "User registry updated");
      resetForm();
    } catch (e: unknown) {
      toast("error", (e as { message?: string })?.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (row: Row) => {
    setEditingId(row.id);
    setEmail(row.email);
    setIframeUrl(row.iframeUrl);
    setGoogleSheetEnabled(row.googleSheetEnabled ?? false);
    setGoogleSheetUrl(row.googleSheetUrl ?? "");
    setFormRole(row.role);
  };

  const onDelete = async (row: Row) => {
    if (!confirm(`Remove dashboard mapping for ${row.email}?`)) return;
    const operator = { uid: user?.uid ?? "", email: user?.email ?? "" };
    try {
      const docRef = doc(db, "users", row.id);
      if (row.pendingSignup) {
        // Delete placeholder doc completely
        await deleteDoc(docRef);
      } else {
        // Registered user: clear iframeUrl and google sheet to preserve role and document
        await setDoc(
          docRef,
          {
            iframeUrl: "",
            googleSheetEnabled: false,
            googleSheetUrl: "",
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
      // Audit: user_deleted
      await writeAuditLog(
        "user_deleted",
        operator,
        { email: row.email, uid: row.id },
        { wasPending: String(row.pendingSignup ?? false) }
      );
      toast("success", "Mapping removed");
    } catch (e: unknown) {
      toast("error", (e as { message?: string })?.message || "Failed to delete.");
    }
  };

  const onSignOut = async () => {
    await signOut(auth);
    navigate("/", { replace: true });
  };

  return (
    <div className="font-['Inter'] min-h-screen bg-[#F6F7FA] dark:bg-[#080B12] text-slate-900 dark:text-slate-100">
      <FontsAndMotion />

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-[#080B12]/70 border-b border-slate-200/70 dark:border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg border border-amber-400/30 bg-amber-400/10 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-amber-600 dark:text-amber-300" />
            </div>
            <div>
              <div className="font-['Space_Grotesk'] font-semibold text-sm tracking-tight">
                Admin Control Panel
              </div>
              <div className="font-['JetBrains_Mono'] text-[10px] text-slate-400 dark:text-slate-500">
                {user?.email}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">
              <span className="relative flex h-1.5 w-1.5">
                <span
                  className="absolute inline-flex h-full w-full rounded-full bg-current"
                  style={{ animation: "sdl-pulse-ring 1.8s cubic-bezier(0,0,0.2,1) infinite" }}
                />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
              </span>
              Live Registry
            </span>
            {isSuperAdmin && (
              <button
                onClick={() => navigate("/manage-users")}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium border border-blue-500/20 dark:border-blue-500/10 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-400/40 text-blue-600 dark:text-blue-300 transition cursor-pointer"
              >
                <Users className="h-3.5 w-3.5" /> Manage Users
              </button>
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

      <main className="mx-auto max-w-7xl px-6 py-8 grid gap-6 lg:grid-cols-[420px,1fr]">
        {/* Form */}
        <section className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] backdrop-blur-xl p-6 h-fit lg:sticky lg:top-24 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-blue-500/15 border border-blue-400/30 flex items-center justify-center">
              <UserPlus className="h-4 w-4 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <h2 className="font-['Space_Grotesk'] font-semibold">
                {editingId ? "Edit User Registry" : "Register User / Admin"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Add or edit system roles & client maps.</p>
            </div>
          </div>

          <form onSubmit={onSave} className="mt-6 space-y-4">
            <div>
              <label className="font-['JetBrains_Mono'] text-[11px] font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                User Email ID
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!!editingId}
                className="mt-1.5 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 outline-none transition disabled:opacity-60"
                placeholder="client@company.com"
              />
            </div>

            {isSuperAdmin && (
              <div>
                <label className="font-['JetBrains_Mono'] text-[11px] font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  System Role
                </label>
                <div className="mt-1.5 flex gap-4">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="radio"
                      name="formRole"
                      value="user"
                      checked={formRole === "user"}
                      onChange={() => setFormRole("user")}
                      className="accent-blue-600 h-4 w-4"
                    />
                    User (with Dashboard)
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="radio"
                      name="formRole"
                      value="admin"
                      checked={formRole === "admin"}
                      onChange={() => setFormRole("admin")}
                      className="accent-blue-600 h-4 w-4"
                    />
                    Admin
                  </label>
                </div>
              </div>
            )}

            {formRole === "user" && (
              <div className="space-y-4">
                <div>
                  <label className="font-['JetBrains_Mono'] text-[11px] font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Custom Dashboard iFrame Link
                  </label>
                  <textarea
                    value={iframeUrl}
                    onChange={(e) => setIframeUrl(e.target.value)}
                    rows={4}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 outline-none transition font-['JetBrains_Mono'] text-sm"
                    placeholder="https://app.powerbi.com/view?r=..."
                  />
                </div>

                {/* Enable Google Sheet Link Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Enable Google Sheet Link
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Show spreadsheet link above dashboard
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={googleSheetEnabled}
                      onChange={(e) => setGoogleSheetEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 dark:bg-white/10 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-400/30 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white dark:after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600 dark:peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                {/* Conditional Google Sheet URL Input */}
                {googleSheetEnabled && (
                  <div className="sdl-fade-up">
                    <label className="font-['JetBrains_Mono'] text-[11px] font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                      Google Sheet URL
                    </label>
                    <input
                      type="url"
                      value={googleSheetUrl}
                      onChange={(e) => setGoogleSheetUrl(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 outline-none transition font-['JetBrains_Mono'] text-sm"
                      placeholder="https://docs.google.com/spreadsheets/d/..."
                    />
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold bg-slate-900 dark:bg-blue-500 text-white dark:text-slate-950 shadow-lg shadow-slate-900/10 dark:shadow-blue-500/30 hover:-translate-y-0.5 disabled:opacity-60 transition-all"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {editingId ? "Update" : "Save Registry"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg px-3 py-2.5 text-sm border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Table */}
        <section className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] backdrop-blur-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200/70 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-500" />
              <h2 className="font-['Space_Grotesk'] font-semibold">User & Client Registry</h2>
              <span className="rounded-full bg-slate-100 dark:bg-white/10 px-2 py-0.5 font-['JetBrains_Mono'] text-[10px] text-slate-500 dark:text-slate-400">
                {rows.length}
              </span>
            </div>
            <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300 flex items-center gap-1.5">
              <Radio className="h-3 w-3" /> Live
            </span>
          </div>

          {loading ? (
            <Spinner label="Loading registry..." />
          ) : rows.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto h-12 w-12 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center">
                <Database className="h-5 w-5 text-slate-400" />
              </div>
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                No users assigned yet. Use the form to register your first one.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="font-['JetBrains_Mono'] text-[10px] uppercase text-slate-500 dark:text-slate-400 tracking-wider bg-slate-50 dark:bg-white/[0.02]">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium">User Email</th>
                    <th className="text-left px-6 py-3 font-medium">Assigned iFrame URL</th>
                    <th className="text-left px-6 py-3 font-medium">Last Updated</th>
                    <th className="text-right px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr
                      key={r.id}
                      className={`sdl-row-in border-t border-slate-200/70 dark:border-white/5 ${i % 2 === 1 ? "bg-slate-50 dark:bg-white/[0.015]" : ""
                        } hover:bg-blue-500/5 transition-colors`}
                    >
                      <td className="px-6 py-3 font-medium">
                        <div className="flex items-center gap-2">
                          <span>{r.email}</span>
                          <span className={`rounded-full px-2 py-0.5 font-['JetBrains_Mono'] text-[9px] uppercase tracking-wider border ${
                            r.role === "admin"
                              ? "bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/20"
                              : r.pendingSignup
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20"
                              : "bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20"
                          }`}>
                            {r.role === "admin" ? "Admin" : r.pendingSignup ? "Pending" : "Active Client"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-slate-500 dark:text-slate-400 max-w-xs truncate font-['JetBrains_Mono'] text-xs">
                        {r.role === "admin" ? (
                          <span className="italic text-purple-500">System Administrator</span>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <span className="truncate block" title={r.iframeUrl}>
                              {r.iframeUrl || <span className="italic text-slate-400">No dashboard assigned</span>}
                            </span>
                            {r.googleSheetEnabled && r.googleSheetUrl && (
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 truncate" title={r.googleSheetUrl}>
                                <FileSpreadsheet className="h-3 w-3 shrink-0" />
                                {r.googleSheetUrl}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-3 text-slate-500 dark:text-slate-400 font-['JetBrains_Mono'] text-xs">
                        {r.updatedAt?.seconds
                          ? new Date(r.updatedAt.seconds * 1000).toLocaleString()
                          : "—"}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => onEdit(r)}
                            className="p-1.5 rounded-md border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-blue-500/15 hover:border-blue-400/40 hover:text-blue-600 dark:hover:text-blue-300 transition"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onDelete(r)}
                            className="p-1.5 rounded-md border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-red-500/15 hover:border-red-400/40 hover:text-red-600 dark:hover:text-red-300 transition"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
