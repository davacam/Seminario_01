import { useState } from "react";
import FormField from "../../components/forms/FormField";
import taskService from "../../services/taskService";

export default function TaskForm({ task, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(
    task || { title: "", description: "", priority: "MEDIUM", status: "OPEN" }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (task) {
        await taskService.updateTask(task.id, formData);
      } else {
        await taskService.createTask(formData);
      }
      onSubmit();
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-900 text-red-200 p-3 rounded">
          {error}
        </div>
      )}

      <FormField
        label="Título"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <FormField
        label="Descripción"
        type="textarea"
        name="description"
        value={formData.description}
        onChange={handleChange}
      />

      <FormField
        label="Prioridad"
        type="select"
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        options={[
          { value: "LOW", label: "Baja" },
          { value: "MEDIUM", label: "Media" },
          { value: "HIGH", label: "Alta" },
          { value: "CRITICAL", label: "Crítica" },
        ]}
      />

      <FormField
        label="Estado"
        type="select"
        name="status"
        value={formData.status}
        onChange={handleChange}
        options={[
          { value: "OPEN", label: "Abierta" },
          { value: "IN_PROGRESS", label: "En Progreso" },
          { value: "ON_HOLD", label: "Pausada" },
          { value: "COMPLETED", label: "Completada" },
          { value: "CANCELLED", label: "Cancelada" },
        ]}
      />

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-2 rounded"
        >
          {isLoading ? "Guardando..." : "Guardar"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
