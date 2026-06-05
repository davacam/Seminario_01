import { create } from "zustand";

const useTaskStore = create((set) => ({
  tasks: [],
  selectedTask: null,
  isLoading: false,
  error: null,
  filters: { status: null, priority: null },
  pagination: { page: 1, total: 0, totalPages: 0 },

  setTasks: (tasks) => set({ tasks }),
  setSelectedTask: (task) => set({ selectedTask: task }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setFilters: (filters) => set({ filters }),
  setPagination: (pagination) => set({ pagination }),
  clearError: () => set({ error: null }),

  addTask: (task) =>
    set((state) => ({ tasks: [task, ...state.tasks] })),

  updateTask: (taskId, updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
      selectedTask:
        state.selectedTask?.id === taskId ? updatedTask : state.selectedTask,
    })),

  removeTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
    })),

  reset: () =>
    set({
      tasks: [],
      selectedTask: null,
      filters: { status: null, priority: null },
    }),
}));

export default useTaskStore;
