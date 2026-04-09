export interface AdminUser {
  id: string
  email: string
}

export interface AuthState {
  user: AdminUser | null
  isLoading: boolean
  isAuthenticated: boolean
}