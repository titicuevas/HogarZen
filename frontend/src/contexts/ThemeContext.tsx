import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

// =====================================================
// TIPOS
// =====================================================
type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

// =====================================================
// CONTEXTO
// =====================================================
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// =====================================================
// PROVIDER
// =====================================================
interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Intentar obtener el tema guardado en localStorage
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme
    }
    
    // Si no hay tema guardado, usar la preferencia del sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    
    return 'light'
  })

  // =====================================================
  // APLICAR TEMA AL HTML
  // =====================================================
  useEffect(() => {
    const root = window.document.documentElement
    
    // Remover clases anteriores
    root.classList.remove('light', 'dark')
    
    // Aplicar nueva clase
    root.classList.add(theme)
    
    // Guardar en localStorage
    localStorage.setItem('theme', theme)
    
    // Actualizar meta theme-color para móviles
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#1f2937' : '#ffffff')
    }
  }, [theme])

  // =====================================================
  // FUNCIONES
  // =====================================================
  const toggleTheme = () => {
    setThemeState(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  // =====================================================
  // ESCUCHAR CAMBIOS DEL SISTEMA
  // =====================================================
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Solo cambiar si no hay tema guardado en localStorage
      if (!localStorage.getItem('theme')) {
        setThemeState(e.matches ? 'dark' : 'light')
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// =====================================================
// HOOK
// =====================================================
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider')
  }
  return context
} 