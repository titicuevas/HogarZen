import { useState, useEffect, useCallback } from 'react'
import { TaskService } from '../services/taskService'
import { Task, UserTask, TaskCategory } from '../types'
import { useAuth } from './useAuth'
import { showNotification } from '../utils/notifications'

// =====================================================
// HOOK PERSONALIZADO PARA TAREAS - PRINCIPIOS SOLID Y DRY
// =====================================================

interface TasksState {
  systemTasks: Task[]
  userTasks: UserTask[]
  summary: {
    total: number
    completed: number
    pending: number
    percentage: number
  }
  loading: boolean
  error: string | null
}

interface UseTasksReturn extends TasksState {
  // Métodos para tareas del sistema
  loadSystemTasks: () => Promise<void>
  loadTasksByCategory: (category: TaskCategory) => Promise<Task[]>
  
  // Métodos para tareas del usuario
  loadUserTasks: (date?: string) => Promise<void>
  addUserTask: (taskId: string, date?: string) => Promise<void>
  toggleTaskStatus: (userTaskId: string, status: boolean) => Promise<void>
  removeUserTask: (userTaskId: string) => Promise<void>
  
  // Métodos de utilidad
  refreshSummary: () => Promise<void>
  clearError: () => void
}

export const useTasks = (): UseTasksReturn => {
  const { user } = useAuth()
  const [state, setState] = useState<TasksState>({
    systemTasks: [],
    userTasks: [],
    summary: {
      total: 0,
      completed: 0,
      pending: 0,
      percentage: 0
    },
    loading: false,
    error: null
  })

  // =====================================================
  // MÉTODOS PARA TAREAS DEL SISTEMA
  // =====================================================

  const loadSystemTasks = useCallback(async (): Promise<void> => {
    if (!user) return

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await TaskService.getSystemTasks()
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          systemTasks: response.data,
          loading: false
        }))
      } else {
        throw new Error(response.error || 'Error al cargar tareas del sistema')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false
      }))
      showNotification('error', 'Error al cargar tareas del sistema')
    }
  }, [user])

  const loadTasksByCategory = useCallback(async (category: TaskCategory): Promise<Task[]> => {
    if (!user) return []

    try {
      const response = await TaskService.getTasksByCategory(category)
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.error || 'Error al cargar tareas por categoría')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      showNotification('error', 'Error al cargar tareas por categoría')
      return []
    }
  }, [user])

  // =====================================================
  // MÉTODOS PARA TAREAS DEL USUARIO
  // =====================================================

  const loadUserTasks = useCallback(async (date?: string): Promise<void> => {
    if (!user) return

    const targetDate = date || new Date().toISOString().split('T')[0]
    
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const [tasksResponse, summaryResponse] = await Promise.all([
        TaskService.getUserTasks(user.id, targetDate),
        TaskService.getTasksSummary(user.id, targetDate)
      ])

      if (tasksResponse.success && summaryResponse.success) {
        setState(prev => ({
          ...prev,
          userTasks: tasksResponse.data || [],
          summary: summaryResponse.data || {
            total: 0,
            completed: 0,
            pending: 0,
            percentage: 0
          },
          loading: false
        }))
      } else {
        throw new Error(
          tasksResponse.error || 
          summaryResponse.error || 
          'Error al cargar tareas del usuario'
        )
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false
      }))
      showNotification('error', 'Error al cargar tareas del usuario')
    }
  }, [user])

  const addUserTask = useCallback(async (taskId: string, date?: string): Promise<void> => {
    if (!user) return

    const targetDate = date || new Date().toISOString().split('T')[0]

    try {
      // Verificar si la tarea ya existe
      const existsResponse = await TaskService.taskExistsForUser(user.id, taskId, targetDate)
      
      if (existsResponse.success && existsResponse.data) {
        showNotification('warning', 'Esta tarea ya está en tu lista para hoy')
        return
      }

      const response = await TaskService.createUserTask(user.id, taskId, targetDate)
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          userTasks: [...prev.userTasks, response.data!]
        }))
        
        // Actualizar resumen
        await refreshSummary()
        showNotification('success', 'Tarea agregada correctamente')
      } else {
        throw new Error(response.error || 'Error al agregar tarea')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      showNotification('error', 'Error al agregar tarea')
    }
  }, [user])

  const toggleTaskStatus = useCallback(async (userTaskId: string, status: boolean): Promise<void> => {
    if (!user) return

    try {
      const response = await TaskService.updateUserTaskStatus(userTaskId, status)
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          userTasks: prev.userTasks.map(task => 
            task.id === userTaskId ? response.data! : task
          )
        }))
        
        // Actualizar resumen
        await refreshSummary()
        
        const message = status ? '¡Tarea completada!' : 'Tarea marcada como pendiente'
        showNotification('success', message)
      } else {
        throw new Error(response.error || 'Error al actualizar estado de tarea')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      showNotification('error', 'Error al actualizar tarea')
    }
  }, [user])

  const removeUserTask = useCallback(async (userTaskId: string): Promise<void> => {
    if (!user) return

    try {
      const response = await TaskService.deleteUserTask(userTaskId)
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          userTasks: prev.userTasks.filter(task => task.id !== userTaskId)
        }))
        
        // Actualizar resumen
        await refreshSummary()
        showNotification('success', 'Tarea eliminada correctamente')
      } else {
        throw new Error(response.error || 'Error al eliminar tarea')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      showNotification('error', 'Error al eliminar tarea')
    }
  }, [user])

  // =====================================================
  // MÉTODOS DE UTILIDAD
  // =====================================================

  const refreshSummary = useCallback(async (): Promise<void> => {
    if (!user) return

    try {
      const date = new Date().toISOString().split('T')[0]
      const response = await TaskService.getTasksSummary(user.id, date)
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          summary: response.data
        }))
      }
    } catch (error) {
      // Silenciar errores en refresh de resumen
      console.warn('Error al actualizar resumen:', error)
    }
  }, [user])

  const clearError = useCallback((): void => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  // =====================================================
  // EFECTOS
  // =====================================================

  // Cargar tareas del sistema al montar el componente
  useEffect(() => {
    loadSystemTasks()
  }, [loadSystemTasks])

  // Cargar tareas del usuario al montar el componente
  useEffect(() => {
    loadUserTasks()
  }, [loadUserTasks])

  return {
    ...state,
    loadSystemTasks,
    loadTasksByCategory,
    loadUserTasks,
    addUserTask,
    toggleTaskStatus,
    removeUserTask,
    refreshSummary,
    clearError
  }
} 