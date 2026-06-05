import { create } from "zustand";

const useUserStore = create((set, get) => ({
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
  pagination: { page: 1, total: 0, totalPages: 0 },

  setUsers: (users) => set({ users }),
  setSelectedUser: (user) => set({ selectedUser: user }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setPagination: (pagination) => set({ pagination }),
  clearError: () => set({ error: null }),

  addUser: (user) =>
    set((state) => ({ users: [user, ...state.users] })),

  updateUser: (userId, updatedUser) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === userId ? updatedUser : u)),
      selectedUser:
        state.selectedUser?.id === userId ? updatedUser : state.selectedUser,
    })),

  removeUser: (userId) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== userId),
    })),

  reset: () =>
    set({
      users: [],
      selectedUser: null,
      isLoading: false,
      error: null,
    }),
}));

export default useUserStore;
