// =====================================================
// EXPORTACIONES DE HOOKS PERSONALIZADOS
// =====================================================

// Hooks de autenticación
export { useAuth } from '../contexts/AuthContext'

// Hooks de tareas
export { useTasks } from '../contexts/TaskContext'

// Hooks de localStorage
export { useLocalStorage, useTheme, useNotifications, useUserSettings } from './useLocalStorage'

// Hooks de operaciones asíncronas
export { useAsync, useCRUD, usePagination } from './useAsync'

// =====================================================
// RE-EXPORTACIONES PARA FACILITAR IMPORTS
// =====================================================
export type { AuthContextType } from '../contexts/AuthContext'
export type { TaskContextType } from '../contexts/TaskContext' 