import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

interface ThemeToggleProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'icon' | 'button' | 'minimal'
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  size = 'md',
  variant = 'icon'
}) => {
  const { theme, toggleTheme } = useTheme()

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const baseClasses = `
    inline-flex items-center justify-center
    rounded-xl transition-all duration-300
    hover:scale-105 active:scale-95
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${sizeClasses[size]}
    ${className}
  `

  if (variant === 'minimal') {
    return (
      <button
        onClick={toggleTheme}
        className={`
          ${baseClasses}
          text-gray-600 hover:text-gray-900
          dark:text-gray-400 dark:hover:text-white
          focus:ring-primary-500 dark:focus:ring-primary-400
        `}
        aria-label={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
      >
        {theme === 'light' ? (
          <Moon className={iconSizes[size]} />
        ) : (
          <Sun className={iconSizes[size]} />
        )}
      </button>
    )
  }

  if (variant === 'button') {
    return (
      <button
        onClick={toggleTheme}
        className={`
          ${baseClasses}
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          text-gray-700 dark:text-gray-300
          hover:bg-gray-50 dark:hover:bg-gray-700
          shadow-sm hover:shadow-md
          focus:ring-primary-500 dark:focus:ring-primary-400
        `}
        aria-label={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
      >
        {theme === 'light' ? (
          <Moon className={iconSizes[size]} />
        ) : (
          <Sun className={iconSizes[size]} />
        )}
      </button>
    )
  }

  // Variant 'icon' (default)
  return (
    <button
      onClick={toggleTheme}
      className={`
        ${baseClasses}
        bg-gradient-to-r from-primary-500 to-primary-600
        hover:from-primary-600 hover:to-primary-700
        text-white shadow-lg hover:shadow-xl
        focus:ring-white dark:focus:ring-gray-800
      `}
      aria-label={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
    >
      {theme === 'light' ? (
        <Moon className={iconSizes[size]} />
      ) : (
        <Sun className={iconSizes[size]} />
      )}
    </button>
  )
} 