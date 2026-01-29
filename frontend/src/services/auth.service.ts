import api from './api'
import type { User, LoginCredentials, RegisterData, LoginResponse } from '@/types'

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/users/login', credentials)
    return response.data
  },

  register: async (data: RegisterData): Promise<User> => {
    const response = await api.post<User>('/users/create', data)
    return response.data
  },

  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/users/logout')
    return response.data
  },

  checkAuth: async (): Promise<User> => {
    const response = await api.get<User>('/users/v1/check-auth')
    return response.data
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users')
    return response.data
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`)
    return response.data
  },
}

export default authService
