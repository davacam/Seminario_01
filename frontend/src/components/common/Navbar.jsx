import { Activity, LogOut, Moon, Sun, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import useThemeStore from "../../store/themeStore";

export default function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isDark = useThemeStore((state) => state.isDark);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="border-b border-white/10 bg-slate-950/70 px-4 py-3 backdrop-blur md:px-6">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="rounded-lg p-2 transition hover:bg-white/10">
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-sky-300">TechDesk</h1>
          <div className="hidden items-center gap-2 text-xs text-emerald-300 md:flex">
            <Activity size={12} />
            Demo operativo
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="rounded-lg border border-white/10 p-2 transition hover:bg-white/10"
          title="Toggle theme"
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
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
}
