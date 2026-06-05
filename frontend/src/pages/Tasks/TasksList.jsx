import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import useTaskStore from "../../store/taskStore";
import useAuthStore from "../../store/authStore";
import taskService from "../../services/taskService";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import TaskForm from "./TaskForm";

export default function TasksList() {
  const tasks = useTaskStore((state) => state.tasks);
  const isLoading = useTaskStore((state) => state.isLoading);
  const setTasks = useTaskStore((state) => state.setTasks);
  const setIsLoading = useTaskStore((state) => state.setIsLoading);
  const removeTask = useTaskStore((state) => state.removeTask);

  const userRole = useAuthStore((state) => state.user?.role);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const data = await taskService.getAllTasks();
      setTasks(data.data || []);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = async (taskId) => {
    if (confirm("Eliminar tarea?")) {
      try {
        await taskService.deleteTask(taskId);
        removeTask(taskId);
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const handleFormClose = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleFormSubmit = () => {
    loadTasks();
    handleFormClose();
  };

  const canCreate = userRole === "ADMIN";
  const canEdit = userRole === "ADMIN" || userRole === "TECHNICIAN";

  const columns = [
    { key: "title", label: "Título" },
    { key: "status", label: "Estado", render: (val) => <span className="px-2 py-1 bg-blue-700 rounded text-sm">{val}</span> },
    { key: "priority", label: "Prioridad" },
    { key: "createdAt", label: "Fecha", render: (val) => new Date(val).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tareas</h1>
        {canCreate && (
          <button
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            <Plus size={20} />
            Nueva Tarea
          </button>
        )}
      </div>

      <Table
        columns={columns}
        data={tasks}
        onEdit={canEdit ? handleEdit : null}
        onDelete={canCreate ? handleDelete : null}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleFormClose}
        title={editingTask ? "Editar Tarea" : "Nueva Tarea"}
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleFormSubmit}
          onCancel={handleFormClose}
        />
      </Modal>
    </div>
  );
}
