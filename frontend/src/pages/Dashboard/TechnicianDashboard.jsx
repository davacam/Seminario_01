import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CheckSquare, Clock, ClipboardCheck } from "lucide-react";
import useAuthStore from "../../store/authStore";
import taskService from "../../services/taskService";

export default function TechnicianDashboard() {
  const user = useAuthStore((state) => state.user);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const response = await taskService.getAllTasks();
        setTasks(response.data || []);
      } catch (error) {
        console.error("Error loading technician dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  const stats = useMemo(
    () => [
      {
        label: "Mis tareas abiertas",
        value: tasks.filter((task) => task.status === "OPEN").length,
        icon: CheckSquare,
        color: "bg-yellow-500",
      },
      {
        label: "En progreso",
        value: tasks.filter((task) => task.status === "IN_PROGRESS").length,
        icon: Clock,
        color: "bg-blue-500",
      },
      {
        label: "Completadas",
        value: tasks.filter((task) => task.status === "COMPLETED").length,
        icon: ClipboardCheck,
        color: "bg-green-500",
      },
    ],
    [tasks]
  );

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Hola, {user?.fullName}</h1>
        <p className="text-gray-400 mt-2">Tus tareas y operaciones del dia</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Tareas recientes</h2>
        <div className="space-y-3">
          {tasks.slice(0, 4).map((task) => (
            <div key={task.id} className="p-3 bg-gray-700 rounded border-l-4 border-l-blue-500">
              <p className="text-gray-200 font-semibold">{task.title}</p>
              <p className="text-gray-400 text-sm">{task.status}</p>
            </div>
          ))}
          {!isLoading && tasks.length === 0 && (
            <p className="text-gray-400">No tienes tareas asignadas.</p>
          )}
        </div>
        <Link className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg" to="/tasks">
          Ver tareas
        </Link>
      </div>
    </div>
  );
}
