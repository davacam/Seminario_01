import api from "./api";

const publicService = {
  getLoginSummary: async () => {
    const response = await api.get("/public/summary");
    return response.data.data;
  },
};

export default publicService;
