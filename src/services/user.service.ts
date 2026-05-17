import api from '../api/axios';

export const userService = {
  getProfile: async () => {
    const { data } = await api.get('/users/profile');
    return data;
  },

  updateProfile: async (payload: any) => {
    const { data } = await api.patch('/users/update', payload);
    return data;
  },
};
