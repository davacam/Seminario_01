import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import useClientStore from "../../store/clientStore";
import useAuthStore from "../../store/authStore";
import clientService from "../../services/clientService";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import ClientForm from "./ClientForm";

export default function ClientsList() {
  const clients = useClientStore((state) => state.clients);
  const isLoading = useClientStore((state) => state.isLoading);
  const setClients = useClientStore((state) => state.setClients);
  const setIsLoading = useClientStore((state) => state.setIsLoading);
  const removeClient = useClientStore((state) => state.removeClient);

  const userRole = useAuthStore((state) => state.user?.role);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setIsLoading(true);
      const data = await clientService.getAllClients();
      setClients(data.data || []);
    } catch (error) {
      console.error("Error loading clients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleDelete = async (clientId) => {
    if (confirm("Eliminar cliente?")) {
      try {
        await clientService.deleteClient(clientId);
        removeClient(clientId);
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };

  const handleFormClose = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleFormSubmit = () => {
    loadClients();
    handleFormClose();
  };

  if (userRole !== "ADMIN") {
    return <div className="text-center py-8">No autorizado</div>;
  }

  const columns = [
    { key: "name", label: "Nombre" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Telefono" },
    { key: "city", label: "Ciudad" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <button
          onClick={() => {
            setEditingClient(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
        >
          <Plus size={20} />
          Nuevo Cliente
        </button>
      </div>

      <Table
        columns={columns}
        data={clients}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleFormClose}
        title={editingClient ? "Editar Cliente" : "Nuevo Cliente"}
      >
        <ClientForm
          client={editingClient}
          onSubmit={handleFormSubmit}
          onCancel={handleFormClose}
        />
      </Modal>
    </div>
  );
}
