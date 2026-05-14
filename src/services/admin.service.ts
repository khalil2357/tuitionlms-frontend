import api from '../api/axios';

export interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalLessons: number;
  totalEnrollments: number;
  totalQuizzes: number;
  totalQuizResults: number;
  totalReviews: number;
  totalCertificates: number;
  activeUsers: number;
  verifiedInstructors: number;
  publishedCourses: number;
  draftCourses: number;
  archivedCourses: number;
  activeEnrollments: number;
  completedEnrollments: number;
  revenue: number;
}

export const adminService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get('/admin/dashboard');
    return data;
  },

  getUsers: async () => {
    const { data } = await api.get('/admin/users');
    return data;
  },

  updateUserRole: async (id: string, role: string) => {
    const { data } = await api.patch(`/admin/users/${id}/role`, { role });
    return data;
  },

  updateUser: async (id: string, updates: any) => {
    const { data } = await api.patch(`/admin/users/${id}`, updates);
    return data;
  },

  getCourses: async () => {
    const { data } = await api.get('/admin/courses');
    return data;
  },

  updateCourse: async (id: string, updates: any) => {
    const { data } = await api.patch(`/admin/courses/${id}`, updates);
    return data;
  },
  
  publishCourse: async (id: string) => {
    const { data } = await api.patch(`/admin/courses/${id}/publish`);
    return data;
  },
  
  unpublishCourse: async (id: string) => {
    const { data } = await api.patch(`/admin/courses/${id}/unpublish`);
    return data;
  }
};
