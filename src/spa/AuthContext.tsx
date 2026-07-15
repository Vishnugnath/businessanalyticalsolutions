import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { doc, onSnapshot, setDoc, getDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  role: "user" | "admin" | "superadmin";
  iframeUrl: string;
  googleSheetEnabled: boolean;
  googleSheetUrl: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  authError: Error | null;
}

const Ctx = createContext<AuthCtx>({
  user: null,
  loading: true,
  role: "user",
  iframeUrl: "",
  googleSheetEnabled: false,
  googleSheetUrl: "",
  isAdmin: false,
  isSuperAdmin: false,
  authError: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"user" | "admin" | "superadmin">("user");
  const [iframeUrl, setIframeUrl] = useState<string>("");
  const [googleSheetEnabled, setGoogleSheetEnabled] = useState<boolean>(false);
  const [googleSheetUrl, setGoogleSheetUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<Error | null>(null);

  useEffect(() => {
    let unsubUserDoc: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      if (unsubUserDoc) {
        unsubUserDoc();
        unsubUserDoc = null;
      }

      if (u) {
        setLoading(true);
        setUser(u);
        const userDocRef = doc(db, "users", u.uid);

        unsubUserDoc = onSnapshot(
          userDocRef,
          async (snap) => {
            if (snap.exists()) {
              // UID-keyed doc found — normal case
              const data = snap.data();
              setRole((data.role as "user" | "admin" | "superadmin") || "user");
              setIframeUrl(data.iframeUrl || "");
              setGoogleSheetEnabled(!!data.googleSheetEnabled);
              setGoogleSheetUrl(data.googleSheetUrl || "");
              setAuthError(null);
              setLoading(false);
            } else {
              // UID-keyed doc not found — check for email-keyed placeholder or create default.
              try {
                const emailLower = (u.email || "").toLowerCase();
                if (emailLower) {
                  const placeholderRef = doc(db, "users", emailLower);
                  const placeholderSnap = await getDoc(placeholderRef);

                  if (placeholderSnap.exists()) {
                    const pd = placeholderSnap.data();
                    // Migrate placeholder → UID-keyed document
                    await setDoc(userDocRef, {
                      email: u.email || "",
                      role: pd.role || "user",
                      iframeUrl: pd.iframeUrl || "",
                      googleSheetEnabled: pd.googleSheetEnabled || false,
                      googleSheetUrl: pd.googleSheetUrl || "",
                      pendingSignup: false,
                      createdAt: pd.createdAt || serverTimestamp(),
                      updatedAt: serverTimestamp(),
                    });
                    // Clean up placeholder (ignore errors — may already be cleaned)
                    await deleteDoc(placeholderRef).catch(() => {});
                    // onSnapshot fires again with the newly-written UID doc → sets state
                    return;
                  } else {
                    // No placeholder exists. Create default UID-keyed document.
                    await setDoc(userDocRef, {
                      email: u.email || "",
                      role: "user",
                      iframeUrl: "",
                      googleSheetEnabled: false,
                      googleSheetUrl: "",
                      pendingSignup: false,
                      createdAt: serverTimestamp(),
                      updatedAt: serverTimestamp(),
                    });
                    // onSnapshot fires again with the newly-written UID doc → sets state
                    return;
                  }
                } else {
                  // Fallback: Create default UID-keyed document with blank email if user has no email
                  await setDoc(userDocRef, {
                    email: "",
                    role: "user",
                    iframeUrl: "",
                    googleSheetEnabled: false,
                    googleSheetUrl: "",
                    pendingSignup: false,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                  });
                  return;
                }
              } catch (migrationErr) {
                console.warn("Client-side user document initialization failed, using defaults:", migrationErr);
                setRole("user");
                setIframeUrl("");
                setGoogleSheetEnabled(false);
                setGoogleSheetUrl("");
                setAuthError(migrationErr as Error);
                setLoading(false);
              }
            }
          },
          (err) => {
            console.error("Error listening to user document:", err);
            setRole("user");
            setIframeUrl("");
            setGoogleSheetEnabled(false);
            setGoogleSheetUrl("");
            setAuthError(err);
            setLoading(false);
          }
        );
      } else {
        setUser(null);
        setRole("user");
        setIframeUrl("");
        setGoogleSheetEnabled(false);
        setGoogleSheetUrl("");
        setAuthError(null);
        setLoading(false);
      }
    });

    return () => {
      unsubAuth();
      if (unsubUserDoc) unsubUserDoc();
    };
  }, []);

  const isAdmin = role === "admin" || role === "superadmin";
  const isSuperAdmin = role === "superadmin";

  return (
    <Ctx.Provider value={{ user, loading, role, iframeUrl, googleSheetEnabled, googleSheetUrl, isAdmin, isSuperAdmin, authError }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
