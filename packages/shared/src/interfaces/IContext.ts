// =====================================================
// INTERFACE SEGREGATION PRINCIPLE - CONTEXTS
// =====================================================

import { ReactNode } from 'react'
import { User, AuthState } from '../../shared/types'
import { Task, TaskState } from '../../shared/types'
import { Notification } from './INotificationService'

/**
 * Interfaz base para todos los contextos
 */
export interface IBaseContext<T> {
  state: T
  loading: boolean
  error: string | null
}

/**
 * Interfaz para el contexto de autenticación
 */
export interface IAuthContext extends IBaseContext<AuthState> {
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (updates: Partial<User>) => Promise<void>
  refreshUser: () => Promise<void>
}

/**
 * Interfaz para el contexto de tareas
 */
export interface ITaskContext extends IBaseContext<TaskState> {
  getTasks: () => Promise<void>
  createTask: (taskData: any) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleTaskStatus: (id: string) => Promise<void>
  clearCompletedTasks: () => Promise<void>
  reorderTasks: (taskIds: string[]) => Promise<void>
}

/**
 * Interfaz para el contexto de notificaciones
 */
export interface INotificationContext extends IBaseContext<{ notifications: Notification[] }> {
  showNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  hideNotification: (id: string) => void
  clearNotifications: () => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
}

/**
 * Interfaz para el contexto de tema
 */
export interface IThemeContext extends IBaseContext<{ theme: 'light' | 'dark' }> {
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void
  getTheme: () => 'light' | 'dark'
}

/**
 * Interfaz para providers de contexto
 */
export interface IContextProvider<T> {
  children: ReactNode
  initialState?: Partial<T>
}

/**
 * Interfaz para hooks de contexto
 */
export interface IContextHook<T> {
  (): T
  displayName?: string
} 