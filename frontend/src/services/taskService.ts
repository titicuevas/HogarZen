import { supabase } from '../config/supabase'
import { Task, UserTask, TaskCategory, ApiResponse } from '../types'

// =====================================================
// SERVICIO DE TAREAS - PRINCIPIOS SOLID Y DRY
// =====================================================

export class TaskService {
  // =====================================================
  // MÉTODOS PARA TAREAS DEL SISTEMA
  // =====================================================
  
  /**
   * Obtiene todas las tareas del sistema disponibles
   */
  static async getSystemTasks(): Promise<ApiResponse<Task[]>> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('category', { ascending: true })
        .order('title', { ascending: true })

      if (error) throw error

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener tareas'
      }
    }
  }

  /**
   * Obtiene tareas por categoría
   */
  static async getTasksByCategory(category: TaskCategory): Promise<ApiResponse<Task[]>> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('category', category)
        .order('title', { ascending: true })

      if (error) throw error

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener tareas por categoría'
      }
    }
  }

  // =====================================================
  // MÉTODOS PARA TAREAS DE USUARIO
  // =====================================================

  /**
   * Obtiene las tareas del usuario para una fecha específica
   */
  static async getUserTasks(userId: string, date: string): Promise<ApiResponse<UserTask[]>> {
    try {
      const { data, error } = await supabase
        .from('user_tasks')
        .select(`
          *,
          task:tasks(*)
        `)
        .eq('user_id', userId)
        .eq('date', date)
        .order('created_at', { ascending: true })

      if (error) throw error

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener tareas del usuario'
      }
    }
  }

  /**
   * Crea una nueva tarea para el usuario
   */
  static async createUserTask(userId: string, taskId: string, date: string): Promise<ApiResponse<UserTask>> {
    try {
      const { data, error } = await supabase
        .from('user_tasks')
        .insert({
          user_id: userId,
          task_id: taskId,
          date: date,
          status: false
        })
        .select(`
          *,
          task:tasks(*)
        `)
        .single()

      if (error) throw error

      return {
        success: true,
        data
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al crear tarea del usuario'
      }
    }
  }

  /**
   * Actualiza el estado de una tarea del usuario
   */
  static async updateUserTaskStatus(
    userTaskId: string, 
    status: boolean
  ): Promise<ApiResponse<UserTask>> {
    try {
      const updateData: Partial<UserTask> = {
        status,
        completed_at: status ? new Date().toISOString() : null
      }

      const { data, error } = await supabase
        .from('user_tasks')
        .update(updateData)
        .eq('id', userTaskId)
        .select(`
          *,
          task:tasks(*)
        `)
        .single()

      if (error) throw error

      return {
        success: true,
        data
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al actualizar estado de tarea'
      }
    }
  }

  /**
   * Elimina una tarea del usuario
   */
  static async deleteUserTask(userTaskId: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('user_tasks')
        .delete()
        .eq('id', userTaskId)

      if (error) throw error

      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al eliminar tarea'
      }
    }
  }

  // =====================================================
  // MÉTODOS DE UTILIDAD
  // =====================================================

  /**
   * Obtiene el resumen de tareas completadas para una fecha
   */
  static async getTasksSummary(userId: string, date: string): Promise<ApiResponse<{
    total: number
    completed: number
    pending: number
    percentage: number
  }>> {
    try {
      const { data, error } = await supabase
        .from('user_tasks')
        .select('status')
        .eq('user_id', userId)
        .eq('date', date)

      if (error) throw error

      const total = data?.length || 0
      const completed = data?.filter(task => task.status).length || 0
      const pending = total - completed
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

      return {
        success: true,
        data: {
          total,
          completed,
          pending,
          percentage
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener resumen de tareas'
      }
    }
  }

  /**
   * Verifica si una tarea ya existe para el usuario en una fecha
   */
  static async taskExistsForUser(
    userId: string, 
    taskId: string, 
    date: string
  ): Promise<ApiResponse<boolean>> {
    try {
      const { data, error } = await supabase
        .from('user_tasks')
        .select('id')
        .eq('user_id', userId)
        .eq('task_id', taskId)
        .eq('date', date)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      return {
        success: true,
        data: !!data
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al verificar existencia de tarea'
      }
    }
  }
} 