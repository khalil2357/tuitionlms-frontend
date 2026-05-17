import api from '../api/axios';

export const enrollmentService = {
  enroll: async (courseId: string) => {
    const { data } = await api.post('/enrollments/enroll', { courseId });
    return data;
  },

  myEnrollments: async () => {
    const { data } = await api.get('/enrollments/my-enrollments');
    return data;
  },
};
