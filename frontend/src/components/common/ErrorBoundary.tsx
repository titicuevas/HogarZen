import React, { Component, ErrorInfo, ReactNode } from 'react'

// =====================================================
// TIPOS
// =====================================================
interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

// =====================================================
// COMPONENTE ERROR BOUNDARY
// =====================================================
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary capturó un error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Llamar al callback personalizado si existe
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      // Renderizar fallback personalizado o el componente por defecto
      if (this.props.fallback) {
        return this.props.fallback
      }

      return <ErrorFallback error={this.state.error} />
    }

    return this.props.children
  }
}

// =====================================================
// COMPONENTE FALLBACK POR DEFECTO
// =====================================================
interface ErrorFallbackProps {
  error?: Error
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error }) => {
  const handleReload = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Icono de error */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          ¡Ups! Algo salió mal
        </h1>

        {/* Descripción */}
        <p className="text-gray-600 mb-6">
          Ha ocurrido un error inesperado. No te preocupes, nuestro equipo ha sido notificado.
        </p>

        {/* Detalles del error (solo en desarrollo) */}
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
              Ver detalles del error
            </summary>
            <div className="bg-gray-100 p-3 rounded-lg text-xs font-mono text-gray-800 overflow-auto">
              <div className="mb-2">
                <strong>Error:</strong> {error.message}
              </div>
              {error.stack && (
                <div>
                  <strong>Stack:</strong>
                  <pre className="whitespace-pre-wrap mt-1">{error.stack}</pre>
                </div>
              )}
            </div>
          </details>
        )}

        {/* Botones de acción */}
        <div className="space-y-3">
          <button
            onClick={handleReload}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Recargar página
          </button>
          
          <button
            onClick={handleGoHome}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Ir al inicio
          </button>
        </div>

        {/* Información adicional */}
        <p className="text-xs text-gray-500 mt-6">
          Si el problema persiste, contacta con soporte técnico
        </p>
      </div>
    </div>
  )
}

// =====================================================
// HOOK PARA ERRORES ASÍNCRONOS
// =====================================================
export const useAsyncError = () => {
  const [, setError] = React.useState()
  return React.useCallback(
    (e: Error) => {
      setError(() => {
        throw e
      })
    },
    []
  )
} 