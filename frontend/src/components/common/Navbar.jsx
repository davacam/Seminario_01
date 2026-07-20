import { Activity, LogOut, Moon, Sun, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import useThemeStore from "../../store/themeStore";
import authService from "../../services/authService";

export default function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isDark = useThemeStore((state) => state.isDark);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Error closing session:", error);
    } finally {
      logout();
      navigate("/login", { replace: true });
    }
  };

  return (
    <nav className="border-b border-white/10 bg-slate-950/70 px-4 py-3 backdrop-blur md:px-6">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 transition hover:bg-white/10 md:hidden"
          aria-label="Abrir navegación"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="truncate text-xl font-bold text-sky-300">TechDesk</h1>
          <div className="hidden items-center gap-2 text-xs text-emerald-300 md:flex">
            <Activity size={12} />
            Demo operativo
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <button
          onClick={toggleTheme}
          className="rounded-lg border border-white/10 p-2 transition hover:bg-white/10"
          title="Cambiar tema"
          aria-label="Cambiar tema"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="hidden rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-right sm:block">
          <p className="text-sm font-medium">{user?.fullName}</p>
          <p className="text-xs text-slate-400">{user?.role}</p>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-lg p-2 text-red-300 transition hover:bg-red-500/10"
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
        >
          <LogOut size={20} />
        </button>
      </div>
      </div>
    </nav>
  );
}
