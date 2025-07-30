import { useState, useEffect } from 'react'

// =====================================================
// TIPOS
// =====================================================
type SetValue<T> = (value: T | ((val: T) => T)) => void

// =====================================================
// HOOK USE LOCAL STORAGE
// =====================================================
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, SetValue<T>] {
  // Estado para almacenar nuestro valor
  // Pasa la función inicial al useState para que solo se ejecute una vez
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Obtener del localStorage por key
      const item = window.localStorage.getItem(key)
      // Parsear el JSON almacenado o retornar initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // Si hay un error, retornar initialValue
      console.error(`Error leyendo localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Función para establecer el valor
  const setValue: SetValue<T> = (value) => {
    try {
      // Permitir que value sea una función para que tengamos la misma API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      // Guardar en el estado
      setStoredValue(valueToStore)
      // Guardar en localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      // Si hay un error, loguear el error
      console.error(`Error guardando localStorage key "${key}":`, error)
    }
  }

  // Efecto para sincronizar con cambios en localStorage de otras pestañas
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.error(`Error parseando localStorage key "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue]
}

// =====================================================
// HOOK PARA PREFERENCIAS DE TEMA
// =====================================================
export function useTheme() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light')

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  // Aplicar tema al documento
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  return { theme, setTheme, toggleTheme }
}

// =====================================================
// HOOK PARA PREFERENCIAS DE NOTIFICACIONES
// =====================================================
export function useNotifications() {
  const [notifications, setNotifications] = useLocalStorage('notifications', {
    enabled: true,
    sound: true,
    email: true,
    push: false
  })

  const updateNotificationSettings = (settings: Partial<typeof notifications>) => {
    setNotifications(prev => ({ ...prev, ...settings }))
  }

  return { notifications, updateNotificationSettings }
}

// =====================================================
// HOOK PARA CONFIGURACIÓN DE USUARIO
// =====================================================
export function useUserSettings() {
  const [settings, setSettings] = useLocalStorage('userSettings', {
    language: 'es',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'EUR'
  })

  const updateSettings = (newSettings: Partial<typeof settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  return { settings, updateSettings }
} 