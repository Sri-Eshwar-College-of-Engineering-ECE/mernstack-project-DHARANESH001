import api from "./api";

export const skillService = {
  getSkills: async (params = {}) => {
    const res = await api.get("/skills", { params });
    return res.data;
  },

  getSkill: async (id) => {
    const res = await api.get(`/skills/${id}`);
    return res.data;
  },

  createSkill: async (data) => {
    const res = await api.post("/skills", data);
    return res.data;
  },

  updateSkill: async (id, data) => {
    const res = await api.put(`/skills/${id}`, data);
    return res.data;
  },

  deleteSkill: async (id) => {
    const res = await api.delete(`/skills/${id}`);
    return res.data;
  },

  increaseLevel: async (id) => {
    const res = await api.patch(`/skills/${id}/increase`);
    return res.data;
  },

  decreaseLevel: async (id) => {
    const res = await api.patch(`/skills/${id}/decrease`);
    return res.data;
  },

  toggleFavorite: async (id) => {
    const res = await api.patch(`/skills/${id}/favorite`);
    return res.data;
  },

  getStats: async () => {
    const res = await api.get("/skills/stats");
    return res.data;
  },

  uploadCertificate: async (id, formData) => {
    const res = await api.post(`/skills/${id}/certificate`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  deleteCertificate: async (id) => {
    const res = await api.delete(`/skills/${id}/certificate`);
    return res.data;
  },
};

export const profileService = {
  getProfile: async () => {
    const res = await api.get("/profile");
    return res.data;
  },

  updateProfile: async (data) => {
    const res = await api.put("/profile", data);
    return res.data;
  },

  changePassword: async (data) => {
    const res = await api.put("/profile/password", data);
    return res.data;
  },

  uploadAvatar: async (formData) => {
    const res = await api.post("/profile/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  uploadResume: async (formData) => {
    const res = await api.post("/profile/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};
