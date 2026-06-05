import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import useUserStore from "../../store/userStore";
import useAuthStore from "../../store/authStore";
import userService from "../../services/userService";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import UserForm from "./UserForm";

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
    { key: "role", label: "Rol" },
    { key: "status", label: "Estado" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Usuarios</h1>
        <button
          onClick={() => {
            setEditingUser(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
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
