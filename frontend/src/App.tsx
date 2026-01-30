import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage, RegisterPage, DashboardPage } from '@/pages'
import { ProtectedRoute, PublicRoute } from '@/components/auth'
import { Toaster } from '@/components/ui'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes - redirect to dashboard if already logged in */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected routes - require authentication */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </Router>
  )
}

export default App
