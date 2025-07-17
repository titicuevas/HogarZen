import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { FullScreenSpinner } from '../ui/LoadingSpinner'

// =====================================================
// TIPOS
// =====================================================
interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

// =====================================================
// COMPONENTE PROTECTED ROUTE
// =====================================================
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/auth'
}) => {
  const { isAuthenticated, loading } = useAuth()

  // Mostrar spinner mientras se verifica la autenticación
  if (loading) {
    return <FullScreenSpinner text="Verificando autenticación..." />
  }

  // Redirigir si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  // Renderizar contenido protegido
  return <>{children}</>
}

// =====================================================
// COMPONENTE PARA RUTAS PÚBLICAS (SOLO NO AUTENTICADOS)
// =====================================================
interface PublicRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo = '/dashboard'
}) => {
  const { isAuthenticated, loading } = useAuth()

  // Mostrar spinner mientras se verifica la autenticación
  if (loading) {
    return <FullScreenSpinner text="Verificando autenticación..." />
  }

  // Redirigir si ya está autenticado
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  // Renderizar contenido público
  return <>{children}</>
} 