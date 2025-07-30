// =====================================================
// INTERFACE SEGREGATION PRINCIPLE - TASK SERVICE
// =====================================================

import { Task, TaskFormData, TaskResponse } from '../../shared/types'

/**
 * Interfaz para operaciones básicas de tareas
 */
export interface ITaskService {
  getTasks(): Promise<Task[]>
  getTaskById(id: string): Promise<Task | null>
  createTask(taskData: TaskFormData): Promise<TaskResponse>
  updateTask(id: string, updates: Partial<Task>): Promise<TaskResponse>
  deleteTask(id: string): Promise<TaskResponse>
}

/**
 * Interfaz para operaciones de gestión de tareas
 */
export interface ITaskManager {
  markTaskComplete(id: string): Promise<TaskResponse>
  markTaskIncomplete(id: string): Promise<TaskResponse>
  toggleTaskStatus(id: string): Promise<TaskResponse>
  reorderTasks(taskIds: string[]): Promise<TaskResponse>
}

/**
 * Interfaz para operaciones de filtrado y búsqueda
 */
export interface ITaskFilter {
  getTasksByStatus(status: 'completed' | 'pending' | 'all'): Promise<Task[]>
  getTasksByCategory(category: string): Promise<Task[]>
  searchTasks(query: string): Promise<Task[]>
  getTasksByDateRange(startDate: Date, endDate: Date): Promise<Task[]>
}

/**
 * Interfaz para operaciones de estadísticas
 */
export interface ITaskAnalytics {
  getTaskStats(): Promise<{
    total: number
    completed: number
    pending: number
    completionRate: number
  }>
  getTasksByDay(days: number): Promise<{ date: string; count: number }[]>
  getMostActiveCategories(): Promise<{ category: string; count: number }[]>
}

/**
 * Interfaz para operaciones de persistencia de tareas
 */
export interface ITaskStorage {
  saveTasks(tasks: Task[]): void
  loadTasks(): Task[]
  clearTasks(): void
  exportTasks(): string
  importTasks(data: string): Task[]
} 