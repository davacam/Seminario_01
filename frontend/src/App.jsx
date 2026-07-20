import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/authStore";
import useThemeStore from "./store/themeStore";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRoute from "./components/common/AdminRoute";
import Layout from "./components/common/Layout";
import LoadingSpinner from "./components/common/LoadingSpinner";
import Login from "./pages/Auth/Login";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import TechnicianDashboard from "./pages/Dashboard/TechnicianDashboard";
import ClientDashboard from "./pages/Dashboard/ClientDashboard";
import UsersList from "./pages/Users/UsersList";
import TasksList from "./pages/Tasks/TasksList";
import ClientsList from "./pages/Clients/ClientsList";

function App() {
  const isDark = useThemeStore((state) => state.isDark);

  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <LayoutPage />
            </AdminRoute>
          }
        />

        <Route path="/admin" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <LayoutPage page="users" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <LayoutPage page="tasks" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clients"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <LayoutPage page="clients" />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function Dashboard() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {user.role === "ADMIN" && <AdminDashboard />}
      {user.role === "TECHNICIAN" && <TechnicianDashboard />}
      {user.role === "CLIENT" && <ClientDashboard />}
    </>
  );
}

function LayoutPage({ page = "dashboard" }) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <Layout>
      {(page === "dashboard" || !page) && <Dashboard />}
      {page === "users" && <UsersList />}
      {page === "tasks" && <TasksList />}
      {page === "clients" && <ClientsList />}
    </Layout>
  );
}

export default App;
