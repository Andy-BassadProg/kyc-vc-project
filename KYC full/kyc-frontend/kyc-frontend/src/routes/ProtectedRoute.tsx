import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

// Garde de route basee sur la session wallet (equiv. ensure_login() avant toute commande)
export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}
