import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

const getToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const session = window.localStorage.getItem('tuitionlms-auth');
    if (session) {
      const parsed = JSON.parse(session);
      return parsed.token;
    }
  } catch (e) {
    console.error('Failed to parse auth session:', e);
  }

  return null;
};

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      window.localStorage.removeItem('tuitionlms-auth');
    }

    return Promise.reject(error);
  }
);

export default api;
