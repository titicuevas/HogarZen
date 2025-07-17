import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { TaskProvider } from './contexts/TaskContext'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { ConfigChecker } from './components/common/ConfigChecker'
import { AuthLayout, PublicLayout, DashboardLayout } from './components/layout/Layout'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { Dashboard } from './components/dashboard/Dashboard'
import { LoadingSpinner } from './components/ui/LoadingSpinner'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import './index.css'

// =====================================================
// COMPONENTE APP PRINCIPAL
// =====================================================
function App() {
  return (
    <ErrorBoundary>
      <ConfigChecker />
      <AuthProvider>
        <TaskProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Ruta pública - Landing page */}
                <Route 
                  path="/" 
                  element={
                    <PublicLayout>
                      <Home />
                    </PublicLayout>
                  } 
                />
                
                {/* Ruta de autenticación */}
                <Route 
                  path="/auth" 
                  element={
                    <AuthLayout>
                      <Auth />
                    </AuthLayout>
                  } 
                />
                
                {/* Rutas protegidas */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Dashboard />
                      </DashboardLayout>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Rutas adicionales protegidas */}
                <Route 
                  path="/tasks" 
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <div>Página de Tareas (en desarrollo)</div>
                      </DashboardLayout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/analytics" 
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <div>Página de Análisis (en desarrollo)</div>
                      </DashboardLayout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <div>Página de Configuración (en desarrollo)</div>
                      </DashboardLayout>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Ruta por defecto */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </TaskProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
