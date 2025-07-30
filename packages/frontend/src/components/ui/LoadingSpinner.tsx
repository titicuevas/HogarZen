import React from 'react'

// =====================================================
// TIPOS
// =====================================================
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

// =====================================================
// CLASES CSS
// =====================================================
const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12'
}

// =====================================================
// COMPONENTE LOADING SPINNER
// =====================================================
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin`} />
      {text && (
        <p className="mt-4 text-primary-600 text-sm font-medium">
          {text}
        </p>
      )}
    </div>
  )
}

// =====================================================
// COMPONENTE LOADING SPINNER DE PANTALLA COMPLETA
// =====================================================
export const FullScreenSpinner: React.FC<{ text?: string }> = ({ text = 'Cargando...' }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zen-50 via-white to-primary-50 flex items-center justify-center">
      <LoadingSpinner size="lg" text={text} />
    </div>
  )
}

// =====================================================
// COMPONENTE LOADING SPINNER INLINE
// =====================================================
export const InlineSpinner: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'sm' }) => {
  return (
    <div className="inline-flex items-center">
      <LoadingSpinner size={size} />
    </div>
  )
} 