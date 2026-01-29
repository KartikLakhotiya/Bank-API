import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store'

export function PublicRoute() {
  const { isAuthenticated, user } = useAuthStore()

  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default PublicRoute
