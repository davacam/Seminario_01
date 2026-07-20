import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,
      hasHydrated: false,

      // Acciones
      setUser: (user) => set({ user }),
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isLoading: false,
          error: null,
          hasHydrated: true,
        }),

      // Getters
      isAuthenticated: () => !!get().accessToken,
      getUser: () => get().user,
      getAccessToken: () => get().accessToken,
      getRefreshToken: () => get().refreshToken,
    }),
    {
      // Conservar la sesión JWT para restaurarla al recargar la aplicación.
      name: "auth-storage-v3",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export default useAuthStore;
