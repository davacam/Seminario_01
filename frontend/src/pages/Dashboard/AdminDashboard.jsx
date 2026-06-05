import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Users, CheckSquare, Building2, Clock } from "lucide-react";
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
      { label: "Usuarios", value: users.length, icon: Users, color: "bg-blue-500" },
      { label: "Tareas abiertas", value: openTasks, icon: CheckSquare, color: "bg-yellow-500" },
      { label: "Tecnicos activos", value: activeTechnicians, icon: Users, color: "bg-green-500" },
      { label: "Clientes", value: clients.length, icon: Building2, color: "bg-purple-500" },
    ];
  }, [clients.length, tasks, users]);

  const recentTasks = tasks.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Hola, {user?.fullName}</h1>
        <p className="text-gray-400 mt-2">Resumen operativo de tu equipo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className={`${stat.color} p-3 rounded-lg inline-flex mb-4`}>
                <Icon size={24} className="text-white" />
              </div>
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white">
                {isLoading ? "..." : stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Tareas recientes</h2>
          <div className="space-y-3">
            {recentTasks.length === 0 && (
              <p className="text-gray-400">No hay tareas registradas.</p>
            )}
            {recentTasks.map((task) => (
              <div key={task.id} className="flex justify-between items-center p-3 bg-gray-700 rounded">
                <span className="text-gray-200">{task.title}</span>
                <span className="px-3 py-1 bg-blue-500 text-white rounded text-sm font-semibold">
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Acciones rapidas</h2>
          <div className="space-y-3">
            <Link className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-center" to="/tasks">
              Nueva tarea
            </Link>
            <Link className="block w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-center" to="/users">
              Nuevo usuario
            </Link>
            <Link className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-center" to="/clients">
              Nuevo cliente
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
