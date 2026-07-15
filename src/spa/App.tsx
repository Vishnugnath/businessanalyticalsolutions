import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "@/spa/AuthContext";
import { ToastProvider } from "@/spa/components/Toast";
import { ThemeProvider } from "@/spa/ThemeContext";
import { FullScreenLoader } from "@/spa/components/Spinner";
import Landing from "@/spa/pages/Landing";
import Login from "@/spa/pages/Login";
import ForgotPassword from "@/spa/pages/ForgotPassword";
import Admin from "@/spa/pages/Admin";
import Dashboard from "@/spa/pages/Dashboard";
import ManageUsers from "@/spa/pages/ManageUsers";
import type { ReactNode } from "react";

function AdminOnly({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <FullScreenLoader label="Verifying access..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function SuperAdminOnly({ children }: { children: ReactNode }) {
  const { user, loading, isSuperAdmin, role } = useAuth();
  if (loading) return <FullScreenLoader label="Verifying access..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (!isSuperAdmin) {
    if (role === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

function AuthedOnly({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <FullScreenLoader label="Verifying access..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (isAdmin) return <Navigate to="/admin" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/admin"
                element={
                  <AdminOnly>
                    <Admin />
                  </AdminOnly>
                }
              />
              <Route
                path="/manage-users"
                element={
                  <SuperAdminOnly>
                    <ManageUsers />
                  </SuperAdminOnly>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <AuthedOnly>
                    <Dashboard />
                  </AuthedOnly>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

