import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import useUserStore from "../../store/userStore";
import useAuthStore from "../../store/authStore";
import userService from "../../services/userService";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import UserForm from "./UserForm";

const roleBadge = {
  ADMIN: "border-sky-400/20 bg-sky-400/10 text-sky-200",
  TECHNICIAN: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  CLIENT: "border-amber-300/20 bg-amber-300/10 text-amber-100",
};

const statusBadge = {
  ACTIVE: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  INACTIVE: "border-slate-300/20 bg-slate-300/10 text-slate-200",
  SUSPENDED: "border-red-400/20 bg-red-400/10 text-red-200",
};

export default function UsersList() {
  const users = useUserStore((state) => state.users);
  const isLoading = useUserStore((state) => state.isLoading);
  const setUsers = useUserStore((state) => state.setUsers);
  const setIsLoading = useUserStore((state) => state.setIsLoading);
  const removeUser = useUserStore((state) => state.removeUser);

  const userRole = useAuthStore((state) => state.user?.role);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data.data || []);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId) => {
    if (confirm("Eliminar usuario?")) {
      try {
        await userService.deleteUser(userId);
        removeUser(userId);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleFormClose = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleFormSubmit = () => {
    loadUsers();
    handleFormClose();
  };

  if (userRole !== "ADMIN") {
    return <div className="text-center py-8">No autorizado</div>;
  }

  const columns = [
    { key: "fullName", label: "Nombre" },
    { key: "email", label: "Email" },
    { key: "role", label: "Rol", render: (val) => <span className={`badge ${roleBadge[val] || roleBadge.CLIENT}`}>{val}</span> },
    { key: "status", label: "Estado", render: (val) => <span className={`badge ${statusBadge[val] || statusBadge.INACTIVE}`}>{val}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="panel flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Usuarios</h1>
          <p className="mt-1 text-sm text-slate-400">Gestiona roles, acceso y estado del equipo.</p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Nuevo Usuario
        </button>
      </div>

      <Table
        columns={columns}
        data={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleFormClose}
        title={editingUser ? "Editar Usuario" : "Nuevo Usuario"}
      >
        <UserForm
          user={editingUser}
          onSubmit={handleFormSubmit}
          onCancel={handleFormClose}
        />
      </Modal>
    </div>
  );
}
