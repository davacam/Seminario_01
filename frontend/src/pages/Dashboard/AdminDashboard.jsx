import { Users, CheckSquare, FileText, BarChart3 } from "lucide-react";
import useAuthStore from "../../store/authStore";

export default function AdminDashboard() {
  const user = useAuthStore((state) => state.user);

  const stats = [
    { label: "Total Users", value: "24", icon: Users, color: "bg-blue-500" },
    { label: "Open Tasks", value: "12", icon: CheckSquare, color: "bg-yellow-500" },
    { label: "Active Technicians", value: "8", icon: Users, color: "bg-green-500" },
    { label: "Reports Generated", value: "156", icon: FileText, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Welcome back, {user?.fullName}! 👋</h1>
        <p className="text-gray-400 mt-2">Here's your operational overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <h2 className="text-xl font-bold text-white mb-4">Recent Tasks</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
              <span className="text-gray-200">Router Installation - John Tech</span>
              <span className="px-3 py-1 bg-yellow-500 text-gray-900 rounded text-sm font-semibold">In Progress</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
              <span className="text-gray-200">Network Configuration - Jane Tech</span>
              <span className="px-3 py-1 bg-green-500 text-gray-900 rounded text-sm font-semibold">Completed</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-700 rounded">
              <span className="text-gray-200">System Upgrade - Bob Support</span>
              <span className="px-3 py-1 bg-blue-500 text-white rounded text-sm font-semibold">Open</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">
              + New Task
            </button>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition">
              + New User
            </button>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
