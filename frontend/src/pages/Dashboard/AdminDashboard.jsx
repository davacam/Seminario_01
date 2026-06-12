import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, CheckSquare, Users } from "lucide-react";
import useAuthStore from "../../store/authStore";
import userService from "../../services/userService";
import taskService from "../../services/taskService";
import clientService from "../../services/clientService";

export default function AdminDashboard() {
  const user = useAuthStore((state) => state.user);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        const [usersResponse, tasksResponse, clientsResponse] = await Promise.all([
          userService.getAllUsers(),
          taskService.getAllTasks(),
          clientService.getAllClients(),
        ]);

        setUsers(usersResponse.data || []);
        setTasks(tasksResponse.data || []);
        setClients(clientsResponse.data || []);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = useMemo(() => {
    const openTasks = tasks.filter((task) => task.status !== "COMPLETED").length;
    const activeTechnicians = users.filter(
      (item) => item.role === "TECHNICIAN" && item.status === "ACTIVE"
    ).length;

    return [
      { label: "Usuarios", value: users.length, icon: Users, color: "bg-sky-400", hint: "Equipo completo" },
      { label: "Tareas abiertas", value: openTasks, icon: CheckSquare, color: "bg-amber-300", hint: "Pendientes y activas" },
      { label: "Tecnicos activos", value: activeTechnicians, icon: Users, color: "bg-emerald-400", hint: "Disponibles" },
      { label: "Clientes", value: clients.length, icon: Building2, color: "bg-fuchsia-400", hint: "Cuentas activas" },
    ];
  }, [clients.length, tasks, users]);

  const recentTasks = tasks.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="panel relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-300" />
        <h1 className="text-3xl font-bold text-white">Hola, {user?.fullName}</h1>
        <p className="text-gray-400 mt-2">Resumen operativo de tu equipo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="panel interactive-lift">
              <div className={`${stat.color} p-3 rounded-lg inline-flex mb-4`}>
                <Icon size={24} className="text-slate-950" />
              </div>
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white">
                {isLoading ? "..." : stat.value}
              </p>
              <p className="mt-2 text-xs text-slate-500">{stat.hint}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="panel">
          <h2 className="text-xl font-bold text-white mb-4">Tareas recientes</h2>
          <div className="space-y-3">
            {recentTasks.length === 0 && (
              <p className="text-gray-400">No hay tareas registradas.</p>
            )}
            {recentTasks.map((task) => (
              <div key={task.id} className="flex justify-between items-center rounded-lg border border-white/10 bg-white/[0.04] p-3">
                <span className="text-gray-200">{task.title}</span>
                <span className="badge border-sky-400/20 bg-sky-400/10 text-sky-200">
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <h2 className="text-xl font-bold text-white mb-4">Acciones rapidas</h2>
          <div className="space-y-3">
            <Link className="btn-primary flex w-full items-center justify-center gap-2" to="/tasks">
              Nueva tarea <ArrowRight size={16} />
            </Link>
            <Link className="btn-secondary flex w-full items-center justify-center gap-2" to="/users">
              Nuevo usuario <ArrowRight size={16} />
            </Link>
            <Link className="btn-secondary flex w-full items-center justify-center gap-2" to="/clients">
              Nuevo cliente <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
