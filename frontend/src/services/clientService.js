import api from "./api";

const clientService = {
  getAllClients: async (page = 1) => {
    const response = await api.get("/clients", { params: { page } });
    return response.data.data;
  },

  getClientById: async (clientId) => {
    const response = await api.get(`/clients/${clientId}`);
    return response.data.data;
  },

  createClient: async (clientData) => {
    const response = await api.post("/clients", clientData);
    return response.data.data;
  },

  updateClient: async (clientId, clientData) => {
    const response = await api.put(`/clients/${clientId}`, clientData);
    return response.data.data;
  },

  deleteClient: async (clientId) => {
    const response = await api.delete(`/clients/${clientId}`);
    return response.data.data;
  },
};

export default clientService;
