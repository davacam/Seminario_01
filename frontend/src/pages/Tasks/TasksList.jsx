import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import useTaskStore from "../../store/taskStore";
import useAuthStore from "../../store/authStore";
import taskService from "../../services/taskService";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import TaskForm from "./TaskForm";

const badgeClass = {
  OPEN: "border-sky-400/20 bg-sky-400/10 text-sky-200",
  IN_PROGRESS: "border-amber-300/20 bg-amber-300/10 text-amber-100",
  ON_HOLD: "border-slate-300/20 bg-slate-300/10 text-slate-200",
  COMPLETED: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  CANCELLED: "border-red-400/20 bg-red-400/10 text-red-200",
  LOW: "border-slate-300/20 bg-slate-300/10 text-slate-200",
  MEDIUM: "border-sky-400/20 bg-sky-400/10 text-sky-200",
  HIGH: "border-amber-300/20 bg-amber-300/10 text-amber-100",
  CRITICAL: "border-red-400/20 bg-red-400/10 text-red-200",
};

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

  const canCreate = userRole === "ADMIN" || userRole === "TECHNICIAN";
  const canEdit = userRole === "ADMIN" || userRole === "TECHNICIAN";
  const canDelete = userRole === "ADMIN" || userRole === "TECHNICIAN";

  const columns = [
    { key: "title", label: "Titulo" },
    { key: "status", label: "Estado", render: (val) => <span className={`badge ${badgeClass[val] || badgeClass.OPEN}`}>{val}</span> },
    { key: "priority", label: "Prioridad", render: (val) => <span className={`badge ${badgeClass[val] || badgeClass.MEDIUM}`}>{val}</span> },
    { key: "createdAt", label: "Fecha", render: (val) => new Date(val).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6">
      <div className="panel flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tareas</h1>
          <p className="mt-1 text-sm text-slate-400">Seguimiento de trabajo, prioridad y avance.</p>
        </div>
        {canCreate && (
          <button
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="btn-primary flex items-center gap-2"
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
        onDelete={canDelete ? handleDelete : null}
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
