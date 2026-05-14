import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  withCredentials: true,
});

export const courseService = {
  getCourses: async (params?: any) => {
    const { data } = await api.get('/courses', { params });
    return data;
  },
  getCourseBySlug: async (slug: string) => {
    const { data } = await api.get(`/courses/slug/${slug}`);
    return data;
  },
  getCategories: async () => {
    const { data } = await api.get('/courses/categories');
    return data;
  },
};
