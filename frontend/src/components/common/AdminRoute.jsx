import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import LoadingSpinner from "./LoadingSpinner";

export default function AdminRoute({ children }) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  if (!hasHydrated) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center text-slate-100">
        <div className="max-w-md rounded-lg border border-red-500/20 bg-red-500/10 p-8">
          <h1 className="text-2xl font-semibold text-white">Acceso Denegado</h1>
          <p className="mt-3 text-sm text-slate-300">
            No tienes permisos para acceder a esta sección.
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-red-300">
            Error 403
          </p>
        </div>
      </div>
    );
  }

  return children;
}
