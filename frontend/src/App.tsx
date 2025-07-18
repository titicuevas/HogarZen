import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { TaskProvider } from './contexts/TaskContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { ConfigChecker } from './components/common/ConfigChecker'
import { AuthLayout, PublicLayout, DashboardLayout } from './components/layout/Layout'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Help from './pages/Help'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Cookies from './pages/Cookies'
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
      <NotificationProvider>
        <AuthProvider>
          <TaskProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
                  
                  {/* Rutas públicas - Páginas legales y de ayuda */}
                  <Route 
                    path="/ayuda" 
                    element={
                      <PublicLayout>
                        <Help />
                      </PublicLayout>
                    } 
                  />
                  
                  <Route 
                    path="/privacidad" 
                    element={
                      <PublicLayout>
                        <Privacy />
                      </PublicLayout>
                    } 
                  />
                  
                  <Route 
                    path="/terminos" 
                    element={
                      <PublicLayout>
                        <Terms />
                      </PublicLayout>
                    } 
                  />
                  
                  <Route 
                    path="/cookies" 
                    element={
                      <PublicLayout>
                        <Cookies />
                      </PublicLayout>
                    } 
                  />
                  
                  {/* Ruta de autenticación */}
                  <Route 
                    path="/login" 
                    element={
                      <AuthLayout>
                        <Auth />
                      </AuthLayout>
                    } 
                  />
                  
                  {/* Redirección de /auth a /login para compatibilidad */}
                  <Route 
                    path="/auth" 
                    element={<Navigate to="/login" replace />} 
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
                    path="/tareas" 
                    element={
                      <ProtectedRoute>
                        <DashboardLayout>
                          <div>Página de Tareas (en desarrollo)</div>
                        </DashboardLayout>
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/analiticas" 
                    element={
                      <ProtectedRoute>
                        <DashboardLayout>
                          <div>Página de Análisis (en desarrollo)</div>
                        </DashboardLayout>
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/configuracion" 
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
      </NotificationProvider>
    </ErrorBoundary>
  )
}

export default App
