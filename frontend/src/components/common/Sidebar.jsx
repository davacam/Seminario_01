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
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={clsx(
          "fixed md:relative w-64 bg-gray-800 h-screen border-r border-gray-700 transform transition-transform duration-200 z-50 md:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-6 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-lg font-bold text-blue-500">Menu</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden hover:bg-gray-700 p-1 rounded"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.key}
                to={item.path}
                className={clsx(
                  "flex items-center gap-3 px-6 py-3 transition border-l-4",
                  isActive
                    ? "bg-gray-700 border-l-blue-500 text-blue-400"
                    : "border-l-transparent hover:bg-gray-700 text-gray-300"
                )}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={20} />
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
