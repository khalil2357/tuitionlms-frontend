import api from '../api/axios';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  university?: string;
  educationLevel?: string;
  phone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  university?: string;
  educationLevel?: string;
  phone?: string;
}

export interface InstructorRegisterPayload {
  name: string;
  email: string;
  password: string;
  expertise?: string;
  bio?: string;
  phoneNumber?: string;
}

export interface LoginResponse {
  access_token: string;
  user: AuthUser;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/login', payload);
    return data;
  },

  registerStudent: async (payload: RegisterPayload): Promise<AuthUser> => {
    const { data } = await api.post<AuthUser>('/auth/register', payload);
    return data;
  },

  registerInstructor: async (payload: InstructorRegisterPayload): Promise<{ message: string }> => {
    const { data } = await api.post<{ message: string }>('/auth/instructor-register', payload);
    return data;
  },
};
