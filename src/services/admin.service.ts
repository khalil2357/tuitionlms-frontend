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
  // Stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get('/admin/dashboard');
    return data;
  },

  // Users
  getUsers: async () => {
    const { data } = await api.get('/admin/users');
    return data;
  },
  createUser: async (userData: any) => {
    const { data } = await api.post('/admin/users', userData);
    return data;
  },
  getUser: async (id: string) => {
    const { data } = await api.get(`/admin/users/${id}`);
    return data;
  },
  updateUser: async (id: string, updates: any) => {
    const { data } = await api.patch(`/admin/users/${id}`, updates);
    return data;
  },
  updateUserRole: async (id: string, role: string) => {
    const { data } = await api.patch(`/admin/users/${id}/role`, { role });
    return data;
  },
  banUser: async (id: string) => {
    const { data } = await api.patch(`/admin/users/${id}/ban`);
    return data;
  },
  suspendUser: async (id: string) => {
    const { data } = await api.patch(`/admin/users/${id}/suspend`);
    return data;
  },
  verifyInstructor: async (id: string) => {
    const { data } = await api.patch(`/admin/users/${id}/verify-instructor`);
    return data;
  },
  deleteUser: async (id: string) => {
    const { data } = await api.delete(`/admin/users/${id}`);
    return data;
  },

  // Courses
  getCourses: async () => {
    const { data } = await api.get('/admin/courses');
    return data;
  },
  getCourse: async (id: string) => {
    const { data } = await api.get(`/admin/courses/${id}`);
    return data;
  },
  createCourse: async (courseData: any) => {
    const { data } = await api.post('/admin/courses', courseData);
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
  },
  deleteCourse: async (id: string) => {
    const { data } = await api.delete(`/admin/courses/${id}`);
    return data;
  },

  // Lessons
  getLessons: async () => {
    const { data } = await api.get('/admin/lessons');
    return data;
  },
  getLesson: async (id: string) => {
    const { data } = await api.get(`/admin/lessons/${id}`);
    return data;
  },
  createLesson: async (lessonData: any) => {
    const { data } = await api.post('/admin/lessons', lessonData);
    return data;
  },
  updateLesson: async (id: string, updates: any) => {
    const { data } = await api.patch(`/admin/lessons/${id}`, updates);
    return data;
  },
  deleteLesson: async (id: string) => {
    const { data } = await api.delete(`/admin/lessons/${id}`);
    return data;
  },

  // Enrollments
  getEnrollments: async () => {
    const { data } = await api.get('/admin/enrollments');
    return data;
  },
  getEnrollment: async (id: string) => {
    const { data } = await api.get(`/admin/enrollments/${id}`);
    return data;
  },
  updateEnrollmentStatus: async (id: string, status: string) => {
    const { data } = await api.patch(`/admin/enrollments/${id}/status`, { status });
    return data;
  },
  updateEnrollmentProgress: async (id: string, progress: number) => {
    const { data } = await api.patch(`/admin/enrollments/${id}/progress`, { progress });
    return data;
  },
  deleteEnrollment: async (id: string) => {
    const { data } = await api.delete(`/admin/enrollments/${id}`);
    return data;
  },

  // Quizzes
  getQuizzes: async () => {
    const { data } = await api.get('/admin/quizzes');
    return data;
  },
  getQuiz: async (id: string) => {
    const { data } = await api.get(`/admin/quizzes/${id}`);
    return data;
  },
  createQuiz: async (quizData: any) => {
    const { data } = await api.post('/admin/quizzes', quizData);
    return data;
  },
  updateQuiz: async (id: string, updates: any) => {
    const { data } = await api.patch(`/admin/quizzes/${id}`, updates);
    return data;
  },
  publishQuiz: async (id: string) => {
    const { data } = await api.patch(`/admin/quizzes/${id}/publish`);
    return data;
  },
  unpublishQuiz: async (id: string) => {
    const { data } = await api.patch(`/admin/quizzes/${id}/unpublish`);
    return data;
  },
  deleteQuiz: async (id: string) => {
    const { data } = await api.delete(`/admin/quizzes/${id}`);
    return data;
  },

  // Reviews
  getReviews: async () => {
    const { data } = await api.get('/admin/reviews');
    return data;
  },
  deleteReview: async (id: string) => {
    const { data } = await api.delete(`/admin/reviews/${id}`);
    return data;
  },

  // Certificates
  getCertificates: async () => {
    const { data } = await api.get('/admin/certificates');
    return data;
  },
  getCertificate: async (id: string) => {
    const { data } = await api.get(`/admin/certificates/${id}`);
    return data;
  },
  createCertificate: async (certData: any) => {
    const { data } = await api.post('/admin/certificates', certData);
    return data;
  },
  deleteCertificate: async (id: string) => {
    const { data } = await api.delete(`/admin/certificates/${id}`);
    return data;
  },

  // Instructor Requests
  getInstructorRequests: async () => {
    const { data } = await api.get('/admin/instructor-requests');
    return data;
  },
  getInstructorRequest: async (id: string) => {
    const { data } = await api.get(`/admin/instructor-requests/${id}`);
    return data;
  },
  approveInstructor: async (id: string, approvalData: { status: 'APPROVED' | 'REJECTED', reason?: string }) => {
    const { data } = await api.patch(`/admin/approve-instructor/${id}`, approvalData);
    return data;
  },
  deleteInstructorRequest: async (id: string) => {
    const { data } = await api.delete(`/admin/instructor-requests/${id}`);
    return data;
  },

  // Sections
  getSections: async (courseId?: string) => {
    const { data } = await api.get('/admin/sections', { params: { courseId } });
    return data;
  },
  createSection: async (sectionData: any) => {
    const { data } = await api.post('/admin/sections', sectionData);
    return data;
  },
  updateSection: async (id: string, updates: any) => {
    const { data } = await api.patch(`/admin/sections/${id}`, updates);
    return data;
  },
  deleteSection: async (id: string) => {
    const { data } = await api.delete(`/admin/sections/${id}`);
    return data;
  },

  // Questions
  getQuestions: async (quizId?: string) => {
    const { data } = await api.get('/admin/questions', { params: { quizId } });
    return data;
  },
  createQuestion: async (questionData: any) => {
    const { data } = await api.post('/admin/questions', questionData);
    return data;
  },
  updateQuestion: async (id: string, updates: any) => {
    const { data } = await api.patch(`/admin/questions/${id}`, updates);
    return data;
  },
  deleteQuestion: async (id: string) => {
    const { data } = await api.delete(`/admin/questions/${id}`);
    return data;
  },

  // Categories
  getCategories: async () => {
    const { data } = await api.get('/admin/categories');
    return data;
  },
  createCategory: async (categoryData: any) => {
    const { data } = await api.post('/admin/categories', categoryData);
    return data;
  },
  updateCategory: async (id: string, updates: any) => {
    const { data } = await api.patch(`/admin/categories/${id}`, updates);
    return data;
  },
  deleteCategory: async (id: string) => {
    const { data } = await api.delete(`/admin/categories/${id}`);
    return data;
  },
  manualEnroll: async (enrollData: { studentId: string, courseId: string }) => {
    const { data } = await api.post('/admin/enrollments/manual', enrollData);
    return data;
  }
};
