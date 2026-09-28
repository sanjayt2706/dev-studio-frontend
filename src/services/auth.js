import api from './api';

export const authService = {
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.token) {
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify({
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role
      }));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },

  getToken: () => {
    return localStorage.getItem('adminToken');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('adminUser');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('adminToken');
  }
};

export default authService;
