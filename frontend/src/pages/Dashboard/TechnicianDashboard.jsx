import { CheckSquare, Clock, FileText } from "lucide-react";
import useAuthStore from "../../store/authStore";

export default function TechnicianDashboard() {
  const user = useAuthStore((state) => state.user);

  const stats = [
    { label: "My Open Tasks", value: "5", icon: CheckSquare, color: "bg-yellow-500" },
    { label: "In Progress", value: "2", icon: Clock, color: "bg-blue-500" },
    { label: "Reports Filed", value: "23", icon: FileText, color: "bg-green-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Welcome, {user?.fullName}! 👨‍🔧</h1>
        <p className="text-gray-400 mt-2">Your tasks and daily operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition">
              <div className="flex justify-between items-start mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">My Tasks Today</h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-700 rounded border-l-4 border-l-yellow-500">
              <p className="text-gray-200 font-semibold">Router Installation - ABC Corp</p>
              <p className="text-gray-400 text-sm">Due: Today at 5:00 PM</p>
            </div>
            <div className="p-3 bg-gray-700 rounded border-l-4 border-l-blue-500">
              <p className="text-gray-200 font-semibold">Network Configuration - XYZ Ltd</p>
              <p className="text-gray-400 text-sm">Due: Tomorrow at 10:00 AM</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Quick Start</h2>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition mb-2">
            Start New Task
          </button>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition">
            File a Report
          </button>
        </div>
      </div>
    </div>
  );
}
