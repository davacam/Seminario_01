import { Link } from "react-router-dom";
import { CheckSquare } from "lucide-react";
import useAuthStore from "../../store/authStore";

export default function ClientDashboard() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      <div className="panel relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-300" />
        <h1 className="text-3xl font-bold text-white">Hola, {user?.fullName}</h1>
        <p className="text-gray-400 mt-2">Consulta el estado de tus solicitudes.</p>
      </div>

      <div className="panel interactive-lift max-w-xl">
        <div className="bg-blue-500 p-3 rounded-lg inline-flex mb-4">
          <CheckSquare size={24} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Solicitudes</h2>
        <p className="text-gray-400 mb-4">
          Revisa las tareas asociadas a tu cuenta y su estado actual.
        </p>
        <Link className="btn-primary inline-block" to="/tasks">
          Ver solicitudes
        </Link>
      </div>
    </div>
  );
}
