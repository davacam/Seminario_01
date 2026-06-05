import { LogOut, Moon, Sun, Menu } from "lucide-react";
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
    <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="hover:bg-gray-700 p-2 rounded">
          <Menu size={20} />
        </button>
        <h1 className="text-xl font-bold text-blue-500">TechDesk</h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-gray-700 rounded transition"
          title="Toggle theme"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="text-right">
          <p className="text-sm font-medium">{user?.fullName}</p>
          <p className="text-xs text-gray-400">{user?.role}</p>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 hover:bg-red-900 rounded transition text-red-500"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
}
