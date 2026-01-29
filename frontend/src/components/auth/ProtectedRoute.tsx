import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store'

export function ProtectedRoute() {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
