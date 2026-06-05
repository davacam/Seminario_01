import { useState } from "react";
import FormField from "../../components/forms/FormField";
import clientService from "../../services/clientService";

export default function ClientForm({ client, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(
    client || {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
      contactPerson: "",
    }
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
      if (client) {
        await clientService.updateClient(client.id, formData);
      } else {
        await clientService.createClient(formData);
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
        label="Nombre empresa"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <FormField
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />

      <FormField
        label="Telefono"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
      />

      <FormField
        label="Direccion"
        name="address"
        value={formData.address}
        onChange={handleChange}
      />

      <FormField
        label="Ciudad"
        name="city"
        value={formData.city}
        onChange={handleChange}
      />

      <FormField
        label="Contacto"
        name="contactPerson"
        value={formData.contactPerson}
        onChange={handleChange}
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
