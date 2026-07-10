import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home, CheckSquare, Users, Building2, X } from "lucide-react";
import useAuthStore from "../../store/authStore";
import clsx from "clsx";

const menuItems = {
  ADMIN: [
    { icon: Home, label: "Dashboard", path: "/dashboard", key: "dashboard" },
    { icon: Users, label: "Usuarios", path: "/users", key: "users" },
    { icon: Building2, label: "Clientes", path: "/clients", key: "clients" },
    { icon: CheckSquare, label: "Tareas", path: "/tasks", key: "tasks" },
  ],
  TECHNICIAN: [
    { icon: Home, label: "Dashboard", path: "/dashboard", key: "dashboard" },
    { icon: CheckSquare, label: "Mis Tareas", path: "/tasks", key: "tasks" },
  ],
  CLIENT: [
    { icon: Home, label: "Dashboard", path: "/dashboard", key: "dashboard" },
    { icon: CheckSquare, label: "Mis Solicitudes", path: "/tasks", key: "tasks" },
  ],
};

export default function Sidebar({ isOpen, setIsOpen }) {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const items = menuItems[user?.role] || menuItems.TECHNICIAN;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={clsx(
          "fixed md:relative w-64 h-screen border-r border-white/10 bg-slate-950/85 backdrop-blur transform transition-transform duration-300 z-50 md:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-6 flex justify-between items-center border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-sky-300">TechDesk</h2>
            <p className="text-xs text-slate-500">Operations console</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden hover:bg-white/10 p-1 rounded"
            aria-label="Cerrar navegación"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 space-y-1 px-3">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.key}
                to={item.path}
                className={clsx(
                  "group flex items-center gap-3 rounded-lg px-3 py-3 transition border border-transparent",
                  isActive
                    ? "bg-sky-400/10 border-sky-400/20 text-sky-200 shadow-lg shadow-sky-950/20"
                    : "hover:bg-white/5 text-slate-300"
                )}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={20} className="transition group-hover:scale-110" />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
