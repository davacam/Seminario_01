import api from "./api";

const userService = {
  getAllUsers: async (page = 1) => {
    const response = await api.get("/users", { params: { page } });
    return response.data.data;
  },

  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data.data;
  },

  createUser: async (userData) => {
    const response = await api.post("/users", userData);
    return response.data.data;
  },

  updateUser: async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data.data;
  },
};

export default userService;
