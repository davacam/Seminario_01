import { create } from "zustand";

const useClientStore = create((set) => ({
  clients: [],
  selectedClient: null,
  isLoading: false,
  error: null,
  pagination: { page: 1, total: 0, totalPages: 0 },

  setClients: (clients) => set({ clients }),
  setSelectedClient: (client) => set({ selectedClient: client }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setPagination: (pagination) => set({ pagination }),
  clearError: () => set({ error: null }),

  addClient: (client) =>
    set((state) => ({ clients: [client, ...state.clients] })),

  updateClient: (clientId, updatedClient) =>
    set((state) => ({
      clients: state.clients.map((c) =>
        c.id === clientId ? updatedClient : c
      ),
      selectedClient:
        state.selectedClient?.id === clientId
          ? updatedClient
          : state.selectedClient,
    })),

  removeClient: (clientId) =>
    set((state) => ({
      clients: state.clients.filter((c) => c.id !== clientId),
    })),

  reset: () =>
    set({
      clients: [],
      selectedClient: null,
    }),
}));

export default useClientStore;
