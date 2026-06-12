import { useState } from "react";
import FormField from "../../components/forms/FormField";
import userService from "../../services/userService";

export default function UserForm({ user, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(
    user || { email: "", password: "", fullName: "", phone: "", role: "TECHNICIAN" }
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
      if (user) {
        await userService.updateUser(user.id, formData);
      } else {
        await userService.createUser(formData);
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
      {error && <div className="bg-red-900 text-red-200 p-3 rounded">{error}</div>}

      <FormField
        label="Nombre completo"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        required
      />

      <FormField
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        disabled={!!user}
      />

      {!user && (
        <FormField
          label="Contrasena"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      )}

      <FormField
        label="Telefono"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
      />

      <FormField
        label="Rol"
        type="select"
        name="role"
        value={formData.role}
        onChange={handleChange}
        options={[
          { value: "ADMIN", label: "Administrador" },
          { value: "TECHNICIAN", label: "Tecnico" },
          { value: "CLIENT", label: "Cliente" },
        ]}
        required
      />

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary flex-1 disabled:opacity-50"
        >
          {isLoading ? "Guardando..." : "Guardar"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary flex-1"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
