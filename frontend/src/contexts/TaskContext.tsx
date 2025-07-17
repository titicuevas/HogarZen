import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { Task, UserTask, TaskCategory } from '../types'
import { TaskService } from '../services/taskService'
import { useAuth } from './AuthContext'

// =====================================================
// TIPOS DEL CONTEXTO
// =====================================================
interface TaskState {
  tasks: Task[]
  userTasks: UserTask[]
  loading: boolean
  error: string | null
  selectedDate: string
  selectedCategory: TaskCategory | 'all'
}

interface TaskContextType extends TaskState {
  // Acciones de tareas
  fetchTasks: () => Promise<void>
  fetchUserTasks: (date?: string) => Promise<void>
  createUserTask: (taskId: string, date: string) => Promise<void>
  updateUserTask: (userTaskId: string, status: boolean) => Promise<void>
  deleteUserTask: (userTaskId: string) => Promise<void>
  
  // Filtros y selección
  setSelectedDate: (date: string) => void
  setSelectedCategory: (category: TaskCategory | 'all') => void
  
  // Utilidades
  getTasksByCategory: (category: TaskCategory) => Task[]
  getCompletedTasks: () => UserTask[]
  getPendingTasks: () => UserTask[]
  getCompletionRate: () => number
}

// =====================================================
// ESTADO INICIAL
// =====================================================
const initialState: TaskState = {
  tasks: [],
  userTasks: [],
  loading: false,
  error: null,
  selectedDate: new Date().toISOString().split('T')[0],
  selectedCategory: 'all'
}

// =====================================================
// ACCIONES DEL REDUCER
// =====================================================
type TaskAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'SET_USER_TASKS'; payload: UserTask[] }
  | { type: 'ADD_USER_TASK'; payload: UserTask }
  | { type: 'UPDATE_USER_TASK'; payload: { id: string; updates: Partial<UserTask> } }
  | { type: 'DELETE_USER_TASK'; payload: string }
  | { type: 'SET_SELECTED_DATE'; payload: string }
  | { type: 'SET_SELECTED_CATEGORY'; payload: TaskCategory | 'all' }

// =====================================================
// REDUCER
// =====================================================
const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'SET_TASKS':
      return { ...state, tasks: action.payload }
    
    case 'SET_USER_TASKS':
      return { ...state, userTasks: action.payload }
    
    case 'ADD_USER_TASK':
      return { ...state, userTasks: [...state.userTasks, action.payload] }
    
    case 'UPDATE_USER_TASK':
      return {
        ...state,
        userTasks: state.userTasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates }
            : task
        )
      }
    
    case 'DELETE_USER_TASK':
      return {
        ...state,
        userTasks: state.userTasks.filter(task => task.id !== action.payload)
      }
    
    case 'SET_SELECTED_DATE':
      return { ...state, selectedDate: action.payload }
    
    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload }
    
    default:
      return state
  }
}

// =====================================================
// CONTEXTO
// =====================================================
const TaskContext = createContext<TaskContextType | undefined>(undefined)

// =====================================================
// PROVIDER
// =====================================================
interface TaskProviderProps {
  children: ReactNode
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState)
  const { user } = useAuth()

  // =====================================================
  // INICIALIZACIÓN
  // =====================================================
  useEffect(() => {
    const initializeTasks = async () => {
      if (!user) return
      
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        await fetchTasks()
        await fetchUserTasks()
      } catch (error) {
        console.error('Error inicializando tareas:', error)
        dispatch({ type: 'SET_ERROR', payload: 'Error cargando tareas' })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    initializeTasks()
  }, [user])

  // =====================================================
  // MÉTODOS DEL CONTEXTO
  // =====================================================
  const fetchTasks = async () => {
    try {
      const response = await TaskService.getSystemTasks()
      
      if (response.success && response.data) {
        dispatch({ type: 'SET_TASKS', payload: response.data })
      } else {
        throw new Error(response.error || 'Error obteniendo tareas')
      }
    } catch (error) {
      console.error('Error obteniendo tareas:', error)
      throw error
    }
  }

  const fetchUserTasks = async (date?: string) => {
    if (!user) return
    
    try {
      const targetDate = date || state.selectedDate
      const response = await TaskService.getUserTasks(user.id, targetDate)
      
      if (response.success && response.data) {
        dispatch({ type: 'SET_USER_TASKS', payload: response.data })
      } else {
        throw new Error(response.error || 'Error obteniendo tareas del usuario')
      }
    } catch (error) {
      console.error('Error obteniendo tareas del usuario:', error)
      throw error
    }
  }

  const createUserTask = async (taskId: string, date: string) => {
    if (!user) throw new Error('Usuario no autenticado')
    
    try {
      const response = await TaskService.createUserTask(user.id, taskId, date)
      
      if (response.success && response.data) {
        dispatch({ type: 'ADD_USER_TASK', payload: response.data })
      } else {
        throw new Error(response.error || 'Error creando tarea del usuario')
      }
    } catch (error) {
      console.error('Error creando tarea del usuario:', error)
      throw error
    }
  }

  const updateUserTask = async (userTaskId: string, status: boolean) => {
    try {
      const response = await TaskService.updateUserTaskStatus(userTaskId, status)
      
      if (response.success && response.data) {
        dispatch({
          type: 'UPDATE_USER_TASK',
          payload: {
            id: userTaskId,
            updates: {
              status,
              completed_at: status ? new Date().toISOString() : null
            }
          }
        })
      } else {
        throw new Error(response.error || 'Error actualizando tarea del usuario')
      }
    } catch (error) {
      console.error('Error actualizando tarea del usuario:', error)
      throw error
    }
  }

  const deleteUserTask = async (userTaskId: string) => {
    try {
      const response = await TaskService.deleteUserTask(userTaskId)
      
      if (response.success) {
        dispatch({ type: 'DELETE_USER_TASK', payload: userTaskId })
      } else {
        throw new Error(response.error || 'Error eliminando tarea del usuario')
      }
    } catch (error) {
      console.error('Error eliminando tarea del usuario:', error)
      throw error
    }
  }

  const setSelectedDate = (date: string) => {
    dispatch({ type: 'SET_SELECTED_DATE', payload: date })
  }

  const setSelectedCategory = (category: TaskCategory | 'all') => {
    dispatch({ type: 'SET_SELECTED_CATEGORY', payload: category })
  }

  // =====================================================
  // MÉTODOS UTILITARIOS
  // =====================================================
  const getTasksByCategory = (category: TaskCategory): Task[] => {
    return state.tasks.filter(task => task.category === category)
  }

  const getCompletedTasks = (): UserTask[] => {
    return state.userTasks.filter(task => task.status)
  }

  const getPendingTasks = (): UserTask[] => {
    return state.userTasks.filter(task => !task.status)
  }

  const getCompletionRate = (): number => {
    if (state.userTasks.length === 0) return 0
    const completed = getCompletedTasks().length
    return Math.round((completed / state.userTasks.length) * 100)
  }

  // =====================================================
  // VALOR DEL CONTEXTO
  // =====================================================
  const contextValue: TaskContextType = {
    ...state,
    fetchTasks,
    fetchUserTasks,
    createUserTask,
    updateUserTask,
    deleteUserTask,
    setSelectedDate,
    setSelectedCategory,
    getTasksByCategory,
    getCompletedTasks,
    getPendingTasks,
    getCompletionRate
  }

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  )
}

// =====================================================
// HOOK PERSONALIZADO
// =====================================================
export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext)
  
  if (context === undefined) {
    throw new Error('useTasks debe ser usado dentro de un TaskProvider')
  }
  
  return context
} 